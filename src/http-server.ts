#!/usr/bin/env node
import express, { Request, Response } from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "./openapi-spec.js";

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || "3000");

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "coupon_hub",
  password: process.env.DB_PASS || "postgres",
  port: parseInt(process.env.DB_PORT || "5432"),
});

// Middleware
app.use(cors());
app.use(express.json());

// API key authentication (optional but recommended)
const API_KEY = process.env.API_KEY;

const authenticateApiKey = (req: Request, res: Response, next: Function) => {
  if (API_KEY) {
    const providedKey = req.headers["x-api-key"] || req.query.api_key;
    if (providedKey !== API_KEY) {
      return res.status(401).json({ error: "Unauthorized: Invalid API key" });
    }
  }
  next();
};

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    name: "Coupon Hub API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      swagger: "/docs",
      openapi: "/openapi.json",
      coupons: {
        search: "GET /api/coupons/search",
        getById: "GET /api/coupons/:id",
        create: "POST /api/coupons",
      },
      merchants: "GET /api/merchants",
      categories: "GET /api/categories",
    },
  });
});

// OpenAPI/Swagger documentation
app.get("/openapi.json", (req: Request, res: Response) => {
  res.json(openApiSpec);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

// API Routes

/**
 * Search coupons
 * GET /api/coupons/search
 */
app.get("/api/coupons/search", authenticateApiKey, async (req: Request, res: Response) => {
  try {
    const { query, merchant, category, country, limit = 10 } = req.query;

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
    queryParams.push(parseInt(limit as string));

    const result = await pool.query(queryText, queryParams);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error: any) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Get coupon by ID
 * GET /api/coupons/:id
 */
app.get("/api/coupons/:id", authenticateApiKey, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM coupons WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Coupon not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Get coupon error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Create a new coupon
 * POST /api/coupons
 */
app.post("/api/coupons", authenticateApiKey, async (req: Request, res: Response) => {
  try {
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
    } = req.body;

    // Validation
    if (!title || !description || !merchantName) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: title, description, merchantName",
      });
    }

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

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Create coupon error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * List all merchants
 * GET /api/merchants
 */
app.get("/api/merchants", authenticateApiKey, async (req: Request, res: Response) => {
  try {
    const { limit = 50 } = req.query;

    const result = await pool.query(
      "SELECT DISTINCT merchant_name, merchant_slug FROM coupons ORDER BY merchant_name LIMIT $1",
      [parseInt(limit as string)]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error: any) {
    console.error("List merchants error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * List all categories
 * GET /api/categories
 */
app.get("/api/categories", authenticateApiKey, async (req: Request, res: Response) => {
  try {
    const { limit = 50 } = req.query;

    const result = await pool.query(
      "SELECT DISTINCT category_slug FROM coupons WHERE category_slug IS NOT NULL ORDER BY category_slug LIMIT $1",
      [parseInt(limit as string)]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows.map((row) => row.category_slug),
    });
  } catch (error: any) {
    console.error("List categories error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    await pool.query("SELECT NOW()");
    console.log("✓ Database connected");

    app.listen(port, () => {
      console.log(`\n🚀 Coupon Hub API Server running on http://localhost:${port}`);
      console.log(`📚 API Documentation: http://localhost:${port}/docs`);
      console.log(`📋 OpenAPI Spec: http://localhost:${port}/openapi.json`);
      console.log(`\n🔑 API Key: ${API_KEY ? "Enabled" : "Disabled (set API_KEY env var)"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
