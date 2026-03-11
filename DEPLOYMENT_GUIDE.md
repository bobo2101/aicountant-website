# 部署指南：迁移到 Vercel + Private 仓库

## 📋 迁移流程概览

```
GitHub Pages (Public)
    ↓
GitHub 仓库保持 Public
    ↓
导入到 Vercel 部署
    ↓
仓库改为 Private
    ↓
Vercel + Private 完成 ✅
```

---

## 🚀 Step 1: 推送更新到 GitHub

### 1.1 添加 Vercel 配置文件

```bash
cd website
git add vercel.json DEPLOYMENT_GUIDE.md
git commit -m "Add Vercel config with security headers"
git push origin main
```

---

## 🚀 Step 2: 创建 Vercel 账户

### 2.1 注册/登录
1. 访问 https://vercel.com
2. 点击 **Sign Up**
3. 选择 **Continue with GitHub**
4. 授权 Vercel 访问你的 GitHub 账户

---

## 🚀 Step 3: 导入项目到 Vercel

### 3.1 添加新项目
1. 点击 **Add New...** → **Project**
2. 在 "Import Git Repository" 中找到 `aicountant-website`
3. 点击 **Import**

### 3.2 配置部署
1. **Framework Preset**: 选择 `Other`
2. **Root Directory**: 保持 `./` (默认值)
3. **Build Command**: 留空
4. **Output Directory**: 留空
5. 点击 **Deploy**

等待 1-2 分钟，部署完成后会显示成功信息。

---

## 🚀 Step 4: 获取 Vercel 域名

部署成功后，Vercel 会提供一个域名：
```
https://aicountant-website.vercel.app
```

你可以选择：
- 使用默认的 `.vercel.app` 域名
- 绑定自定义域名（见下方）

---

## 🚀 Step 5: 将仓库改为 Private

⚠️ **重要**：先确保 Vercel 部署成功后再执行此步骤！

### 5.1 在 GitHub 上操作
1. 访问 https://github.com/bobo2101/aicountant-website
2. 点击 **Settings**
3. 滚动到最下方 **Danger Zone**
4. 点击 **Change repository visibility**
5. 选择 **Make private**
6. 输入仓库名称确认
7. 点击 **I understand, make this repository private**

### 5.2 验证 Vercel 连接
改为 Private 后，Vercel 仍然可以访问（因为已经授权）。

访问 Vercel Dashboard 确认项目状态：
https://vercel.com/dashboard

---

## 🚀 Step 6: 配置自定义域名（可选）

### 6.1 在 Vercel 中添加域名
1. 进入项目 → **Settings** → **Domains**
2. 输入你的域名，如 `aicountant.com`
3. 点击 **Add**

### 6.2 配置 DNS
根据 Vercel 提供的记录，在你的域名注册商处添加：

**A 记录**:
```
@ → 76.76.21.21
```

**CNAME 记录**:
```
www → cname.vercel-dns.com
```

等待 DNS 生效（通常几分钟到几小时）。

---

## 🔒 安全增强功能

迁移到 Vercel 后，你的网站已获得以下安全保护：

### 自动 HTTPS
- 自动 SSL 证书
- 自动续期
- HTTP/2 支持

### 安全响应头（已配置）
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: ...
Strict-Transport-Security: max-age=63072000
```

### DDoS 防护
- 自动 DDoS 缓解
- 全球边缘网络
- 智能缓存

---

## 📝 后续更新流程

更新网站内容时：

```bash
cd website

# 编辑文件
vim index.html

# 提交并推送
git add .
git commit -m "更新内容描述"
git push origin main

# Vercel 会自动重新部署！
```

---

## 🆘 常见问题

### Q1: 改为 Private 后 Vercel 还能访问吗？
**A**: 可以。Vercel 使用已授权的 GitHub App，Private 仓库也能正常部署。

### Q2: 免费账户有限制吗？
**A**: 
- 带宽：每月 100GB
- 构建次数：每月 6000 分钟
- 对于企业官网完全够用

### Q3: 如何回滚到 GitHub Pages？
**A**: 
1. 将仓库改回 Public
2. 在 GitHub Settings → Pages 重新启用

---

## ✅ 完成检查清单

- [ ] 推送 Vercel 配置到 GitHub
- [ ] 在 Vercel 创建账户
- [ ] 导入项目并成功部署
- [ ] 测试新域名访问
- [ ] 将 GitHub 仓库改为 Private
- [ ] 验证网站正常访问
- [ ] （可选）绑定自定义域名

---

**完成后你的网站将获得：**
- ✅ Private 仓库（代码保密）
- ✅ 全球 CDN 加速
- ✅ 自动 HTTPS
- ✅ 安全响应头
- ✅ DDoS 防护

*最后更新: 2026-03-11*
