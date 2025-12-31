import React, { useState, useEffect } from 'react';
import { db } from '../services/dbService';

interface VerifyPageProps {
  onNavigateHome: () => void;
}

const VerifyPage: React.FC<VerifyPageProps> = ({ onNavigateHome }) => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) { 
      setStatus('error'); 
      return; 
    }

    db.verifyUserAccount(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        console.error(err);
        setStatus('error');
      });
  }, []);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      {status === 'processing' && (
        <div className="space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-lg text-slate-600 dark:text-slate-300">جاري تفعيل الحساب...</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-8 rounded-3xl border border-green-100 dark:border-green-800 shadow-lg">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-300">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
               <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
             </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">تم تفعيل حسابك بنجاح!</h2>
          <p>يمكنك الآن الاستمتاع بكافة مميزات العضوية.</p>
          <button 
            onClick={onNavigateHome} 
            className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors"
          >
            الذهاب للرئيسية
          </button>
        </div>
      )}
      
      {status === 'error' && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-8 rounded-3xl border border-red-100 dark:border-red-800 shadow-lg">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-300">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
             </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">فشل التفعيل</h2>
          <p>رابط التفعيل غير صالح أو منتهي الصلاحية.</p>
          <button 
            onClick={onNavigateHome} 
            className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors"
          >
            العودة للرئيسية
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifyPage;