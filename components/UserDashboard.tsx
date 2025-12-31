
import React, { useState, useEffect } from 'react';
import { db, User } from '../services/dbService';
import Button from './Button';

interface UserDashboardProps {
  onBack: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onBack }) => {
  const [user, setUser] = useState<User | null>(db.getCurrentUser());
  const [name, setName] = useState(user?.name || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null);
  const [loading, setLoading] = useState(false);

  // حقل إدخال موحد ومحسن
  const inputClass = "block w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all p-4";

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: 'success', msg: 'تم حفظ البيانات بنجاح.' });
    setLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) { setStatus({ type: 'error', msg: 'كلمة المرور قصيرة.' }); return; }
    setLoading(true);
    setStatus({ type: 'success', msg: 'تم تغيير كلمة المرور.' });
    setOldPassword(''); setNewPassword('');
    setLoading(false);
  };

  if (!user) return <div className="text-center py-20 font-black">يجب تسجيل الدخول أولاً.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 animate-fade-in text-right">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-4xl font-black text-slate-800 dark:text-white">ملفي الشخصي</h2>
        <button onClick={onBack} className="text-indigo-600 font-bold flex items-center gap-2 hover:translate-x-1 transition-transform">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
           الرئيسية
        </button>
      </div>

      {status && (
        <div className={`p-5 rounded-[2rem] mb-10 font-bold flex items-center gap-4 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
           {status.type === 'success' ? '✓' : '!'} {status.msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 text-center">
            <div className="w-28 h-28 rounded-[2.5rem] bg-indigo-600 text-white flex items-center justify-center text-5xl font-black mx-auto mb-6 shadow-2xl shadow-indigo-600/30">
              {user.name.charAt(0)}
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">{user.name}</h3>
            <p className="text-slate-500 font-medium mb-6">{user.email}</p>
            <div className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 py-2 rounded-xl">عضو منذ {new Date(user.joinedAt).toLocaleDateString('ar-SA')}</div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800">
            <h4 className="text-xl font-black mb-8 dark:text-white">البيانات الأساسية</h4>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 mb-2 mr-2">الاسم بالكامل</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
              </div>
              <Button type="submit" isLoading={loading} className="px-10">حفظ التغييرات</Button>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800">
            <h4 className="text-xl font-black mb-8 dark:text-white">تغيير كلمة المرور</h4>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-black text-slate-400 mb-2 mr-2">كلمة المرور الحالية</label>
                    <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
                 </div>
                 <div>
                    <label className="block text-xs font-black text-slate-400 mb-2 mr-2">كلمة المرور الجديدة</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
                 </div>
              </div>
              <Button variant="danger" type="submit" isLoading={loading} className="px-10">تحديث كلمة المرور</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
