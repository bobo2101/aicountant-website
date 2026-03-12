# Google Vision OCR 設置指南

設置 Google Vision API 來自動識別上傳的發票和收據。

---

## 功能概述

上傳文件後，系統會自動：
1. ✅ 提取發票金額
2. ✅ 識別日期
3. ✅ 提取供應商名稱
4. ✅ 識別發票編號
5. ✅ 顯示識別結果供確認
6. ✅ 一鍵創建交易記錄

---

## 步驟 1：創建 Google Cloud 項目

1. 訪問 https://console.cloud.google.com/
2. 登入你的 Google 賬戶
3. 點擊項目選擇器（頂部）→ **「新建項目」**
4. 項目名稱：`aicountant-ocr`
5. 點擊 **「創建」**

---

## 步驟 2：啟用 Vision API

1. 在 Google Cloud Console，搜索 **「Vision API」**
2. 點擊 **「Cloud Vision API」**
3. 點擊 **「啟用」**
4. 等待 API 啟用（約 30 秒）

---

## 步驟 3：創建 API 密鑰

1. 點擊左側選單 **「API 和服務」** → **「憑據」**
2. 點擊 **「創建憑據」** → **「API 密鑰」**
3. 複製生成的密鑰（以 `AIza` 開頭）
4. 點擊 **「限制密鑰」**（重要！）
   - **應用程式限制**：選擇「無」（Edge Function 使用）
   - **API 限制**：選擇 **「Cloud Vision API」**
   - 點擊 **「保存」**

---

## 步驟 4：設置 Supabase Edge Function

### 4.1 安裝 Supabase CLI

```bash
# 使用 Homebrew (Mac)
brew install supabase/tap/supabase

# 或使用 npm
npm install -g supabase
```

### 4.2 登入 Supabase

```bash
supabase login
```

### 4.3 鏈接你的項目

```bash
cd /Users/oliverng/Downloads/aicountant-website-project/website

# 鏈接項目（替換為你的項目 ref）
supabase link --project-ref your-project-ref
```

### 4.4 設置環境變量

```bash
# 設置 Google Vision API Key
supabase secrets set GOOGLE_VISION_API_KEY=你的API密鑰

# 驗證設置
supabase secrets list
```

### 4.5 部署 Edge Function

```bash
# 部署 OCR 函數
supabase functions deploy ocr-process

# 驗證部署
supabase functions list
```

---

## 步驟 5：測試 OCR 功能

### 5.1 上傳測試文件

1. 訪問 `http://localhost:3000/portal/documents.html`
2. 上傳一張發票圖片（JPG/PNG/PDF）
3. 等待幾秒鐘處理

### 5.2 查看結果

上傳後你應該看到：
- ✅ 處理狀態從「處理中」變為「已完成」
- ✅ 顯示提取的數據（金額、日期、供應商）
- ✅ 「創建交易」按鈕

---

## 價格

| 使用量 | 價格 |
|--------|------|
| 前 1000 個請求/月 | 免費 |
| 1001-500萬請求 | $1.50 / 1000 次 |

對於小型會計公司，免費額度通常足夠。

---

## 故障排除

### 錯誤：「GOOGLE_VISION_API_KEY not set」
確保已運行：
```bash
supabase secrets set GOOGLE_VISION_API_KEY=你的密鑰
```

### 錯誤：「Vision API error」
1. 檢查 API 密鑰是否正確
2. 確認 Vision API 已啟用
3. 檢查密鑰限制是否設置正確

### OCR 識別不準確
- 確保圖片清晰
- 光線充足
- 文件平放拍攝

---

**完成！現在你可以上傳發票並自動識別了！** 🎉
