"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, MessageSquareText, ReceiptText, ArrowUpRight, Check } from "lucide-react";
import { getDict, type Lang } from "@/lib/i18n";

const productStyles: Record<
  string,
  { icon: typeof ShieldCheck; iconColor: string; iconBg: string }
> = {
  gdpr: {
    icon: ShieldCheck,
    iconColor: "text-brand-mint",
    iconBg: "bg-brand-mint/10 border-brand-mint/30",
  },
  support: {
    icon: MessageSquareText,
    iconColor: "text-brand-cyan",
    iconBg: "bg-brand-cyan/10 border-brand-cyan/30",
  },
  invoice: {
    icon: ReceiptText,
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/10 border-indigo-500/30",
  },
};

export default function ProductSuite({ lang = "en" }: { lang?: Lang }) {
  const t = getDict(lang).products;
  return (
    <section id="products" className="py-24 bg-[#081528] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold tracking-widest text-brand-mint uppercase">
            {t.kicker}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            {t.title}
          </h2>
          <p className="mt-4 text-base text-slate-300">
            {t.subtitle}
          </p>
        </div>

        {/* Product Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.items.map((product) => {
            const style = productStyles[product.id];
            const Icon = style.icon;
            return (
              <div
                key={product.id}
                className="relative rounded-2xl border border-slate-800 bg-[#0c1c33]/90 p-8 flex flex-col justify-between glass-panel-hover"
              >
                <div>
                  {/* Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <div className={`h-12 w-12 rounded-xl border flex items-center justify-center ${style.iconBg}`}>
                      <Icon className={`h-6 w-6 ${style.iconColor}`} />
                    </div>
                    <span className="rounded-full bg-slate-800/80 border border-slate-700 px-3 py-1 text-[11px] font-medium text-slate-300">
                      {product.badge}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-white">
                    {product.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    {product.subtitle}
                  </p>

                  {/* Features */}
                  <ul className="mt-6 space-y-3">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="h-4 w-4 text-brand-mint shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & CTA */}
                <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-sm font-semibold text-white">
                    {product.pricing}
                  </div>
                  <Link
                    href="#pricing"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-mint hover:text-white transition-colors"
                  >
                    <span>{product.ctaText}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
