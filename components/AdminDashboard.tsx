
import React, { useState, useEffect } from 'react';
import Button from './Button';
import AdminLogin from './AdminLogin';
import { db, ModelConfig, AppSettings, User, AIProcess } from '../services/dbService';

// مكونات مساعدة للواجهة
// Fix: Added optional children to the type definition of FormGroup to resolve TS errors in JSX usage.
const FormGroup = ({ label, description, children }: { label: string, description?: string, children?: React.ReactNode }) => (
  <div className="space-y-2">
    <div className="flex flex-col mb-1">
      <label className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">{label}</label>
      {description && <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{description}</p>}
    </div>
    {children}
  </div>
);

const SectionTitle = ({ label }: { label: string }) => (
  <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-6 mb-3 px-3">{label}</p>
);

const NavItem = ({ id, active, set, label, icon }: any) => (
  <button 
    onClick={() => set(id)} 
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm group ${active === id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className={`w-4 h-4 transition-transform group-hover:scale-110 ${active === id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`}><path strokeLinecap="round" strokeLinejoin="round" d={icon} /></svg>
    {label}
  </button>
);

const StatCard = ({ label, val, icon, color }: any) => (
  <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex items-center gap-5 group hover:border-indigo-500/30 transition-all duration-300">
     <div className={`w-12 h-12 ${color} text-white rounded-xl flex items-center justify-center shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
        {icon === 'users' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
        {icon === 'bolt' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>}
        {icon === 'check' && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068" /></svg>}
     </div>
     <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black dark:text-white tracking-tight mt-0.5">{val.toLocaleString('ar-SA')}</p>
     </div>
  </div>
);

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
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const inputClass = "block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 p-3.5 transition-all outline-none text-sm";

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

  // وظائف إدارة الخدمات
  const handleAddService = () => {
    const newList = [...(settings.servicesList || []), { title: 'خدمة جديدة', description: 'وصف الخدمة هنا...', icon: 'bolt' }];
    setSettings({ ...settings, servicesList: newList });
  };

  const handleUpdateService = (index: number, field: string, value: string) => {
    const newList = [...(settings.servicesList || [])];
    newList[index] = { ...newList[index], [field]: value };
    setSettings({ ...settings, servicesList: newList });
  };

  const handleRemoveService = (index: number) => {
    const newList = (settings.servicesList || []).filter((_, i) => i !== index);
    setSettings({ ...settings, servicesList: newList });
  };

  if (!isAuthenticated) return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} onBack={onBack} />;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-right font-sans selection:bg-indigo-100 selection:text-indigo-900" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-l border-slate-200/60 dark:border-slate-800/60 flex flex-col sticky top-0 h-screen z-20">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/50">
           <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
              </div>
              <span className="text-lg font-black tracking-tight dark:text-white">المركز الذكي</span>
           </div>
        </div>

        <nav className="flex-grow p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <SectionTitle label="البيانات والرقابة" />
          <NavItem id="overview" active={activeTab} set={setActiveTab} label="لوحة الإحصائيات" icon="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0V3m0 13.5V21m0-18H6.75" />
          <NavItem id="users" active={activeTab} set={setActiveTab} label="قاعدة المستخدمين" icon="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          <NavItem id="processes" active={activeTab} set={setActiveTab} label="الأرشيف الذكي" icon="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          
          <SectionTitle label="تخصيص النظام" />
          <NavItem id="site" active={activeTab} set={setActiveTab} label="هوية الموقع" icon="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
          <NavItem id="content" active={activeTab} set={setActiveTab} label="إدارة المحتوى" icon="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          <NavItem id="theme" active={activeTab} set={setActiveTab} label="سمة الواجهة" icon="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763" />
          <NavItem id="models" active={activeTab} set={setActiveTab} label="محركات AI" icon="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25" />
          
          <SectionTitle label="الإدارة التقنية" />
          <NavItem id="mail" active={activeTab} set={setActiveTab} label="خادم SMTP" icon="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75" />
          <NavItem id="security" active={activeTab} set={setActiveTab} label="الأمان والحماية" icon="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75" />
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800/50">
           <button onClick={onBack} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-slate-500 font-bold hover:bg-red-50 hover:text-red-600 transition-all text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 rotate-180"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
              مغادرة الإدارة
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 lg:p-12 overflow-y-auto h-screen custom-scrollbar">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
             <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-1">
               {activeTab === 'overview' && "نظرة شمولية"}
               {activeTab === 'users' && "المستخدمين"}
               {activeTab === 'processes' && "الأرشيف"}
               {activeTab === 'site' && "الهوية"}
               {activeTab === 'content' && "إدارة المحتوى"}
               {activeTab === 'mail' && "البريد"}
               {activeTab === 'models' && "النماذج"}
               {activeTab === 'theme' && "المظهر"}
               {activeTab === 'security' && "الأمان"}
             </h2>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">لوحة تحكم نانو بانانا الإدارية</p>
           </div>
           
           <div className="flex items-center gap-3">
              {saveStatus === 'saved' && (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg text-xs font-black animate-in fade-in zoom-in duration-300 border border-emerald-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  تم تحديث النظام
                </div>
              )}
              <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                متصل بالخادم الذكي
              </div>
           </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <StatCard label="المستخدمين" val={users.length} icon="users" color="bg-indigo-600" />
               <StatCard label="العمليات المنفذة" val={processes.length} icon="bolt" color="bg-amber-500" />
               <StatCard label="نشاط اليوم" val={processes.filter(p => new Date(p.timestamp).toDateString() === new Date().toDateString()).length} icon="check" color="bg-emerald-500" />
            </div>
            
            <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-black dark:text-white uppercase tracking-wider">سجل النشاط الأخير</h3>
                  <button onClick={() => setActiveTab('processes')} className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:underline">عرض الأرشيف كاملاً</button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-right">
                    <thead>
                       <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                          <th className="pb-3 pr-2">المستفيد</th>
                          <th className="pb-3">نوع العملية</th>
                          <th className="pb-3">النموذج</th>
                          <th className="pb-3 text-left pl-2">الحالة</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                       {processes.slice(0, 6).map(p => (
                         <tr key={p.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                           <td className="py-3 pr-2">
                              <div className="flex items-center gap-2">
                                 <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black dark:text-white">{p.userName.charAt(0)}</div>
                                 <span className="text-xs font-bold dark:text-white">{p.userName}</span>
                              </div>
                           </td>
                           <td className="py-3 text-[11px] font-medium text-slate-500">{p.type}</td>
                           <td className="py-3 text-[10px] font-mono text-slate-400">{p.model}</td>
                           <td className="py-3 text-left pl-2">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black ${p.status === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'}`}>
                                 <span className={`w-1 h-1 rounded-full ${p.status === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                                 {p.status === 'success' ? 'مكتمل' : 'فشل'}
                              </span>
                           </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {/* بقية التبويبات */}
        {(['site', 'content', 'mail', 'theme', 'security', 'models'].includes(activeTab)) && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-top-2 duration-500">
             <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                
                {activeTab === 'site' && (
                  <div className="space-y-6">
                    <FormGroup label="مسمى المنصة الرقمية" description="سيظهر هذا الاسم في واجهة التطبيق والبريد.">
                      <input type="text" value={settings.siteName} onChange={(e) => setSettings({...settings, siteName: e.target.value})} className={inputClass} />
                    </FormGroup>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div>
                        <h4 className="text-sm font-black dark:text-white">تخصيص الواجهة للعامة</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">Public Customization Access</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings.allowPublicSettings} onChange={(e) => setSettings({...settings, allowPublicSettings: e.target.checked})} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer dark:bg-slate-700 peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  </div>
                )}

                {activeTab === 'content' && (
                   <div className="space-y-10 animate-in fade-in duration-500">
                      {/* بيانات التواصل */}
                      <div className="space-y-6">
                        <SectionTitle label="بيانات التواصل الأساسية" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <FormGroup label="البريد الإلكتروني للدعم">
                             <input type="email" value={settings.contactEmail} onChange={(e) => setSettings({...settings, contactEmail: e.target.value})} className={inputClass} dir="ltr" />
                           </FormGroup>
                           <FormGroup label="رقم الهاتف">
                             <input type="text" value={settings.contactPhone} onChange={(e) => setSettings({...settings, contactPhone: e.target.value})} className={inputClass} dir="ltr" />
                           </FormGroup>
                        </div>
                        <FormGroup label="عنوان المكتب / المقر">
                           <input type="text" value={settings.contactAddress} onChange={(e) => setSettings({...settings, contactAddress: e.target.value})} className={inputClass} />
                        </FormGroup>
                      </div>

                      {/* قائمة الخدمات */}
                      <div className="space-y-6">
                         <div className="flex justify-between items-center">
                            <SectionTitle label="إدارة الخدمات (البطاقات)" />
                            <button onClick={handleAddService} className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">إضافة خدمة جديدة +</button>
                         </div>
                         
                         <div className="space-y-4">
                            {settings.servicesList?.map((service, index) => (
                               <div key={index} className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 relative group">
                                  <button onClick={() => handleRemoveService(index)} className="absolute top-4 left-4 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg">
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                  </button>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <FormGroup label="عنوان الخدمة">
                                        <input type="text" value={service.title} onChange={(e) => handleUpdateService(index, 'title', e.target.value)} className={inputClass} />
                                     </FormGroup>
                                     <FormGroup label="الأيقونة">
                                        <select value={service.icon} onChange={(e) => handleUpdateService(index, 'icon', e.target.value)} className={inputClass}>
                                           <option value="bolt">برق (Bolt)</option>
                                           <option value="scissors">مقص (Scissors)</option>
                                           <option value="magic">سحر (Magic)</option>
                                           <option value="photo">صورة (Photo)</option>
                                        </select>
                                     </FormGroup>
                                  </div>
                                  <div className="mt-4">
                                     <FormGroup label="وصف الخدمة">
                                        <textarea value={service.description} onChange={(e) => handleUpdateService(index, 'description', e.target.value)} className={`${inputClass} h-20 resize-none`} />
                                     </FormGroup>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                )}

                {activeTab === 'mail' && (
                   <div className="space-y-6">
                      <FormGroup label="خادم SMTP" description="العنوان البريدي للخادم (مثال: smtp.gmail.com).">
                        <input type="text" value={settings.smtpHost} onChange={(e) => setSettings({...settings, smtpHost: e.target.value})} className={inputClass} dir="ltr" />
                      </FormGroup>
                      <div className="grid grid-cols-2 gap-4">
                         <FormGroup label="اسم المستخدم">
                           <input type="text" value={settings.smtpUser} onChange={(e) => setSettings({...settings, smtpUser: e.target.value})} className={inputClass} dir="ltr" />
                         </FormGroup>
                         <FormGroup label="بريد المرسل">
                           <input type="text" value={settings.smtpFrom} onChange={(e) => setSettings({...settings, smtpFrom: e.target.value})} className={inputClass} dir="ltr" />
                         </FormGroup>
                      </div>
                   </div>
                )}

                {activeTab === 'theme' && (
                   <div className="space-y-8">
                      <div className="grid grid-cols-2 gap-6">
                         <FormGroup label="اللون الأساسي">
                           <div className="flex items-center gap-3">
                              <input type="color" value={settings.theme.primaryColor} onChange={(e) => setSettings({...settings, theme: {...settings.theme, primaryColor: e.target.value}})} className="w-10 h-10 rounded-lg cursor-pointer border-none p-0 overflow-hidden" />
                              <span className="text-xs font-mono text-slate-500 uppercase">{settings.theme.primaryColor}</span>
                           </div>
                         </FormGroup>
                         <FormGroup label="اللون الثانوي">
                           <div className="flex items-center gap-3">
                              <input type="color" value={settings.theme.secondaryColor} onChange={(e) => setSettings({...settings, theme: {...settings.theme, secondaryColor: e.target.value}})} className="w-10 h-10 rounded-lg cursor-pointer border-none p-0 overflow-hidden" />
                              <span className="text-xs font-mono text-slate-500 uppercase">{settings.theme.secondaryColor}</span>
                           </div>
                         </FormGroup>
                      </div>
                      <FormGroup label="نمط الحواف الرقمية">
                         <select value={settings.theme.borderRadius} onChange={(e) => setSettings({...settings, theme: {...settings.theme, borderRadius: e.target.value}})} className={inputClass}>
                            <option value="0px">Sharp (0px)</option>
                            <option value="0.5rem">Soft (8px)</option>
                            <option value="1rem">Modern (16px)</option>
                            <option value="2rem">Pill (32px)</option>
                         </select>
                      </FormGroup>
                   </div>
                )}

                {activeTab === 'models' && (
                   <div className="space-y-3">
                      {models.map(m => (
                        <div key={m.id} className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center group transition-all hover:border-indigo-100 dark:hover:border-indigo-900/40">
                           <div>
                              <h4 className="text-sm font-black dark:text-white mb-1">{m.name}</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{m.description}</p>
                           </div>
                           <button onClick={() => {
                             const updated = models.map(mod => mod.id === m.id ? {...mod, enabled: !mod.enabled} : mod);
                             setModels(updated); db.updateModel(m.id, {enabled: !m.enabled});
                           }} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${m.enabled ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400 dark:bg-slate-700'}`}>
                             {m.enabled ? 'قيد العمل' : 'موقوف مؤقتاً'}
                           </button>
                        </div>
                      ))}
                   </div>
                )}

                {activeTab === 'security' && (
                   <div className="space-y-6">
                      <FormGroup label="تحديث كلمة المرور" description="اترك الحقول فارغة إذا كنت لا ترغب بالتغيير.">
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} placeholder="الرمز الجديد" />
                      </FormGroup>
                      <FormGroup label="تأكيد الرمز">
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} placeholder="إعادة الكتابة" />
                      </FormGroup>
                   </div>
                )}

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                   <Button onClick={handleSave} className="px-10 py-3.5 shadow-xl shadow-indigo-600/10 text-sm font-black">حفظ كافة الإعدادات</Button>
                </div>
             </div>
          </div>
        )}

        {/* مستخدمين وأرشيف */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm animate-in fade-in duration-500">
             <div className="overflow-x-auto">
                <table className="w-full text-right">
                   <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         <th className="p-4">الهوية الرقمية</th>
                         <th className="p-4">البريد الإلكتروني</th>
                         <th className="p-4">تاريخ الانضمام</th>
                         <th className="p-4 text-left">التحكم</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="p-4">
                             <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">{u.name.charAt(0)}</div>
                                <span className="text-sm font-black dark:text-white">{u.name}</span>
                             </div>
                          </td>
                          <td className="p-4 text-xs font-mono text-slate-500">{u.email}</td>
                          <td className="p-4 text-xs text-slate-400">{new Date(u.joinedAt).toLocaleDateString('ar-SA')}</td>
                          <td className="p-4 text-left">
                             <button onClick={() => handleDeleteUser(u.id)} className="text-[10px] font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 px-3 py-1 rounded-lg transition-colors">طرد المستخدم</button>
                          </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'processes' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm animate-in fade-in duration-500">
             <div className="overflow-x-auto">
                <table className="w-full text-right">
                   <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         <th className="p-4">المعرف</th>
                         <th className="p-4">المستخدم</th>
                         <th className="p-4">العملية</th>
                         <th className="p-4">النموذج</th>
                         <th className="p-4 text-left">التوقيت</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {processes.map(p => (
                        <tr key={p.id} className="text-xs hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="p-4 text-slate-400 font-mono text-[10px]">{p.id}</td>
                          <td className="p-4 font-black dark:text-white">{p.userName}</td>
                          <td className="p-4">
                             <span className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded text-[10px] font-black">{p.type}</span>
                          </td>
                          <td className="p-4 text-slate-500">{p.model}</td>
                          <td className="p-4 text-slate-400 text-left font-mono">{new Date(p.timestamp).toLocaleString('ar-SA')}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
