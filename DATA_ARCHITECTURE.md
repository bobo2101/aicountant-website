# AIcountant 數據存儲架構

詳細說明 Supabase 中存儲的所有數據類型和位置。

---

## 📊 數據存儲位置總覽

```
┌─────────────────────────────────────────────────────────────────┐
│                      數據存儲架構                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │  Supabase       │    │  AWS S3         │                     │
│  │  PostgreSQL     │    │  (可選)         │                     │
│  │                 │    │                 │                     │
│  │ • 用戶資料      │    │ • 文件內容      │                     │
│  │ • 交易記錄      │    │ • PDF/圖片      │                     │
│  │ • 發票數據      │    │ • 備份文件      │                     │
│  │ • 元數據        │    │                 │                     │
│  └─────────────────┘    └─────────────────┘                     │
│                                                                  │
│  🔐 所有數據加密存儲                                            │
│  🔒 Row Level Security (RLS) 保護                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ PostgreSQL 數據庫表

### 1. 用戶相關數據

#### `auth.users` (Supabase 內置)
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | UUID | 用戶唯一ID |
| email | TEXT | 登入電郵 |
| encrypted_password | TEXT | 加密密碼 (bcrypt) |
| email_confirmed_at | TIMESTAMP | 電郵確認時間 |
| created_at | TIMESTAMP | 註冊時間 |

**存儲位置**：Supabase 安全區域，無法直接查詢

#### `profiles` (自定義)
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | UUID | 關聯 auth.users |
| email | TEXT | 電郵地址 |
| full_name | TEXT | 姓名 |
| company_name | TEXT | 公司名稱 |
| phone | TEXT | 電話 |
| role | TEXT | 角色 (client/admin) |
| created_at | TIMESTAMP | 創建時間 |

---

### 2. 財務數據

#### `transactions` (交易記錄)
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | UUID | 交易ID |
| user_id | UUID | 所屬用戶 |
| transaction_date | DATE | 交易日期 |
| description | TEXT | 描述 |
| amount | DECIMAL(12,2) | 金額 |
| type | TEXT | income/expense |
| category | TEXT | 類別 (銷售/租金/工資等) |
| vendor_customer | TEXT | 供應商/客戶 |
| status | TEXT | 狀態 |
| document_id | UUID | 關聯文件 |

**示例數據**：
```json
{
  "id": "uuid",
  "user_id": "user_uuid",
  "transaction_date": "2024-03-15",
  "description": "客戶付款 - ABC公司",
  "amount": 15000.00,
  "type": "income",
  "category": "銷售",
  "status": "completed"
}
```

#### `invoices` (發票)
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | UUID | 發票ID |
| user_id | UUID | 所屬用戶 |
| invoice_number | TEXT | 發票編號 |
| client_name | TEXT | 客戶名稱 |
| client_email | TEXT | 客戶電郵 |
| issue_date | DATE | 發票日期 |
| due_date | DATE | 到期日 |
| subtotal | DECIMAL(12,2) | 小計 |
| tax_rate | DECIMAL(5,2) | 稅率 |
| tax_amount | DECIMAL(12,2) | 稅額 |
| total_amount | DECIMAL(12,2) | 總計 |
| status | TEXT | draft/sent/paid/overdue |
| paid_date | DATE | 付款日期 |
| notes | TEXT | 備註 |

#### `invoice_items` (發票明細)
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | UUID | 明細ID |
| invoice_id | UUID | 關聯發票 |
| description | TEXT | 項目描述 |
| quantity | DECIMAL(10,2) | 數量 |
| unit_price | DECIMAL(12,2) | 單價 |
| total_price | DECIMAL(12,2) | 總價 |

---

### 3. 文件相關數據

#### `documents` (文件元數據)
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | UUID | 文件ID |
| user_id | UUID | 所屬用戶 |
| file_name | TEXT | 存儲文件名 |
| original_name | TEXT | 原始文件名 |
| file_type | TEXT | pdf/image |
| file_size | INTEGER | 文件大小 (bytes) |
| original_file_size | INTEGER | 原始大小 |
| mime_type | TEXT | MIME 類型 |
| storage_path | TEXT | 存儲路徑 |
| public_url | TEXT | 訪問 URL |
| doc_type | TEXT | 文檔類型 |
| processing_status | TEXT | pending/completed/failed |
| extracted_data | JSONB | OCR 提取數據 |
| ocr_confidence | DECIMAL | OCR 準確度 |
| processing_provider | TEXT | deepseek/google/basic |
| processing_cost | DECIMAL | 處理成本 |
| created_at | TIMESTAMP | 上傳時間 |

**示例數據**：
```json
{
  "id": "uuid",
  "user_id": "user_uuid",
  "original_name": "發票_20240315.pdf",
  "file_size": 256000,
  "doc_type": "invoice",
  "processing_status": "completed",
  "extracted_data": {
    "amount": 12500,
    "date": "2024-03-15",
    "vendor": "ABC有限公司",
    "documentType": "invoice"
  },
  "ocr_confidence": 85
}
```

**注意**：文件**內容**存儲在 S3/Storage，數據庫只存**元數據**

---

### 4. 報告和日誌

#### `reports` (財務報告)
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | UUID | 報告ID |
| user_id | UUID | 所屬用戶 |
| report_name | TEXT | 報告名稱 |
| report_type | TEXT | profit_loss/balance_sheet等 |
| start_date | DATE | 開始日期 |
| end_date | DATE | 結束日期 |
| report_data | JSONB | 報告數據 |
| file_url | TEXT | PDF 文件 URL |

#### `audit_logs` (審計日誌)
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | UUID | 日誌ID |
| user_id | UUID | 操作用戶 |
| action | TEXT | 操作類型 |
| table_name | TEXT | 目標表 |
| record_id | UUID | 目標記錄 |
| old_data | JSONB | 修改前數據 |
| new_data | JSONB | 修改後數據 |
| ip_address | INET | IP 地址 |
| created_at | TIMESTAMP | 操作時間 |

#### `ocr_usage_logs` (OCR 使用日誌)
| 欄位 | 類型 | 說明 |
|------|------|------|
| id | UUID | 記錄ID |
| user_id | UUID | 用戶ID |
| document_id | UUID | 文件ID |
| provider | TEXT | deepseek/google |
| cost | DECIMAL | 成本 (USD) |
| processing_time_ms | INTEGER | 處理時間 |
| created_at | TIMESTAMP | 時間 |

---

## 💾 文件存儲詳情

### 存儲位置對比

| 數據類型 | 存儲位置 | 大小 |
|---------|---------|------|
| 用戶資料、交易、發票 | PostgreSQL | ~KB 級 |
| 文件元數據 | PostgreSQL | ~KB 級 |
| **文件內容 (PDF/圖片)** | **S3 / Supabase Storage** | **~MB 級** |
| OCR 提取結果 | PostgreSQL (JSONB) | ~KB 級 |

### 文件存儲路徑

```
Supabase Storage / S3:
├── documents/
│   ├── {user_id}/
│   │   ├── 1710412345678_invoice_march.pdf
│   │   ├── 1710412345679_receipt_rent.jpg
│   │   └── ...
│   └── {another_user_id}/
│       └── ...
```

---

## 🔒 安全措施

### 1. 數據庫層面
- ✅ **Row Level Security (RLS)**：用戶只能看自己的數據
- ✅ **SSL/TLS**：所有連接加密
- ✅ **自動備份**：每日備份（Pro 計劃）

### 2. 文件存儲層面
- ✅ **私有 Bucket**：文件不公開訪問
- ✅ **簽名 URL**：臨時訪問連結
- ✅ **服務器端加密**：SSE-S3 或 SSE-KMS

### 3. 應用層面
- ✅ **JWT 認證**：所有請求需驗證
- ✅ **輸入驗證**：防止 SQL 注入
- ✅ **審計日誌**：所有操作可追蹤

---

## 📊 容量估算

### 單個用戶數據量

| 數據類型 | 單條大小 | 100 條 | 1000 條 |
|---------|---------|--------|---------|
| 交易記錄 | ~200 bytes | 20 KB | 200 KB |
| 發票 | ~500 bytes | 50 KB | 500 KB |
| 發票明細 | ~150 bytes | 15 KB | 150 KB |
| 文件元數據 | ~800 bytes | 80 KB | 800 KB |
| **總計** | | **165 KB** | **1.65 MB** |

### 文件存儲

| 文件類型 | 平均大小 | 100 個 | 1000 個 |
|---------|---------|--------|---------|
| 壓縮後圖片 | ~200 KB | 20 MB | 200 MB |
| PDF | ~500 KB | 50 MB | 500 MB |

---

## 🗑️ 數據保留政策

### 自動清理規則（建議）

| 數據類型 | 保留期限 | 處理方式 |
|---------|---------|---------|
| 審計日誌 | 7 年 | 符合法規要求 |
| OCR 使用日誌 | 2 年 | 成本分析後刪除 |
| 已刪除文件 | 30 天 | 軟刪除，之後永久刪除 |
| 臨時文件 | 7 天 | 自動清理 |

---

## 🚀 備份策略

### Supabase 自動備份
- **免費版**：無自動備份
- **Pro 版**：每日自動備份 + PITR（時間點恢復）

### 建議備份方案
1. **啟用 Pro 計劃**：獲得自動備份
2. **定期導出**：使用 `pg_dump` 導出數據
3. **S3 跨區域複製**：文件存多個區域

---

## 📋 合規注意事項

### 香港會計師公會要求
- ✅ 財務記錄保存 **7 年**
- ✅ 審計日誌完整
- ✅ 數據加密存儲

### GDPR / 私隱條例
- ✅ 用戶可導出個人數據
- ✅ 用戶可要求刪除賬戶
- ✅ 數據傳輸加密

---

## 💡 優化建議

### 1. 數據庫優化
- 定期清理無用日誌
- 對大表添加分區（如按月分區）
- 使用 JSONB 壓縮存儲變長數據

### 2. 存儲優化
- 啟用客戶端壓縮（已實現）
- 使用 S3 生命周期規則自動清理
- 對舊文件使用 Glacier 存儲（更便宜）

### 3. 成本優化
- 監控 OCR 使用成本
- 對批量操作使用隊列處理
- 緩存頻繁查詢的報告數據

---

**還想了解什麼？** 📊
