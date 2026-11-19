'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCompare } from '@/contexts/CompareContext';
import {
  parseSSEFrames,
  type ChatKosCard,
  type LLMHealthResponse,
} from '@/lib/ai/chat-types';
import ChatMarkdown from './ChatMarkdown';

const EXCLUDED_PREFIXES = ['/design-playground', '/admin', '/seller', '/auth'];
const FALLBACK_ROOM_IMAGE = '/images/rooms/room1.jpg';
const AUTO_SCROLL_THRESHOLD_PX = 48;

const STARTER_PROMPTS = [
  'Carikan kos putri di Sleman budget maksimal 1,5 juta ada AC dan WiFi',
  'Rekomendasi kos terbaik dengan peringkat SPK Hybrid Kosera',
  'Kos campur di Surabaya murah yang masih ada kamar kosong',
];

interface UiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  userPrompt?: string;
  toolsUsed?: string[];
  feedbackRating?: 'up' | 'down';
  feedbackSubmitting?: boolean;
  cards?: ChatKosCard[];
  error?: boolean;
}

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

/** Hybrid scores from /api/chat are already on a 0-100 scale; only clamp and round. */
function normalizeSpkScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

interface ChatMessageRowProps {
  msg: UiChatMessage;
  isActiveStreaming: boolean;
  failedImages: Record<number, boolean>;
  onImageError: (kosId: number) => void;
  onFeedback: (msgId: string, rating: 'up' | 'down') => void;
}

