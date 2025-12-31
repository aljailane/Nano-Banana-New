
import React, { useState, useEffect } from 'react';
import Button from './Button';
import AdminLogin from './AdminLogin';
import { db, ModelConfig, AppSettings, ThemeConfig, User, AIProcess } from '../services/dbService';
import { testApiKey } from '../services/geminiService';

interface AdminDashboardProps {
  onBack: () => void;
  onSettingsChanged: () => void;
}

type TabType = 'overview' | 'users' | 'processes' | 'site' | 'content' | 'mail' | 'models' | 'theme' | 'security';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, onSettingsChanged }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(db.isSessionValid());
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [settings, setSettings] = useState<AppSettings>(db.getSettings());
  const [models, setModels] = useState<ModelConfig[]>(db.getModels());
  const [users, setUsers] = useState<User[]>([]);
  const [processes, setProcesses] = useState<AIProcess[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [apiTestStatus, setApiTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const inputClass = "block w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 p-4 transition-all outline-none";

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, activeTab]);

  const loadData = async () => {
    setSettings(db.getSettings());
    setModels(db.getModels());
    if (activeTab === 'users') setUsers(await db.getAllUsers());
    if (activeTab === 'processes' || activeTab === 'overview') setProcesses(await db.getAllProcesses());
  };

  const handleSave = () => {
    if (activeTab === 'security' && newPassword) {
      if (newPassword !== confirmPassword) return alert("كلمات المرور غير متطابقة");
      db.updateSettings({ ...settings, adminPassword: newPassword });
      setNewPassword(''); setConfirmPassword('');
    } else {
      db.updateSettings(settings);
    }
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
    onSettingsChanged();
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      await db.deleteUser(id);
      setUsers(await db.getAllUsers());
    }
  };

  if (!isAuthenticated) return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} onBack={onBack} />;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-right font-sans" dir="rtl">
      {/* Sidebar الملاحة الجانبية */}
      <aside className="w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800">
           <h1 className="text-2xl font-black text-indigo-600 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
              </div>
              لوحة الإدارة
           </h1>
        </div>

        <nav className="flex-grow p-6 space-y-2 overflow-y-auto">
          <SectionTitle label="الإحصائيات والرقابة" />
          <NavItem id="overview" active={activeTab} set={setActiveTab} label="نظرة عامة" icon="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          <NavItem id="users" active={activeTab} set={setActiveTab} label="المستخدمين" icon="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          <NavItem id="processes" active={activeTab} set={setActiveTab} label="سجل العمليات" icon="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          
          <SectionTitle label="الإعدادات" />
          <NavItem id="site" active={activeTab} set={setActiveTab} label="الموقع" icon="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 011.05.143M12 3c-1.605 0-3.113.42-4.418 1.157" />
          <NavItem id="content" active={activeTab} set={setActiveTab} label="المحتوى" icon="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          <NavItem id="mail" active={activeTab} set={setActiveTab} label="البريد SMTP" icon="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          <NavItem id="theme" active={activeTab} set={setActiveTab} label="المظهر" icon="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
          <NavItem id="models" active={activeTab} set={setActiveTab} label="نماذج AI" icon="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          <NavItem id="security" active={activeTab} set={setActiveTab} label="الأمان" icon="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </nav>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800">
           <button onClick={onBack} className="flex items-center gap-3 text-slate-500 font-bold hover:text-indigo-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 rotate-180"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
              خروج من الإدارة
           </button>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-grow p-12 overflow-y-auto h-screen">
        <header className="mb-12 flex justify-between items-end">
           <div>
             <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-2">
               {activeTab === 'overview' && "الإحصائيات العامة"}
               {activeTab === 'users' && "إدارة المستخدمين"}
               {activeTab === 'processes' && "سجل العمليات الذكية"}
               {activeTab === 'site' && "إعدادات الموقع"}
               {activeTab === 'content' && "إدارة المحتوى"}
               {activeTab === 'mail' && "خادم البريد SMTP"}
               {activeTab === 'models' && "نماذج الذكاء الاصطناعي"}
               {activeTab === 'theme' && "تخصيص المظهر"}
               {activeTab === 'security' && "حماية لوحة التحكم"}
             </h2>
             <p className="text-slate-500 font-medium">مرحباً بك في مركز التحكم بـ نانو بانانا.</p>
           </div>
           {saveStatus === 'saved' && <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold animate-fade-in">✓ تم الحفظ بنجاح</span>}
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <StatCard label="إجمالي المستخدمين" val={users.length} icon="users" color="bg-blue-600" />
               <StatCard label="عمليات الـ AI المنفذة" val={processes.length} icon="bolt" color="bg-indigo-600" />
               <StatCard label="المستخدمين النشطين اليوم" val={processes.filter(p => new Date(p.timestamp).toDateString() === new Date().toDateString()).length} icon="check" color="bg-green-600" />
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
               <h3 className="text-xl font-black mb-6 dark:text-white">آخر العمليات</h3>
               <div className="overflow-x-auto">
                 <table className="w-full text-right">
                    <thead>
                       <tr className="text-slate-400 border-b dark:border-slate-800">
                          <th className="pb-4 font-bold">المستخدم</th>
                          <th className="pb-4 font-bold">النوع</th>
                          <th className="pb-4 font-bold">التوقيت</th>
                          <th className="pb-4 font-bold">الحالة</th>
                       </tr>
                    </thead>
                    <tbody>
                       {processes.slice(0, 5).map(p => (
                         <tr key={p.id} className="border-b dark:border-slate-800 last:border-0">
                           <td className="py-4 font-bold dark:text-white">{p.userName}</td>
                           <td className="py-4 text-slate-500">{p.type}</td>
                           <td className="py-4 text-slate-400 text-sm">{new Date(p.timestamp).toLocaleString('ar-SA')}</td>
                           <td className="py-4"><span className={`px-3 py-1 rounded-lg text-xs font-bold ${p.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.status === 'success' ? 'ناجحة' : 'فاشلة'}</span></td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className="overflow-x-auto">
                <table className="w-full text-right">
                   <thead>
                      <tr className="text-slate-400 border-b dark:border-slate-800">
                         <th className="pb-4">الاسم</th>
                         <th className="pb-4">البريد</th>
                         <th className="pb-4">تاريخ الانضمام</th>
                         <th className="pb-4">الإجراءات</th>
                      </tr>
                   </thead>
                   <tbody>
                      {users.map(u => (
                        <tr key={u.id} className="border-b dark:border-slate-800 last:border-0">
                          <td className="py-5 font-black dark:text-white">{u.name}</td>
                          <td className="py-5 text-slate-500 font-mono text-sm">{u.email}</td>
                          <td className="py-5 text-slate-400">{new Date(u.joinedAt).toLocaleDateString('ar-SA')}</td>
                          <td className="py-5">
                             <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:text-red-700 font-bold text-sm">حذف</button>
                          </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
                {users.length === 0 && <p className="text-center py-20 text-slate-400 font-bold">لا يوجد مستخدمين مسجلين حالياً.</p>}
             </div>
          </div>
        )}

        {activeTab === 'processes' && (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className="overflow-x-auto">
                <table className="w-full text-right">
                   <thead>
                      <tr className="text-slate-400 border-b dark:border-slate-800">
                         <th className="pb-4">المعرف</th>
                         <th className="pb-4">المستخدم</th>
                         <th className="pb-4">العملية</th>
                         <th className="pb-4">النموذج</th>
                         <th className="pb-4">التوقيت</th>
                      </tr>
                   </thead>
                   <tbody>
                      {processes.map(p => (
                        <tr key={p.id} className="border-b dark:border-slate-800 last:border-0 text-sm">
                          <td className="py-4 text-slate-400 font-mono">{p.id}</td>
                          <td className="py-4 font-black dark:text-white">{p.userName}</td>
                          <td className="py-4 text-indigo-600 font-bold">{p.type}</td>
                          <td className="py-4 text-slate-500">{p.model}</td>
                          <td className="py-4 text-slate-400">{new Date(p.timestamp).toLocaleString('ar-SA')}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {(['site', 'content', 'mail', 'theme', 'security', 'models'].includes(activeTab)) && (
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
             {activeTab === 'site' && (
               <div className="space-y-6">
                 <div><label className="block text-sm font-bold text-slate-500 mb-2">اسم الموقع</label><input type="text" name="siteName" value={settings.siteName} onChange={(e) => setSettings({...settings, siteName: e.target.value})} className={inputClass} /></div>
                 <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                   <div><h4 className="font-bold dark:text-white">السماح بتغيير الإعدادات للعامة</h4><p className="text-xs text-slate-500">تمكين المستخدمين من تغيير المظهر والوضع الليلي.</p></div>
                   <input type="checkbox" checked={settings.allowPublicSettings} onChange={(e) => setSettings({...settings, allowPublicSettings: e.target.checked})} className="w-6 h-6 accent-indigo-600" />
                 </div>
               </div>
             )}

             {activeTab === 'mail' && (
                <div className="space-y-6">
                   <div><label className="block text-sm font-bold text-slate-500 mb-2">خادم SMTP</label><input type="text" value={settings.smtpHost} onChange={(e) => setSettings({...settings, smtpHost: e.target.value})} className={inputClass} placeholder="smtp.gmail.com" dir="ltr" /></div>
                   <div className="grid grid-cols-2 gap-6">
                      <div><label className="block text-sm font-bold text-slate-500 mb-2">المستخدم</label><input type="text" value={settings.smtpUser} onChange={(e) => setSettings({...settings, smtpUser: e.target.value})} className={inputClass} dir="ltr" /></div>
                      <div><label className="block text-sm font-bold text-slate-500 mb-2">البريد المرسل منه</label><input type="text" value={settings.smtpFrom} onChange={(e) => setSettings({...settings, smtpFrom: e.target.value})} className={inputClass} dir="ltr" /></div>
                   </div>
                </div>
             )}

             {activeTab === 'theme' && (
                <div className="space-y-10">
                   <div className="grid grid-cols-2 gap-8">
                      <div><label className="block text-sm font-bold text-slate-500 mb-3">اللون الأساسي</label><input type="color" value={settings.theme.primaryColor} onChange={(e) => setSettings({...settings, theme: {...settings.theme, primaryColor: e.target.value}})} className="w-full h-16 rounded-2xl cursor-pointer" /></div>
                      <div><label className="block text-sm font-bold text-slate-500 mb-3">اللون الثانوي</label><input type="color" value={settings.theme.secondaryColor} onChange={(e) => setSettings({...settings, theme: {...settings.theme, secondaryColor: e.target.value}})} className="w-full h-16 rounded-2xl cursor-pointer" /></div>
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-500 mb-3">انحناء الحواف</label>
                      <select value={settings.theme.borderRadius} onChange={(e) => setSettings({...settings, theme: {...settings.theme, borderRadius: e.target.value}})} className={inputClass}>
                         <option value="0px">حادة (0px)</option>
                         <option value="0.75rem">ناعمة (12px)</option>
                         <option value="1.5rem">دائرية (24px)</option>
                         <option value="3rem">شاملة (48px)</option>
                      </select>
                   </div>
                </div>
             )}

             {activeTab === 'models' && (
                <div className="space-y-4">
                   {models.map(m => (
                     <div key={m.id} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div><h4 className="font-black dark:text-white">{m.name}</h4><p className="text-xs text-slate-500">{m.description}</p></div>
                        <button onClick={() => {
                          const updated = models.map(mod => mod.id === m.id ? {...mod, enabled: !mod.enabled} : mod);
                          setModels(updated); db.updateModel(m.id, {enabled: !m.enabled});
                        }} className={`px-6 py-2 rounded-xl font-bold transition-all ${m.enabled ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                          {m.enabled ? 'نشط' : 'معطل'}
                        </button>
                     </div>
                   ))}
                </div>
             )}

             {activeTab === 'security' && (
                <div className="space-y-6">
                   <div><label className="block text-sm font-bold text-slate-500 mb-2">كلمة مرور المسؤول الجديدة</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} placeholder="••••••••" /></div>
                   <div><label className="block text-sm font-bold text-slate-500 mb-2">تأكيد كلمة المرور</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} placeholder="••••••••" /></div>
                </div>
             )}

             <div className="pt-10 flex justify-end">
                <Button onClick={handleSave} className="px-16 py-4 shadow-xl shadow-indigo-600/20">حفظ كافة التغييرات</Button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

const SectionTitle = ({ label }: { label: string }) => (
  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-8 mb-4 px-2">{label}</p>
);

const NavItem = ({ id, active, set, label, icon }: any) => (
  <button 
    onClick={() => set(id)} 
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black transition-all ${active === id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d={icon} /></svg>
    {label}
  </button>
);

const StatCard = ({ label, val, icon, color }: any) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-6">
     <div className={`w-16 h-16 ${color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
        {icon === 'users' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
        {icon === 'bolt' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>}
        {icon === 'check' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12z" /></svg>}
     </div>
     <div>
        <p className="text-slate-400 font-bold text-sm">{label}</p>
        <p className="text-3xl font-black dark:text-white mt-1">{val}</p>
     </div>
  </div>
);

export default AdminDashboard;
