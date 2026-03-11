# Stripe 支付整合指南（香港/中國版）

## 🎯 支持支付方式

| 支付方式 | 適用地區 | 手續費 |
|---------|---------|--------|
| 💳 信用卡 (Visa/Master/Amex) | 全球 | 3.4% + HK$2.35 |
| 🇨🇳 支付寶 | 中國大陸 | 2.9% + HK$2.35 |
| 🇨🇳 微信支付 | 中國大陸 | 2.9% + HK$2.35 |

---

## 📋 前置要求

### 1. Stripe 賬戶設置

1. 去 https://dashboard.stripe.com/register
2. 註冊賬戶（選擇 Hong Kong）
3. 完成身份驗證
4. 啟用測試模式先測試

### 2. 獲取 API Keys

```
Dashboard → Developers → API keys

測試環境：
- Publishable key: pk_test_...
- Secret key: sk_test_...

生產環境：
- Publishable key: pk_live_...
- Secret key: sk_live_...
```

### 3. 啟用支付方式

```
Dashboard → Settings → Payment methods

啟用以下：
☑️ Cards (Visa, Mastercard, American Express)
☑️ Alipay
☑️ WeChat Pay
```

---

## 🚀 實現方案：Stripe Checkout（推薦）

### 方案優點
- ✅ Stripe 托管支付頁面（安全）
- ✅ 自動適配手機/桌面
- ✅ 支持多種支付方式
- ✅ 自動處理 3D Secure
- ✅ 無需 PCI 合規（Stripe 處理）

---

## 💻 代碼實現

### 文件結構
```
website/
├── index.html              # 添加支付按鈕
├── js/
│   ├── main.js            # 原有代碼
│   └── payment.js         # 🆕 新增支付邏輯
├── api/                    # 🆕 後端 API
│   └── create-checkout-session.js
└── success.html           # 🆕 支付成功頁
└── cancel.html            # 🆕 支付取消頁
```

---

### Step 1: 添加支付按鈕到網站

修改 `index.html`，在每個價格卡片添加支付按鈕：

```html
<!-- 公司註冊 - 基礎版 -->
<div class="pricing-card">
  <div class="pricing-header">
    <h4>基礎版</h4>
    <div class="price">
      <span class="currency">HK$</span>
      <span class="amount">1,999</span>
    </div>
  </div>
  <ul class="pricing-features">
    <li>公司名稱核准</li>
    <li>營業執照辦理</li>
    <li>公章刻製</li>
    <li>基礎諮詢服務</li>
  </ul>
  
  <!-- 🆕 支付按鈕 -->
  <button class="btn btn-pricing checkout-button" 
          data-service="company-setup"
          data-plan="basic"
          data-price="1999"
          data-name="公司註冊 - 基礎版">
    立即購買
  </button>
</div>

<!-- 為每個服務和計劃添加類似按鈕 -->
<!-- data-service: 服務類型 -->
<!-- data-plan: 計劃類型 (basic/standard/premium) -->
<!-- data-price: 價格（港幣）-->
<!-- data-name: 顯示名稱 -->
```

---

### Step 2: 創建支付處理腳本

創建 `js/payment.js`：

```javascript
// Stripe 支付處理
const stripe = Stripe('pk_test_你的測試密鑰'); // 測試環境
// const stripe = Stripe('pk_live_你的生產密鑰'); // 生產環境

// 初始化支付按鈕
document.addEventListener('DOMContentLoaded', () => {
  const checkoutButtons = document.querySelectorAll('.checkout-button');
  
  checkoutButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const service = button.dataset.service;
      const plan = button.dataset.plan;
      const price = button.dataset.price;
      const name = button.dataset.name;
      
      // 顯示加載狀態
      button.disabled = true;
      button.textContent = '處理中...';
      
      try {
        // 調用後端創建 Checkout Session
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service: service,
            plan: plan,
            price: price,
            name: name,
            currency: 'hkd'
          })
        });
        
        const session = await response.json();
        
        if (session.error) {
          throw new Error(session.error);
        }
        
        // 跳轉到 Stripe Checkout
        const result = await stripe.redirectToCheckout({
          sessionId: session.id
        });
        
        if (result.error) {
          throw new Error(result.error.message);
        }
        
      } catch (error) {
        console.error('支付錯誤:', error);
        alert('支付初始化失敗，請重試。錯誤: ' + error.message);
        button.disabled = false;
        button.textContent = '立即購買';
      }
    });
  });
});
```

在 `index.html` 底部添加：
```html
<!-- Stripe JS -->
<script src="https://js.stripe.com/v3/"></script>
<script src="js/payment.js"></script>
```

---

### Step 3: 創建後端 API

#### 方案 A: Vercel Serverless Function（推薦）

