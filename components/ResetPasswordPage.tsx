
import React, { useState, useEffect } from 'react';
import Button from './Button';
import { db } from '../services/dbService';

interface ResetPasswordPageProps {
  onNavigateHome: () => void;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigateHome }) => {
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'input' | 'processing' | 'success' | 'error'>('input');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Parse token from URL query params
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (!t) {
      setStatus('error');
      setErrorMsg("رمز الاستعادة مفقود.");
    } else {
      setToken(t);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg("كلمات المرور غير متطابقة.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      return;
    }
    if (!token) return;

    setStatus('processing');
    try {
      await db.verifyAndResetPassword(token, newPassword);
      setStatus('success');
      setTimeout(() => {
          // تم إزالة window.history.replaceState لتجنب SecurityError
          onNavigateHome();
      }, 3000);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || "حدث خطأ أثناء إعادة التعيين.");
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-slate-700 text-center">
        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
           </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">تعيين كلمة مرور جديدة</h2>

        {status === 'success' && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-4">
            تم تغيير كلمة المرور بنجاح! جاري تحويلك للصفحة الرئيسية...
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-4">
             خطأ: {errorMsg}
             <button onClick={onNavigateHome} className="block mt-2 text-sm underline hover:text-red-800">العودة للرئيسية</button>
          </div>
        )}

        {(status === 'input' || status === 'processing') && (
          <form onSubmit={handleSubmit} className="space-y-4 text-right">
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">كلمة المرور الجديدة</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="block w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2"
                  required
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">تأكيد كلمة المرور</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2"
                  required
                />
             </div>
             {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
             
             <Button type="submit" isLoading={status === 'processing'} className="w-full">
               حفظ وتغيير
             </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
