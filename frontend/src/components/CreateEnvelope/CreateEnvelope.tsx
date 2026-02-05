import { useState } from 'react';
import { 
  useCurrentAccount, 
  useSignAndExecuteTransaction,
  useSuiClient 
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONSTANTS, suiToMist } from '../../config';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Gift, Copy, Check, Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { cn, copyToClipboard, formatSuiAmount } from '../../lib/utils';
import confetti from 'canvas-confetti';

/**
 * Component tạo lì xì mới
 * Cho phép người dùng nhập số SUI và lời chúc, sau đó tạo phong bao lì xì on-chain
 */
export function CreateEnvelope() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const { t } = useTranslation();

  // State
  const [amount, setAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [createdEnvelopeId, setCreatedEnvelopeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  /**
   * Xử lý tạo lì xì
   */
  const handleCreate = async () => {
    if (!account) {
      setError(t('error.walletNotConnected'));
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < CONSTANTS.MIN_AMOUNT) {
      setError(`${t('error.invalidAmount')} (min: ${CONSTANTS.MIN_AMOUNT} SUI)`);
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
      const messageBytes = new TextEncoder().encode(message || t('create.messagePlaceholder'));

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
            const createdObjects = txDetails.objectChanges?.filter(
              (change) => change.type === 'created'
            );

            // Tìm object RedEnvelope
            const envelopeObject = createdObjects?.find(
              (obj) => 
                obj.type === 'created' && 
                obj.objectType?.includes('RedEnvelope')
            );

            if (envelopeObject && envelopeObject.type === 'created') {
              setCreatedEnvelopeId(envelopeObject.objectId);
              // Success confetti
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff4d4f', '#ffd700', '#ff7875']
              });
            } else {
              // Fallback
              if (createdObjects && createdObjects.length > 0 && createdObjects[0].type === 'created') {
                setCreatedEnvelopeId(createdObjects[0].objectId);
              }
            }
          },
          onError: (err) => {
            console.error('Transaction failed:', err);
            setError(`${t('create.error')}: ${err.message}`);
          },
        }
      );
    } catch (err) {
      console.error('Error creating envelope:', err);
      setError(`${t('common.error')}: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
  const handleCopyLink = async () => {
    const link = getShareLink();
    try {
      await copyToClipboard(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br from-red-primary-50 via-gold-50 to-red-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-primary-500 to-red-primary-600 p-8 text-white text-center relative overflow-hidden">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <Gift className="w-16 h-16" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">{t('create.title')}</h2>
            <p className="text-red-primary-100">{t('create.subtitle')}</p>
            
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 w-16 h-16 bg-gold-400/20 rounded-full blur-xl" />
            <div className="absolute bottom-4 right-4 w-20 h-20 bg-red-primary-400/20 rounded-full blur-xl" />
          </div>

          {/* Content */}
          <div className="p-8">
            {!account ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gold-500" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {t('error.walletNotConnected')}
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Amount Input */}
                <div>
                  <label 
                    htmlFor="amount" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {t('create.amount')}
                  </label>
                  <div className="relative">
                    <input
                      id="amount"
                      type="number"
                      step="0.01"
                      min={CONSTANTS.MIN_AMOUNT}
                      placeholder={t('create.amountPlaceholder')}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={isPending}
                      className={cn(
                        "w-full px-4 py-3 pr-16 rounded-xl border-2 bg-white dark:bg-gray-800",
                        "text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
                        "focus:outline-none focus:ring-2 focus:ring-red-primary-500 focus:border-transparent",
                        "transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                        error && !isPending ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                      )}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 dark:text-gray-400">
                      SUI
                    </span>
                  </div>
                </div>

                {/* Message Input */}
                <div>
                  <label 
                    htmlFor="message" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {t('create.message')}
                  </label>
                  <textarea
                    id="message"
                    placeholder={t('create.messagePlaceholder')}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isPending}
                    rows={3}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-gray-800",
                      "text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
                      "focus:outline-none focus:ring-2 focus:ring-red-primary-500 focus:border-transparent",
                      "transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed",
                      "border-gray-200 dark:border-gray-700"
                    )}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}

                {/* Create Button */}
                <button
                  onClick={handleCreate}
                  disabled={isPending || !amount}
                  className={cn(
                    "w-full py-4 rounded-xl font-bold text-lg transition-all",
                    "flex items-center justify-center gap-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "bg-gradient-to-r from-red-primary-500 to-red-primary-600",
                    "hover:from-red-primary-600 hover:to-red-primary-700",
                    "text-white shadow-lg hover:shadow-xl",
                    "transform hover:scale-[1.02] active:scale-[0.98]"
                  )}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('create.creating')}
                    </>
                  ) : (
                    <>
                      <Gift className="w-5 h-5" />
                      {t('create.button')}
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Success Section */}
            {createdEnvelopeId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-200 dark:border-green-800"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500 rounded-full">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {t('create.success')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {amount && `${formatSuiAmount(amount)} SUI`}
                    </p>
                  </div>
                </div>

                {/* Transaction Link */}
                {txDigest && (
                  <a
                    href={`https://suiscan.xyz/${CONSTANTS.NETWORK}/tx/${txDigest}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Explorer
                  </a>
                )}

                {/* Share Link */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('create.shareTitle')}
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={getShareLink()}
                      readOnly
                      className="flex-1 px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-mono"
                    />
                    <button
                      onClick={handleCopyLink}
                      className={cn(
                        "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2",
                        copied
                          ? "bg-green-500 text-white"
                          : "bg-gold-500 hover:bg-gold-600 text-gray-900"
                      )}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          {t('create.linkCopied')}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          {t('create.copyLink')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
