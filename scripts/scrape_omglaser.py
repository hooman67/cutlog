#!/usr/bin/env python3
"""
Scraper for omglaser.com/laser-settings/
Extracts laser parameter entries and outputs SQL INSERT statements for the CutLog database.

The page has 130+ entries organized as numbered sections with parameters in varied formats.
Three main sections: Fiber Laser, Galvo CO2 Laser, UV Laser Marker.

Note: The site uses WAF protection that blocks direct requests. The data was extracted
via browser-based fetching and is hardcoded here for reliable SQL generation.
"""

import re
import sys
from datetime import datetime

# Configuration
OUTPUT_SQL = "/mnt/localssd/laser_log/app/data/omglaser-scraped.sql"
TIMESTAMP = datetime.now().strftime("%Y-%m-%d %H:%M:%S")


# All entries extracted from omglaser.com/laser-settings/
# Format: (title, material, laser_type, wattage, speed_mm_s, power_pct, frequency, line_interval_mm, q_pulse, passes, dpi, notes)
RAW_ENTRIES = [
    # === FIBER LASER ENTRIES ===
    # Tumblers
    ("Tumblers Engraving 300mm lens | 30W Fiber", "Stainless Steel (Tumbler)", "Fiber", 30, 1000, 100, 30, 0.025, None, 2, None, "300x300mm lens, drop focus 4mm"),
    ("Tumblers Engraving 300mm lens Clean Pass | 30W Fiber", "Stainless Steel (Tumbler)", "Fiber", 30, 4500, 100, 80, 0.025, None, None, None, "Clean pass"),
    ("Tumblers Engraving 300mm lens | 50W Fiber", "Stainless Steel (Tumbler)", "Fiber", 50, 1000, 60, 50, 0.05, None, None, None, "300x300mm lens first pass"),
    ("Tumblers Engraving 300mm lens Pass 2 | 50W Fiber", "Stainless Steel (Tumbler)", "Fiber", 50, 3000, 60, 60, 0.05, None, None, None, "Second pass"),
    ("Tumblers Engraving 300mm lens | 60W Fiber", "Stainless Steel (Tumbler)", "Fiber", 60, 1000, 40, 200, None, 100, None, 508, "300x300mm lens, cylinder correction"),
    ("Blue Tumblers 300mm | 50W Fiber H1", "Stainless Steel (Tumbler)", "Fiber", 50, 600, 80, 65, 0.1, None, None, None, "50W Raycus, 300mm lens, blue tumbler"),
    ("Blue Tumblers 300mm | 50W Fiber H2", "Stainless Steel (Tumbler)", "Fiber", 50, 2000, 80, 60, 0.1, None, None, None, "Blue tumbler hatch 2"),
    ("Blue Tumblers 300mm | 50W Fiber H3", "Stainless Steel (Tumbler)", "Fiber", 50, 4000, 100, 50, 0.1, None, None, None, "Blue tumbler hatch 3"),
    ("Black JDS Tumblers 300mm Pass 1 | 50W Fiber", "Stainless Steel (Tumbler)", "Fiber", 50, 500, 55, 50, 0.03, None, None, None, "50W OMG fiber, 300mm lens, defocused 9mm"),
    ("Black JDS Tumblers 300mm Pass 2 | 50W Fiber", "Stainless Steel (Tumbler)", "Fiber", 50, 2000, 35, 30, 0.025, None, None, None, "Second pass"),
    ("Red Tumblers 300mm Fill1 | 60W Fiber", "Stainless Steel (Tumbler)", "Fiber", 60, 1000, 87, 150, 0.02, 200, 1, None, "OMG 60W MOPA, no rotary, cylinder correction"),
    ("Red Tumblers 300mm Fill2 | 60W Fiber", "Stainless Steel (Tumbler)", "Fiber", 60, 1000, 51, 150, 0.02, 200, 1, None, "Fill 2 at 0 degrees"),
    ("Tumblers Engraving 300mm | 80W Fiber", "Stainless Steel (Tumbler)", "Fiber", 80, 6000, 50, 50, 0.025, None, 2, None, "80W MOPA, bi-directional cross hatch, 45 deg"),
    # Black Annealing Stainless Tumblers
    ("Black Annealing Stainless Tumblers | 20W Fiber", "Stainless Steel (Tumbler)", "Fiber", 20, 200, 70, 40, 0.02, None, None, None, "20W 110mm lens, 5mm out of focus"),
    ("Black Annealing Stainless Tumblers Rotary | 50W Fiber", "Stainless Steel (Tumbler)", "Fiber", 50, 200, 23, 110, 0.002, None, None, None, "50W JPT, 150x150mm lens"),
    ("Black Annealing Stainless Tumblers 300mm | 60W Fiber", "Stainless Steel (Tumbler)", "Fiber", 60, 300, 23, 110, 0.002, 200, None, None, "OMG-X 60W, 300mm lens, in focus, 90 deg"),
    ("Tumblers Engraving Rotary | 50W Fiber", "Stainless Steel (Tumbler)", "Fiber", 50, 1000, 50, 80, 0.02, None, None, None, "50W JPT, 200x200mm lens, removal pass"),
    ("Tumblers Engraving Rotary Clean | 50W Fiber", "Stainless Steel (Tumbler)", "Fiber", 50, 6000, 40, 160, 0.0195, None, None, None, "Clean pass"),
    # Brass Coins
    ("Brass Challenge Coin | 30W Fiber", "Brass (Coin)", "Fiber", 30, 900, 100, 30, 0.05, None, None, None, "30W Raycus, rotate 22.5 degrees"),
    ("Brass Challenge Coin Pass 1 | 50W Fiber", "Brass (Coin)", "Fiber", 50, 500, 84, 50, 0.05, None, None, None, "50W, 150mm lens"),
    ("Brass Challenge Coin Pass 2 | 50W Fiber", "Brass (Coin)", "Fiber", 50, 2000, 15, 60, 0.05, None, None, None, "Clean pass"),
    ("Brass Challenge Coin | 60W Fiber", "Brass (Coin)", "Fiber", 60, 2000, 90, 50, 0.02, 200, None, None, "60W, 150mm lens"),
    ("Brass Coin Image | 60W Fiber Clean", "Brass (Coin)", "Fiber", 60, 2000, 30, 100, 0.023, 200, 1, None, "OMG JPT 60W MOPA, 150mm lens, clean pass"),
    ("Brass Coin Image | 60W Fiber Engrave", "Brass (Coin)", "Fiber", 60, 300, 35, 225, None, 20, 6, 635, "Image passes, Stucki dithering"),
    ("Brass Coin Deep Engrave | 60W Fiber", "Brass (Coin)", "Fiber", 60, 2000, 90, 105, 0.023, 100, 30, None, "Deep engrave, OMG JPT 60W MOPA"),
    ("Brass Coin Blacken | 60W Fiber", "Brass (Coin)", "Fiber", 60, 1000, 50, 120, 0.002, 100, None, None, "Blackening pass"),
    ("Brass Coin Deep | 60W Fiber (Deep+Clean)", "Brass (Coin)", "Fiber", 60, 2000, 90, 45, 0.023, 200, 30, None, "Deep engrave ~1mm"),
    ("Brass Coin Clean | 60W Fiber", "Brass (Coin)", "Fiber", 60, 3000, 20, 100, None, 200, 2, None, "Clean pass"),
    ("Brass Coin Blacken2 | 60W Fiber", "Brass (Coin)", "Fiber", 60, 1000, 50, 105, 0.002, 100, None, None, "Blacken pass"),
    ("Brass Challenge Coin | 100W Fiber", "Brass (Coin)", "Fiber", 100, 2000, 90, 75, 0.02, 200, None, None, "100W, 100mm lens"),
    ("Brass Coin 3D Slice | 20W Fiber", "Brass (Coin)", "Fiber", 20, 250, 95, 20, None, None, 1000, 508, "3D sliced"),
    ("Brass Coin 3D Slice | 30W JPT Fiber", "Brass (Coin)", "Fiber", 30, 900, 90, 40, 0.03, None, 512, None, "30W JPT, 70mm lens"),
    ("Brass Coin 3D Slice | 30W Raycus Fiber", "Brass (Coin)", "Fiber", 30, 2000, 90, 70, 0.012, None, 256, None, "30W Raycus, 70mm lens"),
    ("Brass Coin 3D Slice | 50W Fiber 70mm", "Brass (Coin)", "Fiber", 50, 1200, 80, 40, 0.025, None, 250, None, "50W, 70mm lens"),
    ("Brass Coin 3D Slice | 50W JPT Fiber 110mm", "Brass (Coin)", "Fiber", 50, 2500, 90, 100, 0.025, None, 512, None, "50W JPT, 110mm lens"),
    ("Brass Coin 3D Slice | 60W Fiber", "Brass (Coin)", "Fiber", 60, 2000, 90, 55, 0.02, 200, 200, None, "60W"),
    ("Brass Coin 3D Slice | 100W Fiber", "Brass (Coin)", "Fiber", 100, 3200, 95, 80, 0.025, 200, 512, None, "100W"),
    # Copper
    ("Copper Engraving | 50W Fiber", "Copper", "Fiber", 50, 1500, 100, 40, 0.025, None, None, None, "50W JPT, 70mm lens"),
    ("Copper Engraving | 60W Fiber", "Copper", "Fiber", 60, 2000, 95, 60, None, 200, 300, None, "57mm Beryllium copper"),
    ("Copper Cutting | 60W Fiber", "Copper", "Fiber", 60, 500, 90, 30, 0.02, 500, 240, None, "60W JPT M7, 112x112mm lens, 1.5mm offset"),
    # Delrin
    ("Delrin Engraving | 60W Fiber", "Delrin", "Fiber", 60, 1500, 10, 40, None, 200, None, None, "Fill cross hatch"),
    # 2.5D Engraving
    ("2.5D STL Aluminum | 50W Fiber", "Aluminum", "Fiber", 50, 1200, 100, 40, 0.01, None, 418, None, "Ezcad3, autorotate 13.7 deg"),
    ("2.5D STL | 80W Fiber", "Metal (2.5D)", "Fiber", 80, 1400, 65, 70, None, 200, 640, None, "80W MOPA, Ezcad3"),
    ("2.5D STL | 120W Fiber", "Metal (2.5D)", "Fiber", 120, 2500, 60, 75, 0.02, 200, None, None, "120W, Ezcad3"),
    # Photo Engraving on Aluminum Card
    ("Image on Aluminum Card | 30W Fiber", "Aluminum (Card)", "Fiber", 30, 5000, 10, 30, 0.02, None, None, None, "30W Raycus"),
    ("Image on Aluminum Card Alt | 30W Fiber", "Aluminum (Card)", "Fiber", 30, 1000, 25, 20, None, None, None, 508, "Alternative settings"),
    ("Photo on Aluminum Card | 50W Fiber 200mm", "Aluminum (Card)", "Fiber", 50, 2500, 25, 350, None, None, None, None, "50W, 200x200mm lens"),
    ("Photo on Aluminum Card | 50W Fiber 110mm", "Aluminum (Card)", "Fiber", 50, 1500, 40, 150, None, None, None, 423, "50W, 110x110mm lens"),
    ("Photo on Aluminum Card | 60W Fiber", "Aluminum (Card)", "Fiber", 60, 1100, 50, 110, None, 200, None, 508, "60W, 150mm lens"),
    ("Black Business Card | 60W Fiber", "Aluminum (Card)", "Fiber", 60, 1100, 20, 1000, None, 200, None, 508, "LightBurn Stucki"),
    ("Photo Aluminum Imagr | 60W Fiber", "Aluminum (Card)", "Fiber", 60, 500, 35, 48, None, 150, None, None, "Image-r processed"),
    ("Photo on Aluminum Card 300mm | 60W Fiber", "Aluminum (Card)", "Fiber", 60, 1000, 7, 175, None, 100, 2, 653, "300mm lens"),
    ("Photo on Aluminum Card | 80W Fiber", "Aluminum (Card)", "Fiber", 80, 6000, 15, 800, None, 70, None, None, "80W, 200mm lens"),
    ("Photo on Aluminum Card | 200W Fiber", "Aluminum (Card)", "Fiber", 200, 3000, 15, 45, None, None, None, 750, "200W, 175mm lens"),
    # Image on Stainless
    ("Image on Stainless Clean | 60W Fiber", "Stainless Steel", "Fiber", 60, 2000, 30, 100, None, 200, None, None, "Clean pass, OMG-X 150mm lens"),
    ("Image on Stainless | 60W Fiber", "Stainless Steel", "Fiber", 60, 600, 30, 650, None, 250, None, 635, "Image pass"),
    ("Photo on Stainless Clean | 60W Fiber", "Stainless Steel", "Fiber", 60, 2000, 30, 100, None, 200, None, None, "First clean pass"),
    ("Photo on Stainless | 60W Fiber", "Stainless Steel", "Fiber", 60, 100, 10, 53, None, 200, None, 1500, "Photo pass"),
    ("Photo on Stainless | 100W Fiber", "Stainless Steel", "Fiber", 100, 360, 65, 65, None, 100, None, None, "100W"),
    ("Image on Flasks | 60W Fiber", "Stainless Steel (Flask)", "Fiber", 60, 1000, 30, 100, None, 130, None, 423, "2mm higher focus, 45 deg"),
    # Black Annealing Stainless
    ("Black Annealing Stainless Defocus | 50W Fiber 200mm", "Stainless Steel", "Fiber", 50, 250, 60, 30, 0.02, None, None, None, "50W, 200x200mm lens, 1-3 passes"),
    ("Black Annealing Stainless Defocus | 50W JPT 150mm", "Stainless Steel", "Fiber", 50, 50, 35, 25, 0.02, None, None, None, "3mm defocus"),
    ("Black Annealing Stainless 300mm | 30W Fiber", "Stainless Steel", "Fiber", 30, 100, 25, 40, 0.0254, None, 2, None, "30W Raycus, 300x300mm lens, 90+0 deg"),
    ("Black Annealing Stainless 300mm | 50W Raycus", "Stainless Steel", "Fiber", 50, 500, 35, 50, 0.002, None, None, None, "50W Raycus, 300x300mm lens"),
    ("Black Annealing Stainless 300mm | 50W JPT", "Stainless Steel", "Fiber", 50, 100, 15, 40, 0.015, None, None, None, "50W JPT, 300x300mm lens"),
    ("Black Annealing Stainless 300mm | 60W Fiber", "Stainless Steel", "Fiber", 60, 1200, 40, 120, 0.001, 200, None, None, "60W MOPA, 300x300mm lens"),
    ("Black Annealing Stainless | 60W MOPA 150mm", "Stainless Steel", "Fiber", 60, 300, 33, 150, 0.003, 200, None, None, "150x150mm lens"),
    ("Black Annealing Stainless | 80W MOPA", "Stainless Steel", "Fiber", 80, 1500, 80, 50, 0.002, 200, 2, None, "45 angle, 5mm defocus"),
    # Engrave Photo on Stainless Steel
    ("Photo on Stainless White Layer | 30W Fiber", "Stainless Steel", "Fiber", 30, 3000, 30, 80, None, None, None, None, "White layer prep"),
    ("Photo on Stainless Photo Pass | 30W Fiber", "Stainless Steel", "Fiber", 30, 300, 22, 80, None, None, None, 508, "Photo pass"),
    ("Photo on Stainless White | 50W Raycus", "Stainless Steel", "Fiber", 50, 1000, 25, 40, 0.05, None, None, None, "White layer, 110x110mm"),
    ("Photo on Stainless Photo | 50W Raycus", "Stainless Steel", "Fiber", 50, 1000, 40, 25, None, None, None, 2000, "Photo pass"),
    ("Photo on Stainless | 50W JPT", "Stainless Steel", "Fiber", 50, 350, 35, 65, None, None, None, 635, "50W JPT"),
    ("Photo on Stainless Clean | 80W MOPA", "Stainless Steel", "Fiber", 80, 3000, 80, 1200, 0.03, 13, None, None, "Clean pass, 200x200mm, crosshatch 45 deg"),
    ("Photo on Stainless White | 80W MOPA", "Stainless Steel", "Fiber", 80, 2000, 30, 70, 0.05, 200, None, None, "White layer, 90 deg"),
    ("Photo on Stainless Photo | 80W MOPA", "Stainless Steel", "Fiber", 80, 250, 10, 60, 0.04, 200, None, None, "Photo pass, 0 deg"),
    # Black Engraving on Brass
    ("Black on Brass | 20W Fiber", "Brass", "Fiber", 20, 850, 85, 20, 0.001, None, None, None, "20W, 150mm lens"),
    ("Black on Brass | 50W JPT", "Brass", "Fiber", 50, 100, 65, 20, 0.002, None, None, None, "50W JPT"),
    ("Black on Brass Alt | 50W Fiber", "Brass", "Fiber", 50, 200, 40, 40, 0.008, None, None, None, "Alternative settings"),
    ("Black on Brass | 60W MOPA 150mm", "Brass", "Fiber", 60, 500, 60, 45, 0.002, 200, 1, None, "60W, 150mm lens"),
    ("Black on Brass | 60W MOPA 175mm", "Brass", "Fiber", 60, 750, 80, 40, 0.002, None, 3, None, "175mm lens, 0-45-90 degrees"),
    ("Black on Brass Alt | 60W MOPA", "Brass", "Fiber", 60, 600, 70, 45, 0.002, None, 3, None, "150mm lens, 0-45-90 degrees"),
    ("Deep on Brass | 60W MOPA", "Brass", "Fiber", 60, 2000, 90, 45, 0.025, 200, 10, None, "Deep engraving pass"),
    ("Deep Blacken Brass | 60W MOPA", "Brass", "Fiber", 60, 500, 40, 40, 0.02, 200, 5, None, "Blackening pass after deep"),
    # Black Engraving on Aluminum
    ("Black on Aluminum | 30W JPT", "Aluminum", "Fiber", 30, 1500, 90, 45, 0.002, None, None, None, "30W JPT, 110mm lens"),
    ("Black on Aluminum | 50W Fiber", "Aluminum", "Fiber", 50, 200, 40, 40, 0.008, None, None, None, "110mm lens"),
    ("Black on Anodized Aluminum | 60W MOPA", "Anodized Aluminum", "Fiber", 60, 300, 25, 200, 0.001, 10, None, None, "60W MOPA, 150x150mm lens"),
    # Titanium
    ("Black on Titanium | 60W Fiber", "Titanium", "Fiber", 60, 300, 15, 50, 0.003, None, None, None, "60W, 150x150mm lens"),
    # Firearms
    ("SIG Engraving | 30W Fiber", "Polymer (Firearm Frame)", "Fiber", 30, 700, 65, 40, 0.088, None, 3, None, "30W, 200mm lens, rotating 90 deg"),
    ("PMAG Engraving | 30W Fiber", "Polymer (PMAG)", "Fiber", 30, 5000, 22, 30, 0.04, None, 2, None, "30W, 300mm lens, 3 hatches bidirectional"),
    ("PMAG Engraving | 30W JPT", "Polymer (PMAG)", "Fiber", 30, 6000, 15, 50, 0.08, None, None, None, "2 hatches at +/-45 degrees"),
    ("PMAG Engraving | 50W JPT", "Polymer (PMAG)", "Fiber", 50, 7500, 12, 50, 0.08, None, None, None, "2 hatches at +/-45 degrees"),
    ("PMAG Engraving | 60W JPT MOPA", "Polymer (PMAG)", "Fiber", 60, 4000, 10, 45, 0.04, 200, None, None, "60W JPT, 150mm lens, 2 hatches +/-45 deg"),
    ("Glock Stippling | 50W Fiber", "Polymer (Firearm Frame)", "Fiber", 50, 4000, 50, 90, 0.025, None, 3, None, "Zigzag pattern, 29 deg rotation"),
    ("Glock Stippling | 50W JPT", "Polymer (Firearm Frame)", "Fiber", 50, 2500, 50, 190, 0.04, None, None, None, "OMG-X, 175mm lens, cross hatch autorotate"),
    ("Glock Engraving | 60W MOPA", "Polymer (Firearm Frame)", "Fiber", 60, 1500, 55, 100, 0.09, 200, 10, None, "150x150mm lens, 45 deg, 90 deg increment"),
    ("Glock Engraving Clean | 60W MOPA", "Polymer (Firearm Frame)", "Fiber", 60, 3000, 25, 300, None, None, None, None, "Clean pass"),
    ("SIG Stipple Frame | 50W Fiber", "Polymer (Firearm Frame)", "Fiber", 50, 2000, 60, 50, 0.045, None, None, None, "200mm lens"),
    # Slide Engraving
    ("Slide Cutting | 50W Fiber", "Steel (Firearm Slide)", "Fiber", 50, 100, 95, 40, 0.04, None, None, None, "100mm lens, zig zag hatch"),
    ("Slide Cutting Clean | 50W Fiber", "Steel (Firearm Slide)", "Fiber", 50, 2500, 95, 50, 0.025, None, None, None, "Clean pass"),
    ("Slide White Mark | 50W Fiber", "Steel (Firearm Slide)", "Fiber", 50, 750, 15, 45, 0.02, None, None, None, "110mm lens JPT, white mark on Glock slide"),
    ("Slide Deep Engrave | 60W MOPA", "Steel (Firearm Slide)", "Fiber", 60, 950, 95, 48, 0.025, None, 100, None, "OMG-X, 150mm lens, 5 engrave+clean cycles"),
    ("Slide Deep Clean | 60W MOPA", "Steel (Firearm Slide)", "Fiber", 60, 2000, 20, 100, None, None, None, None, "Clean pass between deep cycles"),
    ("Slide Engraving | 120W Fiber", "Steel (Firearm Slide)", "Fiber", 120, 85, 65, 90, None, None, None, None, "120W M7"),
    # Wallets
    ("Black Aluminum Wallets | 60W MOPA", "Aluminum (Wallet)", "Fiber", 60, 300, 40, 400, None, 200, None, None, "Wallet engraving"),
    ("Photo on Wallets | 60W MOPA", "Aluminum (Wallet)", "Fiber", 60, 500, 60, 250, None, 250, None, None, "LightBurn pass through"),
    # Cards
    ("Blue Anodized Card | 50W Fiber", "Anodized Aluminum", "Fiber", 50, 1000, 25, 80, None, None, None, 508, "Imagr Kaisia"),
    # Stone
    ("Stone Engraving | 30W Fiber", "Stone", "Fiber", 30, 500, 90, 30, 0.04, None, 3, None, "30W Raycus, crosshatch"),
    ("Stone Engraving | 50W Fiber", "Stone", "Fiber", 50, 1000, 90, 40, 0.04, None, 3, None, "Crosshatch enabled"),
    ("Stone 2.5D | 60W MOPA", "Stone", "Fiber", 60, 2000, 90, 45, None, 200, 100, None, "OMG-X, 3D sliced"),
    ("Stone River | 60W MOPA", "Stone", "Fiber", 60, 2000, 90, 75, None, 200, 300, None, "River stone"),
    ("Stone Engraving | 80W Fiber", "Stone", "Fiber", 80, 2500, 90, 40, 0.04, 500, None, None, "100x100mm lens, crosshatch"),
    # Slate
    ("Slate Image | 30W Fiber", "Slate", "Fiber", 30, 500, 50, 100, None, 200, None, 508, "175mm lens"),
    ("Slate Engraving | 30W Fiber", "Slate", "Fiber", 30, 2500, 100, 30, 0.04, None, None, None, "150mm lens, interrupted hatch"),
    ("Slate 3D Slice | 30W Raycus", "Slate", "Fiber", 30, 2000, 90, 60, None, None, 150, 450, "30W Raycus"),
    ("Slate 3D Slice | 60W MOPA", "Slate", "Fiber", 60, 2000, 90, 50, None, 200, 200, None, "OMG-X 150mm lens"),
    ("Slate 3D Alt | 60W MOPA", "Slate", "Fiber", 60, 2000, 90, 105, None, 100, 75, None, "Alternative settings"),
    ("Slate Engraving | 50W Fiber", "Slate", "Fiber", 50, 1200, 60, 40, 0.025, 200, None, None, "Standard slate engraving"),
    ("Slate Photo 300mm | 60W Fiber", "Slate", "Fiber", 60, 100, 10, 45, None, 400, None, 508, "300x300mm lens"),
    ("Slate Photo 150mm | 60W Fiber", "Slate", "Fiber", 60, 400, 9.5, 125, None, 200, 1, 508, "Sanded with satin black coat"),
    # Ceramic
    ("Ceramic Engraving | 60W MOPA", "Ceramic", "Fiber", 60, 3000, 90, 40, None, 200, 256, None, "60W MOPA, 150x150mm lens"),
    # Metal Cutting
    ("Wobble Metal Cutting | 50W Fiber", "Metal (Thin Sheet)", "Fiber", 50, 50, 100, 50, None, None, 20, None, "Wobble 0.06mm dia, 0.03 distance"),
    ("Offset Metal Cutting | 50W Fiber", "Metal (Thin Sheet)", "Fiber", 50, 800, 95, 50, None, None, None, None, "0.15-0.25mm offset"),
    ("1mm Iron Cutting | 50W Fiber", "Iron", "Fiber", 50, 1500, 95, 40, None, None, None, None, "Wobble 0.6mm, 0.02 distance"),
    ("Aluminum Cutting 1.5mm Wobble | 120W Fiber", "Aluminum", "Fiber", 120, 2500, 75, 80, None, 500, None, None, "1.5mm, 70mm lens, wobble 0.15 dia"),
    ("Aluminum Cutting 1.5mm Non-Wobble | 120W Fiber", "Aluminum", "Fiber", 120, 2000, 40, 80, None, 500, None, None, "Non-wobble pass"),
    ("Brass Cutting 1.5mm Wobble | 120W Fiber", "Brass", "Fiber", 120, 2500, 75, 80, None, 500, None, None, "1.5mm, 70mm lens, wobble 0.15 dia"),
    ("Brass Cutting 1.5mm Non-Wobble | 120W Fiber", "Brass", "Fiber", 120, 2000, 40, 80, None, 500, None, None, "Non-wobble pass"),
    # Gold
    ("Gold Cutting | 50W Fiber", "Gold", "Fiber", 50, 800, 90, 50, None, None, None, None, "100mm lens, wobble 0.16mm"),
    ("18k Gold Cutting | 100W Fiber", "Gold (18k)", "Fiber", 100, 150, 35, 80, None, None, None, None, "Wobble 0.10 dia, 0.03 distance"),
    ("999 Gold Cutting | 100W Fiber", "Gold (999)", "Fiber", 100, 3000, 95, 75, None, 200, None, None, "Wobble 0.05 dia, 0.025 distance"),
    ("18k Gold Engraving | 50W Fiber", "Gold (18k)", "Fiber", 50, 500, 60, None, None, None, None, None, "0.12 drill"),
    # Silver
    ("Silver Cutting | 30W Fiber", "Silver", "Fiber", 30, 100, 95, 30, None, None, None, None, "100mm lens, wobble 0.5mm"),
    ("Silver Cutting | 50W Fiber", "Silver", "Fiber", 50, 20, 100, 50, None, None, 20, None, "Wobble 0.1 dia, 0.03 distance"),
    ("Silver Cutting 3mm | 60W Fiber", "Silver", "Fiber", 60, 500, 90, 30, 0.02, 500, None, None, "100x100mm lens, 3mm silver, 1.5-2mm offset"),
    ("Silver Cutting 1mm | 60W Fiber", "Silver", "Fiber", 60, 500, 90, 48, 0.025, 200, None, None, "200x200mm lens, wobble 0.05/0.1"),
    ("Silver Cutting Clean | 60W Fiber", "Silver", "Fiber", 60, 1500, 20, 20, 0.05, 200, None, None, "Clean pass"),
    ("Silver Cutting 1.5mm | 100W Fiber", "Silver", "Fiber", 100, 50, 100, 75, None, 200, None, None, "100x100mm lens, wobble 0.2mm, 0.03 distance"),
    # PCB
    ("PCB Soldermask Removal | 60W JPT", "PCB (Printed Circuit Board)", "Fiber", 60, 2000, 30, 200, 0.05, 200, 20, None, "112x112mm lens, soldermask removal"),
    ("PCB Cutting | 60W JPT", "PCB (Printed Circuit Board)", "Fiber", 60, 1000, 50, 30, None, 500, None, None, "Wobble 0.1x0.05, 500ms delay"),
    # ABS
    ("Gold ABS Engraving | 30W Fiber", "ABS (Gold)", "Fiber", 30, 1000, 50, 20, 0.05, None, None, None, "Gold ABS"),
    # Leatherette
    ("Leatherette Engraving | 50W Raycus", "Leatherette", "Fiber", 50, 1000, 15, 100, 0.025, None, 2, None, "200x200mm lens, 45/135 degrees"),
    ("Leatherette Engraving Alt | 50W Fiber", "Leatherette", "Fiber", 50, 1500, 30, 60, 0.07, None, None, None, "Alternative settings"),
    # Leather
    ("Leather Coaster Image | 50W JPT", "Leather", "Fiber", 50, 6000, 27, 30, None, None, None, 498, "110mm lens, Stucki dithering"),
    ("Leather Coaster Alt | 50W Fiber", "Leather", "Fiber", 50, 1000, 25, 60, None, None, 2, 362, "Alternative settings"),
    # Knife
    ("Knife Deep Engraving | 50W Fiber", "Steel (Knife)", "Fiber", 50, 600, 80, None, 0.03, None, None, None, "Deep engrave"),
    ("Knife Clean | 50W Fiber", "Steel (Knife)", "Fiber", 50, 1200, 40, 40, 0.05, None, None, None, "Clean pass"),
    # VISA Card
    ("VISA Card Pass 1 | 30W Fiber", "PVC (Card)", "Fiber", 30, 900, 55, 20, 0.25, None, None, None, "Pass 1"),
    ("VISA Card Clean | 30W Fiber", "PVC (Card)", "Fiber", 30, 700, 25, 45, 0.25, None, None, None, "Clean pass"),
    # Glass
    ("Glass with Aluminum Foil | 30W Fiber", "Glass", "Fiber", 30, 100, 90, 25, 0.04, None, None, None, "100x100mm lens, foil shiny-side-down"),

    # === GALVO CO2 LASER ENTRIES ===
    ("Leatherette Hat Patch | 30W CO2 Galvo", "Leatherette (Hat Patch)", "CO2 Galvo", 30, 2500, 30, 20, 0.04, None, None, None, "250mm lens"),
    ("Tumbler Engraving | 60W CO2 Galvo", "Stainless Steel (Tumbler)", "CO2 Galvo", 60, 1000, 55, None, None, None, 2, 635, "300x300mm lens, 2x 45 degree passes"),
    ("Tumbler Rotary | 60W CO2 Galvo", "Stainless Steel (Tumbler)", "CO2 Galvo", 60, 1000, 65, 25, 0.025, None, None, None, "Rotary setup"),
    ("Leather Engraving | 60W CO2 Galvo", "Leather", "CO2 Galvo", 60, 1000, 20, 20, 0.06, None, 1, None, "Fill, 1 pass"),
    ("Wood Engraving | 60W CO2 Galvo 500mm", "Wood", "CO2 Galvo", 60, 2500, 60, 8, 0.1, None, 1, None, "500mm lens"),
    ("Leather Cutting | 60W CO2 Galvo", "Leather", "CO2 Galvo", 60, 500, 60, 20, None, None, 11, None, "0.11mm kerf offset outward"),

    # === UV LASER MARKER ENTRIES ===
    ("Glass Engraving | 5W UV", "Glass", "UV", 5, 500, None, 50, None, 1, None, None, "100x100mm lens"),
    ("Plastic Engraving | 5W UV", "Plastic", "UV", 5, 800, None, 30, None, 8, None, None, ""),
    ("Plexiglass Engraving | 5W UV", "Plexiglass", "UV", 5, 100, None, 50, None, 7, None, 440, ""),
    ("Slate Engraving | 5W UV", "Slate", "UV", 5, 1200, None, 100, None, 2, None, 847, ""),
    ("Leather Engraving | 5W UV", "Leather", "UV", 5, 150, None, 120, None, 2, None, None, ""),
    ("Leatherette Engraving | 5W UV", "Leatherette", "UV", 5, 800, None, 42, None, 1, None, None, ""),
    ("Cardboard Engraving | 5W UV", "Cardboard", "UV", 5, 220, None, 80, None, 3, None, 400, ""),
    ("Wood Engraving | 5W UV", "Wood", "UV", 5, 100, None, 80, None, 7, None, 410, ""),
    ("Plywood Engraving | 5W UV", "Plywood", "UV", 5, 100, None, 50, None, 4, None, 420, "200x200mm lens"),
    ("Wood 2.5D | 5W UV", "Wood", "UV", 5, 800, None, 45, None, 1, 40, 850, "2.5D engraving"),
    ("Metal Engraving | 5W UV", "Metal", "UV", 5, 100, None, 80, None, 1, None, 635, ""),
    ("Anodized Business Card | 5W UV", "Anodized Aluminum", "UV", 5, 1200, None, 100, None, 2, None, 847, ""),
    ("Rubber Stamp | 5W UV", "Rubber", "UV", 5, 800, None, 45, 0.02, 1, None, None, ""),
    ("Glass | 10W UV", "Glass", "UV", 10, 300, None, 50, 0.05, 3, None, None, ""),
    ("Leather | 10W UV", "Leather", "UV", 10, 500, None, 40, 0.05, 6, None, None, ""),
    ("Leather Alt | 10W UV", "Leather", "UV", 10, 1000, None, 45, None, 2, None, None, "Alternative settings"),
    ("Leather Cutting | 10W UV", "Leather", "UV", 10, 50, None, 60, None, 1, None, None, "Cutting"),
    ("Paper Cutting | 10W UV", "Paper", "UV", 10, 200, None, 40, None, 1, None, None, "Cutting"),
    ("Aluminum Cards | 10W UV", "Aluminum (Card)", "UV", 10, 100, None, 80, 0.05, 10, None, None, "300x300mm lens"),
    ("Wood | 10W UV", "Wood", "UV", 10, 100, None, 80, None, 2, None, 450, "300x300mm lens"),
    ("Stone Marble | 10W UV", "Stone", "UV", 10, 300, None, 60, 0.05, 1, None, None, ""),
]


