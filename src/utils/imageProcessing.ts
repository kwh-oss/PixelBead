import { BeadColor, getClosestColor } from './colors';

export interface PixelData {
  x: number;
  y: number;
  color: BeadColor;
}

export async function processImage(
  imageUrl: string,
  gridSize: number,
  contrast: number,
  saturation: number
): Promise<PixelData[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // 1. Draw original image to apply contrast/saturation
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply CSS filters for contrast and saturation
      // contrast: -100 to 100 -> 0% to 200%
      // saturation: -100 to 100 -> 0% to 200%
      const contrastFilter = `contrast(${100 + contrast}%)`;
      const saturateFilter = `saturate(${100 + saturation}%)`;
      ctx.filter = `${contrastFilter} ${saturateFilter}`;
      
      ctx.drawImage(img, 0, 0);
      ctx.filter = 'none';

      // 2. Downsample using Nearest Neighbor
      const downsampleCanvas = document.createElement('canvas');
      downsampleCanvas.width = gridSize;
      downsampleCanvas.height = gridSize;
      const downsampleCtx = downsampleCanvas.getContext('2d', { willReadFrequently: true });
      if (!downsampleCtx) {
        reject(new Error('Could not get downsample canvas context'));
        return;
      }

      // Calculate crop to make it square (center crop)
      const size = Math.min(img.width, img.height);
      const startX = (img.width - size) / 2;
      const startY = (img.height - size) / 2;

      // Disable smoothing for nearest neighbor
      downsampleCtx.imageSmoothingEnabled = false;
      downsampleCtx.drawImage(
        canvas,
        startX, startY, size, size, // Source crop
        0, 0, gridSize, gridSize    // Destination
      );

      // 3. Read pixels and map to colors
      const imageData = downsampleCtx.getImageData(0, 0, gridSize, gridSize);
      const data = imageData.data;
      const pixels: PixelData[] = [];

      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          const index = (y * gridSize + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];

          // If pixel is mostly transparent, map to white or clear (let's use white for now)
          let closestColor: BeadColor;
          if (a < 128) {
             closestColor = getClosestColor(255, 255, 255);
          } else {
             closestColor = getClosestColor(r, g, b);
          }

          pixels.push({ x, y, color: closestColor });
        }
      }

      resolve(pixels);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}
