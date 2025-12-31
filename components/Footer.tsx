import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} محرر الصور الذكي. تم التطوير باستخدام React و Google Gemini API.
        </p>
      </div>
    </footer>
  );
};

export default Footer;