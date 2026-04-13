"use client";

import { useState, useEffect } from "react";
import { X, Send, Bot, Sparkles, User, Brain, Microscope, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

type AgentMessage = {
  id: string;
  role: "system" | "agent" | "user";
  agentId?: "scholar" | "analyst" | "philosopher";
  content: string;
};

const AGENTS = {
  scholar: {
    name: "学术派",
    icon: Microscope,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/50",
    border: "border-blue-200 dark:border-blue-800",
  },
  analyst: {
    name: "商业分析师",
    icon: Coins,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/50",
    border: "border-amber-200 dark:border-amber-800",
  },
  philosopher: {
    name: "思辨者",
    icon: Brain,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/50",
    border: "border-purple-200 dark:border-purple-800",
  },
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
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [isDiscussing, setIsDiscussing] = useState(false);

  useEffect(() => {
    const startDiscussion = () => {
      setIsDiscussing(true);
      setMessages([
        {
          id: "sys-1",
          role: "system",
          content: `正在围绕划线内容：“${selectedText}” 展开多智能体探讨...`,
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
            content: "从技术发展史来看，多模态模型的融合确实是认知的关键一步。视觉信息的加入，极大地丰富了模型的上下文理解能力。",
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
            content: "同意。但从商业落地的角度，这也意味着更高的算力成本。目前市场上真正能承担起如此庞大算力的公司屈指可数，这会加剧行业寡头效应。",
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
            content: "技术和商业之外，我们更应该思考：当机器不仅能看，还能理解时，人类所谓的独特性是否被进一步压缩了？AGI 的门槛不仅是技术问题，更是哲学问题。",
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
          content: "你提出了一个很好的视角。确实，泛化能力的提升必须建立在模块化或更高效的计算范式之上，否则我们将面临物理算力极限。",
        },
      ]);
      setIsDiscussing(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 pointer-events-none">
      {/* 遮罩层 */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity"
        onClick={onClose}
      />

      {/* 弹窗主体 */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 sm:rounded-2xl rounded-t-2xl shadow-2xl pointer-events-auto flex flex-col max-h-[90vh] sm:max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300">
        
        {/* 头部 */}
        <header className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-xl text-white shadow-sm">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg">多智能体探讨</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">正在针对划线文本进行多维度分析</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </header>

        {/* 讨论区 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-950/30">
          {messages.map((msg) => {
            if (msg.role === "system") {
              return (
                <div key={msg.id} className="flex justify-center">
                  <span className="text-xs font-medium px-4 py-1.5 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                    {msg.content}
                  </span>
                </div>
              );
            }

            if (msg.role === "user") {
              return (
                <div key={msg.id} className="flex gap-3 max-w-[85%] ml-auto flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 flex items-center justify-center shrink-0">
                    <User size={16} />
                  </div>
                  <div className="rounded-2xl rounded-tr-sm px-4 py-3 bg-blue-600 text-white text-sm shadow-sm">
                    {msg.content}
                  </div>
                </div>
              );
            }

            const agent = AGENTS[msg.agentId as keyof typeof AGENTS];
            const AgentIcon = agent?.icon || Bot;

            return (
              <div key={msg.id} className="flex gap-3 max-w-[90%]">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border",
                  agent?.bg,
                  agent?.color,
                  agent?.border
                )}>
                  <AgentIcon size={20} />
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    {agent?.name}
                  </div>
                  <div className="rounded-2xl rounded-tl-sm px-5 py-3.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm leading-relaxed shadow-sm border border-gray-100 dark:border-gray-700">
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
          
          {isDiscussing && (
            <div className="flex gap-3 max-w-[90%] animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center shrink-0">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="rounded-2xl rounded-tl-sm px-5 py-3.5 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-sm shadow-sm border border-gray-100 dark:border-gray-700">
                正在思考中...
              </div>
            </div>
          )}
        </div>

        {/* 输入区 */}
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="加入讨论，发表你的观点..."
              disabled={isDiscussing}
              className="w-full bg-gray-100 dark:bg-gray-800 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-3 pr-12 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isDiscussing}
              className="absolute right-2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
