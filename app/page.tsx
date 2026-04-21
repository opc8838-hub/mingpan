'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { calculateBazi, BaziResult } from '@/lib/bazi';

export default function Home() {
  const [step, setStep] = useState<'input' | 'calculating' | 'result'>('input');
  const [formData, setFormData] = useState({
    year: '',
    month: '',
    day: '',
    hour: '',
    gender: 'male' as 'male' | 'female'
  });
  const [baziResult, setBaziResult] = useState<BaziResult | null>(null);

  const handleSubmit = async () => {
    if (!formData.year || !formData.month || !formData.day || !formData.hour) {
      return;
    }
    
    setStep('calculating');
    
    // 计算八字
    const result = calculateBazi(
      parseInt(formData.year),
      parseInt(formData.month),
      parseInt(formData.day),
      parseInt(formData.hour),
      formData.gender
    );
    
    // 模拟延迟给用户仪式感
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setBaziResult(result);
    setStep('result');
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f5f5f0] overflow-hidden">
      {/* 背景纹理 */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-20">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-serif tracking-[0.3em] mb-4"
            style={{ fontFamily: '"Noto Serif SC", serif' }}>
            命 盘
          </h1>
          <p className="text-[#d4af37] text-sm tracking-[0.5em] uppercase">
            Ming Pan · Digital Divination
          </p>
        </motion.div>

        {step === 'input' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* 分隔线 */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />
              <span className="text-[#d4af37] text-xs tracking-widest">输入生辰</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />
            </div>

            {/* 表单 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-[#888] tracking-wider">年</label>
                <input
                  type="number"
                  placeholder="1990"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  className="w-full bg-transparent border-b border-[#333] focus:border-[#c93628] 
                    py-3 text-center text-lg outline-none transition-colors
                    placeholder:text-[#444]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-[#888] tracking-wider">月</label>
                <input
                  type="number"
                  placeholder="5"
                  value={formData.month}
                  onChange={(e) => setFormData({...formData, month: e.target.value})}
                  className="w-full bg-transparent border-b border-[#333] focus:border-[#c93628] 
                    py-3 text-center text-lg outline-none transition-colors
                    placeholder:text-[#444]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-[#888] tracking-wider">日</label>
                <input
                  type="number"
                  placeholder="15"
                  value={formData.day}
                  onChange={(e) => setFormData({...formData, day: e.target.value})}
                  className="w-full bg-transparent border-b border-[#333] focus:border-[#c93628] 
                    py-3 text-center text-lg outline-none transition-colors
                    placeholder:text-[#444]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-[#888] tracking-wider">时</label>
                <input
                  type="number"
                  placeholder="15"
                  value={formData.hour}
                  onChange={(e) => setFormData({...formData, hour: e.target.value})}
                  className="w-full bg-transparent border-b border-[#333] focus:border-[#c93628] 
                    py-3 text-center text-lg outline-none transition-colors
                    placeholder:text-[#444]"
                />
              </div>
            </div>

            {/* 性别选择 */}
            <div className="flex justify-center gap-8 pt-4">
              <button
                onClick={() => setFormData({...formData, gender: 'male'})}
                className={`px-8 py-3 border transition-all duration-300
                  ${formData.gender === 'male' 
                    ? 'border-[#c93628] text-[#c93628]' 
                    : 'border-[#333] text-[#666] hover:border-[#555]'}`}
              >
                乾 · 男
              </button>
              <button
                onClick={() => setFormData({...formData, gender: 'female'})}
                className={`px-8 py-3 border transition-all duration-300
                  ${formData.gender === 'female' 
                    ? 'border-[#c93628] text-[#c93628]' 
                    : 'border-[#333] text-[#666] hover:border-[#555]'}`}
              >
                坤 · 女
              </button>
            </div>

            {/* 提交按钮 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="w-full py-4 mt-8 bg-gradient-to-r from-[#c93628] to-[#a0281d]
                text-white tracking-[0.3em] font-medium
                hover:from-[#d44030] hover:to-[#b03020]
                transition-all duration-300 shadow-lg shadow-[#c93628]/20"
            >
              起 卦
            </motion.button>

            {/* 说明文字 */}
            <p className="text-center text-xs text-[#666] pt-8 leading-relaxed">
              基于《渊海子平》《滴天髓》等九部典籍<br />
              Python 刚性计算 · 零 AI 幻觉
            </p>
          </motion.div>
        )}

        {step === 'calculating' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-8 border-2 border-[#d4af37] border-t-transparent rounded-full"
            />
            <p className="text-[#d4af37] tracking-[0.3em] text-sm">推算中...</p>
          </motion.div>
        )}

        {step === 'result' && baziResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* 八字结果 */}
            <div className="text-center space-y-6">
              <div className="flex justify-center gap-2">
                {[
                  `${baziResult.year.gan}${baziResult.year.zhi}`,
                  `${baziResult.month.gan}${baziResult.month.zhi}`,
                  `${baziResult.day.gan}${baziResult.day.zhi}`,
                  `${baziResult.hour.gan}${baziResult.hour.zhi}`
                ].map((pillar, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-16 h-24 border border-[#333] flex flex-col items-center justify-center
                      bg-gradient-to-b from-[#111] to-transparent"
                  >
                    <span className="text-xs text-[#666] mb-2">
                      {['年', '月', '日', '时'][i]}
                    </span>
                    <span className="text-lg font-serif text-[#d4af37]">{pillar}</span>
                  </motion.div>
                ))}
              </div>

              {/* 日主 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <span className="text-xs text-[#666]">日主</span>
                <span className="ml-2 text-[#d4af37] font-serif">{baziResult.dayMaster}</span>
              </motion.div>

              {/* 五行分布 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="py-8"
              >
                <div className="flex justify-center gap-1 h-32 items-end">
                  {[
                    { name: '金', value: baziResult.wuxing.jin, color: '#c0c0c0' },
                    { name: '木', value: baziResult.wuxing.mu, color: '#2d5a3d' },
                    { name: '水', value: baziResult.wuxing.shui, color: '#1e3a5f' },
                    { name: '火', value: baziResult.wuxing.huo, color: '#c93628' },
                    { name: '土', value: baziResult.wuxing.tu, color: '#8b7355' },
                  ].map((item) => (
                    <div key={item.name} className="flex flex-col items-center gap-2 w-12">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(item.value * 2, 10)}px` }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="w-full rounded-t"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-[#888]">{item.name}</span>
                      <span className="text-[10px] text-[#666]">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 付费引导 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="border border-[#d4af37]/30 bg-gradient-to-b from-[#d4af37]/5 to-transparent p-6"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-[#d4af37]">🔒</span>
                  <span className="text-sm tracking-wider">解锁详细分析</span>
                </div>
                <ul className="text-xs text-[#888] space-y-2 mb-6">
                  <li>· 十神详解（正官/偏印/食神...）</li>
                  <li>· 大运流年表（2025-2035）</li>
                  <li>· 典籍引用（滴天髓/渊海子平）</li>
                  <li>· 高清 PDF 报告</li>
                </ul>
                <button className="w-full py-3 border border-[#c93628] text-[#c93628] 
                  hover:bg-[#c93628] hover:text-white transition-all duration-300
                  tracking-[0.2em]">
                  立即解锁 · ¥19.9
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
