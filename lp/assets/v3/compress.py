from pathlib import Path
from PIL import Image

D = Path(r"C:/Users/ooxmi/Downloads/revirall-meta-ads-automation/lp/assets/v3")

TARGETS = {
    "feed_4x5_1080x1350.png":   (1080, 1350, 180),
    "fv_5x4_1500x1200.png":     (1500, 1200, 220),
    "square_1x1_1080x1080.png": (1080, 1080, 150),
    "story_9x16_1080x1920.png": (1080, 1920, 220),
}


def save_webp_jpeg(im: Image.Image, stem: Path, target_kb: int) -> None:
    for q in range(85, 45, -5):
        webp = stem.with_suffix(".webp")
        im.save(webp, "WEBP", quality=q, method=6)
        if webp.stat().st_size / 1024 <= target_kb:
            break
    for q in range(85, 45, -5):
        jpg = stem.with_suffix(".jpg")
        im.save(jpg, "JPEG", quality=q, optimize=True, progressive=True, subsampling=1)
        if jpg.stat().st_size / 1024 <= target_kb * 1.3:
            break
    print(
        f"{stem.name}: webp={webp.stat().st_size//1024}KB "
        f"jpg={jpg.stat().st_size//1024}KB"
    )


for fname, (w, h, kb) in TARGETS.items():
    src = D / fname
    im = Image.open(src).convert("RGB")
    if im.size != (w, h):
        im = im.resize((w, h), Image.LANCZOS)
    save_webp_jpeg(im, D / Path(fname).stem, kb)

print("\ndone.")