創建 `api/create-checkout-session.js`：

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// 服務價格配置
const servicePrices = {
  'company-setup': {
    basic: { amount: 199900, name: '公司註冊 - 基礎版' },      // HK$1,999.00
    standard: { amount: 399900, name: '公司註冊 - 標準版' },   // HK$3,999.00
    premium: { amount: 699900, name: '公司註冊 - 高級版' }    // HK$6,999.00
  },
  'company-secretary': {
    basic: { amount: 19900, name: '公司秘書 - 基礎版' },       // HK$199.00/月
    standard: { amount: 39900, name: '公司秘書 - 標準版' },    // HK$399.00/月
    premium: { amount: 69900, name: '公司秘書 - 高級版' }     // HK$699.00/月
  },
  'bookkeeping': {
    basic: { amount: 29900, name: '記賬服務 - 基礎版' },
    standard: { amount: 59900, name: '記賬服務 - 標準版' },
    premium: { amount: 99900, name: '記賬服務 - 高級版' }
  },
  'accounting': {
    basic: { amount: 49900, name: '會計服務 - 基礎版' },
    standard: { amount: 89900, name: '會計服務 - 標準版' },
    premium: { amount: 149900, name: '會計服務 - 高級版' }
  },
  'auditing': {
    basic: { amount: 599900, name: '審計服務 - 基礎版' },
    standard: { amount: 1299900, name: '審計服務 - 標準版' },
    premium: { amount: 2999900, name: '審計服務 - 高級版' }
  },
  'taxation': {
    basic: { amount: 39900, name: '稅務服務 - 基礎版' },
    standard: { amount: 79900, name: '稅務服務 - 標準版' },
    premium: { amount: 199900, name: '稅務服務 - 高級版' }
  }
};

