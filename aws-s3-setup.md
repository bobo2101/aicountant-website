# AWS S3 設置指南

使用 AWS S3 存儲財務文件，比 Supabase Storage 更穩定、更專業。

---

## 優勢對比

| 功能 | Supabase Storage | AWS S3 |
|------|------------------|--------|
| 免費額度 | 1GB | 5GB |
| 穩定性 SLA | 99.9% | 99.999999999% (11個9) |
| 全球 CDN | ❌ | ✅ CloudFront |
| 版本控制 | ❌ | ✅ |
| 生命周期管理 | ❌ | ✅ (自動刪除舊文件) |
| 跨區域複製 | ❌ | ✅ |
| 合規認證 | 基礎 | SOC/PCI/HIPAA 等 |

---

## 步驟 1：創建 AWS 賬戶

1. 訪問 https://aws.amazon.com/
2. 點擊 **「Create an AWS Account」**
3. 輸入電郵地址、密碼、AWS 賬戶名稱
4. 選擇 **「Personal」** 或 **「Business」**
5. 輸入聯繫信息和信用卡
   - ⚠️ 需要信用卡驗證，但免費額度內不扣費
6. 驗證手機號碼
7. 選擇 **Basic Support Plan**（免費）

---

## 步驟 2：創建 S3 Bucket

1. 登入 AWS Management Console
2. 頂部搜索欄輸入 **「S3」**，點擊進入
3. 點擊橙色按鈕 **「Create bucket」**

### Bucket 配置：

| 設置項 | 建議值 | 說明 |
|--------|--------|------|
| **Bucket name** | `aicountant-docs-prod` | 全球唯一，小寫字母 |
| **AWS Region** | `Asia Pacific (Singapore)` | 最接近你的用戶 |
| **Block all public access** | ✅ 勾選 | 保持私有，安全 |
| **Bucket Versioning** | ✅ 啟用 | 防止誤刪 |
| **Default encryption** | ✅ 啟用 | SSE-S3 |

4. 點擊 **「Create bucket」**

---

## 步驟 3：創建 IAM 用戶（安全訪問）

為了安全，不要使用 Root 賬戶，創建專用 IAM 用戶：

1. 頂部搜索 **「IAM」**，點擊進入
2. 左側選單 **「Users」** → 點擊 **「Add users」**
3. **User name**：`aicountant-s3-user`
4. **Access type**：
   - ✅ 勾選 **「Access key - Programmatic access」**
   - ❌ 不勾選「Password - AWS Management Console access」
5. 點擊 **「Next: Permissions」**
6. 選擇 **「Attach existing policies directly」**
7. 搜索框輸入 **「S3」**
8. 勾選 **「AmazonS3FullAccess」**
   - 生產環境建議創建自定義策略限制只訪問特定 bucket
9. 點擊 **「Next: Tags」**（可跳過）
10. 點擊 **「Next: Review」** → **「Create user」**

### ⚠️ 重要：保存憑據

創建成功後，會顯示：
- **Access key ID**：`AKIA...` 
- **Secret access key**：`wJalrXUtnFEMI/K7MDENG/bPxRfiCY...`

**立即複製並保存！Secret key 只顯示一次！**

---

## 步驟 4：設置 CORS（跨域訪問）

允許你的網站直接上傳文件到 S3：

1. 進入你的 bucket
2. 點擊 **「Permissions」** 標籤
3. 滾動到 **「Cross-origin resource sharing (CORS)」**
4. 點擊 **「Edit」**
5. 貼上以下配置：

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "PUT",
            "POST",
            "GET"
        ],
        "AllowedOrigins": [
            "http://localhost:3000",
            "https://your-domain.com",
            "https://aicountant-website.vercel.app"
        ],
        "ExposeHeaders": [
            "ETag"
        ],
        "MaxAgeSeconds": 3000
    }
]
```

6. 點擊 **「Save changes」**

---

## 步驟 5：更新前端代碼

### 安裝 AWS SDK

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 或使用 CDN（簡單方式）

在 HTML 中添加：
```html
<script src="https://sdk.amazonaws.com/js/aws-sdk-2.1000.0.min.js"></script>
```

### 上傳代碼示例

見 `js/s3-upload.js` 文件（我會創建給你）

---

## 步驟 6：設置生命周期（自動清理）

為了節省成本，自動刪除舊文件：

1. 進入 bucket → **「Management」** 標籤
2. 點擊 **「Create lifecycle rule」**
3. **Rule name**：`delete-old-documents`
4. **Choose a rule scope**：Apply to all objects in the bucket
5. **Lifecycle rule actions**：
   - ✅ 勾選 **「Expire current versions of objects」**
   - **Days after object creation**：2555 天（7年，符合稅務要求）
6. 點擊 **「Create rule」**

---

## 價格估算

### 場景：中型會計公司

| 指標 | 數值 |
|------|------|
| 文件數量 | 10,000 張 |
| 平均大小 | 200KB（壓縮後）|
| 總容量 | ~2GB |

### 月費用：

| 項目 | 計算 | 價格 |
|------|------|------|
| 存儲費 | 2GB × $0.023 | **$0.046 (~HKD 0.36)** |
| 請求費 | 10,000 PUT × $0.005/1000 | **$0.05 (~HKD 0.39)** |
| 數據傳出 | 假設 50GB/月 × $0.09 | **$4.50 (~HKD 35)** |
| **總計** | | **~HKD 36/月** |

---

## 安全配置清單

- [ ] Bucket 設置為私有（Block public access）
- [ ] 啟用版本控制（防誤刪）
- [ ] 啟用加密（SSE-S3）
- [ ] 使用 IAM 用戶（非 Root）
- [ ] 設置生命周期規則
- [ ] 啟用 CloudTrail（審計日誌）

---

## 故障排除

### Access Denied 錯誤
檢查 IAM 用戶權限，確認勾選了 S3 訪問權限。

### CORS 錯誤
確認 CORS 配置中的 AllowedOrigins 包含你的網站域名。

### 費用超出預期
檢查數據傳出流量，使用 CloudFront 減少費用。

---

**需要我創建完整的 S3 上傳代碼嗎？** 📤
