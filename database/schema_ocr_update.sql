-- ============================================
-- AIcountant OCR & Storage Optimization Update
-- ============================================

-- Add new columns to documents table
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS processing_provider TEXT,
ADD COLUMN IF NOT EXISTS processing_cost DECIMAL(10,6) DEFAULT 0,
ADD COLUMN IF NOT EXISTS original_file_size INTEGER,
ADD COLUMN IF NOT EXISTS compressed_file_size INTEGER;

-- Create OCR usage tracking table
CREATE TABLE IF NOT EXISTS ocr_usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    provider TEXT NOT NULL, -- 'deepseek', 'google', 'basic'
    cost DECIMAL(10,6) NOT NULL DEFAULT 0,
    processing_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for cost analysis
CREATE INDEX idx_ocr_usage_user_date ON ocr_usage_logs(user_id, created_at);
CREATE INDEX idx_ocr_usage_provider ON ocr_usage_logs(provider);

-- Enable RLS on ocr_usage_logs
ALTER TABLE ocr_usage_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own usage
CREATE POLICY "Users can view own OCR usage" 
    ON ocr_usage_logs FOR SELECT 
    USING (auth.uid() = user_id);

-- Create storage usage tracking view
CREATE OR REPLACE VIEW user_storage_usage AS
SELECT 
    user_id,
    COUNT(*) as file_count,
    SUM(file_size) as total_size_bytes,
    SUM(COALESCE(compressed_file_size, file_size)) as compressed_size_bytes,
    SUM(COALESCE(processing_cost, 0)) as total_ocr_cost
FROM documents
GROUP BY user_id;

-- ============================================
-- STORAGE OPTIMIZATION: Image Compression Function
-- ============================================

-- Note: Actual image compression should be done in client-side or Edge Function
-- This is a placeholder for the metadata tracking

CREATE OR REPLACE FUNCTION log_document_upload()
RETURNS TRIGGER AS $$
BEGIN
    -- Set original file size if not set
    IF NEW.original_file_size IS NULL THEN
        NEW.original_file_size = NEW.file_size;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to log upload
CREATE TRIGGER on_document_upload
    BEFORE INSERT ON documents
    FOR EACH ROW EXECUTE FUNCTION log_document_upload();

-- ============================================
-- COST ANALYSIS QUERY EXAMPLES
-- ============================================

-- Monthly OCR cost by user
/*
SELECT 
    user_id,
    DATE_TRUNC('month', created_at) as month,
    provider,
    COUNT(*) as request_count,
    SUM(cost) as total_cost_usd
FROM ocr_usage_logs
GROUP BY user_id, DATE_TRUNC('month', created_at), provider
ORDER BY month DESC, total_cost_usd DESC;
*/

-- Storage usage by user
/*
SELECT 
    user_id,
    file_count,
    ROUND(total_size_bytes / 1024.0 / 1024.0, 2) as size_mb,
    ROUND(compressed_size_bytes / 1024.0 / 1024.0, 2) as compressed_mb,
    ROUND(total_ocr_cost, 4) as ocr_cost_usd
FROM user_storage_usage;
*/

SELECT 'OCR and storage optimization schema updated!' AS status;
