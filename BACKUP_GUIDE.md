# AIcountant 備份完全指南

完整的 Supabase 數據備份和恢復指南。

---

## 📋 備份策略概述

```
┌─────────────────────────────────────────────────────────────────┐
│                    3-2-1 備份原則                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  3️⃣  3 份數據副本                                              │
│       ├── 1份：生產環境 (Supabase)                              │
│       ├── 1份：本地備份 (你的電腦/NAS)                          │
│       └── 1份：異地備份 (AWS S3/其他雲)                        │
│                                                                  │
│  2️⃣  2 種不同存儲介質                                          │
│       ├── Supabase 雲端數據庫                                   │
│       └── 本地硬盤 / S3 對象存儲                                │
│                                                                  │
│  1️⃣  1 份異地備份                                              │
│       └── AWS S3 其他區域                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 備份類型

### 1. 自動備份（Supabase Pro）

**如果你使用 Supabase Pro ($25/月)：**
- ✅ 每日自動完整備份
- ✅ Point-in-Time Recovery (PITR) - 可恢復到任意時間點
- ✅ 保留 7 天備份歷史

**啟用方法：**
1. 登入 Supabase Dashboard
2. Project Settings → Database
3. 啟用 **Point-in-Time Recovery**

---

### 2. 手動備份（推薦搭配自動備份）

使用我們的備份腳本進行額外保護：

| 備份內容 | 頻率 | 保留時間 |
|---------|------|---------|
| 數據庫完整備份 | 每日 | 30 天 |
| Schema 結構備份 | 每日 | 90 天 |
| Storage 文件備份 | 每週 | 30 天 |
| S3 異地備份 | 每日 | 365 天 |

---

## 🛠️ 備份腳本設置

### 選項 A：macOS/Linux (Bash)

#### 1. 安裝依賴

```bash
# 安裝 PostgreSQL 客戶端（包含 pg_dump）
brew install postgresql  # Mac
# 或
sudo apt-get install postgresql-client  # Ubuntu

# 安裝 AWS CLI（如果用 S3）
brew install awscli  # Mac
# 或
sudo apt-get install awscli  # Ubuntu
```

#### 2. 配置腳本

```bash
# 編輯腳本
nano scripts/backup.sh

# 修改以下配置：
SUPABASE_PROJECT_REF="your-project-ref"
SUPABASE_DB_PASSWORD="your-db-password"
BACKUP_DIR="/Users/oliverng/backups/aicountant"
```

#### 3. 設置權限

```bash
chmod +x scripts/backup.sh
```

#### 4. 測試運行

```bash
./scripts/backup.sh
```

#### 5. 設置定時任務 (crontab)

```bash
# 編輯 crontab
crontab -e

# 添加以下行（每日凌晨 3 點運行）
0 3 * * * /Users/oliverng/Downloads/aicountant-website-project/website/scripts/backup.sh >> /Users/oliverng/backups/backup_cron.log 2>&1

# 保存並退出 (Ctrl+O, Enter, Ctrl+X)
```

#### 6. 驗證 crontab

```bash
crontab -l
```

---

### 選項 B：Windows (PowerShell)

#### 1. 安裝依賴

```powershell
# 下載 PostgreSQL 客戶端
# https://www.postgresql.org/download/windows/

# 安裝 AWS CLI
# https://aws.amazon.com/cli/
```

#### 2. 配置腳本

編輯 `scripts/backup.ps1`，修改配置參數。

#### 3. 設置定時任務

```powershell
# 打開任務計劃程序
# Win + R → taskschd.msc

# 創建基本任務
# 1. 名稱：AIcountant Daily Backup
# 2. 觸發器：每日 3:00 AM
# 3. 操作：啟動程序
# 4. 程序：powershell.exe
# 5. 參數：-File "C:\path\to\backup.ps1"
```

---

## 📥 手動備份方法

### 方法 1：使用 Supabase CLI

```bash
# 安裝 Supabase CLI
brew install supabase/tap/supabase

# 登入
supabase login

# 鏈接項目
supabase link --project-ref your-project-ref

# 導出數據庫
supabase db dump -f backup.sql

# 導出 Storage（文件）
supabase storage cp . /local/backup/path --recursive
```

### 方法 2：使用 pg_dump（推薦）

```bash
# 設置密碼環境變量
export PGPASSWORD="your-db-password"

# 導出完整數據庫
pg_dump \
  --host="db.your-project-ref.supabase.co" \
  --port=5432 \
  --username="postgres" \
  --dbname="postgres" \
  --format=custom \
  --file="backup_$(date +%Y%m%d).sql"

# 壓縮
gzip "backup_$(date +%Y%m%d).sql"
```

### 方法 3：僅導出特定表

```bash
# 僅備份交易記錄表
pg_dump \
  --host="db.your-project-ref.supabase.co" \
  --username="postgres" \
  --table="transactions" \
  --data-only \
  --file="transactions_backup.sql"
```

### 方法 4：導出為 CSV（Excel 可讀）

```bash
# 連接數據庫
psql "postgresql://postgres:password@db.your-project-ref.supabase.co:5432/postgres"

# 在 psql 中執行
\copy (SELECT * FROM transactions) TO '/path/to/transactions.csv' CSV HEADER;
```

---

## 🔄 恢復數據

### 從備份恢復數據庫

#### 完整恢復

```bash
# 注意：這會覆蓋現有數據！

