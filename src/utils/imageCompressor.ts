/**
 * Client-side image compressor utility.
 * Downscales images to max dimensions and converts to compressed JPEG/WebP data URL.
 * Prevents memory bloat and storage quota exceeded errors.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.78
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's not an image file or SVG, return standard data URL
    if (!file.type.startsWith('image/') || file.type.includes('svg')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserving dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        // Draw image smoothed
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compact JPEG data URL
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      img.onerror = () => {
        // Fallback to raw data URL if image failed to decode
        resolve(readerEvent.target?.result as string);
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
