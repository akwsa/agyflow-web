"use client";

import React from "react";
import Link from "next/link";
import { Bot } from "lucide-react";
import { getDict, type Lang } from "@/lib/i18n";

export default function Footer({ lang = "en" }: { lang?: Lang }) {
  const t = getDict(lang).footer;
  return (
    <footer className="border-t border-slate-800 bg-[#050c18] text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-mint to-brand-cyan p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-[#071224]">
                  <Bot className="h-4 w-4 text-brand-mint" />
                </div>
              </div>
              <span className="text-lg font-bold tracking-wider text-white">
                AGY<span className="text-brand-mint">FLOW</span>
              </span>
            </div>
            <p className="max-w-md text-slate-400 leading-relaxed">
              {t.blurb}
            </p>
            <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.status}</span>
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h4 className="font-semibold text-white tracking-wider uppercase text-[11px] mb-3">
              {t.colProducts}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="#products" className="hover:text-brand-mint transition-colors">
                  {t.productLinks[0]}
                </Link>
              </li>
              <li>
                <Link href="#products" className="hover:text-brand-mint transition-colors">
                  {t.productLinks[1]}
                </Link>
              </li>
              <li>
                <Link href="#products" className="hover:text-brand-mint transition-colors">
                  {t.productLinks[2]}
                </Link>
              </li>
              <li>
                <Link href="#engine" className="hover:text-brand-mint transition-colors">
                  {t.productLinks[3]}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance Column */}
          <div>
            <h4 className="font-semibold text-white tracking-wider uppercase text-[11px] mb-3">
              {t.colTrust}
            </h4>
            <ul className="space-y-2">
              {t.trust.map((item, idx) => (
                <li key={idx}>
                  <span className="text-slate-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Support Emails Column */}
          <div>
            <h4 className="font-semibold text-white tracking-wider uppercase text-[11px] mb-3">
              {t.colSupport}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:gdpr@agyflow.com" className="hover:text-brand-mint transition-colors flex items-center gap-1.5">
                  <span className="text-slate-400">{t.labels.gdpr}</span>
                  <span className="text-brand-mint font-mono">gdpr@agyflow.com</span>
                </a>
              </li>
              <li>
                <a href="mailto:support@agyflow.com" className="hover:text-brand-mint transition-colors flex items-center gap-1.5">
                  <span className="text-slate-400">{t.labels.ai}</span>
                  <span className="text-brand-cyan font-mono">support@agyflow.com</span>
                </a>
              </li>
              <li>
                <a href="mailto:billing@agyflow.com" className="hover:text-brand-mint transition-colors flex items-center gap-1.5">
                  <span className="text-slate-400">{t.labels.billing}</span>
                  <span className="text-indigo-300 font-mono">billing@agyflow.com</span>
                </a>
              </li>
              <li>
                <a href="mailto:hello@agyflow.com" className="hover:text-brand-mint transition-colors flex items-center gap-1.5">
                  <span className="text-slate-400">{t.labels.general}</span>
                  <span className="text-slate-200 font-mono">hello@agyflow.com</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-10 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 text-[11px] text-slate-300 leading-relaxed">
          <p>
            <strong className="text-slate-200">{t.disclaimerTitle}</strong> {t.disclaimer}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-300">
          <p>© {new Date().getFullYear()} {t.rights}</p>
          <div className="flex items-center gap-6">
            <span>{t.built}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
