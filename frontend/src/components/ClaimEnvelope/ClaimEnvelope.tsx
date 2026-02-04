import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONSTANTS, mistToSui } from '../../config';
import './ClaimEnvelope.css';

interface EnvelopeData {
  objectId: string;
  sender: string;
  balance: string;
  message: string;
}

/**
 * Component nhận lì xì
 * Hiển thị thông tin lì xì và cho phép người dùng claim
 */
export function ClaimEnvelope() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();

  // State
  const [envelopeData, setEnvelopeData] = useState<EnvelopeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claimed, setClaimed] = useState(false);
  const [claimedAmount, setClaimedAmount] = useState<number>(0);
  const [isOpening, setIsOpening] = useState(false);

  /**
   * Fetch thông tin lì xì từ blockchain
   */
  useEffect(() => {
    const fetchEnvelopeData = async () => {
      if (!id) {
        setError('Không tìm thấy ID lì xì trong URL');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const object = await suiClient.getObject({
          id,
          options: {
            showContent: true,
            showOwner: true,
          },
        });

        if (!object.data) {
          setError('Lì xì không tồn tại hoặc đã được mở');
          setLoading(false);
          return;
        }

        // Parse object data
        const content = object.data.content;
        if (content?.dataType === 'moveObject') {
          const fields = content.fields as Record<string, unknown>;
          
          // Lấy balance từ nested object
          const balanceObj = fields.balance as Record<string, unknown>;
          const balanceValue = balanceObj?.fields 
            ? (balanceObj.fields as Record<string, string>).balance 
            : '0';

          // Decode message từ bytes
          const messageBytes = fields.message as number[];
          const message = messageBytes 
            ? new TextDecoder().decode(new Uint8Array(messageBytes))
            : 'Chúc mừng năm mới! 🧧';

          setEnvelopeData({
            objectId: id,
            sender: fields.sender as string,
            balance: balanceValue,
            message,
          });
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching envelope:', err);
        setError('Lỗi khi tải thông tin lì xì. Có thể lì xì đã được mở.');
        setLoading(false);
      }
    };

    fetchEnvelopeData();
  }, [id, suiClient]);

  /**
   * Xử lý claim lì xì
   */
  const handleClaim = async () => {
    if (!account) {
      setError('Vui lòng kết nối ví trước!');
      return;
    }

    if (!id) {
      setError('Không tìm thấy ID lì xì');
      return;
    }

    setError(null);
    setIsOpening(true);

    try {
      // Tạo Transaction Block
      const tx = new Transaction();

      // Gọi hàm claim trong smart contract
      tx.moveCall({
        target: `${CONSTANTS.PACKAGE_ID}::${CONSTANTS.MODULE_NAME}::claim`,
        arguments: [
          tx.object(id), // Truyền RedEnvelope object
        ],
      });

      // Sign và execute transaction
      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: async (result) => {
            console.log('Claim successful:', result);
            
            // Lấy số tiền đã claim
            if (envelopeData) {
              setClaimedAmount(mistToSui(BigInt(envelopeData.balance)));
            }
            
            setClaimed(true);
            setIsOpening(false);
          },
          onError: (err) => {
            console.error('Claim failed:', err);
            setError(`Nhận lì xì thất bại: ${err.message}`);
            setIsOpening(false);
          },
        }
      );
    } catch (err) {
      console.error('Error claiming envelope:', err);
      setError(`Lỗi: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsOpening(false);
    }
  };

  /**
   * Format số SUI
   */
  const formatSui = (mist: string): string => {
    return mistToSui(BigInt(mist)).toFixed(4);
  };

  /**
   * Rút gọn địa chỉ
   */
  const shortenAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="claim-envelope">
        <div className="claim-card loading-card">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin lì xì...</p>
        </div>
      </div>
    );
  }

  // Error state hoặc không tìm thấy
  if (error && !envelopeData) {
    return (
      <div className="claim-envelope">
        <div className="claim-card error-card">
          <span className="error-icon">😢</span>
          <h2>Oops!</h2>
          <p>{error}</p>
          <button className="back-button" onClick={() => navigate('/')}>
            ← Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Claimed success state
  if (claimed) {
    return (
      <div className="claim-envelope">
        <div className="claim-card success-card">
          <div className="confetti">🎊</div>
          <span className="success-envelope">🧧</span>
          <h2>Chúc Mừng!</h2>
          <p className="claimed-amount">
            Bạn đã nhận được <strong>{claimedAmount.toFixed(4)} SUI</strong>
          </p>
          {envelopeData && (
            <p className="sender-info">
              Từ: {shortenAddress(envelopeData.sender)}
            </p>
          )}
          <div className="celebration-actions">
            <button className="create-new-button" onClick={() => navigate('/')}>
              🧧 Tạo lì xì mới
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="claim-envelope">
      <div className={`claim-card ${isOpening ? 'opening' : ''}`}>
        <div className="envelope-preview">
          <span className="preview-icon">🧧</span>
          <h2>Bạn có một Lì Xì!</h2>
        </div>

        {envelopeData && (
          <div className="envelope-details">
            <div className="detail-row">
              <span className="detail-label">💰 Số tiền:</span>
              <span className="detail-value amount">
                {formatSui(envelopeData.balance)} SUI
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">👤 Người gửi:</span>
              <span className="detail-value">
                {shortenAddress(envelopeData.sender)}
              </span>
            </div>
            {envelopeData.message && (
              <div className="message-box">
                <span className="message-label">💌 Lời chúc:</span>
                <p className="message-content">{envelopeData.message}</p>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {!account ? (
          <div className="connect-prompt">
            <p>⚠️ Vui lòng kết nối ví để nhận lì xì</p>
          </div>
        ) : (
          <button
            className="claim-button"
            onClick={handleClaim}
            disabled={isPending || isOpening}
          >
            {isPending || isOpening ? (
              <>
                <span className="spinner"></span>
                Đang mở...
              </>
            ) : (
              '🎉 Mở Lì Xì'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
