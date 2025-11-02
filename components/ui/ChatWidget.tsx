import React, { useState, useEffect, useRef } from 'react';
import { ChatBubbleIcon, XIcon } from '../icons/Icons';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Đóng chat box khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Chat Box */}
      {isOpen && (
        <div
          ref={chatBoxRef}
          className="absolute bottom-20 left-0 w-80 h-96 bg-surface border border-surface2 rounded-2xl shadow-2xl overflow-hidden animate-slideUp"
          style={{
            animation: 'slideUp 0.3s ease-out',
          }}
        >
          {/* Header */}
          <div className="bg-gradient-g1 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <h3 className="text-white font-semibold">Test Studio AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-64 p-4 overflow-y-auto flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <div className="bg-surface2 rounded-lg p-3 max-w-[80%]">
                <p className="text-sm text-primary">
                  Chào bạn! 👋 Tôi là AI Assistant của Test Studio AI. Bạn cần hỗ trợ gì không?
                </p>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-surface border-t border-surface2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-surface2 border border-surface2 rounded-lg px-4 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent-violet focus:border-transparent"
              />
              <button className="bg-gradient-g1 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 bg-gradient-g1 rounded-full shadow-lg shadow-accent-violet/30 flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
        style={{
          animation: 'float 3s ease-in-out infinite',
        }}
      >
        {/* Pulse ring animation */}
        <div 
          className="absolute inset-0 bg-gradient-g1 rounded-full opacity-30"
          style={{
            animation: 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        ></div>
        
        {/* Icon */}
        <div className="relative z-10 transform transition-transform duration-300 hover:rotate-12">
          {!isOpen ? (
            <ChatBubbleIcon className="w-6 h-6" />
          ) : (
            <XIcon className="w-6 h-6" />
          )}
        </div>

        {/* Notification dot */}
        <div 
          className="absolute top-0 right-0 w-4 h-4 bg-status-danger rounded-full border-2 border-surface"
          style={{
            animation: 'bounce 1s infinite',
          }}
        ></div>
      </button>
    </div>
  );
};

export default ChatWidget;

