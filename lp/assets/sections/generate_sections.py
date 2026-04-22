"""Generate 9 section images via Gemini direct API.

Warm editorial look matching hero_v3 (beige #FBF8F2, 4800K WB, 35mm softness).
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
    raise SystemExit("Set GEMINI_API_KEY env var")

OUT_DIR = Path(r"C:/Users/ooxmi/Downloads/revirall-meta-ads-automation/lp/assets/sections")
OUT_DIR.mkdir(parents=True, exist_ok=True)

MODELS = [
    "gemini-3-pro-image-preview",
    "gemini-3.1-flash-image-preview",
    "gemini-2.5-flash-image",
]

COMMON_LOOK = (
    "Warm editorial lifestyle photography look. Color temperature 4800K. "
    "Soft natural window light from upper-left at 45 degrees. "
    "Palette: warm cream beige #FBF8F2 base, #C3AC90 mid tones, "
    "subtle sage-green #9FB89A accents. 35mm film grain, shallow DOF, "
    "no neon colors, no stock-photo look, no harsh shadows, "
    "no text, no logos, no watermarks. Photo-realistic. "
    "Japanese context, minimal home-office or cafe setting."
)

TASKS = {
    # ---- Voice 4枚（30s女/40s男/30s女/40s男、同一照明・衣装色違い）----
    "voice_01.png": (
        "A Japanese woman in her early 30s, natural smile, shoulder-length brown hair, "
        "wearing a soft cream cardigan, head-and-shoulders portrait, shallow DOF, "
        "looking slightly off-camera, genuine warm expression. "
        + COMMON_LOOK +
        " 1:1 square, 85mm f/1.8, out-of-focus warm beige background."
    ),
    "voice_02.png": (
        "A Japanese man in his early 40s, short dark hair, gentle closed-lip smile, "
        "wearing a navy knit sweater over a white collar, head-and-shoulders portrait, "
        "slight beard stubble, warm confident expression. "
        + COMMON_LOOK +
        " 1:1 square, 85mm f/1.8, same lighting as voice_01."
    ),
    "voice_03.png": (
        "A Japanese woman in her mid-30s, shoulder-length wavy hair, subtle earrings, "
        "wearing a dusty-pink linen blouse, head-and-shoulders portrait, soft smile, "
        "looking directly at camera, approachable expression. "
        + COMMON_LOOK +
        " 1:1 square, 85mm f/1.8, same lighting as voice_01."
    ),
    "voice_04.png": (
        "A Japanese man in his mid-40s, slightly greying hair, wearing a charcoal "
        "cashmere cardigan over white tee, head-and-shoulders portrait, thoughtful "
        "closed-lip smile, dignified but approachable. "
        + COMMON_LOOK +
        " 1:1 square, 85mm f/1.8, same lighting as voice_01."
    ),
    # ---- 共感ブロック ----
    "empathy_scene.png": (
        "A Japanese woman in her mid-30s sitting on a fabric sofa in the evening, "
        "softly lit by a single paper-shaded lamp, looking at her smartphone with "
        "a subtly tired but thoughtful expression (not distressed). A small potted "
        "monstera on the side table, linen cushion behind her. "
        + COMMON_LOOK +
        " 5:4 landscape. Subject off-center left, right side warm negative space "
        "reserved for text overlay. Cinematic warm tone."
    ),
    # ---- 3 ステップ 手元クローズアップ ----
    "step_01_line.png": (
        "Close-up of a Japanese woman's hands holding a smartphone displaying a "
        "LINE-like green chat interface on a warm wooden desk, cream cardigan sleeve "
        "visible, soft window light from upper-left. "
        + COMMON_LOOK +
        " 1:1 square, 50mm f/2.0, tight crop on hands and phone, no face, "
        "consistent with hero_v3 desk and lighting."
    ),
    "step_02_note.png": (
        "Close-up of a Japanese woman's hand writing on a beige A5 notebook with a "
        "natural wooden pencil. The notebook is open on the same warm wooden desk, "
        "a small potted plant and ceramic coffee cup slightly out of focus in "
        "background. Cream cardigan sleeve visible. "
        + COMMON_LOOK +
        " 1:1 square, 50mm f/2.0, no face, same desk and window light as step_01."
    ),
    "step_03_laptop.png": (
        "Close-up of a Japanese woman's hand closing a silver MacBook-like laptop "
        "next to a white ceramic coffee cup and a small eucalyptus sprig. Same "
        "wooden desk, warm window light upper-left. "
        + COMMON_LOOK +
        " 1:1 square, 50mm f/2.0, no face, same desk as step_01 and step_02."
    ),
    # ---- 比較テーブル Before/After 2パネル ----
    "compare_before_after.png": (
        "A split-panel editorial illustration with soft texture grain. Left panel: "
        "a Japanese person in their 30s surrounded by stacked cardboard product "
        "boxes, slightly overwhelmed, desaturated warm tones. Right panel: the "
        "same person relaxed, holding only a smartphone, gentle smile, sage-green "
        "#9FB89A accent details. A thin vertical divider in #E8DFD2 separates the "
        "panels. Shared warm beige #FBF8F2 background band connects both. "
        + COMMON_LOOK +
        " 16:9 landscape, semi-flat editorial illustration style, 2px stroke "
        "consistency, flat shading, no text, no logos."
    ),
}


def call_gemini(model: str, prompt: str) -> bytes | None:
    endpoint = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{model}:generateContent?key={API_KEY}"
    )
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
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
        print(f"  [{model}] HTTP {e.code}: {e.read().decode()[:200]}", file=sys.stderr)
        return None
    except Exception as e:  # noqa: BLE001
        print(f"  [{model}] exc: {e}", file=sys.stderr)
        return None

    parts = resp.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    for p in parts:
        data = p.get("inline_data") or p.get("inlineData")
        if data and data.get("data"):
            return base64.b64decode(data["data"])
    reason = resp.get("candidates", [{}])[0].get("finishReason", "?")
    print(f"  [{model}] no image. reason={reason}", file=sys.stderr)
    return None


def main() -> int:
    results: dict[str, dict] = {}
    for fname, prompt in TASKS.items():
        out_path = OUT_DIR / fname
        if out_path.exists() and out_path.stat().st_size > 10_000:
            print(f">>> {fname}  SKIP (cached {out_path.stat().st_size // 1024}KB)")
            results[fname] = {"model": "cached", "bytes": out_path.stat().st_size}
            continue
        print(f">>> {fname}")
        saved = None
        for model in MODELS:
            print(f"  trying {model}...")
            img = call_gemini(model, prompt)
            if img:
                out_path.write_bytes(img)
                saved = model
                print(f"  OK {model} ({len(img)//1024}KB)")
                break
        results[fname] = {"model": saved, "bytes": out_path.stat().st_size if saved else 0}

    (OUT_DIR / "_summary.json").write_text(
        json.dumps(results, indent=2, ensure_ascii=False)
    )
    print("\nSUMMARY:")
    print(json.dumps(results, indent=2, ensure_ascii=False))
    return 0 if all(r["model"] for r in results.values()) else 1


if __name__ == "__main__":
    raise SystemExit(main())
