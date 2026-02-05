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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200 dark:border-slate-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('settings.title')}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Theme Selector */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                  {theme === 'light' ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                  {t('settings.theme')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={cn(
                      'flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all',
                      theme === 'light'
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600'
                    )}
                  >
                    <Sun className="w-4 h-4" />
                    {t('settings.theme.light')}
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={cn(
                      'flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all',
                      theme === 'dark'
                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600'
                    )}
                  >
                    <Moon className="w-4 h-4" />
                    {t('settings.theme.dark')}
                  </button>
                </div>
              </div>

              {/* Language Selector */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                  <Languages className="w-4 h-4" />
                  {t('settings.language')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => changeLanguage('vi')}
                    className={cn(
                      'px-4 py-3 rounded-xl font-medium transition-all',
                      i18n.language === 'vi'
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600'
                    )}
                  >
                    🇻🇳 {t('settings.language.vi')}
                  </button>
                  <button
                    onClick={() => changeLanguage('en')}
                    className={cn(
                      'px-4 py-3 rounded-xl font-medium transition-all',
                      i18n.language === 'en'
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600'
                    )}
                  >
                    🇺🇸 {t('settings.language.en')}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0">
              <button
                onClick={onClose}
                className="w-full py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition-colors"
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
