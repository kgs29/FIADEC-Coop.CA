"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ScrollDirectionButton() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"down" | "up">("down");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewport = window.innerHeight;
      const full = document.documentElement.scrollHeight;
      const scrollable = full - viewport;

      setVisible(scrollable > viewport * 0.5);

      if (scrollable <= 0) {
        setMode("down");
        return;
      }
      const progress = scrollY / scrollable;
      setMode(progress > 0.5 ? "up" : "down");
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  if (!visible) return null;

  const handleClick = () => {
    if (mode === "down") {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={mode === "down" ? t("web_scroll_button.to_bottom") : t("web_scroll_button.to_top")}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11 h-11 rounded-full bg-primary/90 backdrop-blur-md border border-white/20 text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary hover:-translate-y-0.5 transition-all duration-300"
    >
      {mode === "down" ? <ArrowDown className="w-5 h-5" /> : <ArrowUp className="w-5 h-5" />}
    </button>
  );
}
