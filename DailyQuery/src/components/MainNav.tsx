"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Rss, Settings, Moon, Sun, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function MainNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: "/chat", label: t.nav.chat, icon: MessageSquare },
    { href: "/feed", label: t.nav.feed, icon: Rss },
    { href: "/settings", label: t.nav.settings, icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 flex-col md:flex-row overflow-hidden font-sans">
      {/* 桌面端侧边栏 */}
      <nav className="hidden md:flex w-64 flex-col border-r bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-zinc-200 dark:border-zinc-800">
        <div className="p-6 font-semibold tracking-tight text-2xl text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          DailyQuery
        </div>
        <div className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-medium shadow-sm"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                )}
              >
                <Icon size={18} className={cn(isActive && "fill-current/10")} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between">
          <button
            onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
            className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2 text-xs font-medium"
            title="Toggle Language"
          >
            <Languages size={18} />
            <span>{language.toUpperCase()}</span>
          </button>
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
              title="Toggle Theme"
            >
              {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>
      </nav>

      {/* 移动端顶栏 (语言 & 主题) */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <div className="font-semibold tracking-tight text-xl text-zinc-900 dark:text-zinc-100">
          DailyQuery
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
            className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400"
          >
            <Languages size={20} />
          </button>
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400"
            >
              {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* 主内容区 */}
      <main className="flex-1 overflow-hidden relative bg-white dark:bg-zinc-950 shadow-sm md:m-2 md:rounded-2xl md:border border-zinc-200 dark:border-zinc-800">
        {children}
      </main>

      {/* 移动端底栏 */}
      <nav className="md:hidden flex items-center justify-around border-t bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg border-zinc-200 dark:border-zinc-800 pb-safe relative z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full py-3 transition-colors",
                isActive
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              )}
            >
              <Icon size={20} className={cn("mb-1", isActive && "fill-current/20")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
