# Git 版本管理指南

## 🎯 為什麼需要版本管理？

```
情景 1: 改錯代碼，想回到之前嘅版本
情景 2: 想測試新功能，但唔想影響主網站
情景 3: 多人協作，各自開發不同功能
情景 4: 追蹤每次修改，知道邊個改咗咩
```

---

## 📋 基礎概念

```
main (主分支) ── 穩定版本，用戶睇到嘅網站
    │
    ├── feature-payment (功能分支) ── 開發支付功能
    │
    ├── feature-blog (功能分支) ── 開發博客功能
    │
    └── hotfix-bug (修復分支) ── 緊急修復
```

---

## 🚀 常用操作

### 1. 查看歷史記錄

```bash
# 簡潔查看
git log --oneline

# 詳細查看
git log

# 圖形化查看
git log --oneline --graph --all
```

### 2. 創建新分支（開發新功能）

```bash
# 創建並切換到新分支
git checkout -b feature-resources

# 只創建不切換
git branch feature-payment

# 查看所有分支
git branch
```

### 3. 在不同版本間切換

```bash
# 切換到主分支
git checkout main

# 切換到某個歷史版本（通過 commit hash）
git checkout a1b2c3d

# 回到最新版本
git checkout main
```

### 4. 標記重要版本（Tag）

```bash
# 創建版本標籤
git tag -a v1.0 -m "正式上線版本"

# 創建測試版本標籤
git tag -a v1.1-beta -m "支付功能測試"

# 查看所有標籤
git tag

# 推送標籤到 GitHub
git push origin v1.0
```

---

## 💾 實用備份策略

### 策略 1: 每日自動備份

```bash
# 創建備份腳本 save-backup.sh
#!/bin/bash
cd /Users/oliverng/Downloads/Kimi_Agent_在线服务平台搭建/website
git add .
git commit -m "Backup $(date +%Y-%m-%d-%H:%M)"
git push origin main
```

### 策略 2: 功能完成後打標籤

```bash
# 完成公司註冊優化
git add .
git commit -m "優化公司註冊頁面"
git tag -a v1.1-company -m "公司註冊功能優化完成"
git push origin main
git push origin v1.1-company
```

### 策略 3: 多分支管理

```bash
# 主分支（穩定版本）
main: 用戶睇到嘅網站

# 開發分支
feature-payment: 支付功能開發中
develop: 整合測試版本

# 修復分支
hotfix-2024-03-11: 緊急修復某個 bug
```

---

## 🔄 完整工作流程

### 場景：開發新功能（Resources 專區）

```bash
# Step 1: 確保喺主分支且係最新
git checkout main
git pull origin main

# Step 2: 創建功能分支
git checkout -b feature-resources

# Step 3: 開發新功能（修改代碼）
# ... 修改文件 ...

# Step 4: 提交更改
git add .
git commit -m "Add resources section with Q&A and blog templates"

# Step 5: 測試無誤後，合併回主分支
git checkout main
git merge feature-resources

# Step 6: 推送上線
git push origin main

# Step 7: 打標籤
git tag -a v1.2-resources -m "Add resources section"
git push origin v1.2-resources

# Step 8: 刪除功能分支（可選）
git branch -d feature-resources
```

---

## 🆘 緊急恢復

### 情景：改錯代碼，想回到上一個版本

```bash
# 查看最近修改
git log --oneline -5

# 回退到上一個版本（保留修改）
git reset --soft HEAD~1

# 回退到上一個版本（刪除修改）
git reset --hard HEAD~1

# 回退到指定版本
git reset --hard a1b2c3d
```

### 情景：想看某個舊版本嘅代碼

```bash
# 暫時切換到舊版本
git checkout v1.0

# 看完後切回最新
git checkout main
```

---

## 🌿 推薦分支策略（Git Flow 簡化版）

```
main (主分支)
├── 只放穩定、已上線嘅代碼
├── 每次提交都會自動部署
└── 受保護（不能直接推送，需通過 PR）

develop (開發分支)
├── 整合各種新功能
├── 測試環境部署
└── 功能完成後合併到 main

feature/* (功能分支)
├── feature-resources
├── feature-payment
├── feature-blog
└── 從 develop 創建，完成後合併回 develop

hotfix/* (緊急修復)
├── 從 main 創建
├── 修復緊急問題
└── 同時合併到 main 和 develop
```

---

## 📊 可視化工具

### 命令行工具
```bash
# 安裝 gitk（Mac）
brew install git-gui

# 打開圖形界面
gitk

# 或使用 tig
brew install tig
tig
```

### 圖形界面工具
- **SourceTree** (免費，推薦)
- **GitKraken** (免費版)
- **GitHub Desktop** (簡單易用)

---

## ✅ 檢查清單

### 每日工作
- [ ] `git pull` 拉取最新代碼
- [ ] `git checkout -b feature-xxx` 創建功能分支
- [ ] 開發完成後 `git commit`
- [ ] `git push` 推送

### 每周備份
- [ ] 檢查所有修改已提交
- [ ] 打版本標籤（如有重要更新）
- [ ] 檢查 GitHub 倉庫同步

### 每月維護
- [ ] 清理已完成的功能分支
- [ ] 檢查舊版本，決定是否保留
- [ ] 更新文檔

---

## 🎯 快速參考卡

| 操作 | 命令 |
|------|------|
| 查看狀態 | `git status` |
| 查看歷史 | `git log --oneline` |
| 創建分支 | `git checkout -b 分支名` |
| 切換分支 | `git checkout 分支名` |
| 合併分支 | `git merge 分支名` |
| 打標籤 | `git tag -a v1.0 -m "描述"` |
| 回退版本 | `git reset --hard HEAD~1` |
| 查看差異 | `git diff` |

---

*有問題隨時問我！* 🔧
