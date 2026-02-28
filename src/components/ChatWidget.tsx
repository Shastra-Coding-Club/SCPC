"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  X,
  Loader2,
  RefreshCcw,
  Mic,
  Square,
} from "lucide-react";
import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  type FormEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* ────────────────────── constants ────────────────────── */

const SCPC_LOGO =
  "https://res.cloudinary.com/divj3y2cp/image/upload/f_auto,q_auto/v1/scpc-team/scpc";

const QUICK_TOPICS = [
  { label: "Event Schedule", q: "What is the event schedule for SCPC 2026?" },
  { label: "Prizes & Rewards", q: "What are the prizes and rewards?" },
  { label: "Rules & Guidelines", q: "What are the rules and guidelines?" },
  { label: "Registration Info", q: "How do I register for SCPC 2026?" },
];

const BAR_COUNT = 32;
const EMPTY_LEVELS = new Array(BAR_COUNT).fill(0);

/* ────────────────────── helpers ──────────────────────── */

function getMessageText(msg: any): string {
  if (msg.parts && Array.isArray(msg.parts)) {
    return msg.parts
      .filter((p: any) => p.type === "text")
      .map((p: any) => p.text)
      .join("");
  }
  return msg.content ?? "";
}

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/* ────────────────────── component ───────────────────── */

