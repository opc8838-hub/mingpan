// lib/bazi.ts
// 八字计算引擎 - 基于 lunar-typescript，刚性计算，零幻觉

import { Solar, Lunar } from 'lunar-typescript';

export interface BaziPillar {
  gan: string;    // 天干
  zhi: string;    // 地支
}

export interface BaziResult {
  year: BaziPillar;
  month: BaziPillar;
  day: BaziPillar;
  hour: BaziPillar;
  dayMaster: string;  // 日主
  wuxing: {
    jin: number;   // 金
    mu: number;    // 木
    shui: number;  // 水
    huo: number;   // 火
    tu: number;    // 土
  };
}

// 天干五行
const GAN_WUXING: Record<string, string> = {
  "甲": "木", "乙": "木",
  "丙": "火", "丁": "火",
  "戊": "土", "己": "土",
  "庚": "金", "辛": "金",
  "壬": "水", "癸": "水"
};

// 地支五行（本气）
const ZHI_WUXING: Record<string, string> = {
  "寅": "木", "卯": "木",
  "巳": "火", "午": "火",
  "辰": "土", "戌": "土", "丑": "土", "未": "土",
  "申": "金", "酉": "金",
  "子": "水", "亥": "水"
};

/**
 * 使用 lunar-typescript 计算八字
 */
export function calculateBazi(
  year: number,
  month: number,
  day: number,
  hour: number,
  gender: 'male' | 'female'
): BaziResult {
  // 创建公历对象
  const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
  const lunar = solar.getLunar();
  const bazi = lunar.getEightChar();

  const yearPillar = bazi.getYear();
  const monthPillar = bazi.getMonth();
  const dayPillar = bazi.getDay();
  const hourPillar = bazi.getTime();

  const result: BaziResult = {
    year: { gan: yearPillar[0], zhi: yearPillar[1] },
    month: { gan: monthPillar[0], zhi: monthPillar[1] },
    day: { gan: dayPillar[0], zhi: dayPillar[1] },
    hour: { gan: hourPillar[0], zhi: hourPillar[1] },
    dayMaster: dayPillar[0],
    wuxing: { jin: 0, mu: 0, shui: 0, huo: 0, tu: 0 }
  };

  result.wuxing = calculateWuxing(result);
  return result;
}

/**
 * 计算五行分布（简单统计天干地支本气）
 */
function calculateWuxing(bazi: BaziResult): BaziResult['wuxing'] {
  const counts = { jin: 0, mu: 0, shui: 0, huo: 0, tu: 0 };
  const pillars = [bazi.year, bazi.month, bazi.day, bazi.hour];

  pillars.forEach(pillar => {
    const ganWx = GAN_WUXING[pillar.gan];
    const zhiWx = ZHI_WUXING[pillar.zhi];

    if (ganWx === '金') counts.jin++;
    if (ganWx === '木') counts.mu++;
    if (ganWx === '水') counts.shui++;
    if (ganWx === '火') counts.huo++;
    if (ganWx === '土') counts.tu++;

    if (zhiWx === '金') counts.jin++;
    if (zhiWx === '木') counts.mu++;
    if (zhiWx === '水') counts.shui++;
    if (zhiWx === '火') counts.huo++;
    if (zhiWx === '土') counts.tu++;
  });

  // 转换为百分比
  const total = 8;
  return {
    jin: Math.round((counts.jin / total) * 100),
    mu: Math.round((counts.mu / total) * 100),
    shui: Math.round((counts.shui / total) * 100),
    huo: Math.round((counts.huo / total) * 100),
    tu: Math.round((counts.tu / total) * 100)
  };
}

/**
 * 格式化八字为字符串
 */
export function formatBazi(bazi: BaziResult): string {
  return `${bazi.year.gan}${bazi.year.zhi} ${bazi.month.gan}${bazi.month.zhi} ${bazi.day.gan}${bazi.day.zhi} ${bazi.hour.gan}${bazi.hour.zhi}`;
}

/**
 * 获取日主五行
 */
export function getDayMasterWuxing(dayMaster: string): string {
  return GAN_WUXING[dayMaster] || '未知';
}

/**
 * 获取农历信息
 */
export function getLunarInfo(year: number, month: number, day: number) {
  const solar = Solar.fromYmdHms(year, month, day, 12, 0, 0);
  const lunar = solar.getLunar();

  return {
    lunarYear: lunar.getYear(),
    lunarMonth: lunar.getMonth(),
    lunarDay: lunar.getDay(),
    lunarYearCN: lunar.getYearInChinese(),
    lunarMonthCN: lunar.getMonthInChinese(),
    lunarDayCN: lunar.getDayInChinese(),
    zodiac: lunar.getYearShengXiao()
  };
}
