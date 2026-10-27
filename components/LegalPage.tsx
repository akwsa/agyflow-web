import Link from "next/link";
import Footer from "@/components/Footer";
import { type Product } from "@/lib/products-types";

export type LegalSection = {
  title: string;
  body: string[];
};

export type LegalPageProps = {
  title: string;
  description: string;
  effectiveDate: string;
  sections: LegalSection[];
  products: Product[];
};

export default function LegalPage({
  title,
  description,
  effectiveDate,
  sections,
  products,
}: LegalPageProps) {
  return (
    <main className="min-h-[100dvh] bg-neutral-void text-slate-100 flex flex-col">
      <header className="border-b border-neutral-graphite/80 bg-neutral-void/90">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight text-neutral-paper">
            AGY<span className="text-brand-mint">FLOW</span>
          </Link>
          <nav aria-label="Legal page navigation" className="flex items-center gap-5 text-sm">
            <Link href="/" className="text-neutral-fog transition-colors hover:text-brand-mint">
              Home
            </Link>
            <Link href="/products" className="text-neutral-fog transition-colors hover:text-brand-mint">
              Products
            </Link>
          </nav>
        </div>
      </header>

      <article className="flex-1 bg-surface-200">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-widest text-brand-mint">
              Legal information
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-paper sm:text-5xl" style={{ letterSpacing: "-0.022em" }}>
              {title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-neutral-fog">
              {description}
            </p>
            <p className="mt-4 font-mono text-xs text-neutral-ash">
              Effective date: {effectiveDate}
            </p>
          </div>

          <div className="mt-10 rounded-card border border-neutral-graphite bg-neutral-carbon/70 p-5 text-sm leading-relaxed text-neutral-fog">
            <p>
              This page gives general terms for Agyflow digital products and the Agyflow website. It is not legal advice. If a signed agreement or checkout provider term applies to a purchase, that agreement or provider term controls where it conflicts with this page.
            </p>
          </div>

          <div className="mt-10 space-y-8">
            {sections.map((section, index) => (
              <section key={section.title} className="rounded-card border border-neutral-graphite bg-neutral-carbon/60 p-6 sm:p-7">
                <h2 className="text-xl font-semibold tracking-tight text-neutral-paper">
                  {index + 1}. {section.title}
                </h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-neutral-fog">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </article>

      <Footer lang="en" products={products} />
    </main>
  );
}
