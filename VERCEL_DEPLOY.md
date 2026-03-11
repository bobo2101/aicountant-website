# Vercel 部署指南（簡易版）

## 🚀 三步完成部署

---

## Step 1: 推送代碼到 GitHub

### 1.1 創建新 GitHub Token
1. 去 https://github.com/settings/tokens
2. 點擊 **"Generate new token (classic)"**
3. 填寫：
   - **Note**: `Vercel Deploy`
   - **Expiration**: No expiration
   - 勾選 **repo**
4. 點擊 **Generate token**
5. **立即複製 token**（綠色框內，只顯示一次！）

### 1.2 推送代碼
在 Terminal 執行：

```bash
cd /Users/oliverng/Downloads/Kimi_Agent_在线服务平台搭建/website

# 設置 Git 用戶（只需做一次）
git config user.name "bobo2101"
git config user.email "你的郵箱@example.com"

# 使用新 token 推送（將 YOUR_TOKEN 換成你剛複製的 token）
git remote set-url origin https://bobo2101:YOUR_TOKEN@github.com/bobo2101/aicountant-website.git

# 推送
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

✅ 見到 `main -> main` 即成功！

---

## Step 2: 部署到 Vercel

### 2.1 註冊 Vercel
1. 去 https://vercel.com
2. 點擊 **Sign Up**
3. 選擇 **Continue with GitHub**
4. 授權 Vercel 訪問你的 GitHub

### 2.2 導入項目
1. 點擊 **Add New...** → **Project**
2. 找到 `aicountant-website` → 點擊 **Import**
3. 配置如下：
   - **Framework Preset**: `Other`
   - **Root Directory**: `./`（保持默認）
   - **Build Command**: 留空
   - **Output Directory**: 留空
4. 點擊 **Deploy**

⏳ 等待 1-2 分鐘...

### 2.3 查看結果
部署成功後會顯示 🎉 **Congratulations!**

你的網站地址：
```
https://aicountant-website.vercel.app
```

點擊 **Visit** 查看！

---

## Step 3: 改為 Private 倉庫 🔒

⚠️ **重要**：確認 Vercel 部署成功後先好做！

1. 去 https://github.com/bobo2101/aicountant-website
2. 點擊 **Settings**（頂部標籤）
3. 滾動到最底 **Danger Zone**
4. 點擊 **Change repository visibility**
5. 選擇 **Make private**
6. 輸入 `aicountant-website` 確認
7. 點擊 **I understand, make this repository private**

✅ 完成！代碼已保密，但 Vercel 仍可正常部署。

---

## 🎉 完成檢查

- [ ] 代碼已推送到 GitHub
- [ ] Vercel 部署成功
- [ ] 能夠訪問 https://aicountant-website.vercel.app
- [ ] GitHub 倉庫已改為 Private

---

## 🔄 以後更新網站

當你修改文件後：

```bash
cd /Users/oliverng/Downloads/Kimi_Agent_在线服务平台搭建/website

# 修改文件後
git add .
git commit -m "更新描述"
git push origin main

# Vercel 會自動重新部署！
```

等待 30 秒，網站自動更新。

---

## ❓ 常見問題

### Q: 推送時話 "Invalid username or token"？
**A**: Token 有問題，重新去 GitHub 創建一個新的。

### Q: Vercel 部署失敗？
**A**: 
1. 檢查 Framework Preset 是否選了 `Other`
2. 確認 Root Directory 是 `./`
3. 查看 Deploy Log 錯誤信息

### Q: 改為 Private 後 Vercel 仲work？
**A**: 會！Vercel 已授權，Private 倉庫都可正常部署。

---

**有問題隨時問我！** 🚀
