-- ============================================
-- AIcountant Portal Seed Data
-- Sample data for testing the portal
-- ============================================

-- NOTE: Run this after creating a user account
-- Replace 'USER_ID_HERE' with the actual user UUID from auth.users

-- ============================================
-- SAMPLE TRANSACTIONS
-- ============================================

-- Income transactions
INSERT INTO transactions (user_id, transaction_date, description, amount, type, category, vendor_customer, payment_method, status) VALUES
('USER_ID_HERE', '2024-03-15', '客戶付款 - ABC科技有限公司', 45000.00, 'income', '銷售', 'ABC科技有限公司', '銀行轉賬', 'completed'),
('USER_ID_HERE', '2024-03-12', '顧問服務費 - XYZ顧問公司', 28000.00, 'income', '服務收入', 'XYZ顧問公司', '支票', 'completed'),
('USER_ID_HERE', '2024-03-10', '軟件銷售 - 客戶C', 15000.00, 'income', '銷售', '客戶C', '銀行轉賬', 'completed'),
('USER_ID_HERE', '2024-03-08', '培訓課程收入', 8500.00, 'income', '服務收入', '多位學員', '現金', 'completed'),
('USER_ID_HERE', '2024-03-05', '網站設計項目', 32000.00, 'income', '銷售', '客戶D', '銀行轉賬', 'pending');

-- Expense transactions
INSERT INTO transactions (user_id, transaction_date, description, amount, type, category, vendor_customer, payment_method, status) VALUES
('USER_ID_HERE', '2024-03-14', '辦公室租金 - 3月', 18500.00, 'expense', '租金', '房東', '銀行自動轉賬', 'completed'),
('USER_ID_HERE', '2024-03-13', '員工薪資', 55000.00, 'expense', '工資', '員工', '銀行轉賬', 'completed'),
('USER_ID_HERE', '2024-03-11', '會計軟件訂閱 - QuickBooks', 450.00, 'expense', '軟件訂閱', 'Intuit', '信用卡', 'completed'),
('USER_ID_HERE', '2024-03-09', '辦公用品採購', 1250.00, 'expense', '辦公費用', '文具供應商', '信用卡', 'completed'),
('USER_ID_HERE', '2024-03-07', '客戶應酬餐飲', 850.00, 'expense', '業務招待', '餐廳', '信用卡', 'completed'),
('USER_ID_HERE', '2024-03-06', '網站主機託管費', 299.00, 'expense', '軟件訂閱', 'AWS', '信用卡', 'completed'),
('USER_ID_HERE', '2024-03-04', '市場推廣 - Facebook廣告', 3200.00, 'expense', '市場推廣', 'Meta', '信用卡', 'completed'),
('USER_ID_HERE', '2024-03-03', '專業培訓課程', 2800.00, 'expense', '培訓', '培訓機構', '銀行轉賬', 'completed'),
('USER_ID_HERE', '2024-03-02', '辦公室水電費', 680.00, 'expense', '公用事業', '電力公司', '銀行自動轉賬', 'completed'),
('USER_ID_HERE', '2024-03-01', '律師諮詢費', 5000.00, 'expense', '專業服務', '律師事務所', '銀行轉賬', 'completed');

-- ============================================
-- SAMPLE INVOICES
-- ============================================

INSERT INTO invoices (user_id, invoice_number, client_name, client_email, issue_date, due_date, subtotal, tax_rate, tax_amount, total_amount, status, notes) VALUES
('USER_ID_HERE', 'INV-2024-001', 'ABC科技有限公司', 'accounts@abc-tech.com', '2024-03-15', '2024-04-15', 45000.00, 0, 0, 45000.00, 'sent', '網站開發項目第一期'),
('USER_ID_HERE', 'INV-2024-002', 'XYZ顧問公司', 'billing@xyz-consulting.com', '2024-03-10', '2024-04-10', 28000.00, 0, 0, 28000.00, 'paid', '顧問服務費 2024年Q1'),
('USER_ID_HERE', 'INV-2024-003', '客戶C有限公司', 'finance@client-c.com', '2024-03-05', '2024-04-05', 15000.00, 0, 0, 15000.00, 'overdue', '軟件許可費 - 請盡快付款'),
('USER_ID_HERE', 'INV-2024-004', '創新科技有限公司', 'ap@innovation-tech.com', '2024-03-01', '2024-04-01', 32000.00, 0, 0, 32000.00, 'draft', '網站設計項目'),
('USER_ID_HERE', 'INV-2024-005', '優質服務有限公司', 'billing@quality-services.com', '2024-02-20', '2024-03-20', 18000.00, 0, 0, 18000.00, 'paid', '月度維護服務');

