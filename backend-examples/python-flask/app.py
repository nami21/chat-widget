from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
import time
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(','))

# Initialize OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

# Assistant configurations
ASSISTANTS = {
    'customer-support': {
        'id': os.getenv('ASSISTANT_CUSTOMER_SUPPORT', 'asst_customer_support_123'),
        'name': 'Customer Support',
        'welcomeMessage': '👋 Hello! I\'m here to help with any questions or issues you have. How can I assist you today?',
        'color': '#dc2626',  # red-600
        'allowedDomains': ['localhost', 'yourcompany.com', 'support.yourcompany.com'],
        'placeholder': 'Type your message...'
    },
    'sales': {
        'id': os.getenv('ASSISTANT_SALES', 'asst_sales_456'),
        'name': 'Sales Assistant',
        'welcomeMessage': '💼 Hi there! I\'m here to help you learn about our products and find the perfect solution for your needs. What can I help you with today?',
        'color': '#059669',  # green-600
        'allowedDomains': ['localhost', 'yourcompany.com', 'sales.yourcompany.com'],
        'placeholder': 'Ask about our products...'
    },
    'hr-internal': {
        'id': os.getenv('ASSISTANT_HR_INTERNAL', 'asst_hr_789'),
        'name': 'HR Assistant',
        'welcomeMessage': '🏢 Hello team member! I\'m here to help with HR-related questions, policies, benefits, and workplace support. How can I assist you today?',
        'color': '#7c3aed',  # purple-600
        'allowedDomains': ['localhost', 'internal.yourcompany.com'],
        'requiresAuth': True,
        'placeholder': 'Ask about HR policies, benefits...'
    },
    'technical-support': {
        'id': os.getenv('ASSISTANT_TECHNICAL_SUPPORT', 'asst_tech_101'),
        'name': 'Technical Support',
        'welcomeMessage': '🔧 Technical support here! I\'m ready to help you troubleshoot issues, resolve technical problems, and provide solutions. What technical issue can I help you with?',
        'color': '#ea580c',  # orange-600
        'allowedDomains': ['localhost', 'support.yourcompany.com', 'docs.yourcompany.com'],
        'placeholder': 'Describe your technical issue...'
    }
}

# Optional: Database connection
def get_db_connection():
    if os.getenv('DATABASE_URL'):
        return psycopg2.connect(
            os.getenv('DATABASE_URL'),
            cursor_factory=RealDictCursor
        )
    return None

@app.route('/api/newThread', methods=['POST'])
def new_thread():
    try:
        data = request.json
        assistant_type = data.get('assistantType')
        domain = data.get('domain')
        
        assistant = ASSISTANTS.get(assistant_type)
        if not assistant:
            return jsonify({
                'error': 'Invalid assistant type',
                'success': False
            }), 400
        
        # Check domain restrictions
        if assistant.get('allowedDomains') and domain not in assistant['allowedDomains']:
            return jsonify({
                'error': 'Access denied for this domain',
                'success': False
            }), 403
        
        # Check authentication if required (implement your auth logic here)
        if assistant.get('requiresAuth') and not request.headers.get('Authorization'):
            return jsonify({
                'error': 'Authentication required',
                'success': False
            }), 401
        
        # Create OpenAI thread
        thread = openai.beta.threads.create()
        
        # Optional: Store thread in database
        """
        conn = get_db_connection()
        if conn:
            with conn.cursor() as cur:
                cur.execute(
                    'INSERT INTO conversations (thread_id, assistant_type, assistant_id, domain) VALUES (%s, %s, %s, %s)',
                    (thread.id, assistant_type, assistant['id'], domain)
                )
            conn.commit()
            conn.close()
        """
        
        return jsonify({
            'threadId': thread.id,
            'assistantConfig': {
                'name': assistant['name'],
                'welcomeMessage': assistant['welcomeMessage'],
                'color': assistant['color'],
                'placeholder': assistant['placeholder']
            },
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
        thread_id = data.get('threadId')
        message = data.get('message')
        
        if not thread_id or not message:
            return jsonify({
                'error': 'Missing threadId or message',
                'success': False
            }), 400
        
        # Optional: Get conversation info from database to determine assistant
        """
        conn = get_db_connection()
        assistant_id = None
        if conn:
            with conn.cursor() as cur:
                cur.execute(
                    'SELECT assistant_type, assistant_id FROM conversations WHERE thread_id = %s',
                    (thread_id,)
                )
                result = cur.fetchone()
                if result:
                    assistant_id = result['assistant_id']
            conn.close()
        """
        
        # For demo purposes, use customer-support assistant
        # In production, get this from database or thread metadata
        assistant_id = ASSISTANTS['customer-support']['id']
        
        # Add message to thread
        openai.beta.threads.messages.create(
            thread_id=thread_id,
            role='user',
            content=message
        )

        # Optional: Store user message in database
        """
        conn = get_db_connection()
        if conn:
            with conn.cursor() as cur:
                cur.execute(
                    'INSERT INTO messages (conversation_id, role, content) VALUES ((SELECT id FROM conversations WHERE thread_id = %s), %s, %s)',
                    (thread_id, 'user', message)
                )
            conn.commit()
            conn.close()
        """

        # Run the assistant
        run = openai.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=assistant_id
        )

        # Wait for completion
        start_time = time.time()
        while True:
            run_status = openai.beta.threads.runs.retrieve(
                thread_id=thread_id,
                run_id=run.id
            )
            
            if run_status.status in ['completed', 'failed']:
                break
                
            # Timeout after 30 seconds
            if time.time() - start_time > 30:
                raise Exception('Assistant response timeout')
                
            time.sleep(1)

        if run_status.status == 'failed':
            raise Exception('Assistant run failed')

        # Get the assistant's response
        messages = openai.beta.threads.messages.list(thread_id=thread_id)
        assistant_message = messages.data[0]
        response_text = assistant_message.content[0].text.value

        # Optional: Store assistant response in database
        """
        conn = get_db_connection()
        if conn:
            with conn.cursor() as cur:
                cur.execute(
                    'INSERT INTO messages (conversation_id, role, content) VALUES ((SELECT id FROM conversations WHERE thread_id = %s), %s, %s)',
                    (thread_id, 'assistant', response_text)
                )
            conn.commit()
            conn.close()
        """

        return jsonify({
            'response': response_text,
            'success': True
        })
    except Exception as e:
        print(f'Error sending message: {e}')
        return jsonify({
            'error': 'Failed to send message',
            'success': False
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'timestamp': time.time(),
        'assistants': list(ASSISTANTS.keys())
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3000))
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)