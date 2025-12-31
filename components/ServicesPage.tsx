import React from 'react';
import { db } from '../services/dbService';

const ServicesPage: React.FC = () => {
  const settings = db.getSettings();
  const services = settings.servicesList || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mb-4">
          خدماتنا <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">المميزة</span>
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          نقدم مجموعة من الأدوات الذكية لمساعدتك في تحرير الصور وتحسينها بكل سهولة واحترافية.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 mx-auto">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                 {service.icon === 'scissors' && <path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25l1.536.888m-1.536-.888a1 1 0 11-2-2 1 1 0 012 2zm1.536.888l5.57 3.216M9.384 9.138l1.536-.888m-1.536.888a1 1 0 11-2 2 1 1 0 012-2zm1.536-.888l5.57-3.216M16.5 6.75a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM16.5 17.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />}
                 {service.icon === 'bolt' && <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />}
                 {service.icon !== 'scissors' && service.icon !== 'bolt' && <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />}
               </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-slate-800 dark:text-white mb-3">{service.title}</h3>
            <p className="text-center text-slate-500 dark:text-slate-400">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;