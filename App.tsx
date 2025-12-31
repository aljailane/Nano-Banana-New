
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageEditor from './components/ImageEditor';
import ImageGenerator from './components/ImageGenerator';
import ImageEnhancer from './components/ImageEnhancer';
import BackgroundRemover from './components/BackgroundRemover';
import SettingsModal from './components/SettingsModal';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import FeaturesPage from './components/FeaturesPage';
import ServicesPage from './components/ServicesPage';
import ContactPage from './components/ContactPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import VerifyPage from './components/VerifyPage';
import { db } from './services/dbService';
import { auth, onAuthStateChanged } from './services/firebase';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');
  const [currentPage, setCurrentPage] = useState('home'); 
  const [activeTab, setActiveTab] = useState<'editor' | 'generator' | 'enhancer' | 'remover'>('editor');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(db.getCurrentUser());
  const [activeModel, setActiveModel] = useState('');
  const [siteName, setSiteName] = useState('');
  const [themeStyles, setThemeStyles] = useState<React.CSSProperties>({});

  useEffect(() => {
    refreshSettings();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(db.getCurrentUser());
      }
    });

    // محاولة قراءة الصفحة من URL عند التحميل الأول
    try {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page');
      if (pageParam && ['home', 'features', 'services', 'contact', 'user-dashboard', 'reset-password', 'verify'].includes(pageParam)) {
        setCurrentPage(pageParam);
      }
    } catch (e) {
      console.debug("Failed to read URL parameters in this environment.");
    }

    return () => unsubscribe();
  }, []);

  const refreshSettings = () => {
    const settings = db.getSettings();
    setActiveModel(settings.activeModel);
    setSiteName(settings.siteName);
    
    if (settings.darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    if (settings.theme) {
      setThemeStyles({
        '--color-primary': settings.theme.primaryColor,
        '--color-secondary': settings.theme.secondaryColor,
        '--radius': settings.theme.borderRadius,
      } as React.CSSProperties);
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // إصلاح SecurityError: التحقق من البيئة قبل محاولة تحديث URL
    try {
      if (window.location.protocol !== 'blob:') {
        const url = new URL(window.location.href);
        url.searchParams.set('page', page);
        window.history.pushState({}, '', url.toString());
      }
    } catch (e) {
      // في حال فشل التحديث (بسبب قيود المتصفح في بعض بيئات العرض)، نكتفي بتغيير حالة المكون داخلياً
      console.warn("URL state update skipped due to environment security restrictions.");
    }
  };

  if (currentView === 'admin') {
    return (
      <div style={themeStyles}>
        <AdminDashboard onBack={() => setCurrentView('home')} onSettingsChanged={refreshSettings} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-900 transition-colors duration-300" style={themeStyles}>
      <Header 
        onOpenSettings={() => setIsSettingsOpen(true)} 
        onOpenAdmin={() => setCurrentView('admin')}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onSettingsChanged={refreshSettings} />

      <main className="flex-grow">
        {currentPage === 'home' && (
          <div className="py-12 px-4 max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
            <div className="text-center space-y-6">
               <h2 className="text-5xl md:text-7xl font-black text-slate-800 dark:text-white tracking-tighter">
                  {siteName} <span className="text-indigo-600" style={{color: 'var(--color-primary)'}}>الذكي</span>
               </h2>
               <p className="max-w-xl mx-auto text-xl text-slate-500 font-medium">حوّل صورك العادية إلى أعمال فنية فائقة الجودة باستخدام ذكاء Gemini.</p>
            </div>

            <div className="flex flex-wrap justify-center p-2 bg-slate-200 dark:bg-slate-800 rounded-3xl max-w-2xl mx-auto shadow-inner gap-1">
               <button onClick={() => setActiveTab('editor')} className={`flex-1 min-w-[100px] py-4 px-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'editor' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xl scale-105' : 'text-slate-500'}`}>تعديل</button>
               <button onClick={() => setActiveTab('remover')} className={`flex-1 min-w-[100px] py-4 px-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'remover' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xl scale-105' : 'text-slate-500'}`}>إزالة الخلفية</button>
               <button onClick={() => setActiveTab('enhancer')} className={`flex-1 min-w-[100px] py-4 px-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'enhancer' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xl scale-105' : 'text-slate-500'}`}>تحسين</button>
               <button onClick={() => setActiveTab('generator')} className={`flex-1 min-w-[100px] py-4 px-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'generator' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xl scale-105' : 'text-slate-500'}`}>توليد</button>
            </div>

            <div className="animate-in slide-in-from-bottom-6 duration-500">
              {activeTab === 'editor' && <ImageEditor activeModel={activeModel} />}
              {activeTab === 'remover' && <BackgroundRemover activeModel={activeModel} />}
              {activeTab === 'enhancer' && <ImageEnhancer activeModel={activeModel} />}
              {activeTab === 'generator' && <ImageGenerator activeModel={activeModel} />}
            </div>
          </div>
        )}

        {currentPage === 'features' && <FeaturesPage />}
        {currentPage === 'services' && <ServicesPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'user-dashboard' && <UserDashboard onBack={() => handleNavigate('home')} />}
        {currentPage === 'reset-password' && <ResetPasswordPage onNavigateHome={() => handleNavigate('home')} />}
        {currentPage === 'verify' && <VerifyPage onNavigateHome={() => handleNavigate('home')} />}
      </main>
      <Footer />
    </div>
  );
};

export default App;
