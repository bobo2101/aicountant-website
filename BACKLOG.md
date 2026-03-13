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
| OCR 基础功能 | 2026-03-12 | DeepSeek API 集成完成，可识别并显示结果 |

### 待优化 🔄

| 问题 | 优先级 | 说明 |
|------|--------|------|
| OCR 准确度提升 | 中 | 当前识别率约 40-60%，需优化 |

---

## 🎯 OCR 准确度优化计划

### 当前状态
- ✅ API 调用正常
- ✅ 结果显示正常
- ⚠️ 识别准确率约 40-60%

### 优化方案选项

**方案 A: 调整提示词和参数**
- 优化 system prompt，更详细描述字段位置
- 调整 temperature 和 max_tokens
- 尝试不同的消息格式

**方案 B: 图片预处理**
- 增加图片对比度/亮度
- 旋转校正
- 去除噪点

**方案 C: 更换 OCR 服务商**
- Google Vision API（准确率更高，但成本高 10x）
- Azure Form Recognizer
- AWS Textract

**方案 D: 混合策略**
- 先用 DeepSeek（便宜）
- 低 confidence 时 fallback 到 Google Vision

### 建议
目前系统可用，建议：
1. 先用现有版本收集用户反馈
2. 根据实际使用场景决定是否升级 OCR
3. 如需高准确度，建议切换到 Google Vision API

**⚠️ 当前状态：已暂停 OCR 优化，优先进行设计和内容改进**

---

## 🎨 设计与内容改进计划

### 4. 网站设计升级
**优先级**: 高  
**状态**: 进行中  
**最后更新**: 2026-03-13

#### 目标
- 现代化视觉设计
- 更清晰的业务定位（香港公司注册服务）
- 提升转化率

#### 改进页面清单

| 页面 | 优先级 | 改进内容 |
|------|--------|----------|
| **首页 (index.html)** | P0 | 全新 Hero 区域、更宽布局(1400px)、清晰 CTA |
| **Services 页面** | P1 | 详细服务介绍、定价展示 |
| **About 页面** | P2 | 团队介绍、资质证书 |
| **Contact 页面** | P1 | 联系表单、地图、多渠道联系方式 |
| **Portal 登录页** | P2 | 更专业的登录界面 |

#### 设计改进方向
- [x] 现代化配色方案 (已完成 - 浅蓝色主题)
- [x] 更好的排版和字体 (已完成)
- [x] 响应式优化（移动端）(已完成)
- [ ] 加载速度优化
- [ ] SEO 优化

#### 内容改进清单（跟进项目）

| 项目 | 优先级 | 状态 | 说明 |
|------|--------|------|------|
| **真实价格表** | P1 | 待更新 | 替换当前占位符价格，添加详细服务套餐 |
| **客户评价** | P1 | 待收集 | 添加真实客户案例和评价，增强信任度 |
| **团队照片** | P2 | 待拍摄 | 添加香港办公室环境和团队照片 |
| **FAQ 页面** | P2 | 待创建 | 常见问题解答，减少咨询负担 |
| **博客/资源** | P3 | 待规划 | SEO 内容，提升搜索排名 |

#### 多语言支持
- [x] 简体中文 (已完成)
- [x] 繁體中文 (已完成)
- [x] English (已完成)
- [ ] 语言自动检测
- [ ] 用户语言偏好记忆

---

## 🐛 已知问题（续）

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

## 🚀 部署与版本控制

### 3. GitHub 版本控制与 Vercel 部署
**优先级**: 高  
**状态**: 代码已推送，待部署  
**最后更新**: 2026-03-12

#### 已完成 ✅
- [x] 清理临时文件 (ocr-process-dev, ocr-simple, test files)
- [x] 提交 OCR 修复到 GitHub (commit: 076acfa)
- [x] 代码推送到 origin/main

#### 待完成 📋
- [ ] Vercel 项目配置
  - [ ] 登录 vercel.com/dashboard
  - [ ] 导入 GitHub 仓库 `bobo2101/aicountant-website`
  - [ ] 或重新连接现有项目
- [ ] 部署配置
  - [ ] Framework: Other
  - [ ] Build Command: (empty)
  - [ ] Output Directory: (empty)
- [ ] 环境变量配置（如有需要）
- [ ] 生产环境测试
  - [ ] 访问 https://aicountant-website.vercel.app
  - [ ] 测试登录功能
  - [ ] 测试文件上传
  - [ ] 测试 OCR 功能

#### 注意事项
- 免费版 Vercel 支持私有仓库 ✅
- 需要更新 `js/supabase-client.js` 中的 Anon Key（生产环境）
- 确保 Supabase 允许 Vercel 域名访问

---

## 📝 记录维护
- 创建日期：2026-03-11
- 最后更新：2026-03-12
- 维护人：开发团队
