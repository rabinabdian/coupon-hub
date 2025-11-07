-- Coupon Hub Database Schema

CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    code VARCHAR(100),
    url TEXT,
    price DECIMAL(10, 2),
    currency VARCHAR(3),
    country VARCHAR(2),
    merchant_name VARCHAR(255) NOT NULL,
    merchant_slug VARCHAR(255),
    category_slug VARCHAR(255),
    source_key VARCHAR(255),
    source_kind VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_coupons_merchant_name ON coupons(merchant_name);
CREATE INDEX IF NOT EXISTS idx_coupons_merchant_slug ON coupons(merchant_slug);
CREATE INDEX IF NOT EXISTS idx_coupons_category_slug ON coupons(category_slug);
CREATE INDEX IF NOT EXISTS idx_coupons_country ON coupons(country);
CREATE INDEX IF NOT EXISTS idx_coupons_created_at ON coupons(created_at DESC);

-- Create text search index for title and description
CREATE INDEX IF NOT EXISTS idx_coupons_title_text ON coupons USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_coupons_description_text ON coupons USING gin(to_tsvector('english', description));
