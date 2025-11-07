# Coupon Hub MCP Server

A Model Context Protocol (MCP) server that provides access to a coupon database. This server can be connected to ChatGPT to enable coupon search, management, and retrieval functionality.

## Features

The MCP server provides the following tools:

- **search_coupons**: Search for coupons by merchant, category, or keyword
- **get_coupon_details**: Get detailed information about a specific coupon
- **list_merchants**: List all available merchants
- **list_categories**: List all available coupon categories
- **add_coupon**: Add a new coupon to the database

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database

Copy the example environment file and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env` with your database settings:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=coupon_hub
```

### 3. Initialize Database

Start your PostgreSQL database and create the schema:

```bash
# If using Docker Compose
docker-compose up -d

# Initialize the database schema
psql -h localhost -U postgres -d coupon_hub -f schema.sql
```

### 4. Build the Server

```bash
npm run build
```

## Connecting to ChatGPT

### For ChatGPT Desktop App (Local Development)

To connect this MCP server to ChatGPT, you need to add it to your ChatGPT configuration.

#### Option 1: Using npx (Recommended for local testing)

Add this configuration to your ChatGPT settings (usually in `~/Library/Application Support/ChatGPT/config.json` on Mac):

```json
{
  "mcpServers": {
    "coupon-hub": {
      "command": "npx",
      "args": [
        "-y",
        "coupon-hub-mcp-server"
      ]
    }
  }
}
```

#### Option 2: Using local path

```json
{
  "mcpServers": {
    "coupon-hub": {
      "command": "node",
      "args": [
        "/absolute/path/to/coupon-hub/build/mcp-server.js"
      ]
    }
  }
}
```

### For ChatGPT Web (Enterprise/API)

For web-based ChatGPT integrations, you'll need to:

1. **Deploy the server** to a publicly accessible location
2. **Use a proxy service** that bridges stdio MCP servers to HTTP/WebSocket
3. **Configure ChatGPT** with the public endpoint URL

#### Example using MCP Gateway (Hypothetical)

If you deploy the server behind an MCP gateway service:

```
wss://your-domain.com/mcp/coupon-hub
```

Or using a service like ngrok for testing:

```bash
# In terminal 1: Start the MCP server
npm start

# In terminal 2: Expose via ngrok (requires MCP-to-HTTP bridge)
ngrok http 8080
```

## Local Testing

### Running the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Testing with MCP Inspector

You can test the server using the MCP Inspector tool:

```bash
npx @modelcontextprotocol/inspector node build/mcp-server.js
```

## Usage Examples

Once connected to ChatGPT, you can use natural language to interact with the coupon database:

- "Search for Nike coupons"
- "Show me all coupons for free shipping"
- "List all available merchants"
- "Add a new coupon for 20% off at Amazon"
- "What categories of coupons are available?"

## Server URL for ChatGPT Connector

**For Local Development:**
- **Command**: `node`
- **Args**: `["/home/user/coupon-hub/build/mcp-server.js"]`

**After Publishing to npm:**
- **Command**: `npx`
- **Args**: `["-y", "coupon-hub-mcp-server"]`

**Configuration JSON:**
```json
{
  "coupon-hub": {
    "command": "node",
    "args": ["/home/user/coupon-hub/build/mcp-server.js"]
  }
}
```

## Architecture

The MCP server:
- Connects to PostgreSQL database using `pg` library
- Implements MCP protocol using `@modelcontextprotocol/sdk`
- Uses stdio transport for communication
- Provides structured tool interfaces for coupon operations

## Database Schema

The server expects a `coupons` table with the following structure:

```sql
CREATE TABLE coupons (
    id UUID PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    code VARCHAR(100),
    url TEXT,
    price DECIMAL(10, 2),
    currency VARCHAR(3),
    country VARCHAR(2),
    merchant_name VARCHAR(255),
    merchant_slug VARCHAR(255),
    category_slug VARCHAR(255),
    source_key VARCHAR(255),
    source_kind VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## Troubleshooting

### Server won't start
- Check that PostgreSQL is running
- Verify database credentials in `.env`
- Ensure database schema is initialized

### ChatGPT can't connect
- Verify the build output exists at `build/mcp-server.js`
- Check file permissions
- Review ChatGPT configuration file syntax
- Check server logs for errors

### Database connection errors
- Confirm PostgreSQL is accessible
- Test connection with: `psql -h $DB_HOST -U $DB_USER -d $DB_NAME`
- Verify firewall rules if using remote database

## Development

### Project Structure

```
coupon-hub/
├── src/
│   └── mcp-server.ts       # Main MCP server implementation
├── build/                   # Compiled JavaScript output
├── schema.sql              # Database schema
├── package.json            # Node.js dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── .env                    # Environment variables (not in git)
└── README.md              # This file
```

## License

[Your License Here]

## Contributing

[Contribution guidelines here]
