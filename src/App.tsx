import React, { useState, useEffect, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { PixelGrid } from './components/PixelGrid';
import { Controls } from './components/Controls';
import { BOMList } from './components/BOMList';
import { LandingView } from './components/LandingView';
import { FreeCreationWorkspace } from './components/FreeCreationWorkspace';
import { processImage, PixelData } from './utils/imageProcessing';
import { BeadColor } from './utils/colors';
import { Grid3X3 } from 'lucide-react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';

function AppContent() {
  const [appMode, setAppMode] = useState<'landing' | 'single' | 'free'>('landing');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [pixels, setPixels] = useState<PixelData[]>([]);
  
  // Settings
  const [gridSize, setGridSize] = useState(29);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [showSymbols, setShowSymbols] = useState(false);
  
  // Interactive editing
  const [selectedColor, setSelectedColor] = useState<BeadColor | null>(null);
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useLanguage();

  // Process image when settings change
  useEffect(() => {
    if (!originalImage) return;
    
    let isMounted = true;
    
    const runProcessing = async () => {
      setIsProcessing(true);
      try {
        const newPixels = await processImage(originalImage, gridSize, contrast, saturation);
        if (isMounted) {
          setPixels(newPixels);
        }
      } catch (error) {
        console.error("Failed to process image:", error);
      } finally {
        if (isMounted) {
          setIsProcessing(false);
        }
      }
    };

    // Debounce processing slightly to avoid lag while dragging sliders
    const timeoutId = setTimeout(runProcessing, 300);
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [originalImage, gridSize, contrast, saturation]);

  const handleStartSingle = (imageUrl?: string) => {
    setAppMode('single');
    if (imageUrl) {
      setOriginalImage(imageUrl);
    } else {
      setOriginalImage(null);
    }
  };

  const handleStartFree = () => {
    setAppMode('free');
  };

  const handleBackToLanding = () => {
    setAppMode('landing');
    setOriginalImage(null);
  };

  const handleImageUpload = (imageUrl: string) => {
    setOriginalImage(imageUrl);
  };

  const handlePixelClick = useCallback((index: number) => {
    if (!selectedColor) return;
    
    setPixels(prev => {
      const newPixels = [...prev];
      newPixels[index] = { ...newPixels[index], color: selectedColor };
      return newPixels;
    });
  }, [selectedColor]);

  const handleExport = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `pixelbead-pattern-${gridSize}x${gridSize}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#f5f5f4] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <Grid3X3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{t('app.title')}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {appMode === 'landing' && (
          <LandingView onStartSingle={handleStartSingle} onStartFree={handleStartFree} />
        )}
        
        {appMode === 'free' && (
          <FreeCreationWorkspace onBack={handleBackToLanding} />
        )}

        {appMode === 'single' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Inputs & Controls */}
            <div className="lg:col-span-3 space-y-6">
              <div className="glass-card rounded-3xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{t('app.step1')}</h2>
                  <button 
                    onClick={handleBackToLanding}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold bg-indigo-50 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {t('app.backHome')}
                  </button>
                </div>
                {originalImage ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200/50 group shadow-inner bg-white/50">
                    <img src={originalImage} alt="Original" className="w-full h-auto object-contain max-h-48" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <button onClick={() => setOriginalImage(null)} className="text-white text-sm font-medium px-4 py-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                        {t('app.changeImage')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <ImageUploader onImageUpload={handleImageUpload} />
                )}
              </div>

              <Controls 
              gridSize={gridSize} setGridSize={setGridSize}
              contrast={contrast} setContrast={setContrast}
              saturation={saturation} setSaturation={setSaturation}
              showSymbols={showSymbols} setShowSymbols={setShowSymbols}
              onExport={handleExport}
              hasImage={pixels.length > 0}
            />
          </div>

          {/* Center Column: Preview */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-800">{t('app.step3')}</h2>
                {isProcessing && (
                  <span className="text-xs text-indigo-500 animate-pulse flex items-center gap-1">
                    处理中...
                  </span>
                )}
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                <PixelGrid 
                  pixels={pixels} 
                  gridSize={gridSize} 
                  showSymbols={showSymbols}
                  selectedColor={selectedColor}
                  onPixelClick={handlePixelClick}
                />
              </div>
            </div>
          </div>

          {/* Right Column: BOM & Palette */}
          <div className="lg:col-span-3">
            <BOMList 
              pixels={pixels}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
          </div>

        </div>
        )}

      </main>
      
      {/* Global styles for custom scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
