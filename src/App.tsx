import React from 'react';
import { MessageCircle, ExternalLink, Code, Globe, Eye, Users, Building, HeadphonesIcon, Wrench } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 py-12 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <MessageCircle className="w-16 h-16 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Multi-Assistant Chat Widget System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A flexible chat widget system supporting multiple AI assistants for different use cases
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Eye className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Widget Variants</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Choose from different pre-configured assistant widgets:
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <HeadphonesIcon className="w-5 h-5 text-red-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Customer Support</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">General customer help and support</p>
                <a
                  href="/widgets/customer-support.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-red-600 hover:text-red-700"
                >
                  Preview <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Sales Assistant</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Product info and sales support</p>
                <a
                  href="/widgets/sales-assistant.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-green-600 hover:text-green-700"
                >
                  Preview <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <Building className="w-5 h-5 text-purple-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Internal HR</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Employee support and HR queries</p>
                <a
                  href="/widgets/internal-hr.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700"
                >
                  Preview <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <Wrench className="w-5 h-5 text-orange-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Technical Support</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Technical issues and troubleshooting</p>
                <a
                  href="/widgets/technical-support.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-orange-600 hover:text-orange-700"
                >
                  Preview <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Dynamic Widget</h4>
              <p className="text-sm text-gray-600 mb-3">Single widget that adapts based on URL parameters</p>
              <a
                href="/chat-widget.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                Preview Base Widget <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Code className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Embedding Examples</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Different ways to embed the widgets:
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Specific Assistant</h4>
                <div className="bg-gray-100 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                  <code className="text-gray-800">
                    {`<iframe 
  src="https://your-domain.com/widgets/customer-support.html" 
  width="350" height="500" 
  style="border:none; border-radius: 8px;"
  title="Customer Support">
</iframe>`}
                  </code>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Dynamic Assistant</h4>
                <div className="bg-gray-100 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                  <code className="text-gray-800">
                    {`<iframe 
  src="https://your-domain.com/chat-widget.html?assistant=sales" 
  width="350" height="500" 
  style="border:none; border-radius: 8px;"
  title="Sales Assistant">
</iframe>`}
                  </code>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Full Page Overlay</h4>
                <div className="bg-gray-100 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                  <code className="text-gray-800">
                    {`<iframe 
  src="https://your-domain.com/chat-widget.html" 
  width="100%" height="100%" 
  style="border:none; position:fixed; top:0; left:0; 
         z-index:9999; pointer-events:none;"
  title="Chat Widget">
</iframe>`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Globe className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Assistant Configuration</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Assistant</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Use Case</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Theme</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Access</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">URL Parameter</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">Customer Support</td>
                  <td className="py-3 px-4">General customer help</td>
                  <td className="py-3 px-4"><span className="inline-block w-4 h-4 bg-red-600 rounded-full mr-2"></span>Red</td>
                  <td className="py-3 px-4">Public</td>
                  <td className="py-3 px-4 font-mono text-xs">?assistant=customer-support</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">Sales Assistant</td>
                  <td className="py-3 px-4">Product info & sales</td>
                  <td className="py-3 px-4"><span className="inline-block w-4 h-4 bg-green-600 rounded-full mr-2"></span>Green</td>
                  <td className="py-3 px-4">Public</td>
                  <td className="py-3 px-4 font-mono text-xs">?assistant=sales</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">Internal HR</td>
                  <td className="py-3 px-4">Employee support</td>
                  <td className="py-3 px-4"><span className="inline-block w-4 h-4 bg-purple-600 rounded-full mr-2"></span>Purple</td>
                  <td className="py-3 px-4">Internal Only</td>
                  <td className="py-3 px-4 font-mono text-xs">?assistant=hr-internal</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Technical Support</td>
                  <td className="py-3 px-4">Technical troubleshooting</td>
                  <td className="py-3 px-4"><span className="inline-block w-4 h-4 bg-orange-600 rounded-full mr-2"></span>Orange</td>
                  <td className="py-3 px-4">Public</td>
                  <td className="py-3 px-4 font-mono text-xs">?assistant=technical-support</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Globe className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Backend Integration</h2>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> The chat widgets above are for demonstration purposes. To make them fully functional, 
              you'll need to implement the backend endpoints and configure your OpenAI Assistant IDs as described in the README.
            </p>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Required Backend Endpoints</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">POST /api/newThread</h4>
              <p className="text-sm text-gray-600">Creates a new OpenAI Assistant thread for the conversation</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">POST /api/sendMessage</h4>
              <p className="text-sm text-gray-600">Sends user message to assistant and returns response</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">System Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Multi-Assistant Support</h3>
                <p className="text-sm text-gray-600">Configure different assistants for different use cases</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Dynamic Theming</h3>
                <p className="text-sm text-gray-600">Each assistant can have its own color scheme and branding</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Access Control</h3>
                <p className="text-sm text-gray-600">Domain restrictions and authentication support</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Database Integration</h3>
                <p className="text-sm text-gray-600">Optional conversation history and analytics storage</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Easy Embedding</h3>
                <p className="text-sm text-gray-600">Simple iframe integration for any website</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Production Ready</h3>
                <p className="text-sm text-gray-600">Comprehensive error handling and security features</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;