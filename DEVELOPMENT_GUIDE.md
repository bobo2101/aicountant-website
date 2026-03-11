# AIcountant 開發指南

## Q1: 換電腦後如何繼續更新？

### 方法 1: 從 GitHub 克隆（推薦）

在新電腦上執行：

```bash
# 1. 安裝 Git
# Mac: brew install git
# Windows: 下載 https://git-scm.com/download/win

# 2. 克隆倉庫
# 方法 A: 使用 SSH (推薦長期使用)
git clone git@github.com:bobo2101/aicountant-website.git

# 方法 B: 使用 HTTPS + Token
git clone https://bobo2101:YOUR_TOKEN@github.com/bobo2101/aicountant-website.git

# 3. 進入目錄
cd aicountant-website

# 4. 開始編輯
# 用 VS Code: code .
# 用其他編輯器打開文件夾
```

### 方法 2: 使用 GitHub Desktop（適合新手）

1. 下載 https://desktop.github.com
2. 登錄 GitHub 賬戶
3. Clone 倉庫 `aicountant-website`
4. 用 VS Code / 其他編輯器打開

### 方法 3: 使用 GitHub Codespaces（在線開發）

1. 去 https://github.com/bobo2101/aicountant-website
2. 點擊綠色 **Code** 按鈕
3. 選擇 **Codespaces** 標籤
4. 點擊 **Create codespace**
5. 在瀏覽器中直接編輯（無需安裝任何軟件！）

---

## Q2: 購買功能實現方案

### 方案比較

| 方案 | 難度 | 成本 | 適合階段 | 功能 |
|------|------|------|---------|------|
| **A. 第三方支付鏈接** | 簡單 | 中 | MVP | 跳轉到支付頁面 |
| **B. Stripe 嵌入式** | 中等 | 低 | 初創 | 網站內完成支付 |
| **C. 完整電商系統** | 困難 | 高 | 成熟 | 購物車+會員系統 |

### 推薦方案：B - Stripe 嵌入式

**為什麼？**
- 免費開戶
- 支持信用卡/支付寶/微信支付
- 可嵌入現有網站
- 自動發票/收據

### 實現步驟

#### Step 1: 註冊 Stripe
1. 去 https://stripe.com
2. 創建賬戶
3. 完成驗證

#### Step 2: 創建產品

在 Stripe Dashboard 創建 6 個產品：
```
產品 1: 公司註冊 - 基礎版
價格: HKD 1,999

產品 2: 公司註冊 - 標準版
價格: HKD 3,999

...（其他服務）
```

#### Step 3: 添加支付按鈕到網站

在你的網站添加：

```html
<!-- 每個價格卡片添加 -->
<button class="stripe-checkout" 
        data-price-id="price_你的價格ID">
  立即購買
</button>

<!-- Stripe JS -->
<script src="https://js.stripe.com/v3/"></script>
<script>
const stripe = Stripe('你的Publishable Key');

// 點擊支付按鈕
document.querySelectorAll('.stripe-checkout').forEach(button => {
  button.addEventListener('click', async () => {
    const priceId = button.dataset.priceId;
    
    // 創建 Checkout Session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId })
    });
    
    const session = await response.json();
    
    // 跳轉到 Stripe 支付頁面
    stripe.redirectToCheckout({ sessionId: session.id });
  });
});
</script>
```

#### Step 4: 創建後端 API

需要一個簡單的後端來處理支付。

**方案 A: Stripe Checkout（最簡單）**
- 用戶點擊 → 跳轉到 Stripe 托管的支付頁面 → 支付完成返回

**方案 B: Vercel Serverless Function（推薦）**
```javascript
// api/create-checkout-session.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price: req.body.priceId,
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${req.headers.origin}/success`,
    cancel_url: `${req.headers.origin}/cancel`,
  });
  
  res.status(200).json({ id: session.id });
};
```

### 簡化版：只用支付鏈接

如果你暫時唔想搞後端：

1. 在 Stripe 創建 "Payment Link"
2. 將鏈接放在按鈕上
3. 用戶點擊 → 跳轉到 Stripe 支付

```html
<a href="https://buy.stripe.com/你的支付鏈接" class="btn btn-primary">
  立即購買
</a>
```

---

## Q3: Client Portal 功能規劃

### 參考 Sleek / Osome 的功能

#### Sleek 有的功能：
1. 📊 Dashboard - 財務概覽
2. 📁 文檔中心 - 上傳/下載文件
3. 🔔 通知中心 - 截止日期提醒
4. 💬 在線聊天 - 與會計師溝通
5. 📈 報告查看 - 財務報表
6. ⚙️ 公司設置 - 修改公司信息

#### Osome 有的功能：
1. 🤖 AI 助手 - 自動回答問題
2. 📱 手機 App - 隨時隨地訪問
3. 🧾 自動記賬 - 拍照上傳發票
4. 📊 實時財務狀況 - 現金流追蹤
5. 📅 任務日歷 - 重要日期提醒
6. 👥 團隊管理 - 多個用戶權限

### 我哋的 Client Portal 功能建議

#### Phase 1: 基礎功能（MVP）

```
┌─────────────────────────────────────────┐
│  Client Portal                          │
├─────────────────────────────────────────┤
│  🔐 登錄/註冊                            │
│                                         │
│  📊 Dashboard                           │
│    ├── 服務狀態概覽                      │
│    ├── 待辦事項                          │
│    └── 最近活動                          │
│                                         │
│  📁 文檔中心                             │
│    ├── 上傳文件                          │
│    ├── 掃描發票（手機相機）               │
│    └── 查看已上傳                         │
│                                         │
│  💬 消息中心                             │
│    └── 與會計師溝通                       │
│                                         │
│  ⚙️ 賬戶設置                             │
└─────────────────────────────────────────┘
```

#### Phase 2: 高級功能

```
📈 財務儀表盤
├── 月度收支圖表
├── 現金流預測
└── 稅務概覽

