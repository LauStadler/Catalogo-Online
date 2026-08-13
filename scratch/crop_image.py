from PIL import Image

def crop_image(input_path, output_path, crop_height_ratio):
    with Image.open(input_path) as img:
        width, height = img.size
        # We keep the top part of the image, so y goes from 0 to height * crop_height_ratio
        new_height = int(height * crop_height_ratio)
        cropped_img = img.crop((0, 0, width, new_height))
        # Save the cropped image with high quality
        cropped_img.save(output_path, 'JPEG', quality=95)
        print(f"Original: {width}x{height}, Cropped: {width}x{new_height}")

if __name__ == "__main__":
    crop_image("public/fondo local_original.jpeg", "public/fondo local.jpeg", 0.85)
