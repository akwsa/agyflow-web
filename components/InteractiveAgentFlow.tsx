"use client";

import React, { useState } from "react";
import { GitBranch, Repeat, Layers, ArrowRight } from "lucide-react";
import { getDict, type Lang } from "@/lib/i18n";

export default function InteractiveAgentFlow({ lang = "en" }: { lang?: Lang }) {
  const t = getDict(lang).engine;
  const [activeTab, setActiveTab] = useState<"sequential" | "loop" | "parallel">("sequential");

  return (
    <section id="engine" className="relative py-20 border-y border-slate-800 bg-[#060e1d]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3.5 py-1 text-xs font-semibold text-brand-cyan">
            <Layers className="h-3.5 w-3.5" />
            <span>{t.badge}</span>
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-4 text-base text-slate-300">
            {t.subtitle}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900/80 p-1.5 backdrop-blur-md">
            <button
              onClick={() => setActiveTab("sequential")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === "sequential"
                  ? "bg-brand-mint text-slate-950 font-semibold shadow-md shadow-brand-mint/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <GitBranch className="h-4 w-4" />
              <span>{t.tabSeq}</span>
            </button>

            <button
              onClick={() => setActiveTab("loop")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === "loop"
                  ? "bg-brand-mint text-slate-950 font-semibold shadow-md shadow-brand-mint/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Repeat className="h-4 w-4" />
              <span>{t.tabLoop}</span>
            </button>

            <button
              onClick={() => setActiveTab("parallel")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === "parallel"
                  ? "bg-brand-mint text-slate-950 font-semibold shadow-md shadow-brand-mint/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>{t.tabParallel}</span>
            </button>
          </div>
        </div>

        {/* Pipeline Diagram Card */}
        <div className="mt-10 rounded-2xl border border-slate-800 bg-[#0b1b30] p-6 lg:p-10 shadow-xl">
          {activeTab === "sequential" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{t.seq.title}</h3>
                  <p className="text-sm text-slate-300">
                    {t.seq.desc}
                  </p>
                </div>
                <span className="rounded bg-brand-mint/10 border border-brand-mint/30 px-3 py-1 font-mono text-xs text-brand-mint">
                  {t.seq.chip}
                </span>
              </div>

              {/* Steps diagram */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-4">
                  <div className="text-xs font-mono text-brand-cyan">{t.seq.steps[0].step}</div>
                  <div className="mt-1 font-semibold text-white">{t.seq.steps[0].title}</div>
                  <p className="mt-1 text-xs text-slate-400">{t.seq.steps[0].desc}</p>
                </div>

                <div className="hidden md:flex justify-center text-slate-600">
                  <ArrowRight className="h-6 w-6 text-brand-mint animate-pulse" />
                </div>

                <div className="rounded-xl border border-brand-cyan/40 bg-slate-900/90 p-4 shadow-lg shadow-brand-cyan/10">
                  <div className="text-xs font-mono text-brand-mint">{t.seq.steps[1].step}</div>
                  <div className="mt-1 font-semibold text-white">{t.seq.steps[1].title}</div>
                  <p className="mt-1 text-xs text-slate-400">{t.seq.steps[1].desc}</p>
                </div>

                <div className="hidden md:flex justify-center text-slate-600">
                  <ArrowRight className="h-6 w-6 text-brand-mint animate-pulse" />
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-4">
                  <div className="text-xs font-mono text-indigo-400">{t.seq.steps[2].step}</div>
                  <div className="mt-1 font-semibold text-white">{t.seq.steps[2].title}</div>
                  <p className="mt-1 text-xs text-slate-400">{t.seq.steps[2].desc}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "loop" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{t.loop.title}</h3>
                  <p className="text-sm text-slate-300">
                    {t.loop.desc}
                  </p>
                </div>
                <span className="rounded bg-brand-cyan/10 border border-brand-cyan/30 px-3 py-1 font-mono text-xs text-brand-cyan">
                  {t.loop.chip}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-5">
                  <div className="text-xs font-mono text-brand-mint">{t.loop.cards[0].tag}</div>
                  <h4 className="mt-1 font-semibold text-white">{t.loop.cards[0].title}</h4>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {t.loop.cards[0].desc}
                  </p>
                </div>

                <div className="rounded-xl border border-amber-500/30 bg-slate-900/90 p-5">
                  <div className="text-xs font-mono text-amber-400">{t.loop.cards[1].tag}</div>
                  <h4 className="mt-1 font-semibold text-white">{t.loop.cards[1].title}</h4>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {t.loop.cards[1].desc}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-slate-900/90 p-5">
                  <div className="text-xs font-mono text-emerald-400">{t.loop.cards[2].tag}</div>
                  <h4 className="mt-1 font-semibold text-white">{t.loop.cards[2].title}</h4>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {t.loop.cards[2].desc}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "parallel" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{t.par.title}</h3>
                  <p className="text-sm text-slate-300">
                    {t.par.desc}
                  </p>
                </div>
                <span className="rounded bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 font-mono text-xs text-indigo-400">
                  {t.par.chip}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-5">
                  <div className="font-semibold text-brand-mint">{t.par.branches[0].title}</div>
                  <p className="mt-2 text-xs text-slate-400">{t.par.branches[0].desc}</p>
                  <div className="mt-4 font-mono text-[11px] text-emerald-400">output_key: `audit_report`</div>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-5">
                  <div className="font-semibold text-brand-cyan">{t.par.branches[1].title}</div>
                  <p className="mt-2 text-xs text-slate-400">{t.par.branches[1].desc}</p>
                  <div className="mt-4 font-mono text-[11px] text-brand-cyan">output_key: `cookie_report`</div>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-5">
                  <div className="font-semibold text-indigo-400">{t.par.branches[2].title}</div>
                  <p className="mt-2 text-xs text-slate-400">{t.par.branches[2].desc}</p>
                  <div className="mt-4 font-mono text-[11px] text-indigo-400">output_key: `tos_report`</div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
