# AIcountant 网站安全设置清单

## ✅ 已完成的安全措施

### 1. 代码安全
- [x] 敏感信息扫描完成
- [x] 无 API 密钥硬编码
- [x] 无第三方依赖风险
- [x] 安全文档已创建

### 2. Vercel 安全配置
- [x] 安全响应头已配置 (vercel.json)
- [x] Content-Security-Policy
- [x] XSS/Clickjacking 防护

---

## 📝 待完成的安全设置

### ☐ 1. 启用 Enforce HTTPS (GitHub Pages)
**操作步骤：**
1. 访问 https://github.com/bobo2101/aicountant-website/settings/pages
2. 勾选 **"Enforce HTTPS"**
3. 点击 Save

**作用：**
- 强制所有访问使用 HTTPS
- 防止中间人攻击
- 提升 SEO 排名

---

### ☐ 2. 添加 Cloudflare (推荐)
**操作步骤：**

#### Step 1: 注册 Cloudflare
1. 访问 https://dash.cloudflare.com/sign-up
2. 使用邮箱注册
3. 验证邮箱

#### Step 2: 添加站点
1. 点击 **"Add a Site"**
2. 输入你的域名：
   - 如果使用 Vercel: `aicountant-website.vercel.app` (不需要)
   - 如果使用自定义域名: 输入你的域名如 `aicountant.com`
3. 选择 **Free** 计划
4. 点击 **Continue**

#### Step 3: 配置 DNS
Cloudflare 会扫描现有 DNS 记录，确认无误后：
1. 点击 **Continue** → **Confirm**
2. 复制 Cloudflare 提供的 Nameservers

#### Step 4: 修改域名 DNS
在你的域名注册商处：
1. 找到 DNS/Nameserver 设置
2. 替换为 Cloudflare 提供的 Nameservers
3. 保存，等待生效（通常几分钟到几小时）

#### Step 5: 启用安全功能
在 Cloudflare Dashboard 中：
1. **SSL/TLS** → 选择 **Full (strict)**
2. **Security** → **Security Level**: High
3. **Security** → **Bot Fight Mode**: On
4. **Speed** → **Auto Minify**: 勾选 CSS/JS/HTML

**作用：**
- DDoS 防护
- 全球 CDN 加速
- Web 应用防火墙 (WAF)
- Bot 防护
- 分析统计

---

### ☐ 3. 设置备份提醒
**自动化备份方案：**

#### 方案 A: Git 自动备份 (推荐)
```bash
# 添加以下到你的 crontab (Mac/Linux)
# 每天凌晨 3 点自动推送
0 3 * * * cd /Users/oliverng/Downloads/Kimi_Agent_在线服务平台搭建/website && git add . && git commit -m "Daily backup $(date +%Y-%m-%d)" && git push origin main
```

#### 方案 B: GitHub Actions 自动备份
创建 `.github/workflows/backup.yml`:
```yaml
name: Daily Backup
on:
  schedule:
    - cron: '0 3 * * *'  # 每天凌晨 3 点
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Create Backup
        run: |
          git config user.name "Backup Bot"
          git config user.email "backup@aicountant.com"
          git add .
          git diff --staged --quiet || git commit -m "Daily backup $(date +%Y-%m-%d)"
          git push
```

#### 方案 C: 手动备份提醒
设置日历提醒：
- 每周一提醒检查代码备份
- 每月 1 号提醒检查部署状态

---

### ☐ 4. 创建新的安全 Token
**操作步骤：**

#### Step 1: 创建新 Token
1. 访问 https://github.com/settings/tokens
2. 点击 **"Generate new token (classic)"**
3. 配置：
   - **Note**: `AIcountant Website Deploy`
   - **Expiration**: 90 days (或更长)
   - **Scopes**: 勾选 **repo** (完整仓库访问)
4. 点击 **Generate token**
5. **立即复制 token** (只显示一次！)

#### Step 2: 更新本地 Git 配置
```bash
cd /Users/oliverng/Downloads/Kimi_Agent_在线服务平台搭建/website

# 更新远程 URL 使用新 token
git remote set-url origin https://bobo2101:ghp_你的新token@github.com/bobo2101/aicountant-website.git

# 验证
git remote -v
```

#### Step 3: 安全存储 Token
- 使用密码管理器保存 (如 1Password, Bitwarden)
- 或使用 macOS Keychain:
```bash
security add-generic-password -s "github-token" -a "bobo2101" -w "ghp_你的token"
```

---

## 🔐 安全最佳实践

### 定期安全检查 (建议每月)
- [ ] 检查 GitHub 安全警告
- [ ] 审查最近的提交记录
- [ ] 检查 Vercel/Cloudflare 日志
- [ ] 更新过期 token
- [ ] 测试网站备份恢复

### 密码管理
- 使用密码管理器生成强密码
- 启用 GitHub 2FA 双因素认证
- 定期更换敏感凭证

---

## 📊 安全状态总览

| 安全项目 | 状态 | 优先级 |
|---------|------|--------|
| HTTPS 加密 | ⏳ 待启用 | 高 |
| 代码保密 (Private) | ⏳ 待迁移 | 高 |
| 安全响应头 | ✅ 已配置 | 中 |
| DDoS 防护 | ⏳ 待添加 Cloudflare | 中 |
| 自动备份 | ⏳ 待配置 | 中 |
| Token 管理 | ⏳ 待创建 | 高 |

---

## 🆘 紧急情况处理

### Token 泄露
1. 立即撤销旧 token
2. 检查最近的仓库访问记录
3. 创建新 token
4. 更新所有使用旧 token 的地方

### 网站被攻击
1. 在 Cloudflare 开启 "Under Attack" 模式
2. 检查访问日志
3. 更新所有密码
4. 联系 Vercel 支持

---

*最后更新: 2026-03-11*
