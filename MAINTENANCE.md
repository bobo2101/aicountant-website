# AIcountant 網站維護指南

## 🎉 當前部署狀態

| 項目 | 狀態 | 供應商 |
|------|------|--------|
| 網站 Hosting | ✅ 運行中 | Vercel |
| 代碼倉庫 | ✅ Private | GitHub |
| HTTPS/SSL | ✅ 自動 | Vercel |
| 安全響應頭 | ✅ 已配置 | Vercel |
| 全球 CDN | ✅ 自動 | Vercel |
| 自定義域名 | ⭕ 暫無 | - |
| DDoS 防護 | ⭕ 基礎 | Vercel |

**網站地址**: https://aicountant-website.vercel.app

---

## 🔄 日常維護

### 更新網站內容

```bash
# 1. 進入項目目錄
cd /Users/oliverng/Downloads/Kimi_Agent_在线服务平台搭建/website

# 2. 修改文件（如 index.html, css/style.css 等）

# 3. 提交更改
git add .
git commit -m "更新描述：例如修改價格"

# 4. 推送到 GitHub
git push origin main

# 5. Vercel 會自動重新部署（約 30 秒）
```

### 檢查部署狀態

1. 去 https://vercel.com/dashboard
2. 點擊 `aicountant-website`
3. 查看 **Deployments** 標籤

---

## 📊 監控網站

### Vercel Analytics（免費）

1. 去 Vercel Dashboard
2. 點擊你的項目
3. 點擊 **Analytics** 標籤
4. 開啟 **Enable Analytics**

可以看到：
- 訪問量
- 頁面瀏覽數
- 用戶地理位置
- 設備類型

---

## ⚠️ 重要提醒

### GitHub Token 到期
如果你設置了 Token 到期日：
- 到期前會收到郵件提醒
- 需要去 https://github.com/settings/tokens 創建新 Token
- 更新本地 Git 配置

### Vercel 免費額度

| 項目 | 免費額度 | 你的網站預計用量 |
|------|---------|----------------|
| 帶寬 | 100GB/月 | 企業官網通常 < 1GB/月 ✅ |
| 構建時間 | 6000 分鐘/月 | 每次構建約 1 分鐘 ✅ |
| 團隊成員 | 1 人 | 你一個人足夠 ✅ |

**結論**：免費額度完全足夠！

---

## 🚀 未來升級（可選）

### 當你需要時：

#### 1. 添加自定義域名
- 去域名註冊商買域名
- 在 Vercel → Domains 添加
- 按指引設置 DNS

#### 2. 添加 Cloudflare
- 有自定義域名後
- 按 `CLOUDFLARE_SETUP.md` 設置
- 獲得更強安全防護

#### 3. 添加聯繫表單後端
- 目前表單係前端演示
- 可連接：
  - EmailJS（免費發郵件）
  - Google Forms
  - 自建後端 API

---

## 🆘 故障排除

### 網站打唔開？

1. **檢查 Vercel 狀態**
   - 去 https://status.vercel.com
   - 確認無系統故障

2. **檢查部署狀態**
   - Vercel Dashboard → Deployments
   - 睇下有無紅色錯誤

3. **檢查 GitHub 倉庫**
   - 確認代碼正確推送
   - 確認倉庫仍是 Private

### 更新後無變化？

1. 清除瀏覽器緩存（Ctrl/Cmd + Shift + R）
2. 檢查 Vercel Dashboard 部署狀態
3. 等待 1-2 分鐘再試

---

## 📞 支持資源

| 問題類型 | 去邊度搵幫助 |
|---------|------------|
| Vercel 問題 | https://vercel.com/support |
| GitHub 問題 | https://support.github.com |
| 代碼問題 | 問我！ |

---

## ✅ 定期檢查清單（每月一次）

- [ ] 訪問網站確認正常運行
- [ ] 檢查 Vercel Analytics 數據
- [ ] 檢查有無安全警告
- [ ] 確認 GitHub Token 未過期
- [ ] 備份重要更改（Git 自動處理）

---

**最後更新**: 2026-03-11

**網站狀態**: ✅ 正常運行
