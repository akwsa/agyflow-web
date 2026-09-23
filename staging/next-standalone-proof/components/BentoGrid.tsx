"use client";

import React from "react";
import { GitFork, Plug, Database, ShieldAlert, CheckCircle } from "lucide-react";
import { getDict, type Lang } from "@/lib/i18n";

export default function BentoGrid({ lang = "en" }: { lang?: Lang }) {
  const t = getDict(lang).bento;
  return (
    <section id="bento" className="py-24 bg-[#071224] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
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

        {/* Bento Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[280px]">
          
          {/* Card 1: Large (Span 2 cols, 2 rows) - Tree Hierarchy */}
          <div className="md:col-span-2 lg:col-span-2 md:row-span-2 rounded-2xl glass-panel p-8 flex flex-col justify-between glass-panel-hover relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-64 w-64 bg-brand-mint/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-mint/10 transition-colors" />
            
            <div>
              <div className="h-12 w-12 rounded-xl bg-brand-mint/10 border border-brand-mint/30 flex items-center justify-center text-brand-mint mb-6">
                <GitFork className="h-6 w-6" />
              </div>
              <span className="text-xs font-mono text-brand-mint uppercase tracking-wider">
                {t.card1.tag}
              </span>
              <h3 className="mt-2 text-2xl font-bold text-white">
                {t.card1.title}
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                {t.card1.desc}
              </p>
            </div>

            {/* Tree visual preview */}
            <div className="mt-6 rounded-xl border border-slate-800 bg-[#050c18]/90 p-4 font-mono text-xs text-slate-300">
              <div className="text-brand-cyan">root_orchestrator</div>
              <div className="pl-4 border-l border-slate-700 mt-1">
                <div className="text-emerald-400">├── compliance_agent (Sub-Agent)</div>
                <div className="text-emerald-400">├── support_agent (Sub-Agent)</div>
                <div className="text-indigo-400">└── writers_room (LoopAgent)</div>
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                {t.treeComment}
              </div>
            </div>
          </div>

          {/* Card 2: Medium (Span 2 cols) - Model Context Protocol */}
          <div className="md:col-span-1 lg:col-span-2 rounded-2xl glass-panel p-6 flex flex-col justify-between glass-panel-hover group">
            <div>
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
                  <Plug className="h-5 w-5" />
                </div>
                <span className="text-xs font-mono text-brand-cyan">{t.card2.chip}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">
                {t.card2.title}
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                {t.card2.desc}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
              <CheckCircle className="h-4 w-4 text-brand-mint" />
              <span>{t.card2.foot}</span>
            </div>
          </div>

          {/* Card 3: Session State */}
          <div className="rounded-2xl glass-panel p-6 flex flex-col justify-between glass-panel-hover">
            <div>
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                {t.card3.title}
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                {t.card3.desc} <code className="text-brand-mint">{"{ attractions? }"}</code>
              </p>
            </div>
            <div className="text-[11px] font-mono text-indigo-300">
              {t.card3.foot}
            </div>
          </div>

          {/* Card 4: Enterprise Guardrails */}
          <div className="rounded-2xl glass-panel p-6 flex flex-col justify-between glass-panel-hover">
            <div>
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                {t.card4.title}
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                {t.card4.desc}
              </p>
            </div>
            <div className="text-[11px] font-mono text-amber-400">
              {t.card4.foot}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
