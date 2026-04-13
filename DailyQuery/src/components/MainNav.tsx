"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Rss, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/chat", label: "对话", icon: MessageSquare },
  { href: "/feed", label: "资讯", icon: Rss },
  { href: "/settings", label: "设置", icon: Settings },
];

export function MainNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 flex-col md:flex-row overflow-hidden">
      {/* 桌面端侧边栏 */}
      <nav className="hidden md:flex w-64 flex-col border-r bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <div className="p-6 font-bold text-xl text-gray-800 dark:text-gray-100 flex items-center gap-2">
          DailyQuery
        </div>
        <div className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-medium"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>

      {/* 移动端底栏 */}
      <nav className="md:hidden flex items-center justify-around border-t bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 pb-safe">
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
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              )}
            >
              <Icon size={22} className={cn("mb-1", isActive && "fill-current/20")} />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
