import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useLanguage();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            onImageUpload(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }, [onImageUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            onImageUpload(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }, [onImageUpload]);

  return (
    <div
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:border-indigo-400 ${
        isDragging ? 'border-indigo-500 bg-indigo-50/50 scale-[0.98]' : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        id="file-upload"
      />
      <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
        <div className="p-4 bg-white rounded-full shadow-sm">
          <Upload className="w-8 h-8 text-indigo-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">
            {t('uploader.title')}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {t('uploader.desc')}
          </p>
        </div>
      </div>
    </div>
  );
}
