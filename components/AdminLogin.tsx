
import React, { useState, useEffect } from 'react';
import Button from './Button';
import { db } from '../services/dbService';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [view, setView] = useState<'login' | 'recovery'>('login');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isFirstRun, setIsFirstRun] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  // تحسين تباين الألوان في الحقول
  const inputClass = "block w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 p-4 transition-all outline-none";

  useEffect(() => {
    const settings = db.getSettings();
    setIsFirstRun(!!settings.isFirstRun);
    setAdminEmail(settings.adminEmail || 'darhost56@gmail.com');
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('الرجاء إدخال كلمة المرور');
      return;
    }
    
    if (db.verifyPassword(password)) {
      db.startSession();
      onLoginSuccess();
    } else {
      setError('كلمة المرور غير صحيحة');
      setPassword('');
    }
  };

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4) {
      setError('كلمة المرور ضعيفة جداً.');
      return;
    }
    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة.');
      return;
    }

    db.updateSettings({
      adminPassword: password,
      isFirstRun: false
    });
    
    db.startSession();
    onLoginSuccess();
  };

  if (isFirstRun) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 border border-slate-200 dark:border-slate-800">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white">الإعداد الأول</h2>
            <p className="text-slate-500 mt-2">يرجى تعيين كلمة مرور قوية للمسؤول.</p>
          </div>

          <form onSubmit={handleSetup} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-500 mb-2">كلمة المرور الجديدة</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 mb-2">تأكيد كلمة المرور</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} placeholder="••••••••" required />
            </div>
            
            {error && <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 text-sm font-bold">{error}</div>}

            <Button type="submit" className="w-full py-4 text-lg">بدء الاستخدام</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 border border-slate-200 dark:border-slate-800">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white">دخول المسؤول</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2">كلمة المرور</label>
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(null); }} className={inputClass} placeholder="••••••••" required />
            {error && <p className="mt-3 text-sm text-red-500 font-bold">{error}</p>}
          </div>

          <Button type="submit" className="w-full py-4 text-lg">دخول</Button>
        </form>

        <div className="mt-8 flex justify-between items-center text-sm font-bold">
           <button onClick={onBack} className="text-slate-400 hover:text-slate-600">العودة</button>
           <button onClick={() => setView('recovery')} className="text-indigo-600">فقدت الوصول؟</button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
