# 命盘 · Ming Pan

用代码算命的数字命理师——刚性计算零幻觉，AI 润色有温度，典籍引用有据可依。

## 产品定位

**免费版**：八字排盘 + 五行分析（纯算法，零幻觉）  
**付费版**：AI 深度解读 + 大运流年 + 高清 PDF（¥19.9）

区别于市面「AI 直接生成八字」的产品，我们：
- ✅ **八字计算完全刚性**：用 `lunar-typescript` 精确计算，不让 LLM 算
- ✅ **典籍引用有据可查**：《渊海子平》《滴天髓》原文，非编造
- ✅ **情绪价值可调**：温和/犀利/鼓励，三种解读风格

## 设计规范

### 视觉方向
- **风格**: 暗黑奢华（Dark Luxury）× 东方禅意
- **主色**: 墨黑 (#0a0a0a) + 朱砂红 (#c93628)
- **强调**: 金箔质感 (#d4af37)
- **字体**: Noto Serif SC（标题）+ 系统楷体（正文）

### 设计原则（Frontend Design Skill）
- ✅ 独特字体组合，避免 Inter/Roboto
- ✅ 大胆配色，主导色+强调色
- ✅ 对称布局（符合东方美学）
- ✅ 高影响力动效（页面加载交错显示）
- ❌ 禁止紫色渐变、可预测布局、通用组件

## 技术栈

| 层级 | 技术 | 用途 |
|------|------|------|
| 框架 | Next.js 14 + React 18 | 前端 + API 路由 |
| 样式 | Tailwind CSS | 暗黑东方美学 |
| 动效 | Framer Motion | 页面过渡、交互动画 |
| 计算 | lunar-typescript | 农历/八字刚性计算 |
| AI | 腾讯云 LKEAP (kimi-k2.5) | 解读文案润色 |
| PDF | html2canvas + jspdf | 报告导出 |
| 支付 | PayPal（审核中） | 国际收款 |

## 项目结构

```
divination-web/
├── app/
│   ├── page.tsx              # 首页（输入/免费结果）
│   ├── layout.tsx            # 根布局 + 字体
│   ├── globals.css           # 全局样式
│   ├── payment/
│   │   ├── page.tsx          # 支付页（PayPal）
│   │   └── success/
│   │       └── page.tsx      # 支付成功 + AI 解读
│   └── api/
│       ├── payment/
│       │   └── route.ts      # PayPal 订单创建
│       └── interpret/
│           └── route.ts      # 腾讯云 LKEAP AI 解读
├── components/
│   └── ReportPDF.tsx         # PDF 报告生成器
├── lib/
│   └── bazi.ts               # 八字计算引擎
├── public/                   # 静态资源
├── .env.local                # 环境变量（不提交）
├── .env.example              # 环境变量模板
└── next.config.js            # 构建设置
```

## 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/你的用户名/mingpan.git
cd mingpan

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入 API Keys

# 4. 启动开发服务器
npm run dev
# 访问 http://localhost:3000
```

### 必需的环境变量

```bash
# 腾讯云 LKEAP（AI 解读）
LKEAP_API_KEY=sk-sp-你的密钥
LKEAP_BASE_URL=https://api.lkeap.cloud.tencent.com/coding/v3

# PayPal（支付）- 审核通过后配置
NEXT_PUBLIC_PAYPAL_CLIENT_ID=你的PayPalClientID
PAYPAL_CLIENT_SECRET=你的PayPalSecret

# 可选：Sentry（错误监控）
SENTRY_DSN=...
```

## 部署到 Vercel

### 方式 1：GitHub + Vercel 自动部署（推荐）

1. **推送代码到 GitHub**
   ```bash
   git remote add origin https://github.com/你的用户名/mingpan.git
   git branch -M main
   git push -u origin main
   ```

2. **Vercel 导入项目**
   - 登录 https://vercel.com
   - 「Add New Project」→ 导入 GitHub 仓库
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **配置环境变量**
   - 在 Vercel Dashboard → Project Settings → Environment Variables
   - 添加 `LKEAP_API_KEY` 等必需变量

4. **自动部署**
   - 每次 `git push` 自动重新部署
   - Preview Deployment：PR 预览
   - Production Deployment：main 分支

### 方式 2：Vercel CLI

```bash
npx vercel login
npx vercel --prod
```

## 功能清单

### ✅ 已完成

- [x] 八字输入表单（年月日时 + 性别）
- [x] 农历/公历转换（lunar-typescript）
- [x] 八字排盘（年柱/月柱/日柱/时柱）
- [x] 五行分布计算（金木水火土百分比）
- [x] 免费结果展示（基础八字 + 五行）
- [x] 支付引导页（¥19.9 解锁详情）
- [x] 腾讯云 LKEAP AI 解读（kimi-k2.5）
- [x] PDF 报告生成（含 AI 解读、典籍引用）
- [x] 暗黑东方美学 UI

### 🔄 进行中

- [ ] PayPal 支付接入（等待审核）
- [ ] 微信支付（申请商户号）
- [ ] 用户行为分析（GA/Plausible）

### 📋 规划中

- [ ] 大运流年精确计算
- [ ] 十神详解自动生成
- [ ] 多语言支持（英文/日文）
- [ ] 会员订阅模式
- [ ] 小程序版本

## 竞品参考

| 产品 | 特点 | 我们的差异 |
|------|------|-----------|
| **FateTell** | $39.9/次，LLM 实时生成 | 我们 ¥19.9，先排盘后解读，更准确 |
| **Quin** | AI 塔罗，沉浸体验 | 我们八字，东方文化，典籍引用 |
| **神数AI** | 先排盘再解读 | 我们 AI 润色，情绪价值更高 |
| **DeepSeek** | 免费通用模型 | 我们专用工具，零幻觉 |

## 成本分析

| 项目 | 成本 | 说明 |
|------|------|------|
| Vercel 托管 | ¥0 | 免费额度足够 |
| 腾讯云 LKEAP | ¥0.07/次 | Coding Plan 便宜 |
| PayPal 手续费 | 4.4% + $0.3 | 验证期可接受 |
| 域名 | ¥60/年 | 可选 |

**盈亏平衡点**：每月 30 单（每天 1 单）即可覆盖所有成本

## License

MIT License - 可自由修改、商用

---

**Built with ❤️ by Setino for Boss**  
*AI + 传统文化 = 新机会*
