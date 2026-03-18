import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { Palette, Grid3X3, ListOrdered, Download, Sparkles, Loader2, Layers, Sliders } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface LandingViewProps {
  onStartSingle: (url?: string) => void;
  onStartFree: () => void;
}

export function LandingView({ onStartSingle, onStartFree }: LandingViewProps) {
  const [loadingExample, setLoadingExample] = useState<string | null>(null);
  const { t } = useLanguage();

  const features = [
    { 
      icon: <Palette className="w-6 h-6 text-indigo-500" />, 
      title: t('landing.feat1Title'), 
      desc: t('landing.feat1Desc') 
    },
    { 
      icon: <Grid3X3 className="w-6 h-6 text-emerald-500" />, 
      title: t('landing.feat2Title'), 
      desc: t('landing.feat2Desc') 
    },
    { 
      icon: <Layers className="w-6 h-6 text-blue-500" />, 
      title: t('landing.feat3Title'), 
      desc: t('landing.feat3Desc') 
    },
    { 
      icon: <Sliders className="w-6 h-6 text-purple-500" />, 
      title: t('landing.feat4Title'), 
      desc: t('landing.feat4Desc') 
    },
    { 
      icon: <ListOrdered className="w-6 h-6 text-amber-500" />, 
      title: t('landing.feat5Title'), 
      desc: t('landing.feat5Desc') 
    },
    { 
      icon: <Download className="w-6 h-6 text-rose-500" />, 
      title: t('landing.feat6Title'), 
      desc: t('landing.feat6Desc') 
    },
  ];

  const examples = [
    { name: '经典动漫角色', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=400&fit=crop&q=80' },
    { name: '明星人像', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80' },
    { name: '自然风景', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop&q=80' },
  ];

  const handleExampleClick = async (url: string) => {
    setLoadingExample(url);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        onStartSingle(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      // Fallback to direct URL if fetch fails
      onStartSingle(url);
    } finally {
      setLoadingExample(null);
    }
  };

  return (
    <div className="space-y-20 py-8 pb-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
          {t('landing.title1')}<br className="hidden md:block" />
          <span className="text-indigo-600">{t('landing.title2')}</span>
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          {t('landing.desc')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <button 
            onClick={() => onStartSingle()}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold text-lg transition-all shadow-sm hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            <Grid3X3 className="w-5 h-5" />
            {t('landing.btnSingle')}
          </button>
          <button 
            onClick={onStartFree}
            className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 hover:border-indigo-300 text-slate-800 rounded-2xl font-semibold text-lg transition-all shadow-sm hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            <Palette className="w-5 h-5 text-indigo-500" />
            {t('landing.btnFree')}
          </button>
        </div>
      </div>

      {/* Examples Section */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Sparkles className="w-6 h-6 text-amber-500" />
          <h2 className="text-2xl font-bold text-slate-800">{t('landing.examplesTitle')}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {examples.map((ex, i) => (
            <div 
              key={i} 
              onClick={() => !loadingExample && handleExampleClick(ex.url)}
              tabIndex={0}
              className="group cursor-pointer bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-indigo-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <div className="aspect-square overflow-hidden relative bg-slate-100">
                <img 
                  src={ex.url} 
                  alt={ex.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  crossOrigin="anonymous" 
                />
                {loadingExample === ex.url ? (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="bg-white/95 text-slate-800 text-sm font-medium px-5 py-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-sm">
                      {t('landing.clickToTry')}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4 text-center border-t border-slate-100">
                <h3 className="font-medium text-slate-800">{ex.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-800">{t('landing.featuresTitle')}</h2>
          <p className="text-slate-500 mt-2">{t('landing.featuresDesc')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-5 border border-slate-100">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
