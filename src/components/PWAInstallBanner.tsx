import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOS, setShowIOS] = useState(false);

  useEffect(() => {
    // Detect iOS Safari
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const standalone = ("standalone" in navigator) && (navigator as { standalone?: boolean }).standalone;
    if (ios && !standalone) {
      setIsIOS(true);
      const dismissed = localStorage.getItem("pwa-ios-dismissed");
      if (!dismissed) setShowIOS(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setPrompt(null);
    setDismissed(true);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setPrompt(null);
    setShowIOS(false);
    if (isIOS) localStorage.setItem("pwa-ios-dismissed", "1");
  };

  const visible = (!!prompt && !dismissed) || (showIOS && !dismissed);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm"
        >
          <div className="bg-white border border-border rounded-2xl shadow-2xl p-4 flex items-center gap-3">
            <img src="/icon/icon-192.png" alt="الصفاة" className="w-12 h-12 rounded-xl flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-foreground">ثبّت تطبيق الصفاة</p>
              {isIOS ? (
                <p className="text-xs text-muted-foreground mt-0.5">
                  اضغط <strong>مشاركة</strong> ثم <strong>إضافة للشاشة الرئيسية</strong>
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mt-0.5">ثبّت التطبيق على جهازك للوصول السريع</p>
              )}
            </div>
            {!isIOS && (
              <Button size="sm" className="gap-1.5 flex-shrink-0 text-xs" onClick={handleInstall}>
                <Download className="w-3.5 h-3.5" />
                تثبيت
              </Button>
            )}
            <button
              onClick={handleDismiss}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer flex-shrink-0"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
