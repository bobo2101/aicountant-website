# AIcountant Supabase Setup Guide

Complete guide to set up Supabase for secure client portal authentication and data storage.

---

## 📋 Table of Contents
1. [Create Supabase Project](#step-1-create-supabase-project)
2. [Database Schema](#step-2-set-up-database-schema)
3. [Configure Authentication](#step-3-configure-authentication)
4. [Row Level Security](#step-4-enable-row-level-security)
5. [Update Website Code](#step-5-update-website-code)
6. [Test the Setup](#step-6-test-the-setup)

---

## Step 1: Create Supabase Project

### 1.1 Sign Up / Log In
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email

### 1.2 Create New Project
1. Click "New Project"
2. Fill in details:
   - **Name**: `aicountant-portal`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., `Southeast Asia (Singapore)`)
3. Click "Create new project"
4. Wait 1-2 minutes for provisioning

### 1.3 Get Your API Keys
Once project is ready:
1. Go to Project Settings (gear icon) → API
2. Copy these values (you'll need them):
   - **Project URL**: `https://xxxxxxxx.supabase.co`
   - **anon public**: `eyJ...` (starts with eyJ)
   - **service_role secret**: `eyJ...` (keep this SECRET!)

---

## Step 2: Set Up Database Schema

### 2.1 Open SQL Editor
1. In Supabase Dashboard, click "SQL Editor" in left sidebar
2. Click "New query"

### 2.2 Run Schema Setup
Copy and paste the entire contents of `database/schema.sql` into the SQL Editor and click "Run".

This creates:
- ✅ User profiles table (extends Supabase auth)
- ✅ Transactions table
- ✅ Documents table
- ✅ Invoices table
- ✅ Reports table
- ✅ All indexes for performance
- ✅ Triggers for auto-updating timestamps

### 2.3 Verify Tables
1. Go to "Table Editor" in left sidebar
2. You should see: `profiles`, `transactions`, `documents`, `invoices`, `reports`

---

## Step 3: Configure Authentication

### 3.1 Auth Settings
1. Go to Authentication → Settings
2. Under "Site URL", enter your production domain:
   - Production: `https://aicountant-website.vercel.app`
   - Local dev: `http://localhost:5500`
3. Add redirect URLs:
   - `https://aicountant-website.vercel.app/portal/login.html`
   - `http://localhost:5500/portal/login.html`

### 3.2 Customize Confirmation Email (Important!)

To show **AIcountant** company name in confirmation emails:

1. Go to **Authentication** → **Email Templates**
2. Click on **"Confirm Signup"** template
3. Replace with this custom template:

```html
<h2>歡迎來到 AIcountant！</h2>

<p>您好 {{ .Email }}，</p>

<p>感謝您註冊 AIcountant 智能會計平台。請點擊下方按鈕確認您的電郵地址：</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}" 
     style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
    確認我的電郵地址
  </a>
</p>

<p>或者複製以下連結到瀏覽器：</p>
<p style="word-break: break-all; background: #f5f5f5; padding: 12px; border-radius: 4px;">
  {{ .ConfirmationURL }}
</p>

<p>如果您沒有註冊 AIcountant 賬戶，請忽略此郵件。</p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
<p style="color: #666; font-size: 12px;">
  <strong>AIcountant 智能會計平台</strong><br>
  讓您的財務管理更輕鬆<br>
  <a href="https://aicountant-website.vercel.app">https://aicountant-website.vercel.app</a>
</p>
```

4. Also customize **"Reset Password"** template similarly:

```html
<h2>重置您的 AIcountant 密碼</h2>

<p>您好 {{ .Email }}，</p>

<p>我們收到了重置您 AIcountant 賬戶密碼的請求。請點擊下方按鈕重置密碼：</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}" 
     style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
    重置密碼
  </a>
</p>

<p>如果您沒有請求重置密碼，請忽略此郵件。</p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
<p style="color: #666; font-size: 12px;">
  <strong>AIcountant 智能會計平台</strong><br>
  客服支援：<a href="mailto:support@aicountant.com">support@aicountant.com</a>
</p>
```

5. Click **"Save"** after each template

### 3.3 Disable Email Confirmation (For Testing Only)
If you want to skip email verification during development:
- Go to **Authentication** → **Providers** → **Email**
- Toggle OFF **"Confirm email"**
- **Remember to turn this ON for production!**

### 3.3 Rate Limiting
1. Go to Authentication → Rate Limits
2. Set reasonable limits:
   - Sign up: 5 per hour
   - Sign in: 10 per hour
   - Password reset: 3 per hour

---

## Step 4: Enable Row Level Security

### 4.1 RLS is Auto-Enabled
The schema.sql already enables RLS on all tables with these policies:

| Table | Policy | Effect |
|-------|--------|--------|
| `profiles` | Users read own profile | Can only see YOUR profile |
| `profiles` | Users update own profile | Can only edit YOUR profile |
| `transactions` | Users CRUD own transactions | Full control of YOUR transactions |
| `documents` | Users CRUD own documents | Full control of YOUR documents |
| `invoices` | Users CRUD own invoices | Full control of YOUR invoices |
| `reports` | Users CRUD own reports | Full control of YOUR reports |

### 4.2 Verify RLS is Working
1. Go to Table Editor → transactions
2. Click "Add row"
3. Try to add a row with a different `user_id` than yours
4. It should be blocked!

---

## Step 5: Update Website Code

### 5.1 Update Environment Variables

#### Option A: Local Development
Create `portal/config.js` (already created for you):
```javascript
// Replace with your actual Supabase credentials
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'eyJ...your-anon-key';
```

#### Option B: Vercel Production
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - Name: `SUPABASE_URL` | Value: `https://your-project.supabase.co`
   - Name: `SUPABASE_ANON_KEY` | Value: `eyJ...your-anon-key`

### 5.2 Files Already Updated
I've updated these files with Supabase integration:
- ✅ `portal/login.html` - Supabase Auth login
- ✅ `portal/dashboard.html` - Protected route with real data
- ✅ `portal/transactions.html` - CRUD operations
- ✅ `portal/documents.html` - File upload to Supabase Storage
- ✅ `js/supabase-client.js` - Supabase client configuration

### 5.3 Add Supabase Storage (For Documents)

#### Create Storage Bucket
1. Go to Storage in Supabase Dashboard
2. Click "New bucket"
3. Name: `documents`
4. Toggle OFF "Public bucket" (private by default)
5. Click "Save"

#### Set Storage Policies
1. Click on `documents` bucket → Policies
2. Add these policies:

**SELECT policy:**
- Name: "Users can view own documents"
- Allowed operation: SELECT
- Target roles: authenticated
- USING expression: `(storage.foldername(name))[1] = auth.uid()::text`

**INSERT policy:**
- Name: "Users can upload own documents"
- Allowed operation: INSERT
- Target roles: authenticated
- WITH CHECK expression: `(storage.foldername(name))[1] = auth.uid()::text`

**DELETE policy:**
- Name: "Users can delete own documents"
- Allowed operation: DELETE
- Target roles: authenticated
- USING expression: `(storage.foldername(name))[1] = auth.uid()::text`

---

## Step 6: Test the Setup

### 6.1 Local Testing
```bash
# Start local server
cd /Users/oliverng/Downloads/aicountant-website-project/website
npx serve .
# or use VS Code Live Server
```

### 6.2 Test Registration
1. Go to `http://localhost:5500/portal/login.html`
2. Try registering a new account
3. Check Supabase Dashboard → Authentication → Users to verify

### 6.3 Test Login
1. Log in with the new account
2. Should redirect to dashboard
3. Dashboard should show real user email

### 6.4 Test Data Isolation
1. Create some transactions
2. Log out
3. Create another account
4. Verify you CANNOT see the first user's transactions

### 6.5 Deploy to Production
```bash
# Commit changes
git add -A
git commit -m "Add Supabase authentication and database"
git push origin main

# Or deploy to Vercel
npx vercel --prod
```

---

## 🔐 Security Checklist

After setup, verify:

- [ ] RLS is enabled on all tables
- [ ] Storage bucket is private (not public)
- [ ] Storage policies restrict access by user_id
- [ ] CORS is configured for your domain
- [ ] Rate limiting is enabled
- [ ] No sensitive keys exposed in frontend (only anon key)
- [ ] service_role key is kept secret (server-side only)

---

## 📊 Database Schema Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE SCHEMA                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     ┌─────────────────┐                       │
│  │   auth.users │────▶│    profiles     │                       │
│  │  (Supabase)  │     │  (extends auth) │                       │
│  └──────────────┘     └─────────────────┘                       │
│           │                                                      │
│           │  One user has many:                                  │
│           ▼                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ transactions │  │   documents  │  │   invoices   │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                  │
│  All tables have:                                               │
│  - user_id (foreign key to auth.users)                          │
│  - created_at, updated_at timestamps                            │
│  - Row Level Security (RLS) enabled                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🆘 Troubleshooting

### Issue: "Invalid login credentials"
- Check that email confirmation is disabled (Auth → Providers → Email)
- Check browser console for exact error

### Issue: "JWT expired"
- Session expired, user needs to log in again
- Default expiry: 1 hour

### Issue: "new row violates row-level security policy"
- RLS is working! But your query is trying to access another user's data
- Check that you're including the user's JWT token in requests

### Issue: "Cannot read property 'supabase' of undefined"
- Make sure `js/supabase-client.js` is loaded before other scripts
- Check browser Network tab that the script loaded successfully

### Issue: CORS errors
- Add your domain to Supabase → Authentication → URL Configuration
- Include `http://localhost:5500` for local development

---

## 📚 Next Steps

1. **Add real data**: Use the seed.sql file to add sample transactions
2. **Set up logging**: Configure Winston or Logtail for audit trails
3. **Add backups**: Supabase provides daily backups on free tier
4. **Custom domain**: Connect your own domain to Supabase project
5. **Monitoring**: Set up alerts for failed logins or errors

---

**Need help?**
- Supabase Docs: https://supabase.com/docs
- Auth Docs: https://supabase.com/docs/guides/auth
- JavaScript Client: https://supabase.com/docs/reference/javascript

**Your portal is now production-ready! 🎉**
