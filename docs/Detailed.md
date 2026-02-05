# 🧧 Sui Lixi - Red Envelope dApp on Sui Blockchain

> **Mang văn hóa lì xì truyền thống Việt Nam lên blockchain**  
> *Bringing Vietnamese traditional red envelope culture to the blockchain*

---

## 📖 Mục Lục / Table of Contents

1. [Giới Thiệu / Introduction](#giới-thiệu--introduction)
2. [Ý Tưởng / Concept](#ý-tưởng--concept)
3. [Công Nghệ / Technology Stack](#công-nghệ--technology-stack)
4. [Kiến Trúc / Architecture](#kiến-trúc--architecture)
5. [Tính Năng / Features](#tính-năng--features)
6. [Ứng Dụng Sui Blockchain](#ứng-dụng-sui-blockchain)
7. [Demo / Screenshots](#demo--screenshots)
8. [Hướng Phát Triển Tương Lai](#hướng-phát-triển-tương-lai)
9. [Cài Đặt / Installation](#cài-đặt--installation)

---

## 🎯 Giới Thiệu / Introduction

### Tiếng Việt

**Sui Lixi** là một ứng dụng phi tập trung (dApp) được xây dựng trên Sui blockchain, cho phép người dùng tạo và gửi phong bao lì xì kỹ thuật số chứa SUI token. Dự án kết hợp giữa văn hóa truyền thống Việt Nam trong dịp Tết Nguyên Đán với công nghệ blockchain hiện đại, mang đến trải nghiệm tặng quà an toàn, nhanh chóng và đầy ý nghĩa.

### English

**Sui Lixi** is a decentralized application (dApp) built on the Sui blockchain that enables users to create and send digital red envelopes containing SUI tokens. This project bridges Vietnamese Lunar New Year traditions with modern blockchain technology, offering a secure, fast, and meaningful gifting experience.

---

## 💡 Ý Tưởng / Concept

### Vấn Đề / Problem

**Tiếng Việt:**
- Lì xì truyền thống yêu cầu gặp mặt trực tiếp, khó khăn với người thân ở xa
- Chuyển tiền ngân hàng thiếu đi sự may mắn và cảm xúc của lì xì
- Không có cách nào để lưu trữ lời chúc Tết gắn liền với món quà tiền mặt

**English:**
- Traditional red envelopes require in-person meetings, challenging for distant relatives
- Bank transfers lack the luck and emotion of red envelopes
- No way to preserve Tet wishes alongside monetary gifts

### Giải Pháp / Solution

**Tiếng Việt:**
- **Blockchain-based Red Envelopes**: Tạo phong bao lì xì số hóa trên Sui blockchain
- **Lưu Trữ Vĩnh Viễn**: Lời chúc và thông tin giao dịch được lưu trữ bất biến on-chain
- **Chia Sẻ Dễ Dàng**: Gửi lì xì qua link, không giới hạn khoảng cách
- **Minh Bạch & An Toàn**: Tận dụng tính minh bạch và bảo mật của blockchain
- **Trải Nghiệm Văn Hóa**: Giao diện thiết kế đậm chất Tết Việt Nam

**English:**
- **Blockchain-based Red Envelopes**: Create digital red envelopes on Sui blockchain
- **Permanent Storage**: Wishes and transaction data stored immutably on-chain
- **Easy Sharing**: Send red envelopes via link, no distance limits
- **Transparent & Secure**: Leverage blockchain transparency and security
- **Cultural Experience**: UI designed with Vietnamese Tet aesthetics

---

## 🛠️ Công Nghệ / Technology Stack

### Frontend

```typescript
- React 18 + TypeScript
- Vite (Build Tool)
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- React Router DOM (Navigation)
- i18next (Internationalization)
```

### Blockchain Integration

```typescript
- Sui TypeScript SDK (@mysten/sui.js)
- Sui dApp Kit (@mysten/dapp-kit)
- Move Smart Contracts
```

### UI/UX Libraries

```typescript
- Lucide React (Icons)
- Canvas Confetti (Celebrations)
- Custom Tet-themed Animations (Cherry Blossoms, Lanterns)
```

### Deployment

```typescript
- Frontend: Vercel
- Smart Contract: Sui Testnet/Mainnet
- Version Control: Git + GitHub
```

---

## 🏗️ Kiến Trúc / Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │Create Envelope│  │Claim Envelope│  │  Settings    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Sui dApp Kit (Wallet Integration)          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Connect Wallet│  │Sign TX      │  │Query Objects │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  Sui Blockchain Layer                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Move Smart Contract                     │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐ │   │
│  │  │   Create   │  │   Claim    │  │  Storage   │ │   │
│  │  └────────────┘  └────────────┘  └────────────┘ │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Smart Contract Structure

```move
module red_envelope::red_envelope {
    // Data Structure
    public struct RedEnvelope has key {
        id: UID,
        sender: address,      // Người gửi / Sender
        balance: Balance<SUI>, // Số tiền / Amount
        message: vector<u8>,   // Lời chúc / Message
    }
    
    // Main Functions
    public fun create(...)    // Tạo lì xì / Create envelope
    public fun claim(...)     // Nhận lì xì / Claim envelope
}
```

### Data Flow

#### Creating Red Envelope
```
User Input → React Component → Transaction Builder → 
Sign & Execute → Move Contract → Object Created → 
Return Object ID → Generate Share Link
```

#### Claiming Red Envelope
```
Share Link → Extract Object ID → Fetch Object Data → 
Display Info → User Confirms → Transaction → 
Transfer Balance → Success Animation
```

---

## ✨ Tính Năng / Features

### 🎨 Giao Diện Văn Hóa / Cultural Interface

**Tiếng Việt:**
- Thiết kế đậm chất Tết Việt Nam với icon lì xì 🧧, đèn lồng 🏮, hoa đào 🌸
- Animation hoa đào rơi rải rác khắp màn hình
- Màu đỏ may mắn và vàng kim phú quý
- Hiệu ứng confetti khi nhận lì xì thành công

**English:**
- Vietnamese Tet-themed design with red envelopes 🧧, lanterns 🏮, cherry blossoms 🌸
- Scattered falling cherry blossom animations
- Lucky red and golden prosperity colors
- Confetti effects on successful claim

### 🌓 Dark/Light Mode

**Tiếng Việt:**
- Hỗ trợ chế độ sáng/tối
- Tự động theo hệ thống hoặc chọn thủ công
- Chuyển đổi mượt mà với Framer Motion
- Màu sắc tối ưu cho cả hai chế độ

**English:**
- Dark/Light mode support
- Auto-detect system preference or manual selection
- Smooth transitions with Framer Motion
- Optimized colors for both modes

### 🌍 Đa Ngôn Ngữ / Internationalization

**Tiếng Việt:**
- Hỗ trợ Tiếng Việt và English
- Chuyển đổi ngôn ngữ real-time
- Lưu tự động vào localStorage
- Tất cả UI components đều được dịch

**English:**
- Vietnamese and English support
- Real-time language switching
- Auto-save to localStorage
- All UI components translated

### 💰 Tạo Lì Xì / Create Red Envelope

**Tiếng Việt:**
- Nhập số tiền SUI muốn tặng
- Thêm lời chúc Tết cá nhân hóa
- Tạo transaction on-chain với Move smart contract
- Nhận link chia sẻ ngay lập tức
- Copy link một click
- Xem transaction trên Sui Explorer

**English:**
- Enter SUI amount to gift
- Add personalized Tet wishes
- Create on-chain transaction with Move smart contract
- Receive instant shareable link
- One-click link copy
- View transaction on Sui Explorer

### 🎁 Nhận Lì Xì / Claim Red Envelope

**Tiếng Việt:**
- Mở link nhận được
- Xem số tiền, người gửi, lời chúc
- Kết nối ví để nhận
- Hiệu ứng animation khi nhận thành công
- Confetti celebration
- Có thể tạo lì xì mới ngay sau khi nhận

**English:**
- Open received link
- View amount, sender, message
- Connect wallet to claim
- Success animation on claim
- Confetti celebration
- Create new envelope immediately after claiming

### 🔐 Bảo Mật / Security

**Tiếng Việt:**
- Lì xì chỉ có thể nhận một lần (single-use)
- Transaction được xác thực bởi Sui blockchain
- Không thể fake hoặc duplicate
- Wallet authentication required

**English:**
- Single-use red envelopes
- Transactions verified by Sui blockchain
- Cannot be faked or duplicated
- Wallet authentication required

---

## 🔗 Ứng Dụng Sui Blockchain

### Tại Sao Chọn Sui? / Why Sui?

**Tiếng Việt:**

1. **Tốc Độ Cao (High Speed)**
   - Sui xử lý transaction cực nhanh (~400ms finality)
   - Người dùng nhận lì xì gần như tức thì
   - Không phải chờ đợi confirmation lâu

2. **Chi Phí Thấp (Low Cost)**
   - Gas fee cực thấp (~0.001 SUI)
   - Tạo và gửi nhiều lì xì không tốn kém
   - Phù hợp cho việc tặng quà hàng loạt

3. **Object-Centric Model**
   - Mỗi lì xì là một Object độc lập
   - Dễ dàng quản lý và tracking
   - Ownership rõ ràng

4. **Move Language**
   - An toàn với resource-oriented programming
   - Prevent double-spending tự nhiên
   - Type safety và formal verification

5. **Developer Experience**
   - SDK TypeScript mạnh mẽ
   - dApp Kit integration dễ dàng
   - Excellent documentation

**English:**

1. **High Speed**
   - Sui processes transactions extremely fast (~400ms finality)
   - Users receive red envelopes almost instantly
   - No long confirmation waits

2. **Low Cost**
   - Extremely low gas fees (~0.001 SUI)
   - Creating and sending multiple envelopes is affordable
   - Suitable for bulk gifting

3. **Object-Centric Model**
   - Each red envelope is an independent Object
   - Easy management and tracking
   - Clear ownership

4. **Move Language**
   - Secure with resource-oriented programming
   - Natural double-spending prevention
   - Type safety and formal verification

5. **Developer Experience**
   - Powerful TypeScript SDK
   - Easy dApp Kit integration
   - Excellent documentation

### Sui Features Utilized

```typescript
✅ Object Model: RedEnvelope as owned objects
✅ Transfer Functions: Built-in transfer mechanisms
✅ Balance Type: Safe SUI token handling
✅ Transaction Builder: Composable transactions
✅ Event Emission: Track envelope creation/claims
✅ Object Ownership: Secure transfer of ownership
✅ Gas Optimization: Efficient Move code
```

### Smart Contract Highlights

```move
// Key Features in Move Contract

1. Object Wrapping
   - RedEnvelope wraps Balance<SUI>
   - Ensures single-use claim
   
2. Transfer on Claim
   - Automatic transfer to claimer
   - No manual withdraw needed
   
3. Message Storage
   - UTF-8 encoded messages on-chain
   - Permanent wish preservation
   
4. Sender Tracking
   - Store sender address
   - Enable sender history queries
```

---

## 🎬 Demo / Screenshots

### 1. Create Envelope Page
```
┌─────────────────────────────────────┐
│     🧧 Create Red Envelope          │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Amount (SUI)     [0.5    ] SUI│ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │ Message                        │ │
│  │ [Chúc mừng năm mới!]          │ │
│  └───────────────────────────────┘ │
│                                     │
│  [  🧧 Create Envelope  ]          │
└─────────────────────────────────────┘
```

### 2. Claim Envelope Page
```
┌─────────────────────────────────────┐
│   🧧 Bạn có một Lì Xì!              │
│                                     │
│  💰 Số tiền: 0.5000 SUI             │
│  👤 Người gửi: 0x1234...5678        │
│  💌 Lời chúc:                       │
│     "Chúc mừng năm mới!"           │
│                                     │
│  [     🎉 Mở Lì Xì     ]           │
└─────────────────────────────────────┘
```

### 3. Success Page
```
┌─────────────────────────────────────┐
│          🧧                          │
│      Chúc Mừng!                     │
│                                     │
│   Bạn đã nhận được                  │
│      0.5000 SUI                     │
│                                     │
│  [  🧧 Tạo lì xì mới  ]             │
└─────────────────────────────────────┘
```

---

## 🚀 Hướng Phát Triển Tương Lai

### Phase 1: Enhanced Features (Q1 2026)

**Tiếng Việt:**
- ✨ **Lucky Draw Red Envelopes**: Lì xì may mắn với số tiền random
- 🎯 **Target Claiming**: Chỉ người được chọn mới nhận được
- 📊 **History Dashboard**: Xem lịch sử lì xì đã tạo/nhận
- 📱 **Mobile App**: Native mobile application
- 🎨 **Custom Themes**: Người dùng tùy chỉnh giao diện

**English:**
- ✨ **Lucky Draw Red Envelopes**: Random amount red envelopes
- 🎯 **Target Claiming**: Only selected recipients can claim
- 📊 **History Dashboard**: View created/claimed envelope history
- 📱 **Mobile App**: Native mobile application
- 🎨 **Custom Themes**: User-customizable interfaces

### Phase 2: Social Features (Q2 2026)

**Tiếng Việt:**
- 👥 **Group Red Envelopes**: Một phong bao, nhiều người nhận
- 💬 **Comments**: Người nhận có thể reply lời cảm ơn
- 🏆 **Leaderboards**: Bảng xếp hạng người tặng/nhận nhiều nhất
- 🎁 **NFT Red Envelopes**: Lì xì kèm NFT đặc biệt
- 🔔 **Notifications**: Thông báo khi có lì xì mới

**English:**
- 👥 **Group Red Envelopes**: One envelope, multiple recipients
- 💬 **Comments**: Recipients can reply with thanks
- 🏆 **Leaderboards**: Top givers/receivers rankings
- 🎁 **NFT Red Envelopes**: Red envelopes with special NFTs
- 🔔 **Notifications**: Alerts for new red envelopes

### Phase 3: Advanced Integration (Q3 2026)

**Tiếng Việt:**
- 🤖 **Telegram/Discord Bot**: Gửi lì xì qua bot
- 📅 **Scheduled Envelopes**: Đặt lịch gửi lì xì tự động
- 💱 **Multi-Token Support**: Hỗ trợ nhiều loại token khác SUI
- 🎯 **Campaigns**: Doanh nghiệp tạo campaign marketing
- 📈 **Analytics**: Thống kê chi tiết về việc sử dụng

**English:**
- 🤖 **Telegram/Discord Bot**: Send envelopes via bots
- 📅 **Scheduled Envelopes**: Schedule automatic sending
- 💱 **Multi-Token Support**: Support tokens beyond SUI
- 🎯 **Campaigns**: Business marketing campaigns
- 📈 **Analytics**: Detailed usage statistics

### Phase 4: Ecosystem Expansion (Q4 2026)

**Tiếng Việt:**
- 🌐 **Multi-Chain**: Mở rộng sang các blockchain khác
- 🏪 **Marketplace**: Mua bán template lì xì độc đáo
- 🎓 **Educational Content**: Hướng dẫn sử dụng blockchain
- 🤝 **Partnerships**: Hợp tác với các dự án Sui khác
- 🌏 **Global Expansion**: Mở rộng ra các quốc gia châu Á khác (Trung Quốc, Hàn Quốc, Nhật Bản...)

**English:**
- 🌐 **Multi-Chain**: Expand to other blockchains
- 🏪 **Marketplace**: Buy/sell unique envelope templates
- 🎓 **Educational Content**: Blockchain usage tutorials
- 🤝 **Partnerships**: Collaborate with other Sui projects
- 🌏 **Global Expansion**: Expand to other Asian countries (China, Korea, Japan...)

### Long-term Vision

**Tiếng Việt:**
Trở thành nền tảng gifting phi tập trung hàng đầu trong văn hóa châu Á, nơi mọi người có thể dễ dàng chia sẻ niềm vui, may mắn và tài lộc thông qua blockchain một cách an toàn, minh bạch và có ý nghĩa.

**English:**
Become the leading decentralized gifting platform in Asian culture, where everyone can easily share joy, luck, and prosperity through blockchain in a secure, transparent, and meaningful way.

---

## 📦 Cài Đặt / Installation

### Prerequisites

```bash
- Node.js 18+
- npm or yarn
- Sui Wallet (Browser Extension)
- Git
```

### Frontend Setup

```bash
# Clone repository
git clone https://github.com/yourusername/sui-lixi.git
cd sui-lixi/frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
VITE_SUI_NETWORK=testnet
VITE_PACKAGE_ID=your_package_id

# Run development server
npm run dev

# Build for production
npm run build
```

### Smart Contract Deployment

```bash
cd contracts/red_envelope

# Build contract
sui move build

# Test contract
sui move test

# Deploy to testnet
sui client publish --gas-budget 100000000

# Save package ID for frontend
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Add environment variables in Vercel dashboard
```

---

## 🤝 Contributing

### Tiếng Việt
Chúng tôi rất hoan nghênh mọi đóng góp! Vui lòng:
1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

### English
We welcome all contributions! Please:
1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 👥 Team

- **Developer**: [Your Name]
- **Designer**: [Designer Name]
- **Smart Contract**: [Developer Name]

---

## 🙏 Acknowledgments

**Tiếng Việt:**
- Sui Foundation vì blockchain tuyệt vời
- Cộng đồng Sui Việt Nam
- Văn hóa truyền thống Việt Nam về lì xì Tết
- Tất cả người dùng đã thử nghiệm và đóng góp ý kiến

**English:**
- Sui Foundation for the amazing blockchain
- Sui Vietnam Community
- Vietnamese traditional red envelope culture
- All users who tested and provided feedback

---

## 📞 Contact

- **Website**: [https://sui-lixi.vercel.app](https://sui-lixi.vercel.app)
- **Twitter**: [@SuiLixi](https://twitter.com/suilixi)
- **Discord**: [Sui Lixi Community](https://discord.gg/suilixi)
- **Email**: contact@suilixi.xyz

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐️!

---

**Made with ❤️ and 🧧 for the Sui Community**

*Chúc mừng năm mới! 新年快乐! Happy Lunar New Year!* 🎊
