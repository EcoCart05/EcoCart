
import React, { useState, useRef, useEffect } from 'react';
import './EcoGuideChat.css';
import styles from './EcoGuideChat.module.css';
import './chatbot-animations.css';
import EcoGuideChatHistoryModal from './EcoGuideChatHistoryModal';
import { products, Product } from "@/data/products";
import { getOrders, Order } from "@/services/orderStorage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Send, User, X, MinimizeIcon, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { translateText } from "@/services/translate";

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  id: string;
}

const CHAT_SESSIONS_KEY = 'ecoguide_chat_sessions_v1';
const CHAT_ACTIVE_SESSION_KEY = 'ecoguide_active_session_v1';

function loadSessions(): { id: string; started: number; messages: Message[]; name?: string }[] {
  const raw = localStorage.getItem(CHAT_SESSIONS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}
function saveSessions(sessions: { id: string; started: number; messages: Message[]; name?: string }[]) {
  localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
}

const EcoGuideChat: React.FC = () => {
  // Language selection for translation
  const [selectedLang, setSelectedLang] = useState('en');
  // Voice chat state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Voice chat handler
  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    if (!recognitionRef.current) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)() as SpeechRecognition;
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          setInputMessage((prev: string) => (prev ? prev + ' ' : '') + event.results[0][0].transcript);
        }
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Maximize state for chat window
  const [isMaximized, setIsMaximized] = useState(false);
  const toggleMaximize = () => setIsMaximized((v) => !v);
  // Resizable chat window state
  const [chatWidth, setChatWidth] = useState(340);
  const [chatHeight, setChatHeight] = useState(520);
  // Drag-to-resize logic
  const handleResizeMouseDown = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (isMaximized) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = chatWidth;
    const startHeight = chatHeight;
    function onMouseMove(ev: MouseEvent) {
      setChatWidth(Math.max(320, Math.min(window.innerWidth * 0.98, startWidth + (ev.clientX - startX))));
      setChatHeight(Math.max(400, Math.min(window.innerHeight * 0.9, startHeight + (ev.clientY - startY))));
    }
    function onMouseUp() {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

    // Session state
  const [sessions, setSessions] = useState<{ id: string; started: number; messages: Message[]; name?: string }[]>(() => loadSessions());
  const [activeSessionId, setActiveSessionId] = useState(() => {
    const sid = localStorage.getItem(CHAT_ACTIVE_SESSION_KEY);
    if (sid) return sid;
    // create new session if none
    const newId = crypto.randomUUID();
    localStorage.setItem(CHAT_ACTIVE_SESSION_KEY, newId);
    return newId;
  });
  const [showHistory, setShowHistory] = useState(false);
const [newSessionName, setNewSessionName] = useState('');

  // Messages for current session
  const [messages, setMessages] = useState<Message[]>(() => {
    const found = loadSessions().find((s: { id: string; started: number; messages: Message[]; name?: string }) => s.id === activeSessionId);
    if (found) return found.messages;
    return [{
      role: 'assistant',
      content: "Hi! I'm EcoGuide, your sustainable shopping assistant. Ask me anything about eco-friendly products, finding shops, your orders, or return policies!",
      timestamp: Date.now(),
      id: crypto.randomUUID(),
    }];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Import product/order data statically for demo (replace with hooks/services for live data)
  const orders: Order[] = getOrders();

    // Save sessions and active session on change
  useEffect(() => {
    // update session in sessions
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== activeSessionId);
      updated.push({ id: activeSessionId, started: messages[0]?.timestamp || Date.now(), messages, name: newSessionName || undefined });
      saveSessions(updated);
      return updated;
    });
    localStorage.setItem(CHAT_ACTIVE_SESSION_KEY, activeSessionId);
  }, [messages, activeSessionId, newSessionName]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  function detectIntent(msg: string): { type: "order_status" | "return_policy" | "product_search" | "general"; payload?: string } {
    const lower = msg.toLowerCase();
    if (lower.includes("order status") || lower.includes("where's my order") || lower.includes("track order")) {
      return { type: "order_status" };
    }
    if (lower.includes("return") || lower.includes("refund")) {
      return { type: "return_policy" };
    }
    // Only treat as product search if the user is clearly searching for a product
    if ((/\b(find|show|search|buy|get|list)\b/.test(lower)) &&
        (/(eco|green|organic|bamboo|recycled|shoes|t-shirt|bottle|bag|coffee|toothbrush|product|item|shop|store)/.test(lower))) {
      return { type: "product_search", payload: lower };
    }
    return { type: "general" };
  }

  function handleProductSearch(query: string) {
    // Try to find products matching query
    const found = products.filter((p: Product) => query.includes(p.name.toLowerCase()) || query.split(" ").some((w: string) => p.name.toLowerCase().includes(w)));
    if (found.length > 0) {
      return `Here are some products matching your search:\n${found.map((p: Product) => `• ${p.name} (₹${p.price})`).join("\n")}`;
    }
    // Try to find by eco terms
    const ecoFound = products.filter((p: Product) => query.split(" ").some((w: string) => p.materials?.join(" ").toLowerCase().includes(w)));
    if (ecoFound.length > 0) {
      return `Eco-friendly options:\n${ecoFound.map((p: Product) => `• ${p.name} (₹${p.price})`).join("\n")}`;
    }
    return "Sorry, I couldn't find any products matching your search.";
  }

  function handleOrderStatus() {
    if (!orders.length) return "I couldn't find any recent orders for you. Please make sure you're logged in.";
    const last = orders[orders.length - 1];
    return `Your last order (${last.id}) for ₹${last.total} was placed on ${last.date}. Items: ${last.items.map((i) => i.product.name + ' x' + i.quantity).join(", ")}.`;
  }

  function handleReturnPolicy() {
    return "Our return policy: You can return any unused product within 30 days for a full refund. For more details or to start a return, visit your order history page.";
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: Date.now(),
      id: crypto.randomUUID(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);
    try {
      const intent = detectIntent(inputMessage);
      let aiText = "";
      if (intent.type === "product_search") {
        aiText = handleProductSearch(inputMessage);
      } else if (intent.type === "order_status") {
        aiText = handleOrderStatus();
      } else if (intent.type === "return_policy") {
        aiText = handleReturnPolicy();
      } else {
        aiText = await import("@/services/gemini").then(m => m.askGemini(inputMessage));
      }
      // Simulate typing delay for realism
      // Translate assistant response if needed
      const maybeTranslate = async (text: string) => {
        if (selectedLang !== 'en') {
          try {
            const translated = await translateText(text, selectedLang, 'en');
            return translated;
          } catch {
            return text + '\n(Translation failed)';
          }
        }
        return text;
      };
      maybeTranslate(aiText).then(translatedText => {
        const aiResponse: Message = {
          role: 'assistant',
          content: translatedText,
          timestamp: Date.now(),
          id: crypto.randomUUID(),
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
        setIsTyping(false);
      });
    } catch (error) {
      toast({
        title: "Couldn't get a response",
        description: "Please try again later.",
        variant: "destructive"
      });
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // Delete a single message
  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  // Clear all chat messages in this session
  const handleClearAll = () => {
    if(window.confirm('Clear all chat messages in this session?')) {
      setMessages([{
        role: 'assistant',
        content: "Hi! I'm EcoGuide, your sustainable shopping assistant. Ask me anything about eco-friendly products, finding shops, your orders, or return policies!",
        timestamp: Date.now(),
        id: crypto.randomUUID(),
      }]);
    }
  };

  // Show history modal
  const handleShowHistory = () => setShowHistory(true);
  const handleCloseHistory = () => setShowHistory(false);

  // Restore session from history
  const handleRestoreSession = (id: string) => {
    const found = sessions.find(s => s.id === id);
    if (found) {
      setActiveSessionId(id);
      setMessages(found.messages);
      setShowHistory(false);
      setNewSessionName(found.name || '');
    }
  };

  // Rename session
  const handleRenameSession = (id: string, name: string) => {
    const updated = sessions.map(s => s.id === id ? { ...s, name } : s);
    setSessions(updated);
    saveSessions(updated);
    if (id === activeSessionId) setNewSessionName(name);
  };

  // Delete session from history
  const handleDeleteSession = (id: string) => {
    if (!window.confirm('Delete this chat session?')) return;
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    saveSessions(updated);
    if (id === activeSessionId) {
      // switch to another session or create new
      if (updated.length > 0) {
        setActiveSessionId(updated[0].id);
        setMessages(updated[0].messages);
      } else {
        const newId = crypto.randomUUID();
        setActiveSessionId(newId);
        setMessages([{
          role: 'assistant',
          content: "Hi! I'm EcoGuide, your sustainable shopping assistant. Ask me anything about eco-friendly products, finding shops, your orders, or return policies!",
          timestamp: Date.now(),
          id: crypto.randomUUID(),
        }]);
      }
    }
  };


  // Download chat history as PDF (current session)
  const handleDownload = async () => {
    const jsPDF = (await import('jspdf')).jsPDF;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('EcoGuide Chat History', 10, 10);
    let y = 20;
    messages.forEach((msg, i) => {
      const role = msg.role === 'user' ? 'User' : 'Assistant';
      doc.text(`${role}: ${msg.content}`, 10, y);
      y += 10;
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });
    doc.save(`EcoGuideChat_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  // Download all chat sessions as JSON
  const handleDownloadAll = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `EcoGuideChat_AllSessions_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  };



  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat button */}
      <div className="fixed bottom-5 right-5 z-50">
        {!isOpen && (
          <Button 
            onClick={toggleChat} 
            size="lg" 
            className="rounded-full p-4 shadow-lg bg-green-500 hover:bg-green-600 chatbot-float"
          >
            <Bot className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Chat window */}
      {isOpen && (
        <div
          className={`ecoguide-chat-resizable fixed bottom-5 right-5 shadow-xl z-50 border-green-200 dark:border-green-800 flex flex-col bg-white rounded-2xl ${isMaximized ? 'ecoguide-chat-maximized' : ''} chatbot-fade-in`}
          style={isMaximized ? { width: '96vw', height: '90vh', minWidth: 0, minHeight: 0, maxWidth: '100vw', maxHeight: '100vh' } : { width: chatWidth, height: chatHeight, minWidth: '320px', minHeight: '400px', maxWidth: '98vw', maxHeight: '90vh' }}
        >
          <div className="ecoguide-chat-header flex flex-col gap-1">
  <div className="flex items-center justify-between pb-1">
    <span className="text-base font-semibold">EcoGuide Assistant</span>
  </div>
  <div className={styles.ecoguideHeaderDivider}></div>
  <div className="flex gap-3 items-center justify-end">
    {/* History Button */}
    <div className="flex flex-col items-center">
      <button
        title="Chat History"
        onClick={handleShowHistory}
        aria-label="Chat History"
        className={`${styles.ecoguideHeaderIcon} ${showHistory ? styles.active : ''} ${sessions.length > 1 ? 'animate-pulse' : ''}`}
      >
        <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M4 4v5h5M19 11A8 8 0 1 1 5 5" stroke="#166534" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      
    </div>
    {/* Download Chat */}
    <div className="flex flex-col items-center">
      <button
        title="Download chat"
        onClick={handleDownload}
        aria-label="Download chat"
        className={styles.ecoguideHeaderIcon}
      >
        <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M10 3v10m0 0l-4-4m4 4l4-4" stroke="#1e3a8a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /><rect x="3" y="15" width="14" height="2" rx="1" fill="#1e3a8a" opacity=".3" /></svg>
      </button>
      
    </div>
    {/* Delete All */}
    <div className="flex flex-col items-center">
      <button
        title="Delete all messages"
        onClick={handleClearAll}
        aria-label="Delete all messages"
        className={styles.ecoguideHeaderIcon}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#be123c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
      </button>
      
    </div>
    {/* Full Screen / Restore */}
    <div className="flex flex-col items-center">
      <button
        title={isMaximized ? "Restore chat size" : "Maximize chat"}
        onClick={toggleMaximize}
        aria-label="Maximize chat"
        className={styles.ecoguideHeaderIcon}
      >
        <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M3 8V3h5M17 12v5h-5M3 3l6.5 6.5M17 17l-6.5-6.5" stroke="#ca8a04" strokeWidth="2.2" strokeLinecap="round" /></svg>
      </button>
      
    </div>
    {/* Close Chat */}
    <div className="flex flex-col items-center">
      <button
        title="Close chat"
        onClick={() => setIsOpen(false)}
        aria-label="Close chat"
        className={styles.ecoguideHeaderIcon}
      >
        <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M6 14L14 6" stroke="#374151" strokeWidth="2.2" strokeLinecap="round" /></svg>
      </button>
      
    </div>
  </div>
</div>

          {/* History Modal Overlay */}
          {showHistory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
              <EcoGuideChatHistoryModal
                sessions={sessions}
                onRestore={handleRestoreSession}
                onDelete={handleDeleteSession}
                onRename={handleRenameSession}
                onDownloadAll={handleDownloadAll}
                onClose={handleCloseHistory}
              />
            </div>
          )}
          <div className="flex-1 h-80 overflow-y-auto py-3 px-2 flex flex-col bg-gradient-to-br from-green-50 to-blue-50 rounded-b-xl">
            {messages.map((msg) => (
              <div key={msg.id} className={`ecoguide-chat-bubble ${msg.role} flex flex-col relative`}>
                <span className="leading-relaxed">{msg.content}</span>
              </div>
            ))}
            {/* Typing indicator */}
            {isTyping && (
              <div className="ecoguide-chat-typing">
                <span className="font-bold text-green-800">EcoGuide:</span>
                <span className="ecoguide-chat-typing-dots">
                  <span></span><span></span><span></span>
                </span>
                <span className="text-green-700">typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex gap-2 pt-2 px-2 pb-2 bg-white rounded-b-xl border-t border-green-100">

            {/* Language Selector */}
      <select
        value={selectedLang}
        onChange={e => setSelectedLang(e.target.value)}
        className="border rounded px-2 py-1 mr-2 bg-white text-gray-900"
        style={{ minWidth: 90 }}
        disabled={isLoading}
        aria-label="Select language"
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="zh">Chinese</option>
        <option value="ar">Arabic</option>
        <option value="ru">Russian</option>
        <option value="bn">Bengali</option>
        <option value="ta">Tamil</option>
        <option value="te">Telugu</option>
        {/* Add more as needed */}
      </select>
      {/* WhatsApp-style input bar: textarea, send button (if text), mic button (always at right) */}
<Textarea
  value={inputMessage}
  onChange={e => setInputMessage(e.target.value)}
  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
  placeholder="Ask about eco products, orders, shops..."
  className="flex-1 resize-none bg-gray-100 text-gray-900 placeholder-gray-600 focus:bg-white focus:border-green-500 border-green-200 rounded shadow-sm font-medium"
  style={{ color: '#222', background: '#f8f9fa', fontWeight: 500 }}
  rows={2}
  disabled={isLoading}
  autoFocus
/>
{inputMessage.trim() ? (
  <Button
    onClick={handleSendMessage}
    disabled={isLoading}
    className="ml-2 flex items-center justify-center rounded-full w-12 h-12 bg-green-500 hover:bg-green-600 text-white shadow-lg transition-all"
    aria-label="Send message"
    type="button"
  >
    <Send className="w-5 h-5" />
  </Button>
) : null}
<button
  type="button"
  onClick={handleMicClick}
  className={`flex items-center justify-center rounded-full w-12 h-12 ml-2 bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all ${isListening ? 'animate-pulse ring-2 ring-blue-300' : ''}`}
  aria-label="Start voice input"
>
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="22" x2="12" y2="16"/><line x1="8" y1="22" x2="16" y2="22"/></svg>
</button>
          </div>
        </div>
      )}
      {/* Custom resize handle (bottom-right) */}
      {!isMaximized && (
        <span
          className="ecoguide-chat-custom-resize-handle"
          onMouseDown={handleResizeMouseDown}
          aria-label="Resize chat window"
          tabIndex={0}
          role="slider"
          title="Resize"
        >
          <svg width="13" height="13" viewBox="0 0 22 22" fill="none"><path d="M6 16l10-10M10 20l8-8M14 22l8-8" stroke="#aaa" strokeWidth="2"/></svg>
        </span>
      )}
    </>
  );
};

export default EcoGuideChat;