# 解壓備份
gunzip backup_20240315.sql.gz

# 恢復到 Supabase
psql \
  --host="db.your-project-ref.supabase.co" \
  --username="postgres" \
  --dbname="postgres" \
  --file="backup_20240315.sql"
```

#### 恢復到本地測試

```bash
# 創建本地數據庫
createdb aicountant_restore

# 恢復
psql aicountant_restore < backup_20240315.sql
```

#### 使用 Supabase Pro PITR 恢復

1. 登入 Supabase Dashboard
2. Database → Backups
3. 點擊 **「Restore」**
4. 選擇要恢復的時間點
5. 確認恢復

---

## ☁️ 設置 AWS S3 異地備份

### 1. 創建 S3 備份桶

```bash
# 創建桶（啟用版本控制）
aws s3 mb s3://aicountant-backups --region ap-southeast-1

# 啟用版本控制
aws s3api put-bucket-versioning \
  --bucket aicountant-backups \
  --versioning-configuration Status=Enabled

# 啟用加密
aws s3api put-bucket-encryption \
  --bucket aicountant-backups \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
```

### 2. 配置生命周期（自動清理）

```bash
# 創建生命周期規則文件
cat > lifecycle.json << 'EOF'
{
  "Rules": [{
    "ID": "DeleteOldBackups",
    "Status": "Enabled",
    "Filter": {"Prefix": ""},
    "Expiration": {"Days": 365}
  }]
}
EOF

# 應用規則
aws s3api put-bucket-lifecycle-configuration \
  --bucket aicountant-backups \
  --lifecycle-configuration file://lifecycle.json
```

### 3. 測試上傳

```bash
# 上傳備份
cd /Users/oliverng/backups/aicountant/database
aws s3 cp backup_20240315.sql.gz s3://aicountant-backups/database/

# 驗證
aws s3 ls s3://aicountant-backups/database/
```

---

## 📊 備份監控

### 檢查備份狀態

```bash
# 查看最新備份
ls -lt ~/backups/aicountant/database/ | head -5

# 檢查備份大小
du -sh ~/backups/aicountant/

# 查看日誌
tail -f ~/backups/aicountant/logs/backup_*.log
```

### 備份健康檢查腳本

創建 `scripts/backup-check.sh`：

```bash
#!/bin/bash

BACKUP_DIR="/Users/oliverng/backups/aicountant"
ALERT_EMAIL="admin@yourcompany.com"

# 檢查最近備份
LATEST_BACKUP=$(find "$BACKUP_DIR/database" -name "*.sql.gz" -mtime -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "⚠️ 警告：最近 24 小時內無備份！" | mail -s "AIcountant Backup Alert" "$ALERT_EMAIL"
    exit 1
fi

# 檢查備份大小
BACKUP_SIZE=$(stat -f%z "$LATEST_BACKUP")
if [ "$BACKUP_SIZE" -lt 1024 ]; then
    echo "⚠️ 警告：備份文件過小，可能不完整！" | mail -s "AIcountant Backup Alert" "$ALERT_EMAIL"
    exit 1
fi

echo "✅ 備份檢查通過"
```

---

## 🚨 災難恢復計劃

### 場景 1：誤刪數據

```bash
# 1. 立即停止應用（防止覆蓋）
# 2. 從備份恢復到測試環境
pg_dump aicountant_backup < backup_20240315.sql

# 3. 查找並導出丟失的數據
psql aicountant_backup -c "COPY (SELECT * FROM transactions WHERE deleted_at > '2024-03-15') TO STDOUT CSV;" > missing_data.csv

# 4. 導入到生產環境
psql production_db -c "COPY transactions FROM '/path/to/missing_data.csv' CSV;"
```

### 場景 2：Supabase 服務中斷

1. **切換到備份數據庫**（如果有）
2. **啟動只讀模式**，顯示維護頁面
3. **聯繫 Supabase 支持**
4. **準備遷移到備用方案**（AWS RDS + S3）

### 場景 3：賬戶被鎖/數據被刪

```bash
# 從 S3 異地備份恢復
aws s3 cp s3://aicountant-backups/database/backup_20240315.sql.gz ./

# 恢復到新數據庫
gunzip backup_20240315.sql.gz
psql new_database < backup_20240315.sql
```

---

## 💰 備份成本估算

| 項目 | 大小 | 月成本 |
|------|------|--------|
| Supabase Pro | - | $25 |
| 本地備份存儲 | 10GB | ~$0 |
| S3 異地備份 | 10GB | ~$0.23 |
| **總計** | | **~$25.23/月** |

---

## ✅ 備份檢查清單

### 每日檢查
- [ ] 備份是否成功運行
- [ ] 備份文件大小是否合理
- [ ] 日誌中無錯誤

### 每週檢查
- [ ] 測試恢復一個備份
- [ ] 檢查備份存儲使用率
- [ ] 驗證 S3 異地備份

### 每月檢查
- [ ] 完整災難恢復演練
- [ ] 更新備份密碼/密鑰
- [ ] 檢查保留策略執行情況

---

## 📞 需要幫助？

如果遇到問題：
1. 檢查日誌文件：`~/backups/aicountant/logs/`
2. 驗證數據庫連接：`psql "postgresql://..."`
3. 聯繫 Supabase 支持：https://supabase.com/support

---

**需要我幫你配置具體的備份設置嗎？** 🔄
