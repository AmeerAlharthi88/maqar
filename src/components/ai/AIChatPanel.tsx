"use client";

import { useState, useRef, useEffect } from "react";
import { AILoadingState } from "./AILoadingState";
import { AIErrorState } from "./AIErrorState";
import { AIDisclaimer } from "./AIDisclaimer";
import { AISuggestionChips } from "./AISuggestionChips";
import type { AssistantMessage } from "@/lib/ai/types";
import type { AIErrorCode } from "@/lib/ai/types";

const SUGGESTED_PROMPTS = [
  "أبحث عن فيلا عائلية في بوشر بميزانية ١٢٠ ألف ر.ع.",
  "ما أفضل مناطق الاستثمار العقاري في مسقط؟",
  "قارن لي بين الخوض والحيل للسكن",
  "كيف أختار عقاراً مناسباً للإيجار؟",
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  isMock?: boolean;
}

async function sendMessage(messages: AssistantMessage[]): Promise<{ replyAr?: string; isMockFallback?: boolean; errorCode?: AIErrorCode }> {
  const res = await fetch("/api/ai/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  return res.json();
}

export function AIChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<AIErrorCode | undefined>();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function submit(text?: string) {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    setInput("");
    setErrorCode(undefined);

    const userMsg: ChatMessage = { role: "user", content: userText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const result = await sendMessage(
        newMessages.map((m) => ({ role: m.role, content: m.content }))
      );

      if (result.replyAr) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.replyAr!, isMock: result.isMockFallback },
        ]);
      } else {
        setErrorCode(result.errorCode ?? "unknown");
      }
    } catch {
      setErrorCode("provider_error");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submit();
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full min-h-0" dir="rtl">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {isEmpty && (
          <div className="space-y-4">
            {/* Welcome */}
            <div className="text-center pt-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FBF0EB] border border-[#C65D3B]/20 flex items-center justify-center mx-auto mb-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C65D3B" strokeWidth="1.5" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-[#1E1E1E]">مساعد مقر العقاري</p>
              <p className="text-xs text-[#7A6B5E] mt-1 leading-relaxed max-w-xs mx-auto">
                اسألني عن العقارات في سلطنة عُمان — شراء، إيجار، أسعار، أو مقارنة مناطق.
              </p>
            </div>

            {/* Suggestion chips */}
            <AISuggestionChips
              prompts={SUGGESTED_PROMPTS}
              onSelect={(p) => void submit(p)}
              disabled={loading}
              label="أسئلة شائعة"
            />
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={["flex", msg.role === "user" ? "justify-start" : "justify-end"].join(" ")}
          >
            <div
              className={[
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-[#F5F0EA] text-[#1E1E1E] rounded-tr-sm"
                  : "bg-white border border-[#F0EBE3] text-[#1E1E1E] rounded-tl-sm",
              ].join(" ")}
            >
              {msg.content}
              {msg.isMock && (
                <span className="block mt-1.5 text-[10px] text-[#C8860A] font-semibold">(وضع تجريبي — لا يوجد مفتاح API)</span>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-end">
            <div className="bg-white border border-[#F0EBE3] rounded-2xl rounded-tl-sm px-4 py-3">
              <AILoadingState compact messageAr="يفكر المساعد..." />
            </div>
          </div>
        )}

        {errorCode && !loading && (
          <AIErrorState errorCode={errorCode} onRetry={() => setErrorCode(undefined)} />
        )}

        <div ref={bottomRef} />
      </div>

      {/* Disclaimer */}
      <div className="px-4 pb-2">
        <AIDisclaimer variant="financial" className="text-center" />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-[#F0EBE3] bg-white">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اكتب سؤالك هنا..."
            rows={1}
            maxLength={1200}
            disabled={loading}
            className="flex-1 resize-none rounded-2xl border border-[#E8DDD0] bg-[#FAF7F4] px-3.5 py-2.5 text-sm text-[#1E1E1E] placeholder:text-[#A89480] focus:outline-none focus:border-[#C65D3B] focus:ring-2 focus:ring-[#C65D3B]/15 disabled:opacity-60 leading-relaxed"
            style={{ minHeight: "44px", maxHeight: "120px" }}
            aria-label="اكتب رسالتك"
            dir="rtl"
          />
          <button
            type="button"
            onClick={() => void submit()}
            disabled={!input.trim() || loading}
            aria-label="إرسال"
            className="w-11 h-11 flex-shrink-0 rounded-xl bg-[#C65D3B] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#B24F30] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C65D3B]/50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M22 2L11 13" /><path d="M22 2L15 22l-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
