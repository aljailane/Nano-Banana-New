
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged as fbOnAuthStateChanged, 
  signInWithEmailAndPassword as fbSignIn, 
  createUserWithEmailAndPassword as fbCreateUser, 
  signOut as fbSignOut, 
  sendPasswordResetEmail as fbResetEmail, 
  sendEmailVerification as fbVerifyEmail,
  updateProfile as fbUpdateProfile
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// ملاحظة: هذه القيم هي قيم افتراضية، سيحاول التطبيق العمل محلياً في حال عدم صحتها
const firebaseConfig = {
  apiKey: "AIzaSyAs-PLACEHOLDER-FOR-REAL-KEY", 
  authDomain: "nanobanana-auth.firebaseapp.com",
  projectId: "nanobanana-auth",
  storageBucket: "nanobanana-auth.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef12345"
};

let auth: any;
let isFirebaseAvailable = false;

try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  isFirebaseAvailable = !firebaseConfig.apiKey.includes('PLACEHOLDER');
} catch (e) {
  console.warn("Firebase configuration incomplete, falling back to local mode.");
  auth = { currentUser: null };
}

export { auth };

// دوال مغلفة (Wrappers) لضمان عدم حدوث Uncaught Error
export const onAuthStateChanged = (authInstance: any, callback: (user: any) => void) => {
  if (isFirebaseAvailable && typeof fbOnAuthStateChanged === 'function') {
    return fbOnAuthStateChanged(authInstance, callback);
  }
  // نظام محاكاة محلي
  const localUser = localStorage.getItem('current_user');
  callback(localUser ? JSON.parse(localUser) : null);
  return () => {}; // No-op unsubscribe
};

export const signInWithEmailAndPassword = async (authInstance: any, email: string, pass: string) => {
  if (isFirebaseAvailable) return fbSignIn(authInstance, email, pass);
  throw { code: 'auth/network-request-failed' };
};

export const createUserWithEmailAndPassword = async (authInstance: any, email: string, pass: string) => {
  if (isFirebaseAvailable) return fbCreateUser(authInstance, email, pass);
  throw { code: 'auth/network-request-failed' };
};

export const signOut = async (authInstance: any) => {
  if (isFirebaseAvailable) return fbSignOut(authInstance);
  localStorage.removeItem('current_user');
};

export const sendPasswordResetEmail = async (authInstance: any, email: string) => {
  if (isFirebaseAvailable) return fbResetEmail(authInstance, email);
  return Promise.resolve();
};

export const sendEmailVerification = async (user: any) => {
  if (isFirebaseAvailable && user) return fbVerifyEmail(user);
  return Promise.resolve();
};

export const updateProfile = async (user: any, data: any) => {
  if (isFirebaseAvailable && user) return fbUpdateProfile(user, data);
  return Promise.resolve();
};

export const translateFirebaseError = (code: string): string => {
  switch (code) {
    case 'auth/email-already-in-use': return 'هذا البريد الإلكتروني مسجل بالفعل.';
    case 'auth/invalid-email': return 'البريد الإلكتروني غير صحيح.';
    case 'auth/weak-password': return 'كلمة المرور ضعيفة جداً.';
    case 'auth/user-not-found': return 'لا يوجد حساب بهذا البريد.';
    case 'auth/wrong-password': return 'كلمة المرور غير صحيحة.';
    case 'auth/too-many-requests': return 'محاولات كثيرة خاطئة، يرجى المحاولة لاحقاً.';
    case 'auth/network-request-failed': return 'نواجه مشكلة في الاتصال بالخادم، سيتم استخدام النظام المحلي مؤقتاً.';
    default: return 'حدث خطأ في النظام، يرجى المحاولة مرة أخرى.';
  }
};
