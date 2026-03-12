#!/bin/bash

# AIcountant 快速備份腳本
# 使用方法：
# 1. 修改下面的配置
# 2. 運行：./quick-backup.sh

# ============================================
# ⚠️ 修改這些配置！
# ============================================

PROJECT_REF="your-project-ref-here"  # 從 Supabase URL 獲取
DB_PASSWORD="your-db-password-here"   # 數據庫密碼

# ============================================
# 以下通常不需要修改
# ============================================

BACKUP_DIR="$HOME/backups/aicountant/$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"

echo "🔄 開始備份 AIcountant 數據..."
echo "📁 備份位置: $BACKUP_DIR"
echo ""

# 檢查 pg_dump 是否存在
if ! command -v pg_dump &> /dev/null; then
    echo "❌ 錯誤：未找到 pg_dump"
    echo "請安裝 PostgreSQL 客戶端:"
    echo "  Mac: brew install postgresql"
    echo "  Ubuntu: sudo apt-get install postgresql-client"
    exit 1
fi

# 備份數據庫
echo "📦 正在備份數據庫..."
PGPASSWORD="$DB_PASSWORD" pg_dump \
    --host="db.$PROJECT_REF.supabase.co" \
    --port=5432 \
    --username="postgres" \
    --dbname="postgres" \
    --format=custom \
    --file="$BACKUP_DIR/database_backup.sql"

if [ $? -eq 0 ]; then
    # 壓縮
    gzip "$BACKUP_DIR/database_backup.sql"
    
    # 顯示結果
    BACKUP_SIZE=$(du -h "$BACKUP_DIR/database_backup.sql.gz" | cut -f1)
    echo "✅ 備份成功！"
    echo "📊 文件大小: $BACKUP_SIZE"
    echo "📍 文件位置: $BACKUP_DIR/database_backup.sql.gz"
    echo ""
    echo "💡 恢復命令："
    echo "  gunzip $BACKUP_DIR/database_backup.sql.gz"
    echo "  psql -h db.$PROJECT_REF.supabase.co -U postgres -d postgres -f $BACKUP_DIR/database_backup.sql"
else
    echo "❌ 備份失敗，請檢查："
    echo "  1. PROJECT_REF 是否正確"
    echo "  2. DB_PASSWORD 是否正確"
    echo "  3. 網絡連接是否正常"
fi
