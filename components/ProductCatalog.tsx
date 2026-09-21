"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowUpRight, X } from "lucide-react";
import {
  CATEGORY_LABELS,
  formatPrice,
  type Product,
  type ProductCategory,
} from "@/lib/products-types";
import ProductCover from "@/components/ProductCover";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const SORT_LABELS: Record<SortKey, string> = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  name: "Name A–Z",
};

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-card border border-neutral-graphite bg-neutral-carbon/90 transition-all duration-200 hover:border-neutral-smoke hover:bg-neutral-obsidian hover:shadow-lg hover:shadow-black/40"
    >
      {/* Cover */}
      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-neutral-graphite">
        <div className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]">
          <ProductCover
            name={product.name}
            shortName={product.shortName}
            cover={product.cover}
            coverTheme={product.coverTheme}
          />
        </div>
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-pill border border-neutral-smoke bg-neutral-void/85 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-mist backdrop-blur">
            {CATEGORY_LABELS[product.category]}
          </span>
          {product.badge && (
            <span className="rounded-pill bg-brand-mint px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-void">
              {product.badge}
            </span>
          )}
        </div>
        {product.status === "early-access" && (
          <span className="absolute right-3 top-3 rounded-pill border border-brand-cyan/40 bg-brand-cyan/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand-cyan backdrop-blur">
            Early Access
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold leading-snug text-neutral-paper">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-neutral-fog">
          {product.tagline}
        </p>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-neutral-ash">
          <span>{product.languages.join(" · ")}</span>
          <span className="text-neutral-smoke">/</span>
          <span>{product.format.join(" · ")}</span>
        </div>

        {/* Price row */}
        <div className="mt-5 flex items-center justify-between border-t border-neutral-graphite pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-neutral-paper">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.compareAt && (
              <span className="text-xs text-neutral-ash line-through">
                {formatPrice(product.compareAt, product.currency)}
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-mint transition-colors group-hover:text-neutral-paper">
            View
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ProductCatalog({
  products,
}: {
  products: Product[];
}) {
  const allProducts = useMemo(() => products, [products]);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [sort, setSort] = useState<SortKey>("featured");

  const categories = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.category));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...allProducts];

    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.audience.toLowerCase().includes(q) ||
          p.format.join(" ").toLowerCase().includes(q) ||
          p.languages.join(" ").toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured first, bundle last among equals
        list.sort((a, b) => {
          const fa = a.featured ? 0 : a.category === "bundle" ? 2 : 1;
          const fb = b.featured ? 0 : b.category === "bundle" ? 2 : 1;
          return fa - fb;
        });
    }

    return list;
  }, [allProducts, query, category, sort]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-ash" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, formats, languages…"
            className="w-full rounded-button border border-neutral-graphite bg-neutral-carbon/80 py-2.5 pl-10 pr-9 text-sm text-neutral-paper placeholder:text-neutral-ash focus:border-brand-mint/60 focus:outline-none focus:ring-1 focus:ring-brand-mint/40"
            aria-label="Search products"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-ash hover:text-neutral-paper"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-neutral-ash" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-button border border-neutral-graphite bg-neutral-carbon/80 py-2 pl-3 pr-8 text-sm text-neutral-mist focus:border-brand-mint/60 focus:outline-none"
            aria-label="Sort products"
          >
            {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
              <option key={key} value={key} className="bg-neutral-carbon">
                {SORT_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category pills */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={`rounded-pill border px-3.5 py-1.5 text-xs font-medium transition-colors ${
            category === "all"
              ? "border-brand-mint/60 bg-brand-mint/10 text-brand-mint"
              : "border-neutral-graphite bg-neutral-carbon/60 text-neutral-fog hover:border-neutral-smoke hover:text-neutral-paper"
          }`}
        >
          All ({allProducts.length})
        </button>
        {categories.map((cat) => {
          const count = allProducts.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-pill border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                category === cat
                  ? "border-brand-mint/60 bg-brand-mint/10 text-brand-mint"
                  : "border-neutral-graphite bg-neutral-carbon/60 text-neutral-fog hover:border-neutral-smoke hover:text-neutral-paper"
              }`}
            >
              {CATEGORY_LABELS[cat]} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-card border border-dashed border-neutral-graphite bg-neutral-carbon/50 py-16 text-center">
          <p className="text-sm text-neutral-fog">
            No products match <span className="font-mono text-neutral-mist">“{query}”</span>
            {category !== "all" && (
              <>
                {" "}in <span className="font-mono text-neutral-mist">{CATEGORY_LABELS[category]}</span>
              </>
            )}
            .
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="mt-4 rounded-button border border-neutral-graphite px-4 py-2 text-xs font-medium text-neutral-mist transition-colors hover:border-neutral-smoke hover:text-neutral-paper"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
