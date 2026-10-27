"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bot, Menu, X, ArrowRight, Globe } from "lucide-react";
import { getDict, LANGS, type Lang } from "@/lib/i18n";

const LANG_HREF: Record<Lang, string> = { en: "/", de: "/de", fr: "/fr" };

function LangSwitcher({ current, onNavigate }: { current: Lang; onNavigate?: () => void }) {
  const t = getDict(current).nav;
  return (
    <div className="flex items-center gap-1 rounded-button border border-neutral-graphite bg-neutral-carbon/60 px-1.5 py-1">
      <Globe className="h-3.5 w-3.5 text-neutral-fog" />
      {LANGS.map((l) => (
        <Link
          key={l}
          href={LANG_HREF[l]}
          onClick={onNavigate}
          hrefLang={l}
          className={`rounded px-1.5 py-0.5 text-[11px] font-medium uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mint ${
            l === current ? "text-brand-mint" : "text-neutral-fog hover:text-neutral-paper"
          }`}
          aria-label={`Switch language to ${l.toUpperCase()}`}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}

export default function Navbar({ lang = "en" }: { lang?: Lang }) {
  const t = getDict(lang).nav;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-graphite/80 bg-neutral-void/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={LANG_HREF[lang]} className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-card bg-gradient-to-tr from-brand-mint via-brand-cyan to-brand-indigo p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-neutral-void transition-all duration-200 group-hover:bg-transparent">
              <Bot className="h-5 w-5 text-brand-mint group-hover:text-neutral-void transition-colors" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-semibold tracking-tight text-neutral-paper">
              AGY<span className="text-brand-mint">FLOW</span>
            </span>
            <span className="text-[10px] tracking-widest text-neutral-fog font-mono -mt-1">
              {t.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/products"
            className="text-sm font-medium text-neutral-mist hover:text-brand-mint transition-colors"
          >
            {t.products}
          </Link>
          <a
            href="https://killmyidea.agyflow.com"
            className="text-sm font-medium text-neutral-mist hover:text-brand-mint transition-colors"
          >
            {t.ideaScorer}
          </a>
          <Link
            href="/#pricing"
            className="text-sm font-medium text-neutral-mist hover:text-brand-mint transition-colors"
          >
            {t.pricing}
          </Link>
          <Link
            href="/#faq"
            className="text-sm font-medium text-neutral-mist hover:text-brand-mint transition-colors"
          >
            {t.faq}
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="hidden items-center gap-4 md:flex">
          <LangSwitcher current={lang} />
          <Link
            href="/login"
            className="text-sm font-medium text-neutral-mist hover:text-neutral-paper transition-colors"
          >
            {t.signIn}
          </Link>
          <Link
            href="/products/agency-compliance-toolkit"
            className="group relative inline-flex items-center gap-2 rounded-button bg-brand-mint px-4 py-2 text-sm font-medium text-neutral-void transition-all duration-200 hover:bg-brand-mint/90 active:scale-96 scale-on-press"
          >
            <span>{t.deploy}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-button p-2 text-neutral-fog hover:bg-neutral-carbon hover:text-neutral-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mint"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu modal */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="border-b border-neutral-graphite bg-neutral-void px-4 pt-2 pb-6 md:hidden">
          <div className="flex flex-col space-y-3">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-neutral-mist hover:text-brand-mint"
            >
              {t.products}
            </Link>
            <a
              href="https://killmyidea.agyflow.com"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-neutral-mist hover:text-brand-mint"
            >
              {t.ideaScorer}
            </a>
            <Link
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-neutral-mist hover:text-brand-mint"
            >
              {t.pricing}
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-neutral-mist hover:text-brand-mint"
            >
              {t.faq}
            </Link>
            <div className="pt-2">
              <LangSwitcher current={lang} onNavigate={() => setMobileMenuOpen(false)} />
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/products/agency-compliance-toolkit"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-button bg-brand-mint py-2.5 text-sm font-medium text-neutral-void"
              >
                {t.deploy}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
