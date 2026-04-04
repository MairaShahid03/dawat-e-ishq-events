import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  role: "user" | "model";
  text: string;
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `
You are the luxury AI Concierge for Dawat-e-Ishq, a premium event planning platform in Pakistan.
Your tone is elegant, helpful, and highly professional.
Key details about Dawat-e-Ishq:
- We specialize in weddings, Ramzan/Iftar setups, and corporate events.
- Premium packages start at PKR 3,850/head for catering, and complete decor from PKR 150,000.
- Guide users to the booking page (/booking) if they want to book.
- Use words like "premium", "luxury", "unforgettable", and "elegance" occasionally.
Keep your responses concise (2-3 sentences max) to fit in a chat widget.
`;

import { useLocation } from "react-router-dom";

const FloatingChatbot = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Welcome to Dawat-e-Ishq! How may I assist you with your premium event today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !API_KEY) {
      if (!API_KEY) {
        setMessages(prev => [...prev, { role: "user", text: input }, { role: "model", text: "Please add your Gemini API Key to your .env file as VITE_GEMINI_API_KEY to enable me." }]);
      }
      return;
    }

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
          { role: "model", parts: [{ text: "Understood. I am ready to assist." }] },
          ...messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          }))
        ],
      });

      const result = await chat.sendMessage(userMessage);
      const responseText = result.response.text();
      
      setMessages((prev) => [...prev, { role: "model", text: responseText }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "model", text: "I apologize, but I am having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (location.pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-[#0a0a0a] border border-gold/40 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-noir to-noir-lighter border-b border-gold/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="text-gold" size={20} />
                <h3 className="font-heading text-gold font-bold">AI Concierge</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-ivory/50 hover:text-gold transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm font-body shadow-md ${
                      msg.role === "user" 
                        ? "bg-gold/10 text-ivory border border-gold/20 rounded-tr-sm" 
                        : "bg-[#111] text-ivory/90 border border-ivory/10 rounded-tl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#111] border border-ivory/10 text-gold p-3 rounded-2xl rounded-tl-sm">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 border-t border-gold/20 bg-[#111] flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about packages, themes, etc..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-noir border border-ivory/10 rounded-full px-4 py-2 text-sm text-ivory focus:outline-none focus:border-gold/50 transition-colors"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gold shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center border-2 border-noir text-noir hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all z-50 relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare size={24} fill="black" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default FloatingChatbot;
