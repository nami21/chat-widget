import React from 'react';
import { useState } from 'react';
import { MessageCircle, ExternalLink, Code, Globe, Eye, Users, Building, HeadphonesIcon, Wrench } from 'lucide-react';

function App() {
  const [selectedWidget, setSelectedWidget] = useState('customer-support');
  
  const widgetConfigs = {
    'customer-support': {
      name: 'Customer Support',
      description: 'General customer help and support',
      icon: HeadphonesIcon,
      color: 'red',
      path: '/widgets/customer-support.html'
    },
    /*
    'sales-assistant': {
      name: 'Sales Assistant', 
      description: 'Product info and sales support',
      icon: Users,
      color: 'green',
      path: '/widgets/sales-assistant.html'
    },
    */
    'internal-support': {
      name: 'Internal Support',
      description: 'Employee support', 
      icon: Building,
      color: 'purple',
      path: '/widgets/internal-support.html'
    },
    'helpdesk-support': {
      name: 'Helpdesk Support',
      description: 'Technical issues and troubleshooting',
      icon: Wrench, 
      color: 'orange',
      path: '/widgets/helpdesk-support.html'
    }
  };
  
  const currentWidget = widgetConfigs[selectedWidget];
  
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
          {/* Embedding Code */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Code className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Embed Code</h2>
            </div>
            
            <div className="mb-6">
              <label htmlFor="widgetSelect" className="block text-sm font-medium text-gray-700 mb-2">
                Select Widget:
              </label>
              <select
                id="widgetSelect"
                value={selectedWidget}
                onChange={(e) => setSelectedWidget(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {Object.entries(widgetConfigs).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Direct Embed</h4>
                <div className="bg-gray-100 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                  <code className="text-gray-800">
                    {`<iframe 
                      src="https://your-domain.com${currentWidget.path}" 
                      width="350" height="500" 
                      style="border:none; border-radius: 8px;"
                      title="${currentWidget.name}">
                    </iframe>`}
                  </code>
                </div>
              </div>
              
              {selectedWidget !== 'dynamic' && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Dynamic Version</h4>
                  <div className="bg-gray-100 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                    <code className="text-gray-800">
                      {`<iframe 
                        src="https://your-domain.com/chat-widget.html?assistant=${selectedWidget}" 
                        width="350" height="500" 
                        style="border:none; border-radius: 8px;"
                        title="${currentWidget.name}">
                      </iframe>`}
                    </code>
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Full Page Overlay</h4>
                <div className="bg-gray-100 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                  <code className="text-gray-800">
                    {`<iframe 
                      src="https://your-domain.com${currentWidget.path}" 
                      width="100%" height="100%" 
                      style="border:none; position:fixed; top:0; left:0; 
                            z-index:9999; pointer-events:none;"
                      title="${currentWidget.name}">
                    </iframe>`}
                  </code>
                </div>
              </div>
            </div>
          </div>
          
           {/* Live Preview */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              <currentWidget.icon className={`w-6 h-6 mr-3 ${
                currentWidget.color === 'red' ? 'text-red-600' :
                currentWidget.color === 'green' ? 'text-green-600' :
                currentWidget.color === 'purple' ? 'text-purple-600' :
                currentWidget.color === 'orange' ? 'text-orange-600' :
                'text-blue-600'
              }`} />
              <h2 className="text-2xl font-semibold text-gray-900">Live Preview</h2>
            </div>
            
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
              <iframe
                key={selectedWidget}
                src={currentWidget.path}
                className="w-full h-full border-0"
                title={`${currentWidget.name} Preview`}
                style={{ 
                  transform: 'scale(0.8)',
                  transformOrigin: 'top left',
                  width: '125%',
                  height: '125%'
                }}
              />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">External Preview</h4>
              <a
                href={currentWidget.path}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center text-sm hover:opacity-80 ${
                  currentWidget.color === 'red' ? 'text-red-600' :
                  currentWidget.color === 'green' ? 'text-green-600' :
                  currentWidget.color === 'purple' ? 'text-purple-600' :
                  currentWidget.color === 'orange' ? 'text-orange-600' :
                  'text-blue-600'
                }`}
              >
                Open {currentWidget.name} <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Assistant Configuration */}
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
                  {/* <th className="text-left py-3 px-4 font-medium text-gray-900">Theme</th> */}
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Access</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">URL Parameter</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">Customer Support</td>
                  <td className="py-3 px-4">General customer help</td>
                  <td className="py-3 px-4">Public</td>
                  <td className="py-3 px-4 font-mono text-xs">?assistant=customer-support</td>
                </tr>
                {/*
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">Sales Assistant</td>
                  <td className="py-3 px-4">Product info & sales</td>
                  <td className="py-3 px-4">Public</td>
                  <td className="py-3 px-4 font-mono text-xs">?assistant=sales</td>
                </tr>
                */}
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">Internal</td>
                  <td className="py-3 px-4">Employee support</td>
                  <td className="py-3 px-4">Internal Only</td>
                  <td className="py-3 px-4 font-mono text-xs">?assistant=internal-support</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">IT Support</td>
                  <td className="py-3 px-4">Helpdesk Support</td>
                  <td className="py-3 px-4">Itnernal</td>
                  <td className="py-3 px-4 font-mono text-xs">?assistant=helpdesk-support</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Remaining sections (e.g., Backend Integration, System Features) remain unchanged */}
      </div>
    </div>
  );
}

export default App;
