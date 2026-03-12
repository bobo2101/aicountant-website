# DeepSeek OCR 設置指南

使用 DeepSeek V3 進行發票識別，比 Google Vision 便宜 95%！

---

## 💰 價格對比

| 服務 | 每 1,000 次 | 你的成本 (1,000 次/月) |
|------|------------|----------------------|
| Google Vision | $1.50 USD | ~HKD 12 |
| **DeepSeek V3** | **~$0.08 USD** | **~HKD 0.60** |
| **節省** | **95%** | **省 HKD 11.4** |

---

## 步驟 1：註冊 DeepSeek 賬戶

### 1.1 訪問官網
1. 打開 https://platform.deepseek.com/
2. 點擊 **「開始使用」** 或 **「Sign Up」**
3. 使用手機號或郵箱註冊

### 1.2 實名認證（可能需要）
- 中國大陸用戶：需要身份證認證
- 香港/海外用戶：可能只需郵箱驗證

---

## 步驟 2：獲取 API Key

### 2.1 進入 API 管理
1. 登入後，點擊右上角 **「API Keys」**
2. 或訪問：https://platform.deepseek.com/api_keys

### 2.2 創建 API Key
1. 點擊 **「創建 API Key」**
2. 輸入名稱：`aicountant-ocr`
3. 點擊 **「創建」**
4. **⚠️ 立即複製 API Key**（格式：`sk-...`）
   - **只顯示一次！**
   - 保存到安全的地方

### 2.3 充值（可選）
DeepSeek 有免費試用額度，之後需要充值：
1. 點擊 **「充值」**
2. 最低充值 ¥10（約 HKD 11）
3. 支持支付寶、微信

---

## 步驟 3：設置 Supabase Edge Function

### 3.1 安裝 Supabase CLI

如果還沒安裝，打開終端運行：

```bash
# Mac
brew install supabase/tap/supabase

# 或下載二進制文件
# https://github.com/supabase/cli/releases
```

### 3.2 登入 Supabase

```bash
supabase login
```

會打開瀏覽器讓你授權。

### 3.3 鏈接你的項目

```bash
# 進入項目目錄
cd /Users/oliverng/Downloads/aicountant-website-project/website

# 鏈接項目
supabase link --project-ref lwmgekggcpwfxnyphlpc
```

### 3.4 設置 DeepSeek API Key

```bash
# 設置環境變量
supabase secrets set DEEPSEEK_API_KEY=sk-your-actual-key-here

# 驗證設置
supabase secrets list
```

應該看到 `DEEPSEEK_API_KEY` 已設置。

### 3.5 部署 Edge Function

```bash
# 部署 OCR 函數
supabase functions deploy ocr-process

# 驗證部署
supabase functions list
```

---

## 步驟 4：測試 OCR 功能

### 4.1 上傳測試文件

1. 訪問 `http://localhost:3000/portal/documents.html`
2. 上傳一張發票圖片（JPG/PNG）
3. 等待 3-5 秒處理

### 4.2 查看結果

應該看到：
- ✅ 處理狀態變為「已完成」
- ✅ 顯示識別的金額、日期、供應商
- ✅ 顯示準確度分數
- ✅ 「創建交易記錄」按鈕

---

## 🔧 故障排除

### 錯誤：「DEEPSEEK_API_KEY not set」

**解決**：
```bash
supabase secrets set DEEPSEEK_API_KEY=sk-your-key
supabase functions deploy ocr-process
```

### 錯誤：「API key invalid」

**解決**：
1. 檢查 API Key 是否完整（以 `sk-` 開頭）
2. 確認已充值（餘額 > ¥0）
3. 重新創建 API Key

### 錯誤：「Function invocation timeout」

**解決**：
- DeepSeek 響應較慢時會超時
- 這是正常的，數據仍會保存
- 刷新頁面查看結果

### OCR 識別不準確

**優化建議**：
1. 確保圖片清晰（建議 800px 以上寬度）
2. 光線充足，無陰影
3. 文件平放拍攝
4. 避免手寫字體

---

## 📊 監控使用情況

### 查看 DeepSeek 使用儀表板

1. 訪問：https://platform.deepseek.com/usage
2. 查看：
   - 總調用次數
   - 總 Token 使用量
   - 總費用

### Supabase 日誌

```bash
# 查看函數日誌
supabase functions logs ocr-process --tail
```

---

## 💡 高級配置（可選）

### 啟用成本追蹤

設置環境變量：
```bash
supabase secrets set ENABLE_COST_TRACKING=true
supabase functions deploy ocr-process
```

這會在數據庫中記錄每次 OCR 的成本。

### 配置備用方案（Google Vision）

如果 DeepSeek 失敗，自動切換到 Google Vision：

```bash
# 同時設置兩個 API Key
supabase secrets set DEEPSEEK_API_KEY=sk-your-key
supabase secrets set GOOGLE_VISION_API_KEY=your-google-key
supabase functions deploy ocr-process
```

Edge Function 會優先使用 DeepSeek，失敗時自動切換。

---

## 🎯 完成檢查清單

- [ ] 註冊 DeepSeek 賬戶
- [ ] 創建 API Key 並保存
- [ ] 安裝 Supabase CLI
- [ ] 設置 `DEEPSEEK_API_KEY` 環境變量
- [ ] 部署 `ocr-process` 函數
- [ ] 上傳測試文件驗證
- [ ] 查看識別結果

---

## 📞 需要幫助？

- DeepSeek 文檔：https://platform.deepseek.com/docs
- DeepSeek Discord：https://discord.gg/deepseek
- 費用問題：platform@deepseek.com

---

**準備好開始了嗎？請完成步驟 1 和 2（註冊並獲取 API Key），然後告訴我！** 🚀
