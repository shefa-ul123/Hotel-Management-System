import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI concierge. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Retrieve user & token from Redux state for authenticated chatbot experience
  const { token, user } = useSelector((state) => state.auth);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');
    setIsLoading(true);

    try {
      const config = {};
      if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`
        };
      }

      const { data } = await axios.post('http://localhost:5000/api/chat', {
        message: userMsg,
        history: messages
      }, config);

      setMessages(prev => [...prev, { text: data.reply, isBot: true }]);
    } catch (err) {
      console.error('Chat Concierge Error:', err);
      const errMsg = err.response?.data?.message || 'Sorry, I am having trouble connecting to the concierge right now.';
      setMessages(prev => [...prev, { text: errMsg, isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-16 right-0 w-80 bg-background border shadow-2xl rounded-2xl overflow-hidden flex flex-col"
            style={{ height: '450px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-650 via-fuchsia-600 to-cyan-600 text-white p-4 flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white animate-pulse" />
                  <MessageSquare className="w-5 h-5 text-white/95" />
                </div>
                <div>
                  <span className="font-bold text-sm tracking-tight block">AI Concierge</span>
                  <span className="text-[10px] text-white/80 block">Grand Horizon Guest Service</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors duration-200 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-muted/30 space-y-4 flex flex-col">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  key={idx} 
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap shadow-sm ${msg.isBot ? 'bg-secondary text-secondary-foreground rounded-tl-sm border border-secondary-foreground/5' : 'bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white rounded-tr-sm'}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm bg-secondary text-secondary-foreground rounded-tl-sm flex items-center gap-1.5 border border-secondary-foreground/5">
                    <motion.span 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                      className="w-1.5 h-1.5 rounded-full bg-foreground/50" 
                    />
                    <motion.span 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                      className="w-1.5 h-1.5 rounded-full bg-foreground/50" 
                    />
                    <motion.span 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                      className="w-1.5 h-1.5 rounded-full bg-foreground/50" 
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-background/90 border-t backdrop-blur-sm">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isLoading ? "AI is processing..." : "Type a message..."}
                  className="flex-1 rounded-xl focus-visible:ring-violet-500"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" className="rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white cursor-pointer hover:opacity-95 transition-opacity duration-200" disabled={isLoading || !input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-[0_4px_20px_rgba(139,92,246,0.4)] bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-cyan-500 text-white flex items-center justify-center cursor-pointer border-0 outline-none hover:shadow-[0_4px_25px_rgba(139,92,246,0.65)] transition-all duration-300"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquare className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default Chatbot;
