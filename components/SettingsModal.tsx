import React, { useEffect, useState } from 'react';
import Button from './Button';
import { db, ModelConfig, ThemeConfig } from '../services/dbService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChanged: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose,
  onSettingsChanged
}) => {
  const [activeModel, setActiveModel] = useState('');
  const [exportFormat, setExportFormat] = useState('png');
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState<ThemeConfig>({
    primaryColor: '#4f46e5',
    secondaryColor: '#0d9488',
    borderRadius: '0.75rem'
  });
  const [availableModels, setAvailableModels] = useState<ModelConfig[]>([]);

  // السمات المسبقة
  const presets = [
    { name: 'افتراضي', primary: '#4f46e5', secondary: '#0d9488' },
    { name: 'المحيط', primary: '#0ea5e9', secondary: '#6366f1' },
    { name: 'الزمرد', primary: '#10b981', secondary: '#0f766e' },
    { name: 'الغروب', primary: '#f43f5e', secondary: '#f59e0b' },
    { name: 'ليلي فاخر', primary: '#6366f1', secondary: '#ec4899' },
  ];

  useEffect(() => {
    if (isOpen) {
      const settings = db.getSettings();
      const models = db.getModels().filter(m => m.enabled);
      
      setActiveModel(settings.activeModel);
      setExportFormat(settings.exportFormat);
      setDarkMode(settings.darkMode);
      setTheme(settings.theme);
      setAvailableModels(models);
    }
  }, [isOpen]);

  // تحديث المعاينة الحية عبر تغيير متغيرات CSS مباشرة
  const updateLivePreview = (newTheme: ThemeConfig) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', newTheme.primaryColor);
    root.style.setProperty('--color-secondary', newTheme.secondaryColor);
    root.style.setProperty('--radius', newTheme.borderRadius);
  };

  const handlePresetClick = (primary: string, secondary: string) => {
    const newTheme = { ...theme, primaryColor: primary, secondaryColor: secondary };
    setTheme(newTheme);
    updateLivePreview(newTheme);
  };

  const handleColorChange = (key: keyof ThemeConfig, value: string) => {
    const newTheme = { ...theme, [key]: value };
    setTheme(newTheme);
    updateLivePreview(newTheme);
  };

  const handleSave = () => {
    db.updateSettings({
      activeModel,
      exportFormat,
      darkMode,
      theme
    });
    onSettingsChanged();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-slate-900 rounded-[2.5rem] text-right overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full border border-white/10">
          <div className="px-8 pt-8 pb-6">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-slate-800 pb-5">
              <div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white" id="modal-title">
                  تخصيص التجربة
                </h3>
                <p className="text-sm text-slate-500 mt-1">اجعل المحرر يبدو كما تحب</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-8 max-h-[60vh] overflow-y-auto px-1">
              
              {/* Theme Colors Expansion */}
              <section>
                <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-6 h-px bg-indigo-600/20"></span>
                  الألوان والهوية
                </h4>
                
                {/* Presets */}
                <div className="grid grid-cols-5 gap-3 mb-6">
                  {presets.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => handlePresetClick(p.primary, p.secondary)}
                      className="group flex flex-col items-center gap-2"
                    >
                      <div 
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm transition-transform group-hover:scale-110 relative overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${p.primary} 50%, ${p.secondary} 50%)` }}
                      >
                        {theme.primaryColor === p.primary && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-5 h-5">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">{p.name}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <label className="block text-xs font-bold text-slate-500 mb-2">اللون الأساسي</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={theme.primaryColor} 
                        onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                      />
                      <span className="text-xs font-mono font-bold uppercase">{theme.primaryColor}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <label className="block text-xs font-bold text-slate-500 mb-2">اللون الثانوي</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={theme.secondaryColor} 
                        onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                      />
                      <span className="text-xs font-mono font-bold uppercase">{theme.secondaryColor}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Border Radius Expansion */}
              <section>
                <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-6 h-px bg-indigo-600/20"></span>
                  نمط الزوايا (الحواف)
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'حادة', value: '0px' },
                    { label: 'ناعم', value: '0.75rem' },
                    { label: 'دائري', value: '1.5rem' },
                    { label: 'بيضاوي', value: '9999px' },
                  ].map((r) => (
                    <button
                      key={r.value}
                      onClick={() => handleColorChange('borderRadius', r.value)}
                      className={`p-3 text-xs font-bold border-2 transition-all rounded-xl
                        ${theme.borderRadius === r.value 
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' 
                          : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200'}`}
                    >
                      <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 mx-auto mb-2" style={{ borderRadius: r.value }}></div>
                      {r.label}
                    </button>
                  ))}
                </div>
              </section>

              {/* Dark Mode */}
              <section>
                <div 
                  className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl cursor-pointer"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-indigo-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-slate-700 dark:text-slate-200 font-bold block">الوضع الليلي</span>
                      <span className="text-[10px] text-slate-500">مريح للعين في الإضاءة المنخفضة</span>
                    </div>
                  </div>
                  <div className={`relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full ${darkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                    <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></span>
                  </div>
                </div>
              </section>

              {/* Model Selection */}
              <section>
                <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-6 h-px bg-indigo-600/20"></span>
                  محرك الذكاء الاصطناعي
                </h4>
                <div className="space-y-3">
                  {availableModels.map((model) => (
                    <div 
                      key={model.id}
                      onClick={() => setActiveModel(model.id)}
                      className={`relative flex cursor-pointer rounded-2xl border-2 p-4 transition-all
                        ${activeModel === model.id 
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-md' 
                          : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/30 hover:border-slate-200'}`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${activeModel === model.id ? 'bg-indigo-600 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                          <div className="text-sm">
                            <p className="font-black text-slate-900 dark:text-white">{model.name}</p>
                            <p className="text-[10px] text-slate-500">{model.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Export Format */}
              <section className="pb-4">
                <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                   <div className="flex items-center gap-4">
                     <div className="p-2.5 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-indigo-600">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                     </div>
                     <span className="text-slate-700 dark:text-slate-200 font-bold">صيغة التصدير</span>
                   </div>
                   <select 
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="form-select w-24 py-1.5 text-xs font-black border-2 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl bg-white dark:bg-slate-800 dark:text-white"
                  >
                     <option value="png">PNG</option>
                     <option value="jpg">JPG</option>
                     <option value="webp">WEBP</option>
                   </select>
                </div>
              </section>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 px-8 py-6 sm:flex sm:flex-row-reverse gap-3 border-t border-slate-100 dark:border-slate-700">
            <Button onClick={handleSave} variant="primary" className="w-full sm:w-auto px-10">
              حفظ وتطبيق
            </Button>
            <Button onClick={onClose} variant="outline" className="w-full sm:w-auto">
              إلغاء
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;