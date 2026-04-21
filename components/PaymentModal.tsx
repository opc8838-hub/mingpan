'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// 加载 Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

function PaymentForm({ onSuccess, onCancel }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || '支付失败');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement 
        options={{
          layout: 'tabs',
          defaultValues: {
            billingDetails: {
              name: '',
            },
          },
        }}
      />

      {errorMessage && (
        <div className="text-[#c93628] text-sm text-center">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 border border-[#444] text-[#888] 
            hover:border-[#666] transition-colors"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="flex-1 py-3 bg-[#c93628] text-white 
            hover:bg-[#d44030] transition-colors disabled:opacity-50"
        >
          {isLoading ? '处理中...' : '确认支付 ¥19.9'}
        </button>
      </div>
    </form>
  );
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  baziData: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
}

export default function PaymentModal({ isOpen, onClose, onSuccess, baziData }: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 创建支付意图
  const createPaymentIntent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 19.9,
          currency: 'cny',
          description: '八字详批报告',
          metadata: {
            bazi: `${baziData.year} ${baziData.month} ${baziData.day} ${baziData.hour}`,
            type: 'bazi_report',
          },
        }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      }
    } catch (error) {
      console.error('创建支付失败:', error);
    }
    setIsLoading(false);
  };

  // 打开时创建支付意图
  if (isOpen && !clientSecret && !isLoading) {
    createPaymentIntent();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50"
          />

          {/* 弹窗 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="w-full max-w-md bg-[#111] border border-[#333] p-8">
              <h3 className="text-xl text-center mb-2 tracking-wider">解锁详细分析</h3>
              <p className="text-[#666] text-center text-sm mb-6">
                八字详批报告 · ¥19.9
              </p>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-[#888] text-sm">准备支付...</p>
                </div>
              ) : clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm onSuccess={onSuccess} onCancel={onClose} />
                </Elements>
              ) : (
                <div className="text-center text-[#c93628]">
                  支付初始化失败，请重试
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-[#222]">
                <p className="text-xs text-[#555] text-center">
                  🔒 安全支付由 Stripe 提供
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
