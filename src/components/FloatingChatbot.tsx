import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";

interface Message {
  role: "user" | "model";
  text: string;
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const SYSTEM_PROMPT = `
You are the luxury AI Concierge for Dawat-e-Ishq, a premium event planning platform in Pakistan.
Your tone is elegant, helpful, and highly professional.
We specialize in weddings, mehndi, baraat, walima, corporate and Ramzan events.
Give short, premium-style answers (2-3 lines max).
Suggest themes, decor, and ideas when relevant.
`;

const FloatingChatbot = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(([
    {
      role: "model",
      text: "Welcome to Dawat-e-Ishq! How may I assist you with your premium event today?",
    },
  ]));
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
        setMessages((prev) => [
          ...prev,
          { role: "user", text: input },
          {
            role: "model",
            text: "Please add your Gemini API key in Vercel environment variables.",
          },
        ]);
      }
      return;
    }

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
     const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `${SYSTEM_PROMPT}\nUser: ${userMessage}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log("Gemini response:", data);

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "model", text: "API Error: " + data.error.message },
        ]);
        return;
      }

      const responseText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!responseText) {
        setMessages((prev) => [
          ...prev,
          { role: "model", text: "No response from AI. Try again." },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "model", text: responseText },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "I am having trouble connecting. Please try again.",
        },
      ]);
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
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-black border border-yellow-500 rounded-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-yellow-500 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="text-yellow-500" />
                <h3 className="text-yellow-500 font-bold">AI Concierge</h3>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <X />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="bg-gray-800 text-white p-2 rounded-lg max-w-[80%]">
                    {msg.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="text-yellow-500">
                  <Loader2 className="animate-spin" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-yellow-500 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 p-2 bg-black border border-yellow-500 text-white rounded-full"
                placeholder="Ask about themes, packages..."
              />
              <button onClick={handleSend}>
                <Send />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center"
      >
        {isOpen ? <X /> : <MessageSquare />}
      </button>
    </div>
  );
};

export default FloatingChatbot;