'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// 初始化 Stripe（使用测试密钥，正式环境替换为 process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY）
const stripePromise = loadStripe('pk_test_...'); // 替换为你的 Stripe publishable key

function CheckoutForm() {
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

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (error) {
      setErrorMessage(error.message || '支付失败，请重试');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#111] border border-[#333] p-6">
        <PaymentElement 
          options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
            },
            wallets: {
              applePay: 'auto',
              googlePay: 'auto',
            }
          }}
        />
      </div>

      {errorMessage && (
        <div className="text-red-500 text-sm text-center">
          {errorMessage}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={!stripe || isLoading}
        className="w-full py-4 bg-gradient-to-r from-[#c93628] to-[#a0281d]
          text-white tracking-[0.2em] font-medium
          hover:from-[#d44030] hover:to-[#b03020]
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '处理中...' : '确认支付 ¥19.9'}
      </motion.button>

      <p className="text-center text-xs text-[#666]">
        安全加密支付 · Stripe 提供技术支持
      </p>
    </form>
  );
}

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 创建支付意图
    fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 1990, // ¥19.9 = 1990 分
        currency: 'cny',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('创建支付失败:', err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full"
        />
      </main>
    );
  }

  if (!clientSecret) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#f5f5f0]">
        <div className="text-center">
          <p className="text-red-500 mb-4">支付初始化失败</p>
          <a href="/" className="text-[#d4af37] hover:underline">返回首页</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f5f5f0]">
      <div className="max-w-md mx-auto px-6 py-20">
        {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-serif tracking-wider mb-2">支付</h1>
          <p className="text-[#888] text-sm">解锁您的命盘详批报告</p>
        </motion.div>

        {/* 订单信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="border border-[#333] p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-[#888]">商品</span>
            <span className="font-medium">命盘详批报告</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#888]">金额</span>
            <span className="text-2xl text-[#d4af37] font-serif">¥19.9</span>
          </div>
          <div className="mt-4 pt-4 border-t border-[#333] text-xs text-[#666] space-y-1">
            <p>· 十神详解与格局分析</p>
            <p>· 大运流年表（2025-2035）</p>
            <p>· 典籍原文引用</p>
            <p>· 高清 PDF 报告下载</p>
          </div>
        </motion.div>

        {/* 支付表单 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Elements 
            stripe={stripePromise} 
            options={{ 
              clientSecret,
              appearance: {
                theme: 'night',
                variables: {
                  colorPrimary: '#c93628',
                  colorBackground: '#0a0a0a',
                  colorText: '#f5f5f0',
                  colorDanger: '#ef4444',
                  borderRadius: '4px',
                },
              },
            }}
          >
            <CheckoutForm />
          </Elements>
        </motion.div>

        {/* 返回 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <a href="/" className="text-sm text-[#666] hover:text-[#d4af37] transition-colors">
            ← 取消并返回
          </a>
        </motion.div>
      </div>
    </main>
  );
}
