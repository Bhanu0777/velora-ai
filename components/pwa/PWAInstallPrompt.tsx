import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '../ui/button';

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
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-card border border-editorial-bronze/40 shadow-2xl p-4 rounded-sm animate-in slide-in-from-bottom-4 duration-300 select-none">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-editorial-charcoal border border-editorial-borderDark flex items-center justify-center text-editorial-bronze">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif text-sm font-semibold text-foreground tracking-tight">
              Install VELORA PWA
            </h4>
            <p className="text-[11px] text-muted-foreground font-sans leading-tight mt-0.5">
              Access your workspace offline directly from your home screen or dock.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-muted-foreground hover:text-foreground p-0.5"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 mt-3 pt-2.5 border-t border-border/40">
        <button
          onClick={() => setIsDismissed(true)}
          className="text-[11px] font-mono text-muted-foreground hover:text-foreground px-2 py-1"
        >
          Not Now
        </button>
        <Button
          variant="editorial"
          size="sm"
          onClick={handleInstall}
          className="text-xs"
        >
          Install App
        </Button>
      </div>
    </div>
  );
};

