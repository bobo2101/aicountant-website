# SSH Key 設置指南（一勞永逸）

## 🎯 什麼係 SSH Key？

SSH Key 係一對加密鑰匙（公鑰 + 私鑰）：
- **私鑰** = 你部電腦嘅「身份證」（保密）
- **公鑰** = 交畀 GitHub「驗證身份」

設置好後，推送代碼**唔使再輸入密碼/token**！

---

## 🚀 設置步驟

### Step 1: 檢查是否已有 SSH Key

```bash
# 喺 Terminal 執行
ls -la ~/.ssh/

# 如果見到以下文件，代表已有 SSH Key：
# id_rsa      (舊版)
# id_ed25519  (新版，推薦)
```

**如果有**，跳去 Step 3
**如果無**，繼續 Step 2

---

### Step 2: 生成新 SSH Key

```bash
# 喺 Terminal 執行
ssh-keygen -t ed25519 -C "你的郵箱@example.com"

# 例如：
ssh-keygen -t ed25519 -C "bobo2101@email.com"
```

**會問你幾個問題：**

```
Enter file in which to save the key (/Users/你的名字/.ssh/id_ed25519):
→ 直接撳 Enter（用默認位置）

Enter passphrase (empty for no passphrase):
→ 建議撳 Enter（唔設密碼，方便推送）

Enter same passphrase again:
→ 再撳 Enter
```

**完成後會顯示：**
```
Your identification has been saved in /Users/你的名字/.ssh/id_ed25519
Your public key has been saved in /Users/你的名字/.ssh/id_ed25519.pub
```

---

### Step 3: 複製公鑰

```bash
# 執行以下命令複製公鑰內容
cat ~/.ssh/id_ed25519.pub

# 會輸出類似：
# ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDIhz2GK/XCUj4i6Q5yQJNL1MXMY0RxzPV2QrBqfHrD bobo2101@email.com
```

**複製呢段文字**（由 ssh-ed25519 開始到郵箱結尾）

---

### Step 4: 添加到 GitHub

1. 去 https://github.com/settings/keys
2. 點擊 **"New SSH key"**
3. 填寫：
   - **Title**: My MacBook（或任何名稱）
   - **Key**: 貼上剛才複製嘅公鑰
4. 點擊 **"Add SSH key"**
5. 可能需要輸入 GitHub 密碼確認

---

### Step 5: 測試連接

```bash
# 喺 Terminal 執行
ssh -T git@github.com

# 第一次會問：
# Are you sure you want to continue connecting (yes/no/[fingerprint])?
# → 輸入 yes 撳 Enter

# 成功會顯示：
# Hi bobo2101! You've successfully authenticated, but GitHub does not provide shell access.
```

**見到 "Hi bobo2101!" 代表成功！**

---

### Step 6: 修改項目使用 SSH

```bash
# 進入項目目錄
cd /Users/oliverng/Downloads/Kimi_Agent_在线服务平台搭建/website

# 查看當前 remote URL
git remote -v

# 應該顯示：
# origin  https://github.com/bobo2101/aicountant-website.git (fetch)
# origin  https://github.com/bobo2101/aicountant-website.git (push)

# 改為 SSH
git remote set-url origin git@github.com:bobo2101/aicountant-website.git

# 確認更改
git remote -v

# 應該變為：
# origin  git@github.com:bobo2101/aicountant-website.git (fetch)
# origin  git@github.com:bobo2101/aicountant-website.git (push)
```

---

### Step 7: 推送代碼！

```bash
# 推送
git push origin main

# 第一次可能需要確認，之後就暢通無阻！
```

**🎉 以後淨係 `git push origin main` 就得，唔使再理 token！**

---

## ✅ 完成檢查清單

- [ ] Step 1: 檢查有無現有 SSH Key
- [ ] Step 2: 生成新 SSH Key（如有需要）
- [ ] Step 3: 複製公鑰
- [ ] Step 4: 添加到 GitHub
- [ ] Step 5: 測試連接成功（見到 "Hi bobo2101!"）
- [ ] Step 6: 修改項目 remote URL
- [ ] Step 7: 成功推送代碼

---

## 🆘 常見問題

### Q: Permission denied (publickey)?
**A**: 
1. 確保公鑰已正確添加到 GitHub
2. 執行 `eval "$(ssh-agent -s)"` 啟動 SSH agent
3. 執行 `ssh-add ~/.ssh/id_ed25519` 添加私鑰

### Q: 想喺多部電腦使用？
**A**: 
- 方法 1：每部電腦生成獨立 SSH Key，全部添加到 GitHub
- 方法 2：複製私鑰去另一部電腦（較複雜，不建議）

### Q: 如何刪除舊 SSH Key？
**A**: 
```bash
# 列出所有 key
ls ~/.ssh/

# 刪除指定 key
rm ~/.ssh/id_ed25519
rm ~/.ssh/id_ed25519.pub
```

---

## 💡 小貼士

1. **備份私鑰**：將 `~/.ssh/id_ed25519` 備份到安全地方（USB/密碼管理器）
2. **多部電腦**：每部電腦可以獨立生成 SSH Key
3. **安全移除**：換電腦時，記得喺 GitHub 刪除舊 SSH Key

---

**設置完成後，以後推送就暢通無阻啦！** 🚀
