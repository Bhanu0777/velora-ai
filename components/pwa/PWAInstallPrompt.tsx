import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  if (!deferredPrompt || isDismissed) return null;

  return (
    <div className="fixed top-16 right-6 z-50 bg-velora-surface border border-velora-copper/50 shadow-2xl p-3.5 rounded-xs animate-in fade-in-0 slide-in-from-top-2 duration-300 select-none max-w-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xs bg-velora-elevated border border-velora-border flex items-center justify-center text-velora-copper">
            <Download className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-serif text-xs font-semibold text-velora-text">
              Install VELORA
            </h4>
            <p className="text-[10px] text-velora-textMuted font-sans mt-0.5">
              Install as a standalone desktop or mobile application.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-velora-textMuted hover:text-velora-text p-0.5"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 mt-2.5 pt-2 border-t border-velora-border/60">
        <button
          onClick={() => setIsDismissed(true)}
          className="text-[10px] font-mono text-velora-textMuted hover:text-velora-text px-2 py-0.5"
        >
          Dismiss
        </button>
        <button
          onClick={handleInstall}
          className="px-2.5 py-1 text-[10px] font-mono font-medium bg-velora-copper hover:bg-velora-copperLight text-white rounded-xs transition-colors"
        >
          Install App
        </button>
      </div>
    </div>
  );
};
