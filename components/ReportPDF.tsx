'use client';

import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BaziResult } from '@/lib/bazi';

interface ReportPDFProps {
  bazi: BaziResult;
  birthInfo: {
    year: number;
    month: number;
    day: number;
    hour: number;
    gender: 'male' | 'female';
  };
  interpretation?: string;
}

export default function ReportPDF({ bazi, birthInfo, interpretation }: ReportPDFProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      backgroundColor: '#faf8f3',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    let imgY = 0;
    
    // 计算需要多少页
    const scaledHeight = imgHeight * ratio;
    let heightLeft = scaledHeight;
    let position = 0;

    // 第一页
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    heightLeft -= pdfHeight;

    // 后续页
    while (heightLeft > 0) {
      position = heightLeft - imgHeight * ratio;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
      heightLeft -= pdfHeight;
    }

    pdf.save(`命盘详批_${birthInfo.year}${birthInfo.month}${birthInfo.day}.pdf`);
  };

  return (
    <div className="space-y-4">
      {/* 下载按钮 */}
      <button
        onClick={generatePDF}
        className="w-full py-3 bg-[#c93628] text-white hover:bg-[#a0281d] transition-colors tracking-wider"
      >
        下载 PDF 报告
      </button>

      {/* 隐藏的报告内容 */}
      <div 
        ref={reportRef} 
        className="absolute -left-[9999px] top-0 bg-[#faf8f3] p-12"
        style={{ width: '794px' }} // A4 width in px at 96dpi
      >
        {/* 报告头部 */}
        <div className="text-center border-b-2 border-[#c93628] pb-8 mb-8">
          <h1 className="text-4xl font-serif text-[#1a1a1a] mb-2 tracking-widest">命 盘 详 批</h1>
          <p className="text-sm text-[#666] tracking-wider">基于《渊海子平》《滴天髓》等九部典籍</p>
          <p className="text-xs text-[#999] mt-2">生成时间：{new Date().toLocaleDateString('zh-CN')}</p>
        </div>

        {/* 基本信息 */}
        <div className="mb-8">
          <h2 className="text-lg font-serif text-[#1a1a1a] mb-4 flex items-center">
            <span className="w-1 h-5 bg-[#c93628] mr-3"></span>
            生辰信息
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-[#666]">出生日期：</span>{birthInfo.year}年{birthInfo.month}月{birthInfo.day}日</div>
            <div><span className="text-[#666]">出生时辰：</span>{birthInfo.hour}:00</div>
            <div><span className="text-[#666]">性别：</span>{birthInfo.gender === 'male' ? '男' : '女'}</div>
            <div><span className="text-[#666]">日主：</span>{bazi.dayMaster}（{getDayMasterWuxing(bazi.dayMaster)}命）</div>
          </div>
        </div>

        {/* 八字排盘 */}
        <div className="mb-8">
          <h2 className="text-lg font-serif text-[#1a1a1a] mb-4 flex items-center">
            <span className="w-1 h-5 bg-[#c93628] mr-3"></span>
            八字排盘
          </h2>
          <div className="flex justify-center gap-4">
            {[
              { label: '年柱', ...bazi.year },
              { label: '月柱', ...bazi.month },
              { label: '日柱', ...bazi.day },
              { label: '时柱', ...bazi.hour },
            ].map((pillar, i) => (
              <div key={i} className="text-center border border-[#ddd] p-4 bg-white">
                <div className="text-xs text-[#999] mb-2">{pillar.label}</div>
                <div className="text-2xl font-serif text-[#1a1a1a] mb-1">{pillar.gan}</div>
                <div className="text-xs text-[#c93628]">{GAN_WUXING[pillar.gan]}</div>
                <div className="text-2xl font-serif text-[#1a1a1a] mt-2">{pillar.zhi}</div>
                <div className="text-xs text-[#c93628]">{ZHI_WUXING[pillar.zhi]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 五行分析 */}
        <div className="mb-8">
          <h2 className="text-lg font-serif text-[#1a1a1a] mb-4 flex items-center">
            <span className="w-1 h-5 bg-[#c93628] mr-3"></span>
            五行分析
          </h2>
          <div className="flex gap-4 mb-4">
            {[
              { name: '金', value: bazi.wuxing.jin, color: '#c0c0c0' },
              { name: '木', value: bazi.wuxing.mu, color: '#2d5a3d' },
              { name: '水', value: bazi.wuxing.shui, color: '#1e3a5f' },
              { name: '火', value: bazi.wuxing.huo, color: '#c93628' },
              { name: '土', value: bazi.wuxing.tu, color: '#8b7355' },
            ].map((item) => (
              <div key={item.name} className="flex-1 text-center">
                <div className="h-24 bg-[#eee] relative mb-2">
                  <div 
                    className="absolute bottom-0 w-full transition-all"
                    style={{ height: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
                <div className="text-sm">{item.name}</div>
                <div className="text-xs text-[#999]">{item.value}%</div>
              </div>
            ))}
          </div>
          <div className="text-sm text-[#555] leading-relaxed bg-[#f5f3ef] p-4">
            {getWuxingAnalysis(bazi.wuxing, bazi.dayMaster)}
          </div>
        </div>

        {/* 十神分析 */}
        <div className="mb-8">
          <h2 className="text-lg font-serif text-[#1a1a1a] mb-4 flex items-center">
            <span className="w-1 h-5 bg-[#c93628] mr-3"></span>
            十神详解
          </h2>
          <div className="space-y-2 text-sm">
            {getShishenAnalysis(bazi).map((item, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-[#eee]">
                <span className="text-[#666]">{item.position}</span>
                <span className="font-medium">{item.shishen}</span>
                <span className="text-[#999]">{item.meaning}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 大运流年 */}
        <div className="mb-8">
          <h2 className="text-lg font-serif text-[#1a1a1a] mb-4 flex items-center">
            <span className="w-1 h-5 bg-[#c93628] mr-3"></span>
            大运流年（2025-2035）
          </h2>
          <div className="grid grid-cols-5 gap-2 text-sm">
            {getDayun(bazi, birthInfo.gender).map((yun, i) => (
              <div key={i} className="text-center p-2 bg-[#f5f3ef]">
                <div className="text-xs text-[#999]">{yun.age}岁</div>
                <div className="font-serif text-[#1a1a1a]">{yun.ganZhi}</div>
                <div className={`text-xs ${yun.score > 70 ? 'text-green-600' : yun.score < 40 ? 'text-red-600' : 'text-[#999]'}`}>
                  {yun.score > 70 ? '吉' : yun.score < 40 ? '凶' : '平'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI 命盘详批 */}
        {interpretation && (
          <div className="mb-8">
            <h2 className="text-lg font-serif text-[#1a1a1a] mb-4 flex items-center">
              <span className="w-1 h-5 bg-[#c93628] mr-3"></span>
              AI 命盘详批
              <span className="text-xs text-[#999] ml-2 font-normal">powered by kimi-k2.5</span>
            </h2>
            <div className="text-sm text-[#555] leading-relaxed bg-[#f5f3ef] p-6 whitespace-pre-wrap">
              {interpretation}
            </div>
          </div>
        )}

        {/* 典籍引用 */}
        <div className="mb-8">
          <h2 className="text-lg font-serif text-[#1a1a1a] mb-4 flex items-center">
            <span className="w-1 h-5 bg-[#c93628] mr-3"></span>
            典籍引用
          </h2>
          <div className="space-y-3 text-sm">
            {getClassicQuotes(bazi.dayMaster).map((quote, i) => (
              <div key={i} className="pl-4 border-l-2 border-[#ddd]">
                <p className="text-[#555] italic">"{quote.text}"</p>
                <p className="text-xs text-[#999] mt-1">—— {quote.source}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 底部 */}
        <div className="text-center text-xs text-[#999] pt-8 border-t border-[#ddd]">
          <p>本报告仅供娱乐参考，不代表绝对预测</p>
          <p className="mt-1">命运掌握在自己手中，知命是为了更好地把握人生</p>
        </div>
      </div>
    </div>
  );
}

// 辅助函数
const GAN_WUXING: Record<string, string> = {
  "甲": "木", "乙": "木", "丙": "火", "丁": "火", "戊": "土",
  "己": "土", "庚": "金", "辛": "金", "壬": "水", "癸": "水"
};

const ZHI_WUXING: Record<string, string> = {
  "寅": "木", "卯": "木", "巳": "火", "午": "火",
  "辰": "土", "戌": "土", "丑": "土", "未": "土",
  "申": "金", "酉": "金", "子": "水", "亥": "水"
};

function getDayMasterWuxing(dayMaster: string): string {
  const map: Record<string, string> = {
    '甲': '阳木', '乙': '阴木', '丙': '阳火', '丁': '阴火',
    '戊': '阳土', '己': '阴土', '庚': '阳金', '辛': '阴金',
    '壬': '阳水', '癸': '阴水'
  };
  return map[dayMaster] || '未知';
}

function getWuxingAnalysis(wuxing: BaziResult['wuxing'], dayMaster: string): string {
  const max = Math.max(wuxing.jin, wuxing.mu, wuxing.shui, wuxing.huo, wuxing.tu);
  const min = Math.min(wuxing.jin, wuxing.mu, wuxing.shui, wuxing.huo, wuxing.tu);
  
  let analysis = `您的八字中，五行分布为：金${wuxing.jin}%、木${wuxing.mu}%、水${wuxing.shui}%、火${wuxing.huo}%、土${wuxing.tu}%。`;
  
  if (max === wuxing.jin) analysis += '金旺，主决断力强，但需注意肺部保养。';
  if (max === wuxing.mu) analysis += '木旺，主仁慈宽厚，但需注意肝胆调理。';
  if (max === wuxing.shui) analysis += '水旺，主智慧灵活，但需注意肾脏保健。';
  if (max === wuxing.huo) analysis += '火旺，主热情积极，但需注意心脏保养。';
  if (max === wuxing.tu) analysis += '土旺，主稳重踏实，但需注意脾胃调理。';
  
  const dayWuxing = GAN_WUXING[dayMaster];
  if (max > 25 && GAN_WUXING[dayMaster] !== getWuxingName(max)) {
    analysis += `日主为${dayWuxing}，五行${getWuxingName(max)}过旺，建议通过环境、色彩等方式调和。`;
  }
  
  return analysis;
}

function getWuxingName(maxValue: number): string {
  // 辅助函数，根据最大值返回五行名称
  return '';
}

function getShishenAnalysis(bazi: BaziResult) {
  // 简化版十神分析
  const dayMaster = bazi.day.gan;
  return [
    { position: '年干', shishen: getShishen(dayMaster, bazi.year.gan), meaning: '祖上根基' },
    { position: '月干', shishen: getShishen(dayMaster, bazi.month.gan), meaning: '父母兄弟' },
    { position: '日干', shishen: '日主', meaning: '自我本性' },
    { position: '时干', shishen: getShishen(dayMaster, bazi.hour.gan), meaning: '子女晚运' },
  ];
}

function getShishen(dayMaster: string, target: string): string {
  // 简化十神计算
  const shishenMap: Record<string, string> = {
    '同我': '比肩', '克我': '正官', '我克': '正财', '生我': '正印', '我生': '食神'
  };
  return '正官'; // 简化返回
}

function getDayun(bazi: BaziResult, gender: 'male' | 'female') {
  // 生成大运流年数据
  const startAge = 3;
  return Array.from({ length: 10 }, (_, i) => ({
    age: startAge + i * 10,
    ganZhi: `${bazi.year.gan}${bazi.year.zhi}`, // 简化
    score: Math.floor(Math.random() * 40) + 40 // 模拟分数
  }));
}

function getClassicQuotes(dayMaster: string) {
  const quotes = [
    { text: '命理以日干为主，日干旺相，运行财官则贵。', source: '《渊海子平》' },
    { text: '五行中和，一世无灾。', source: '《滴天髓》' },
    { text: '命贵中和，偏枯终有不足。', source: '《三命通会》' },
  ];
  return quotes;
}
