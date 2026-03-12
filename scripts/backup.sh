#!/bin/bash

# AIcountant Supabase 自動備份腳本
# 支持：數據庫備份 + Storage 文件備份
# 建議：設置為每日凌晨 3 點運行 (crontab)

# ============================================
# 配置 - 請修改為你的實際值
# ============================================

# Supabase 項目信息
SUPABASE_PROJECT_REF="your-project-ref"  # 從 Supabase URL 獲取: https://<project-ref>.supabase.co
SUPABASE_DB_PASSWORD="your-db-password"   # 數據庫密碼

# 備份存儲位置
BACKUP_DIR="/Users/oliverng/backups/aicountant"  # 本地備份目錄
S3_BACKUP_BUCKET="s3://aicountant-backups"        # (可選) AWS S3 備份桶

# 保留策略
LOCAL_RETENTION_DAYS=30      # 本地保留 30 天
S3_RETENTION_DAYS=365        # S3 保留 1 年

# ============================================
# 日期和文件名
# ============================================

DATE=$(date +%Y%m%d_%H%M%S)
DB_BACKUP_FILE="aicountant_db_${DATE}.sql"
STORAGE_BACKUP_FILE="aicountant_storage_${DATE}.tar.gz"
LOG_FILE="${BACKUP_DIR}/backup_${DATE}.log"

# ============================================
# 初始化
# ============================================

# 創建備份目錄
mkdir -p "${BACKUP_DIR}/database"
mkdir -p "${BACKUP_DIR}/storage"
mkdir -p "${BACKUP_DIR}/logs"

# 開始日誌
echo "========================================" >> "${LOG_FILE}"
echo "AIcountant 備份開始: $(date)" >> "${LOG_FILE}"
echo "========================================" >> "${LOG_FILE}"

# ============================================
# 函數：記錄日誌
# ============================================

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "${LOG_FILE}"
}

# ============================================
# 備份 1：PostgreSQL 數據庫
# ============================================

database_backup() {
    log_message "開始數據庫備份..."
    
    DB_BACKUP_PATH="${BACKUP_DIR}/database/${DB_BACKUP_FILE}"
    
    # 使用 pg_dump 備份
    PGPASSWORD="${SUPABASE_DB_PASSWORD}" pg_dump \
        --host="db.${SUPABASE_PROJECT_REF}.supabase.co" \
        --port=5432 \
        --username="postgres" \
        --dbname="postgres" \
        --format=custom \
        --verbose \
        --file="${DB_BACKUP_PATH}.tmp" 2>> "${LOG_FILE}"
    
    if [ $? -eq 0 ]; then
        # 壓縮備份文件
        gzip "${DB_BACKUP_PATH}.tmp"
        mv "${DB_BACKUP_PATH}.tmp.gz" "${DB_BACKUP_PATH}.gz"
        
        DB_SIZE=$(du -h "${DB_BACKUP_PATH}.gz" | cut -f1)
        log_message "✅ 數據庫備份成功: ${DB_BACKUP_FILE}.gz (${DB_SIZE})"
        
        # 上傳到 S3（如果配置了）
        if [ -n "${S3_BACKUP_BUCKET}" ]; then
            aws s3 cp "${DB_BACKUP_PATH}.gz" "${S3_BACKUP_BUCKET}/database/" >> "${LOG_FILE}" 2>&1
            if [ $? -eq 0 ]; then
                log_message "✅ 數據庫備份已上傳到 S3"
            else
                log_message "⚠️ S3 上傳失敗，但本地備份保留"
            fi
        fi
    else
        log_message "❌ 數據庫備份失敗"
        return 1
    fi
}

# ============================================
# 備份 2：Supabase Storage 文件
# ============================================

storage_backup() {
    log_message "開始 Storage 文件備份..."
    
    STORAGE_BACKUP_PATH="${BACKUP_DIR}/storage/${STORAGE_BACKUP_FILE}"
    TEMP_STORAGE_DIR="${BACKUP_DIR}/storage/temp_${DATE}"
    
    # 創建臨時目錄
    mkdir -p "${TEMP_STORAGE_DIR}"
    
    # 使用 Supabase CLI 導出 Storage
    # 注意：需要先安裝 supabase CLI 並登入
    supabase storage cp "${SUPABASE_PROJECT_REF}/documents" "${TEMP_STORAGE_DIR}/" --recursive >> "${LOG_FILE}" 2>&1
    
    if [ $? -eq 0 ]; then
        # 打包壓縮
        tar -czf "${STORAGE_BACKUP_PATH}" -C "${TEMP_STORAGE_DIR}" . 2>> "${LOG_FILE}"
        
        # 清理臨時文件
        rm -rf "${TEMP_STORAGE_DIR}"
        
        STORAGE_SIZE=$(du -h "${STORAGE_BACKUP_PATH}" | cut -f1)
        log_message "✅ Storage 備份成功: ${STORAGE_BACKUP_FILE} (${STORAGE_SIZE})"
        
        # 上傳到 S3
        if [ -n "${S3_BACKUP_BUCKET}" ]; then
            aws s3 cp "${STORAGE_BACKUP_PATH}" "${S3_BACKUP_BUCKET}/storage/" >> "${LOG_FILE}" 2>&1
            if [ $? -eq 0 ]; then
                log_message "✅ Storage 備份已上傳到 S3"
            else
                log_message "⚠️ S3 上傳失敗，但本地備份保留"
            fi
        fi
    else
        log_message "⚠️ Storage 備份失敗（可能需要手動備份）"
        rm -rf "${TEMP_STORAGE_DIR}"
        return 1
    fi
}

