# 命盘项目配置指南

## 1. 腾讯云 LKEAP Coding Plan 配置（必需）

### 获取 API Key
1. 登录腾讯云控制台: https://console.cloud.tencent.com/
2. 进入「大模型知识引擎」LKEAP 产品页面
3. 在「Coding Plan」板块创建/获取 API Key
4. 格式类似: `sk-sp-xxxxx`

### 配置到项目
将获取到的 API Key 填入 `.env.local` 文件：

```bash
LKEAP_API_KEY=sk-sp-你的实际API密钥
```

## 2. 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

## 3. 生产环境部署（Vercel）

### 方式一：Vercel Dashboard 配置
1. 在 Vercel 项目设置中找到 "Environment Variables"
2. 添加 `LKEAP_API_KEY` = 你的 API 密钥
3. 重新部署

### 方式二：Vercel CLI
```bash
vercel env add LKEAP_API_KEY
```

## 4. 支付方式配置（可选，等 PayPal 审核通过后）

### Stripe（国际支付）
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
```

### PayPal（等审核通过后）
```bash
NEXT_PUBLIC_PAYPAL_CLIENT_ID=你的PayPal客户端ID
PAYPAL_CLIENT_SECRET=你的PayPal密钥
```

## 5. 域名配置（可选）

```bash
NEXT_PUBLIC_APP_URL=https://你的域名.com
```

---

## 常见问题

### Q: LKEAP API 调用失败？
A: 检查以下几点：
- API Key 是否正确（以 `sk-sp-` 开头）
- 账户余额是否充足
- 地域设置是否正确

### Q: 如何查看 API 调用日志？
A: 在腾讯云控制台「大模型知识引擎」→「调用日志」中查看

### Q: 免费额度和价格？
A: Coding Plan 通常有免费额度，具体查看腾讯云官方文档
