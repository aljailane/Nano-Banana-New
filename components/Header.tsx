
import React, { useEffect, useState } from 'react';
import { db } from '../services/dbService';
import AuthModal from './AuthModal';
import { signOut, auth } from '../services/firebase';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenAdmin, onNavigate, currentPage }) => {
  const [allowPublicSettings, setAllowPublicSettings] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(db.getCurrentUser());

  useEffect(() => {
    const checkSettings = () => {
      const settings = db.getSettings();
      setAllowPublicSettings(settings.allowPublicSettings !== false);
      setDarkMode(settings.darkMode);
      setCurrentUser(db.getCurrentUser());
    };
    
    checkSettings();
    
    // فحص دوري بسيط لمزامنة حالة المستخدم
    const interval = setInterval(checkSettings, 2000);
    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    db.updateSettings({ darkMode: newMode });
    if (newMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleLogout = async () => {
    await signOut(auth);
    db.logoutUser();
    setCurrentUser(null);
    onNavigate('home');
  };

  return (
    <>
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/60 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 text-white p-2.5 rounded-xl shadow-lg" style={{ background: 'linear-gradient(to top right, var(--color-primary), var(--color-primary-dark))' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight">نانو بانانا</h1>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              {[
                { id: 'home', label: 'الرئيسية' },
                { id: 'features', label: 'المميزات' },
                { id: 'services', label: 'خدماتنا' },
                { id: 'contact', label: 'اتصل بنا' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    currentPage === item.id 
                      ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
             {currentUser ? (
               <div className="flex items-center gap-3">
                 <button 
                  onClick={() => onNavigate('user-dashboard')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:scale-105 transition-transform"
                 >
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline text-sm font-black">{currentUser.name}</span>
                 </button>
                 <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors" title="تسجيل خروج">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                   </svg>
                 </button>
               </div>
             ) : (
               <button 
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-xs hover:scale-105 transition-all shadow-lg"
               >
                 دخول
               </button>
             )}

             <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

             <button 
               onClick={onOpenAdmin}
               className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 rounded-xl transition-all"
               title="لوحة التحكم"
             >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
             </button>

             {allowPublicSettings && (
                <button 
                  onClick={onOpenSettings}
                  className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 rounded-xl transition-all"
                  title="الإعدادات"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.212 1.281c-.09.543-.56.941-1.11.941h-2.592c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
             )}
          </div>
        </div>
      </div>
    </header>
    
    <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLoginSuccess={() => { setCurrentUser(db.getCurrentUser()); onNavigate('home'); }} />
    </>
  );
};

export default Header;