-- ============================================
-- SAMPLE DOCUMENTS
-- ============================================

INSERT INTO documents (user_id, file_name, original_name, file_type, file_size, mime_type, storage_path, doc_type, processing_status) VALUES
('USER_ID_HERE', 'bank_statement_march_2024.pdf', '2024年3月銀行對帳單.pdf', 'pdf', 2457600, 'application/pdf', 'USER_ID_HERE/bank_statement_march_2024.pdf', 'bank_statement', 'completed'),
('USER_ID_HERE', 'office_rent_receipt_march.jpg', '辦公室租金收據_202403.jpg', 'image', 1245184, 'image/jpeg', 'USER_ID_HERE/office_rent_receipt_march.jpg', 'receipt', 'completed'),
('USER_ID_HERE', 'supplier_invoice_001.pdf', '供應商發票_INV2024001.pdf', 'pdf', 876544, 'application/pdf', 'USER_ID_HERE/supplier_invoice_001.pdf', 'invoice', 'completed'),
('USER_ID_HERE', 'employee_expense_march.pdf', '員工報銷單_20240305.pdf', 'pdf', 3145728, 'application/pdf', 'USER_ID_HERE/employee_expense_march.pdf', 'expense_report', 'processing'),
('USER_ID_HERE', 'contract_client_d.pdf', '服務合同_客戶D_2024.pdf', 'pdf', 1589248, 'application/pdf', 'USER_ID_HERE/contract_client_d.pdf', 'contract', 'completed');

-- ============================================
-- SAMPLE REPORTS
-- ============================================

INSERT INTO reports (user_id, report_name, report_type, start_date, end_date, report_data) VALUES
('USER_ID_HERE', '2024年3月損益表', 'profit_loss', '2024-03-01', '2024-03-31', '
{
    "period": "2024年3月",
    "income": 108500,
    "expenses": 87829,
    "net_profit": 20671,
    "income_breakdown": {
        "銷售": 92000,
        "服務收入": 16500
    },
    "expense_breakdown": {
        "租金": 18500,
        "工資": 55000,
        "軟件訂閱": 749,
        "辦公費用": 1250,
        "業務招待": 850,
        "市場推廣": 3200,
        "培訓": 2800,
        "公用事業": 680,
        "專業服務": 5000
    }
}'::jsonb);

INSERT INTO reports (user_id, report_name, report_type, start_date, end_date, report_data) VALUES
('USER_ID_HERE', '2024年第一季度稅務摘要', 'tax_summary', '2024-01-01', '2024-03-31', '
{
    "period": "2024年第一季度",
    "total_income": 285000,
    "total_expenses": 245000,
    "taxable_income": 40000,
    "estimated_tax": 6000,
    "deductions": {
        "租金": 55500,
        "工資": 165000,
        "其他費用": 24500
    }
}'::jsonb);

-- ============================================
-- INSTRUCTIONS
-- ============================================

/*
HOW TO USE THIS SEED DATA:

1. First, create a user account through the portal registration
2. Go to Supabase Dashboard → Authentication → Users
3. Copy the UUID of the user you just created
4. Replace all instances of 'USER_ID_HERE' with that UUID
5. Run this SQL in the Supabase SQL Editor

ALTERNATIVE: Create a function to auto-seed for new users

CREATE OR REPLACE FUNCTION seed_user_data(user_uuid UUID)
RETURNS void AS $$
BEGIN
    -- Insert transactions
    INSERT INTO transactions (user_id, transaction_date, description, amount, type, category, status)
    VALUES 
        (user_uuid, '2024-03-15', 'Sample Income', 10000, 'income', 'Sales', 'completed'),
        (user_uuid, '2024-03-14', 'Sample Expense', 5000, 'expense', 'Rent', 'completed');
    
    -- Add more seed data as needed...
END;
$$ LANGUAGE plpgsql;

-- Then call: SELECT seed_user_data('your-user-uuid-here');
*/

-- ============================================
-- SEED COMPLETE MESSAGE
-- ============================================

SELECT 'Seed data prepared! Remember to replace USER_ID_HERE with actual user UUID.' AS status;