🧾 智能記賬
├── AI 自動識別發票
├── 自動分類
└── 銀行對賬

📅 任務管理
├── 截止日期日歷
├── 自動提醒
└── 進度追蹤

👥 多用戶支持
├── 管理員/員工權限
├── 角色分配
└── 操作日誌
```

### 技術架構建議

```
前端：React / Vue.js（動態網站）
  ↓
後端：Node.js + Express / Firebase
  ↓
數據庫：PostgreSQL / MongoDB
  ↓
存儲：AWS S3 / Cloudinary（文件上傳）
  ↓
AI：OpenAI API（發票識別）
```

### 簡化版：使用現成工具

如果你唔想由零開始建：

#### 方案 A: 使用 Firebase（快速）
- Authentication: 用戶登錄
- Firestore: 數據庫
- Storage: 文件存儲
- Hosting: 托管

#### 方案 B: 使用低代碼平台
- **Bubble**: 可視化構建，有數據庫+用戶系統
- **Webflow + Memberstack**: 會員系統
- **Softr**: Airtable 數據庫 + 前端界面

---

## Q4: Client Portal 安全方案

### 必須的安全措施

#### 1. 身份驗證
```
✅ 強密碼要求（8位+大小寫+數字）
✅ 雙因素認證（2FA）- Google Authenticator
✅ JWT Token（無狀態驗證）
✅ Session 過期（30分鐘無操作自動登出）
```

#### 2. 數據加密
```
傳輸中：TLS 1.3（HTTPS）
存儲中：AES-256 加密
數據庫：敏感字段加密（身份證、銀行卡號）
備份：加密備份
```

#### 3. 訪問控制
```
✅ Role-Based Access Control (RBAC)
   ├── Admin（管理員）
   ├── Accountant（會計師）
   ├── Client（客戶）
   └── Viewer（只讀）

✅ 資源隔離
   ├── 用戶 A 只能睇自己嘅文件
   └── 橫向越權防護
```

#### 4. 文件上傳安全
```
✅ 文件類型限制（只允許 PDF, JPG, PNG, Excel）
✅ 文件大小限制（最大 10MB）
✅ 病毒掃描（ClamAV / VirusTotal API）
✅ 存儲隔離（每個用戶獨立文件夾）
```

#### 5. 安全監控
```
✅ 登錄日誌（時間、IP、設備）
✅ 操作審計日誌（邊個做咗咩）
✅ 異常登錄提醒（新設備/新地點）
✅ 失敗登錄限製（5次失敗鎖15分鐘）
```

### 合規要求（香港）

```
✅ PDPO 個人資料（私隱）條例
   ├── 數據收集聲明
   ├── 用戶同意
   ├── 數據保留期限
   └── 刪除權利

✅ 稅務記錄保存
   └── 至少保存 7 年
```

### 技術實現清單

```javascript
// 示例：安全中間件
const securityMiddleware = {
  // 1. Helmet 安全頭
  helmet: require('helmet')(),
  
  // 2. 速率限制
  rateLimit: require('express-rate-limit')({
    windowMs: 15 * 60 * 1000, // 15分鐘
    max: 100 // 每個IP 100次請求
  }),
  
  // 3. CORS 限制
  cors: require('cors')({
    origin: 'https://yourdomain.com',
    credentials: true
  }),
  
  // 4. 輸入驗證
  validator: require('express-validator')(),
  
  // 5. SQL 注入防護
  sqlInjection: require('sqlstring').escape
};
```

---

## 🎯 建議實施順序

```
第 1 階段（1-2 週）
├── 實現 Stripe 支付
└── 簡單購買流程

第 2 階段（3-4 週）
├── 用戶註冊/登錄系統
├── 基礎 Dashboard
└── 文件上傳

第 3 階段（5-8 週）
├── 發票掃描（AI 識別）
├── 財務儀表盤
└── 消息系統

第 4 階段（持續）
├── 高級分析
├── 移動端 App
└── 自動化流程
```

---

## 💰 預算估算

### MVP 版本（第 1-2 階段）

| 項目 | 月費 | 備註 |
|------|------|------|
| Vercel Pro | $20 | 更多功能 |
| Firebase | $0-25 | 按用量 |
| Stripe | 2.9% + $0.30 | 每筆交易 |
| OpenAI API | $0-20 | AI 功能 |
| 總計 | ~$50-100/月 | |

### 完整版本（第 3-4 階段）

| 項目 | 月費 | 備註 |
|------|------|------|
| AWS/VPS | $50-200 | 服務器 |
| 數據庫 | $15-50 | RDS |
| 存儲 | $10-30 | S3 |
| 總計 | ~$100-300/月 | |

---

**你想先開始邊個功能？** 我可以幫你逐步實現！
