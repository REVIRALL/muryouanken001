"""Generate 4 ad/LP creative variants via Gemini image API directly.

No MCP dependency - uses google-generativeai SDK with fresh key.
"""

from __future__ import annotations

import base64
import json
import os
import sys
import urllib.request
from pathlib import Path

API_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_AI_API_KEY", "")
if not API_KEY:
    raise SystemExit("Set GEMINI_API_KEY or GOOGLE_AI_API_KEY environment variable")
SRC = Path(r"C:/Users/ooxmi/Downloads/C_shosentaku_v3_pro4k_master.jpg")
OUT_DIR = Path(r"C:/Users/ooxmi/Downloads/revirall-meta-ads-automation/lp/assets/v3")
OUT_DIR.mkdir(parents=True, exist_ok=True)

MODELS = [
    "gemini-3-pro-image-preview",
    "gemini-3.1-flash-image-preview",
    "gemini-2.5-flash-image",
]

COMMON = (
    "Preserve exactly: the soft natural window light from the left, the warm "
    "cream/beige/off-white palette (base tone around #C3AC90), 35mm film subtle "
    "grain, calm contemplative non-salesy mood. Subject: Japanese woman in her "
    "30s, shoulder-length brown hair, cream cardigan over white tee, holding "
    "stoneware coffee mug, laptop open, gaze toward the window with soft "
    "closed-lip smile. Scene props: wooden desk, eucalyptus sprig in stoneware "
    "vase, monstera and pothos plants, linen curtain. Background softly out of "
    "focus. Remove ALL on-image Japanese text and the rounded LINE badge. "
    "Strictly NO text, NO logos, NO watermarks, NO badges anywhere. "
    "Photo-realistic output."
)

TASKS = {
    "feed_4x5_1080x1350.png": (
        "Reframe the reference image to a 4:5 portrait canvas (1080x1350px). "
        "Place the subject center-right. Reserve the top 40% as clean negative "
        "space (warm beige wall + sheer linen curtain) for future HTML text "
        "overlay. " + COMMON
    ),
    "fv_5x4_1500x1200.png": (
        "Recompose the reference image to a 5:4 landscape canvas (1500x1200px). "
        "Place the subject on the right one-third of the frame. Keep the "
        "top-left two-thirds as clean negative space (warm beige wall softly "
        "lit from the left). This empty area is reserved for HTML headline "
        "and sub-text overlay. " + COMMON
    ),
    "square_1x1_1080x1080.png": (
        "Reframe the reference image to a 1:1 square canvas (1080x1080px). "
        "Since the original is portrait, outpaint the left side with matching "
        "warm beige wall and sheer linen curtain texture to make a true square. "
        "Subject stays center-left. Reserve the top 30% as clean negative "
        "space for text overlay. " + COMMON
    ),
    "story_9x16_1080x1920.png": (
        "Reframe the reference image to a 9:16 vertical canvas (1080x1920px). "
        "Outpaint the top with matching warm beige wall and the bottom with "
        "matching wooden desk/floor, preserving scene continuity. Subject stays "
        "vertically centered. Reserve the top 25% as negative space for "
        "headline overlay and the bottom 25% for CTA overlay. " + COMMON
    ),
}


def call_gemini(model: str, prompt: str, image_bytes: bytes) -> bytes | None:
    endpoint = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{model}:generateContent?key={API_KEY}"
    )
    b64 = base64.b64encode(image_bytes).decode()
    body = {
        "contents": [
            {
                "parts": [
                    {"text": prompt},
                    {"inline_data": {"mime_type": "image/jpeg", "data": b64}},
                ]
            }
        ],
        "generationConfig": {"response_modalities": ["IMAGE"]},
    }
    req = urllib.request.Request(
        endpoint,
        data=json.dumps(body).encode(),
        method="POST",
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            resp = json.loads(r.read())
    except urllib.error.HTTPError as e:
        err = e.read().decode()
        print(f"  [{model}] HTTP {e.code}: {err[:300]}", file=sys.stderr)
        return None
    except Exception as e:  # noqa: BLE001
        print(f"  [{model}] Exception: {e}", file=sys.stderr)
        return None

    parts = resp.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    for p in parts:
        data = p.get("inline_data") or p.get("inlineData")
        if data and data.get("data"):
            return base64.b64decode(data["data"])
    print(f"  [{model}] no image in response: {json.dumps(resp)[:300]}", file=sys.stderr)
    return None


def main() -> int:
    src_bytes = SRC.read_bytes()
    print(f"source: {SRC} ({len(src_bytes)//1024} KB)")

    results: dict[str, dict] = {}
    for fname, prompt in TASKS.items():
        print(f"\n>>> {fname}")
        out_path = OUT_DIR / fname
        if out_path.exists() and out_path.stat().st_size > 10_000:
            print(f"  SKIP (already exists, {out_path.stat().st_size // 1024} KB)")
            results[fname] = {"model": "cached", "bytes": out_path.stat().st_size}
            continue
        saved = None
        for model in MODELS:
            print(f"  trying {model}...")
            img = call_gemini(model, prompt, src_bytes)
            if img:
                out_path.write_bytes(img)
                saved = model
                print(f"  OK saved via {model} ({len(img)//1024} KB)")
                break
        results[fname] = {"model": saved, "bytes": out_path.stat().st_size if saved else 0}

    (OUT_DIR / "generation_summary.json").write_text(
        json.dumps(results, indent=2, ensure_ascii=False)
    )
    print("\nSUMMARY:")
    print(json.dumps(results, indent=2, ensure_ascii=False))
    return 0 if all(r["model"] for r in results.values()) else 1


if __name__ == "__main__":
    raise SystemExit(main())
