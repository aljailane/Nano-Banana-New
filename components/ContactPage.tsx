
import React, { useState } from 'react';
import Button from './Button';
import { db } from '../services/dbService';

const ContactPage: React.FC = () => {
  const settings = db.getSettings();
  const [submitted, setSubmitted] = useState(false);

  const inputClass = "block w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all p-4";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
     return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 animate-fade-in">
           <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
           </div>
           <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-4">رسالتك في أيدٍ أمينة!</h2>
           <p className="text-slate-500 font-medium">شكراً لتواصلك. فريقنا سيعاود الاتصال بك قريباً.</p>
           <Button className="mt-10 px-12" onClick={() => setSubmitted(false)}>إرسال رسالة جديدة</Button>
        </div>
     );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        
        <div className="space-y-10">
           <div>
              <h2 className="text-5xl font-black text-slate-800 dark:text-white mb-6 leading-tight">
                تواصل <span className="text-indigo-600">معنا</span>
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed">
                نحن نهتم برأيك وتجربتك. هل واجهت مشكلة أو لديك فكرة رائعة؟ أخبرنا الآن.
              </p>
           </div>

           <div className="space-y-4">
              {[
                { label: 'البريد الإلكتروني', val: settings.contactEmail, icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" },
                { label: 'رقم الهاتف', val: settings.contactPhone, icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" }
              ].map((info, i) => (
                <div key={i} className="flex items-center gap-5 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                   <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d={info.icon} /></svg>
                   </div>
                   <div>
                      <h4 className="text-xs font-black text-slate-400 mb-1">{info.label}</h4>
                      <p className="text-slate-800 dark:text-white font-black dir-ltr text-right">{info.val}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-slate-50 dark:border-slate-800">
           <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2 mr-2">الاسم</label>
                <input required type="text" className={inputClass} placeholder="كيف ناديك؟" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2 mr-2">البريد الإلكتروني</label>
                <input required type="email" className={inputClass} placeholder="email@example.com" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2 mr-2">موضوع رسالتك</label>
                <textarea required rows={5} className={inputClass} placeholder="تحدث إلينا بكل حرية..."></textarea>
              </div>
              <Button type="submit" className="w-full py-5 text-xl font-black">إرسال الآن</Button>
           </form>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
