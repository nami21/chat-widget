const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Assistant configurations
const ASSISTANTS = {
  'customer-support': {
    id: process.env.ASSISTANT_CUSTOMER_SUPPORT || 'asst_customer_support_123',
    name: 'Customer Support',
    welcomeMessage: '👋 Hello! I\'m here to help with any questions or issues you have. How can I assist you today?',
    color: '#dc2626', // red-600
    allowedDomains: ['localhost', 'yourcompany.com', 'support.yourcompany.com'],
    placeholder: 'Type your message...'
  },
  'sales': {
    id: process.env.ASSISTANT_SALES || 'asst_sales_456',
    name: 'Sales Assistant',
    welcomeMessage: '💼 Hi there! I\'m here to help you learn about our products and find the perfect solution for your needs. What can I help you with today?',
    color: '#059669', // green-600
    allowedDomains: ['localhost', 'yourcompany.com', 'sales.yourcompany.com'],
    placeholder: 'Ask about our products...'
  },
  'hr-internal': {
    id: process.env.ASSISTANT_HR_INTERNAL || 'asst_hr_789',
    name: 'HR Assistant',
    welcomeMessage: '🏢 Hello team member! I\'m here to help with HR-related questions, policies, benefits, and workplace support. How can I assist you today?',
    color: '#7c3aed', // purple-600
    allowedDomains: ['localhost', 'internal.yourcompany.com'],
    requiresAuth: true,
    placeholder: 'Ask about HR policies, benefits...'
  },
  'technical-support': {
    id: process.env.ASSISTANT_TECHNICAL_SUPPORT || 'asst_tech_101',
    name: 'Technical Support',
    welcomeMessage: '🔧 Technical support here! I\'m ready to help you troubleshoot issues, resolve technical problems, and provide solutions. What technical issue can I help you with?',
    color: '#ea580c', // orange-600
    allowedDomains: ['localhost', 'support.yourcompany.com', 'docs.yourcompany.com'],
    placeholder: 'Describe your technical issue...'
  }
};

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Optional: Database connection (uncomment if using database)
/*
const { Pool } = require('pg');
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});
*/

// Create new thread endpoint
app.post('/api/newThread', async (req, res) => {
  try {
    const { assistantType, domain } = req.body;
    const assistant = ASSISTANTS[assistantType];
    
    if (!assistant) {
      return res.status(400).json({
        error: 'Invalid assistant type',
        success: false
      });
    }
    
    // Check domain restrictions
    if (assistant.allowedDomains && !assistant.allowedDomains.includes(domain)) {
      return res.status(403).json({
        error: 'Access denied for this domain',
        success: false
      });
    }
    
    // Check authentication if required (implement your auth logic here)
    if (assistant.requiresAuth && !req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        success: false
      });
    }
    
    // Create OpenAI thread
    const thread = await openai.beta.threads.create();
    
    // Optional: Store thread in database
    /*
    await db.query(
      'INSERT INTO conversations (thread_id, assistant_type, assistant_id, domain) VALUES ($1, $2, $3, $4)',
      [thread.id, assistantType, assistant.id, domain]
    );
    */
    
    res.json({
      threadId: thread.id,
      assistantConfig: {
        name: assistant.name,
        welcomeMessage: assistant.welcomeMessage,
        color: assistant.color,
        placeholder: assistant.placeholder
      },
      success: true
    });
  } catch (error) {
    console.error('Error creating thread:', error);
    res.status(500).json({
      error: 'Failed to create thread',
      success: false
    });
  }
});

// Send message endpoint
app.post('/api/sendMessage', async (req, res) => {
  try {
    const { threadId, message } = req.body;
    
    if (!threadId || !message) {
      return res.status(400).json({
        error: 'Missing threadId or message',
        success: false
      });
    }
    
    // Optional: Get conversation info from database to determine assistant
    /*
    const conversation = await db.query(
      'SELECT assistant_type, assistant_id FROM conversations WHERE thread_id = $1',
      [threadId]
    );
    
    if (conversation.rows.length === 0) {
      return res.status(404).json({
        error: 'Conversation not found',
        success: false
      });
    }
    
    const { assistant_type, assistant_id } = conversation.rows[0];
    */
    
    // For demo purposes, use customer-support assistant
    // In production, get this from database or thread metadata
    const assistantId = ASSISTANTS['customer-support'].id;
    
    // Add message to thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });

    // Optional: Store user message in database
    /*
    await db.query(
      'INSERT INTO messages (conversation_id, role, content) VALUES ((SELECT id FROM conversations WHERE thread_id = $1), $2, $3)',
      [threadId, 'user', message]
    );
    */

    // Run the assistant
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    // Wait for completion
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    while (runStatus.status !== 'completed' && runStatus.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      
      // Timeout after 30 seconds
      if (Date.now() - new Date(run.created_at * 1000) > 30000) {
        throw new Error('Assistant response timeout');
      }
    }

    if (runStatus.status === 'failed') {
      throw new Error('Assistant run failed');
    }

    // Get the assistant's response
    const messages = await openai.beta.threads.messages.list(threadId);
    const assistantMessage = messages.data[0];
    const responseText = assistantMessage.content[0].text.value;

    // Optional: Store assistant response in database
    /*
    await db.query(
      'INSERT INTO messages (conversation_id, role, content) VALUES ((SELECT id FROM conversations WHERE thread_id = $1), $2, $3)',
      [threadId, 'assistant', responseText]
    );
    */

    res.json({
      response: responseText,
      success: true
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      error: 'Failed to send message',
      success: false
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Available assistants: ${Object.keys(ASSISTANTS).join(', ')}`);
});

module.exports = app;