# Cloudflare 設置指南（簡易版）

## 🎯 Cloudflare 做咩？

```
用戶 → Cloudflare（保護+加速）→ Vercel（你的網站）
       🛡️ 防攻擊
       ⚡ 加速
       🔒 SSL
```

---

## ✅ 前置條件

你需要有一個**自訂域名**，例如：
- `aicountant.com`
- `ai-countant.com`
- `yourcompany.com`

⚠️ **如果暫時無域名**，可以跳過 Cloudflare，Vercel 已有基本保護。

---

## 🚀 五步完成設置

---

## Step 1: 註冊 Cloudflare

1. 去 https://dash.cloudflare.com/sign-up
2. 輸入**你的郵箱** + **密碼**
3. 點擊 **Create Account**
4. 驗證郵箱

---

## Step 2: 添加你的域名

1. 點擊 **Add a Site**
2. 輸入你的域名，例如：`aicountant.com`
3. 點擊 **Continue**
4. 選擇 **Free** 計劃（免費！）
5. 點擊 **Continue**

---

## Step 3: 檢查 DNS 記錄

Cloudflare 會掃描你現有嘅 DNS 記錄。

**你應該見到：**
- Type: CNAME
- Name: www
- Content: cname.vercel-dns.com

如果無，手動添加：
```
Type: CNAME
Name: www
Target: cname.vercel-dns.com
```

點擊 **Continue** → **Confirm**

---

## Step 4: 更改域名 DNS

**這步最重要！**

Cloudflare 會畀你兩個 Nameserver，例如：
```
 bob.ns.cloudflare.com
 lara.ns.cloudflare.com
```

**去你嘅域名註冊商（買域名嘅地方）**：

| 註冊商 | 設置位置 |
|--------|----------|
| GoDaddy | My Products → DNS → Nameservers |
| Namecheap | Domain List → Manage → Nameservers |
| 阿里雲 | 域名控制台 → DNS 修改 |
| 騰訊雲 | 域名管理 → 修改 DNS |

**改為 Custom DNS，輸入 Cloudflare 畀你嘅兩個 Nameserver**

點擊 **Save**

---

## Step 5: 等待生效

返回 Cloudflare，點擊 **Done, check nameservers**

⏳ **等待 5 分鐘 - 24 小時**（通常幾分鐘就得）

當見到 ✅ **Active** 即成功！

---

## ⚙️ 重要安全設置

### 1. SSL/TLS 加密
1. 去 Cloudflare Dashboard
2. 點擊 **SSL/TLS**（左側菜單）
3. 選擇 **Full (strict)**

### 2. 開啟安全功能
去 **Security** → **Settings**：
- Security Level: **High**
- Bot Fight Mode: **On**
- Challenge Passage: **30 minutes**

### 3. 速度優化
去 **Speed** → **Optimization**：
- Auto Minify: 勾選 **CSS** + **JS** + **HTML**
- Brotli: **On**
- Early Hints: **On**

---

## ✅ 完成檢查

- [ ] Cloudflare 賬戶已創建
- [ ] 域名已添加
- [ ] DNS 已改為 Cloudflare
- [ ] 顯示 Active ✅
- [ ] SSL/TLS 設為 Full (strict)
- [ ] Security Level 設為 High
- [ ] 能夠訪問你的域名

---

## 🌐 完成後的網址

```
https://www.aicountant.com  （或你的域名）
        ↓
   Cloudflare（保護+加速）
        ↓
   Vercel（你的網站）
```

---

## ❓ 常見問題

### Q: 要幾錢？
**A**: 免費！Free 計劃已足夠。

### Q: 要等幾耐先生效？
**A**: 通常 5-30 分鐘，最長 24 小時。

### Q: 點知成功未？
**A**: 
1. Cloudflare 顯示 Active ✅
2. 訪問你的域名能開到網站
3. 瀏覽器顯示 🔒 鎖頭

### Q: 改完 DNS 網站down咗？
**A**: 正常，等待 DNS 傳播完成就得。

---

## 🎉 完成後的保護

| 功能 | 狀態 |
|------|------|
| DDoS 防護 | ✅ 自動 |
| Bot 攔截 | ✅ 自動 |
| SSL 加密 | ✅ 自動 |
| 全球 CDN | ✅ 自動 |
| 防火牆 | ✅ 免費版有基本保護 |

---

**你有自訂域名未？** 有嘅話立即開始 Step 1！
