import React, { useRef, useEffect, useState } from 'react';
import { PixelData } from '../utils/imageProcessing';
import { BeadColor } from '../utils/colors';

export interface Pattern {
  id: string;
  imageUrl: string;
  gridSize: number;
  pixels: PixelData[];
  x: number;
  y: number;
  contrast: number;
  saturation: number;
}

interface MasterPixelGridProps {
  patterns: Pattern[];
  overrides: Record<string, BeadColor>;
  masterSize: number;
  showSymbols: boolean;
  selectedColor: BeadColor | null;
  selectedPatternId: string | null;
  onPixelClick: (x: number, y: number) => void;
  onPatternMove: (id: string, x: number, y: number) => void;
  onPatternSelect: (id: string | null) => void;
}

export const MasterPixelGrid = React.memo(function MasterPixelGrid({ patterns, overrides, masterSize, showSymbols, selectedColor, selectedPatternId, onPixelClick, onPatternMove, onPatternSelect }: MasterPixelGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragState, setDragState] = useState<{id: string, startX: number, startY: number, initialX: number, initialY: number} | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = 20;
    const padding = 1;
    const beadRadius = (cellSize - padding * 2) / 2;

    canvas.width = masterSize * cellSize;
    canvas.height = masterSize * cellSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw 29x29 board boundaries
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    for (let i = 0; i <= masterSize; i += 29) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Flatten grid to handle overlaps and overrides
    const masterGrid = new Map<string, BeadColor>();

    patterns.forEach(p => {
      p.pixels.forEach(px => {
        const mx = px.x + p.x;
        const my = px.y + p.y;
        if (mx >= 0 && mx < masterSize && my >= 0 && my < masterSize) {
          masterGrid.set(`${mx},${my}`, px.color);
        }
      });
    });

    Object.entries(overrides).forEach(([key, color]) => {
      masterGrid.set(key, color);
    });

    masterGrid.forEach((color, key) => {
      const [x, y] = key.split(',').map(Number);
      const cx = x * cellSize + cellSize / 2;
      const cy = y * cellSize + cellSize / 2;

      ctx.beginPath();
      ctx.arc(cx, cy, beadRadius, 0, Math.PI * 2);
      ctx.fillStyle = color.hex;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, beadRadius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.5;
      ctx.fill();
      ctx.globalAlpha = 1.0;

      ctx.beginPath();
      ctx.arc(cx, cy, beadRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      if (showSymbols) {
        ctx.fillStyle = getContrastYIQ(color.hex) === 'black' ? '#000000' : '#ffffff';
        ctx.font = `bold ${cellSize * 0.4}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(color.symbol, cx, cy);
      }
    });

    // Draw selection bounding box
    if (selectedPatternId) {
      const p = patterns.find(x => x.id === selectedPatternId);
      if (p) {
        ctx.strokeStyle = '#4f46e5'; // indigo-600
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(p.x * cellSize, p.y * cellSize, p.gridSize * cellSize, p.gridSize * cellSize);
        ctx.setLineDash([]);
      }
    }
  }, [patterns, overrides, masterSize, showSymbols, selectedPatternId]);

  function getContrastYIQ(hexcolor: string){
    hexcolor = hexcolor.replace("#", "");
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

  const getGridCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    const cellSize = canvas.width / masterSize;
    return { gridX: Math.floor(x / cellSize), gridY: Math.floor(y / cellSize) };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getGridCoords(e);
    if (!coords) return;
    const { gridX, gridY } = coords;

    if (selectedColor) {
      onPixelClick(gridX, gridY);
      return;
    }

    let found = false;
    // Find clicked pattern (top-most first)
    for (let i = patterns.length - 1; i >= 0; i--) {
      const p = patterns[i];
      if (gridX >= p.x && gridX < p.x + p.gridSize && gridY >= p.y && gridY < p.y + p.gridSize) {
        setDragState({
          id: p.id,
          startX: gridX,
          startY: gridY,
          initialX: p.x,
          initialY: p.y
        });
        onPatternSelect(p.id);
        found = true;
        break;
      }
    }
    
    if (!found) {
      onPatternSelect(null);
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragState) return;
    const coords = getGridCoords(e);
    if (!coords) return;
    const { gridX, gridY } = coords;

    const dx = gridX - dragState.startX;
    const dy = gridY - dragState.startY;
    onPatternMove(dragState.id, dragState.initialX + dx, dragState.initialY + dy);
  };

  const handlePointerUp = () => {
    setDragState(null);
  };

  return (
    <div className="w-full overflow-auto flex justify-center items-center bg-slate-100 rounded-2xl p-4 border border-slate-200 min-h-[400px]">
      <canvas
        ref={canvasRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        className={`max-w-full h-auto shadow-sm bg-white ${selectedColor ? 'cursor-crosshair' : dragState ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ 
          imageRendering: 'pixelated',
          width: '100%',
          maxWidth: `${masterSize * 20}px`
        }}
      />
    </div>
  );
});
