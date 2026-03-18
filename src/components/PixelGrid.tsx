import React, { useRef, useEffect } from 'react';
import { PixelData } from '../utils/imageProcessing';
import { BeadColor } from '../utils/colors';

interface PixelGridProps {
  pixels: PixelData[];
  gridSize: number;
  showSymbols: boolean;
  selectedColor: BeadColor | null;
  onPixelClick: (index: number) => void;
}

export const PixelGrid = React.memo(function PixelGrid({ pixels, gridSize, showSymbols, selectedColor, onPixelClick }: PixelGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || pixels.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate dynamic cell size based on container width
    // We'll use a fixed internal resolution and let CSS scale it, 
    // but drawing crisp circles requires a decent internal resolution.
    const cellSize = 20; 
    const padding = 1;
    const beadRadius = (cellSize - padding * 2) / 2;
    
    canvas.width = gridSize * cellSize;
    canvas.height = gridSize * cellSize;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background grid (optional, helps see clear beads)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    pixels.forEach((pixel) => {
      const cx = pixel.x * cellSize + cellSize / 2;
      const cy = pixel.y * cellSize + cellSize / 2;

      // Draw bead
      ctx.beginPath();
      ctx.arc(cx, cy, beadRadius, 0, Math.PI * 2);
      ctx.fillStyle = pixel.color.hex;
      ctx.fill();
      
      // Draw bead hole (makes it look like a Perler bead)
      ctx.beginPath();
      ctx.arc(cx, cy, beadRadius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.5;
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Draw outline
      ctx.beginPath();
      ctx.arc(cx, cy, beadRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw symbol if enabled
      if (showSymbols) {
        ctx.fillStyle = getContrastYIQ(pixel.color.hex) === 'black' ? '#000000' : '#ffffff';
        ctx.font = `bold ${cellSize * 0.4}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pixel.color.symbol, cx, cy);
      }
    });

  }, [pixels, gridSize, showSymbols]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedColor) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const cellSize = canvas.width / gridSize;
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);

    const index = gridY * gridSize + gridX;
    if (index >= 0 && index < pixels.length) {
      onPixelClick(index);
    }
  };

  // Helper to determine text color based on background
  function getContrastYIQ(hexcolor: string){
    hexcolor = hexcolor.replace("#", "");
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

  return (
    <div className="w-full overflow-auto flex justify-center items-center bg-slate-100 rounded-2xl p-4 border border-slate-200 min-h-[300px]">
      {pixels.length > 0 ? (
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className={`max-w-full h-auto shadow-sm bg-white ${selectedColor ? 'cursor-crosshair' : 'cursor-default'}`}
          style={{ 
            imageRendering: 'pixelated',
            width: '100%',
            maxWidth: `${gridSize * 20}px`
          }}
        />
      ) : (
        <div className="text-slate-400 text-sm">上传或生成图片以查看拼豆图纸</div>
      )}
    </div>
  );
});
