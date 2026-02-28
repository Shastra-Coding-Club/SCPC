"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, Send, X, MessageSquare, Loader2, RefreshCcw } from "lucide-react";
import { useState, useRef, useEffect, useMemo, useCallback, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

function getMessageText(msg: any): string {
  if (msg.parts && Array.isArray(msg.parts)) {
    return msg.parts
      .filter((p: any) => p.type === "text")
      .map((p: any) => p.text)
      .join("");
  }
  return msg.content ?? "";
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => setIsOnline(navigator.onLine);
    check();
    const interval = setInterval(check, 2000);
    window.addEventListener("online", check);
    window.addEventListener("offline", check);
    return () => {
      clearInterval(interval);
      window.removeEventListener("online", check);
      window.removeEventListener("offline", check);
    };
  }, []);

  const transport = useMemo(
    () => new TextStreamChatTransport({ api: "/api/chat" }),
    [],
  );

  const { messages, sendMessage, status, error, regenerate } = useChat({
    transport,
    onError: (e: Error) => console.error("Chat error:", e),
  });

  const isStreaming = status === "streaming" || status === "submitted";
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isNetworkError = error?.name === "TypeError" || error?.message?.toLowerCase().includes("fetch");
  const isRateLimited = error?.message?.toLowerCase().includes("too many") || (error as any)?.status === 429;

  const botStatus = useMemo(() => {
    if (!isOnline || isNetworkError) return { label: "Offline", color: "bg-gray-400" };
    if (isRateLimited) return { label: "Service Busy", color: "bg-amber-400" };
    if (isStreaming) return { label: "Typing...", color: "bg-emerald-400 animate-pulse" };
    return { label: "Online", color: "bg-emerald-400 animate-pulse" };
  }, [isOnline, isNetworkError, isRateLimited, isStreaming]);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (containerRef.current && !containerRef.current.contains(target)) {
        if (target.closest("button, a, [role='button'], label, input, select")) return;
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || isStreaming) return;
      sendMessage({ text: trimmed });
      setInput("");
    },
    [input, isStreaming, sendMessage],
  );

  useEffect(() => {
    if (!isStreaming && isOpen) {
      inputRef.current?.focus();
    }
  }, [isStreaming, isOpen]);


  return (
    <div ref={containerRef} className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9990]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className={[
              "absolute bottom-[4.5rem] right-0",
              "w-[calc(100vw-2rem)] sm:w-[24rem]",
              "h-[min(32rem,calc(100dvh-7rem))]",
              "flex flex-col overflow-hidden rounded-2xl",
              "border border-white/20 dark:border-white/[0.08]",
              "bg-white/60 dark:bg-[#1a1a1a]/70",
              "backdrop-blur-2xl backdrop-saturate-150",
              "shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
              "ring-1 ring-black/[0.04] dark:ring-white/[0.06]",
            ].join(" ")}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 backdrop-blur-md border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                  <Bot className="w-[1.125rem] h-[1.125rem] text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-[0.8125rem] leading-tight">SCPC Assistant</h3>
                  <p className="text-blue-100/80 text-[0.625rem] flex items-center gap-1 mt-0.5 transition-all duration-300">
                    <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${botStatus.color}`} />
                    {botStatus.label}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/20"
                aria-label="Close Chat"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 overscroll-contain">
              <div className="flex justify-start">
                <div className="px-3.5 py-2 max-w-[85%] rounded-2xl rounded-bl-md shadow-sm text-[0.8125rem] leading-relaxed bg-white/80 dark:bg-white/[0.07] border border-gray-200/60 dark:border-white/[0.08] text-gray-800 dark:text-gray-200 backdrop-blur-sm">
                  Hey. I&apos;m the support bot for <strong>TCET Shastra</strong>. If you need help with anything — runtime details, rules, or the prize breakdown for the 12-hour hackathon, just ask.
                </div>
              </div>

              {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={[
                        "px-3.5 py-2 max-w-[85%] rounded-2xl text-[0.8125rem] leading-relaxed",
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-md shadow-sm"
                          : [
                              "rounded-bl-md shadow-sm",
                              "bg-white/80 dark:bg-white/[0.07]",
                              "border border-gray-200/60 dark:border-white/[0.08]",
                              "text-gray-800 dark:text-gray-200",
                              "backdrop-blur-sm",
                            ].join(" "),
                      ].join(" ")}
                    >
                      {msg.role === "user" ? (
                        getMessageText(msg)
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            ul: ({ children }) => <ul className="list-disc pl-4 mb-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 mb-1">{children}</ol>,
                            li: ({ children }) => <li className="mb-0.5">{children}</li>,
                            a: ({ href, children }) => {
                              const isWeb = /^https?:\/\//.test(href || "");
                              return (
                                <a
                                  href={href}
                                  target={isWeb ? "_blank" : undefined}
                                  rel={isWeb ? "noopener noreferrer" : undefined}
                                  className="text-blue-600 dark:text-blue-400 font-medium underline underline-offset-2 hover:opacity-80 transition-opacity"
                                >
                                  {children}
                                </a>
                              );
                            },
                          }}
                        >
                          {getMessageText(msg)}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
              ))}

              {isStreaming && (
                <div className="flex justify-start">
                  <div className="px-4 py-2.5 bg-white/80 dark:bg-white/[0.07] border border-gray-200/60 dark:border-white/[0.08] rounded-2xl rounded-bl-md shadow-sm flex items-center gap-1.5 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex flex-col items-center p-3 bg-red-50/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/30 rounded-xl text-center backdrop-blur-sm">
                  <p className="text-xs text-red-600 dark:text-red-400 mb-2">
                    {error.message || "Something went wrong."}
                  </p>
                  {!error.message?.includes("too many") && (
                    <button
                      onClick={() => regenerate()}
                      className="flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                    >
                      <RefreshCcw className="w-3 h-3" /> Retry
                    </button>
                  )}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-3 bg-white/40 dark:bg-black/30 backdrop-blur-md border-t border-gray-200/30 dark:border-white/[0.06]"
            >
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={!isOnline ? "You are offline…" : "Type your question…"}
                  disabled={isStreaming || !isOnline}
                  autoComplete="off"
                  className={[
                    "w-full text-[0.8125rem] rounded-full pl-4 pr-11 py-2.5 outline-none transition-all",
                    "bg-gray-100/80 dark:bg-white/[0.06]",
                    "border border-transparent",
                    "focus:bg-white dark:focus:bg-white/[0.1]",
                    "focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20",
                    "text-gray-900 dark:text-white",
                    "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                    "disabled:opacity-40 disabled:cursor-not-allowed",
                  ].join(" ")}
                />
                <button
                  type="submit"
                  disabled={isStreaming || !input.trim() || !isOnline}
                  className="absolute right-1.5 p-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400/60 disabled:cursor-not-allowed text-white rounded-full transition-colors"
                  aria-label="Send message"
                >
                  {isStreaming ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className={[
          "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200",
          "shadow-lg hover:shadow-xl",
          isOpen
            ? "bg-gray-800 dark:bg-gray-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25",
        ].join(" ")}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
