"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { getDict, type Lang } from "@/lib/i18n";

export default function FaqSection({ lang = "en" }: { lang?: Lang }) {
  const t = getDict(lang).faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-[#081528] border-t border-slate-800/80">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center">
          <span className="text-xs font-semibold tracking-widest text-brand-mint uppercase">
            {t.kicker}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.title}
          </h2>
        </div>

        <div className="mt-12 space-y-4">
          {t.items.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800/80 bg-[#0c1c33]/70 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-medium text-white hover:text-brand-mint transition-colors"
                >
                  <span className="text-sm font-semibold">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? "rotate-180 text-brand-mint" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
