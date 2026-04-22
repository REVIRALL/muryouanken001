"""Generate ad creative images via Gemini 3.1 Flash Image REST API.

Usage:
    python gen_image.py --prompt "..." --out path.jpg [--aspect 4:5]
"""
import argparse
import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request

DEFAULT_MODEL = "gemini-3.1-flash-image-preview"


def _endpoint(model: str) -> str:
    return f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"


def generate(prompt: str, out: str, aspect: str = "4:5", model: str = DEFAULT_MODEL, image_size: str = "2K") -> None:
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        sys.exit("ERROR: GEMINI_API_KEY or GOOGLE_API_KEY env var required")

    image_config = {"aspectRatio": aspect}
    if image_size:
        image_config["imageSize"] = image_size
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": image_config,
        },
    }
    data = None
    last_err = None
    for attempt in range(4):
        req = urllib.request.Request(
            f"{_endpoint(model)}?key={api_key}",
            data=json.dumps(body).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=180) as resp:
                data = json.load(resp)
            break
        except urllib.error.HTTPError as e:
            body_txt = e.read().decode("utf-8", errors="replace")[:400]
            last_err = f"HTTP {e.code}: {body_txt}"
            if e.code == 429:
                wait = 2 ** attempt * 5
                print(f"[retry {attempt+1}/4] 429 rate limited, waiting {wait}s", file=sys.stderr)
                time.sleep(wait)
                continue
            sys.exit(f"ERROR: {last_err}")
    if data is None:
        sys.exit(f"ERROR after retries: {last_err}")

    parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    for p in parts:
        inline = p.get("inlineData") or p.get("inline_data")
        if inline and inline.get("data"):
            with open(out, "wb") as f:
                f.write(base64.b64decode(inline["data"]))
            print(f"OK: wrote {out} ({os.path.getsize(out)} bytes)")
            return

    print("ERROR: no image in response", json.dumps(data, ensure_ascii=False)[:800])
    sys.exit(1)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--prompt", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--aspect", default="4:5")
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--size", default="2K", help="imageSize: 1K, 2K, or 4K")
    args = ap.parse_args()
    generate(args.prompt, args.out, args.aspect, args.model, args.size)