module.exports = async (req, res) => {
  // 設置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    const { service, plan, price, name, currency } = req.body;
    
    // 驗證參數
    if (!service || !plan || !price) {
      res.status(400).json({ error: 'Missing required parameters' });
      return;
    }
    
    // 獲取服務配置
    const serviceConfig = servicePrices[service];
    if (!serviceConfig || !serviceConfig[plan]) {
      res.status(400).json({ error: 'Invalid service or plan' });
      return;
    }
    
    const planConfig = serviceConfig[plan];
    
    // 創建 Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'alipay', 'wechat_pay'],
      payment_method_options: {
        wechat_pay: {
          client: 'web'
        }
      },
      line_items: [
        {
          price_data: {
            currency: currency || 'hkd',
            product_data: {
              name: planConfig.name,
              description: `AIcountant ${planConfig.name} 服務`,
              images: ['https://your-domain.com/logo.png'], // 可選
            },
            unit_amount: planConfig.amount, // Stripe 使用最小貨幣單位（分）
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel.html`,
      metadata: {
        service: service,
        plan: plan,
        customer_email: '', // 可選：從前端傳入
      },
      // 香港地址（可選）
      // customer_creation: 'always',
      // billing_address_collection: 'required',
      // shipping_address_collection: {
      //   allowed_countries: ['HK', 'CN'],
      // },
    });
    
    res.status(200).json({ id: session.id });
    
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message 
    });
  }
};
```

---

### Step 4: 創建環境變量

在 Vercel Dashboard 設置環境變量：

```
Settings → Environment Variables

Name: STRIPE_SECRET_KEY
Value: sk_test_你的密鑰（測試）或 sk_live_你的密鑰（生產）
```

或者創建 `.env` 文件（本地測試）：
```
STRIPE_SECRET_KEY=sk_test_...
```

---

### Step 5: 創建支付結果頁面

#### success.html（支付成功）

```html
<!DOCTYPE html>
<html lang="zh-HK">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>支付成功 - AIcountant</title>
  <link rel="stylesheet" href="css/style.css">
  <style>
    .success-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    .success-card {
      background: white;
      padding: 60px;
      border-radius: 20px;
      text-align: center;
      max-width: 500px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .success-icon {
      font-size: 80px;
      color: #4caf50;
      margin-bottom: 20px;
    }
    .success-title {
      font-size: 32px;
      margin-bottom: 15px;
      color: #333;
    }
    .success-message {
      color: #666;
      margin-bottom: 30px;
      line-height: 1.6;
    }
    .order-details {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 30px;
      text-align: left;
    }
    .order-details h3 {
      margin-bottom: 15px;
      color: #333;
    }
    .order-details p {
      margin: 8px 0;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="success-page">
    <div class="success-card">
      <div class="success-icon">✓</div>
      <h1 class="success-title">支付成功！</h1>
      <p class="success-message">
        感謝您的購買。我們已收到您的付款，將在 24 小時內與您聯繫安排後續服務。
      </p>
      
      <div class="order-details">
        <h3>訂單詳情</h3>
        <p><strong>訂單編號：</strong> <span id="session-id">-</span></p>
        <p><strong>服務：</strong> <span id="service-name">-</span></p>
        <p><strong>金額：</strong> <span id="amount">-</span></p>
        <p><strong>支付時間：</strong> <span id="payment-time">-</span></p>
      </div>
      
      <a href="index.html" class="btn btn-primary">返回首頁</a>
    </div>
  </div>
  
  <script>
    // 從 URL 獲取 session_id
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    document.getElementById('session-id').textContent = sessionId || 'N/A';
    document.getElementById('payment-time').textContent = new Date().toLocaleString('zh-HK');
    
    // 可選：調用後端獲取訂單詳情
    // fetch(`/api/get-session?session_id=${sessionId}`)
  </script>
</body>
</html>
```

#### cancel.html（支付取消）

```html
<!DOCTYPE html>
<html lang="zh-HK">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>支付取消 - AIcountant</title>
  <link rel="stylesheet" href="css/style.css">
  <style>
    .cancel-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      padding: 20px;
    }
    .cancel-card {
      background: white;
      padding: 60px;
      border-radius: 20px;
      text-align: center;
      max-width: 500px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    .cancel-icon {
      font-size: 80px;
      color: #ff9800;
      margin-bottom: 20px;
    }
    .cancel-title {
      font-size: 28px;
      margin-bottom: 15px;
      color: #333;
    }
    .cancel-message {
      color: #666;
      margin-bottom: 30px;
    }
    .btn-group {
      display: flex;
      gap: 15px;
      justify-content: center;
    }
  </style>
</head>
<body>
  <div class="cancel-page">
    <div class="cancel-card">
      <div class="cancel-icon">!</div>
      <h1 class="cancel-title">支付已取消</h1>
      <p class="cancel-message">
        您取消了支付。如有任何問題，請聯繫我們的客服團隊。
      </p>
      <div class="btn-group">
        <a href="index.html#services" class="btn btn-primary">重新選擇</a>
        <a href="index.html#contact" class="btn btn-secondary">聯繫客服</a>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## 📦 安裝依賴

在項目根目錄創建 `package.json`：

```json
{
  "name": "aicountant-website",
  "version": "1.0.0",
  "description": "AIcountant company website with Stripe payment",
  "scripts": {
    "dev": "vercel dev",
    "deploy": "vercel --prod"
  },
  "dependencies": {
    "stripe": "^14.0.0"
  },
  "devDependencies": {
    "vercel": "^33.0.0"
  }
}
```

然後運行：
```bash
npm install
```

---

## 🧪 測試支付

### 測試信用卡號碼
```
Visa: 4242 4242 4242 4242
Mastercard: 5555 5555 5555 4444

有效期：任何未來日期（如 12/25）
CVC：任何 3 位數（如 123）
```

### 測試支付寶/微信支付
- 使用 Stripe 測試模式時，會顯示模擬支付頁面
- 選擇 "成功" 或 "失敗" 來測試不同場景

---

## 🚀 部署到生產

### 1. 切換到生產模式

更新 `js/payment.js`：
```javascript
const stripe = Stripe('pk_live_你的生產密鑰');
```

### 2. 更新 Vercel 環境變量
```
STRIPE_SECRET_KEY = sk_live_你的生產密鑰
```

### 3. 重新部署
```bash
git add .
git commit -m "Add Stripe payment (production)"
git push origin main
```

Vercel 會自動重新部署。

---

## 📊 訂單管理

### 在 Stripe Dashboard 查看

```
Dashboard → Payments

可以看到：
- 所有支付記錄
- 支付狀態（成功/失敗/待處理）
- 客戶信息
- 退款操作
```

### 接收支付通知（Webhook）

創建 `api/webhook.js` 接收支付狀態更新：

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  
  // 處理支付成功事件
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // 發送確認郵件給客戶
    // 更新數據庫
    // 通知管理員
    
    console.log('Payment successful:', session.id);
  }
  
  res.status(200).json({ received: true });
};
```

在 Stripe Dashboard 設置 Webhook：
```
Developers → Webhooks → Add endpoint
URL: https://your-domain.com/api/webhook
Events: checkout.session.completed
```

---

## 💰 提現設置

### 連接銀行賬戶

```
Stripe Dashboard → Settings → Bank accounts and scheduling

添加香港銀行賬戶：
- 銀行名稱
- 賬戶號碼
- 分行代碼
```

### 提現時間
- 首次提現：7 日
- 之後：2 個工作日（T+2）

---

## ❓ 常見問題

### Q: 支持哪些貨幣？
**A**: 建議用 HKD（港幣）。Stripe 會自動處理貨幣轉換。

### Q: 可以開發票嗎？
**A**: 可以。在 Stripe Dashboard 可下載收據，或自行開香港發票。

### Q: 如何退款？
**A**: Stripe Dashboard → Payments → 選擇訂單 → Refund

### Q: 支付寶/微信支付要額外申請嗎？
**A**: 唔使！Stripe 已整合，啟用就得。

---

## ✅ 完成檢查清單

- [ ] Stripe 賬戶註冊完成
- [ ] API Keys 已獲取
- [ ] 支付方式已啟用（Card/Alipay/WeChat Pay）
- [ ] 前端支付按鈕已添加
- [ ] 後端 API 已創建
- [ ] 環境變量已設置
- [ ] 成功/取消頁面已創建
- [ ] 測試支付通過
- [ ] 生產環境已部署

---

**需要我幫你實現其中任何一步嗎？** 🚀
