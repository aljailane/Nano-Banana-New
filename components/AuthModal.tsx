
import React, { useState } from 'react';
import Button from './Button';
import { db } from '../services/dbService';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  translateFirebaseError
} from '../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{type: 'error' | 'success' | 'info', text: string} | null>(null);
  const [loading, setLoading] = useState(false);

  // حقل إدخال محسن بتباين عالي
  const inputClass = "w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(userCredential.user, { displayName: name });
          await sendEmailVerification(userCredential.user);
          
          localStorage.setItem('current_user', JSON.stringify({
            id: userCredential.user.uid,
            name: name,
            email: userCredential.user.email,
            joinedAt: Date.now()
          }));

          setMessage({ type: 'success', text: "تم إنشاء الحساب! يرجى تفعيل حسابك." });
          setTimeout(() => { onLoginSuccess(); onClose(); }, 2000);
        } catch (firebaseErr: any) {
          if (firebaseErr.code === 'auth/network-request-failed' || firebaseErr.message.includes('API key')) {
            await db.registerUserLocally(name, email);
            setMessage({ type: 'info', text: "تم الدخول عبر النظام المحلي." });
            setTimeout(() => { onLoginSuccess(); onClose(); }, 1500);
          } else throw firebaseErr;
        }

      } else if (mode === 'login') {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          localStorage.setItem('current_user', JSON.stringify({
            id: userCredential.user.uid,
            name: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'مستخدم',
            email: userCredential.user.email,
            joinedAt: Date.now()
          }));
          onLoginSuccess();
          onClose();
        } catch (firebaseErr: any) {
          if (firebaseErr.code === 'auth/network-request-failed') {
             await db.registerUserLocally(email.split('@')[0], email);
             onLoginSuccess(); onClose();
          } else throw firebaseErr;
        }
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setMessage({ type: 'success', text: "تم إرسال رابط الاستعادة." });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: translateFirebaseError(err.code) });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-10 text-white text-center">
          <h3 className="text-3xl font-black mb-2">
            {mode === 'login' ? 'عوداً حميداً!' : mode === 'register' ? 'ابدأ الإبداع' : 'استعادة الحساب'}
          </h3>
        </div>

        <div className="p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6 text-right">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2">الاسم بالكامل</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="أحمد علي" />
              </div>
            )}
            <div>
              <label className="block text-xs font-black text-slate-500 mb-2">البريد الإلكتروني</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="email@example.com" dir="ltr" />
            </div>
            {mode !== 'forgot' && (
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2">كلمة المرور</label>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
              </div>
            )}

            {message && <div className={`p-4 rounded-2xl text-xs font-bold ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{message.text}</div>}

            <Button type="submit" isLoading={loading} className="w-full py-4 rounded-2xl text-lg shadow-xl shadow-indigo-600/10">
              {mode === 'login' ? 'دخول' : mode === 'register' ? 'إنشاء حساب' : 'إرسال'}
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
            {mode === 'login' ? (
              <button onClick={() => setMode('register')} className="text-indigo-600 font-black hover:underline">أنا جديد، إنشاء حساب</button>
            ) : (
              <button onClick={() => setMode('login')} className="text-indigo-600 font-black hover:underline">لديك حساب؟ سجل دخولك</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
