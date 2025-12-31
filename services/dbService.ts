
export interface User {
  id: string;
  name: string;
  email: string;
  joinedAt: number;
  role?: 'user' | 'admin';
}

export interface AIProcess {
  id: string;
  userId: string; // 'guest' or actual user ID
  userName: string;
  type: 'generation' | 'editing' | 'enhancement' | 'removal';
  timestamp: number;
  status: 'success' | 'error';
  model: string;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  borderRadius: string; 
}

export interface AppSettings {
  activeModel: string;
  darkMode: boolean;
  exportFormat: string;
  adminPassword?: string; 
  adminEmail: string; 
  isFirstRun: boolean;
  siteName: string;
  allowPublicSettings: boolean;
  theme: ThemeConfig;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  servicesList: Array<{title: string, description: string, icon: string}>;
  smtpHost: string;
  smtpUser: string;
  smtpFrom: string;
}

export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  isPro: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  activeModel: 'gemini-2.5-flash-image',
  darkMode: false,
  exportFormat: 'png',
  adminEmail: 'darhost56@gmail.com',
  isFirstRun: true,
  siteName: 'نانو بانانا الذكي',
  allowPublicSettings: true,
  theme: {
    primaryColor: '#4f46e5', 
    secondaryColor: '#0d9488', 
    borderRadius: '1.5rem', 
  },
  contactEmail: 'support@nanobanana.com',
  contactPhone: '+966 500 000 000',
  contactAddress: 'الرياض، المملكة العربية السعودية',
  servicesList: [
    { title: 'تحسين الصور', description: 'تحسين جودة الصور القديمة والمنخفضة الدقة.', icon: 'bolt' },
    { title: 'إزالة الخلفية', description: 'إزالة الخلفية من أي صورة بضغطة زر.', icon: 'scissors' },
    { title: 'تلوين الصور', description: 'تحويل الصور الأبيض والأسود إلى صور ملونة زاهية.', icon: 'magic' }
  ],
  smtpHost: 'smtp.gmail.com',
  smtpUser: 'darhost56@gmail.com',
  smtpFrom: 'noreply@nanobanana.com',
};

const DEFAULT_MODELS: ModelConfig[] = [
  { id: 'gemini-2.5-flash-image', name: 'Gemini 2.5 Flash', description: 'نموذج سريع ومتوازن.', enabled: true, isPro: false },
  { id: 'gemini-3-pro-image-preview', name: 'Gemini 3.0 Pro', description: 'أعلى جودة ودقة.', enabled: true, isPro: true }
];

class DatabaseService {
  private dbName = 'NanoBananaDB';
  private dbVersion = 9;
  private db: IDBDatabase | null = null;
  private stateCache: { settings: AppSettings; models: ModelConfig[] } = {
    settings: DEFAULT_SETTINGS,
    models: DEFAULT_MODELS
  };

  constructor() {
    this.initialize();
  }

  async initialize(): Promise<void> {
    return new Promise((resolve) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('models')) db.createObjectStore('models', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('users')) db.createObjectStore('users', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('processes')) db.createObjectStore('processes', { keyPath: 'id' });
      };
      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.loadDataIntoCache().then(resolve);
      };
    });
  }

  private async loadDataIntoCache() {
    if (!this.db) return;
    const settingsTx = this.db.transaction(['settings'], 'readonly');
    const settingsReq = settingsTx.objectStore('settings').get('main_settings');
    settingsReq.onsuccess = () => {
      if (settingsReq.result) this.stateCache.settings = { ...DEFAULT_SETTINGS, ...settingsReq.result };
    };

    const modelsTx = this.db.transaction(['models'], 'readonly');
    const modelsReq = modelsTx.objectStore('models').getAll();
    modelsReq.onsuccess = () => {
      if (modelsReq.result && modelsReq.result.length > 0) this.stateCache.models = modelsReq.result;
    };
  }

  getSettings(): AppSettings { return this.stateCache.settings; }
  getModels(): ModelConfig[] { return this.stateCache.models; }

  updateSettings(settings: Partial<AppSettings>) {
    const updated = { ...this.stateCache.settings, ...settings };
    this.stateCache.settings = updated;
    if (this.db) {
      const tx = this.db.transaction(['settings'], 'readwrite');
      tx.objectStore('settings').put({ id: 'main_settings', ...updated });
    }
    return updated;
  }

  updateModel(modelId: string, updates: Partial<ModelConfig>) {
    const index = this.stateCache.models.findIndex(m => m.id === modelId);
    if (index !== -1) {
      this.stateCache.models[index] = { ...this.stateCache.models[index], ...updates };
      if (this.db) {
        const tx = this.db.transaction(['models'], 'readwrite');
        tx.objectStore('models').put(this.stateCache.models[index]);
      }
    }
    return [...this.stateCache.models];
  }

  async getAllUsers(): Promise<User[]> {
    return new Promise((resolve) => {
      if (!this.db) return resolve([]);
      const tx = this.db.transaction(['users'], 'readonly');
      const req = tx.objectStore('users').getAll();
      req.onsuccess = () => resolve(req.result);
    });
  }

  async deleteUser(userId: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.db) return resolve();
      const tx = this.db.transaction(['users'], 'readwrite');
      const req = tx.objectStore('users').delete(userId);
      req.onsuccess = () => resolve();
    });
  }

  async logProcess(process: Omit<AIProcess, 'id'>): Promise<void> {
    return new Promise((resolve) => {
      if (!this.db) return resolve();
      const id = Math.random().toString(36).substr(2, 9);
      const tx = this.db.transaction(['processes'], 'readwrite');
      tx.objectStore('processes').put({ id, ...process });
      tx.oncomplete = () => resolve();
    });
  }

  async getAllProcesses(): Promise<AIProcess[]> {
    return new Promise((resolve) => {
      if (!this.db) return resolve([]);
      const tx = this.db.transaction(['processes'], 'readonly');
      const req = tx.objectStore('processes').getAll();
      req.onsuccess = () => resolve(req.result.sort((a: any, b: any) => b.timestamp - a.timestamp));
    });
  }

  getGuestActionCount(): number {
    return parseInt(localStorage.getItem('guest_action_count') || '0');
  }

  incrementGuestActionCount(): number {
    const current = this.getGuestActionCount();
    const next = current + 1;
    localStorage.setItem('guest_action_count', next.toString());
    return next;
  }

  async registerUserLocally(name: string, email: string): Promise<User> {
    const user: User = { id: Math.random().toString(36).substr(2, 9), name, email, joinedAt: Date.now() };
    if (this.db) {
      const tx = this.db.transaction(['users'], 'readwrite');
      tx.objectStore('users').put(user);
    }
    localStorage.setItem('current_user', JSON.stringify(user));
    return user;
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
  }

  logoutUser() { localStorage.removeItem('current_user'); }
  startSession() { const expiry = Date.now() + (60 * 60 * 1000); localStorage.setItem('admin_session_expiry', expiry.toString()); }
  endSession() { localStorage.removeItem('admin_session_expiry'); }
  isSessionValid(): boolean { const expiry = localStorage.getItem('admin_session_expiry'); return expiry ? Date.now() < parseInt(expiry) : false; }
  verifyPassword(input: string): boolean { return input === this.stateCache.settings.adminPassword; }
  async verifyAndResetPassword(token: string, pass: string): Promise<void> { return new Promise((resolve) => setTimeout(resolve, 1000)); }
  async verifyUserAccount(token: string): Promise<void> { return new Promise((resolve) => setTimeout(resolve, 1000)); }
}

export const db = new DatabaseService();
