# One-Click Deployment Guide

Get your HTTPS URL in under 5 minutes!

## 🚀 Option 1: Render.com (Easiest - One Click!)

### Step 1: Click to Deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/rabinabdian/coupon-hub)

### Step 2: Configure

1. Click the button above (it will open Render.com)
2. Sign in with GitHub
3. Give your service a name (e.g., `coupon-hub-api`)
4. Click **"Apply"**
5. Wait 2-3 minutes for deployment

### Step 3: Get Your URL

Your HTTPS URL will be: `https://coupon-hub-api.onrender.com`

### Step 4: Set API Key

1. Go to your service's **Environment** tab
2. Add `API_KEY` with a secure value
3. Click **"Save Changes"**

**✅ Done! Your API is live at: `https://your-service.onrender.com`**

---

## 🚀 Option 2: Railway.app (Very Easy)

### Step 1: Deploy

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose: `rabinabdian/coupon-hub`
5. Select branch: `claude/mcp-server-chatgpt-connector-011CUtJzzNnQHtBN6VzLzgwR`

### Step 2: Add Database

1. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway will auto-connect it

### Step 3: Configure Environment

Add these variables in the **Variables** tab:
```
PORT=3000
API_KEY=your_secure_key_here
NODE_ENV=production
```

Railway auto-configures database variables.

### Step 4: Get Your URL

1. Go to **Settings** tab
2. Click **"Generate Domain"**
3. Your URL: `https://coupon-hub-production.up.railway.app`

**✅ Done! Your API is live!**

---

## 🚀 Option 3: Fly.io (Fast & Permanent)

### Prerequisites
- Fly.io account (free): https://fly.io/app/sign-up

### Deploy in 3 Commands

```bash
# 1. Install flyctl
curl -L https://fly.io/install.sh | sh

# 2. Login
flyctl auth login

# 3. Deploy (from your repository)
flyctl launch --now
```

### During Launch:
- App name: `coupon-hub-mcp` (or your choice)
- Region: Choose closest to you
- Add PostgreSQL? **Yes**
- Deploy now? **Yes**

### Set Secrets:
```bash
flyctl secrets set API_KEY=your_secure_key_here
flyctl secrets set DB_HOST=your-db-host
flyctl secrets set DB_USER=postgres
flyctl secrets set DB_PASS=your-db-password
flyctl secrets set DB_NAME=coupon_hub
```

**Your URL**: `https://coupon-hub-mcp.fly.dev`

**✅ Done!**

---

## 🚀 Option 4: Vercel (For Node.js APIs)

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Deploy

```bash
vercel --prod
```

Follow prompts:
- Link to existing project? **No**
- Project name: `coupon-hub-api`
- Directory: `./`
- Override settings? **No**

### Step 3: Add Environment Variables

```bash
vercel env add API_KEY
vercel env add DB_HOST
vercel env add DB_PORT
vercel env add DB_USER
vercel env add DB_PASS
vercel env add DB_NAME
```

**Your URL**: `https://coupon-hub-api.vercel.app`

---

## 📝 After Deployment: Connect to ChatGPT

Once you have your HTTPS URL (e.g., `https://your-app.onrender.com`):

### 1. Test Your API

```bash
# Health check
curl https://your-app.onrender.com/

# Get OpenAPI spec
curl https://your-app.onrender.com/openapi.json
```

### 2. Update OpenAPI Spec (Optional)

If you want the OpenAPI spec to show your production URL:

1. Edit `src/openapi-spec.ts`
2. Update the server URL:
   ```typescript
   servers: [
     {
       url: "https://your-app.onrender.com",
       description: "Production server",
     },
   ],
   ```
3. Rebuild and redeploy

### 3. Configure ChatGPT

1. Go to https://chat.openai.com
2. Click your profile → **My GPTs** → **Create a GPT**
3. In **Actions** section:
   - Import from URL: `https://your-app.onrender.com/openapi.json`
4. Set **Authentication**:
   - Type: **API Key**
   - Auth Type: **Custom**
   - Header Name: `X-API-Key`
   - Value: Your API_KEY from deployment
5. Click **Save**

### 4. Test with ChatGPT

Try asking:
- "Search for Nike coupons"
- "List all merchants"
- "Find free shipping deals"

---

## 🎯 Recommended: Render.com

**Why?**
- ✅ Free tier with PostgreSQL
- ✅ Auto-deploys from GitHub
- ✅ HTTPS included
- ✅ No credit card required
- ✅ Simple one-click setup

**Your final URL**: `https://your-app-name.onrender.com`

---

## 🔧 Deployment Files Included

This repository includes configuration for all platforms:
- `Dockerfile` - Container configuration
- `fly.toml` - Fly.io configuration
- `render.yaml` - Render.com configuration
- `.dockerignore` - Docker ignore rules

---

## 🆘 Troubleshooting

### Deployment Failed?
- Check build logs in your platform's dashboard
- Verify all environment variables are set
- Ensure PostgreSQL database is connected

### API Returns Errors?
- Check environment variables match your database
- Verify API_KEY is set
- Check database connection

### ChatGPT Can't Connect?
- Test OpenAPI spec: `curl https://your-url.com/openapi.json`
- Verify HTTPS is working (not HTTP)
- Check API key matches in ChatGPT config

---

## 📊 Platform Comparison

| Platform | Setup Time | Free Tier | Database | Custom Domain |
|----------|-----------|-----------|----------|---------------|
| **Render.com** | 2 min | ✅ Yes | PostgreSQL | ✅ Yes |
| **Railway.app** | 3 min | ✅ Yes | PostgreSQL | ✅ Yes |
| **Fly.io** | 5 min | ✅ Yes | PostgreSQL | ✅ Yes |
| **Vercel** | 3 min | ✅ Yes | External only | ✅ Yes |

---

## 🎉 Quick Start Summary

1. **Choose platform**: Render.com (recommended)
2. **Deploy**: Click deploy button or connect repo
3. **Wait**: 2-3 minutes for deployment
4. **Get URL**: Copy your HTTPS URL
5. **Connect ChatGPT**: Import OpenAPI spec
6. **Done**: Start using your coupon API!

---

## 📧 Need Help?

- Render.com docs: https://render.com/docs
- Railway.app docs: https://docs.railway.app
- Fly.io docs: https://fly.io/docs
- ChatGPT Actions: See [CHATGPT_SETUP.md](CHATGPT_SETUP.md)
