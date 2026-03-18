import React from 'react';
import { Settings2, Download } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ControlsProps {
  gridSize: number;
  setGridSize: (size: number) => void;
  contrast: number;
  setContrast: (val: number) => void;
  saturation: number;
  setSaturation: (val: number) => void;
  showSymbols: boolean;
  setShowSymbols: (val: boolean) => void;
  onExport: () => void;
  hasImage: boolean;
}

export function Controls({
  gridSize, setGridSize,
  contrast, setContrast,
  saturation, setSaturation,
  showSymbols, setShowSymbols,
  onExport,
  hasImage
}: ControlsProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
        <Settings2 className="w-5 h-5 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-800">{t('app.step2')}</h3>
      </div>

      <div className="space-y-4">
        {/* Grid Size */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-xs font-medium text-slate-700">{t('controls.gridSize')}</label>
            <span className="text-xs text-slate-500">{gridSize} x {gridSize}</span>
          </div>
          <input
            type="range"
            min="14"
            max="116"
            step="1"
            value={gridSize}
            onChange={(e) => setGridSize(parseInt(e.target.value))}
            className="w-full accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 rounded-full"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>14 ({t('controls.small')})</span>
            <span>116 ({t('controls.large')})</span>
          </div>
        </div>

        {/* Contrast */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-xs font-medium text-slate-700">{t('controls.contrast')}</label>
            <span className="text-xs text-slate-500">{contrast > 0 ? `+${contrast}` : contrast}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={contrast}
            onChange={(e) => setContrast(parseInt(e.target.value))}
            className="w-full accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 rounded-full"
          />
        </div>

        {/* Saturation */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-xs font-medium text-slate-700">{t('controls.saturation')}</label>
            <span className="text-xs text-slate-500">{saturation > 0 ? `+${saturation}` : saturation}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={saturation}
            onChange={(e) => setSaturation(parseInt(e.target.value))}
            className="w-full accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 rounded-full"
          />
        </div>

        {/* Toggles */}
        <div className="pt-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showSymbols}
              onChange={(e) => setShowSymbols(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-700">{t('free.showSymbols')}</span>
          </label>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={onExport}
          disabled={!hasImage}
          className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          <Download className="w-4 h-4" />
          <span>{t('free.exportBtn')}</span>
        </button>
      </div>
    </div>
  );
}
