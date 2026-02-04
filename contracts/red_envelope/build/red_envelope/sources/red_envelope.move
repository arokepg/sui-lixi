/// Module: red_envelope
/// Mô tả: Smart contract cho Lì xì On-chain trên Sui blockchain
/// Cho phép người dùng tạo "phong bao lì xì" chứa SUI và chia sẻ link để người khác claim

module red_envelope::red_envelope {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;

    // ==================== Error Codes ====================
    const EEnvelopeEmpty: u64 = 0;
    const EInvalidAmount: u64 = 1;

    // ==================== Structs ====================
    
    /// RedEnvelope - Phong bao lì xì
    /// Là một Shared Object để bất kỳ ai có link đều có thể claim
    public struct RedEnvelope has key {
        id: UID,
        /// Địa chỉ người gửi lì xì
        sender: address,
        /// Số SUI bên trong phong bao
        balance: Coin<SUI>,
        /// Lời chúc (optional)
        message: vector<u8>,
    }

    // ==================== Events ====================
    
    /// Event khi tạo lì xì thành công
    public struct EnvelopeCreated has copy, drop {
        envelope_id: ID,
        sender: address,
        amount: u64,
        message: vector<u8>,
    }

    /// Event khi nhận lì xì thành công
    public struct EnvelopeClaimed has copy, drop {
        envelope_id: ID,
        sender: address,
        claimer: address,
        amount: u64,
    }

    // ==================== Public Functions ====================

    /// Tạo một phong bao lì xì mới
    /// @param coin: Số SUI muốn đóng gói vào lì xì
    /// @param message: Lời chúc (có thể để trống)
    /// @param ctx: Transaction context
    public entry fun create(
        coin: Coin<SUI>,
        message: vector<u8>,
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&coin);
        assert!(amount > 0, EInvalidAmount);

        let sender = ctx.sender();
        let envelope = RedEnvelope {
            id: object::new(ctx),
            sender,
            balance: coin,
            message,
        };

        // Emit event
        event::emit(EnvelopeCreated {
            envelope_id: object::id(&envelope),
            sender,
            amount,
            message,
        });

        // Share object để bất kỳ ai cũng có thể claim
        transfer::share_object(envelope);
    }

    /// Nhận lì xì - "đập vỡ" phong bao và lấy SUI bên trong
    /// @param envelope: Phong bao lì xì cần claim
    /// @param ctx: Transaction context
    public entry fun claim(
        envelope: RedEnvelope,
        ctx: &mut TxContext
    ) {
        let RedEnvelope { 
            id, 
            sender, 
            balance, 
            message: _ 
        } = envelope;
        
        let amount = coin::value(&balance);
        assert!(amount > 0, EEnvelopeEmpty);

        let claimer = ctx.sender();

        // Emit event
        event::emit(EnvelopeClaimed {
            envelope_id: object::uid_to_inner(&id),
            sender,
            claimer,
            amount,
        });

        // Xóa object
        object::delete(id);

        // Chuyển SUI cho người claim
        transfer::public_transfer(balance, claimer);
    }

    // ==================== View Functions ====================

    /// Lấy thông tin số dư trong phong bao
    public fun get_balance(envelope: &RedEnvelope): u64 {
        coin::value(&envelope.balance)
    }

    /// Lấy địa chỉ người gửi
    public fun get_sender(envelope: &RedEnvelope): address {
        envelope.sender
    }

    /// Lấy lời chúc
    public fun get_message(envelope: &RedEnvelope): vector<u8> {
        envelope.message
    }
}
