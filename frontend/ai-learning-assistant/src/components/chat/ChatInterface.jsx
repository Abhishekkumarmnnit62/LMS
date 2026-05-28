import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Sparkles, ThumbsUp, ThumbsDown, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { useParams } from 'react-router-dom';
import aiService from '../../services/aiServices'; // Make sure this path is correct!
import { useAuth } from '../../context/AuthContext';
import Spinner from '../common/Spinner';

const ChatInterface = () => {
  const { id: documentId } = useParams();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setInitialLoading(true);
        const response = await aiService.getChatHistory(documentId);
        setHistory(response.data || []);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    if (documentId) {
      fetchChatHistory();
    }
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message, timestamp: new Date() };
    setHistory(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const response = await aiService.chat(documentId, userMessage.content);
      const assistantMessage = {
        role: 'assistant',
        content: response.data.answer,
        timestamp: new Date(),
        relevantChunks: response.data.relevantChunks
      };
      setHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Replaced the simple string output with clean chat layouts
  const renderMessage = (msg, index) => {
    const isUser = msg.role === 'user';

    return (
      <div key={index} className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed ${
          isUser 
            ? 'bg-emerald-600 text-white rounded-br-none' 
            : 'bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-bl-none'
        }`}>
          <div className="font-semibold text-xs mb-1 opacity-75">
            {isUser ? 'You' : 'Assistant'}
          </div>
          <p className="whitespace-pre-wrap">{msg.content}</p>
        </div>
      </div>
    );
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Spinner />
        <p className="text-sm text-neutral-500 mt-3 font-medium">Loading chat history...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[75vh] bg-white border border-neutral-200 rounded-xl relative overflow-hidden shadow-sm">
      
      {/* 1. Chat Messages View Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-neutral-400">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full mb-3">
              <MessageSquare size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-neutral-700">Start a conversation</h3>
            <p className="text-sm text-neutral-500 max-w-sm mt-1">
              Ask any follow-up questions regarding this document's structural properties or content summaries!
            </p>
          </div>
        ) : (
          history.map(renderMessage)
        )}
        
        {loading && (
          <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 max-w-[200px] shadow-sm">
            <Sparkles className="text-emerald-500 animate-spin" size={16} />
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 2. Structured Input Box & Toolbar matching your screenshot layout */}
      <div className="p-4 bg-white border-t border-neutral-200">
        <form onSubmit={handleSendMessage} className="relative flex items-center border border-emerald-400 rounded-2xl bg-white px-4 py-3 shadow-inner">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a follow-up question..."
            className="flex-1 text-sm bg-transparent outline-none pr-36 text-neutral-800 placeholder-neutral-400"
            disabled={loading}
          />
          
          {/* Action Toolbar placed inside the input box matching the exact layout */}
          <div className="absolute right-3 flex items-center gap-2 text-neutral-400 border-l border-neutral-200 pl-2">
            <button type="button" className="p-1 hover:text-neutral-600 transition-colors"><ThumbsUp size={16} /></button>
            <button type="button" className="p-1 hover:text-neutral-600 transition-colors"><ThumbsDown size={16} /></button>
            <button type="button" className="p-1 hover:text-neutral-600 transition-colors"><MessageCircle size={16} /></button>
            <button type="button" className="p-1 hover:text-neutral-600 transition-colors"><Share2 size={16} /></button>
            <button type="button" className="p-1 hover:text-neutral-600 transition-colors"><MoreHorizontal size={16} /></button>
            
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className={`p-2 rounded-xl transition-all ${
                !message.trim() || loading
                  ? 'bg-neutral-100 text-neutral-300'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default ChatInterface;