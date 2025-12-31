
import React, { useState } from 'react';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import AuthModal from './AuthModal';
import { generateImageWithGemini } from '../services/geminiService';
import { db } from '../services/dbService';

interface ImageGeneratorProps {
  activeModel: string;
}

const STYLES = [
  { id: 'none', label: 'تلقائي' }, { id: 'Realistic', label: 'واقعي' }, { id: 'Anime', label: 'أنمي' },
  { id: 'Cyberpunk', label: 'سايبر بانك' }, { id: 'Oil Painting', label: 'رسم زيتي' },
  { id: 'Digital Art', label: 'فن رقمي' }, { id: '3D Render', label: 'ثلاثي الأبعاد' }, { id: 'Cinematic', label: 'سينمائي' },
];

const ASPECT_RATIOS = [
  { id: '1:1', label: 'مربع (1:1)' }, { id: '16:9', label: 'عريض (16:9)' }, { id: '4:3', label: 'قياسي (4:3)' },
  { id: '3:4', label: 'طولي (3:4)' }, { id: '9:16', label: 'جوال (9:16)' },
];

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ activeModel }) => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('none');
  const [aspectRatio, setAspectRatio] = useState<any>('1:1');
  const [quality, setQuality] = useState<any>('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const inputBaseClass = "block w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all p-4";

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    const currentUser = db.getCurrentUser();
    if (!currentUser && db.getGuestActionCount() >= 1) { setShowAuthGate(true); return; }
    setLoading(true); setError(null);
    try {
      const result = await generateImageWithGemini(prompt, aspectRatio, activeModel, quality, negativePrompt, selectedStyle);
      setGeneratedImage(result);
      
      // تسجيل العملية في سجل المسؤول
      await db.logProcess({
        userId: currentUser?.id || 'guest',
        userName: currentUser?.name || 'ضيف زائر',
        type: 'generation',
        timestamp: Date.now(),
        status: 'success',
        model: activeModel
      });

      if (!currentUser) db.incrementGuestActionCount();
    } catch (err: any) { 
      setError(err.message || "حدث خطأ غير متوقع.");
      await db.logProcess({
        userId: currentUser?.id || 'guest',
        userName: currentUser?.name || 'ضيف زائر',
        type: 'generation',
        timestamp: Date.now(),
        status: 'error',
        model: activeModel
      });
    } finally { setLoading(false); }
  };

  const handleReset = () => { setGeneratedImage(null); setPrompt(''); setShowAuthGate(false); };

  if (showAuthGate) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 text-center shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-300">
         <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
         </div>
         <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-4">انتهت تجربتك المجانية</h3>
         <p className="text-slate-500 mb-10 max-w-md mx-auto">سجل دخولك الآن للحصول على توليد غير محدود وبدقة 4K.</p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setIsAuthModalOpen(true)} className="px-12 py-4 text-lg">اشترك مجاناً</Button>
            <Button variant="outline" onClick={handleReset}>لاحقاً</Button>
         </div>
         <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 p-8 md:p-12 transition-all">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8 text-right">
             <div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">ابتكر من خيالك</h2>
                <p className="text-slate-500 font-medium">حول كلماتك إلى لوحات فنية مذهلة بدعم الذكاء الاصطناعي.</p>
             </div>
             
             <div className="space-y-6">
                <textarea 
                  value={prompt} onChange={(e) => setPrompt(e.target.value)} 
                  className={`${inputBaseClass} h-40 resize-none`} 
                  placeholder="مثال: مدينة مستقبلية عائمة وسط السحاب بألوان النيون..." 
                />
                
                <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-sm font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                   {showAdvanced ? 'إخفاء الخيارات' : 'الخيارات المتقدمة'}
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </button>

                {showAdvanced && (
                   <div className="space-y-6 p-6 bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] border border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2">
                      <div>
                        <label className="block text-xs font-black text-slate-500 mb-2 mr-2">ما الذي تريد تجنبه؟ (سلبي)</label>
                        <input type="text" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} className={inputBaseClass} placeholder="ضباب، تشويه، جودة منخفضة..." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-black text-slate-500 mb-2 mr-2">النمط</label>
                           <select value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)} className={inputBaseClass}>
                             {STYLES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                           </select>
                        </div>
                        <div>
                           <label className="block text-xs font-black text-slate-500 mb-2 mr-2">الأبعاد</label>
                           <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className={inputBaseClass}>
                             {ASPECT_RATIOS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                           </select>
                        </div>
                      </div>
                   </div>
                )}
             </div>

             <Button onClick={handleGenerate} isLoading={loading} className="w-full py-5 text-xl font-black shadow-2xl shadow-indigo-600/20">توليد الصورة الآن</Button>
             {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
          </div>

          <div className="relative aspect-square bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 overflow-hidden group">
             {loading ? (
                <div className="text-center">
                   <LoadingSpinner />
                   <p className="mt-4 text-slate-400 font-bold animate-pulse">جاري الرسم...</p>
                </div>
             ) : generatedImage ? (
                <img src={generatedImage} className="w-full h-full object-contain animate-in fade-in duration-1000" alt="Result" />
             ) : (
                <div className="text-center opacity-30">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-24 h-24 mx-auto mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                   <p className="font-bold">ابداعك يظهر هنا</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default ImageGenerator;
