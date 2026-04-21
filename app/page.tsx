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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    
    // 验证
    if (!formData.year || !formData.month || !formData.day || !formData.hour) {
      setError('请填写完整的出生信息');
      return;
    }
    
    const year = parseInt(formData.year);
    const month = parseInt(formData.month);
    const day = parseInt(formData.day);
    const hour = parseInt(formData.hour);
    
    if (isNaN(year) || year < 1900 || year > 2100) {
      setError('年份需在 1900-2100 之间');
      return;
    }
    if (isNaN(month) || month < 1 || month > 12) {
      setError('月份需在 1-12 之间');
      return;
    }
    if (isNaN(day) || day < 1 || day > 31) {
      setError('日期需在 1-31 之间');
      return;
    }
    if (isNaN(hour) || hour < 0 || hour > 23) {
      setError('时辰需在 0-23 之间');
      return;
    }
    
    setStep('calculating');
    
    try {
      // 计算八字
      const result = calculateBazi(year, month, day, hour, formData.gender);
      
      // 保存到 localStorage
      localStorage.setItem('mingpan_bazi', JSON.stringify(result));
      localStorage.setItem('mingpan_birth', JSON.stringify({
        year, month, day, hour,
        gender: formData.gender
      }));
      
      // 短暂延迟给用户反馈
      setTimeout(() => {
        setBaziResult(result);
        setStep('result');
      }, 800);
      
    } catch (err) {
      console.error('计算错误:', err);
      setError('计算出错，请检查输入信息');
      setStep('input');
    }
  };

  const handleReset = () => {
    setStep('input');
    setBaziResult(null);
    setFormData({ year: '', month: '', day: '', hour: '', gender: 'male' });
  };

  return (
    <main className="min-h-screen bg-[#faf8f3] text-[#2c2c2c] font-serif">
      {/* 顶部导航 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf8f3]/90 backdrop-blur-sm border-b border-[#e8e4dc]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-lg tracking-[0.2em] text-[#2d4a3e]">命盘</span>
          <span className="text-xs text-[#8b8680] tracking-wider">MING PAN</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pt-32 pb-20">
        
        {/* 头部介绍 */}
        {step === 'input' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl mb-6 tracking-wider text-[#2c2c2c]">
              探索你的命盘
            </h1>
            <p className="text-[#8b8680] text-sm md:text-base leading-relaxed max-w-md mx-auto">
              基于传统命理学的智能分析工具<br/>
              算法排盘 · 典籍引用 · 个性化解读
            </p>
          </motion.div>
        )}

        {/* 输入表单 */}
        {step === 'input' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-[#e8e4dc] p-8 md:p-10"
          >
            <div className="space-y-8">
              {/* 出生日期 */}
              <div>
                <label className="block text-xs tracking-widest text-[#8b8680] mb-4 uppercase">
                  出生日期（公历）
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <input
                      type="number"
                      placeholder="1990"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      className="w-full bg-[#faf8f3] border border-[#e8e4dc] rounded-lg px-4 py-3 
                        text-center text-lg outline-none focus:border-[#2d4a3e] transition-colors
                        placeholder:text-[#c4c0b8]"
                    />
                    <span className="text-xs text-[#8b8680] mt-1 block text-center">年</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="5"
                      value={formData.month}
                      onChange={(e) => setFormData({...formData, month: e.target.value})}
                      className="w-full bg-[#faf8f3] border border-[#e8e4dc] rounded-lg px-4 py-3 
                        text-center text-lg outline-none focus:border-[#2d4a3e] transition-colors
                        placeholder:text-[#c4c0b8]"
                    />
                    <span className="text-xs text-[#8b8680] mt-1 block text-center">月</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="15"
                      value={formData.day}
                      onChange={(e) => setFormData({...formData, day: e.target.value})}
                      className="w-full bg-[#faf8f3] border border-[#e8e4dc] rounded-lg px-4 py-3 
                        text-center text-lg outline-none focus:border-[#2d4a3e] transition-colors
                        placeholder:text-[#c4c0b8]"
                    />
                    <span className="text-xs text-[#8b8680] mt-1 block text-center">日</span>
                  </div>
                </div>
              </div>

              {/* 出生时辰 */}
              <div>
                <label className="block text-xs tracking-widest text-[#8b8680] mb-4 uppercase">
                  出生时辰（24小时制）
                </label>
                <input
                  type="number"
                  placeholder="14"
                  min="0"
                  max="23"
                  value={formData.hour}
                  onChange={(e) => setFormData({...formData, hour: e.target.value})}
                  className="w-full bg-[#faf8f3] border border-[#e8e4dc] rounded-lg px-4 py-3 
                    text-center text-lg outline-none focus:border-[#2d4a3e] transition-colors
                    placeholder:text-[#c4c0b8]"
                />
                <p className="text-xs text-[#a8a298] mt-2">输入 0-23 的数字，例如下午 2 点输入 14</p>
              </div>

              {/* 性别选择 */}
              <div>
                <label className="block text-xs tracking-widest text-[#8b8680] mb-4 uppercase">
                  性别
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setFormData({...formData, gender: 'male'})}
                    className={`flex-1 py-3 rounded-lg border transition-all duration-300
                      ${formData.gender === 'male' 
                        ? 'border-[#2d4a3e] bg-[#2d4a3e] text-white' 
                        : 'border-[#e8e4dc] text-[#8b8680] hover:border-[#2d4a3e]/50'}`}
                  >
                    男
                  </button>
                  <button
                    onClick={() => setFormData({...formData, gender: 'female'})}
                    className={`flex-1 py-3 rounded-lg border transition-all duration-300
                      ${formData.gender === 'female' 
                        ? 'border-[#2d4a3e] bg-[#2d4a3e] text-white' 
                        : 'border-[#e8e4dc] text-[#8b8680] hover:border-[#2d4a3e]/50'}`}
                  >
                    女
                  </button>
                </div>
              </div>

              {/* 错误提示 */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[#c45c4a] text-sm text-center bg-[#c45c4a]/10 rounded-lg py-3"
                >
                  {error}
                </motion.div>
              )}

              {/* 提交按钮 */}
              <button
                onClick={handleSubmit}
                className="w-full py-4 bg-[#2d4a3e] text-white rounded-lg text-base tracking-wider
                  hover:bg-[#1f352c] active:scale-[0.98] transition-all duration-200
                  shadow-lg shadow-[#2d4a3e]/20"
              >
                开始排盘
              </button>

              {/* 说明 */}
              <p className="text-center text-xs text-[#a8a298] leading-relaxed">
                基于传统八字排盘算法<br/>
                仅供娱乐参考
              </p>
            </div>
          </motion.div>
        )}

        {/* 推算中 */}
        {step === 'calculating' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 mx-auto mb-6 border-2 border-[#2d4a3e] border-t-transparent rounded-full"
            />
            <p className="text-[#8b8680] tracking-wider">正在排盘...</p>
          </motion.div>
        )}

        {/* 结果展示 */}
        {step === 'result' && baziResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* 八字卡片 */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e8e4dc] p-8">
              <h2 className="text-xs tracking-widest text-[#8b8680] uppercase mb-6 text-center">
                八字命盘
              </h2>
              
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: '年柱', gan: baziResult.year.gan, zhi: baziResult.year.zhi },
                  { label: '月柱', gan: baziResult.month.gan, zhi: baziResult.month.zhi },
                  { label: '日柱', gan: baziResult.day.gan, zhi: baziResult.day.zhi },
                  { label: '时柱', gan: baziResult.hour.gan, zhi: baziResult.hour.zhi },
                ].map((pillar, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-xs text-[#a8a298] mb-2">{pillar.label}</div>
                    <div className="bg-[#faf8f3] rounded-lg py-4 border border-[#e8e4dc]">
                      <div className="text-2xl font-medium text-[#2c2c2c] mb-1">{pillar.gan}</div>
                      <div className="text-lg text-[#8b8680]">{pillar.zhi}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 日主 */}
              <div className="mt-6 pt-6 border-t border-[#e8e4dc] text-center">
                <span className="text-xs text-[#8b8680]">日主</span>
                <span className="ml-3 text-xl font-medium text-[#2d4a3e]">{baziResult.dayMaster}</span>
              </div>
            </div>

            {/* 五行分析 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-[#e8e4dc] p-8"
            >
              <h2 className="text-xs tracking-widest text-[#8b8680] uppercase mb-6 text-center">
                五行分布
              </h2>
              
              <div className="flex items-end justify-center gap-4 h-40">
                {[
                  { name: '金', value: baziResult.wuxing.jin, color: '#9ca3af' },
                  { name: '木', value: baziResult.wuxing.mu, color: '#2d4a3e' },
                  { name: '水', value: baziResult.wuxing.shui, color: '#5b7c99' },
                  { name: '火', value: baziResult.wuxing.huo, color: '#c45c4a' },
                  { name: '土', value: baziResult.wuxing.tu, color: '#a89078' },
                ].map((item) => (
                  <div key={item.name} className="flex flex-col items-center w-12">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(item.value * 1.5, 20)}px` }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="w-full rounded-t-md"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-[#8b8680] mt-2">{item.name}</span>
                    <span className="text-[10px] text-[#a8a298]">{item.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 解锁详细分析 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-[#2d4a3e] to-[#1f352c] rounded-2xl p-8 text-white"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg mb-2">解锁详细命盘分析</h3>
                <p className="text-sm text-white/70">AI 个性化解读 · 典籍引用 · PDF 报告</p>
              </div>
              
              <ul className="text-sm text-white/80 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#c9a961] rounded-full"></span>
                  十神格局详解
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#c9a961] rounded-full"></span>
                  大运流年分析
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#c9a961] rounded-full"></span>
                  《渊海子平》《滴天髓》典籍引用
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#c9a961] rounded-full"></span>
                  高清 PDF 报告下载
                </li>
              </ul>

              <button className="w-full py-3 bg-[#c9a961] text-[#2c2c2c] rounded-lg font-medium
                hover:bg-[#d4b56a] transition-colors">
                立即解锁 · ¥19.9
              </button>
            </motion.div>

            {/* 重新排盘 */}
            <div className="text-center">
              <button
                onClick={handleReset}
                className="text-sm text-[#8b8680] hover:text-[#2d4a3e] transition-colors"
              >
                ← 重新排盘
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* 底部 */}
      <footer className="text-center py-8 text-xs text-[#a8a298]">
        <p>命盘 · 用代码探索传统智慧</p>
      </footer>
    </main>
  );
}