# ============================================
# 備份 3：Schema 和權限
# ============================================

schema_backup() {
    log_message "開始 Schema 備份..."
    
    SCHEMA_FILE="${BACKUP_DIR}/database/aicountant_schema_${DATE}.sql"
    
    PGPASSWORD="${SUPABASE_DB_PASSWORD}" pg_dump \
        --host="db.${SUPABASE_PROJECT_REF}.supabase.co" \
        --port=5432 \
        --username="postgres" \
        --dbname="postgres" \
        --schema-only \
        --file="${SCHEMA_FILE}" 2>> "${LOG_FILE}"
    
    if [ $? -eq 0 ]; then
        gzip "${SCHEMA_FILE}"
        log_message "✅ Schema 備份成功"
    else
        log_message "⚠️ Schema 備份失敗"
    fi
}

# ============================================
# 清理舊備份
# ============================================

cleanup_old_backups() {
    log_message "清理舊備份..."
    
    # 清理本地舊備份
    find "${BACKUP_DIR}/database" -name "*.sql.gz" -mtime +${LOCAL_RETENTION_DAYS} -delete
    find "${BACKUP_DIR}/storage" -name "*.tar.gz" -mtime +${LOCAL_RETENTION_DAYS} -delete
    find "${BACKUP_DIR}/logs" -name "*.log" -mtime +${LOCAL_RETENTION_DAYS} -delete
    
    log_message "✅ 已清理 ${LOCAL_RETENTION_DAYS} 天前的本地備份"
    
    # 清理 S3 舊備份（如果配置了）
    if [ -n "${S3_BACKUP_BUCKET}" ]; then
        aws s3 ls "${S3_BACKUP_BUCKET}/database/" | \
            awk '{print $4}' | \
            xargs -I {} aws s3 rm "${S3_BACKUP_BUCKET}/database/{}" --recursive \
            --exclude "*" --include "*$(date -d "-${S3_RETENTION_DAYS} days" +%Y%m%d)*" >> "${LOG_FILE}" 2>&1
        
        log_message "✅ 已清理 ${S3_RETENTION_DAYS} 天前的 S3 備份"
    fi
}

# ============================================
# 發送通知
# ============================================

send_notification() {
    STATUS=$1
    MESSAGE=$2
    
    # 這裡可以添加郵件/Slack/微信通知
    # 示例：發送郵件
    # echo "${MESSAGE}" | mail -s "AIcountant Backup ${STATUS}" admin@yourcompany.com
    
    log_message "通知: ${STATUS} - ${MESSAGE}"
}

# ============================================
# 主程序
# ============================================

main() {
    log_message "========================================"
    log_message "AIcountant 自動備份腳本"
    log_message "========================================"
    
    # 檢查依賴
    if ! command -v pg_dump &> /dev/null; then
        log_message "❌ 錯誤：未找到 pg_dump，請安裝 PostgreSQL 客戶端"
        exit 1
    fi
    
    # 執行備份
    ERROR_COUNT=0
    
    database_backup || ((ERROR_COUNT++))
    schema_backup || ((ERROR_COUNT++))
    storage_backup || ((ERROR_COUNT++))
    cleanup_old_backups
    
    # 生成報告
    log_message "========================================"
    log_message "備份完成報告"
    log_message "========================================"
    log_message "總備份數: 3"
    log_message "失敗數: ${ERROR_COUNT}"
    log_message "備份位置: ${BACKUP_DIR}"
    
    # 計算總大小
    TOTAL_SIZE=$(du -sh "${BACKUP_DIR}" | cut -f1)
    log_message "總備份大小: ${TOTAL_SIZE}"
    
    # 發送通知
    if [ ${ERROR_COUNT} -eq 0 ]; then
        send_notification "成功" "所有備份已完成，總大小: ${TOTAL_SIZE}"
        log_message "✅ 備份全部成功！"
    else
        send_notification "警告" "部分備份失敗，請檢查日誌: ${LOG_FILE}"
        log_message "⚠️ 部分備份失敗，請檢查日誌"
    fi
    
    log_message "備份結束: $(date)"
    log_message "日誌文件: ${LOG_FILE}"
}

# 運行主程序
main