def format_sql_value(val):
    """Format a Python value for SQL INSERT."""
    if val is None:
        return "NULL"
    elif isinstance(val, bool):
        return "true" if val else "false"
    elif isinstance(val, str):
        # Escape single quotes
        return "'" + val.replace("'", "''") + "'"
    elif isinstance(val, (int, float)):
        return str(val)
    return "NULL"


def build_sql_row(entry):
    """Build a SQL INSERT statement from an entry tuple."""
    (title, material, laser_type, wattage, speed_mm_s, power_pct, frequency,
     line_interval_mm, q_pulse, passes, dpi, notes) = entry

    # Convert speed from mm/s to mm/min
    speed_mm_min = round(speed_mm_s * 60, 1) if speed_mm_s is not None else None

    # Build descriptive material name
    mat_name = f"{material} ({wattage}W {laser_type})" if wattage else f"{material} ({laser_type})"

    columns = [
        "material", "thickness_mm", "power_pct", "speed_mm_min",
        "gas_type", "gas_pressure_bar", "focus_position_mm",
        "nozzle_diameter_mm", "nozzle_distance_mm", "line_interval_mm",
        "quality_rating", "edge_quality", "source", "is_shared", "created_at"
    ]

    values = [
        format_sql_value(mat_name),          # material
        "NULL",                               # thickness_mm
        format_sql_value(power_pct),          # power_pct
        format_sql_value(speed_mm_min),       # speed_mm_min
        "NULL",                               # gas_type
        "NULL",                               # gas_pressure_bar
        "NULL",                               # focus_position_mm
        "NULL",                               # nozzle_diameter_mm
        "NULL",                               # nozzle_distance_mm
        format_sql_value(line_interval_mm),   # line_interval_mm
        "4",                                  # quality_rating
        "'clean'",                            # edge_quality
        "'scraped_public'",                   # source
        "true",                               # is_shared
        f"'{TIMESTAMP}'",                     # created_at
    ]

    col_str = ", ".join(columns)
    val_str = ", ".join(values)
    return f"INSERT INTO cuts ({col_str}) VALUES ({val_str});"


