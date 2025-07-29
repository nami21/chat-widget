-- Multi-Assistant Chat Widget Database Schema

-- Conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id VARCHAR(255) UNIQUE NOT NULL,
    assistant_type VARCHAR(100) NOT NULL,
    assistant_id VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    user_id UUID, -- Optional: link to authenticated users
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assistant configurations table (optional - can be managed in code instead)
CREATE TABLE assistant_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assistant_type VARCHAR(100) UNIQUE NOT NULL,
    assistant_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    welcome_message TEXT,
    color VARCHAR(7), -- hex color
    allowed_domains TEXT[], -- array of allowed domains
    requires_auth BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (optional - for authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role VARCHAR(100) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_conversations_thread_id ON conversations(thread_id);
CREATE INDEX idx_conversations_assistant_type ON conversations(assistant_type);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_assistant_configs_type ON assistant_configs(assistant_type);
CREATE INDEX idx_users_email ON users(email);

-- Insert sample assistant configurations
INSERT INTO assistant_configs (assistant_type, assistant_id, name, welcome_message, color, allowed_domains, requires_auth) VALUES
('customer-support', 'asst_customer_support_123', 'Customer Support', '👋 Hello! I''m here to help with any questions or issues you have. How can I assist you today?', '#dc2626', ARRAY['yourcompany.com', 'support.yourcompany.com'], FALSE),
('sales', 'asst_sales_456', 'Sales Assistant', '💼 Hi there! I''m here to help you learn about our products and find the perfect solution for your needs. What can I help you with today?', '#059669', ARRAY['yourcompany.com', 'sales.yourcompany.com'], FALSE),
('hr-internal', 'asst_hr_789', 'HR Assistant', '🏢 Hello team member! I''m here to help with HR-related questions, policies, benefits, and workplace support. How can I assist you today?', '#7c3aed', ARRAY['internal.yourcompany.com'], TRUE),
('technical-support', 'asst_tech_101', 'Technical Support', '🔧 Technical support here! I''m ready to help you troubleshoot issues, resolve technical problems, and provide solutions. What technical issue can I help you with?', '#ea580c', ARRAY['support.yourcompany.com', 'docs.yourcompany.com'], FALSE);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assistant_configs_updated_at BEFORE UPDATE ON assistant_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();