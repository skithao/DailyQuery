/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { ThumbsUp, MessageCircle, Star, Share2 } from "lucide-react";

const MOCK_FEED = [
  {
    id: "1",
    title: "多模态大模型的未来趋势在哪里？",
    excerpt: "最近 OpenAI 发布的最新模型在视觉理解方面有了长足的进步。但我们是否真正触及了通用人工智能（AGI）的门槛？多模态的融合不仅是数据层面的整合，更是认知架构的一次革命...",
    author: "AI前沿",
    upvotes: 1245,
    comments: 320,
    cover: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "如何看待2026年全球半导体产业格局的变化？",
    excerpt: "从先进制程的争夺到新型封装技术的崛起，半导体行业正经历着深刻的变革。本文将带你深度解析目前各家巨头的战略布局以及未来的潜在技术路线图...",
    author: "芯科技",
    upvotes: 892,
    comments: 156,
  },
  {
    id: "3",
    title: "每天喝咖啡真的能延长寿命吗？科学研究这么说",
    excerpt: "关于咖啡的健康争议由来已久。最新发表在《医学柳叶刀》的一篇前瞻性队列研究指出，适量饮用黑咖啡与降低心血管疾病风险存在显著相关性。但这并不意味着你可以无限畅饮...",
    author: "健康指南针",
    upvotes: 3421,
    comments: 890,
    cover: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "量子计算突破性进展：室温超导是否成为可能？",
    excerpt: "虽然LK-99的闹剧已经平息，但科学界对室温超导的探索从未停止。近期某实验室声称在极高压下实现了接近室温的超导现象，这是否意味着新的物理大门被推开？",
    author: "物理评论",
    upvotes: 567,
    comments: 112,
  },
];

export default function FeedPage() {
  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900 overflow-y-auto">
      <header className="px-4 py-3 bg-white dark:bg-gray-950 shadow-sm sticky top-0 z-10 flex gap-6">
        <span className="font-bold text-lg text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 pb-2">
          推荐
        </span>
        <span className="font-medium text-lg text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer pb-2">
          关注
        </span>
        <span className="font-medium text-lg text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer pb-2">
          热榜
        </span>
      </header>

      <div className="flex-1 max-w-3xl w-full mx-auto p-2 md:p-4 space-y-3">
        {MOCK_FEED.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-950 p-4 md:p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 transition-shadow hover:shadow-md"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
              <Link href={`/feed/${item.id}`}>{item.title}</Link>
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-3">
              <Link href={`/feed/${item.id}`} className="flex-1 text-gray-600 dark:text-gray-400 text-base leading-relaxed cursor-pointer line-clamp-3 md:line-clamp-4">
                <span className="font-medium text-gray-900 dark:text-gray-300 mr-2">
                  {item.author}:
                </span>
                {item.excerpt}
              </Link>
              {item.cover && (
                <div className="w-full md:w-48 h-32 md:h-auto shrink-0 rounded-lg overflow-hidden relative">
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mt-4">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-md font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                <ThumbsUp size={16} />
                <span>赞同 {item.upvotes}</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                <MessageCircle size={16} />
                <span>{item.comments} 条评论</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                <Share2 size={16} />
                <span>分享</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-gray-700 dark:hover:text-gray-200 transition-colors ml-auto">
                <Star size={16} />
                <span>收藏</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
