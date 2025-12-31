
import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import AuthModal from './AuthModal';
import { ImageUploadState, AlertMessage } from '../types';
import { editImageWithGemini } from '../services/geminiService';
import { db } from '../services/dbService';

interface ImageEditorProps {
  activeModel: string; 
}

const ImageEditor: React.FC<ImageEditorProps> = ({ activeModel }) => {
  const [imageState, setImageState] = useState<ImageUploadState | null>(null);
  const [prompt, setPrompt] = useState('');
  const [intensity, setIntensity] = useState(50);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertMessage | null>(null);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // حقل نص محسن بتباين عالي
  const textareaClass = "w-full p-5 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all h-32 resize-none";

  const handleImageSelect = (state: ImageUploadState) => {
    setImageState(state);
    setGeneratedImage(null);
    setAlert(null);
    setPrompt('');
    setIntensity(50);
    const isGuest = !db.getCurrentUser();
    if (isGuest && db.getGuestActionCount() >= 1) { setShowAuthGate(true); } else { setShowAuthGate(false); }
  };

  const handleGenerate = async () => {
    if (!imageState?.base64Data || !imageState.mimeType) {
      setAlert({ type: 'error', message: 'الرجاء رفع صورة أولاً.' });
      return;
    }
    const currentUser = db.getCurrentUser();
    if (!currentUser && db.getGuestActionCount() >= 1) { setShowAuthGate(true); return; }
    if (!prompt.trim()) { setAlert({ type: 'error', message: 'الرجاء إدخال وصف للتعديل.' }); return; }
    setLoading(true); setAlert(null);
    try {
      const result = await editImageWithGemini(imageState.base64Data, imageState.mimeType, prompt, intensity, activeModel);
      setGeneratedImage(result);
      if (!currentUser) db.incrementGuestActionCount();
      setAlert({ type: 'success', message: 'تم التعديل بنجاح!' });
    } catch (error: any) { setAlert({ type: 'error', message: error.message || 'حدث خطأ.' }); } finally { setLoading(false); }
  };

  const handleReset = () => { setImageState(null); setGeneratedImage(null); setPrompt(''); setAlert(null); setShowAuthGate(false); };

  if (showAuthGate) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 text-center shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in duration-300">
         <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
         </div>
         <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-4">انتهت تجربتك المجانية</h3>
         <p className="text-slate-500 mb-10">انضم إلينا الآن للحصول على وصول غير محدود لكافة الأدوات الذكية.</p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setIsAuthModalOpen(true)} className="px-12 py-4 text-lg">سجل الآن</Button>
            <Button variant="outline" onClick={handleReset}>العودة</Button>
         </div>
         <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 transition-colors p-8 md:p-12">
        {alert && <div className={`mb-8 p-5 rounded-2xl font-bold ${alert.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{alert.message}</div>}

        {!imageState ? (
          <div className="max-w-2xl mx-auto">
             <ImageUploader onImageSelected={handleImageSelect} />
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex justify-between items-center border-b dark:border-slate-800 pb-6">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white">تعديل الصورة</h2>
              <button onClick={handleReset} className="text-sm text-red-500 font-bold">إلغاء</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 aspect-square">
                <img src={imageState.previewUrl || ''} alt="Original" className="w-full h-full object-contain" />
              </div>
              <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 aspect-square flex items-center justify-center">
                {loading ? <div className="text-center"><LoadingSpinner /><p className="mt-4 text-slate-400 text-xs font-bold animate-pulse">جاري المعالجة...</p></div> : generatedImage ? <img src={generatedImage} alt="Result" className="w-full h-full object-contain" /> : <p className="text-slate-400 font-bold">النتيجة تظهر هنا</p>}
              </div>
            </div>

            <div className="space-y-6 bg-slate-50 dark:bg-slate-800/30 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800">
              <textarea
                className={textareaClass}
                placeholder="صف التعديل المطلوب بدقة... مثال: غيّر لون القميص للأحمر"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button onClick={handleGenerate} isLoading={loading} className="w-full py-5 text-xl font-black shadow-xl shadow-indigo-600/20">تطبيق التعديلات</Button>
            </div>
          </div>
        )}
    </div>
  );
};

export default ImageEditor;
