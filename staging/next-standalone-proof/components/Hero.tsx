"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardCheck, FileSpreadsheet, Mail, ShieldCheck } from "lucide-react";
import { getDict, type Lang } from "@/lib/i18n";

const previewItems = [
  {
    icon: ClipboardCheck,
    title: "GDPR and DSGVO checklist",
    text: "308 launch checks with blocker flags for consent, fonts, forms, embeds, DPAs, and Art. 30 lite records.",
  },
  {
    icon: FileSpreadsheet,
    title: "Cookie audit workbook",
    text: "Excel and Sheets register for cookies, vendors, DPA status, transfer safeguards, and non-EU vendor counts.",
  },
  {
    icon: Mail,
    title: "Client operations templates",
    text: "Invoice reminders, onboarding checklists, kickoff emails, AI usage rules, and client disclosure language.",
  },
];

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
            <ShieldCheck className="h-3.5 w-3.5" />
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
              href="/products/agency-compliance-toolkit"
              className="inline-flex items-center gap-2 rounded-button bg-brand-mint px-7 py-3.5 text-base font-medium text-neutral-void transition-all duration-200 hover:bg-brand-mint/90 active:scale-96 scale-on-press"
            >
              <span>{t.ctaPrimary}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-button border border-neutral-graphite bg-neutral-carbon/60 px-6 py-3.5 text-base font-medium text-neutral-mist backdrop-blur-md transition-all duration-200 hover:bg-neutral-obsidian hover:text-neutral-paper"
            >
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

          {/* Product Preview */}
          <div className="mt-14 w-full max-w-5xl rounded-card border border-neutral-graphite bg-neutral-carbon/90 p-3 shadow-2xl shadow-black/80 backdrop-blur-2xl">
            <div className="border-b border-neutral-graphite/80 px-4 py-3 text-left">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-mint">
                Inside the agency bundle
              </p>
              <p className="mt-1 text-sm text-neutral-fog">
                Five reusable files for client website launches, sold as one instant ZIP download.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 p-4 text-left md:grid-cols-3">
              {previewItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-card border border-neutral-graphite bg-neutral-obsidian/50 p-4">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-brand-mint">
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-neutral-mist">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
