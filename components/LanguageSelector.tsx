"use client";

import React, { useEffect, useState, useRef } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { Language } from "@/lib/i18n";

export default function LanguageSelector({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguageStore();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("gaddvya_lang") as Language | null;
    if (saved && (saved === "en" || saved === "hi" || saved === "pa")) {
      setLang(saved);
    }
  }, [setLang]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages: { code: Language; label: string; script: string; flag: string }[] = [
    { code: "en", label: "English", script: "English", flag: "🇬🇧" },
    { code: "hi", label: "Hindi", script: "हिंदी", flag: "🇮🇳" },
    { code: "pa", label: "Punjabi", script: "ਪੰਜਾਬੀ", flag: "🌾" },
  ];

  const current = languages.find((l) => l.code === lang) || languages[0];

  if (!mounted) {
    return (
      <div className={`px-2.5 py-1 text-xs rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 ${className}`}>
        🌐 English
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-zinc-100 border border-zinc-750 dark:border-zinc-800 light:border-zinc-300 text-zinc-200 dark:text-zinc-200 light:text-zinc-800 hover:text-white transition shadow-sm cursor-pointer"
        aria-expanded={open}
        title="Select Language / भाषा चुनें / ਭਾਸ਼ਾ ਚੁਣੋ"
      >
        <span>{current.flag}</span>
        <span className="font-medium">{current.script}</span>
        <svg
          className={`w-3 h-3 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-zinc-900/95 dark:bg-zinc-900/95 light:bg-white border border-zinc-750 dark:border-zinc-800 light:border-zinc-200 shadow-2xl backdrop-blur-xl z-50 py-1.5 animate-fadeIn">
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition cursor-pointer ${
                lang === l.code
                  ? "bg-white text-black dark:bg-white dark:text-black light:bg-black light:text-white font-bold"
                  : "text-zinc-300 dark:text-zinc-300 light:text-zinc-700 hover:bg-zinc-800 dark:hover:bg-zinc-800 light:hover:bg-zinc-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{l.flag}</span>
                <span>{l.script}</span>
              </div>
              {lang === l.code && <span>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
