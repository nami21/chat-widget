import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, RotateCcw } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 Hello! How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Initialize with a new thread
    startNewChat();
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const startNewChat = async () => {
    try {
      setIsLoading(true);
      
      // Clear messages except welcome message
      setMessages([{
        id: '1',
        text: '👋 Hello! How can I help you today?',
        isUser: false,
        timestamp: new Date()
      }]);

      // Mock thread creation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newThreadId = 'thread_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      setThreadId(newThreadId);

    } catch (error) {
      console.error('Error starting new chat:', error);
      addErrorMessage('Failed to start new conversation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addErrorMessage = (text: string) => {
    const errorMessage: Message = {
      id: Date.now().toString(),
      text: `⚠️ ${text}`,
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, errorMessage]);
  };

  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      text: 'typing...',
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      // Mock response
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const mockResponses = [
        "Thank you for your message! I'm a demo chat assistant. In a real implementation, I would be connected to an AI backend.",
        `I understand you're asking about: '${message}'. This is a demo response - please connect a real backend for actual functionality.`,
        "That's an interesting question! This chat widget is currently running in demo mode. Please implement the backend endpoints for full functionality.",
        "I'd be happy to help with that! Note: This is a demonstration - real responses would come from your AI assistant backend."
      ];
      
      const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];

      // Remove typing indicator and add response
      setMessages(prev => {
        const withoutTyping = prev.filter(msg => msg.id !== 'typing');
        return [...withoutTyping, {
          id: Date.now().toString(),
          text: response,
          isUser: false,
          timestamp: new Date()
        }];
      });

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => {
        const withoutTyping = prev.filter(msg => msg.id !== 'typing');
        return [...withoutTyping, {
          id: Date.now().toString(),
          text: '⚠️ Sorry, I encountered an error. Please try again.',
          isUser: false,
          timestamp: new Date()
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleNewChat = () => {
    setShowConfirmModal(true);
  };

  const confirmNewChat = () => {
    setShowConfirmModal(false);
    startNewChat();
  };

  const cancelNewChat = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      {/* Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300"
          aria-label="Toggle chat"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40">
          <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            {/* Confirmation Modal */}
            {showConfirmModal && (
              <div className="absolute bottom-0 left-0 right-0 z-10">
                <div className="bg-white border-t border-gray-200 p-4 rounded-b-2xl shadow-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-3 text-center">
                    Start New Conversation?
                  </h3>
                  <div className="flex space-x-3 justify-center">
                    <button 
                      onClick={confirmNewChat}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                      Yes
                    </button>
                    <button 
                      onClick={cancelNewChat}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="bg-red-600 text-white px-4 py-3 rounded-t-2xl flex justify-between items-center">
              <h1 className="text-lg font-semibold">Chat with Us</h1>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleNewChat}
                  disabled={isLoading}
                  className="w-8 h-8 bg-red-700 hover:bg-red-800 disabled:opacity-50 transition-colors duration-200 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-300"
                  title="Start New Conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button 
                  onClick={toggleChat}
                  className="w-8 h-8 bg-red-700 hover:bg-red-800 transition-colors duration-200 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-300"
                  title="Close Chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-200`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-2xl shadow-sm ${
                      message.isUser
                        ? 'bg-red-600 text-white'
                        : message.text.startsWith('⚠️')
                        ? 'bg-red-50 border border-red-200 text-red-600'
                        : message.id === 'typing'
                        ? 'bg-white border border-gray-200 text-gray-700'
                        : 'bg-white border border-gray-200 text-gray-700'
                    }`}
                  >
                    {message.id === 'typing' ? (
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    ) : (
                      <p className="text-sm">{message.text}</p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
              <div className="flex space-x-3 items-center">
                <input 
                  ref={inputRef}
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..." 
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm bg-gray-50 disabled:opacity-50"
                  maxLength={500}
                />
                <button 
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="w-10 h-10 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M3 10l9 4 9-4-9-4-9 4zm0 0v6a2 2 0 002 2h14a2 2 0 002-2v-6"
  />
</svg>

                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;