import base64
from pathlib import Path
from PIL import Image

OUT = Path(r"C:/Users/ooxmi/Downloads/revirall-meta-ads-automation/ads/creatives/shosentaku_v3")

TARGETS = [
    ("shosentaku_4x5_1080x1350.jpg", (1080, 1350), 150),
    ("shosentaku_1x1_1080x1080.jpg", (1080, 1080), 130),
    ("shosentaku_9x16_1080x1920.jpg", (1080, 1920), 160),
]

for name, size, target_kb in TARGETS:
    p = OUT / name
    im = Image.open(p).convert("RGB")
    for q in range(85, 40, -5):
        im.save(p, "JPEG", quality=q, optimize=True, progressive=True, subsampling=2)
        kb = p.stat().st_size / 1024
        if kb <= target_kb:
            break
    print(f"{name}: q={q} {kb:.0f}KB")
    b64 = base64.b64encode(p.read_bytes()).decode()
    (OUT / f"_b64_{name.split('_')[1]}.txt").write_text(b64)
    print(f"  base64 len: {len(b64)//1024}KB")
