/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, MessageCircle, ThumbsUp, Star, Share2, Users } from "lucide-react";
import Link from "next/link";
import { HighlightDiscussModal } from "@/components/HighlightDiscussModal";

const MOCK_ARTICLE = {
  id: "1",
  title: "多模态大模型的未来趋势在哪里？",
  author: {
    name: "AI前沿",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    bio: "专注人工智能、机器学习领域深度报道",
  },
  content: `最近 OpenAI 发布的最新模型在视觉理解方面有了长足的进步。但我们是否真正触及了通用人工智能（AGI）的门槛？多模态的融合不仅是数据层面的整合，更是认知架构的一次革命。

当我们谈论多模态大模型时，我们关注的不仅仅是它能识别图像中的猫，而是它能够理解猫在特定场景下的语义，并将其与文本语境结合。这需要极其庞大的参数量和训练数据。

然而，当前的挑战在于如何降低计算成本，同时保持模型的泛化能力。一些研究者提出，模块化神经网络可能是未来的方向。这意味着模型可以根据任务需求，动态调用不同的子模块，从而实现更高效的计算。

总之，多模态大模型的发展仍处于早期阶段。未来的路还很长，但方向已经明确：那就是向着更加通用、更加高效的人工智能迈进。这不仅仅是技术上的突破，更是对人类智能本质的深刻探索。`,
  upvotes: 1245,
  comments: 320,
};

export default function ArticleDetailPage() {
  const [selectedText, setSelectedText] = useState("");
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !contentRef.current?.contains(selection.anchorNode)) {
        setIsTooltipVisible(false);
        return;
      }

      const text = selection.toString().trim();
      if (text.length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        setSelectedText(text);
        setTooltipPos({
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        });
        setIsTooltipVisible(true);
      } else {
        setIsTooltipVisible(false);
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  const handleDiscussClick = () => {
    setIsTooltipVisible(false);
    setIsModalOpen(true);
    window.getSelection()?.removeAllRanges();
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950 overflow-y-auto relative">
      <header className="px-4 py-3 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between border-b dark:border-gray-800">
        <Link href="/feed" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
          <ArrowLeft size={20} />
          <span className="font-medium">返回</span>
        </Link>
        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
          <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-8 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-snug">
          {MOCK_ARTICLE.title}
        </h1>
        
        <div className="flex items-center gap-3 py-4 border-y border-gray-100 dark:border-gray-800">
          <img
            src={MOCK_ARTICLE.author.avatar}
            alt={MOCK_ARTICLE.author.name}
            className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700"
          />
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              {MOCK_ARTICLE.author.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {MOCK_ARTICLE.author.bio}
            </div>
          </div>
          <button className="ml-auto px-4 py-1.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors">
            关注
          </button>
        </div>

        <div 
          ref={contentRef}
          className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed space-y-4 whitespace-pre-wrap"
        >
          {MOCK_ARTICLE.content}
        </div>

        <div className="flex items-center gap-4 py-8 text-gray-500 dark:text-gray-400">
          <button className="flex items-center gap-2 px-6 py-2 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            <ThumbsUp size={20} />
            <span>赞同 {MOCK_ARTICLE.upvotes}</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300 rounded-full font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <MessageCircle size={20} />
            <span>{MOCK_ARTICLE.comments} 评论</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors ml-auto">
            <Star size={20} />
            <span>收藏</span>
          </button>
        </div>
      </div>

      {/* 划词工具提示 */}
      {isTooltipVisible && (
        <div
          className="fixed z-50 animate-in fade-in zoom-in duration-200"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <button
            onClick={handleDiscussClick}
            className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg shadow-xl font-medium text-sm hover:scale-105 transition-transform"
          >
            <Users size={16} />
            <span>多智能体探讨</span>
          </button>
          <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 border-4 border-transparent border-t-black dark:border-t-white" />
        </div>
      )}

      {/* 智能体讨论弹窗 */}
      <HighlightDiscussModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedText={selectedText}
      />
    </div>
  );
}
