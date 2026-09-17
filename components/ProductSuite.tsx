"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Layers } from "lucide-react";
import { getDict, type Lang } from "@/lib/i18n";
import {
  getIndividualProducts,
  getBundleProduct,
  formatPrice,
} from "@/lib/products";
import ProductCover from "@/components/ProductCover";

export default function ProductSuite({ lang = "en" }: { lang?: Lang }) {
  const t = getDict(lang).shop;
  const products = getIndividualProducts();
  const bundle = getBundleProduct();

  return (
    <section id="products" className="py-24 bg-[#081528] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-6 text-center max-w-3xl mx-auto md:flex-row md:items-end md:justify-between md:text-left">
          <div>
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
          <Link
            href="/products"
            className="group hidden shrink-0 items-center gap-2 rounded-button border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-brand-mint/50 hover:text-white md:inline-flex"
          >
            {t.viewAll}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Product Cards — data-driven from data/products.json */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#0c1c33]/90 glass-panel-hover"
            >
              {/* Cover */}
              <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-slate-800">
                <div className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]">
                  <ProductCover
                    name={product.name}
                    shortName={product.shortName}
                    cover={product.thumb ?? product.cover}
                    coverTheme={product.coverTheme}
                  />
                </div>
                {product.badge && (
                  <span className="absolute left-3 top-3 rounded-pill bg-brand-mint px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#071224]">
                    {product.badge}
                  </span>
                )}
                {product.status === "early-access" && (
                  <span className="absolute right-3 top-3 rounded-pill border border-brand-cyan/40 bg-brand-cyan/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand-cyan backdrop-blur">
                    Early Access
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold text-white">
                  {product.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-xs text-slate-300 leading-relaxed">
                  {product.tagline}
                </p>

                {/* Meta */}
                <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] text-slate-400">
                  <span>{product.languages.join(" · ")}</span>
                  <span className="text-slate-600">/</span>
                  <span>{product.format.join(" · ")}</span>
                </div>

                {/* Price row */}
                <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-5 mt-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-white">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    <span className="text-[10px] text-slate-400">{t.oneTime}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-mint transition-colors group-hover:text-white">
                    {t.view}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* Bundle card */}
          {bundle && (
            <Link
              href={`/products/${bundle.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-brand-mint/60 bg-[#0c1c33] shadow-2xl shadow-brand-mint/10 glass-panel-hover"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-brand-mint/30">
                <div className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]">
                  <ProductCover
                    name={bundle.name}
                    shortName={bundle.shortName}
                    cover={bundle.thumb ?? bundle.cover}
                  />
                </div>
                <span className="absolute left-3 top-3 rounded-pill bg-brand-mint px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#071224]">
                  {bundle.badge}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold text-white">
                  {t.bundleTitle}
                </h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  {t.bundleText}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] text-slate-400">
                  <span>{bundle.stats[0]?.value} products</span>
                  <span className="text-slate-600">/</span>
                  <span>{bundle.languages.join(" · ")}</span>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-brand-mint/30 pt-5 mt-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-white">
                      {formatPrice(bundle.price, bundle.currency)}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {formatPrice(bundle.compareAt ?? 0, bundle.currency)}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-mint transition-colors group-hover:text-white">
                    {t.bundleCta}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Mobile view-all */}
        <div className="mt-10 text-center md:hidden">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-button border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-brand-mint/50 hover:text-white"
          >
            <Layers className="h-4 w-4" />
            {t.viewAll}
          </Link>
        </div>

      </div>
    </section>
  );
}
