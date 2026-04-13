"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Sparkles, Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const { t, language } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message when language changes or on mount
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: `${t.chat.greeting}\n\n${t.chat.greetingSub}`,
        }
      ]);
    }
  }, [t, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Mock AI response
    setTimeout(() => {
      let aiContent = "";
      if (text.includes("科技") || text.includes("AI") || text.toLowerCase().includes("tech")) {
        aiContent = language === 'zh' 
          ? "太棒了！我也非常关注科技与人工智能。今天为你准备了一条热门资讯：\n\n**「OpenAI 发布最新多模态模型」**\n该模型在多项基准测试中打破纪录，尤其是在视觉推理方面表现惊人。\n\n你想深入了解它的技术细节，还是看看它对行业的影响？"
          : "Awesome! I'm also following Tech & AI closely. Here's a trending news for you:\n\n**「OpenAI releases new multimodal model」**\nIt breaks records in multiple benchmarks, especially in visual reasoning.\n\nDo you want to dive into the technical details or its industry impact?";
      } else {
        aiContent = language === 'zh'
          ? `好的，我已经记下了你的偏好："${text}"。我会根据这个为你定制每日资讯讲解。有什么特别想先了解的吗？`
          : `Got it. I've noted your preference: "${text}". I will curate your daily feed based on this. Anything specific you want to know first?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: aiContent,
        },
      ]);
    }, 1000);
  };

  const presets = [
    t.chat.presetTech,
    t.chat.presetNews,
    t.chat.presetSchedule,
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-50/50 dark:bg-zinc-950/50">
      {/* 顶部标题 */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl sticky top-0 z-10 border-zinc-200/80 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="bg-zinc-900 dark:bg-zinc-100 p-2 rounded-xl text-zinc-50 dark:text-zinc-900 shadow-sm">
            <Sparkles size={18} className="animate-pulse" />
          </div>
          <div>
            <h1 className="font-semibold text-lg tracking-tight text-zinc-900 dark:text-zinc-100">{t.nav.chat}</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">DailyQuery Agent</p>
          </div>
        </div>
      </header>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={msg.id}
              className={cn(
                "flex gap-4 max-w-[88%] md:max-w-[75%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border",
                  msg.role === "user"
                    ? "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
                    : "bg-zinc-900 dark:bg-zinc-100 border-transparent text-zinc-50 dark:text-zinc-900"
                )}
              >
                {msg.role === "user" ? <User size={18} /> : <Command size={18} />}
              </div>
              <div
                className={cn(
                  "px-5 py-3.5 whitespace-pre-wrap text-sm md:text-[15px] leading-relaxed shadow-sm",
                  msg.role === "user"
                    ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 rounded-2xl rounded-tr-sm"
                    : "bg-white text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl rounded-tl-sm"
                )}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Preset Suggestions for empty or initial state */}
        {messages.length === 1 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex flex-col gap-2 max-w-[75%] ml-14"
          >
            {presets.map((preset, i) => (
              <button
                key={i}
                onClick={() => handleSend(preset)}
                className="text-left px-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-xl text-zinc-600 dark:text-zinc-300 transition-all hover:shadow-sm"
              >
                {preset}
              </button>
            ))}
          </motion.div>
        )}
        
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* 输入区域 */}
      <div className="p-4 md:p-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-200/80 dark:border-zinc-800/80">
        <div className="relative flex items-end gap-3 max-w-4xl mx-auto bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-2 focus-within:ring-2 focus-within:ring-zinc-900 dark:focus-within:ring-zinc-100 focus-within:border-transparent transition-all shadow-sm">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={t.chat.placeholder}
            className="w-full max-h-32 min-h-[44px] resize-none bg-transparent px-3 py-2.5 text-sm md:text-[15px] focus:outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            rows={1}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-2.5 mb-0.5 rounded-xl bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 disabled:opacity-50 disabled:hover:opacity-50 transition-all shrink-0"
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </div>
        <div className="text-center mt-3 text-[11px] font-medium tracking-wide text-zinc-400 dark:text-zinc-500 uppercase">
          AI CAN MAKE MISTAKES. VERIFY IMPORTANT INFO.
        </div>
      </div>
    </div>
  );
}
