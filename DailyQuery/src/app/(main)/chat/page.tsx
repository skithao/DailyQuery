"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isInitial?: boolean;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "你好！我是你的 AI 资讯助手 DailyQuery。很高兴为你服务。\n\n为了更好地为你推荐资讯，请告诉我你通常关注哪些领域？比如：\n- 科技与人工智能\n- 商业与经济\n- 娱乐与流行文化\n- 科学与探索",
    isInitial: true,
  }
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Mock AI response
    setTimeout(() => {
      let aiContent = "";
      if (userMessage.content.includes("科技") || userMessage.content.includes("AI")) {
        aiContent = "太棒了！我也非常关注科技与人工智能。今天为你准备了一条热门资讯：\n\n**「OpenAI 发布最新多模态模型」**\n该模型在多项基准测试中打破纪录，尤其是在视觉推理方面表现惊人。\n\n你想深入了解它的技术细节，还是看看它对行业的影响？";
      } else {
        aiContent = `好的，我已经记下了你的偏好："${userMessage.content}"。我会根据这个为你定制每日资讯讲解。有什么特别想先了解的吗？`;
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

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      {/* 顶部标题 */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Sparkles size={18} />
          </div>
          <h1 className="font-semibold text-lg">智能对话</h1>
        </div>
      </header>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3 max-w-[85%] md:max-w-[75%]",
              msg.role === "user" ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === "user"
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
              )}
            >
              {msg.role === "user" ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div
              className={cn(
                "rounded-2xl px-4 py-3 whitespace-pre-wrap text-sm md:text-base shadow-sm",
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-sm"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-tl-sm"
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="p-3 md:p-4 bg-white dark:bg-gray-950 border-t">
        <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="输入消息..."
            className="w-full max-h-32 min-h-[44px] resize-none rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 pr-12 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-2 bottom-1.5 p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="text-center mt-2 text-xs text-gray-400 dark:text-gray-500">
          AI 生成的内容可能不准确，请注意甄别。
        </div>
      </div>
    </div>
  );
}
