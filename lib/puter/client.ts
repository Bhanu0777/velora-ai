// Global Puter type declarations
declare global {
  interface Window {
    puter?: {
      auth: {
        isSignedIn: () => boolean;
        signIn: (options?: { attempt_temp_user_creation?: boolean; request_auth?: boolean }) => Promise<any>;
        signOut: () => Promise<void>;
        getUser: () => Promise<{ username: string; uuid?: string; email?: string }>;
      };
      ai: {
        chat: (
          prompt: string | Array<{ role: string; content: string }>,
          options?: { model?: string; stream?: boolean; temperature?: number; max_tokens?: number }
        ) => Promise<any>;
        listModels: () => Promise<string[]>;
      };
      kv: {
        set: (key: string, value: any) => Promise<void>;
        get: (key: string) => Promise<any>;
        del: (key: string) => Promise<void>;
        incr: (key: string, amount?: number) => Promise<number>;
        decr: (key: string, amount?: number) => Promise<number>;
        list: (options?: { pattern?: string; limit?: number; cursor?: string }) => Promise<{ items: string[]; cursor?: string }>;
      };
      fs?: {
        mkdir: (path: string) => Promise<void>;
        write: (path: string, content: string | Blob) => Promise<void>;
        read: (path: string) => Promise<string>;
      };
      hosting?: {
        create: (subdomain: string, dir: string) => Promise<{ subdomain: string }>;
        list: () => Promise<any>;
        delete: (subdomain: string) => Promise<void>;
      };
      print?: (content: any) => void;
      randName?: () => string;
    };
  }
}

let loadPromise: Promise<boolean> | null = null;

export function ensurePuterLoaded(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.puter) return Promise.resolve(true);

  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve) => {
    // Check if script tag is already in DOM
    const existing = document.querySelector('script[src*="js.puter.com"]');
    if (existing) {
      const interval = setInterval(() => {
        if (window.puter) {
          clearInterval(interval);
          resolve(true);
        }
      }, 50);
      setTimeout(() => {
        clearInterval(interval);
        resolve(Boolean(window.puter));
      }, 5000);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.puter.com/v2/';
    script.async = true;
    script.onload = () => {
      resolve(Boolean(window.puter));
    };
    script.onerror = () => {
      console.warn('Puter.js script failed to load from CDN. Falling back to local offline mode.');
      resolve(false);
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

