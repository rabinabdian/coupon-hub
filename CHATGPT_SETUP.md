# ChatGPT Web Integration Guide

This guide explains how to connect the Coupon Hub API to ChatGPT Web (chat.openai.com) using ChatGPT Actions.

## Overview

ChatGPT Actions allow you to create custom GPTs that can call external APIs. This enables ChatGPT to search coupons, manage merchants, and interact with your coupon database.

## Prerequisites

1. **ChatGPT Plus subscription** (required for custom GPTs)
2. **Publicly accessible API endpoint** (see deployment options below)
3. **API Key** for authentication

## Step 1: Deploy Your API

Your API needs to be accessible from the internet. Choose one of these deployment options:

### Option A: Local Development with ngrok (Testing)

```bash
# Terminal 1: Start the API server
npm run build
npm run start:http

# Terminal 2: Expose via ngrok
ngrok http 3000
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)

### Option B: Production Deployment

Deploy to a hosting service:
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **Render**: Connect GitHub repo
- **DigitalOcean**: Deploy as App Platform
- **AWS/GCP/Azure**: Deploy as container or serverless function

After deployment, note your public URL (e.g., `https://your-api.onrender.com`)

## Step 2: Get Your OpenAPI Specification

Once your API is running, download the OpenAPI spec:

**Option 1: From running server**
```bash
curl http://localhost:3000/openapi.json > openapi.json
```

**Option 2: Update the spec file**

Edit `src/openapi-spec.ts` and change the server URL:

```typescript
servers: [
  {
    url: "https://your-public-url.com",  // Change this
    description: "Production server",
  },
],
```

Then rebuild:
```bash
npm run build
npm run start:http
curl http://localhost:3000/openapi.json > openapi.json
```

## Step 3: Create a Custom GPT on ChatGPT

1. Go to [chat.openai.com](https://chat.openai.com)
2. Click your profile icon (bottom left)
3. Select **"My GPTs"**
4. Click **"Create a GPT"**

### Configure Basic Information

In the **Configure** tab:

**Name**: Coupon Finder

**Description**:
```
Search and manage coupons from various merchants. Find deals, discounts, and promotional codes.
```

**Instructions**:
```
You are a helpful coupon assistant that helps users find the best deals and discounts.

When users ask about coupons, you should:
1. Search for relevant coupons using the search API
2. Present results in a clear, organized format
3. Include the coupon code, discount details, and merchant information
4. Provide the URL where the coupon can be used

You can help users:
- Find coupons for specific merchants or products
- Browse coupons by category
- Get details about specific deals
- List available merchants and categories

Always be helpful and suggest related deals when appropriate.
```

**Conversation starters** (optional):
- "Find Nike coupons"
- "Show me free shipping deals"
- "What merchants have coupons available?"
- "Search for electronics deals"

## Step 4: Configure Actions

Scroll down to the **Actions** section and click **"Create new action"**

### Method 1: Import from URL

If your API is publicly accessible:

1. Click **"Import from URL"**
2. Enter: `https://your-api-url.com/openapi.json`
3. Click **"Import"**

### Method 2: Paste Schema

1. Copy the entire contents of your `openapi.json` file
2. Paste it into the schema editor
3. Make sure to update the server URL in the schema to your public URL

### Configure Authentication

1. In the **Authentication** section, select **"API Key"**
2. Choose **"Custom"**
3. Set:
   - **Header Name**: `X-API-Key`
   - **API Key**: Your actual API key (from `.env` file)

Click **"Save"**

## Step 5: Test Your GPT

In the **Preview** pane on the right:

1. Try a test query: "Find Nike coupons"
2. Verify the GPT calls your API successfully
3. Check that results are displayed correctly

If you see errors:
- Check that your API is accessible from the internet
- Verify the API key is correct
- Check server logs for error messages

## Step 6: Publish (Optional)

Once testing is complete:

1. Click **"Save"** in the top right
2. Choose visibility:
   - **Only me**: Private use
   - **Anyone with a link**: Share with specific people
   - **Public**: List in GPT store (requires review)

## API Endpoint Reference

Your custom GPT will have access to these endpoints:

### Search Coupons
```
GET /api/coupons/search
```
Parameters: query, merchant, category, country, limit

### Get Coupon by ID
```
GET /api/coupons/{id}
```

### Create Coupon
```
POST /api/coupons
```

### List Merchants
```
GET /api/merchants
```

### List Categories
```
GET /api/categories
```

## Security Considerations

1. **Always use HTTPS** in production
2. **Rotate API keys** regularly
3. **Set rate limits** on your API
4. **Monitor usage** for suspicious activity
5. **Use environment variables** for sensitive data

## Troubleshooting

### "Failed to fetch schema"
- Ensure your API is publicly accessible
- Check that the URL is correct and includes protocol (https://)
- Verify CORS is enabled

### "Authentication failed"
- Double-check the API key in ChatGPT matches your `.env`
- Verify the header name is `X-API-Key`
- Check server logs for authentication errors

### "No results returned"
- Ensure your database has data
- Check that the database connection is working
- Review API server logs

### "Request timeout"
- Your API might be slow or unreachable
- Check server health at `https://your-api-url.com/`
- Verify database queries are optimized

## Example Interactions

Once set up, users can interact with your GPT like this:

**User**: "Find coupons for Amazon"
**GPT**: *Calls search API with merchant=Amazon, displays results*

**User**: "Show me all categories"
**GPT**: *Calls list categories API, displays available categories*

**User**: "Add a new coupon for 20% off at Nike"
**GPT**: *Calls create coupon API with the details*

## Production Checklist

Before going live:

- [ ] API deployed to production environment
- [ ] HTTPS enabled with valid SSL certificate
- [ ] Strong API key set in environment variables
- [ ] Database properly initialized with schema
- [ ] CORS configured for security
- [ ] Rate limiting implemented
- [ ] Error logging set up
- [ ] Monitoring and alerts configured
- [ ] Backup strategy in place
- [ ] Documentation updated with production URLs

## Quick Setup Summary

For **ChatGPT Web**, you need:

1. **Public API URL**: Deploy your API and get a public URL
2. **OpenAPI Spec**: Available at `https://your-api-url.com/openapi.json`
3. **API Key**: Set in `.env` file
4. **Custom GPT**: Create at chat.openai.com with your OpenAPI spec
5. **Authentication**: Configure API key auth in ChatGPT Actions

---

## Alternative: Using Actions in Regular ChatGPT Conversation

If you don't want to create a custom GPT, you can also use Actions in a regular conversation:

1. Start a new chat
2. Type `/actions`
3. Select "Create new action"
4. Follow the same steps as above

This creates a one-time action for the current conversation only.

---

## Need Help?

- Check API logs: `npm run start:http` and watch console output
- Test API directly: Visit `http://localhost:3000/docs` for Swagger UI
- Verify OpenAPI spec: `curl http://localhost:3000/openapi.json | jq`
- Database issues: Check PostgreSQL connection and schema

For issues, check the main [README.md](README.md) for more details.
