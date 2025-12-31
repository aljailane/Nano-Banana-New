import React from 'react';

const FeaturesPage: React.FC = () => {
  const features = [
    {
      title: "معالجة ذكية بالذكاء الاصطناعي",
      description: "استخدام أحدث نماذج Google Gemini (Flash & Pro) لفهم الصور وتعديلها بدقة مذهلة وسرعة فائقة.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      ),
      color: "bg-indigo-500"
    },
    {
      title: "دعم اللغة العربية بالكامل",
      description: "واجهة مستخدم عربية (RTL) مع دعم كامل للأوامر النصية باللغة العربية وفهم اللهجات.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
        </svg>
      ),
      color: "bg-teal-500"
    },
    {
      title: "نظام إدارة محتوى متكامل",
      description: "لوحة تحكم للمسؤول تتيح إدارة إعدادات الموقع، النماذج، خدمات البريد، والمحتوى دون الحاجة لتعديل الكود.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
      ),
      color: "bg-blue-500"
    },
    {
      title: "قاعدة بيانات محلية آمنة",
      description: "تخزين البيانات والإعدادات محلياً باستخدام IndexedDB لضمان السرعة والخصوصية وعدم فقدان البيانات.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>
      ),
      color: "bg-emerald-500"
    },
    {
      title: "نظام عضوية وحماية",
      description: "تسجيل دخول، إنشاء حسابات، استعادة كلمة المرور عبر البريد، ونظام تشفير كلمات المرور (SHA-256).",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
      color: "bg-rose-500"
    },
    {
      title: "تخصيص كامل للمظهر",
      description: "تحكم كامل في الألوان، الوضع الليلي/النهاري، وشكل الحواف لتناسب هوية المستخدم.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.435-.435 1.133-.435 1.567 0l3.712 3.712c.435.435.435 1.133 0 1.567l-2.88 2.88M10.5 8.197L6.75 12" />
        </svg>
      ),
      color: "bg-violet-500"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-wider uppercase text-sm mb-2 block">اكتشف الإمكانيات</span>
        <h2 className="text-4xl md:text-6xl font-black text-slate-800 dark:text-white mb-6 leading-tight">
          كل ما تحتاجه <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">للإبداع الرقمي</span>
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
          قمنا ببناء نانو بانانا ليكون المزيج المثالي بين قوة الذكاء الاصطناعي وسهولة الاستخدام، مع التركيز الكامل على الأمان والخصوصية.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="group relative bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-2 transition-all duration-300"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
              {feature.icon}
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
              {feature.title}
            </h3>
            
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              {feature.description}
            </p>

            <div className="absolute inset-0 rounded-[2rem] border-2 border-transparent group-hover:border-indigo-600/10 dark:group-hover:border-indigo-400/10 pointer-events-none transition-colors"></div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-20 bg-indigo-600 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="relative z-10">
           <h3 className="text-3xl font-bold mb-4">جاهز لتجربة هذه المميزات؟</h3>
           <p className="text-indigo-100 mb-8 max-w-xl mx-auto">ابدأ الآن في تعديل صورك مجاناً واستمتع بقوة الذكاء الاصطناعي بين يديك.</p>
           <a href="/?page=home" className="inline-block bg-white text-indigo-600 font-bold py-4 px-10 rounded-xl hover:bg-indigo-50 transition-colors transform hover:scale-105 duration-200 shadow-xl">
             ابدأ التعديل الآن
           </a>
         </div>
      </div>
    </div>
  );
};

export default FeaturesPage;