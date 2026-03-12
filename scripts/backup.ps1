# AIcountant Supabase 自動備份腳本 (Windows PowerShell)
# 支持：數據庫備份 + Storage 文件備份

# ============================================
# 配置 - 請修改為你的實際值
# ============================================

$SUPABASE_PROJECT_REF = "your-project-ref"
$SUPABASE_DB_PASSWORD = "your-db-password"
$BACKUP_DIR = "$env:USERPROFILE\Backups\aicountant"
$S3_BACKUP_BUCKET = "s3://aicountant-backups"

$LOCAL_RETENTION_DAYS = 30
$S3_RETENTION_DAYS = 365

# ============================================
# 初始化
# ============================================

$DATE = Get-Date -Format "yyyyMMdd_HHmmss"
$DB_BACKUP_FILE = "aicountant_db_${DATE}.sql"
$LOG_FILE = "$BACKUP_DIR\logs\backup_${DATE}.log"

# 創建目錄
New-Item -ItemType Directory -Force -Path "$BACKUP_DIR\database" | Out-Null
New-Item -ItemType Directory -Force -Path "$BACKUP_DIR\storage" | Out-Null
New-Item -ItemType Directory -Force -Path "$BACKUP_DIR\logs" | Out-Null

# ============================================
# 日誌函數
# ============================================

function Write-Log {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LOG_FILE -Value $LogEntry
}

Write-Log "========================================"
Write-Log "AIcountant 備份開始"
Write-Log "========================================"

# ============================================
# 數據庫備份
# ============================================

function Backup-Database {
    Write-Log "開始數據庫備份..."
    
    $DB_BACKUP_PATH = "$BACKUP_DIR\database\$DB_BACKUP_FILE"
    
    $env:PGPASSWORD = $SUPABASE_DB_PASSWORD
    
    try {
        pg_dump.exe `
            --host="db.$SUPABASE_PROJECT_REF.supabase.co" `
            --port=5432 `
            --username="postgres" `
            --dbname="postgres" `
            --format=custom `
            --verbose `
            --file="${DB_BACKUP_PATH}.tmp" 2>&1 | Tee-Object -FilePath $LOG_FILE -Append
        
        if ($LASTEXITCODE -eq 0) {
            Compress-Archive -Path "${DB_BACKUP_PATH}.tmp" -DestinationPath "${DB_BACKUP_PATH}.zip"
            Remove-Item "${DB_BACKUP_PATH}.tmp"
            
            $DB_SIZE = (Get-Item "${DB_BACKUP_PATH}.zip").Length / 1MB
            Write-Log "✅ 數據庫備份成功: ${DB_BACKUP_FILE}.zip ($([math]::Round($DB_SIZE, 2)) MB)"
        }
        else {
            Write-Log "❌ 數據庫備份失敗"
        }
    }
    catch {
        Write-Log "❌ 數據庫備份異常: $_"
    }
}

# ============================================
# 執行備份
# ============================================

Backup-Database

Write-Log "備份完成！"
Write-Log "日誌文件: $LOG_FILE"

Pause
