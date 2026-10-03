"""Rebuild local, deterministic share cards; no external image/font requests."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
ROOT = Path(__file__).resolve().parents[1]
FONT = Path('/System/Library/Fonts/Supplemental')
def font(size, bold=False):
    return ImageFont.truetype(str(FONT / ('Arial Bold.ttf' if bold else 'Arial.ttf')), size)
def card(path, brand, title_lines, subtitle, dark=False):
    bg, fg, muted = ('#0b1718', '#f3f6ef', '#afc0b9') if dark else ('#f7f7f2', '#182e31', '#54686a')
    im=Image.new('RGB',(1200,630),bg); d=ImageDraw.Draw(im)
    d.text((66,68),brand,font=font(30,True),fill=fg)
    y=177
    for line in title_lines:
        d.text((66,y),line,font=font(69,True),fill=fg); y+=83
    d.text((69,482),subtitle,font=font(26),fill=muted)
    d.line((69,552,1131,552),fill=muted,width=1)
    d.text((69,572),'uubright.com'+('/mymedia' if 'MyMedia' in brand else ''),font=font(20),fill=muted)
    im.save(ROOT/path,optimize=True)
card('docs/assets/uubright-social.png','uuBright',['Engineering the systems','behind AI.'],'AI infrastructure · Usage systems · Technical education',True)
card('docs/mymedia/social.png','MyMedia Photos by uuBright',['Your photos. Your folders.','Your Mac.'],'Local-first photo utility for Mac · In testing')
