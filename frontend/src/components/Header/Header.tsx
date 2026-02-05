import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { Link } from 'react-router-dom';
import { Settings, Gift } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SettingsModal from '../SettingsModal';
import { formatSuiAddress } from '../../lib/utils';

/**
 * Header component với logo, wallet info, và settings
 */
export function Header() {
  const account = useCurrentAccount();
  const { t } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 text-xl font-bold text-red-primary-600 dark:text-red-primary-400 hover:text-red-primary-700 dark:hover:text-red-primary-300 transition-colors group"
            >
              <Gift className="w-6 h-6 group-hover:animate-shake" />
              <span className="hidden sm:inline">{t('header.title')}</span>
              <span className="sm:hidden">🧧</span>
            </Link>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Wallet Address Display */}
              {account && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                    {formatSuiAddress(account.address)}
                  </span>
                </div>
              )}

              {/* Settings Button */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                aria-label={t('header.settings')}
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Connect Wallet Button */}
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
}
