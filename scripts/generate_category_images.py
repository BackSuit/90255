import os
import math
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_CATEGORY_DIR = os.path.join(BASE_DIR, "public", "category")

# Categories and their color themes (multiple gradient pairs per category)
CATEGORIES_THEMES = {
    "grocery": [
        {"name": "grocery-1.jpg", "c1": (16, 140, 90), "c2": (5, 50, 35), "title": "Fresh Market & Grocery", "accent": (52, 211, 153)},
        {"name": "grocery-2.jpg", "c1": (22, 101, 52), "c2": (15, 23, 42), "title": "Supermarket & Foods", "accent": (74, 222, 128)},
        {"name": "grocery-3.jpg", "c1": (217, 119, 6), "c2": (67, 20, 7), "title": "Farm Produce & Pantry", "accent": (251, 191, 36)},
        {"name": "grocery-4.jpg", "c1": (13, 148, 136), "c2": (19, 78, 74), "title": "Local Market & Deli", "accent": (45, 212, 191)},
        {"name": "grocery-5.jpg", "c1": (77, 124, 15), "c2": (26, 46, 5), "title": "Natural Foods & Bakery", "accent": (163, 230, 53)},
    ],
    "restaurants": [
        {"name": "restaurants-1.jpg", "c1": (225, 29, 72), "c2": (76, 5, 25), "title": "Dining & Restaurant", "accent": (251, 113, 133)},
        {"name": "restaurants-2.jpg", "c1": (234, 88, 12), "c2": (67, 20, 7), "title": "Café & Taquería", "accent": (251, 146, 60)},
        {"name": "restaurants-3.jpg", "c1": (180, 83, 9), "c2": (69, 26, 3), "title": "Bistro & Eatery", "accent": (245, 158, 11)},
        {"name": "restaurants-4.jpg", "c1": (159, 18, 57), "c2": (24, 24, 27), "title": "Bar & Grill", "accent": (244, 63, 94)},
        {"name": "restaurants-5.jpg", "c1": (202, 138, 4), "c2": (113, 63, 18), "title": "Bakery & Sweets", "accent": (250, 204, 21)},
    ],
    "retail": [
        {"name": "retail-1.jpg", "c1": (79, 70, 229), "c2": (30, 27, 75), "title": "Retail & Shopping", "accent": (129, 140, 248)},
        {"name": "retail-2.jpg", "c1": (147, 51, 234), "c2": (59, 7, 100), "title": "Boutique & Apparel", "accent": (192, 132, 252)},
        {"name": "retail-3.jpg", "c1": (219, 39, 119), "c2": (80, 7, 36), "title": "Goods & Accessories", "accent": (244, 114, 182)},
        {"name": "retail-4.jpg", "c1": (14, 116, 144), "c2": (12, 74, 96), "title": "Department Store", "accent": (56, 189, 248)},
    ],
    "auto-repair": [
        {"name": "auto-repair-1.jpg", "c1": (37, 99, 235), "c2": (15, 23, 42), "title": "Auto Repair & Service", "accent": (96, 165, 250)},
        {"name": "auto-repair-2.jpg", "c1": (71, 85, 105), "c2": (15, 23, 42), "title": "Mechanic & Diagnostics", "accent": (148, 163, 184)},
        {"name": "auto-repair-3.jpg", "c1": (194, 65, 12), "c2": (24, 24, 27), "title": "Tires, Brakes & Tune-Up", "accent": (251, 146, 60)},
    ],
    "beauty-barber": [
        {"name": "beauty-barber-1.jpg", "c1": (225, 29, 72), "c2": (131, 24, 67), "title": "Salon & Beauty", "accent": (251, 113, 133)},
        {"name": "beauty-barber-2.jpg", "c1": (162, 28, 175), "c2": (74, 4, 78), "title": "Barbershop & Styling", "accent": (232, 121, 249)},
        {"name": "beauty-barber-3.jpg", "c1": (180, 83, 9), "c2": (30, 27, 75), "title": "Spa & Grooming", "accent": (251, 191, 36)},
    ],
    "healthcare": [
        {"name": "healthcare-1.jpg", "c1": (13, 148, 136), "c2": (15, 23, 42), "title": "Medical & Healthcare", "accent": (45, 212, 191)},
        {"name": "healthcare-2.jpg", "c1": (2, 132, 199), "c2": (12, 74, 96), "title": "Dental & Care Center", "accent": (56, 189, 248)},
        {"name": "healthcare-3.jpg", "c1": (5, 150, 105), "c2": (4, 47, 46), "title": "Clinic & Wellness", "accent": (52, 211, 153)},
    ],
    "real-estate": [
        {"name": "real-estate-1.jpg", "c1": (30, 58, 138), "c2": (15, 23, 42), "title": "Real Estate & Properties", "accent": (96, 165, 250)},
        {"name": "real-estate-2.jpg", "c1": (67, 56, 202), "c2": (24, 24, 27), "title": "Residential & Commercial", "accent": (165, 180, 252)},
        {"name": "real-estate-3.jpg", "c1": (15, 118, 110), "c2": (19, 78, 74), "title": "Realty & Home Buying", "accent": (94, 234, 212)},
    ],
    "home-services": [
        {"name": "home-services-1.jpg", "c1": (180, 83, 9), "c2": (15, 23, 42), "title": "Home Services & Trades", "accent": (251, 191, 36)},
        {"name": "home-services-2.jpg", "c1": (217, 119, 6), "c2": (67, 20, 7), "title": "Plumbing, Electrical & HVAC", "accent": (253, 230, 138)},
        {"name": "home-services-3.jpg", "c1": (71, 85, 105), "c2": (24, 24, 27), "title": "Contractors & Remodeling", "accent": (203, 213, 225)},
    ],
    "legal": [
        {"name": "legal-1.jpg", "c1": (30, 41, 59), "c2": (15, 23, 42), "title": "Legal Services & Law", "accent": (148, 163, 184)},
        {"name": "legal-2.jpg", "c1": (71, 85, 105), "c2": (30, 41, 59), "title": "Attorneys & Counseling", "accent": (226, 232, 240)},
        {"name": "legal-3.jpg", "c1": (88, 28, 135), "c2": (15, 23, 42), "title": "Legal Consultation", "accent": (192, 132, 252)},
    ],
    "professional-services": [
        {"name": "professional-services-1.jpg", "c1": (30, 58, 138), "c2": (15, 23, 42), "title": "Professional Services", "accent": (96, 165, 250)},
        {"name": "professional-services-2.jpg", "c1": (15, 118, 110), "c2": (24, 24, 27), "title": "Tax, Accounting & Finance", "accent": (45, 212, 191)},
        {"name": "professional-services-3.jpg", "c1": (79, 70, 229), "c2": (30, 27, 75), "title": "Business Consulting & Agency", "accent": (165, 180, 252)},
    ],
    "fitness": [
        {"name": "fitness-1.jpg", "c1": (234, 88, 12), "c2": (15, 23, 42), "title": "Fitness & Training", "accent": (251, 146, 60)},
        {"name": "fitness-2.jpg", "c1": (225, 29, 72), "c2": (24, 24, 27), "title": "Gym & Athletics", "accent": (251, 113, 133)},
        {"name": "fitness-3.jpg", "c1": (79, 70, 229), "c2": (30, 41, 59), "title": "Wellness & Health Club", "accent": (129, 140, 248)},
    ],
    "education": [
        {"name": "education-1.jpg", "c1": (37, 99, 235), "c2": (30, 27, 75), "title": "Education & Learning", "accent": (96, 165, 250)},
        {"name": "education-2.jpg", "c1": (13, 148, 136), "c2": (15, 23, 42), "title": "Academy & Tutoring", "accent": (45, 212, 191)},
        {"name": "education-3.jpg", "c1": (124, 58, 237), "c2": (24, 24, 27), "title": "Schools & Instruction", "accent": (196, 181, 253)},
    ],
    "automotive": [
        {"name": "automotive-1.jpg", "c1": (39, 39, 42), "c2": (9, 9, 11), "title": "Automotive & Dealership", "accent": (161, 161, 170)},
        {"name": "automotive-2.jpg", "c1": (185, 28, 28), "c2": (15, 23, 42), "title": "Cars, Parts & Accessories", "accent": (248, 113, 113)},
        {"name": "automotive-3.jpg", "c1": (30, 58, 138), "c2": (24, 24, 27), "title": "Auto Services & Motors", "accent": (96, 165, 250)},
    ],
    "other": [
        {"name": "other-1.jpg", "c1": (51, 65, 85), "c2": (15, 23, 42), "title": "Local Business & Service", "accent": (148, 163, 184)},
        {"name": "other-2.jpg", "c1": (79, 70, 229), "c2": (15, 23, 42), "title": "Community Directory", "accent": (129, 140, 248)},
        {"name": "other-3.jpg", "c1": (13, 148, 136), "c2": (24, 24, 27), "title": "Services in 90255", "accent": (45, 212, 191)},
    ],
    "default": [
        {"name": "default-1.jpg", "c1": (30, 41, 59), "c2": (15, 23, 42), "title": "Huntington Park 90255", "accent": (56, 189, 248)},
        {"name": "default-2.jpg", "c1": (79, 70, 229), "c2": (15, 23, 42), "title": "Community Directory", "accent": (129, 140, 248)},
        {"name": "default-3.jpg", "c1": (15, 118, 110), "c2": (24, 24, 27), "title": "Local Businesses & Services", "accent": (45, 212, 191)},
    ],
}

