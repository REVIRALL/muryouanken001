import json
import sys
import urllib.request
import urllib.parse
import uuid
from pathlib import Path

import os as _os

TOKEN = _os.environ.get("META_ACCESS_TOKEN", "")
if not TOKEN:
    raise SystemExit("Set META_ACCESS_TOKEN environment variable")
ACCOUNT_ID = "act_1215978840164411"
API = "https://graph.facebook.com/v23.0"
OUT = Path(r"C:/Users/ooxmi/Downloads/revirall-meta-ads-automation/ads/creatives/shosentaku_v3")


def upload_image(path: Path) -> dict:
    boundary = uuid.uuid4().hex
    data = path.read_bytes()
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="filename"; filename="{path.name}"\r\n'
        f"Content-Type: image/jpeg\r\n\r\n"
    ).encode() + data + f"\r\n--{boundary}--\r\n".encode()
    url = f"{API}/{ACCOUNT_ID}/adimages?access_token={TOKEN}"
    req = urllib.request.Request(url, data=body, method="POST")
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        print("HTTP", e.code, e.read().decode(), file=sys.stderr)
        raise


results = {}
for fname in ["shosentaku_4x5_1080x1350.jpg", "shosentaku_1x1_1080x1080.jpg", "shosentaku_9x16_1080x1920.jpg"]:
    p = OUT / fname
    res = upload_image(p)
    print(fname, json.dumps(res, ensure_ascii=False))
    img_info = list(res.get("images", {}).values())[0] if res.get("images") else {}
    results[fname] = img_info

(OUT / "upload_results.json").write_text(json.dumps(results, indent=2, ensure_ascii=False))
print("\nSUMMARY:")
print(json.dumps(results, indent=2, ensure_ascii=False))
