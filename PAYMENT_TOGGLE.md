# 支付功能開關指南

## 當前狀態：支付功能已開發但未啟用

所有支付相關代碼已準備好，但暫時回退到「聯繫諮詢」模式。

---

## 🔄 切換方式

### 方案 A: 使用聯繫表單（當前模式）

適合：
- 暫時唔想處理在線支付
- 希望先與客戶溝通再報價
- 服務價格需要定制

**當前配置：**
- 所有「選擇方案」按鈕跳轉到聯繫表單
- 客戶填寫需求後，你人工跟進

---

### 方案 B: 啟用 Stripe 支付（準備好可隨時開啟）

適合：
- 希望自動化收款
- 標準化服務價格
- 減少人工溝通成本

**啟用步驟：**

#### Step 1: 獲取 Stripe API Keys
1. 去 https://dashboard.stripe.com/register
2. 註冊並驗證賬戶
3. 獲取 Publishable key (pk_test_...)
4. 獲取 Secret key (sk_test_...)

#### Step 2: 配置 Vercel 環境變量
```
Vercel Dashboard → 你的項目 → Settings → Environment Variables

添加：
Name: STRIPE_SECRET_KEY
Value: sk_test_你的密鑰（或 sk_live_生產密鑰）
```

#### Step 3: 更新前端代碼
編輯 `js/payment.js`：
```javascript
// 將第 6 行
this.stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY_HERE');

// 改為你的真實 key
this.stripe = Stripe('pk_test_你的真實PublishableKey');
```

#### Step 4: 推送部署
```bash
git add .
git commit -m "Enable Stripe payment"
git push origin main
```

Vercel 會自動重新部署，支付功能即啟用！

---

## 📝 支付功能文件清單

已創建嘅支付相關文件：

| 文件 | 用途 | 狀態 |
|------|------|------|
| `api/create-checkout-session.js` | 後端 API，創建支付會話 | ✅ 準備好 |
| `js/payment.js` | 前端支付處理 | ⚠️ 需填入 API Key |
| `success.html` | 支付成功頁面 | ✅ 準備好 |
| `cancel.html` | 支付取消頁面 | ✅ 準備好 |
| `package.json` | 項目依賴 | ✅ 已配置 |
| `.env.example` | 環境變量示例 | ✅ 參考用 |

---

## 🎯 建議

### 暫時保持現狀（聯繫表單）

優點：
- ✅ 無需處理支付合規
- ✅ 可靈活報價
- ✅ 與客戶建立關係

缺點：
- ❌ 需要人工跟進每個查詢
- ❌ 無法自動收款
- ❌ 客戶需等待回覆

### 未來啟用在線支付

當你準備好時，按照上方「方案 B」步驟，約 30 分鐘即可完成啟用。

---

## 💡 混合模式（推薦）

可以部分服務用支付，部分用諮詢：

```
標準服務（固定價格）→ Stripe 支付
    - 公司註冊基礎版/標準版
    - 記賬服務

定制服務（面議價格）→ 聯繫表單
    - 審計服務高級版
    - 企業諮詢
```

實現方式：
- 喺 `index.html` 中，部分按鈕用 `<button>`（支付）
- 部分按鈕用 `<a href="#contact">`（諮詢）

---

## 📞 支持

當你想啟用支付功能時：
1. 參考本文檔
2. 或問我幫手！

---

*最後更新: 2026-03-11*
*支付功能狀態: 已開發，暫未啟用*
