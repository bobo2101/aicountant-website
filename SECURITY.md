# AIcountant 网站安全指南

## 🔐 已实施的安全措施

### 1. HTTPS 强制
- ✅ GitHub Pages 自动提供 HTTPS
- ✅ 建议开启 "Enforce HTTPS" 选项

### 2. 内容安全
- ✅ 无敏感信息硬编码
- ✅ 无 API 密钥暴露在代码中
- ✅ 表单使用前端验证

### 3. 依赖安全
- ✅ 纯 HTML/CSS/JS，无第三方依赖
- ✅ 无 npm 包风险

---

## 🛡️ 建议加强的安全措施

### 1. 启用 HTTPS 强制
在 GitHub 仓库设置中：
Settings → Pages → ✅ Enforce HTTPS

### 2. 添加安全响应头（可选）
如需更高安全性，可迁移到 Vercel/Netlify 添加安全头：
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options

### 3. 表单安全
当前表单是前端演示，正式使用时应：
- 添加验证码（reCAPTCHA）
- 后端验证和防刷机制
- 数据加密存储

### 4. 定期安全检查
- [ ] 每月检查 GitHub 安全警告
- [ ] 定期更新依赖（如有）
- [ ] 监控异常访问

---

## 📋 安全事件响应

如发现安全问题：
1. 立即撤销相关凭证
2. 检查访问日志
3. 更新所有密码
4. 通知相关人员

---

*最后更新: 2026-03-11*
