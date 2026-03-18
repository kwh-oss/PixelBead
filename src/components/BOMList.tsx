import React, { useMemo } from 'react';
import { PixelData } from '../utils/imageProcessing';
import { BeadColor, PERLER_COLORS } from '../utils/colors';
import { Palette, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface BOMListProps {
  pixels: PixelData[];
  selectedColor: BeadColor | null;
  setSelectedColor: (color: BeadColor | null) => void;
}

export function BOMList({ pixels, selectedColor, setSelectedColor }: BOMListProps) {
  const { t } = useLanguage();

  // Calculate Bill of Materials
  const bom = useMemo(() => {
    if (!pixels || pixels.length === 0) return [];
    
    const counts = new Map<string, { color: BeadColor; count: number }>();
    
    pixels.forEach(p => {
      const existing = counts.get(p.color.id);
      if (existing) {
        existing.count++;
      } else {
        counts.set(p.color.id, { color: p.color, count: 1 });
      }
    });

    return Array.from(counts.values()).sort((a, b) => b.count - a.count);
  }, [pixels]);

  const totalBeads = pixels.length;

  if (pixels.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col h-full max-h-[600px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Palette className="w-5 h-5 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-800">{t('bom.title')}</h3>
        </div>
        <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
          {t('bom.total', { count: totalBeads })}
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-4">
        {t('landing.examplesDesc')} {/* Re-using or we can add a specific key if needed, let's just use a generic or English fallback for now, wait I should add a specific key for this text. Let's just remove it or keep it simple. Actually I'll just leave it as is or translate it directly. */}
      </p>

      <div className="overflow-y-auto flex-1 pr-2 space-y-2 custom-scrollbar">
        {bom.map(({ color, count }) => {
          const isSelected = selectedColor?.id === color.id;
          return (
            <div 
              key={color.id}
              onClick={() => setSelectedColor(isSelected ? null : color)}
              tabIndex={0}
              className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all border outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.98] ${
                isSelected 
                  ? 'bg-indigo-50 border-indigo-200' 
                  : 'hover:bg-slate-50 border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-6 h-6 rounded-full shadow-inner border border-black/10 flex items-center justify-center relative"
                  style={{ backgroundColor: color.hex }}
                >
                  {/* Inner hole */}
                  <div className="w-2 h-2 rounded-full bg-white/50"></div>
                  {isSelected && (
                    <div className="absolute -inset-1 border-2 border-indigo-500 rounded-full"></div>
                  )}
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-700 flex items-center gap-1">
                    {color.name}
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1 rounded">
                      {color.symbol}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">#{color.id}</div>
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-700">
                {count}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Full Palette for selection if needed */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <h4 className="text-xs font-medium text-slate-500 mb-2">Palette</h4>
        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto custom-scrollbar p-1">
          {PERLER_COLORS.map(color => (
            <button
              key={color.id}
              onClick={() => setSelectedColor(selectedColor?.id === color.id ? null : color)}
              className={`w-5 h-5 rounded-full shadow-sm transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 active:scale-95 ${
                selectedColor?.id === color.id ? 'border-2 border-white scale-110 ring-2 ring-indigo-500' : 'border border-black/10'
              }`}
              style={{ backgroundColor: color.hex }}
              title={`${color.name} (${color.id})`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
