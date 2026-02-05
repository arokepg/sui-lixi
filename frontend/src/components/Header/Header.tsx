import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SettingsModal from '../SettingsModal';
import { formatSuiAddress } from '../../lib/utils';

/**
 * Red Envelope Icon Component
 */
function RedEnvelopeIcon({ className }: { className?: string }) {
  return (
    <span className={className} role="img" aria-label="red envelope">
      🧧
    </span>
  );
}

/**
 * Header component với logo, wallet info, và settings
 */
export function Header() {
  const account = useCurrentAccount();
  const { t } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-red-primary-200 dark:border-red-primary-900/50 bg-gradient-to-r from-red-primary-600/95 to-red-primary-500/95 dark:from-red-primary-900/95 dark:to-red-primary-800/95 backdrop-blur-lg shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 text-xl font-bold text-white hover:text-gold-200 transition-colors group"
            >
              <RedEnvelopeIcon className="text-2xl group-hover:animate-shake" />
              <span className="hidden sm:inline">{t('header.title')}</span>
              <span className="sm:hidden">🧧</span>
            </Link>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Wallet Address Display */}
              {account && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/20 dark:bg-black/20 rounded-lg border border-white/30 dark:border-white/10">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-mono text-white/90">
                    {formatSuiAddress(account.address)}
                  </span>
                </div>
              )}

              {/* Settings Button */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 text-white/80 hover:text-white transition-colors"
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
