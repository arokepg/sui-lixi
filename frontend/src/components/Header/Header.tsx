import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { Link } from 'react-router-dom';
import './Header.css';

/**
 * Header component với logo và nút Connect Wallet
 */
export function Header() {
  const account = useCurrentAccount();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          🧧 Sui Red Envelope
        </Link>
        
        <nav className="nav-links">
          <Link to="/" className="nav-link">Tạo Lì Xì</Link>
          {account && (
            <span className="wallet-info">
              {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </span>
          )}
          <ConnectButton />
        </nav>
      </div>
    </header>
  );
}
