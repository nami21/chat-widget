# Embeddable Chat Widget

A modern, red-themed chat widget designed for easy embedding on any website. Features a clean interface with support for multiple OpenAI Assistants and optional database storage.

## 🚀 Features

- **Modern Design**: Red-themed with rounded edges and smooth animations
- **Embeddable**: Single HTML file that can be embedded anywhere via iframe
- **Responsive**: Optimized for various screen sizes
- **Multi-Assistant Support**: Configure different assistants for different use cases
- **Self-Contained**: Uses Tailwind CSS via CDN, no build process required
- **Backend Ready**: Includes integration points for OpenAI Assistant API
- **Database Ready**: Optional database integration for conversation history
- **Error Handling**: Graceful error handling and loading states
- **New Chat**: Start fresh conversations with thread management

## 📁 Project Structure

```
├── chat-widget.html          # Base embeddable chat widget template
├── widgets/                  # Pre-configured widget variants
│   ├── customer-support.html    # Customer support assistant
│   ├── sales-assistant.html     # Sales assistant
│   └── internal-hr.html         # Internal HR assistant
├── src/
│   ├── App.tsx              # Demo page showing the widget
│   ├── main.tsx             # React app entry point
│   └── index.css            # Tailwind CSS imports
├── index.html               # Demo page HTML template
└── README.md                # This file
```

## 🛠️ Local Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   git clone <your-repo-url>
   cd chat-widget
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Demo page: `http://localhost:5173`
   - Chat widget directly: `http://localhost:5173/chat-widget.html`
   - Specific assistants: `http://localhost:5173/widgets/customer-support.html`

## 🤖 Multi-Assistant Configuration

### Architecture Overview

For multiple assistants, you have several approaches:

#### Option 1: Separate Widget Files (Recommended for Different Branding)
Create separate HTML files for each assistant with different configurations:

```
widgets/
├── customer-support.html    # External customer support (Assistant ID: asst_xxx1)
├── sales-assistant.html     # Sales team assistant (Assistant ID: asst_xxx2)
├── internal-hr.html         # Internal HR assistant (Assistant ID: asst_xxx3)
└── technical-support.html   # Technical support (Assistant ID: asst_xxx4)
```

#### Option 2: Dynamic Assistant Selection (Recommended for Same Branding)
Use URL parameters or configuration to select the assistant dynamically:

```html
<!-- Embed with assistant parameter -->
<iframe src="https://your-domain.com/chat-widget.html?assistant=customer-support"></iframe>
<iframe src="https://your-domain.com/chat-widget.html?assistant=sales"></iframe>
<iframe src="https://your-domain.com/chat-widget.html?assistant=hr"></iframe>
```

#### Option 3: Backend-Determined Assistant
Let the backend determine which assistant to use based on:
- Domain/referrer
- User authentication
- Page context
- Time of day
- User preferences

### Implementation Examples

#### Backend Configuration for Multiple Assistants

```javascript
// Assistant configuration
const ASSISTANTS = {
  'customer-support': {
    id: 'asst_customer_support_123',
    name: 'Customer Support',
    welcomeMessage: '👋 Hello! How can I help you today?',
    color: '#dc2626', // red-600
    allowedDomains: ['yourcompany.com', 'support.yourcompany.com']
  },
  'sales': {
    id: 'asst_sales_456',
    name: 'Sales Assistant',
    welcomeMessage: '💼 Hi! Ready to learn about our products?',
    color: '#059669', // emerald-600
    allowedDomains: ['yourcompany.com', 'sales.yourcompany.com']
  },
  'hr-internal': {
    id: 'asst_hr_789',
    name: 'HR Assistant',
    welcomeMessage: '🏢 Hello team member! How can I assist you?',
    color: '#7c3aed', // violet-600
    allowedDomains: ['internal.yourcompany.com'],
    requiresAuth: true
  },
  'technical-support': {
    id: 'asst_tech_101',
    name: 'Technical Support',
    welcomeMessage: '🔧 Technical support here! What issue can I help resolve?',
    color: '#ea580c', // orange-600
    allowedDomains: ['support.yourcompany.com', 'docs.yourcompany.com']
  }
};

// Updated backend endpoints
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
    
    // Check authentication if required
    if (assistant.requiresAuth && !req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        success: false
      });
    }
    
    const thread = await openai.beta.threads.create();
    
    // Store thread with assistant info in database
    await db.query(
      'INSERT INTO conversations (thread_id, assistant_type, assistant_id, domain) VALUES ($1, $2, $3, $4)',
      [thread.id, assistantType, assistant.id, domain]
    );
    
    res.json({
      threadId: thread.id,
      assistantConfig: {
        name: assistant.name,
        welcomeMessage: assistant.welcomeMessage,
        color: assistant.color
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

app.post('/api/sendMessage', async (req, res) => {
  try {
    const { threadId, message } = req.body;
    
    // Get conversation info from database
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
    
    // Add message to thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });

    // Run the specific assistant
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistant_id,
    });

    // Wait for completion and get response...
    // (same as before)
    
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      error: 'Failed to send message',
      success: false
    });
  }
});
```

