"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Terminal, Cpu, ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { getDict, type Lang } from "@/lib/i18n";

export default function Hero({ lang = "en" }: { lang?: Lang }) {
  const t = getDict(lang).hero;
  return (
    <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-brand-mint/10 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/4 right-10 h-[450px] w-[450px] rounded-full bg-brand-cyan/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-mint/30 bg-brand-mint/10 px-4 py-1.5 text-xs font-semibold text-brand-mint backdrop-blur-md badge-glow">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>{t.badge}</span>
          </div>

          {/* Main Headline */}
          <h1 className="mt-8 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            {t.title1}{" "}
            <span className="gradient-text">{t.titleAccent}</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl font-normal leading-relaxed">
            {t.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-mint via-brand-cyan to-brand-mint bg-[length:200%_auto] px-7 py-3.5 text-base font-semibold text-slate-950 shadow-xl shadow-brand-mint/20 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span>{t.ctaPrimary}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="#engine"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3.5 text-base font-medium text-slate-200 backdrop-blur-md transition-all duration-300 hover:bg-slate-800 hover:text-white"
            >
              <Play className="h-4 w-4 fill-current text-brand-cyan" />
              <span>{t.ctaSecondary}</span>
            </Link>
          </div>

          {/* Social Proof Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            {t.proof.map((proof, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-mint" />
                <span>{proof}</span>
              </div>
            ))}
          </div>

          {/* Hero Console / App Preview */}
          <div className="mt-14 w-full max-w-5xl rounded-2xl border border-slate-800 bg-[#081528]/90 p-3 shadow-2xl shadow-black/80 backdrop-blur-2xl ring-1 ring-white/10">
            {/* Window header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400">
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
              <div className="rounded-xl border border-brand-cyan/20 bg-[#0c1c33] p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-cyan uppercase tracking-wider">
                  <Cpu className="h-4 w-4" />
                  <span>{t.box1.title}</span>
                </div>
                <p className="mt-2 text-xs text-slate-300">
                  {t.box1.desc}
                </p>
                <div className="mt-4 rounded bg-slate-950/80 p-2 font-mono text-[11px] text-slate-400">
                  <span className="text-emerald-400">✔</span> {t.box1.log1Label} {t.box1.log1Text}<br />
                  <span className="text-emerald-400">✔</span> {t.box1.log2Label} {t.box1.log2Text}
                </div>
              </div>

              {/* Box 2: Sequential Loop */}
              <div className="rounded-xl border border-brand-mint/20 bg-[#0c1c33] p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-mint uppercase tracking-wider">
                  <Terminal className="h-4 w-4" />
                  <span>{t.box2.title}</span>
                </div>
                <p className="mt-2 text-xs text-slate-300">
                  {t.box2.desc}
                </p>
                <div className="mt-4 rounded bg-slate-950/80 p-2 font-mono text-[11px] text-slate-400">
                  <span className="text-brand-mint">{t.box2.log1Label}</span> {t.box2.log1Text}<br />
                  <span className="text-brand-cyan">{t.box2.log2Label}</span> {t.box2.log2Text}
                </div>
              </div>

              {/* Box 3: Guardrail & Export */}
              <div className="rounded-xl border border-brand-indigo/30 bg-[#0c1c33] p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" />
                  <span>{t.box3.title}</span>
                </div>
                <p className="mt-2 text-xs text-slate-300">
                  {t.box3.desc}
                </p>
                <div className="mt-4 rounded bg-slate-950/80 p-2 font-mono text-[11px] text-slate-400">
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
