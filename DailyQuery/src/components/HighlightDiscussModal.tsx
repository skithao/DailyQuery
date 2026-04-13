"use client";

import { useState, useEffect } from "react";
import { X, Send, Bot, Sparkles, User, Brain, Microscope, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { motion, AnimatePresence } from "framer-motion";

type AgentMessage = {
  id: string;
  role: "system" | "agent" | "user";
  agentId?: "scholar" | "analyst" | "philosopher";
  content: string;
};

export function HighlightDiscussModal({
  isOpen,
  onClose,
  selectedText,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
}) {
  const { t, language } = useTranslation();
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [isDiscussing, setIsDiscussing] = useState(false);

  const AGENTS = {
    scholar: {
      name: language === 'zh' ? "学术派" : "Scholar",
      icon: Microscope,
      color: "text-zinc-600 dark:text-zinc-400",
      bg: "bg-zinc-100 dark:bg-zinc-800/50",
      border: "border-zinc-200 dark:border-zinc-700",
    },
    analyst: {
      name: language === 'zh' ? "商业分析师" : "Analyst",
      icon: Coins,
      color: "text-zinc-600 dark:text-zinc-400",
      bg: "bg-zinc-100 dark:bg-zinc-800/50",
      border: "border-zinc-200 dark:border-zinc-700",
    },
    philosopher: {
      name: language === 'zh' ? "思辨者" : "Philosopher",
      icon: Brain,
      color: "text-zinc-600 dark:text-zinc-400",
      bg: "bg-zinc-100 dark:bg-zinc-800/50",
      border: "border-zinc-200 dark:border-zinc-700",
    },
  };

  useEffect(() => {
    const startDiscussion = () => {
      setIsDiscussing(true);
      setMessages([
        {
          id: "sys-1",
          role: "system",
          content: language === 'zh' 
            ? `正在围绕划线内容：“${selectedText.substring(0, 20)}...” 展开多智能体探讨...`
            : `Starting multi-agent discussion on: "${selectedText.substring(0, 20)}..."`,
        },
      ]);

      // Mock discussion flow
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "agent-1",
            role: "agent",
            agentId: "scholar",
            content: language === 'zh'
              ? "从技术发展史来看，多模态模型的融合确实是认知的关键一步。视觉信息的加入，极大地丰富了模型的上下文理解能力。"
              : "From a technological history perspective, multimodal fusion is indeed a key cognitive step. Adding visual info greatly enriches context understanding.",
          },
        ]);
      }, 1500);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "agent-2",
            role: "agent",
            agentId: "analyst",
            content: language === 'zh'
              ? "同意。但从商业落地的角度，这也意味着更高的算力成本。目前市场上真正能承担起如此庞大算力的公司屈指可数，这会加剧行业寡头效应。"
              : "Agreed. But from a commercial perspective, this means higher compute costs. Only a few companies can afford this, exacerbating the oligopoly effect.",
          },
        ]);
      }, 3500);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "agent-3",
            role: "agent",
            agentId: "philosopher",
            content: language === 'zh'
              ? "技术和商业之外，我们更应该思考：当机器不仅能看，还能理解时，人类所谓的独特性是否被进一步压缩了？AGI 的门槛不仅是技术问题，更是哲学问题。"
              : "Beyond tech and business, we must ponder: when machines can see and understand, is human uniqueness further compressed? AGI is a philosophical issue.",
          },
        ]);
        setIsDiscussing(false);
      }, 6000);
    };

    if (isOpen && selectedText && messages.length === 0) {
      startDiscussion();
    }
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([]);
      setInput("");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDiscussing(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedText, messages.length]);

  const handleSend = () => {
    if (!input.trim() || isDiscussing) return;

    const userMessage: AgentMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsDiscussing(true);

    // Mock AI response to user input
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "agent",
          agentId: "scholar",
          content: language === 'zh'
            ? "你提出了一个很好的视角。确实，泛化能力的提升必须建立在模块化或更高效的计算范式之上，否则我们将面临物理算力极限。"
            : "You brought up a great perspective. Generalization improvements must be built on modular or more efficient computing paradigms.",
        },
      ]);
      setIsDiscussing(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 pointer-events-none">
      <div 
        className="absolute inset-0 bg-zinc-950/40 dark:bg-zinc-950/80 backdrop-blur-sm pointer-events-auto transition-opacity"
        onClick={onClose}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 sm:rounded-2xl rounded-t-2xl shadow-2xl pointer-events-auto flex flex-col max-h-[90vh] sm:max-h-[80vh] overflow-hidden border border-zinc-200 dark:border-zinc-800"
      >
        <header className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="bg-zinc-900 dark:bg-zinc-100 p-2 rounded-xl text-zinc-50 dark:text-zinc-900 shadow-sm">
              <Sparkles size={18} className="animate-pulse" />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base tracking-tight">
                {language === 'zh' ? '多智能体探讨' : 'Multi-Agent Discussion'}
              </h2>
              <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                {language === 'zh' ? '正在针对划线文本进行多维度分析' : 'Multi-dimensional analysis on selected text'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-zinc-50/30 dark:bg-zinc-950/30 scroll-smooth">
          <AnimatePresence>
            {messages.map((msg) => {
              if (msg.role === "system") {
                return (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={msg.id} className="flex justify-center">
                    <span className="text-[11px] font-medium px-4 py-1.5 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 rounded-full shadow-sm border border-zinc-200 dark:border-zinc-800">
                      {msg.content}
                    </span>
                  </motion.div>
                );
              }

              if (msg.role === "user") {
                return (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={msg.id} className="flex gap-3 max-w-[88%] ml-auto flex-row-reverse">
                    <div className="w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center shrink-0 shadow-sm">
                      <User size={16} />
                    </div>
                    <div className="rounded-2xl rounded-tr-sm px-4 py-3 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 text-sm md:text-[15px] leading-relaxed shadow-sm">
                      {msg.content}
                    </div>
                  </motion.div>
                );
              }

              const agent = AGENTS[msg.agentId as keyof typeof AGENTS];
              const AgentIcon = agent?.icon || Bot;

              return (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={msg.id} className="flex gap-3 max-w-[92%]">
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm border bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 border-transparent"
                  )}>
                    <AgentIcon size={16} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-2 px-1 tracking-wide uppercase">
                      {agent?.name}
                    </div>
                    <div className="rounded-2xl rounded-tl-sm px-5 py-3.5 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-sm md:text-[15px] leading-relaxed shadow-sm border border-zinc-200/80 dark:border-zinc-800/80">
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {isDiscussing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-[90%]">
                <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 animate-pulse">
                  <Bot size={16} className="text-zinc-400 dark:text-zinc-500" />
                </div>
                <div className="rounded-2xl rounded-tl-sm px-5 py-3.5 bg-white dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 text-sm shadow-sm border border-zinc-200/80 dark:border-zinc-800/80 flex items-center gap-1.5 h-[48px]">
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
          <div className="relative flex items-center gap-2 max-w-2xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={language === 'zh' ? "参与讨论，发表你的观点..." : "Join the discussion..."}
              disabled={isDiscussing}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 rounded-xl px-4 py-3 pr-12 text-sm md:text-[15px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isDiscussing}
              className="absolute right-2 p-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <Send size={16} className="ml-0.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
