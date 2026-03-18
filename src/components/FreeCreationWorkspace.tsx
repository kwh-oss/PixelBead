import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MasterPixelGrid, Pattern } from './MasterPixelGrid';
import { BOMList } from './BOMList';
import { processImage, PixelData } from '../utils/imageProcessing';
import { BeadColor } from '../utils/colors';
import { Trash2, Download, Plus } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export function FreeCreationWorkspace({ onBack }: { onBack: () => void }) {
  const { t } = useLanguage();
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [overrides, setOverrides] = useState<Record<string, BeadColor>>({});
  const [masterSize, setMasterSize] = useState(87);
  const [selectedColor, setSelectedColor] = useState<BeadColor | null>(null);
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
  const [showSymbols, setShowSymbols] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const patternsRef = useRef(patterns);
  const processQueue = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    patternsRef.current = patterns;
  }, [patterns]);

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const url = event.target.result as string;
          const id = Math.random().toString(36).substring(7);
          const pixels = await processImage(url, 29, 0, 0);
          setPatterns(prev => [...prev, {
            id,
            imageUrl: url,
            gridSize: 29,
            pixels,
            x: 0,
            y: 0,
            contrast: 0,
            saturation: 0
          }]);
          setSelectedPatternId(id);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const updatePattern = (id: string, updates: Partial<Pattern>) => {
    setPatterns(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    
    // If size, contrast, or saturation changed, reprocess with debounce
    if (updates.gridSize !== undefined || updates.contrast !== undefined || updates.saturation !== undefined) {
      if (processQueue.current[id]) clearTimeout(processQueue.current[id]);
      
      processQueue.current[id] = setTimeout(async () => {
        const currentPattern = patternsRef.current.find(p => p.id === id);
        if (currentPattern) {
          const newPixels = await processImage(currentPattern.imageUrl, currentPattern.gridSize, currentPattern.contrast, currentPattern.saturation);
          setPatterns(prev => prev.map(p => p.id === id ? { ...p, pixels: newPixels } : p));
        }
      }, 300);
    }
  };

  const handlePatternMove = (id: string, x: number, y: number) => {
    setPatterns(prev => prev.map(p => p.id === id ? { ...p, x, y } : p));
  };

  const handlePixelClick = (x: number, y: number) => {
    if (!selectedColor) return;
    setOverrides(prev => ({ ...prev, [`${x},${y}`]: selectedColor }));
  };

  // Calculate combined pixels for BOM
  const combinedPixels = useMemo(() => {
    const masterGrid = new Map<string, PixelData>();
    patterns.forEach(p => {
      p.pixels.forEach(px => {
        const mx = px.x + p.x;
        const my = px.y + p.y;
        if (mx >= 0 && mx < masterSize && my >= 0 && my < masterSize) {
          masterGrid.set(`${mx},${my}`, { x: mx, y: my, color: px.color });
        }
      });
    });
    Object.entries(overrides).forEach(([key, color]) => {
      const [x, y] = key.split(',').map(Number);
      masterGrid.set(key, { x, y, color });
    });
    return Array.from(masterGrid.values());
  }, [patterns, overrides, masterSize]);

  const handleExport = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    // Calculate BOM
    const counts = new Map<string, { color: BeadColor; count: number }>();
    combinedPixels.forEach(p => {
      const existing = counts.get(p.color.id);
      if (existing) {
        existing.count++;
      } else {
        counts.set(p.color.id, { color: p.color, count: 1 });
      }
    });
    const bom = Array.from(counts.values()).sort((a, b) => b.count - a.count);

    const exportCanvas = document.createElement('canvas');
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    const bomWidth = 350;
    const padding = 30;
    const rowHeight = 35;
    const bomHeight = padding * 2 + 60 + bom.length * rowHeight;

    exportCanvas.width = canvas.width + bomWidth;
    exportCanvas.height = Math.max(canvas.height, bomHeight);

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Draw grid
    ctx.drawImage(canvas, 0, 0);

    // Draw BOM divider
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(canvas.width, exportCanvas.height);
    ctx.stroke();

    // Draw BOM
    const startX = canvas.width + padding;
    let currentY = padding + 20;

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(t('free.exportBOM'), startX, currentY);
    currentY += 40;

    ctx.font = '16px sans-serif';
    bom.forEach(({ color, count }) => {
      // Draw color circle
      ctx.beginPath();
      ctx.arc(startX + 12, currentY - 5, 12, 0, Math.PI * 2);
      ctx.fillStyle = color.hex;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw text
      ctx.fillStyle = '#334155';
      ctx.fillText(`${color.name} (${color.symbol})`, startX + 35, currentY);
      
      // Draw count right aligned
      ctx.textAlign = 'right';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(t('free.beads', { count }), startX + bomWidth - padding * 2, currentY);
      ctx.textAlign = 'left';
      ctx.font = '16px sans-serif';

      currentY += rowHeight;
    });

    const dataUrl = exportCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `pixelbead-free-creation.png`;
    link.href = dataUrl;
    link.click();
  };

  const selectedPattern = patterns.find(p => p.id === selectedPatternId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Patterns */}
      <div className="lg:col-span-3 space-y-6">
        <div className="glass-card rounded-3xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{t('free.layerList')}</h2>
            <button onClick={onBack} className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold bg-indigo-50 px-3 py-1.5 rounded-full transition-colors">{t('app.backHome')}</button>
          </div>
          
          <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
            {patterns.length === 0 && (
              <div className="text-xs text-slate-400 text-center py-6 bg-white/50 rounded-2xl border border-dashed border-slate-300">
                {t('free.noLayers')}
              </div>
            )}
            {patterns.map(p => (
              <div 
                key={p.id} 
                onClick={() => setSelectedPatternId(p.id)}
                className={`p-2.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedPatternId === p.id 
                    ? 'bg-indigo-50 border-indigo-300 shadow-sm' 
                    : 'bg-white/50 border-slate-200/60 hover:border-indigo-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img src={p.imageUrl} alt="thumbnail" className="w-8 h-8 object-cover rounded-lg border border-slate-200" />
                  <span className="text-xs font-medium text-slate-700">{t('free.layer', { id: p.id })}</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setPatterns(prev => prev.filter(x => x.id !== p.id));
                    if (selectedPatternId === p.id) setSelectedPatternId(null);
                  }} 
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <input type="file" ref={fileInputRef} onChange={handleAddImage} accept="image/*" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="w-full mt-4 flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 hover:from-indigo-100 hover:to-purple-100 px-4 py-3 rounded-2xl text-sm font-bold transition-colors border border-indigo-100">
            <Plus className="w-4 h-4" />
            <span>{t('free.addLayer')}</span>
          </button>
        </div>

        {selectedPattern && (
          <div className="glass-card rounded-3xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{t('free.layerSettings', { id: selectedPattern.id })}</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-600">{t('free.size')}</span>
                <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{selectedPattern.gridSize}</span>
              </div>
              <input type="range" min="10" max="116" value={selectedPattern.gridSize} onChange={(e) => updatePattern(selectedPattern.id, { gridSize: parseInt(e.target.value) })} className="w-full accent-indigo-600" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-600">{t('controls.contrast')}</span>
                <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{selectedPattern.contrast > 0 ? `+${selectedPattern.contrast}` : selectedPattern.contrast}</span>
              </div>
              <input type="range" min="-100" max="100" value={selectedPattern.contrast} onChange={(e) => updatePattern(selectedPattern.id, { contrast: parseInt(e.target.value) })} className="w-full accent-indigo-600" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-600">{t('controls.saturation')}</span>
                <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{selectedPattern.saturation > 0 ? `+${selectedPattern.saturation}` : selectedPattern.saturation}</span>
              </div>
              <input type="range" min="-100" max="100" value={selectedPattern.saturation} onChange={(e) => updatePattern(selectedPattern.id, { saturation: parseInt(e.target.value) })} className="w-full accent-indigo-600" />
            </div>
          </div>
        )}

        <div className="glass-card rounded-3xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{t('free.globalSettings')}</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-slate-600">{t('free.masterSize')}</span>
              <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{masterSize} x {masterSize}</span>
            </div>
            <select value={masterSize} onChange={(e) => setMasterSize(parseInt(e.target.value))} className="w-full text-sm border-slate-200 rounded-xl p-2.5 bg-white/50 focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value={58}>{t('free.template', { size: 58, count: 2 })}</option>
              <option value={87}>{t('free.template', { size: 87, count: 3 })}</option>
              <option value={116}>{t('free.template', { size: 116, count: 4 })}</option>
              <option value={145}>{t('free.template', { size: 145, count: 5 })}</option>
            </select>
          </div>
          <label className="flex items-center space-x-3 cursor-pointer pt-2 group">
            <input type="checkbox" checked={showSymbols} onChange={(e) => setShowSymbols(e.target.checked)} className="w-5 h-5 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500 transition-colors" />
            <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">{t('free.showSymbols')}</span>
          </label>
          <button onClick={handleExport} className="w-full mt-4 flex items-center justify-center space-x-2 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white px-4 py-3 rounded-2xl text-sm font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
            <Download className="w-4 h-4" />
            <span>{t('free.exportBtn')}</span>
          </button>
        </div>
      </div>

      {/* Center Column: Master Grid */}
      <div className="lg:col-span-6 flex flex-col">
        <div className="glass-card rounded-3xl p-6 flex-1 flex flex-col">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">{t('free.previewTitle')}</h2>
          <div className="flex-1 flex items-center justify-center">
            <MasterPixelGrid 
              patterns={patterns}
              overrides={overrides}
              masterSize={masterSize}
              showSymbols={showSymbols}
              selectedColor={selectedColor}
              selectedPatternId={selectedPatternId}
              onPixelClick={handlePixelClick}
              onPatternMove={handlePatternMove}
              onPatternSelect={setSelectedPatternId}
            />
          </div>
        </div>
      </div>

      {/* Right Column: BOM */}
      <div className="lg:col-span-3">
        <BOMList 
          pixels={combinedPixels}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
      </div>
    </div>
  );
}
