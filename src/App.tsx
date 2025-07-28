import React from 'react';
import { MessageCircle, ExternalLink, Code, Globe, Eye, X } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 py-12 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <MessageCircle className="w-16 h-16 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Embeddable Chat Widget
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A modern, red-themed chat widget ready for embedding on any website
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Eye className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Live Preview</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Here's the actual chat widget embedded and ready to use:
            </p>
            <div className="flex justify-center">
              <iframe 
                src="/chat-widget.html" 
                width="400" 
                height="600" 
                style={{
                  border: 'none',
                  background: 'transparent'
                }}
                title="Chat Widget"
                className="bg-transparent"
              />
            </div>
            <div className="mt-4 text-center">
              <a
                href="/chat-widget.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 text-red-600 hover:text-red-700 font-medium text-sm transition-colors duration-200"
              >
                Open in new tab
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Code className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Embed Code</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Use this iframe code to embed the widget on any website:
            </p>
            <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <code className="text-gray-800">
                {`<iframe 
  src="https://your-domain.com/chat-widget.html" 
  width="350" 
  height="500" 
  style="border:none; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"
  title="Chat Widget">
</iframe>`}
              </code>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Globe className="w-6 h-6 text-red-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Backend Integration</h2>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> The chat widget above is for demonstration purposes. To make it fully functional, 
              you'll need to implement the backend endpoints as described in the chat-widget.html file comments.
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Modern Design</h3>
                <p className="text-sm text-gray-600">Red-themed with rounded edges and smooth animations</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Responsive</h3>
                <p className="text-sm text-gray-600">Optimized for 350×500px iframe embedding</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Self-Contained</h3>
                <p className="text-sm text-gray-600">Single HTML file with Tailwind CSS via CDN</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Backend Ready</h3>
                <p className="text-sm text-gray-600">Includes integration instructions for OpenAI Assistant</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">New Chat</h3>
                <p className="text-sm text-gray-600">Start fresh conversations with thread management</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Error Handling</h3>
                <p className="text-sm text-gray-600">Graceful error handling and loading states</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;