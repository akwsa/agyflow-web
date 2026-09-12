"use client";

import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { getDict, type Lang } from "@/lib/i18n";

export default function PricingSection({ lang = "en" }: { lang?: Lang }) {
  const t = getDict(lang).pricing;

  return (
    <section id="pricing" className="py-24 bg-[#071224] relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-brand-mint/10 blur-[150px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        
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

        {/* Pricing Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Tier 1: Starter */}
          <div className="rounded-2xl border border-slate-800 bg-[#0a1628]/90 p-8 flex flex-col justify-between glass-panel-hover">
            <div>
              <div className="text-sm font-semibold text-slate-300">{t.starter.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  $15
                </span>
                <span className="text-xs text-slate-400">{t.perMonth}</span>
              </div>
              <p className="mt-3 text-xs text-slate-300">
                {t.starter.desc}
              </p>

              <ul className="mt-8 space-y-3">
                {t.starter.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <Check className="h-4 w-4 text-brand-mint shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <Link
                href="https://autosstudio.lemonsqueezy.com/checkout/buy/d8f2e201-3e35-4655-bfed-292247cac734?variant=2018215"
                target="_blank"
                className="w-full block text-center rounded-xl border border-slate-700 bg-slate-800/80 py-3 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
              >
                {t.starter.cta}
              </Link>
            </div>
          </div>

          {/* Tier 2: Pro (Featured) */}
          <div className="relative rounded-2xl border-2 border-brand-mint bg-[#0d1f38] p-8 flex flex-col justify-between shadow-2xl shadow-brand-mint/15 scale-105 z-10">
            {/* Top Pill */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-mint to-brand-cyan px-3 py-0.5 text-[10px] font-bold text-slate-950 uppercase tracking-wider">
              {t.popular}
            </div>

            <div>
              <div className="text-sm font-semibold text-brand-mint">{t.pro.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  $29
                </span>
                <span className="text-xs text-slate-400">{t.perMonth}</span>
              </div>
              <p className="mt-3 text-xs text-slate-300">
                {t.pro.desc}
              </p>

              <ul className="mt-8 space-y-3">
                {t.pro.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
                    <Check className="h-4 w-4 text-brand-mint shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-brand-mint/30">
              <Link
                href="https://autosstudio.lemonsqueezy.com/checkout/buy/d8f2e201-3e35-4655-bfed-292247cac734?variant=2018238"
                target="_blank"
                className="w-full block text-center rounded-xl bg-gradient-to-r from-brand-mint to-brand-cyan py-3 text-xs font-bold text-slate-950 shadow-lg shadow-brand-mint/30 hover:brightness-110 transition-all"
              >
                {t.pro.cta}
              </Link>
            </div>
          </div>

          {/* Tier 3: Agency */}
          <div className="rounded-2xl border border-slate-800 bg-[#0a1628]/90 p-8 flex flex-col justify-between glass-panel-hover">
            <div>
              <div className="text-sm font-semibold text-indigo-400">{t.agency.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  $49
                </span>
                <span className="text-xs text-slate-400">{t.perMonth}</span>
              </div>
              <p className="mt-3 text-xs text-slate-300">
                {t.agency.desc}
              </p>

              <ul className="mt-8 space-y-3">
                {t.agency.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <Check className="h-4 w-4 text-brand-mint shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <Link
                href="https://autosstudio.lemonsqueezy.com/checkout/buy/d8f2e201-3e35-4655-bfed-292247cac734?variant=2018250"
                target="_blank"
                className="w-full block text-center rounded-xl border border-slate-700 bg-slate-800/80 py-3 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
              >
                {t.agency.cta}
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
