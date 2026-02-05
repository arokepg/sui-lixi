import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Header
      "header.title": "Sui Red Envelope",
      "header.settings": "Settings",
      "header.connect": "Connect Wallet",
      "header.disconnect": "Disconnect",
      
      // Home / Create Envelope
      "create.title": "Create Red Envelope",
      "create.subtitle": "Send SUI tokens in a lucky red envelope",
      "create.amount": "Amount (SUI)",
      "create.amountPlaceholder": "Enter amount",
      "create.message": "Message",
      "create.messagePlaceholder": "Best wishes for you!",
      "create.button": "Create Envelope",
      "create.creating": "Creating...",
      "create.success": "Red envelope created successfully!",
      "create.error": "Failed to create envelope",
      "create.copyLink": "Copy Link",
      "create.linkCopied": "Link copied!",
      "create.shareTitle": "Share this link:",
      
      // Claim Envelope
      "claim.title": "Red Envelope",
      "claim.from": "From",
      "claim.message": "Message",
      "claim.amount": "Amount",
      "claim.button": "Open Envelope",
      "claim.claiming": "Opening...",
      "claim.success": "Congratulations!",
      "claim.received": "You received",
      "claim.error": "Failed to claim envelope",
      "claim.notFound": "Envelope not found or already claimed",
      "claim.loading": "Loading envelope information...",
      "claim.alreadyClaimed": "This envelope has been claimed",
      "claim.youHaveEnvelope": "You have a Red Envelope!",
      "claim.openToReceive": "Open to receive your gift! 🎉",
      "claim.amountLabel": "💰 Amount:",
      "claim.senderLabel": "👤 Sender:",
      "claim.wishLabel": "💌 Message:",
      "claim.connectWallet": "⚠️ Please connect your wallet to claim",
      "claim.backToHome": "Back to home",
      "claim.createNew": "🧧 Create new envelope",
      "claim.errorTitle": "Oops!",
      "claim.loadingError": "Error loading envelope. It may have been claimed already.",
      "claim.idNotFound": "Envelope ID not found in URL",
      
      // Settings Modal
      "settings.title": "Settings",
      "settings.theme": "Theme",
      "settings.theme.light": "Light",
      "settings.theme.dark": "Dark",
      "settings.language": "Language",
      "settings.language.en": "English",
      "settings.language.vi": "Tiếng Việt",
      "settings.close": "Close",
      
      // Common
      "common.loading": "Loading...",
      "common.error": "Error",
      "common.success": "Success",
      "common.cancel": "Cancel",
      "common.confirm": "Confirm",
      
      // Errors
      "error.walletNotConnected": "Please connect your wallet",
      "error.insufficientBalance": "Insufficient balance",
      "error.invalidAmount": "Invalid amount",
      "error.networkError": "Network error, please try again",
    }
  },
  vi: {
    translation: {
      // Header
      "header.title": "Lì Xì Sui",
      "header.settings": "Cài đặt",
      "header.connect": "Kết nối Ví",
      "header.disconnect": "Ngắt kết nối",
      
      // Home / Create Envelope
      "create.title": "Tạo Phong Bao Lì Xì",
      "create.subtitle": "Gửi SUI trong phong bao may mắn",
      "create.amount": "Số tiền (SUI)",
      "create.amountPlaceholder": "Nhập số tiền",
      "create.message": "Lời chúc",
      "create.messagePlaceholder": "Chúc bạn vạn sự như ý!",
      "create.button": "Tạo Lì Xì",
      "create.creating": "Đang tạo...",
      "create.success": "Tạo lì xì thành công!",
      "create.error": "Không thể tạo lì xì",
      "create.copyLink": "Sao chép Link",
      "create.linkCopied": "Đã sao chép!",
      "create.shareTitle": "Chia sẻ link này:",
      
      // Claim Envelope
      "claim.title": "Phong Bao Lì Xì",
      "claim.from": "Từ",
      "claim.message": "Lời chúc",
      "claim.amount": "Số tiền",
      "claim.button": "Mở Lì Xì",
      "claim.claiming": "Đang mở...",
      "claim.success": "Chúc Mừng!",
      "claim.received": "Bạn đã nhận được",
      "claim.error": "Không thể nhận lì xì",
      "claim.notFound": "Không tìm thấy lì xì hoặc đã được mở",
      "claim.loading": "Đang tải thông tin lì xì...",
      "claim.alreadyClaimed": "Lì xì này đã được nhận",
      "claim.youHaveEnvelope": "Bạn có một Lì Xì!",
      "claim.openToReceive": "Mở để nhận quà nhé! 🎉",
      "claim.amountLabel": "💰 Số tiền:",
      "claim.senderLabel": "👤 Người gửi:",
      "claim.wishLabel": "💌 Lời chúc:",
      "claim.connectWallet": "⚠️ Vui lòng kết nối ví để nhận lì xì",
      "claim.backToHome": "Quay về trang chủ",
      "claim.createNew": "🧧 Tạo lì xì mới",
      "claim.errorTitle": "Oops!",
      "claim.loadingError": "Lỗi khi tải thông tin lì xì. Có thể lì xì đã được mở.",
      "claim.idNotFound": "Không tìm thấy ID lì xì trong URL",
      
      // Settings Modal
      "settings.title": "Cài đặt",
      "settings.theme": "Giao diện",
      "settings.theme.light": "Sáng",
      "settings.theme.dark": "Tối",
      "settings.language": "Ngôn ngữ",
      "settings.language.en": "English",
      "settings.language.vi": "Tiếng Việt",
      "settings.close": "Đóng",
      
      // Common
      "common.loading": "Đang tải...",
      "common.error": "Lỗi",
      "common.success": "Thành công",
      "common.cancel": "Hủy",
      "common.confirm": "Xác nhận",
      
      // Errors
      "error.walletNotConnected": "Vui lòng kết nối ví",
      "error.insufficientBalance": "Số dư không đủ",
      "error.invalidAmount": "Số tiền không hợp lệ",
      "error.networkError": "Lỗi mạng, vui lòng thử lại",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('sui-lixi-language') || 'vi', // Default to Vietnamese
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