def render_banner(width, height, c1, c2, title, accent, variant_idx):
    img = Image.new("RGB", (width, height))
    draw = ImageDraw.Draw(img)

    # 1. Multi-angle smooth gradient
    for y in range(height):
        ratio_y = y / height
        for x in range(0, width, 4):  # step 4 for fast smooth generation
            ratio_x = x / width
            # diagonal blend
            ratio = (ratio_y * 0.7 + ratio_x * 0.3)
            r = int(c1[0] * (1 - ratio) + c2[0] * ratio)
            g = int(c1[1] * (1 - ratio) + c2[1] * ratio)
            b = int(c1[2] * (1 - ratio) + c2[2] * ratio)
            draw.rectangle([x, y, x + 3, y], fill=(r, g, b))

    # 2. Modern subtle geometric accent motifs based on variant_idx
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)

    # Accent glow circles
    glow_color = (accent[0], accent[1], accent[2], 28)
    glow_color_faint = (accent[0], accent[1], accent[2], 14)

    if variant_idx % 3 == 0:
        # Radial circles in corner
        overlay_draw.ellipse([width - 400, -200, width + 400, 600], fill=glow_color)
        overlay_draw.ellipse([width - 300, -100, width + 300, 500], fill=glow_color_faint)
        # Subtle diagonal lines
        for i in range(0, width, 80):
            overlay_draw.line([(i, 0), (i + 400, height)], fill=(255, 255, 255, 8), width=2)
    elif variant_idx % 3 == 1:
        # Subtle wave / curved accents
        overlay_draw.ellipse([-200, height - 500, 600, height + 300], fill=glow_color)
        overlay_draw.ellipse([width - 500, 100, width + 300, 900], fill=glow_color_faint)
        # Horizontal micro grid
        for y in range(0, height, 40):
            overlay_draw.line([(0, y), (width, y)], fill=(255, 255, 255, 6), width=1)
    else:
        # Centered soft glow
        overlay_draw.ellipse([width // 2 - 400, height // 2 - 300, width // 2 + 400, height // 2 + 500], fill=glow_color)
        # Modern dots grid
        for gx in range(60, width - 60, 60):
            for gy in range(40, height - 40, 60):
                overlay_draw.ellipse([gx - 2, gy - 2, gx + 2, gy + 2], fill=(255, 255, 255, 12))

    # Bottom dark vignette gradient
    for y in range(height - 280, height):
        alpha = int(140 * ((y - (height - 280)) / 280))
        overlay_draw.line([(0, y), (width, y)], fill=(10, 15, 25, alpha))

    # Top border subtle line
    overlay_draw.line([(0, 0), (width, 0)], fill=(accent[0], accent[1], accent[2], 90), width=3)

    # 3. Category badge / watermark in lower left
    badge_x, badge_y = 60, height - 120
    # Badge pill
    overlay_draw.rounded_rectangle(
        [badge_x, badge_y, badge_x + 320, badge_y + 48],
        radius=24,
        fill=(15, 23, 42, 190),
        outline=(accent[0], accent[1], accent[2], 120),
        width=1
    )
    # Badge dot
    overlay_draw.ellipse([badge_x + 18, badge_y + 19, badge_x + 28, badge_y + 29], fill=accent)

    # Composite overlay onto base image
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    final_draw = ImageDraw.Draw(img)

    # Load default or fallback font
    try:
        font_badge = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20)
        font_sub = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 16)
        font_watermark = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 14)
    except Exception:
        font_badge = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_watermark = ImageFont.load_default()

    # Draw text
    final_draw.text((badge_x + 40, badge_y + 14), title[:26], fill=(248, 250, 252), font=font_badge)
    final_draw.text((badge_x + 6, height - 55), "Huntington Park • CA 90255", fill=(148, 163, 184), font=font_sub)
    final_draw.text((width - 150, height - 55), "90255.com", fill=(100, 116, 139), font=font_watermark)

    return img

def main():
    print(f"Generating category cover images in: {PUBLIC_CATEGORY_DIR}")
    os.makedirs(PUBLIC_CATEGORY_DIR, exist_ok=True)

    width, height = 1200, 800
    total = 0

    for cat_slug, items in CATEGORIES_THEMES.items():
        cat_folder = os.path.join(PUBLIC_CATEGORY_DIR, cat_slug)
        os.makedirs(cat_folder, exist_ok=True)
        print(f"Generating {len(items)} images for category '{cat_slug}'...")

        for idx, item in enumerate(items):
            filepath = os.path.join(cat_folder, item["name"])
            banner = render_banner(
                width=width,
                height=height,
                c1=item["c1"],
                c2=item["c2"],
                title=item["title"],
                accent=item["accent"],
                variant_idx=idx
            )
            banner.save(filepath, quality=94, optimize=True)
            total += 1

    print(f"\nSuccessfully generated {total} category cover images across {len(CATEGORIES_THEMES)} categories!")

if __name__ == "__main__":
    main()

