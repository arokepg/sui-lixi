import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONSTANTS, mistToSui } from '../../config';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, ExternalLink, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
        setError(t('claim.idNotFound'));
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
          setError(t('claim.notFound'));
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
        setError(t('claim.loadingError'));
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
      setError(t('error.walletNotConnected'));
      return;
    }

    if (!id) {
      setError(t('claim.idNotFound'));
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
            setError(`${t('claim.error')}: ${err.message}`);
            setIsOpening(false);
          },
        }
      );
    } catch (err) {
      console.error('Error claiming envelope:', err);
      setError(`${t('common.error')}: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-red-primary-800 p-8 w-full max-w-md text-center"
        >
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-red-500" />
          <p className="text-gray-700 dark:text-gray-300">{t('claim.loading')}</p>
        </motion.div>
      </div>
    );
  }

  // Error state hoặc không tìm thấy
  if (error && !envelopeData) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 dark:bg-red-900/20 rounded-3xl shadow-2xl border-2 border-red-200 dark:border-red-800 p-8 w-full max-w-md text-center"
        >
          <span className="text-6xl block mb-4">😢</span>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">{t('claim.errorTitle')}</h2>
          <p className="text-red-700 dark:text-red-300 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('claim.backToHome')}
          </button>
        </motion.div>
      </div>
    );
  }

  // Claimed success state
  if (claimed) {
    // Trigger confetti
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ff4d4f', '#ffd700', '#ff7875', '#ffa940']
    });

    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl shadow-2xl border-2 border-green-200 dark:border-green-800 p-8 w-full max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="text-7xl mb-4"
          >
            🧧
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('claim.success')}</h2>
          <p className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2">
            {t('claim.received')}
          </p>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
            {claimedAmount.toFixed(4)} SUI
          </p>
          {envelopeData && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {t('claim.from')}: {shortenAddress(envelopeData.sender)}
            </p>
          )}
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            {t('claim.createNew')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-2 border-red-200 dark:border-red-primary-800 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-500 dark:from-red-700 dark:via-red-600 dark:to-red-700 p-8 text-white text-center relative">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl mb-4"
            >
              🧧
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">{t('claim.youHaveEnvelope')}</h2>
            <p className="text-red-100">{t('claim.openToReceive')}</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {envelopeData && (
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{t('claim.amountLabel')}</span>
                  <span className="text-xl font-bold text-red-600 dark:text-red-400">
                    {formatSui(envelopeData.balance)} SUI
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{t('claim.senderLabel')}</span>
                  <span className="text-gray-900 dark:text-white font-mono text-sm">
                    {shortenAddress(envelopeData.sender)}
                  </span>
                </div>
                {envelopeData.message && (
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                    <span className="text-gray-700 dark:text-gray-300 font-medium block mb-2">{t('claim.wishLabel')}</span>
                    <p className="text-gray-800 dark:text-gray-200 italic">"{envelopeData.message}"</p>
                  </div>
                )}
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 mb-4"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {!account ? (
              <div className="text-center py-4">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                <p className="text-gray-700 dark:text-gray-300">{t('claim.connectWallet')}</p>
              </div>
            ) : (
              <button
                onClick={handleClaim}
                disabled={isPending || isOpening}
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-lg transition-all",
                  "flex items-center justify-center gap-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "bg-gradient-to-r from-red-500 to-red-600",
                  "hover:from-red-600 hover:to-red-700",
                  "text-white shadow-lg hover:shadow-xl",
                  "transform hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                {isPending || isOpening ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('claim.claiming')}
                  </>
                ) : (
                  <>
                    🎉 {t('claim.button')}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
