import { X, Sun, Moon, Languages } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('sui-lixi-language', lng);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className={cn(
              "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl shadow-2xl z-50 overflow-hidden border-2",
              theme === 'light' 
                ? "bg-white text-gray-900 border-gray-200" 
                : "bg-[#141213] text-gray-100 border-red-primary-900"
            )}
          >
            {/* Header */}
            <div className={cn(
              "flex items-center justify-between p-6 border-b",
              theme === 'light' 
                ? "bg-white border-gray-200" 
                : "bg-[#141213] border-red-primary-900"
            )}>
              <h2 className={cn(
                "text-2xl font-bold flex items-center gap-2",
                theme === 'light' ? "text-gray-900" : "text-red-primary-200"
              )}>
                <span>🧧</span>
                {t('settings.title')}
              </h2>
              <button
                onClick={onClose}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  theme === 'light' 
                    ? "hover:bg-gray-100 text-gray-800" 
                    : "hover:bg-red-primary-900/60 text-red-primary-200"
                )}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className={cn(
              "p-6 space-y-6",
              theme === 'light' ? "bg-white" : "bg-[#141213]"
            )}>
              {/* Theme Selector */}
              <div>
                <label className={cn(
                  "flex items-center gap-2 text-sm font-semibold mb-3",
                  theme === 'light' ? "text-gray-900" : "text-gray-100"
                )}>
                  {theme === 'light' ? (
                    <Sun className="w-4 h-4 text-amber-600" />
                  ) : (
                    <Moon className="w-4 h-4 text-amber-300" />
                  )}
                  {t('settings.theme')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={cn(
                      'flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all',
                      theme === 'light'
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/40 border border-amber-300'
                        : 'bg-[#1f1b1c] text-gray-200 hover:bg-[#2a2527] border border-[#3a3234]'
                    )}
                  >
                    <Sun className="w-4 h-4" />
                    {t('settings.theme.light')}
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={cn(
                      'flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all',
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/40 border border-red-500'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    )}
                  >
                    <Moon className="w-4 h-4" />
                    {t('settings.theme.dark')}
                  </button>
                </div>
              </div>

              {/* Language Selector */}
              <div>
                <label className={cn(
                  "flex items-center gap-2 text-sm font-semibold mb-3",
                  theme === 'light' ? "text-gray-900" : "text-gray-100"
                )}>
                  <Languages className={cn(
                    "w-4 h-4",
                    theme === 'light' ? "text-gray-900" : "text-red-primary-300"
                  )} />
                  {t('settings.language')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => changeLanguage('vi')}
                    className={cn(
                      'px-4 py-3 rounded-xl font-semibold transition-all',
                      i18n.language === 'vi'
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/40 border border-red-400'
                        : theme === 'light' 
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300' 
                          : 'bg-[#1f1b1c] text-gray-200 hover:bg-[#2a2527] border border-[#3a3234]'
                    )}
                  >
                    🇻🇳 {t('settings.language.vi')}
                  </button>
                  <button
                    onClick={() => changeLanguage('en')}
                    className={cn(
                      'px-4 py-3 rounded-xl font-semibold transition-all',
                      i18n.language === 'en'
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/40 border border-red-400'
                        : theme === 'light' 
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300' 
                          : 'bg-[#1f1b1c] text-gray-200 hover:bg-[#2a2527] border border-[#3a3234]'
                    )}
                  >
                    🇺🇸 {t('settings.language.en')}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={cn(
              "p-6 pt-0",
              theme === 'light' ? "bg-white" : "bg-[#141213]"
            )}>
              <button
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                {t('settings.close')}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
