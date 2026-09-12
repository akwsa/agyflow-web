"use client";

import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { getDict, type Lang } from "@/lib/i18n";

export default function PricingSection({ lang = "en" }: { lang?: Lang }) {
  const t = getDict(lang).pricing;

  return (
    <section id="pricing" className="py-24 bg-neutral-void relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-brand-mint/5 blur-[150px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-medium tracking-widest text-brand-mint uppercase">
            {t.kicker}
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-paper sm:text-5xl" style={{ letterSpacing: '-0.022em' }}>
            {t.title}
          </h2>
          <p className="mt-4 text-base text-neutral-mist">
            {t.subtitle}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Tier 1: Starter */}
          <div className="rounded-card border border-neutral-graphite bg-neutral-carbon/90 p-8 flex flex-col justify-between glass-panel-hover">
            <div>
              <div className="text-sm font-medium text-neutral-mist">{t.starter.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-semibold text-neutral-paper">
                  $15
                </span>
                <span className="text-xs text-neutral-fog">{t.perMonth}</span>
              </div>
              <p className="mt-3 text-xs text-neutral-mist">
                {t.starter.desc}
              </p>

              <ul className="mt-8 space-y-3">
                {t.starter.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-neutral-mist">
                    <Check className="h-4 w-4 text-brand-mint shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-graphite">
              <Link
                href="https://autosstudio.lemonsqueezy.com/checkout/buy/2018215"
                target="_blank"
                className="w-full block text-center rounded-button border border-neutral-graphite bg-neutral-carbon/80 py-3 text-xs font-medium text-neutral-paper hover:bg-neutral-obsidian transition-colors"
              >
                {t.starter.cta}
              </Link>
            </div>
          </div>

          {/* Tier 2: Pro (Featured) */}
          <div className="relative rounded-card border-2 border-brand-mint bg-neutral-obsidian p-8 flex flex-col justify-between shadow-2xl shadow-brand-mint/15 scale-105 z-10">
            {/* Top Pill */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-pill bg-brand-mint px-3 py-0.5 text-[10px] font-medium text-neutral-void uppercase tracking-wider">
              {t.popular}
            </div>

            <div>
              <div className="text-sm font-medium text-brand-mint">{t.pro.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-semibold text-neutral-paper">
                  $29
                </span>
                <span className="text-xs text-neutral-fog">{t.perMonth}</span>
              </div>
              <p className="mt-3 text-xs text-neutral-mist">
                {t.pro.desc}
              </p>

              <ul className="mt-8 space-y-3">
                {t.pro.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-neutral-mist">
                    <Check className="h-4 w-4 text-brand-mint shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-brand-mint/30">
              <Link
                href="https://autosstudio.lemonsqueezy.com/checkout/buy/2018238"
                target="_blank"
                className="w-full block text-center rounded-button bg-brand-mint py-3 text-xs font-medium text-neutral-void hover:bg-brand-mint/90 transition-all active:scale-96 scale-on-press"
              >
                {t.pro.cta}
              </Link>
            </div>
          </div>

          {/* Tier 3: Agency */}
          <div className="rounded-card border border-neutral-graphite bg-neutral-carbon/90 p-8 flex flex-col justify-between glass-panel-hover">
            <div>
              <div className="text-sm font-medium text-indigo-400">{t.agency.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-semibold text-neutral-paper">
                  $49
                </span>
                <span className="text-xs text-neutral-fog">{t.perMonth}</span>
              </div>
              <p className="mt-3 text-xs text-neutral-mist">
                {t.agency.desc}
              </p>

              <ul className="mt-8 space-y-3">
                {t.agency.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-neutral-mist">
                    <Check className="h-4 w-4 text-brand-mint shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-graphite">
              <Link
                href="https://autosstudio.lemonsqueezy.com/checkout/buy/2018250"
                target="_blank"
                className="w-full block text-center rounded-button border border-neutral-graphite bg-neutral-carbon/80 py-3 text-xs font-medium text-neutral-paper hover:bg-neutral-obsidian transition-colors"
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
