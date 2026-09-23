import React from "react";

/**
 * ProductCover renders a product's cover image, or a generated
 * typographic cover for products without one (e.g. Montessori —
 * muted earthy / boho palette per product spec).
 */
export default function ProductCover({
  name,
  shortName,
  cover,
  coverTheme,
  className = "",
  sizes = "(max-width: 768px) 100vw, 400px",
  priority = false,
}: {
  name: string;
  shortName: string;
  cover: string | null;
  coverTheme?: "earthy";
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={cover}
        alt={`${name} cover`}
        className={`h-full w-full object-cover ${className}`}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  if (coverTheme === "earthy") {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center ${className}`}
        style={{
          background:
            "linear-gradient(150deg, #e8ded2 0%, #d9c7b2 45%, #c9a98e 100%)",
        }}
        aria-label={`${name} cover`}
        role="img"
      >
        <span
          className="rounded-full border px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
          style={{ borderColor: "#8a6f56", color: "#6d573f" }}
        >
          Montessori · Ages 2–5
        </span>
        <span
          className="font-serif text-2xl font-semibold leading-tight"
          style={{ color: "#4a3826" }}
        >
          Toddler
          <br />
          Busy Book
        </span>
        <span
          className="text-[11px] font-medium tracking-wide"
          style={{ color: "#8a6f56" }}
        >
          40+ pages · A4 + US Letter · Screen-free
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-neutral-carbon p-6 text-center ${className}`}
      aria-label={`${name} cover`}
      role="img"
    >
      <span className="text-lg font-semibold text-neutral-mist">{shortName}</span>
    </div>
  );
}
