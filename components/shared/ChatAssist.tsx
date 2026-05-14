'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

interface Msg {
  id: string;
  from: 'bot' | 'user';
  text: string;
}

const QUICK_REPLIES = [
  'Track my order',
  'Wholesale enquiry',
  'Find my scent',
  'Shipping & returns',
];

const GREETING: Msg = {
  id: 'g',
  from: 'bot',
  text:
    "Hi — I'm your Exotic Fragrances concierge. Looking for a scent, tracking an order, or exploring wholesale? Ask me anything.",
};

function botReply(input: string): string {
  const q = input.toLowerCase();
  if (/track|order|delivery|where/.test(q)) {
    return "I can help. Drop your order number (e.g. EF-12345) or the email used at checkout and I'll look it up. All orders ship within 24 hours and arrive in 3–7 business days across the US.";
  }
  if (/wholesale|vendor|bulk|business|reseller|catalogue/.test(q)) {
    return "Brilliant — vendors are very welcome. Download our wholesale catalogue from the homepage, or message +1 (212) 555-1234 on WhatsApp. Volume tiers start at 50 bottles with below-wholesale pricing.";
  }
  if (/scent|find|recommend|suggest|gift|signature/.test(q)) {
    return "Tell me a scent you love (e.g. 'Tom Ford Oud Wood', 'something fresh and citrusy', 'gift for my mum') and I'll suggest 2–3 Grade A oils from our catalogue.";
  }
  if (/ship|delivery|return|refund|policy|exchange/.test(q)) {
    return "Free standard shipping on US orders over $50. Returns accepted within 30 days on unopened bottles. Opened fragrance oils are non-returnable, but we'll resolve any quality issue.";
  }
  if (/sample|try|trial|test/.test(q)) {
    return "Most scents are available in a 0.5oz Sample size from $11 — perfect for trying before committing to a full bottle. You'll find samples in the Volume selector on every product page.";
  }
  if (/hi|hello|hey|good (morning|afternoon|evening)/.test(q)) {
    return "Hello! Lovely to have you here. What brings you to Exotic today?";
  }
  return "Thanks — let me connect you with our team. Email hello@exoticfragrances.com or WhatsApp +1 (212) 555-1234 and we'll respond within 24 hours.";
}

export default function ChatAssist() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, typing, open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const userMsg: Msg = { id: `u-${Date.now()}`, from: 'user', text: t };
    setMsgs((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [
        ...m,
        { id: `b-${Date.now()}`, from: 'bot', text: botReply(t) },
      ]);
    }, 900);
  };

  return (
    <>
      {/* Floating launcher button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Open chat assistant'}
        className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-[150] w-14 h-14 rounded-full bg-cta text-white shadow-[0_10px_30px_rgba(196,118,58,0.45)] flex items-center justify-center hover:bg-cta-hover transition-colors group"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle size={22} />
              {/* Subtle attention pulse ring */}
              <span className="absolute inset-0 -m-3 rounded-full border border-white/40 animate-ping pointer-events-none" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed z-[160] bottom-24 right-4 left-4 md:left-auto md:right-6 md:bottom-24 md:w-[380px] max-h-[min(560px,calc(100vh-140px))] bg-white rounded-md shadow-[0_24px_64px_rgba(0,0,0,0.24)] border border-border flex flex-col overflow-hidden"
            role="dialog"
            aria-label="Chat assistant"
          >
            {/* Header */}
            <div className="bg-brand text-white px-5 py-4 flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cta to-gold flex items-center justify-center flex-shrink-0">
                <Sparkles size={16} className="text-white" strokeWidth={1.6} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-[15px] leading-tight tracking-[0.02em]">
                  Exotic Concierge
                </p>
                <p className="text-[11px] text-white/60 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Online · replies in seconds
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-white/70 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-warm-white"
            >
              {msgs.map((m) => (
                <Bubble key={m.id} msg={m} />
              ))}
              {typing && (
                <div className="flex gap-1.5 px-4 py-3 bg-cream rounded-2xl rounded-bl-sm self-start max-w-[80%] w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:300ms]" />
                </div>
              )}
            </div>

            {/* Quick replies (only when conversation is fresh) */}
            {msgs.length <= 1 && (
              <div className="px-4 pb-3 flex flex-wrap gap-2 flex-shrink-0 bg-warm-white">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-[12px] px-3 py-1.5 border border-border rounded-full text-brand/80 hover:border-cta hover:text-cta transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-border bg-white px-3 py-3 flex items-center gap-2 flex-shrink-0"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                className="flex-1 min-w-0 h-10 px-3 text-[14px] text-brand placeholder:text-muted bg-warm-white border border-border rounded-sm focus:outline-none focus:border-cta transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="w-10 h-10 rounded-sm bg-cta text-white flex items-center justify-center hover:bg-cta-hover disabled:opacity-40 transition-colors flex-shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.from === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed
          ${
            isUser
              ? 'bg-cta text-white rounded-br-sm'
              : 'bg-cream text-brand rounded-bl-sm border border-border/60'
          }`}
      >
        {msg.text}
      </div>
    </div>
  );
}
