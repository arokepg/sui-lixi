import { useState } from 'react';
import { 
  useCurrentAccount, 
  useSignAndExecuteTransaction,
  useSuiClient 
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONSTANTS, suiToMist } from '../../config';
import './CreateEnvelope.css';

/**
 * Component tạo lì xì mới
 * Cho phép người dùng nhập số SUI và lời chúc, sau đó tạo phong bao lì xì on-chain
 */
export function CreateEnvelope() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();

  // State
  const [amount, setAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [createdEnvelopeId, setCreatedEnvelopeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);

  /**
   * Xử lý tạo lì xì
   */
  const handleCreate = async () => {
    if (!account) {
      setError('Vui lòng kết nối ví trước!');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < CONSTANTS.MIN_AMOUNT) {
      setError(`Số tiền tối thiểu là ${CONSTANTS.MIN_AMOUNT} SUI`);
      return;
    }

    setError(null);
    setCreatedEnvelopeId(null);

    try {
      // Tạo Transaction Block
      const tx = new Transaction();

      // Convert SUI sang MIST (1 SUI = 10^9 MIST)
      const amountInMist = suiToMist(amountNum);

      // Split coin từ gas coin
      const [coin] = tx.splitCoins(tx.gas, [amountInMist]);

      // Convert message sang bytes
      const messageBytes = new TextEncoder().encode(message || 'Chúc mừng năm mới! 🧧');

      // Gọi hàm create trong smart contract
      tx.moveCall({
        target: `${CONSTANTS.PACKAGE_ID}::${CONSTANTS.MODULE_NAME}::create`,
        arguments: [
          coin,
          tx.pure.vector('u8', Array.from(messageBytes)),
        ],
      });

      // Sign và execute transaction
      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: async (result) => {
            console.log('Transaction successful:', result);
            setTxDigest(result.digest);

            // Đợi transaction được confirm và lấy thông tin chi tiết
            const txDetails = await suiClient.waitForTransaction({
              digest: result.digest,
              options: {
                showEffects: true,
                showObjectChanges: true,
              },
            });

            console.log('Transaction details:', txDetails);

            // Tìm Object ID của RedEnvelope vừa tạo
            // Object được share sẽ nằm trong objectChanges với type "created"
            const createdObjects = txDetails.objectChanges?.filter(
              (change) => change.type === 'created'
            );

            // Tìm object RedEnvelope (type chứa "RedEnvelope")
            const envelopeObject = createdObjects?.find(
              (obj) => 
                obj.type === 'created' && 
                obj.objectType?.includes('RedEnvelope')
            );

            if (envelopeObject && envelopeObject.type === 'created') {
              setCreatedEnvelopeId(envelopeObject.objectId);
            } else {
              // Fallback: lấy object đầu tiên được tạo
              if (createdObjects && createdObjects.length > 0 && createdObjects[0].type === 'created') {
                setCreatedEnvelopeId(createdObjects[0].objectId);
              }
            }
          },
          onError: (err) => {
            console.error('Transaction failed:', err);
            setError(`Giao dịch thất bại: ${err.message}`);
          },
        }
      );
    } catch (err) {
      console.error('Error creating envelope:', err);
      setError(`Lỗi: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  /**
   * Tạo link chia sẻ
   */
  const getShareLink = () => {
    if (!createdEnvelopeId) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/claim/${createdEnvelopeId}`;
  };

  /**
   * Copy link vào clipboard
   */
  const copyLink = async () => {
    const link = getShareLink();
    await navigator.clipboard.writeText(link);
    alert('Đã copy link! 🎉');
  };

  return (
    <div className="create-envelope">
      <div className="envelope-card">
        <div className="envelope-header">
          <span className="envelope-icon">🧧</span>
          <h2>Tạo Lì Xì</h2>
          <p>Gửi SUI cho người thân yêu của bạn</p>
        </div>

        {!account ? (
          <div className="connect-prompt">
            <p>⚠️ Vui lòng kết nối ví để tạo lì xì</p>
          </div>
        ) : (
          <div className="envelope-form">
            <div className="form-group">
              <label htmlFor="amount">Số lượng SUI</label>
              <div className="input-wrapper">
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min={CONSTANTS.MIN_AMOUNT}
                  placeholder="0.1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isPending}
                />
                <span className="input-suffix">SUI</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Lời chúc (tùy chọn)</label>
              <textarea
                id="message"
                placeholder="Chúc mừng năm mới! 🧧"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isPending}
                rows={3}
              />
            </div>

            {error && (
              <div className="error-message">
                ❌ {error}
              </div>
            )}

            <button
              className="create-button"
              onClick={handleCreate}
              disabled={isPending || !amount}
            >
              {isPending ? (
                <>
                  <span className="spinner"></span>
                  Đang tạo...
                </>
              ) : (
                '🧧 Tạo Lì Xì'
              )}
            </button>
          </div>
        )}

        {/* Hiển thị kết quả sau khi tạo thành công */}
        {createdEnvelopeId && (
          <div className="success-section">
            <div className="success-header">
              <span className="success-icon">✅</span>
              <h3>Tạo lì xì thành công!</h3>
            </div>

            <div className="envelope-info">
              <div className="info-row">
                <span className="info-label">Object ID:</span>
                <code className="info-value">{createdEnvelopeId}</code>
              </div>
              
              {txDigest && (
                <div className="info-row">
                  <span className="info-label">TX Digest:</span>
                  <a 
                    href={`https://suiscan.xyz/${CONSTANTS.NETWORK}/tx/${txDigest}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tx-link"
                  >
                    {txDigest.slice(0, 10)}...{txDigest.slice(-8)}
                  </a>
                </div>
              )}
            </div>

            <div className="share-section">
              <p>📤 Chia sẻ link này cho người nhận:</p>
              <div className="share-link-box">
                <input
                  type="text"
                  value={getShareLink()}
                  readOnly
                  className="share-link-input"
                />
                <button onClick={copyLink} className="copy-button">
                  📋 Copy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
