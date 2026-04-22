from PIL import Image
from pathlib import Path

SRC = Path(r"C:/Users/ooxmi/Downloads/C_shosentaku_v3_pro4k_master.jpg")
OUT = Path(r"C:/Users/ooxmi/Downloads/revirall-meta-ads-automation/ads/creatives/shosentaku_v3")
OUT.mkdir(parents=True, exist_ok=True)

im = Image.open(SRC).convert("RGB")
W, H = im.size
print(f"source: {W}x{H}")

top_strip = im.crop((0, 0, W, 80))
pixels = list(top_strip.getdata())
avg = tuple(sum(c[i] for c in pixels) // len(pixels) for i in range(3))
print(f"detected bg color: {avg}")


def save_jpeg(img: Image.Image, path: Path, target_kb: int = 300) -> None:
    quality = 92
    while quality >= 55:
        img.save(path, "JPEG", quality=quality, optimize=True, progressive=True, subsampling=1)
        size_kb = path.stat().st_size / 1024
        if size_kb <= target_kb or quality == 55:
            print(f"  {path.name}: {img.size} q={quality} {size_kb:.0f}KB")
            return
        quality -= 5


def center_crop(img: Image.Image, target_ratio: float) -> Image.Image:
    w, h = img.size
    cur = w / h
    if abs(cur - target_ratio) < 1e-4:
        return img
    if cur > target_ratio:
        new_w = int(round(h * target_ratio))
        left = (w - new_w) // 2
        return img.crop((left, 0, left + new_w, h))
    new_h = int(round(w / target_ratio))
    top = (h - new_h) // 2
    return img.crop((0, top, w, top + new_h))


def pad_to_ratio(img: Image.Image, target_ratio: float, bg: tuple) -> Image.Image:
    w, h = img.size
    cur = w / h
    if abs(cur - target_ratio) < 1e-4:
        return img
    if cur > target_ratio:
        new_h = int(round(w / target_ratio))
        canvas = Image.new("RGB", (w, new_h), bg)
        canvas.paste(img, (0, (new_h - h) // 2))
        return canvas
    new_w = int(round(h * target_ratio))
    canvas = Image.new("RGB", (new_w, h), bg)
    canvas.paste(img, ((new_w - w) // 2, 0))
    return canvas


# 4:5 Feed (1080x1350) — primary portrait, main placement
img_45 = center_crop(im, 4 / 5).resize((1080, 1350), Image.LANCZOS)
save_jpeg(img_45, OUT / "shosentaku_4x5_1080x1350.jpg")

# 1:1 Square (1080x1080) — pad sides with beige (preserves headline + subject)
img_11 = pad_to_ratio(im, 1.0, avg).resize((1080, 1080), Image.LANCZOS)
save_jpeg(img_11, OUT / "shosentaku_1x1_1080x1080.jpg")

# 9:16 Stories/Reels (1080x1920) — pad top/bottom with beige
img_916 = pad_to_ratio(im, 9 / 16, avg).resize((1080, 1920), Image.LANCZOS)
save_jpeg(img_916, OUT / "shosentaku_9x16_1080x1920.jpg")

print("done.")
