# Getting an HTTPS URL for ChatGPT Web

Your HTTP API server is running at: `http://localhost:3000`

To connect to ChatGPT Web, you need an HTTPS URL. Here are your options:

## ✅ Server is Running

- **Local URL**: http://localhost:3000
- **Status**: API is operational
- **Documentation**: http://localhost:3000/docs
- **OpenAPI Spec**: http://localhost:3000/openapi.json

## Option 1: Deploy to Cloud (Recommended for Production)

### Free Hosting Options:

#### A. Render.com (Free Tier)
1. Create account at https://render.com
2. Connect your GitHub repository
3. Create new "Web Service"
4. Configure:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:http`
   - Environment Variables: Add your DB credentials and API_KEY
5. Deploy - you'll get: `https://your-app-name.onrender.com`

#### B. Railway.app (Free Tier)
1. Visit https://railway.app
2. Connect GitHub repository
3. Railway auto-detects Node.js
4. Add environment variables
5. Deploy - you'll get: `https://your-app-name.railway.app`

#### C. Fly.io (Free Tier)
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login and deploy
flyctl auth login
flyctl launch
flyctl deploy
```
You'll get: `https://your-app-name.fly.dev`

## Option 2: ngrok (Quick Testing - Free)

### On Your Local Machine:

1. **Download ngrok**: https://ngrok.com/download
2. **Sign up** for free account to get auth token
3. **Run these commands**:
```bash
# Authenticate (one-time)
ngrok config add-authtoken YOUR_AUTH_TOKEN

# Start tunnel
ngrok http 3000
```

4. **Copy the HTTPS URL** from ngrok output:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

**Your HTTPS URL**: `https://abc123.ngrok.io`

### Important Notes:
- Free ngrok URLs change each time you restart
- Free tier has connection limits
- Tunnel stays active only while ngrok is running

## Option 3: Cloudflare Tunnel (Free, Stable URL)

```bash
# Install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
dpkg -i cloudflared-linux-amd64.deb

# Login and create tunnel
cloudflared tunnel login
cloudflared tunnel create coupon-hub
cloudflared tunnel route dns coupon-hub coupon-hub.yourdomain.com

# Run tunnel
cloudflared tunnel run coupon-hub --url http://localhost:3000
```

## Option 4: Use Existing Public Server

If you have access to a server with a domain:

1. SSH to your server
2. Clone the repository
3. Set up environment variables
4. Run with PM2 or systemd
5. Configure nginx reverse proxy with SSL

Example nginx config:
```nginx
server {
    listen 443 ssl;
    server_name api.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Once You Have HTTPS URL

### Connect to ChatGPT:

1. Go to [chat.openai.com](https://chat.openai.com)
2. Click profile → **My GPTs** → **Create a GPT**
3. In **Actions** section:
   - **Import from URL**: `https://your-url.com/openapi.json`
4. Configure **Authentication**:
   - Type: **API Key**
   - Header: `X-API-Key`
   - Value: `dev_api_key_12345` (from your .env file)
5. **Save** and test

## Testing Your URL

Before connecting to ChatGPT, verify your URL works:

```bash
# Test health endpoint
curl https://your-url.com/

# Test OpenAPI spec
curl https://your-url.com/openapi.json

# Test API with authentication
curl https://your-url.com/api/merchants \
  -H "X-API-Key: dev_api_key_12345"
```

## Current Server Status

- ✅ PostgreSQL: Running on port 5432
- ✅ HTTP Server: Running on port 3000
- ✅ Database Schema: Initialized
- ✅ API Endpoints: Active

## Recommended Next Steps

1. **For quick testing**: Use ngrok on your local machine
2. **For production**: Deploy to Render, Railway, or Fly.io
3. **Update OpenAPI spec**: Edit `src/openapi-spec.ts` to include your HTTPS URL
4. **Rebuild**: Run `npm run build` after updating
5. **Connect to ChatGPT**: Follow setup guide in [CHATGPT_SETUP.md](CHATGPT_SETUP.md)

## Need Help?

- Local server logs: Check terminal output
- API documentation: Visit http://localhost:3000/docs
- Test endpoints: Use Swagger UI or curl commands