def main():
    print(f"Processing {len(RAW_ENTRIES)} entries from OMG Laser...")

    # Generate SQL statements
    statements = []
    materials_seen = set()
    laser_types_seen = set()

    for entry in RAW_ENTRIES:
        title, material, laser_type, wattage, speed_mm_s, power_pct = entry[:6]

        # Skip entries without useful speed or power data
        if speed_mm_s is None and power_pct is None:
            continue

        sql = build_sql_row(entry)
        statements.append(sql)
        materials_seen.add(material)
        laser_types_seen.add(laser_type)

    # Collect stats
    categories = sorted(materials_seen)
    laser_types = sorted(laser_types_seen)

    print(f"\nExtraction complete:")
    print(f"  Total SQL rows: {len(statements)}")
    print(f"  Unique materials: {len(materials_seen)}")
    print(f"  Materials: {categories}")
    print(f"  Laser types: {laser_types}")

    # Write SQL file
    header = f"""-- OMG Laser Settings - Scraped from omglaser.com/laser-settings/
-- Generated: {TIMESTAMP}
-- Source: https://omglaser.com/laser-settings/
--
-- Notes:
--   - Speed converted from mm/s (OMG Laser native) to mm/min (our schema)
--   - Power is percentage (0-100); UV laser entries have NULL power (uses current/Q-pulse instead)
--   - Covers fiber laser (JPT, Raycus, MOPA), Galvo CO2, and UV laser parameters
--   - Materials: metals (stainless, brass, aluminum, gold, silver, copper, titanium),
--     stone, slate, ceramic, glass, leather, wood, plastic, polymer, rubber, PVC, iron, PCB
--   - thickness_mm is NULL (fiber/UV laser engraving doesn't specify material thickness)
--   - quality_rating=4, edge_quality='clean' as defaults for published community settings
--   - line_interval_mm stores hatch/line spacing where available
--   - Total entries: {len(statements)}
--   - Material categories: {len(materials_seen)}
--   - Laser types: {', '.join(laser_types)}
--   - Categories: {', '.join(categories)}


"""

    with open(OUTPUT_SQL, "w") as f:
        f.write(header)
        for stmt in statements:
            f.write(stmt + "\n")

    print(f"\nWritten {len(statements)} SQL statements to {OUTPUT_SQL}")
    print(f"Done!")

    return {
        "total": len(statements),
        "materials": len(materials_seen),
        "categories": categories,
        "laser_types": laser_types,
    }


if __name__ == "__main__":
    main()
