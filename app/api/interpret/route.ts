import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bazi, birthInfo } = body;

    if (!bazi || !birthInfo) {
      return NextResponse.json(
        { error: '缺少八字或出生信息' },
        { status: 400 }
      );
    }

    // 构建 Prompt（参考 FateTell/神数AI 风格）
    const prompt = buildPrompt(bazi, birthInfo);

    // 调用腾讯云 LKEAP
    const response = await fetch(process.env.LKEAP_BASE_URL + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LKEAP_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'kimi-k2.5',
        messages: [
          {
            role: 'system',
            content: `你是一位精通《渊海子平》《滴天髓》《三命通会》的命理大师。

核心原则：
1. 不准宿命论 - 强调「知命是为了更好地把握人生」
2. 典籍必须真实 - 只引用可查证的原文
3. 语气温暖 - 像智慧长者，给予鼓励和指导
4. 实用建议 - 给出可执行的生活建议

输出结构：
1. 命格总览（诗意概括）
2. 五行精析（典籍引用）
3. 性格画像（3个关键词）
4. 人生指南（具体建议）
5. 典籍智慧（2-3条原文）`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('LKEAP API 错误:', error);
      return NextResponse.json(
        { error: 'AI 解读服务暂时不可用' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const interpretation = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({
      interpretation,
      model: 'kimi-k2.5',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('解读 API 错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

function buildPrompt(bazi: any, birthInfo: any): string {
  const ganWuxing: Record<string, string> = {
    '甲': '阳木', '乙': '阴木', '丙': '阳火', '丁': '阴火',
    '戊': '阳土', '己': '阴土', '庚': '阳金', '辛': '阴金',
    '壬': '阳水', '癸': '阴水'
  };

  const zhiWuxing: Record<string, string> = {
    '子': '水', '丑': '土', '寅': '木', '卯': '木',
    '辰': '土', '巳': '火', '午': '火', '未': '土',
    '申': '金', '酉': '金', '戌': '土', '亥': '水'
  };

  const dayMasterWuxing = ganWuxing[bazi.day.gan] || '未知';
  
  // 找出最旺和最弱的五行
  const wuxingEntries = Object.entries(bazi.wuxing);
  const maxWuxing = wuxingEntries.reduce((a, b) => a[1] > b[1] ? a : b);
  const minWuxing = wuxingEntries.reduce((a, b) => a[1] < b[1] ? a : b);
  
  const wuxingMap: Record<string, string> = {
    'jin': '金', 'mu': '木', 'shui': '水', 'huo': '火', 'tu': '土'
  };

  return `请为以下八字生成专业命理解读：

【生辰信息】
- 出生时间：${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日 ${birthInfo.hour}:00
- 性别：${birthInfo.gender === 'male' ? '男' : '女'}

【八字排盘】
- 年柱：${bazi.year.gan}${bazi.year.zhi} (${ganWuxing[bazi.year.gan]} ${zhiWuxing[bazi.year.zhi]})
- 月柱：${bazi.month.gan}${bazi.month.zhi} (${ganWuxing[bazi.month.gan]} ${zhiWuxing[bazi.month.zhi]})
- 日柱：${bazi.day.gan}${bazi.day.zhi} (${ganWuxing[bazi.day.gan]} ${zhiWuxing[bazi.day.zhi]}) ← 日主
- 时柱：${bazi.hour.gan}${bazi.hour.zhi} (${ganWuxing[bazi.hour.gan]} ${zhiWuxing[bazi.hour.zhi]})

【日主分析】
- 日主：${bazi.day.gan}（${dayMasterWuxing}）
- 最旺五行：${wuxingMap[maxWuxing[0]]}（${maxWuxing[1]}%）
- 最弱五行：${wuxingMap[minWuxing[0]]}（${minWuxing[1]}%）

请按照系统指令的结构生成解读。`;
}
