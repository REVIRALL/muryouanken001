from pathlib import Path
from PIL import Image, ImageOps

BASE = Path(r"C:/Users/ooxmi/Downloads/revirall-meta-ads-automation/lp/assets")
SRC_BADGE = Path(r"C:/Users/ooxmi/Downloads/techstars-ai_newLP/public/sakamoto.jpg")   # 無地背景
SRC_PROFILE = Path(r"C:/Users/ooxmi/Downloads/kyashLP/assets/jun-portrait.jpg")          # オフィス背景


def square_crop_top(img: Image.Image) -> Image.Image:
    w, h = img.size
    side = min(w, h)
    # 顔が上半分に寄っているのでトップ基準で正方形クロップ
    left = (w - side) // 2
    top = max(0, int(h * 0.02))
    return img.crop((left, top, left + side, top + side))


def save_set(img: Image.Image, stem: str, size: int) -> None:
    out = img.resize((size, size), Image.LANCZOS)
    # WebP
    for q in range(88, 55, -4):
        wp = BASE / f"{stem}.webp"
        out.save(wp, "WEBP", quality=q, method=6)
        if wp.stat().st_size / 1024 <= (30 if size <= 160 else 60):
            break
    # JPEG fallback
    for q in range(92, 55, -4):
        jp = BASE / f"{stem}.jpg"
        out.save(jp, "JPEG", quality=q, optimize=True, progressive=True, subsampling=1)
        if jp.stat().st_size / 1024 <= (40 if size <= 160 else 90):
            break
    print(f"{stem}: {size}x{size}  webp={wp.stat().st_size//1024}KB  jpg={jp.stat().st_size//1024}KB")


badge = square_crop_top(Image.open(SRC_BADGE).convert("RGB"))
save_set(badge, "operator_badge", 256)

profile = square_crop_top(Image.open(SRC_PROFILE).convert("RGB"))
save_set(profile, "operator_profile", 480)
print("done.")
