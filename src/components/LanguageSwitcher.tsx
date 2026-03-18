import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, Language } from '../i18n/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div className="relative group z-50">
      <button className="flex items-center space-x-1 text-slate-600 hover:text-indigo-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white/50 px-3 py-1.5 rounded-full border border-slate-200/60">
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium uppercase">{language}</span>
      </button>
      <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
        <div className="py-1">
          <button onClick={() => setLanguage('en')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 ${language === 'en' ? 'text-indigo-600 font-semibold' : 'text-slate-700'}`}>English</button>
          <button onClick={() => setLanguage('zh')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 ${language === 'zh' ? 'text-indigo-600 font-semibold' : 'text-slate-700'}`}>中文</button>
          <button onClick={() => setLanguage('ja')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 ${language === 'ja' ? 'text-indigo-600 font-semibold' : 'text-slate-700'}`}>日本語</button>
          <button onClick={() => setLanguage('es')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 ${language === 'es' ? 'text-indigo-600 font-semibold' : 'text-slate-700'}`}>Español</button>
        </div>
      </div>
    </div>
  );
}
