import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CONSTANTS } from './constants';

// Cấu hình networks với URL endpoints và network type
const { networkConfig } = createNetworkConfig({
  localnet: { url: 'http://127.0.0.1:9000', network: 'localnet' },
  devnet: { url: 'https://fullnode.devnet.sui.io:443', network: 'devnet' },
  testnet: { url: 'https://fullnode.testnet.sui.io:443', network: 'testnet' },
  mainnet: { url: 'https://fullnode.mainnet.sui.io:443', network: 'mainnet' },
});

// Tạo Query Client cho React Query
const queryClient = new QueryClient();

interface SuiProvidersProps {
  children: React.ReactNode;
}

/**
 * Component wrapper bọc toàn bộ app với các providers cần thiết
 * - QueryClientProvider: Cho React Query (caching, state management)
 * - SuiClientProvider: Kết nối với Sui network
 * - WalletProvider: Quản lý wallet connections
 */
export function SuiProviders({ children }: SuiProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork={CONSTANTS.NETWORK}>
        <WalletProvider autoConnect>
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
