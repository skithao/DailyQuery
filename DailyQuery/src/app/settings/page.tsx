"use client";

import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { t, language } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const [config, setConfig] = useState({
    name: "",
    model: "",
    temperature: 0.7,
    system_prompt: "",
  });
  const [saveStatus, setSaveStatus] = useState("");

  const loadConfig = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const loadedConfig = await invoke<any>("get_agent_config");
      setConfig(loadedConfig);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes("window.__TAURI_INTERNALS__")) {
        setConfig({
          name: "Mock Agent",
          model: "gpt-4o",
          temperature: 0.7,
          system_prompt: "You are a mock assistant.",
        });
      } else {
        console.error("Failed to load config:", err);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadConfig();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const isValid = await invoke<boolean>("login", { password });
      if (isValid) {
        setIsAuthenticated(true);
      } else {
        setError(language === 'zh' ? "密码错误，请重试" : "Invalid password");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes("window.__TAURI_INTERNALS__")) {
        if (password === "admin123") {
          setIsAuthenticated(true);
        } else {
          setError(language === 'zh' ? "密码错误，请重试" : "Invalid password");
        }
      } else {
        setError(errorMessage);
      }
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus(t.settings.saving);
    try {
      await invoke("update_agent_config", { config });
      setSaveStatus(t.settings.saved);
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes("window.__TAURI_INTERNALS__")) {
        setSaveStatus(t.settings.saved + " (Mock)");
        setTimeout(() => setSaveStatus(""), 3000);
      } else {
        setSaveStatus((language === 'zh' ? "保存失败: " : "Save failed: ") + errorMessage);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-50/30 dark:bg-zinc-950/30 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{t.settings.title}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">{language === 'zh' ? '需要管理员权限以继续' : 'Admin access required'}</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition-all dark:text-white"
                placeholder={language === 'zh' ? '请输入密码 (默认 admin123)' : 'Enter password (admin123)'}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm font-medium pl-1">{error}</p>}
            <button
              type="submit"
              className="w-full bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-zinc-50 dark:text-zinc-900 font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-sm"
            >
              {language === 'zh' ? '进入系统' : 'Enter System'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full bg-zinc-50/30 dark:bg-zinc-950/30 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6 md:p-10 space-y-8">
        <div className="flex justify-between items-center pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{t.settings.agentConfig}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              {language === 'zh' ? '管理并配置默认智能体行为' : 'Manage default agent behavior'}
            </p>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {language === 'zh' ? '退出' : 'Logout'}
          </button>
        </div>
        
        <motion.form 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSaveConfig} 
          className="space-y-6 bg-white dark:bg-zinc-900/80 p-6 md:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                {t.settings.agentName}
              </label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                {t.settings.agentModel}
              </label>
              <input
                type="text"
                value={config.model}
                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all dark:text-white"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  {t.settings.temperature}
                </label>
                <span className="text-sm font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                  {config.temperature.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.temperature}
                onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-800 accent-zinc-900 dark:accent-zinc-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                {t.settings.systemPrompt}
              </label>
              <textarea
                value={config.system_prompt}
                onChange={(e) => setConfig({ ...config, system_prompt: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all dark:text-white resize-none"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="submit"
              className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-zinc-50 dark:text-zinc-900 font-semibold py-2.5 px-6 rounded-xl transition duration-200 shadow-sm"
            >
              {t.settings.save}
            </button>
            {saveStatus && (
              <span className={`text-sm font-medium ${saveStatus.includes('失败') || saveStatus.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
                {saveStatus}
              </span>
            )}
          </div>
        </motion.form>
      </div>
    </div>
  );
}
