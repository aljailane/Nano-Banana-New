import React, { useRef, useState } from 'react';
import { ImageUploadState } from '../types';

interface ImageUploaderProps {
  onImageSelected: (imageState: ImageUploadState) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setDragError(true);
      setTimeout(() => setDragError(false), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64Data = result.split(',')[1];
      
      onImageSelected({
        file: file,
        previewUrl: result,
        base64Data: base64Data,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const items = e.dataTransfer.items;
    if (items && items.length > 0 && items[0].kind === 'file') {
      if (!items[0].type.startsWith('image/')) {
        setDragError(true);
      } else {
        setDragError(false);
      }
    }
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsDragging(false);
    setDragError(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragError(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`relative group border-2 border-dashed rounded-[2.5rem] p-12 text-center transition-all duration-500 ease-out cursor-pointer overflow-hidden
        ${isDragging 
          ? dragError 
            ? 'border-red-500 bg-red-50/50 scale-[1.03] shadow-2xl ring-4 ring-red-100 dark:ring-red-900/20'
            : 'border-indigo-600 bg-indigo-50/50 scale-[1.03] shadow-2xl ring-4 ring-indigo-100 dark:ring-indigo-900/20' 
          : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
        }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      role="button"
      aria-label="منطقة رفع الصور"
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      {/* تأثيرات خلفية متحركة عند السحب */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isDragging ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`absolute inset-0 opacity-10 animate-pulse ${dragError ? 'bg-red-500' : 'bg-indigo-500'}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-indigo-500/10 dark:from-indigo-400/5" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
        {/* أيقونة الحالة */}
        <div className={`relative p-6 rounded-3xl transition-all duration-500 shadow-sm
          ${isDragging 
            ? dragError 
              ? 'bg-red-600 text-white rotate-12 scale-125' 
              : 'bg-indigo-600 text-white -rotate-12 scale-125 shadow-indigo-500/40' 
            : 'bg-white dark:bg-slate-800 text-slate-400 group-hover:text-indigo-600 group-hover:scale-110 shadow-slate-200 dark:shadow-none'
          }`}>
          
          {isDragging ? (
            dragError ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12 animate-bounce">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            )
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          )}
          
          {/* وهج خلف الأيقونة عند السحب */}
          {isDragging && !dragError && (
            <div className="absolute inset-0 bg-indigo-400 blur-2xl opacity-40 animate-pulse -z-10" />
          )}
        </div>
        
        <div className="space-y-3">
          <p className={`text-2xl font-black transition-all duration-300 tracking-tight
            ${isDragging 
              ? dragError ? 'text-red-700 dark:text-red-400' : 'text-indigo-700 dark:text-indigo-300' 
              : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'
            }`}>
            {isDragging 
              ? dragError ? 'عذراً، هذا الملف ليس صورة!' : 'رائع! الآن اتركها هنا' 
              : 'اسحب صورتك هنا للبدء'}
          </p>
          
          <div className="flex flex-col items-center gap-2">
            <p className={`text-sm font-medium transition-colors duration-300
              ${isDragging ? 'text-indigo-500/80 dark:text-indigo-400/80' : 'text-slate-500 dark:text-slate-400'}`}>
              أو اضغط لاختيار ملف من جهازك
            </p>
            
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 rounded-md uppercase tracking-wider">PNG</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 rounded-md uppercase tracking-wider">JPG</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 rounded-md uppercase tracking-wider">WEBP</span>
              <span className="text-[10px] text-slate-400 mr-1">حتى 5MB</span>
            </div>
          </div>
        </div>
      </div>

      {/* مؤشر حافة متحرك عند السحب */}
      {isDragging && !dragError && (
        <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-[2.5rem] animate-[ping_2s_infinite]" />
      )}
    </div>
  );
};

export default ImageUploader;