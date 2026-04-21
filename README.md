# 命盘 · Ming Pan

用代码算命的数字命理师——刚性计算零幻觉，典籍引用有据可依

## 设计规范（Frontend Design Skill 应用）

### 视觉方向
- **风格**: 暗黑奢华（Dark Luxury）× 东方禅意
- **主色**: 墨黑 (#0a0a0a) + 朱砂红 (#c93628)
- **强调**: 金箔质感 (#d4af37)
- **字体**: Noto Serif SC（标题）+ 系统楷体（正文）

### 设计规则
- ✅ 独特字体组合，避免 Inter/Roboto
- ✅ 大胆配色，主导色+强调色
- ✅ 对称布局（符合东方美学）
- ✅ 高影响力动效（页面加载交错显示）
- ❌ 禁止紫色渐变、可预测布局、通用组件

## 技术栈
- Next.js 14 + React 18
- Tailwind CSS
- Framer Motion（动效）
- lunar-typescript（农历计算）

## 项目结构
```
divination-web/
├── app/
│   ├── page.tsx          # 主页面
│   ├── layout.tsx        # 根布局
│   └── globals.css       # 全局样式
├── lib/
│   └── bazi.ts           # 八字计算引擎
├── package.json
├── tailwind.config.ts
└── next.config.js
```

## 开发
```bash
npm install
npm run dev
```

## 部署
```bash
npm run build
# 输出到 dist/ 目录，部署到 Vercel
```

## MVP 功能
- [x] 八字输入表单
- [x] 基础结果展示
- [x] 五行分布可视化
- [ ] 支付接入（Stripe/微信）
- [ ] PDF 报告生成
- [ ] 后端计算 API
