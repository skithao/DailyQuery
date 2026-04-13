/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { ThumbsUp, MessageCircle, Star, Share2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const { t, language } = useTranslation();

  return (
    <div className="flex flex-col h-full bg-zinc-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      <header className="px-6 py-4 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 sticky top-0 z-10 flex gap-8 items-center">
        <span className="font-semibold text-base text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100 pb-1.5 transition-colors cursor-pointer">
          {language === 'zh' ? '推荐' : 'Recommended'}
        </span>
        <span className="font-medium text-base text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors cursor-pointer pb-1.5">
          {language === 'zh' ? '关注' : 'Following'}
        </span>
        <span className="font-medium text-base text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors cursor-pointer pb-1.5">
          {language === 'zh' ? '热榜' : 'Hot'}
        </span>
      </header>

      <div className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-6 space-y-6">
        <div className="mb-8 mt-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">{t.feed.title}</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{t.feed.subtitle}</p>
        </div>

        {MOCK_FEED.map((item, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            key={item.id}
            className="group bg-white dark:bg-zinc-900/80 p-5 md:p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 transition-all duration-300 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            <h2 className="text-[1.35rem] leading-snug font-bold text-zinc-900 dark:text-zinc-100 mb-3 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
              <Link href={`/feed/${item.id}`}>{item.title}</Link>
            </h2>
            
            <div className="flex flex-col md:flex-row gap-5 mb-4">
              <Link href={`/feed/${item.id}`} className="flex-1 text-zinc-600 dark:text-zinc-400 text-[15px] leading-relaxed cursor-pointer line-clamp-3 md:line-clamp-4">
                <span className="font-semibold text-zinc-900 dark:text-zinc-200 mr-2">
                  {item.author}:
                </span>
                {item.excerpt}
              </Link>
              {item.cover && (
                <div className="w-full md:w-44 h-36 md:h-auto shrink-0 rounded-xl overflow-hidden relative border border-zinc-100 dark:border-zinc-800">
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 text-[13px] font-medium text-zinc-500 dark:text-zinc-400 mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                <ThumbsUp size={15} />
                <span>{item.upvotes}</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                <MessageCircle size={15} />
                <span>{item.comments}</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                <Share2 size={15} />
                <span>{language === 'zh' ? '分享' : 'Share'}</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors ml-auto">
                <Star size={15} />
                <span>{language === 'zh' ? '收藏' : 'Save'}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
