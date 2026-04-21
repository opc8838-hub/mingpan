'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BaziResult } from '@/lib/bazi';
import ReportPDF from '@/components/ReportPDF';

export default function PaymentSuccess() {
  const [bazi, setBazi] = useState<BaziResult | null>(null);
  const [birthInfo, setBirthInfo] = useState<any>(null);
  const [interpretation, setInterpretation] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const savedBazi = localStorage.getItem('mingpan_bazi');
    const savedBirthInfo = localStorage.getItem('mingpan_birth');
    
    if (savedBazi && savedBirthInfo) {
      const baziData = JSON.parse(savedBazi);
      const birthData = JSON.parse(savedBirthInfo);
      setBazi(baziData);
      setBirthInfo(birthData);
      generateInterpretation(baziData, birthData);
    }
  }, []);
  
  const generateInterpretation = async (baziData: BaziResult, birthData: any) => {
    try {
      const response = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bazi: baziData,
          birthInfo: birthData
        }),
      });
      
      if (!response.ok) throw new Error('生成失败');
      
      const data = await response.json();
      setInterpretation(data.interpretation);
    } catch (error) {
      console.error('解读生成错误:', error);
      setInterpretation('解读生成遇到问题，请稍后重试。');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!bazi || !birthInfo) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-[#888]">加载中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f5f5f0]">
      <div className="max-w-2xl mx-auto px-6 py-20">
        {/* 成功图标 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 rounded-full border-2 border-[#d4af37] flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif tracking-wider mb-2">支付成功</h1>
          <p className="text-[#888] text-sm">您的命盘详批报告已生成</p>
        </motion.div>

        {/* 结果摘要 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border border-[#333] p-6 mb-8"
        >
          <div className="flex justify-center gap-2 mb-6">
            {['年', '月', '日', '时'].map((label, i) => (
              <div key={i} className="text-center">
                <div className="text-xs text-[#666] mb-1">{label}</div>
                <div className="w-14 h-20 border border-[#444] flex flex-col items-center justify-center bg-gradient-to-b from-[#111] to-transparent">
                  <span className="text-lg font-serif text-[#d4af37]">
                    {[bazi.year.gan, bazi.month.gan, bazi.day.gan, bazi.hour.gan][i]}
                  </span>
                  <span className="text-xs text-[#666] mt-1">
                    {[bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi][i]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-sm text-[#888] space-y-1">
            <p>日主：<span className="text-[#d4af37]">{bazi.dayMaster}</span>（{getDayMasterWuxing(bazi.dayMaster)}）</p>
            <p>出生：{birthInfo.year}年{birthInfo.month}月{birthInfo.day}日 {birthInfo.hour}:00</p>
          </div>
        </motion.div>

        {/* AI 解读内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border border-[#d4af37]/30 bg-gradient-to-b from-[#d4af37]/5 to-transparent p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#d4af37]">✨</span>
            <span className="text-sm tracking-wider">AI 命盘详批</span>
            <span className="text-xs text-[#666] ml-auto">powered by kimi-k2.5</span>
          </div>
          
          {isGenerating ? (
            <div className="text-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-[#888] text-sm">AI 正在为您解读命盘...</p>
              <p className="text-[#666] text-xs mt-2">参考《渊海子平》《滴天髓》等典籍</p>
            </div>
          ) : (
            <div className="text-[#f5f5f0] leading-relaxed whitespace-pre-wrap text-sm">
              {interpretation}
            </div>
          )}
        </motion.div>

        {/* PDF 下载 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ReportPDF bazi={bazi} birthInfo={birthInfo} interpretation={interpretation} />
        </motion.div>

        {/* 说明 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-xs text-[#666] mt-12 space-y-2"
        >
          <p>报告包含：八字详解、五行分析、十神格局、大运流年、典籍引用</p>
          <p>本报告仅供娱乐参考，命运掌握在自己手中</p>
        </motion.div>

        {/* 返回按钮 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-8"
        >
          <a 
            href="/"
            className="text-sm text-[#888] hover:text-[#d4af37] transition-colors"
          >
            ← 返回首页
          </a>
        </motion.div>
      </div>
    </main>
  );
}

function getDayMasterWuxing(dayMaster: string): string {
  const map: Record<string, string> = {
    '甲': '阳木', '乙': '阴木', '丙': '阳火', '丁': '阴火',
    '戊': '阳土', '己': '阴土', '庚': '阳金', '辛': '阴金',
    '壬': '阳水', '癸': '阴水'
  };
  return map[dayMaster] || '未知';
}
