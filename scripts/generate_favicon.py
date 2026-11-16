import os
import math
from PIL import Image, ImageDraw

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_APP_DIR = os.path.join(BASE_DIR, "src", "app")
PUBLIC_DIR = os.path.join(BASE_DIR, "public")

# 1. Pure SVG Icon
SVG_CONTENT = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="7.5" fill="#006951" />
  <g transform="translate(7.35, 6.8) scale(0.72)" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </g>
</svg>
'''

def render_logo(size=512):
    # Supersampling 4x for ultra-sharp antialiasing
    scale = 4
    W = size * scale
    H = size * scale

    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    corner_radius = int(W * 0.23)
    bg_color = (0, 105, 81, 255) # primary #006951
    draw.rounded_rectangle([0, 0, W - 1, H - 1], radius=corner_radius, fill=bg_color)

    pin_h = W * 0.54
    cx = W / 2.0
    cy = (H / 2.0) - (pin_h * 0.05)
    s = pin_h / 20.0

    center_x = cx
    center_y = cy - (1.0 * s)
    head_radius = 8.0 * s
    tip_x = cx
    tip_y = cy + (9.8 * s)
    stroke_w = int(2.5 * s)

    dy = tip_y - center_y
    sin_theta = head_radius / dy
    cos_theta = math.sqrt(1 - sin_theta * sin_theta)

    tx_r = center_x + head_radius * cos_theta
    ty_r = center_y + head_radius * sin_theta
    tx_l = center_x - head_radius * cos_theta
    ty_l = center_y + head_radius * sin_theta

    start_angle = math.degrees(math.atan2(ty_r - center_y, tx_r - center_x))
    end_angle = math.degrees(math.atan2(ty_l - center_y, tx_l - center_x))

    white = (255, 255, 255, 255)
    bbox = [center_x - head_radius, center_y - head_radius, center_x + head_radius, center_y + head_radius]

    draw.arc(bbox, start=end_angle, end=360 + start_angle, fill=white, width=stroke_w)
    draw.line([(tx_r, ty_r), (tip_x, tip_y)], fill=white, width=stroke_w)
    draw.line([(tx_l, ty_l), (tip_x, tip_y)], fill=white, width=stroke_w)
    draw.ellipse([tip_x - stroke_w / 2, tip_y - stroke_w / 2, tip_x + stroke_w / 2, tip_y + stroke_w / 2], fill=white)

    inner_r = 3.0 * s
    inner_bbox = [center_x - inner_r, center_y - inner_r, center_x + inner_r, center_y + inner_r]
    draw.ellipse(inner_bbox, outline=white, width=stroke_w)

    return img.resize((size, size), Image.Resampling.LANCZOS)

def main():
    print("Generating tab favicon and brand logo icons...")

    # 1. Write SVG icons
    svg_paths = [
        os.path.join(SRC_APP_DIR, "icon.svg"),
        os.path.join(PUBLIC_DIR, "icon.svg"),
    ]
    for p in svg_paths:
        with open(p, "w", encoding="utf-8") as f:
            f.write(SVG_CONTENT)
        print(f"  Saved: {p}")

    # 2. Render master 512x512 PNG
    master = render_logo(512)

    # 3. Save apple-icon.png (180x180)
    apple_img = master.resize((180, 180), Image.Resampling.LANCZOS)
    apple_paths = [
        os.path.join(SRC_APP_DIR, "apple-icon.png"),
        os.path.join(PUBLIC_DIR, "apple-icon.png"),
    ]
    for p in apple_paths:
        apple_img.save(p, "PNG")
        print(f"  Saved: {p}")

    # 4. Save multi-resolution favicon.ico (16, 32, 48, 64)
    ico_paths = [
        os.path.join(SRC_APP_DIR, "favicon.ico"),
        os.path.join(PUBLIC_DIR, "favicon.ico"),
    ]
    for p in ico_paths:
        master.save(p, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
        print(f"  Saved: {p}")

    print("\nSuccessfully generated all tab icons!")

if __name__ == "__main__":
    main()

