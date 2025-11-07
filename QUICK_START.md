# Quick Start Guide

## For ChatGPT Web Users

### 1. Start the HTTP Server

```bash
npm install
npm run build
npm run start:http
```

### 2. Expose with ngrok (for testing)

```bash
ngrok http 3000
```

Copy your ngrok URL (e.g., `https://abc123.ngrok.io`)

### 3. Set Up ChatGPT

1. Go to [chat.openai.com](https://chat.openai.com)
2. Click your profile → **My GPTs** → **Create a GPT**
3. Configure:
   - **Name**: Coupon Finder
   - **Description**: Find and manage coupons
4. In **Actions** section:
   - Click **Import from URL**
   - Enter: `https://your-ngrok-url.ngrok.io/openapi.json`
5. Configure **Authentication**:
   - Type: **API Key**
   - Header: `X-API-Key`
   - Key: `dev_api_key_12345` (from your .env file)
6. Click **Save**

### 4. Test

Try asking: "Find Nike coupons" or "List all merchants"

**See [CHATGPT_SETUP.md](CHATGPT_SETUP.md) for detailed instructions.**

---

## For ChatGPT Desktop / Claude Desktop

### 1. Build the MCP Server

```bash
npm install
npm run build
```

### 2. Configure ChatGPT/Claude Desktop

Add to your config file:

```json
{
  "mcpServers": {
    "coupon-hub": {
      "command": "node",
      "args": ["/home/user/coupon-hub/build/mcp-server.js"],
      "env": {
        "DB_HOST": "localhost",
        "DB_PORT": "5432",
        "DB_USER": "postgres",
        "DB_PASS": "postgres",
        "DB_NAME": "coupon_hub"
      }
    }
  }
}
```

### 3. Restart and Test

Restart ChatGPT/Claude Desktop and test the connection.

---

## API Endpoints

Once running, access:

- **Interactive Docs**: http://localhost:3000/docs
- **OpenAPI Spec**: http://localhost:3000/openapi.json
- **Health Check**: http://localhost:3000/

### Example API Calls

```bash
# Search coupons
curl "http://localhost:3000/api/coupons/search?query=nike&limit=5" \
  -H "X-API-Key: dev_api_key_12345"

# List merchants
curl "http://localhost:3000/api/merchants" \
  -H "X-API-Key: dev_api_key_12345"

# Get coupon by ID
curl "http://localhost:3000/api/coupons/123e4567-e89b-12d3-a456-426614174000" \
  -H "X-API-Key: dev_api_key_12345"

# Create coupon
curl -X POST "http://localhost:3000/api/coupons" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev_api_key_12345" \
  -d '{
    "title": "Free Shipping",
    "description": "Free shipping on orders over $50",
    "code": "FREESHIP50",
    "merchantName": "Example Store"
  }'
```

---

## Troubleshooting

### Database Connection Error

```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Initialize schema
psql -h localhost -U postgres -d coupon_hub -f schema.sql
```

### Port Already in Use

Change the port in `.env`:
```
PORT=3001
```

### API Key Issues

Check that your API key in `.env` matches what you configured in ChatGPT:
```
API_KEY=dev_api_key_12345
```

---

## Next Steps

- Read [CHATGPT_SETUP.md](CHATGPT_SETUP.md) for production deployment
- See [README.md](README.md) for full documentation
- Check [schema.sql](schema.sql) for database structure
