# AIcountant 项目跟进清单

## 🔒 安全改进项目

### 1. Storage Bucket 安全增强
**优先级**: 中  
**状态**: 待规划  
**决策**: 当前保持 Public bucket，未来考虑升级为 Private + Signed URL

#### 背景
- 当前使用 Public bucket，文件 URL 永久有效
- 攻击者如果知道完整 URL 可以直接访问（无需登录）
- 当前有 RLS 保护，用户只能访问自己的文件

#### 改进方案
改为 **Private bucket + Signed URL** 模式：

```javascript
// 当前代码（Public bucket）
const { data: { publicUrl } } = supabaseClient
    .storage
    .from('documents')
    .getPublicUrl(filePath);

// 改进后代码（Private bucket + Signed URL）
const { data, error } = await supabaseClient
    .storage
    .from('documents')
    .createSignedUrl(filePath, 3600); // URL 有效期 1 小时

const publicUrl = data.signedUrl;
```

#### 实施步骤
- [ ] 1. 修改 `portal/documents.html` 中的 URL 生成逻辑
- [ ] 2. 修改 `portal/invoices.html` 中的文件预览逻辑（如果有）
- [ ] 3. 取消勾选 `documents` bucket 的 "Public bucket" 选项
- [ ] 4. 更新 RLS policies（确保 authenticated 用户有 select 权限）
- [ ] 5. 测试文件上传、预览、下载功能

#### 风险评估
| 当前状态 | 风险等级 | 说明 |
|---------|---------|------|
| Public bucket + RLS | 🟡 中低风险 | 内部系统，路径包含用户ID，难以猜测 |
| Private + Signed URL | 🟢 低风险 | URL 有过期时间，更安全 |

#### 触发条件
在以下情况时优先实施：
- 系统开始处理敏感文件（身份证、护照、机密合同）
- 通过安全审计要求
- 用户量增加，需要更高安全级别

---

## 🐛 已知问题

### 已解决 ✅

| 问题 | 解决日期 | 说明 |
|------|---------|------|
| original_file_size 字段错误 | 2026-03-11 | 移除了代码中对该字段的引用 |
| Bucket not found 错误 | 2026-03-11 | bucket 存在但权限问题，已确认为 Public bucket 设置 |

---

## 🚀 功能优化

### 待评估
- [ ] OCR 结果手动编辑功能
- [ ] 批量上传文件
- [ ] 文件分类自动识别改进
- [ ] 压缩率显示（之前移除的功能）

---

## 🌐 国际化 (i18n)

### 2. Portal 多语言支持
**优先级**: 高  
**状态**: 待规划  
**需求**: 支持 3 种语言

#### 目标语言
| 语言 | 代码 | 优先级 |
|------|------|--------|
| English | `en` | P1 |
| 繁體中文 (Traditional Chinese) | `zh-HK` / `zh-TW` | P1 |
| 简体中文 (Simplified Chinese) | `zh-CN` | P1 |

#### 需要翻译的页面
- [ ] `portal/login.html` - 登录页
- [ ] `portal/dashboard.html` - 仪表板
- [ ] `portal/documents.html` - 文件管理
- [ ] `portal/transactions.html` - 交易记录
- [ ] `portal/invoices.html` - 发票管理
- [ ] `portal/settings.html` - 设置

#### 实现方案选项

**选项 A: 前端 i18n 库（推荐）**
```javascript
// 使用 i18next 或类似库
const translations = {
  'en': { 'upload_file': 'Upload File', ... },
  'zh-HK': { 'upload_file': '上傳文件', ... },
  'zh-CN': { 'upload_file': '上传文件', ... }
};
```

**选项 B: 多版本 HTML 文件**
- `documents.html` (默认繁体)
- `documents-en.html` (英文)
- `documents-cn.html` (简体)

#### 语言切换 UI
- 在 Portal 顶部导航添加语言选择器
- 保存用户语言偏好到 localStorage
- 默认根据浏览器语言自动检测

#### 实施步骤
1. 提取所有需要翻译的文本
2. 创建翻译文件/对象
3. 实现语言切换组件
4. 测试所有页面的翻译
5. 更新用户文档

---

## 📝 记录维护
- 创建日期：2026-03-11
- 最后更新：2026-03-11
- 维护人：开发团队
