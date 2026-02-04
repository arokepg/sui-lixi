# 🧧 Sui Red Envelope - Lì Xì On-chain

Một App cho phép người dùng tạo và gửi lì xì SUI coin trên blockchain Sui.

## 📖 Cách sử dụng

### Tạo Lì Xì
1. Kết nối ví Sui (Sui Wallet, Suiet, Ethos, ...)
2. Nhập số lượng SUI muốn gửi
3. Nhập lời chúc (tùy chọn)
4. Bấm "Tạo Lì Xì"
5. Copy link và gửi cho người nhận

### Nhận Lì Xì
1. Mở link được chia sẻ
2. Kết nối ví
3. Bấm "Mở Lì Xì"
4. Chúc mừng! SUI đã vào ví của bạn 🎉

## 🛠 Tech Stack

- **Smart Contract:** Sui Move
- **Frontend:** React + TypeScript + Vite
- **Sui Integration:** @mysten/dapp-kit, @mysten/sui

## 📝 Smart Contract Functions

### `create(coin: Coin<SUI>, message: vector<u8>)`
Tạo một phong bao lì xì mới với số SUI và lời chúc.

### `claim(envelope: RedEnvelope)`
Mở phong bao và nhận SUI bên trong.

## 🎯 Features

- ✅ Tạo lì xì với số SUI tùy chọn
- ✅ Thêm lời chúc vào lì xì
- ✅ Chia sẻ link để bất kỳ ai cũng có thể claim
- ✅ Giao diện đẹp mắt theo phong cách Tết
- ✅ Hiển thị transaction hash sau mỗi giao dịch

## 🔗 Useful Links

- [Sui Documentation](https://docs.sui.io/)
- [dApp Kit Documentation](https://sdk.mystenlabs.com/dapp-kit)
- [Sui Move Book](https://move-book.com/)

## 📄 License

MIT License