const ChatMessageRow = React.memo(function ChatMessageRow({
  msg,
  isActiveStreaming,
  failedImages,
  onImageError,
  onFeedback,
}: ChatMessageRowProps) {
  const isUser = msg.role === 'user';
  const showFeedbackBar =
    !isUser && !msg.error && !isActiveStreaming && msg.content.trim().length > 0;

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[90%] rounded-[14px] px-3.5 py-2.5 text-xs leading-relaxed break-words ${
          isUser
            ? 'bg-[var(--accent-primary)] text-white whitespace-pre-wrap'
            : msg.error
              ? 'bg-rose-50 text-rose-800 border border-rose-200 whitespace-pre-wrap'
              : 'bg-[var(--bg-canvas)] text-[var(--ink-primary)] border border-[var(--border-stone)]'
        }`}
      >
        {isUser || msg.error ? (
          msg.content
        ) : msg.content ? (
          <ChatMarkdown content={msg.content} isStreaming={isActiveStreaming} />
        ) : isActiveStreaming ? (
          <div className="flex items-center gap-1.5 py-0.5 text-[var(--ink-secondary)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-bounce [animation-delay:-0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-bounce [animation-delay:-0.1s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-bounce" />
          </div>
        ) : null}
      </div>

      {/* Clickable Kos Cards from live PostgreSQL tool results */}
      {!isUser && msg.cards && msg.cards.length > 0 && (
        <div className="w-full mt-2 space-y-2">
          {msg.cards.map((card) => {
            const imgSrc =
              failedImages[card.kosId] || !card.imageUrl
                ? FALLBACK_ROOM_IMAGE
                : card.imageUrl;
            return (
              <Link
                key={card.kosId}
                href={`/kos/${card.kosId}/view`}
                className="flex gap-3 p-2.5 rounded-[12px] bg-[var(--bg-canvas)] border border-[var(--border-stone)] hover:border-[var(--accent-primary)] transition-colors duration-150"
              >
                <div className="relative w-16 h-16 rounded-[8px] overflow-hidden shrink-0 bg-[var(--bg-muted)]">
                  <Image
                    src={imgSrc}
                    alt={card.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                    onError={() => onImageError(card.kosId)}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-semibold text-[var(--ink-primary)] line-clamp-1">
                      {card.rank ? `#${card.rank} ` : ''}
                      {card.title}
                    </h3>
                    {typeof card.hybridScore === 'number' ? (
                      <span className="shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--accent-tint)] text-[var(--accent-primary)]">
                        SPK {normalizeSpkScore(card.hybridScore)}%
                      </span>
                    ) : typeof card.similarityScore === 'number' &&
                      card.similarityScore > 0 ? (
                      <span className="shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--accent-tint)] text-[var(--accent-primary)]">
                        {Math.round(card.similarityScore * 100)}% cocok
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[11px] text-[var(--ink-secondary)] truncate mt-0.5">
                    {[card.subdistrict, card.city].filter(Boolean).join(', ')}
                    {card.gender ? ` · ${card.gender}` : ''}
                  </p>
                  <div className="flex items-center justify-between gap-2 mt-1.5">
                    <span className="font-mono-tabular text-xs font-bold text-[var(--accent-primary)]">
                      {formatRupiah(card.priceMonthly)}/bln
                    </span>
                    <span className="text-[10px] text-[var(--ink-secondary)]">
                      {card.availableRooms > 0
                        ? `${card.availableRooms} kamar kosong`
                        : 'Penuh'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Subtle Feedback Bar beneath completed assistant responses */}
      {showFeedbackBar && (
        <div className="mt-1.5 flex items-center gap-1.5 px-0.5">
          {msg.feedbackRating ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--ink-secondary)]">
              <svg
                className="w-3 h-3 text-[var(--accent-primary)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span>
                {msg.feedbackRating === 'up'
                  ? 'Terima kasih atas masukannya'
                  : 'Masukan tercatat untuk evaluasi model'}
              </span>
            </span>
          ) : (
            <>
              <button
                type="button"
                disabled={msg.feedbackSubmitting}
                onClick={() => onFeedback(msg.id, 'up')}
                aria-label="Jawaban membantu"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-[var(--ink-secondary)] bg-[var(--bg-canvas)] border border-[var(--border-stone)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] disabled:opacity-50 transition-colors cursor-pointer"
              >
                <svg
                  className="w-2.5 h-2.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 10v12" />
                  <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
                </svg>
                <span>Membantu</span>
              </button>
              <button
                type="button"
                disabled={msg.feedbackSubmitting}
                onClick={() => onFeedback(msg.id, 'down')}
                aria-label="Jawaban kurang tepat"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-[var(--ink-secondary)] bg-[var(--bg-canvas)] border border-[var(--border-stone)] hover:border-rose-300 hover:text-rose-700 disabled:opacity-50 transition-colors cursor-pointer"
              >
                <svg
                  className="w-2.5 h-2.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17 14V2" />
                  <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
                </svg>
                <span>Kurang tepat</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
});

export default function KoseraChatWidget() {
  const pathname = usePathname();
  const { token, isAuthenticated } = useAuth();
  const { comparedItems } = useCompare();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<UiChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeStreamMsgId, setActiveStreamMsgId] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [llmStatus, setLlmStatus] = useState<LLMHealthResponse['status'] | 'checking'>('checking');
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isAutoScrollEnabledRef = useRef(true);
  const pendingDeltaRef = useRef('');
  const rafIdRef = useRef<number | null>(null);
  const sessionIdRef = useRef<string>('');
  const messagesRef = useRef<UiChatMessage[]>([]);
  messagesRef.current = messages;

  const getClientSessionId = useCallback((): string => {
    if (sessionIdRef.current) return sessionIdRef.current;
    try {
      const storageKey = 'kosera_chat_session_id';
      const existing = window.sessionStorage.getItem(storageKey);
      if (existing) {
        sessionIdRef.current = existing;
        return existing;
      }
      const created = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      window.sessionStorage.setItem(storageKey, created);
      sessionIdRef.current = created;
      return created;
    } catch {
      const fallback = `sess-${Date.now()}`;
      sessionIdRef.current = fallback;
      return fallback;
    }
  }, []);

  const isExcludedRoute = EXCLUDED_PREFIXES.some((prefix) =>
    pathname?.startsWith(prefix)
  );

  const handleImageError = useCallback((kosId: number) => {
    setFailedImages((prev) => (prev[kosId] ? prev : { ...prev, [kosId]: true }));
  }, []);

  const handleSubmitFeedback = useCallback(
    async (msgId: string, rating: 'up' | 'down') => {
      const currentList = messagesRef.current;
      const targetIndex = currentList.findIndex((m) => m.id === msgId);
      if (targetIndex === -1) return;

      const targetMsg = currentList[targetIndex];
      if (
        targetMsg.role !== 'assistant' ||
        targetMsg.error ||
        targetMsg.feedbackRating ||
        targetMsg.feedbackSubmitting ||
        !targetMsg.content.trim()
      ) {
        return;
      }

      let promptText = targetMsg.userPrompt?.trim() || '';
      if (!promptText) {
        for (let i = targetIndex - 1; i >= 0; i--) {
          if (currentList[i].role === 'user' && currentList[i].content.trim()) {
            promptText = currentList[i].content.trim();
            break;
          }
        }
      }
      if (!promptText) return;

      // Optimistically mark feedback state so UI responds immediately
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId
            ? { ...m, feedbackRating: rating, feedbackSubmitting: true }
            : m
        )
      );

      try {
        await fetch('/api/chat/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userPrompt: promptText,
            assistantResponse: targetMsg.content,
            toolsUsed: targetMsg.toolsUsed ?? [],
            rating,
            sessionId: getClientSessionId(),
          }),
        });
      } catch {
        // Keep optimistic UI state; feedback is non-critical telemetry
      } finally {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId ? { ...m, feedbackSubmitting: false } : m
          )
        );
      }
    },
    [getClientSessionId]
  );

  const scrollToBottom = useCallback((smooth = false) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (smooth) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  const handleContainerScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distanceFromBottom <= AUTO_SCROLL_THRESHOLD_PX;
    isAutoScrollEnabledRef.current = nearBottom;
    setShowScrollToBottom((prev) => (prev === !nearBottom ? prev : !nearBottom));
  }, []);

  const handleUserScrollIntent = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom > 8) {
      isAutoScrollEnabledRef.current = false;
      setShowScrollToBottom(true);
    }
  }, []);

  const fetchLlmHealth = useCallback(async () => {
    try {
      const response = await fetch('/api/ai/health', { cache: 'no-store' });
      if (!response.ok) {
        setLlmStatus('offline');
        return;
      }
      const data = (await response.json()) as { llm?: LLMHealthResponse };
      setLlmStatus(data.llm?.status ?? 'unconfigured');
    } catch {
      setLlmStatus('offline');
    }
  }, []);

  useEffect(() => {
    if (isExcludedRoute) return;
    fetchLlmHealth();
  }, [isExcludedRoute, fetchLlmHealth]);

  useEffect(() => {
    if (isOpen) {
      fetchLlmHealth();
      if (isAutoScrollEnabledRef.current) {
        requestAnimationFrame(() => scrollToBottom(false));
      }
    }
  }, [isOpen, fetchLlmHealth, scrollToBottom]);

  // Only auto-scroll when the user has NOT scrolled up to read earlier messages
  useEffect(() => {
    if (!isOpen || !isAutoScrollEnabledRef.current) return;
    const id = requestAnimationFrame(() => {
      if (isAutoScrollEnabledRef.current) {
        scrollToBottom(false);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [messages, statusText, isOpen, scrollToBottom]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const flushPendingTokens = useCallback((assistantMsgId: string) => {
    rafIdRef.current = null;
    const buffered = pendingDeltaRef.current;
    if (!buffered) return;
    pendingDeltaRef.current = '';
    setMessages((prev) =>
      prev.map((m) =>
        m.id === assistantMsgId ? { ...m, content: m.content + buffered } : m
      )
    );
  }, []);

  const queueTokenDelta = useCallback(
    (assistantMsgId: string, delta: string) => {
      pendingDeltaRef.current += delta;
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() =>
          flushPendingTokens(assistantMsgId)
        );
      }
    },
    [flushPendingTokens]
  );

  const handleStopStreaming = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (activeStreamMsgId && pendingDeltaRef.current) {
      flushPendingTokens(activeStreamMsgId);
    }
    setIsStreaming(false);
    setActiveStreamMsgId(null);
    setStatusText(null);
  };

  const handleResetChat = () => {
    handleStopStreaming();
    isAutoScrollEnabledRef.current = true;
    setShowScrollToBottom(false);
    setMessages([]);
  };

  const handleSendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? inputValue).trim();
    if (!text || isStreaming) return;

    const userMsg: UiChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    };
    const assistantMsgId = `assistant-${Date.now() + 1}`;
    const placeholderAssistant: UiChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      userPrompt: text,
      toolsUsed: [],
      cards: [],
    };

    const historyPayload = [...messages, userMsg]
      .filter((m) => !m.error && m.content.trim().length > 0)
      .slice(-16)
      .map((m) => ({ role: m.role, content: m.content }));

    // Re-enable auto-scroll when the user sends a fresh prompt
    isAutoScrollEnabledRef.current = true;
    setShowScrollToBottom(false);
    pendingDeltaRef.current = '';

    setMessages((prev) => [...prev, userMsg, placeholderAssistant]);
    setInputValue('');
    setIsStreaming(true);
    setActiveStreamMsgId(assistantMsgId);
    setStatusText('Menghubungkan ke asisten AI Kosera...');

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: historyPayload,
          stream: true,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorMsg = 'Layanan AI Chat sedang tidak tersedia.';
        try {
          const errJson = (await response.json()) as { message?: string };
          if (errJson.message) errorMsg = errJson.message;
        } catch {
          // Use fallback message
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: errorMsg, error: true }
              : m
          )
        );
        setStatusText(null);
        return;
      }

      if (!response.body) {
        throw new Error('Respons stream kosong dari server.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const { events, remaining } = parseSSEFrames(buffer);
        buffer = remaining;

        for (const evt of events) {
          let payload: Record<string, unknown>;
          try {
            payload = JSON.parse(evt.data) as Record<string, unknown>;
          } catch {
            continue;
          }

          if (evt.event === 'status' && typeof payload.message === 'string') {
            setStatusText(payload.message);
          } else if (evt.event === 'cards' && Array.isArray(payload.cards)) {
            const incomingCards = payload.cards as ChatKosCard[];
            setMessages((prev) =>
              prev.map((m) => {
                if (m.id !== assistantMsgId) return m;
                const existing = m.cards ?? [];
                const existingIds = new Set(existing.map((c) => c.kosId));
                const merged = [
                  ...existing,
                  ...incomingCards.filter((c) => !existingIds.has(c.kosId)),
                ];
                return { ...m, cards: merged };
              })
            );
          } else if (evt.event === 'token' && typeof payload.delta === 'string') {
            setStatusText((prev) => (prev === null ? prev : null));
            queueTokenDelta(assistantMsgId, payload.delta);
          } else if (evt.event === 'done') {
            if (rafIdRef.current !== null) {
              cancelAnimationFrame(rafIdRef.current);
              rafIdRef.current = null;
            }
            const leftover = pendingDeltaRef.current;
            pendingDeltaRef.current = '';
            setStatusText(null);

            const finalContent =
              typeof payload.content === 'string' ? payload.content : undefined;
            const finalCards = Array.isArray(payload.cards)
              ? (payload.cards as ChatKosCard[])
              : undefined;
            const finalTools = Array.isArray(payload.toolsUsed)
              ? payload.toolsUsed.filter((t): t is string => typeof t === 'string')
              : undefined;

            setMessages((prev) =>
              prev.map((m) => {
                if (m.id !== assistantMsgId) return m;
                const combined = m.content + leftover;
                return {
                  ...m,
                  content: combined || finalContent || 'Maaf, belum ada respons dari asisten.',
                  cards: finalCards && finalCards.length > 0 ? finalCards : m.cards,
                  toolsUsed: finalTools ?? m.toolsUsed ?? [],
                };
              })
            );
          } else if (evt.event === 'error') {
            if (rafIdRef.current !== null) {
              cancelAnimationFrame(rafIdRef.current);
              rafIdRef.current = null;
            }
            pendingDeltaRef.current = '';
            const detail =
              typeof payload.detail === 'string'
                ? payload.detail
                : 'Terjadi kesalahan saat memproses jawaban.';
            setStatusText(null);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId
                  ? { ...m, content: detail, error: true }
                  : m
              )
            );
          }
        }
      }
    } catch (error) {
      if ((error as Error)?.name === 'AbortError') {
        return;
      }
      setStatusText(null);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content:
                  'Tidak dapat terhubung ke layanan AI Chat. Pastikan server GPU Colab aktif dan URL tunnel sudah benar.',
                error: true,
              }
            : m
        )
      );
    } finally {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (pendingDeltaRef.current) {
        flushPendingTokens(assistantMsgId);
      }
      setIsStreaming(false);
      setActiveStreamMsgId(null);
      setStatusText(null);
      abortControllerRef.current = null;
    }
  };

  if (isExcludedRoute) {
    return null;
  }

  const bottomOffsetClass = comparedItems.length > 0 ? 'bottom-24 sm:bottom-24' : 'bottom-5';

  const statusBadge = (() => {
    if (llmStatus === 'online') {
      return { dot: 'bg-emerald-500', label: 'AI Online' };
    }
    if (llmStatus === 'checking') {
      return { dot: 'bg-amber-400', label: 'Memeriksa...' };
    }
    if (llmStatus === 'unconfigured') {
      return { dot: 'bg-stone-400', label: 'Belum Terhubung' };
    }
    return { dot: 'bg-rose-500', label: 'AI Offline' };
  })();

  return (
    <div className={`fixed right-5 ${bottomOffsetClass} z-40 flex flex-col items-end`}>
      {/* Chat Drawer with smooth open/close transition */}
      <section
        role="dialog"
        aria-label="Asisten AI Kosera SPK"
        aria-hidden={!isOpen}
        style={{ boxShadow: 'var(--shadow-float)' }}
        className={`absolute bottom-14 right-0 w-[calc(100vw-2.5rem)] sm:w-[430px] h-[min(620px,78vh)] flex flex-col rounded-[20px] bg-[var(--bg-surface)] border border-[var(--border-stone)] overflow-hidden origin-bottom-right transition-all duration-200 ease-out will-change-transform ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto visible'
            : 'opacity-0 scale-95 translate-y-2 pointer-events-none invisible'
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-[var(--border-stone)] bg-[var(--bg-canvas)] shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[var(--ink-primary)] truncate">
                Asisten AI Kosera SPK
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--bg-surface)] border border-[var(--border-stone)] text-[var(--ink-secondary)]">
                <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                {statusBadge.label}
              </span>
            </div>
            <p className="text-[11px] text-[var(--ink-secondary)] mt-0.5 truncate">
              {isAuthenticated
                ? 'Mode Personalisasi SPK Hybrid aktif'
                : 'Pencarian Semantik + SPK Hybrid Kosera'}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleResetChat}
                title="Mulai percakapan baru"
                className="px-2 py-1 rounded-[8px] text-[11px] font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup asisten chat"
              className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </header>

        {/* Scrollable Message Area (never hijacks user scroll) */}
        <div className="relative flex-1 min-h-0">
          <div
            ref={scrollContainerRef}
            onScroll={handleContainerScroll}
            onWheel={handleUserScrollIntent}
            onTouchMove={handleUserScrollIntent}
            className="h-full overflow-y-auto overscroll-contain p-4 space-y-4 bg-[var(--bg-surface)]"
          >
            {messages.length === 0 ? (
              <div className="space-y-4">
                <div className="rounded-[14px] p-3.5 bg-[var(--bg-canvas)] border border-[var(--border-stone)]">
                  <p className="text-xs leading-relaxed text-[var(--ink-primary)]">
                    Halo, saya asisten AI Kosera SPK. Ceritakan lokasi, budget, tipe kos,
                    atau fasilitas yang kamu cari. Semua rekomendasi diambil langsung dari
                    database Kosera.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-secondary)]">
                    Contoh Pertanyaan
                  </p>
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      disabled={isStreaming}
                      onClick={() => handleSendMessage(prompt)}
                      className="w-full text-left text-xs px-3 py-2.5 rounded-[12px] border border-[var(--border-stone)] bg-[var(--bg-canvas)] text-[var(--ink-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-tint)]/35 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatMessageRow
                  key={msg.id}
                  msg={msg}
                  isActiveStreaming={isStreaming && msg.id === activeStreamMsgId}
                  failedImages={failedImages}
                  onImageError={handleImageError}
                  onFeedback={handleSubmitFeedback}
                />
              ))
            )}

            {statusText && (
              <div className="flex items-center gap-2 text-[11px] text-[var(--ink-secondary)] px-1">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                <span>{statusText}</span>
              </div>
            )}
          </div>

          {/* Floating Scroll-to-Bottom Pill when user scrolls up */}
          {showScrollToBottom && messages.length > 0 && (
            <button
              type="button"
              onClick={() => {
                isAutoScrollEnabledRef.current = true;
                setShowScrollToBottom(false);
                scrollToBottom(true);
              }}
              aria-label="Gulir ke pesan terbaru"
              className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-[var(--bg-surface)]/95 backdrop-blur border border-[var(--border-stone)] text-[var(--ink-primary)] shadow-md hover:border-[var(--accent-primary)] transition-all cursor-pointer"
            >
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
              <span>Ke bawah</span>
            </button>
          )}
        </div>

        {/* Input Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-[var(--border-stone)] bg-[var(--bg-canvas)] flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isStreaming}
            placeholder="Tanya kos, budget, lokasi, atau SPK..."
            className="flex-1 text-xs px-3 py-2.5 rounded-[10px] bg-[var(--bg-surface)] border border-[var(--border-stone)] text-[var(--ink-primary)] placeholder:text-[var(--ink-secondary)]/70 focus:outline-none focus:border-[var(--accent-primary)] disabled:opacity-60 transition-colors"
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={handleStopStreaming}
              aria-label="Hentikan respons"
              className="px-3.5 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--bg-muted)] text-[var(--ink-primary)] border border-[var(--border-stone)] hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors cursor-pointer"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={inputValue.trim().length === 0}
              aria-label="Kirim pesan"
              className="px-3.5 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Kirim
            </button>
          )}
        </form>
      </section>

      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Tutup asisten AI Kosera' : 'Buka asisten AI Kosera'}
        style={{ boxShadow: 'var(--shadow-float)' }}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] active:scale-[0.98] transition-all duration-150 cursor-pointer"
      >
        <svg
          className="w-4 h-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span className="text-xs font-semibold">Tanya AI Kosera</span>
      </button>
    </div>
  );
}
