from pathlib import Path
from PIL import Image

SRC_DIR = Path(r"C:/Users/ooxmi/Downloads/revirall-meta-ads-automation/lp/assets/sections")
OUT_DIR = Path(r"C:/Users/ooxmi/Downloads/revirall-meta-ads-automation/lp/assets")

# target: (final WxH, webp target KB)
JOBS = {
    "voice_01.png":  ((512, 512),  40),
    "voice_02.png":  ((512, 512),  40),
    "voice_03.png":  ((512, 512),  40),
    "voice_04.png":  ((512, 512),  40),
    "empathy_scene.png":   ((1200, 960), 120),
    "step_01_line.png":    ((640, 640),  55),
    "step_02_note.png":    ((640, 640),  55),
    "step_03_laptop.png":  ((640, 640),  55),
    "compare_before_after.png": ((1280, 720), 110),
}


def save_pair(img: Image.Image, stem: str, target_kb: int) -> None:
    # WebP
    for q in range(88, 45, -4):
        wp = OUT_DIR / f"{stem}.webp"
        img.save(wp, "WEBP", quality=q, method=6)
        if wp.stat().st_size / 1024 <= target_kb:
            break
    # JPEG fallback
    for q in range(90, 45, -4):
        jp = OUT_DIR / f"{stem}.jpg"
        img.save(jp, "JPEG", quality=q, optimize=True, progressive=True, subsampling=1)
        if jp.stat().st_size / 1024 <= target_kb * 2:
            break
    print(f"  {stem}: webp={wp.stat().st_size//1024}KB jpg={jp.stat().st_size//1024}KB")


for src_name, (size, kb) in JOBS.items():
    p = SRC_DIR / src_name
    im = Image.open(p).convert("RGB")
    if im.size != size:
        im = im.resize(size, Image.LANCZOS)
    stem = src_name.rsplit(".", 1)[0]
    save_pair(im, stem, kb)

print("done.")
