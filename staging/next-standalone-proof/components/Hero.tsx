"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Terminal, Cpu, ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { getDict, type Lang } from "@/lib/i18n";

export default function Hero({ lang = "en" }: { lang?: Lang }) {
  const t = getDict(lang).hero;
  return (
    <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
      {/* Background ambient lighting - subtle, not overwhelming */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-brand-mint/5 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/4 right-10 h-[450px] w-[450px] rounded-full bg-brand-cyan/5 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-pill border border-neutral-graphite bg-neutral-carbon/60 px-4 py-1.5 text-xs font-medium text-brand-mint backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t.badge}</span>
          </div>

          {/* Main Headline */}
          <h1 className="mt-8 max-w-4xl text-4xl font-semibold tracking-tight text-neutral-paper sm:text-6xl lg:text-7xl" style={{ letterSpacing: '-0.022em' }}>
            {t.title1}{" "}
            <span className="gradient-text">{t.titleAccent}</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-lg text-neutral-mist sm:text-xl font-normal leading-relaxed">
            {t.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-button bg-brand-mint px-7 py-3.5 text-base font-medium text-neutral-void transition-all duration-200 hover:bg-brand-mint/90 active:scale-96 scale-on-press"
            >
              <span>{t.ctaPrimary}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="#engine"
              className="inline-flex items-center gap-2 rounded-button border border-neutral-graphite bg-neutral-carbon/60 px-6 py-3.5 text-base font-medium text-neutral-mist backdrop-blur-md transition-all duration-200 hover:bg-neutral-obsidian hover:text-neutral-paper"
            >
              <Play className="h-4 w-4 fill-current text-brand-cyan" />
              <span>{t.ctaSecondary}</span>
            </Link>
          </div>

          {/* Social Proof Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-fog">
            {t.proof.map((proof, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-mint" />
                <span>{proof}</span>
              </div>
            ))}
          </div>

          {/* Hero Console / App Preview */}
          <div className="mt-14 w-full max-w-5xl rounded-card border border-neutral-graphite bg-neutral-carbon/90 p-3 shadow-2xl shadow-black/80 backdrop-blur-2xl">
            {/* Window header */}
            <div className="flex items-center justify-between border-b border-neutral-graphite/80 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-neutral-fog">
                  agyflow-orchestrator :: runtime-v1.4
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-brand-mint">
                <span className="h-2 w-2 rounded-full bg-brand-mint animate-ping" />
                <span>STATE_ACTIVE</span>
              </div>
            </div>

            {/* Console Mock Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 text-left">
              {/* Box 1: Root Agent */}
              <div className="rounded-card border border-neutral-graphite bg-neutral-obsidian/50 p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-brand-cyan uppercase tracking-wider">
                  <Cpu className="h-4 w-4" />
                  <span>{t.box1.title}</span>
                </div>
                <p className="mt-2 text-xs text-neutral-mist">
                  {t.box1.desc}
                </p>
                <div className="mt-4 rounded bg-neutral-void/80 p-2 font-mono text-[11px] text-neutral-fog">
                  <span className="text-emerald-400">✔</span> {t.box1.log1Label} {t.box1.log1Text}<br />
                  <span className="text-emerald-400">✔</span> {t.box1.log2Label} {t.box1.log2Text}
                </div>
              </div>

              {/* Box 2: Sequential Loop */}
              <div className="rounded-card border border-neutral-graphite bg-neutral-obsidian/50 p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-brand-mint uppercase tracking-wider">
                  <Terminal className="h-4 w-4" />
                  <span>{t.box2.title}</span>
                </div>
                <p className="mt-2 text-xs text-neutral-mist">
                  {t.box2.desc}
                </p>
                <div className="mt-4 rounded bg-neutral-void/80 p-2 font-mono text-[11px] text-neutral-fog">
                  <span className="text-brand-mint">{t.box2.log1Label}</span> {t.box2.log1Text}<br />
                  <span className="text-brand-cyan">{t.box2.log2Label}</span> {t.box2.log2Text}
                </div>
              </div>

              {/* Box 3: Guardrail & Export */}
              <div className="rounded-card border border-neutral-graphite bg-neutral-obsidian/50 p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" />
                  <span>{t.box3.title}</span>
                </div>
                <p className="mt-2 text-xs text-neutral-mist">
                  {t.box3.desc}
                </p>
                <div className="mt-4 rounded bg-neutral-void/80 p-2 font-mono text-[11px] text-neutral-fog">
                  <span className="text-emerald-400">{t.box3.log1Label}</span> {t.box3.log1Text}<br />
                  <span className="text-brand-cyan">{t.box3.log2Label}</span> {t.box3.log2Text}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
