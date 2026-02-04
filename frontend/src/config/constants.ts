// Cấu hình constants cho dApp
export const CONSTANTS = {
  // Package ID sau khi deploy contract (cập nhật sau khi publish)
  PACKAGE_ID: "0xYOUR_PACKAGE_ID_HERE",
  
  // Module name
  MODULE_NAME: "red_envelope",
  
  // Network configuration
  NETWORK: "testnet" as const,
  
  // SUI decimals (1 SUI = 10^9 MIST)
  SUI_DECIMALS: 9,
  
  // Minimum amount (0.01 SUI)
  MIN_AMOUNT: 0.01,
};

// Helper function để convert SUI sang MIST
export const suiToMist = (sui: number): bigint => {
  return BigInt(Math.floor(sui * Math.pow(10, CONSTANTS.SUI_DECIMALS)));
};

// Helper function để convert MIST sang SUI
export const mistToSui = (mist: bigint | number): number => {
  return Number(mist) / Math.pow(10, CONSTANTS.SUI_DECIMALS);
};