export function ChatWidget() {
  /* ── state ── */
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordSec, setRecordSec] = useState(0);
  const [levels, setLevels] = useState<number[]>(EMPTY_LEVELS);
  const [micAllowed, setMicAllowed] = useState<boolean | null>(null); // null = unknown/prompt, true = granted, false = denied

  /* ── refs ── */
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── online check ── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => setIsOnline(navigator.onLine);
    check();
    const iv = setInterval(check, 3000);
    window.addEventListener("online", check);
    window.addEventListener("offline", check);
    return () => {
      clearInterval(iv);
      window.removeEventListener("online", check);
      window.removeEventListener("offline", check);
    };
  }, []);

  /* ── chat ── */
  const transport = useMemo(
    () => new TextStreamChatTransport({ api: "/api/chat" }),
    [],
  );
  const { messages, sendMessage, status, error, regenerate } = useChat({
    transport,
    onError: (e: Error) => console.error("Chat error:", e),
  });
  const isStreaming = status === "streaming" || status === "submitted";
  const hasMessages = messages.length > 0;


  /* ── scroll to bottom ── */
  useEffect(() => {
    if (isOpen && messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming, isOpen]);

  /* ── auto-focus ── */
  useEffect(() => {
    if (isOpen && !isRecording) setTimeout(() => inputRef.current?.focus(), 120);
  }, [isOpen, isRecording]);
  useEffect(() => {
    if (!isStreaming && isOpen && !isRecording) inputRef.current?.focus();
  }, [isStreaming, isOpen, isRecording]);

  /* ── close on outside click ── */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (containerRef.current && !containerRef.current.contains(t)) {
        if (t.closest("button,a,[role='button'],label,input,select")) return;
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  /* ── submit text ── */
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

  /* ── quick topic ── */
  const sendQuick = useCallback(
    (q: string) => {
      if (isStreaming) return;
      sendMessage({ text: q });
    },
    [isStreaming, sendMessage],
  );

  /* ── audio cleanup helper ── */
  const cleanupAudio = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    recorderRef.current = null;
  }, []);

  /* ── start recording ── */
  const startRecording = useCallback(async () => {
    /* request mic permission */
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      setMicAllowed(true);
    } catch {
      setMicAllowed(false);
      return;
    }
    streamRef.current = stream;

    /* MediaRecorder */
    const mime = MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : "audio/mp4";
    const recorder = new MediaRecorder(stream, { mimeType: mime });
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = async () => {
      /* cleanup hardware immediately */
      stream.getTracks().forEach((t) => t.stop());
      streamRef.current = null;

      const blob = new Blob(chunksRef.current, { type: mime });
      if (blob.size < 500) return; // too short

      setIsTranscribing(true);
      try {
        const fd = new FormData();
        fd.append(
          "audio",
          blob,
          mime.includes("mp4") ? "audio.mp4" : "audio.webm",
        );
        const res = await fetch("/api/transcribe", {
          method: "POST",
          body: fd,
        });
        if (res.ok) {
          const { text } = await res.json();
          if (text?.trim())
            setInput((p) => (p ? p + " " + text.trim() : text.trim()));
        } else {
          console.error("Transcription failed:", res.status);
        }
      } catch (err) {
        console.error("Transcription error:", err);
      } finally {
        setIsTranscribing(false);
      }
    };

    /* AudioContext → AnalyserNode for waveform */
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.82;
    source.connect(analyser);
    audioCtxRef.current = audioCtx;
    analyserRef.current = analyser;

    /* start */
    recorder.start(150);
    recorderRef.current = recorder;
    setIsRecording(true);
    setRecordSec(0);

    /* timer */
    timerRef.current = setInterval(() => setRecordSec((s) => s + 1), 1000);

    /* waveform animation loop */
    const dataArr = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArr);
      const step = Math.floor(dataArr.length / BAR_COUNT);
      const next: number[] = [];
      for (let i = 0; i < BAR_COUNT; i++) {
        next.push(dataArr[Math.min(i * step, dataArr.length - 1)] / 255);
      }
      setLevels(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  /* ── stop recording ── */
  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop(); // triggers onstop → transcription
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    setIsRecording(false);
    setLevels(EMPTY_LEVELS);
  }, []);

  /* ── cleanup on close / unmount ── */
  useEffect(() => {
    if (!isOpen && isRecording) stopRecording();
  }, [isOpen, isRecording, stopRecording]);
  useEffect(() => cleanupAudio, [cleanupAudio]);

  /* ── request mic permission (called directly from FAB click gesture) ── */
  const micPromptedRef = useRef(false);
  const requestMicPermission = () => {
    if (micPromptedRef.current) return;
    micPromptedRef.current = true;

    if (!navigator.mediaDevices?.getUserMedia) {
      setMicAllowed(false);
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach((t) => t.stop());
        setMicAllowed(true);
      })
      .catch(() => {
        setMicAllowed(false);
      });
  };

  /* ═══════════════════════ render ═══════════════════════ */
  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9990]"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            className="absolute bottom-[4.5rem] right-0 w-[calc(100vw-2rem)] sm:w-[23rem] h-[min(38rem,calc(100dvh-7rem))] flex flex-col overflow-hidden rounded-[1.75rem]"
            style={{
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(48px) saturate(200%)",
              WebkitBackdropFilter: "blur(48px) saturate(200%)",
              border: "0.5px solid rgba(0,0,0,0.08)",
              boxShadow: [
                "0 24px 80px rgba(0,0,0,0.12)",
                "0 8px 28px rgba(37,99,235,0.07)",
                "0 2px 6px rgba(0,0,0,0.06)",
                "inset 0 0.5px 0 rgba(255,255,255,1)",
              ].join(","),
            }}
          >
            {/* ── HEADER ─────────────────────────────────────── */}
            <div
              className="relative z-10 flex items-center justify-between px-5 py-3"
              style={{
                background: "rgba(255,255,255,0.82)",
                backdropFilter: "blur(24px)",
                borderBottom: "0.5px solid rgba(0,0,0,0.06)",
              }}
            >
              <div className="flex items-center gap-3">
                {/* Logo */}
                <div
                  className="w-10 h-10 rounded-[0.75rem] flex items-center justify-center overflow-hidden flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(249,250,255,0.95))",
                    border: "0.5px solid rgba(0,0,0,0.06)",
                    boxShadow:
                      "0 4px 16px rgba(249,115,22,0.14), 0 1px 4px rgba(0,0,0,0.06), inset 0 0.5px 0 rgba(255,255,255,1)",
                  }}
                >
                  <Image
                    src={SCPC_LOGO}
                    alt="SCPC"
                    width={32}
                    height={32}
                    className="object-contain w-7 h-7"
                    unoptimized
                  />
                </div>
                <div>
                  <p
                    className="font-semibold text-[0.8125rem] leading-none tracking-tight"
                    style={{ color: "#1a1a1a" }}
                  >
                    SCPC Assistant
                  </p>
                  <p className="mt-1 text-[0.6rem] font-medium tracking-widest uppercase text-gray-400">
                    TCET Shastra
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90"
                style={{
                  background: "rgba(0,0,0,0.06)",
                  border: "0.5px solid rgba(0,0,0,0.04)",
                }}
                aria-label="Close"
              >
                <X
                  className="w-3.5 h-3.5"
                  style={{ color: "#666" }}
                  strokeWidth={2.5}
                />
              </button>
            </div>

            {/* ── CONTENT AREA ────────────────────────────────── */}
            <div className="relative flex-1 overflow-y-auto overscroll-contain">
              <AnimatePresence mode="wait">
                {/* ---- RECORDING VIEW ---- */}
                {isRecording ? (
                  <motion.div
                    key="rec"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center justify-center h-full px-6 py-8 select-none"
                  >
                    {/* pulsing ring */}
                    <div className="relative mb-6">
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: "rgba(249,115,22,0.12)",
                          animation:
                            "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
                          transform: "scale(1.5)",
                        }}
                      />
                      <div
                        className="relative w-14 h-14 rounded-full flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #f97316, #ea580c)",
                          boxShadow: "0 6px 24px rgba(249,115,22,0.4)",
                        }}
                      >
                        <Mic className="w-6 h-6 text-white" strokeWidth={2} />
                      </div>
                    </div>

                    <p
                      className="text-[0.8125rem] font-semibold tracking-tight mb-1"
                      style={{ color: "#f97316" }}
                    >
                      Listening…
                    </p>
                    <p className="text-[0.7rem] text-gray-400 mb-8">
                      Say anything
                    </p>

                    {/* ── WAVEFORM BARS ── */}
                    <div className="flex items-center justify-center gap-[3px] w-full h-28 mb-6">
                      {levels.map((l, i) => (
                        <div
                          key={i}
                          className="rounded-full flex-shrink-0"
                          style={{
                            width: "3.5px",
                            height: `${Math.max(6, l * 112)}px`,
                            background: `linear-gradient(180deg, #f97316 ${30 + l * 40}%, #fdba74)`,
                            opacity: 0.35 + l * 0.65,
                            transition: "height 80ms ease-out, opacity 80ms ease-out",
                          }}
                        />
                      ))}
                    </div>

                    {/* timer */}
                    <p
                      className="text-[1.5rem] font-light tracking-widest tabular-nums"
                      style={{ color: "#1a1a1a" }}
                    >
                      {formatTime(recordSec)}
                    </p>
                  </motion.div>
                ) : /* ---- WELCOME VIEW ---- */
                !hasMessages ? (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center px-5 pt-8 pb-5"
                  >
                    {/* Hero card */}
                    <div
                      className="w-full rounded-[1.25rem] flex flex-col items-center gap-3 px-5 py-8 mb-5"
                      style={{
                        background: "rgba(255,255,255,0.75)",
                        backdropFilter: "blur(20px) saturate(180%)",
                        border: "0.5px solid rgba(255,255,255,0.9)",
                        boxShadow:
                          "0 12px 40px rgba(37,99,235,0.08), 0 4px 12px rgba(249,115,22,0.07), inset 0 0.5px 0 rgba(255,255,255,1)",
                      }}
                    >
                      <div
                        className="w-16 h-16 rounded-[1rem] flex items-center justify-center mb-1"
                        style={{
                          background:
                            "linear-gradient(145deg, #fff 0%, #f8faff 100%)",
                          border: "0.5px solid rgba(0,0,0,0.06)",
                          boxShadow:
                            "0 8px 28px rgba(249,115,22,0.16), 0 2px 6px rgba(37,99,235,0.08), inset 0 0.5px 0 #fff",
                        }}
                      >
                        <Image
                          src={SCPC_LOGO}
                          alt="SCPC Logo"
                          width={48}
                          height={48}
                          className="object-contain w-11 h-11"
                          unoptimized
                        />
                      </div>
                      <h2
                        className="text-center font-semibold text-[1.05rem] leading-snug tracking-tight"
                        style={{ color: "#1a1a1a" }}
                      >
                        How can we help you
                        <br />
                        today?
                      </h2>
                      <p className="text-[0.65rem] text-gray-400 font-medium tracking-widest uppercase">
                        TCET Shastra · SCPC 2026
                      </p>
                    </div>

                    {/* Quick topics — sticker cards */}
                    <div className="w-full grid grid-cols-2 gap-3">
                      {QUICK_TOPICS.map((t, i) => (
                        <motion.button
                          key={t.label}
                          initial={{ rotate: i % 2 === 0 ? -2 : 1.5 }}
                          whileHover={{ rotate: 0, scale: 1.05, y: -4 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => sendQuick(t.q)}
                          disabled={isStreaming || !isOnline}
                          className="relative group pt-2 disabled:opacity-40"
                        >
                          {/* Tape */}
                          <div
                            className="absolute -top-0.5 left-1/2 -translate-x-1/2 z-10 rounded-sm"
                            style={{
                              width: "1.75rem",
                              height: "0.625rem",
                              background: "#f97316",
                              border: "0.5px solid rgba(234,88,12,0.4)",
                              opacity: 0.85,
                              transform: `translateX(-50%) rotate(${i % 2 === 0 ? 2 : -1}deg)`,
                            }}
                          />
                          {/* Card */}
                          <div
                            className="rounded-xl px-3 py-3.5 text-center transition-shadow group-hover:shadow-lg"
                            style={{
                              background: "#fff",
                              border: "1px solid rgba(219,234,254,0.8)",
                              boxShadow:
                                "0 2px 8px rgba(0,0,0,0.06), 0.15rem 0.15rem 0 0 rgba(0,0,0,0.08)",
                            }}
                          >
                            <span className="text-[0.75rem] font-semibold text-gray-800 leading-tight block">
                              {t.label}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  /* ---- MESSAGES VIEW ---- */
                  <motion.div
                    key="msgs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="px-4 py-4 space-y-2.5"
                  >
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[82%] text-[0.8125rem] leading-relaxed px-4 py-2.5 ${
                            msg.role === "user"
                              ? "rounded-[1.25rem] rounded-br-md text-white"
                              : "rounded-[1.25rem] rounded-bl-md"
                          }`}
                          style={
                            msg.role === "user"
                              ? {
                                  background:
                                    "linear-gradient(145deg, #f97316, #ea580c)",
                                  boxShadow:
                                    "0 4px 16px rgba(249,115,22,0.32)",
                                  color: "#fff",
                                }
                              : {
                                  background: "rgba(255,255,255,0.95)",
                                  border: "0.5px solid rgba(0,0,0,0.06)",
                                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                                  color: "#2a2a2a",
                                }
                          }
                        >
                          {msg.role === "user" ? (
                            getMessageText(msg)
                          ) : (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ children }) => (
                                  <p className="mb-1 last:mb-0">{children}</p>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-semibold">
                                    {children}
                                  </strong>
                                ),
                                ul: ({ children }) => (
                                  <ul className="list-disc pl-4 mb-1">
                                    {children}
                                  </ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="list-decimal pl-4 mb-1">
                                    {children}
                                  </ol>
                                ),
                                li: ({ children }) => (
                                  <li className="mb-0.5">{children}</li>
                                ),
                                a: ({ href, children }) => {
                                  const isWeb = /^https?:\/\//.test(
                                    href || "",
                                  );
                                  return (
                                    <a
                                      href={href}
                                      target={isWeb ? "_blank" : undefined}
                                      rel={
                                        isWeb
                                          ? "noopener noreferrer"
                                          : undefined
                                      }
                                      className="text-blue-600 font-medium underline underline-offset-2 hover:opacity-80 transition-opacity"
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

                    {/* typing indicator */}
                    {isStreaming && (
                      <div className="flex justify-start">
                        <div
                          className="px-4 py-3 rounded-[1.25rem] rounded-bl-md flex items-center gap-1.5"
                          style={{
                            background: "rgba(255,255,255,0.95)",
                            border: "0.5px solid rgba(0,0,0,0.06)",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                          }}
                        >
                          {[0, 150, 300].map((d) => (
                            <span
                              key={d}
                              className="w-[6px] h-[6px] rounded-full animate-bounce"
                              style={{
                                background: "#d1d5db",
                                animationDelay: `${d}ms`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* error */}
                    {error && (
                      <div
                        className="flex flex-col items-center p-3.5 rounded-2xl text-center"
                        style={{
                          background: "rgba(254,226,226,0.9)",
                          border: "0.5px solid rgba(252,165,165,0.6)",
                        }}
                      >
                        <p className="text-xs text-red-600 mb-2">
                          {error.message || "Something went wrong."}
                        </p>
                        {!error.message?.includes("too many") && (
                          <button
                            onClick={() => regenerate()}
                            className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
                          >
                            <RefreshCcw className="w-3 h-3" /> Retry
                          </button>
                        )}
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── INPUT BAR ────────────────────────────────── */}
            <div
              className="relative z-10 px-3 py-3"
              style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(24px)",
                borderTop: "0.5px solid rgba(0,0,0,0.06)",
              }}
            >
              {isTranscribing ? (
                /* transcribing state */
                <div className="flex items-center justify-center gap-2 py-2">
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    style={{ color: "#f97316" }}
                  />
                  <span className="text-[0.8125rem] text-gray-500 font-medium">
                    Transcribing…
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center gap-2">
                    {/* text input */}
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={
                        !isOnline
                          ? "You are offline…"
                          : isRecording
                            ? "Recording…"
                            : "Message…"
                      }
                      disabled={isStreaming || !isOnline || isRecording}
                      autoComplete="off"
                      className="flex-1 text-[0.8125rem] rounded-full pl-4 pr-4 py-2.5 outline-none transition-shadow disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: "rgba(0,0,0,0.04)",
                        border: "0.5px solid rgba(0,0,0,0.06)",
                        color: "#1a1a1a",
                        boxShadow: "inset 0 0.5px 0 rgba(0,0,0,0.02)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 0 0 3px rgba(37,99,235,0.12), inset 0 0.5px 0 rgba(0,0,0,0.02)";
                        e.currentTarget.style.borderColor =
                          "rgba(37,99,235,0.3)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow =
                          "inset 0 0.5px 0 rgba(0,0,0,0.02)";
                        e.currentTarget.style.borderColor =
                          "rgba(0,0,0,0.06)";
                      }}
                    />

                    {/* mic / stop button — hidden entirely when permission denied */}
                    {micAllowed !== false && (
                      <motion.button
                        type="button"
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={!isOnline || isStreaming || isTranscribing}
                        whileTap={{ scale: 0.88 }}
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
                        style={
                          isRecording
                            ? {
                                background: "rgba(239,68,68,0.1)",
                                border: "0.5px solid rgba(239,68,68,0.3)",
                                boxShadow:
                                  "0 0 0 4px rgba(239,68,68,0.08), 0 2px 8px rgba(239,68,68,0.2)",
                              }
                            : {
                                background: "rgba(0,0,0,0.04)",
                                border: "0.5px solid rgba(0,0,0,0.06)",
                              }
                        }
                        aria-label={
                          isRecording ? "Stop recording" : "Voice input"
                        }
                      >
                        {isRecording ? (
                          <Square
                            className="w-4 h-4"
                            style={{ color: "#ef4444" }}
                            strokeWidth={2.5}
                            fill="#ef4444"
                          />
                        ) : (
                          <Mic
                            className="w-[18px] h-[18px]"
                            style={{ color: "#888" }}
                            strokeWidth={2}
                          />
                        )}
                      </motion.button>
                    )}

                    {/* send button */}
                    <motion.button
                      type="submit"
                      disabled={
                        isStreaming ||
                        !input.trim() ||
                        !isOnline ||
                        isRecording ||
                        isTranscribing
                      }
                      whileTap={{ scale: 0.88 }}
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{
                        background:
                          "linear-gradient(145deg, #f97316, #ea580c)",
                        boxShadow: "0 4px 16px rgba(249,115,22,0.36)",
                      }}
                      aria-label="Send"
                    >
                      {isStreaming ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <Send
                          className="w-4 h-4 text-white"
                          strokeWidth={2.5}
                        />
                      )}
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB ──────────────────────────────────────────── */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => {
          const opening = !isOpen;
          setIsOpen(opening);
          if (opening) requestMicPermission();
        }}
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={
          isOpen
            ? {
                background: "rgba(255,255,255,0.92)",
                border: "0.5px solid rgba(0,0,0,0.08)",
                backdropFilter: "blur(24px)",
                boxShadow:
                  "0 4px 16px rgba(0,0,0,0.1), inset 0 0.5px 0 rgba(255,255,255,1)",
              }
            : {
                background:
                  "linear-gradient(145deg, #f97316 0%, #ea580c 45%, #2563eb 100%)",
                boxShadow:
                  "0 10px 32px rgba(249,115,22,0.4), 0 4px 10px rgba(37,99,235,0.2), inset 0 0.5px 0 rgba(255,255,255,0.25)",
              }
        }
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X
                className="w-5 h-5"
                style={{ color: "#666" }}
                strokeWidth={2.5}
              />
            </motion.div>
          ) : (
            <motion.div
              key="logo"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Image
                src={SCPC_LOGO}
                alt="SCPC"
                width={32}
                height={32}
                className="object-contain w-7 h-7 brightness-0 invert"
                unoptimized
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
