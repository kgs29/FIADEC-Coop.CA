"use client";
import { useEffect, useState } from "react";

/**
 * Returns true when the <html> element has the "dark" class.
 * Reacts immediately to any theme toggle via MutationObserver,
 * regardless of which component called the toggle.
 */
export function useIsDark(): boolean {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    update();
    return () => observer.disconnect();
  }, []);

  return isDark;
}
