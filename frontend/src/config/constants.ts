// Cấu hình constants cho dApp
export const CONSTANTS = {
  // Package ID sau khi deploy contract (cập nhật sau khi publish)
  PACKAGE_ID: "0x77112d8019f95515dec51e8f522db9ebdeee8915825e45689a356106dd8db4d9",
  
  // Module name
  MODULE_NAME: "red_envelope",
  
  // Network configuration
  NETWORK: "testnet" as const,
  
  // SUI decimals (1 SUI = 10^9 MIST)
  SUI_DECIMALS: 9,
  
  // Minimum amount (0.000001 SUI)
  MIN_AMOUNT: 0.000001,
};

// Helper function để convert SUI sang MIST
export const suiToMist = (sui: number): bigint => {
  return BigInt(Math.floor(sui * Math.pow(10, CONSTANTS.SUI_DECIMALS)));
};

// Helper function để convert MIST sang SUI
export const mistToSui = (mist: bigint | number): number => {
  return Number(mist) / Math.pow(10, CONSTANTS.SUI_DECIMALS);
};
