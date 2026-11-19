'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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

const EXCLUDED_PREFIXES = ['/design-playground', '/admin', '/seller', '/auth'];
const FALLBACK_ROOM_IMAGE = '/images/rooms/room1.jpg';

const STARTER_PROMPTS = [
  'Carikan kos putri di Sleman budget maksimal 1,5 juta ada AC dan WiFi',
  'Rekomendasi kos terbaik dengan peringkat SPK Hybrid Kosera',
  'Kos campur di Surabaya murah yang masih ada kamar kosong',
];

interface UiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  cards?: ChatKosCard[];
  error?: boolean;
}

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default function KoseraChatWidget() {
  const pathname = usePathname();
  const { token, isAuthenticated } = useAuth();
  const { comparedItems } = useCompare();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<UiChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [llmStatus, setLlmStatus] = useState<LLMHealthResponse['status'] | 'checking'>('checking');
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isExcludedRoute = EXCLUDED_PREFIXES.some((prefix) =>
    pathname?.startsWith(prefix)
  );

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
    }
  }, [isOpen, fetchLlmHealth]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, statusText, isOpen]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleResetChat = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsStreaming(false);
    setStatusText(null);
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
      cards: [],
    };

    const historyPayload = [...messages, userMsg]
      .filter((m) => !m.error && m.content.trim().length > 0)
      .slice(-16)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMsg, placeholderAssistant]);
    setInputValue('');
    setIsStreaming(true);
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
            setStatusText(null);
            const delta = payload.delta;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId
                  ? { ...m, content: m.content + delta }
                  : m
              )
            );
          } else if (evt.event === 'done') {
            setStatusText(null);
            const finalContent =
              typeof payload.content === 'string' ? payload.content : undefined;
            const finalCards = Array.isArray(payload.cards)
              ? (payload.cards as ChatKosCard[])
              : undefined;
            setMessages((prev) =>
              prev.map((m) => {
                if (m.id !== assistantMsgId) return m;
                return {
                  ...m,
                  content: m.content || finalContent || 'Maaf, belum ada respons dari asisten.',
                  cards: finalCards && finalCards.length > 0 ? finalCards : m.cards,
                };
              })
            );
          } else if (evt.event === 'error') {
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
      setIsStreaming(false);
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
      {isOpen && (
        <section
          role="dialog"
          aria-label="Asisten AI Kosera SPK"
          style={{ boxShadow: 'var(--shadow-float)' }}
          className="mb-3 w-[calc(100vw-2.5rem)] sm:w-[420px] h-[min(600px,78vh)] flex flex-col rounded-[20px] bg-[var(--bg-surface)] border border-[var(--border-stone)] overflow-hidden"
        >
          {/* Header */}
          <header className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-[var(--border-stone)] bg-[var(--bg-canvas)]">
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

          {/* Message List */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--bg-surface)]"
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
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-[14px] px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap break-words ${
                      msg.role === 'user'
                        ? 'bg-[var(--accent-primary)] text-white'
                        : msg.error
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-[var(--bg-canvas)] text-[var(--ink-primary)] border border-[var(--border-stone)]'
                    }`}
                  >
                    {msg.content || (isStreaming ? '...' : '')}
                  </div>

                  {/* Clickable Kos Cards from live PostgreSQL tool results */}
                  {msg.role === 'assistant' && msg.cards && msg.cards.length > 0 && (
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
                            className="flex gap-3 p-2.5 rounded-[12px] bg-[var(--bg-canvas)] border border-[var(--border-stone)] hover:border-[var(--accent-primary)] transition-colors"
                          >
                            <div className="relative w-16 h-16 rounded-[8px] overflow-hidden shrink-0 bg-[var(--bg-muted)]">
                              <Image
                                src={imgSrc}
                                alt={card.title}
                                fill
                                sizes="64px"
                                className="object-cover"
                                onError={() =>
                                  setFailedImages((prev) => ({
                                    ...prev,
                                    [card.kosId]: true,
                                  }))
                                }
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
                                    SPK {Math.round(card.hybridScore)}
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
                </div>
              ))
            )}

            {statusText && (
              <div className="flex items-center gap-2 text-[11px] text-[var(--ink-secondary)] px-1">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                <span>{statusText}</span>
              </div>
            )}
          </div>

          {/* Input Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-[var(--border-stone)] bg-[var(--bg-canvas)] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isStreaming}
              placeholder="Tanya kos, budget, lokasi, atau SPK..."
              className="flex-1 text-xs px-3 py-2.5 rounded-[10px] bg-[var(--bg-surface)] border border-[var(--border-stone)] text-[var(--ink-primary)] placeholder:text-[var(--ink-secondary)]/70 focus:outline-none focus:border-[var(--accent-primary)] disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isStreaming || inputValue.trim().length === 0}
              aria-label="Kirim pesan"
              className="px-3.5 py-2.5 rounded-[10px] text-xs font-semibold bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Kirim
            </button>
          </form>
        </section>
      )}

      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Tutup asisten AI Kosera' : 'Buka asisten AI Kosera'}
        style={{ boxShadow: 'var(--shadow-float)' }}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
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
