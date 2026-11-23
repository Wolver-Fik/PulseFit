"""Genera los PNG de PulseFit con Pillow a partir del motivo de icons/icon.svg.

Uso:  python icons/generate_icons.py
Dibuja el pulso integrado en una barra/mancuerna con el degradiente
esmeralda -> lima (#10B981 -> #34D399) a 4x y lo reduce con LANCZOS.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

HERE = Path(__file__).resolve().parent
SCALE = 32  # 64 unidades de viewBox -> 2048 px de master
N = 64 * SCALE
BG = (14, 22, 20, 255)       # #0E1614
GREEN = (16, 185, 129, 255)  # #10B981
LIME = (52, 211, 153, 255)   # #34D399
PULSE = [(15, 34), (20, 34), (25, 24), (31, 46), (37, 18), (43, 37), (48, 30), (52, 34)]


def px(v):
    return int(round(v * SCALE))


def box(*values):
    return tuple(px(v) for v in values)


def gradient(c1, c2, diagonal=True):
    """Degradido lineal suave generado una vez y remuestreado."""
    n = 256
    data = bytearray()
    for y in range(n):
        for x in range(n):
            t = (x + y) / (2 * (n - 1)) if diagonal else x / (n - 1)
            data.append(int(t * 255 + 0.5))
    ramp = Image.frombytes("L", (n, n), bytes(data)).resize((N, N), Image.Resampling.BICUBIC)
    return Image.composite(Image.new("RGBA", (N, N), c2), Image.new("RGBA", (N, N), c1), ramp)


def apply(mask, c1, c2, opacity=1.0, diagonal=True):
    if opacity != 1.0:
        mask = mask.point(lambda v: int(v * opacity))
    layer = gradient(c1, c2, diagonal)
    layer.putalpha(mask)
    return layer


def stroke(draw, points, width, fill=255):
    xy = [(px(x), px(y)) for x, y in points]
    draw.line(xy, fill=fill, width=px(width), joint="curve")
    r = px(width) / 2
    for x, y in (points[0], points[-1]):
        draw.ellipse((px(x) - r, px(y) - r, px(x) + r, px(y) + r), fill=fill)


def artwork():
    image = Image.new("RGBA", (N, N), BG)

    halo = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    hd = ImageDraw.Draw(halo)
    hd.ellipse(box(3, 5, 61, 63), fill=(*GREEN[:3], 56))
    image = Image.alpha_composite(image, halo.filter(ImageFilter.GaussianBlur(N * 0.06)))

    rim = Image.new("L", (N, N), 0)
    ImageDraw.Draw(rim).rounded_rectangle(box(0.5, 0.5, 63.5, 63.5), radius=px(13.5), outline=255, width=px(1))
    image = Image.alpha_composite(image, apply(rim, GREEN, LIME, 0.38))

    mask = Image.new("L", (N, N), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle(box(7, 24, 14, 44), radius=px(3.5), fill=255)
    d.rounded_rectangle(box(50, 24, 57, 44), radius=px(3.5), fill=255)
    stroke(d, [(14, 34), (50, 34)], 4)
    stroke(d, PULSE, 4.5)
    return Image.alpha_composite(image, apply(mask, GREEN, LIME))


def main():
    master = artwork()
    for size in (180, 192, 512):
        path = HERE / f"icon-{size}.png"
        master.resize((size, size), Image.Resampling.LANCZOS).save(path, "PNG", optimize=True)
        print(f"wrote {path.name} ({size}x{size})")


if __name__ == "__main__":
    main()
