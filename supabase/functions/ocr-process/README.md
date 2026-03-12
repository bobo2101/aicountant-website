# OCR Process Edge Function

## 手動部署方法（無需命令行）

### 方法 1：使用 Supabase Dashboard

1. 訪問 https://supabase.com/dashboard/project/lwmgekggcpwfxnyphlpc/functions
2. 點擊 **「Create a new function」** 或 **「Deploy function」**
3. Function name: `ocr-process`
4. 複製 `index.ts` 的內容粘貼到編輯器
5. 點擊 **「Deploy」**

### 方法 2：使用 VS Code 插件

1. 安裝 Supabase VS Code 插件
2. 右鍵 `index.ts` → Deploy to Supabase

### 方法 3：使用 GitHub Actions

創建 `.github/workflows/deploy-functions.yml`：

```yaml
name: Deploy Supabase Functions
on:
  push:
    branches: [main]
    paths:
      - 'supabase/functions/**'
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: supabase/setup-cli@v1
        with:
          version: latest
      - run: supabase link --project-ref lwmgekggcpwfxnyphlpc
      - run: supabase functions deploy ocr-process
```
