
import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import AuthModal from './AuthModal';
import { ImageUploadState, AlertMessage } from '../types';
import { enhanceImageWithGemini } from '../services/geminiService';
import { db } from '../services/dbService';

interface ImageEnhancerProps {
  activeModel: string;
}

const ImageEnhancer: React.FC<ImageEnhancerProps> = ({ activeModel }) => {
  const [imageState, setImageState] = useState<ImageUploadState | null>(null);
  const [enhanceType, setEnhanceType] = useState<'general' | 'face' | 'denoise'>('general');
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleImageSelect = (state: ImageUploadState) => {
    setImageState(state);
    setEnhancedImage(null);
    setAlert(null);

    const isGuest = !db.getCurrentUser();
    if (isGuest && db.getGuestActionCount() >= 1) {
      setShowAuthGate(true);
    } else {
      setShowAuthGate(false);
    }
  };

  const handleEnhance = async () => {
    if (!imageState?.base64Data || !imageState.mimeType) return;
    
    const currentUser = db.getCurrentUser();
    if (!currentUser && db.getGuestActionCount() >= 1) {
      setShowAuthGate(true);
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const result = await enhanceImageWithGemini(
        imageState.base64Data,
        imageState.mimeType,
        enhanceType,
        activeModel
      );
      setEnhancedImage(result);

      if (!currentUser) {
        db.incrementGuestActionCount();
      }

      setAlert({ type: 'success', message: 'تم تحسين الصورة بنجاح!' });
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'حدث خطأ أثناء التحسين.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageState(null);
    setEnhancedImage(null);
    setShowAuthGate(false);
  };

  if (showAuthGate) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 text-center shadow-2xl border-2 border-indigo-100 dark:border-slate-700 animate-in zoom-in duration-300">
         <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
         </div>
         <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-4">ترقية جودة الصور تتطلب حساباً</h3>
         <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
           لقد استفدت من فرصتك المجانية الوحيدة. سجل حسابك الآن مجاناً لتحويل كافة صورك القديمة إلى صور فائقة الجودة وبدون حدود.
         </p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setIsAuthModalOpen(true)} className="px-10 py-4 text-lg">إنشاء حساب مجاني</Button>
            <Button variant="outline" onClick={handleReset}>ليس الآن</Button>
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
            <div className="space-y-6 text-right">
               <h3 className="text-xl font-black dark:text-white">محسن الصور الذكي</h3>
               <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-500">اختر نوع التحسين:</label>
                  <select value={enhanceType} onChange={(e) => setEnhanceType(e.target.value as any)} className="w-full p-4 rounded-xl border dark:bg-slate-900 dark:text-white">
                    <option value="general">تحسين عام</option>
                    <option value="face">تحسين ملامح الوجه</option>
                    <option value="denoise">إزالة التشويش</option>
                  </select>
               </div>
               <Button onClick={handleEnhance} isLoading={loading} className="w-full py-5 text-lg">بدء التحسين السحري</Button>
               <button onClick={handleReset} className="text-sm text-slate-400 w-full text-center">تغيير الصورة</button>
            </div>
            <div className="relative aspect-square bg-slate-50 dark:bg-slate-900 rounded-3xl border flex items-center justify-center overflow-hidden">
              {loading ? <LoadingSpinner /> : enhancedImage ? <img src={enhancedImage} className="max-h-full object-contain" /> : <img src={imageState.previewUrl || ''} className="max-h-full object-contain" />}
            </div>
         </div>
       )}
    </div>
  );
};

export default ImageEnhancer;
