import os
from PIL import Image, ImageDraw

def create_favicon():
    # 1. Load the original white logo
    logo_path = 'public/logo_blanco sin fondo.png'
    if not os.path.exists(logo_path):
        print(f"Error: {logo_path} does not exist.")
        return
        
    img = Image.open(logo_path)
    print(f"Loaded logo: size={img.size}, mode={img.mode}")
    
    # 2. Crop the white symbol (x=138 to 172, y=54 to 125)
    symbol = img.crop((138, 54, 172, 125))
    symbol_bbox = symbol.getbbox()
    print(f"Symbol bounding box: {symbol_bbox}")
    
    if symbol_bbox:
        symbol = symbol.crop(symbol_bbox)
    
    # 3. Create a high-res 256x256 base image for the favicon
    size = 256
    favicon = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(favicon)
    
    # Navbar green color: #16a34a -> (22, 163, 74, 255)
    green_color = (22, 163, 74, 255)
    
    # 4. Draw a perfect green circle in the center (larger diameter, less padding)
    padding = 4
    draw.ellipse([padding, padding, size - padding, size - padding], fill=green_color)
    
    # 5. Scale the symbol to fit nicely in the circle
    # Let's make the symbol larger: height = 150px (approx 60% of circle)
    symbol_w, symbol_h = symbol.size
    target_h = 150
    target_w = int(target_h * (symbol_w / symbol_h))
    print(f"Resizing symbol from {symbol.size} to {(target_w, target_h)}")
    
    # Resize symbol using Lanczos interpolation
    resized_symbol = symbol.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    # 6. Thicken the lines of the symbol (Dilation)
    # Since the image is white text on transparent background,
    # pasting shifted copies of the image makes the strokes thicker!
    stroke_delta = 2  # Thicken by 2 pixels in all directions
    thickened_w = target_w + 2 * stroke_delta
    thickened_h = target_h + 2 * stroke_delta
    thickened = Image.new('RGBA', (thickened_w, thickened_h), (0, 0, 0, 0))
    
    for dx in range(-stroke_delta, stroke_delta + 1):
        for dy in range(-stroke_delta, stroke_delta + 1):
            # Circular structuring element
            if dx*dx + dy*dy <= stroke_delta*stroke_delta:
                temp = Image.new('RGBA', (thickened_w, thickened_h), (0, 0, 0, 0))
                temp.paste(resized_symbol, (dx + stroke_delta, dy + stroke_delta))
                thickened = Image.alpha_composite(thickened, temp)
                
    # 7. Paste the thickened symbol into the center of the green circle
    x_offset = (size - thickened_w) // 2
    y_offset = (size - thickened_h) // 2
    
    favicon.paste(thickened, (x_offset, y_offset), thickened)
    
    # 8. Save as ICO with multiple resolutions
    output_path = 'src/app/favicon.ico'
    favicon.save(
        output_path,
        format='ICO',
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    )
    print(f"Successfully saved favicon to {output_path}")

if __name__ == '__main__':
    create_favicon()
