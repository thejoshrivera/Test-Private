"use client";

import { useState, useRef, useEffect } from "react";
import { Topbar } from "@/components/layout/topbar";
import { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";

const SUGGESTED_PROMPTS = [
  "What instruments should I replace?",
  "Which assets drift the most?",
  "Show me repeated failures.",
  "What calibration interval changes would you recommend?",
  "What saved money this year?",
  "Which instruments should be investigated?",
  "What is the highest risk area of the plant?",
  "Summarize the calibration program health.",
];

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex gap-3 max-w-4xl", isUser && "ml-auto flex-row-reverse")}>
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
        isUser ? "bg-[#3b82f6]/20 text-[#3b82f6]" : "bg-zinc-800 text-zinc-400"
      )}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={cn(
        "rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-2xl",
        isUser
          ? "bg-[#3b82f6]/15 text-zinc-200 rounded-tr-sm border border-[#3b82f6]/20"
          : "bg-[#0f1117] text-zinc-300 border border-white/[0.06] rounded-tl-sm"
      )}>
        <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
          __html: msg.content
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
            .replace(/^#+\s(.+)$/gm, '<div class="font-semibold text-white text-sm mt-2 mb-1">$1</div>')
            .replace(/^- (.+)$/gm, '<div class="flex gap-2"><span class="text-zinc-600">·</span><span>$1</span></div>')
            .replace(/^\|\s*(.+)\s*\|$/gm, '<div class="font-mono text-xs text-zinc-400">$1</div>')
        }} />
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "sys-1",
      role: "assistant",
      content: "Hello, I'm your Calibration Intelligence AI assistant. I have full context on your instrument fleet — 20 instruments across 5 departments, calibration history, drift trends, costs, and risk profiles.\n\nAsk me anything about your calibration program. For example:\n- \"What instruments should be replaced?\"\n- \"Which assets have the highest drift?\"\n- \"What are the biggest cost reduction opportunities?\"\n- \"What is driving the decline in pass rate?\"",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = [...messages, userMsg]
        .filter((m) => m.id !== "sys-1")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: data.content || data.error || "An error occurred.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Connection error. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Topbar title="AI Assistant" subtitle="Ask questions about your calibration fleet in natural language" />

      <div className="flex flex-1 overflow-hidden">
        {/* Chat area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800">
                  <Loader2 className="h-4 w-4 text-zinc-400 animate-spin" />
                </div>
                <div className="rounded-2xl rounded-tl-sm border border-white/[0.06] bg-[#0f1117] px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/[0.06] p-4">
            <div className="flex gap-3 items-end">
              <textarea
                ref={inputRef}
                className="flex-1 resize-none rounded-xl border border-white/[0.08] bg-[#0f1117] px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-[#3b82f6]/40 transition-colors min-h-[52px] max-h-32"
                placeholder="Ask about your calibration fleet... (Enter to send, Shift+Enter for new line)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#3b82f6] text-white transition-all hover:bg-[#2563eb] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar with suggested prompts */}
        <div className="w-72 border-l border-white/[0.06] p-4 flex flex-col gap-4 overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-[#3b82f6]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Suggested Questions</span>
            </div>
            <div className="space-y-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={loading}
                  className="w-full rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 text-left text-xs text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200 hover:border-white/[0.1] transition-all disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <div className="rounded-xl border border-[#3b82f6]/15 bg-[#3b82f6]/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="h-4 w-4 text-[#3b82f6]" />
                <span className="text-xs font-semibold text-[#3b82f6]">AI Context</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                The AI has full access to your calibration records, drift trends, failure history, costs, and risk scores for all 20 instruments in your fleet.
              </p>
              <p className="text-[11px] text-zinc-600 mt-2">
                Powered by Claude (Anthropic). Add ANTHROPIC_API_KEY to enable live AI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
