#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'coupon_hub',
  password: process.env.DB_PASS || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Initialize MCP server
const server = new Server(
  {
    name: "coupon-hub-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
const tools: Tool[] = [
  {
    name: "search_coupons",
    description: "Search for coupons by merchant, category, or keyword",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query for coupon title or description",
        },
        merchant: {
          type: "string",
          description: "Filter by merchant name or slug",
        },
        category: {
          type: "string",
          description: "Filter by category slug",
        },
        country: {
          type: "string",
          description: "Filter by country code (e.g., 'IL', 'US')",
        },
        limit: {
          type: "number",
          description: "Maximum number of results to return",
          default: 10,
        },
      },
    },
  },
  {
    name: "get_coupon_details",
    description: "Get detailed information about a specific coupon by ID",
    inputSchema: {
      type: "object",
      properties: {
        coupon_id: {
          type: "string",
          description: "The unique identifier of the coupon",
        },
      },
      required: ["coupon_id"],
    },
  },
  {
    name: "list_merchants",
    description: "List all available merchants",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of merchants to return",
          default: 50,
        },
      },
    },
  },
  {
    name: "list_categories",
    description: "List all available coupon categories",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of categories to return",
          default: 50,
        },
      },
    },
  },
  {
    name: "add_coupon",
    description: "Add a new coupon to the database",
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Coupon title",
        },
        description: {
          type: "string",
          description: "Coupon description",
        },
        code: {
          type: "string",
          description: "Coupon code",
        },
        url: {
          type: "string",
          description: "Coupon URL",
        },
        price: {
          type: "number",
          description: "Minimum purchase price",
        },
        currency: {
          type: "string",
          description: "Currency code (e.g., 'USD', 'ILS')",
        },
        country: {
          type: "string",
          description: "Country code (e.g., 'US', 'IL')",
        },
        merchantName: {
          type: "string",
          description: "Merchant name",
        },
        merchantSlug: {
          type: "string",
          description: "Merchant slug",
        },
        categorySlug: {
          type: "string",
          description: "Category slug",
        },
        sourceKey: {
          type: "string",
          description: "Source identifier",
        },
        sourceKind: {
          type: "string",
          description: "Source type (e.g., 'RSS', 'API')",
        },
      },
      required: ["title", "description", "merchantName"],
    },
  },
];

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "search_coupons": {
        const { query, merchant, category, country, limit = 10 } = args as any;

        let queryText = "SELECT * FROM coupons WHERE 1=1";
        const queryParams: any[] = [];
        let paramIndex = 1;

        if (query) {
          queryText += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
          queryParams.push(`%${query}%`);
          paramIndex++;
        }

        if (merchant) {
          queryText += ` AND (merchant_name ILIKE $${paramIndex} OR merchant_slug ILIKE $${paramIndex})`;
          queryParams.push(`%${merchant}%`);
          paramIndex++;
        }

        if (category) {
          queryText += ` AND category_slug ILIKE $${paramIndex}`;
          queryParams.push(`%${category}%`);
          paramIndex++;
        }

        if (country) {
          queryText += ` AND country = $${paramIndex}`;
          queryParams.push(country);
          paramIndex++;
        }

        queryText += ` ORDER BY created_at DESC LIMIT $${paramIndex}`;
        queryParams.push(limit);

        const result = await pool.query(queryText, queryParams);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result.rows, null, 2),
            },
          ],
        };
      }

      case "get_coupon_details": {
        const { coupon_id } = args as any;

        const result = await pool.query(
          "SELECT * FROM coupons WHERE id = $1",
          [coupon_id]
        );

        if (result.rows.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ error: "Coupon not found" }),
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result.rows[0], null, 2),
            },
          ],
        };
      }

      case "list_merchants": {
        const { limit = 50 } = args as any;

        const result = await pool.query(
          "SELECT DISTINCT merchant_name, merchant_slug FROM coupons ORDER BY merchant_name LIMIT $1",
          [limit]
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result.rows, null, 2),
            },
          ],
        };
      }

      case "list_categories": {
        const { limit = 50 } = args as any;

        const result = await pool.query(
          "SELECT DISTINCT category_slug FROM coupons ORDER BY category_slug LIMIT $1",
          [limit]
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result.rows, null, 2),
            },
          ],
        };
      }

      case "add_coupon": {
        const {
          title,
          description,
          code,
          url,
          price,
          currency,
          country,
          merchantName,
          merchantSlug,
          categorySlug,
          sourceKey,
          sourceKind,
        } = args as any;

        const result = await pool.query(
          `INSERT INTO coupons
          (title, description, code, url, price, currency, country, merchant_name, merchant_slug, category_slug, source_key, source_kind)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING *`,
          [
            title,
            description,
            code || null,
            url || null,
            price || null,
            currency || null,
            country || null,
            merchantName,
            merchantSlug || null,
            categorySlug || null,
            sourceKey || null,
            sourceKind || null,
          ]
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result.rows[0], null, 2),
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: `Unknown tool: ${name}` }),
            },
          ],
          isError: true,
        };
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: error.message }),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Coupon Hub MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
