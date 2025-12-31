
import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import AuthModal from './AuthModal';
import { ImageUploadState, AlertMessage } from '../types';
import { removeBackgroundWithGemini } from '../services/geminiService';
import { db } from '../services/dbService';

interface BackgroundRemoverProps {
  activeModel: string;
}

const BackgroundRemover: React.FC<BackgroundRemoverProps> = ({ activeModel }) => {
  const [imageState, setImageState] = useState<ImageUploadState | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleImageSelect = (state: ImageUploadState) => {
    setImageState(state);
    setProcessedImage(null);
    setAlert(null);
    
    const isGuest = !db.getCurrentUser();
    if (isGuest && db.getGuestActionCount() >= 1) {
      setShowAuthGate(true);
    } else {
      setShowAuthGate(false);
    }
  };

  const handleRemoveBackground = async () => {
    if (!imageState?.base64Data || !imageState.mimeType) return;
    
    const currentUser = db.getCurrentUser();
    if (!currentUser && db.getGuestActionCount() >= 1) {
      setShowAuthGate(true);
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const result = await removeBackgroundWithGemini(
        imageState.base64Data,
        imageState.mimeType,
        activeModel
      );
      setProcessedImage(result);
      
      if (!currentUser) {
        db.incrementGuestActionCount();
      }
      
      setAlert({ type: 'success', message: 'تمت إزالة الخلفية بنجاح!' });
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'حدث خطأ أثناء المعالجة.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageState(null);
    setProcessedImage(null);
    setAlert(null);
    setShowAuthGate(false);
  };

  if (showAuthGate) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 text-center shadow-2xl border-2 border-indigo-100 dark:border-slate-700 animate-in zoom-in duration-300">
         <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
         </div>
         <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-4">انتهت تجربتك المجانية</h3>
         <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
           إزالة الخلفيات تتطلب موارد معالجة عالية. يرجى تسجيل الدخول لمواصلة استخدام هذه الأداة بشكل غير محدود.
         </p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setIsAuthModalOpen(true)} className="px-10 py-4 text-lg">انضم إلينا الآن</Button>
            <Button variant="outline" onClick={handleReset}>إلغاء</Button>
         </div>
         <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700 p-8 transition-all">
      {!imageState ? (
        <ImageUploader onImageSelected={handleImageSelect} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6 flex flex-col justify-center text-right">
             <h3 className="text-xl font-black dark:text-white">إزالة الخلفية الذكية</h3>
             <p className="text-slate-500">تم اكتشاف العنصر الأساسي، اضغط البدء للمعالجة.</p>
             <Button onClick={handleRemoveBackground} isLoading={loading} className="w-full py-5 text-lg">بدء الإزالة الآن</Button>
             <button onClick={handleReset} className="text-sm text-slate-400 font-bold hover:text-red-500">إلغاء</button>
          </div>
          <div className="relative aspect-square bg-slate-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
             {loading ? <LoadingSpinner /> : processedImage ? <img src={processedImage} className="max-h-full object-contain" /> : <img src={imageState.previewUrl || ''} className="max-h-full object-contain opacity-50" />}
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundRemover;
