export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Coupon Hub API",
    version: "1.0.0",
    description: "API for searching and managing coupons, merchants, and categories",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "X-API-Key",
      },
    },
    schemas: {
      Coupon: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            description: "Unique coupon identifier",
          },
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
            nullable: true,
            description: "Coupon code",
          },
          url: {
            type: "string",
            nullable: true,
            description: "Coupon URL",
          },
          price: {
            type: "number",
            nullable: true,
            description: "Minimum purchase price",
          },
          currency: {
            type: "string",
            nullable: true,
            description: "Currency code",
          },
          country: {
            type: "string",
            nullable: true,
            description: "Country code",
          },
          merchant_name: {
            type: "string",
            description: "Merchant name",
          },
          merchant_slug: {
            type: "string",
            nullable: true,
            description: "Merchant slug",
          },
          category_slug: {
            type: "string",
            nullable: true,
            description: "Category slug",
          },
          source_key: {
            type: "string",
            nullable: true,
            description: "Source identifier",
          },
          source_kind: {
            type: "string",
            nullable: true,
            description: "Source type",
          },
          created_at: {
            type: "string",
            format: "date-time",
            description: "Creation timestamp",
          },
          updated_at: {
            type: "string",
            format: "date-time",
            description: "Last update timestamp",
          },
        },
      },
      Merchant: {
        type: "object",
        properties: {
          merchant_name: {
            type: "string",
            description: "Merchant name",
          },
          merchant_slug: {
            type: "string",
            nullable: true,
            description: "Merchant slug",
          },
        },
      },
      ApiResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            description: "Whether the request was successful",
          },
          count: {
            type: "integer",
            description: "Number of items returned",
          },
          data: {
            description: "Response data",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          error: {
            type: "string",
            description: "Error message",
          },
        },
      },
    },
  },
  security: [
    {
      ApiKeyAuth: [],
    },
  ],
  paths: {
    "/api/coupons/search": {
      get: {
        summary: "Search for coupons",
        description: "Search coupons by query, merchant, category, or country",
        operationId: "searchCoupons",
        parameters: [
          {
            name: "query",
            in: "query",
            description: "Search query for coupon title or description",
            required: false,
            schema: {
              type: "string",
            },
          },
          {
            name: "merchant",
            in: "query",
            description: "Filter by merchant name or slug",
            required: false,
            schema: {
              type: "string",
            },
          },
          {
            name: "category",
            in: "query",
            description: "Filter by category slug",
            required: false,
            schema: {
              type: "string",
            },
          },
          {
            name: "country",
            in: "query",
            description: "Filter by country code (e.g., 'IL', 'US')",
            required: false,
            schema: {
              type: "string",
            },
          },
          {
            name: "limit",
            in: "query",
            description: "Maximum number of results to return",
            required: false,
            schema: {
              type: "integer",
              default: 10,
              maximum: 100,
            },
          },
        ],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Coupon" },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/coupons/{id}": {
      get: {
        summary: "Get coupon by ID",
        description: "Retrieve detailed information about a specific coupon",
        operationId: "getCouponById",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Coupon ID",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Coupon" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "404": {
            description: "Coupon not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/coupons": {
      post: {
        summary: "Create a new coupon",
        description: "Add a new coupon to the database",
        operationId: "createCoupon",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "description", "merchantName"],
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
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Coupon created successfully",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: { $ref: "#/components/schemas/Coupon" },
                      },
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Bad request - missing required fields",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/merchants": {
      get: {
        summary: "List all merchants",
        description: "Get a list of all available merchants",
        operationId: "listMerchants",
        parameters: [
          {
            name: "limit",
            in: "query",
            description: "Maximum number of merchants to return",
            required: false,
            schema: {
              type: "integer",
              default: 50,
              maximum: 100,
            },
          },
        ],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Merchant" },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/categories": {
      get: {
        summary: "List all categories",
        description: "Get a list of all available coupon categories",
        operationId: "listCategories",
        parameters: [
          {
            name: "limit",
            in: "query",
            description: "Maximum number of categories to return",
            required: false,
            schema: {
              type: "integer",
              default: 50,
              maximum: 100,
            },
          },
        ],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/ApiResponse" },
                    {
                      type: "object",
                      properties: {
                        data: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
};