### Database Schema for Multiple Assistants

```sql
-- Updated conversations table
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

-- Messages table (unchanged)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assistant configurations table (optional)
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

-- Insert sample configurations
INSERT INTO assistant_configs (assistant_type, assistant_id, name, welcome_message, color, allowed_domains, requires_auth) VALUES
('customer-support', 'asst_customer_support_123', 'Customer Support', '👋 Hello! How can I help you today?', '#dc2626', ARRAY['yourcompany.com', 'support.yourcompany.com'], FALSE),
('sales', 'asst_sales_456', 'Sales Assistant', '💼 Hi! Ready to learn about our products?', '#059669', ARRAY['yourcompany.com', 'sales.yourcompany.com'], FALSE),
('hr-internal', 'asst_hr_789', 'HR Assistant', '🏢 Hello team member! How can I assist you?', '#7c3aed', ARRAY['internal.yourcompany.com'], TRUE),
('technical-support', 'asst_tech_101', 'Technical Support', '🔧 Technical support here! What issue can I help resolve?', '#ea580c', ARRAY['support.yourcompany.com', 'docs.yourcompany.com'], FALSE);

-- Indexes
CREATE INDEX idx_conversations_thread_id ON conversations(thread_id);
CREATE INDEX idx_conversations_assistant_type ON conversations(assistant_type);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_assistant_configs_type ON assistant_configs(assistant_type);
```

### Frontend Implementation for Dynamic Assistant Selection

Update the JavaScript in your chat widget:

```javascript
// Add to chat-widget.html
class ChatWidget {
    constructor() {
        // Get assistant type from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        this.assistantType = urlParams.get('assistant') || 'customer-support';
        this.domain = window.location.hostname;
        
        // ... rest of constructor
    }
    
    async startNewChat() {
        try {
            this.isLoading = true;
            this.updateButtonStates();

            const response = await fetch(`${API_BASE_URL}/api/newThread`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assistantType: this.assistantType,
                    domain: this.domain
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.threadId = data.threadId;
                
                // Apply assistant-specific configuration
                if (data.assistantConfig) {
                    this.applyAssistantConfig(data.assistantConfig);
                }
                
                // Update welcome message
                this.chatContainer.innerHTML = `
                    <div class="flex justify-start message-appear">
                        <div class="max-w-xs px-4 py-3 rounded-2xl bg-white shadow-sm border border-gray-200">
                            <p class="text-sm text-gray-700">${data.assistantConfig.welcomeMessage}</p>
                        </div>
                    </div>
                `;
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error starting new chat:', error);
            this.addErrorMessage('Failed to start new conversation. Please try again.');
        } finally {
            this.isLoading = false;
            this.updateButtonStates();
        }
    }
    
    applyAssistantConfig(config) {
        // Update header title
        const headerTitle = document.querySelector('.bg-red-600 h1');
        if (headerTitle) {
            headerTitle.textContent = config.name;
        }
        
        // Update colors dynamically
        const style = document.createElement('style');
        style.textContent = `
            .bg-red-600 { background-color: ${config.color} !important; }
            .hover\\:bg-red-700:hover { background-color: ${this.darkenColor(config.color)} !important; }
            .bg-red-700 { background-color: ${this.darkenColor(config.color)} !important; }
            .hover\\:bg-red-800:hover { background-color: ${this.darkenColor(config.color, 0.2)} !important; }
        `;
        document.head.appendChild(style);
    }
    
    darkenColor(color, amount = 0.1) {
        // Simple color darkening function
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - Math.round(255 * amount));
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - Math.round(255 * amount));
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - Math.round(255 * amount));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
}
```

### Embedding Examples for Different Assistants

```html
<!-- Customer Support Widget -->
<iframe 
    src="https://your-domain.com/chat-widget.html?assistant=customer-support" 
    width="100%" 
    height="100%" 
    style="border:none; position:fixed; top:0; left:0; z-index:9999; pointer-events:none;"
    title="Customer Support Chat">
</iframe>

<!-- Sales Assistant Widget -->
<iframe 
    src="https://your-domain.com/chat-widget.html?assistant=sales" 
    width="100%" 
    height="100%" 
    style="border:none; position:fixed; top:0; left:0; z-index:9999; pointer-events:none;"
    title="Sales Chat">
</iframe>

<!-- Internal HR Widget (requires authentication) -->
<iframe 
    src="https://internal.yourcompany.com/chat-widget.html?assistant=hr-internal" 
    width="100%" 
    height="100%" 
    style="border:none; position:fixed; top:0; left:0; z-index:9999; pointer-events:none;"
    title="HR Chat">
</iframe>
```

