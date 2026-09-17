"use client";

import { EMAIL_ADDRESS, LOCATION, PHONE } from "@/constants/env";
import { Bot, MessageCircle, Send, User, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Message = {
  id: number;
  from: "bot" | "user";
  text: string;
  link?: { href: string; label: string };
};

export default function ChatWidget() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ id: 0, from: "bot", text: t("web_chat.welcome") }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const topics: { key: string; label: string; reply: string; link?: { href: string; label: string } }[] = [
    {
      key: "services",
      label: t("web_chat.topic_services"),
      reply: t("web_chat.reply_services"),
      link: { href: "/web/services", label: t("web_chat.link_services") },
    },
    {
      key: "quote",
      label: t("web_chat.topic_quote"),
      reply: t("web_chat.reply_quote"),
      link: { href: "/web/contact-us", label: t("web_chat.link_contact") },
    },
    {
      key: "hours",
      label: t("web_chat.topic_hours"),
      reply: t("web_chat.reply_hours", { phone: PHONE, location: LOCATION, email: EMAIL_ADDRESS }),
    },
  ];

  const pushMessage = (msg: Omit<Message, "id">) => {
    nextId.current += 1;
    const id = nextId.current;
    setMessages((prev) => [...prev, { id, ...msg }]);
  };

  const handleTopic = (topic: (typeof topics)[number]) => {
    pushMessage({ from: "user", text: topic.label });
    pushMessage({ from: "bot", text: topic.reply, link: topic.link });
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    pushMessage({ from: "user", text: value });
    setInput("");
    pushMessage({
      from: "bot",
      text: t("web_chat.reply_fallback"),
      link: { href: "/web/contact-us", label: t("web_chat.link_contact") },
    });
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 md:right-6 z-40 w-[calc(100vw-2rem)] max-w-sm h-[28rem] flex flex-col bg-card/95 backdrop-blur-xl border border-border rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">{t("web_chat.title")}</p>
                <p className="text-xs text-white/75 leading-tight">{t("web_chat.subtitle")}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("web_chat.close")}
              className="p-1.5 rounded-full hover:bg-white/15 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex items-end gap-2 ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                {m.from === "bot" && (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.from === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  <p>{m.text}</p>
                  {m.link && (
                    <Link
                      href={m.link.href}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      onClick={() => setOpen(false)}
                    >
                      {m.link.label} →
                    </Link>
                  )}
                </div>
                {m.from === "user" && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          <div className="px-3 pb-2 flex flex-wrap gap-1.5">
            {topics.map((topic) => (
              <button
                key={topic.key}
                type="button"
                onClick={() => handleTopic(topic)}
                className="text-xs px-2.5 py-1.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
              >
                {topic.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t border-border">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("web_chat.input_placeholder")}
              className="flex-1 min-w-0 px-3 py-2 text-sm bg-muted rounded-full border border-transparent focus:outline-none focus:border-primary/40 transition-colors"
            />
            <button
              type="submit"
              aria-label={t("web_chat.send")}
              className="w-9 h-9 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/85 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("web_chat.close") : t("web_chat.open")}
        className="fixed bottom-6 right-4 md:right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 transition-transform duration-300"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  );
}
