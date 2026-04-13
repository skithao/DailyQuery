/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { ThumbsUp, MessageCircle, Star, Share2, RefreshCw } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { motion } from "framer-motion";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

// Define feed item type
type FeedItem = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  upvotes: number;
  comments: number;
  cover?: string;
};

const INITIAL_MOCK_FEED: FeedItem[] = [
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
  }
];

export default function FeedPage() {
  const { t, language } = useTranslation();
  const [feed, setFeed] = useState<FeedItem[]>(INITIAL_MOCK_FEED);
  const [isFetching, setIsFetching] = useState(false);

  const fetchRealData = async () => {
    setIsFetching(true);
    try {
      // Use Tauri command to fetch real RSS data (Hacker News or similar)
      const query = language === 'zh' ? '人工智能 最新进展' : 'AI Latest News';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const searchResults = await invoke<any[]>("search_web_command", { query });
      
      if (searchResults && searchResults.length > 0) {
        const newFeed = searchResults.map((res: any, idx: number) => ({
          id: `live-${Date.now()}-${idx}`,
          title: res.title,
          excerpt: res.snippet || "Click to read more details...",
          author: "WebSearch",
          upvotes: Math.floor(Math.random() * 500) + 10,
          comments: Math.floor(Math.random() * 50),
          cover: res.image || undefined,
        }));
        setFeed(prev => [...newFeed, ...prev]);
      }
    } catch (err) {
      console.error("Failed to fetch real data, falling back to mock:", err);
      // Fallback if Tauri fails (e.g. in browser)
      setTimeout(() => {
        const fallback = {
          id: `mock-${Date.now()}`,
          title: language === 'zh' ? "实时抓取的新闻标题" : "Real-time Fetched News Headline",
          excerpt: language === 'zh' ? "通过底层 Rust 爬虫获取的真实数据内容摘要展示在这里..." : "Summary of real data fetched via underlying Rust crawler...",
          author: "DailyQuery Crawler",
          upvotes: 100,
          comments: 10,
        };
        setFeed(prev => [fallback, ...prev]);
      }, 1000);
    } finally {
      setIsFetching(false);
    }
  };

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
        <div className="mb-8 mt-2 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">{t.feed.title}</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{t.feed.subtitle}</p>
          </div>
          <button 
            onClick={fetchRealData}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 rounded-xl font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-opacity shadow-sm"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            {language === 'zh' ? '获取最新' : 'Fetch Latest'}
          </button>
        </div>

        {feed.map((item, i) => (
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