### Environment Variables for Multiple Assistants

```env
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Assistant IDs
ASSISTANT_CUSTOMER_SUPPORT=asst_customer_support_123
ASSISTANT_SALES=asst_sales_456
ASSISTANT_HR_INTERNAL=asst_hr_789
ASSISTANT_TECHNICAL_SUPPORT=asst_tech_101

# Database
DATABASE_URL=your-database-url-here

# Security
JWT_SECRET=your-jwt-secret-for-internal-auth
ALLOWED_DOMAINS=yourcompany.com,support.yourcompany.com,sales.yourcompany.com
```

### Deployment Strategy

1. **Single Deployment**: Deploy one chat widget that handles multiple assistants dynamically
2. **Multiple Deployments**: Deploy separate widgets for different use cases
3. **Hybrid Approach**: Main widget + specialized versions for specific needs

Choose based on your requirements:
- **Single**: Easier maintenance, shared codebase
- **Multiple**: Better isolation, custom branding per assistant
- **Hybrid**: Best of both worlds


## 🌐 Deployment

### Option 1: Static File Hosting

1. **Build the project** (optional, for the demo page)
   ```bash
   npm run build
   ```

2. **Deploy the `chat-widget.html` file** to any static file hosting service:
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3
   - Any web server

3. **The widget will be accessible at:**
   ```
   https://your-domain.com/chat-widget.html
   ```

### Option 2: With Backend Integration

If you're setting up backend integration, deploy both the frontend and your backend API endpoints.

## 📋 Backend Integration

### Required API Endpoints

Create these endpoints in your backend:

#### 1. Create New Thread
```
POST /api/newThread
```

**Response:**
```json
{
  "threadId": "thread_abc123",
  "success": true
}
```

#### 2. Send Message
```
POST /api/sendMessage
```

**Request Body:**
```json
{
  "threadId": "thread_abc123",
  "message": "Hello, how can you help me?"
}
```

**Response:**
```json
{
  "response": "Hello! I'm here to help you with any questions you have.",
  "success": true
}
```

### Backend Implementation Examples

#### Node.js/Express Example

```javascript
const express = require('express');
const OpenAI = require('openai');
const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ASSISTANT_ID = 'your-assistant-id-here';

app.use(express.json());
app.use(cors()); // Configure CORS as needed

// Create new thread
app.post('/api/newThread', async (req, res) => {
  try {
    const thread = await openai.beta.threads.create();
    res.json({
      threadId: thread.id,
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

// Send message
app.post('/api/sendMessage', async (req, res) => {
  try {
    const { threadId, message } = req.body;

    // Add message to thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_ID,
    });

    // Wait for completion
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    }

    // Get the assistant's response
    const messages = await openai.beta.threads.messages.list(threadId);
    const assistantMessage = messages.data[0];

    res.json({
      response: assistantMessage.content[0].text.value,
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

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

#### Python/Flask Example

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
import time

app = Flask(__name__)
CORS(app)  # Configure CORS as needed

openai.api_key = os.getenv('OPENAI_API_KEY')
ASSISTANT_ID = 'your-assistant-id-here'

@app.route('/api/newThread', methods=['POST'])
def new_thread():
    try:
        thread = openai.beta.threads.create()
        return jsonify({
            'threadId': thread.id,
            'success': True
        })
    except Exception as e:
        print(f'Error creating thread: {e}')
        return jsonify({
            'error': 'Failed to create thread',
            'success': False
        }), 500

@app.route('/api/sendMessage', methods=['POST'])
def send_message():
    try:
        data = request.json
        thread_id = data['threadId']
        message = data['message']

        # Add message to thread
        openai.beta.threads.messages.create(
            thread_id=thread_id,
            role='user',
            content=message
        )

        # Run the assistant
        run = openai.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=ASSISTANT_ID
        )

        # Wait for completion
        while True:
            run_status = openai.beta.threads.runs.retrieve(
                thread_id=thread_id,
                run_id=run.id
            )
            if run_status.status == 'completed':
                break
            time.sleep(1)

        # Get the assistant's response
        messages = openai.beta.threads.messages.list(thread_id=thread_id)
        assistant_message = messages.data[0]

        return jsonify({
            'response': assistant_message.content[0].text.value,
            'success': True
        })
    except Exception as e:
        print(f'Error sending message: {e}')
        return jsonify({
            'error': 'Failed to send message',
            'success': False
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)
```

### Environment Variables

Create a `.env` file in your backend project:

```env
OPENAI_API_KEY=your-openai-api-key-here
ASSISTANT_ID=your-assistant-id-here
DATABASE_URL=your-database-url-here  # Optional, for database integration
```

## 🗄️ Database Integration (Optional)

If you want to store conversation history, add these database tables:

### Database Schema

```sql
-- Conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id VARCHAR(255) UNIQUE NOT NULL,
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

-- Indexes for better performance
CREATE INDEX idx_conversations_thread_id ON conversations(thread_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

### Database Integration Example

Add to your backend endpoints:

```javascript
// After creating a new thread
app.post('/api/newThread', async (req, res) => {
  try {
    const thread = await openai.beta.threads.create();
    
    // Store in database
    await db.query(
      'INSERT INTO conversations (thread_id) VALUES ($1)',
      [thread.id]
    );
    
    res.json({
      threadId: thread.id,
      success: true
    });
  } catch (error) {
    // Handle error
  }
});

// After sending/receiving messages
app.post('/api/sendMessage', async (req, res) => {
  try {
    const { threadId, message } = req.body;
    
    // Get conversation ID
    const conversation = await db.query(
      'SELECT id FROM conversations WHERE thread_id = $1',
      [threadId]
    );
    const conversationId = conversation.rows[0].id;
    
    // Store user message
    await db.query(
      'INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)',
      [conversationId, 'user', message]
    );
    
    // ... OpenAI API calls ...
    
    // Store assistant response
    await db.query(
      'INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3)',
      [conversationId, 'assistant', assistantResponse]
    );
    
    res.json({
      response: assistantResponse,
      success: true
    });
  } catch (error) {
    // Handle error
  }
});
```

## 🔧 Widget Configuration

### Updating API Endpoints

In `chat-widget.html`, update the API endpoints to match your backend:

```javascript
// Find these lines in chat-widget.html and update the URLs
const newThreadResponse = await fetch('/api/newThread', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
});

const messageResponse = await fetch('/api/sendMessage', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    threadId: this.threadId,
    message: message
  }),
});
```

### Customizing Appearance

You can customize the widget's appearance by modifying the CSS in `chat-widget.html`:

- **Colors**: Change `bg-red-600`, `hover:bg-red-700`, etc.
- **Size**: Modify `w-80 h-96` for widget dimensions
- **Position**: Adjust `bottom-6 right-6` for bubble position
- **Animations**: Modify the CSS animations in the `<style>` section

## 📱 Embedding the Widget

### Basic Embedding

Add this iframe to any website:

```html
<iframe 
  src="https://your-domain.com/chat-widget.html" 
  width="100%" 
  height="100%" 
  style="border:none; position:fixed; top:0; left:0; z-index:9999; pointer-events:none;"
  title="Chat Widget">
</iframe>
```

### Positioned Embedding

For specific positioning:

```html
<div style="position:fixed; bottom:0; right:0; width:400px; height:500px; z-index:9999;">
  <iframe 
    src="https://your-domain.com/chat-widget.html" 
    width="100%" 
    height="100%" 
    style="border:none;"
    title="Chat Widget">
  </iframe>
</div>
```

### WordPress Integration

Add this to your WordPress theme's `footer.php` or use a plugin to add custom HTML:

```html
<iframe 
  src="https://your-domain.com/chat-widget.html" 
  width="100%" 
  height="100%" 
  style="border:none; position:fixed; top:0; left:0; z-index:9999; pointer-events:none;"
  title="Chat Widget">
</iframe>
```

## 🔒 Security Considerations

1. **API Keys**: Never expose OpenAI API keys in frontend code
2. **CORS**: Configure CORS properly for your domain
3. **Rate Limiting**: Implement rate limiting on your API endpoints
4. **Input Validation**: Validate and sanitize user inputs
5. **Authentication**: Consider adding user authentication if needed

## 🐛 Troubleshooting

### Common Issues

1. **Widget not loading**: Check if the iframe src URL is correct
2. **CORS errors**: Ensure your backend has proper CORS configuration
3. **API errors**: Check your OpenAI API key and assistant ID
4. **Database errors**: Verify database connection and schema

### Testing Locally

1. Open `http://localhost:5173/chat-widget.html` directly
2. Check browser console for JavaScript errors
3. Verify network requests in browser dev tools
4. Test API endpoints with tools like Postman

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the browser console for errors
3. Verify your backend API endpoints are working
4. Check that your OpenAI Assistant is properly configured