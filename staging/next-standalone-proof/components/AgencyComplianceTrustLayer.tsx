import Link from "next/link";
import {
  CheckCircle2,
  ClipboardCheck,
  FileSpreadsheet,
  FileText,
  ShieldCheck,
  Users,
} from "lucide-react";

const bundleItems = [
  {
    icon: ClipboardCheck,
    title: "Pre-launch website checklist",
    detail:
      "Review consent, forms, embeds, fonts, data flows, vendor DPAs, and launch blockers before a client site goes live.",
  },
  {
    icon: FileSpreadsheet,
    title: "Cookie and vendor workbook",
    detail:
      "Record third-party tools, consent status, vendor details, transfer safeguards, and the follow-up each item needs.",
  },
  {
    icon: FileText,
    title: "Client-facing audit report",
    detail:
      "Give clients a readable summary of blockers, warnings, owners, and next actions instead of an unstructured list.",
  },
  {
    icon: Users,
    title: "Handoff and remediation templates",
    detail:
      "Ask for missing inputs, explain findings, and close the loop with reusable client emails and handoff checklists.",
  },
  {
    icon: ShieldCheck,
    title: "Choose the right license",
    detail:
      "Choose a personal or agency license so your rights match the way you use the kit in client work.",
  },
];

const perfectFor = [
  "Web designers and developers launching client websites.",
  "Digital agencies managing multiple EU or international domains.",
  "Solo consultants who want reusable compliance and operations templates.",
];

const notFor = [
  "Anyone looking for a generic two-page legal disclaimer.",
  "Enterprise teams that need a custom law-firm compliance program.",
];

const trustBadges = [
  {
    title: "Instant delivery",
    detail: "ZIP download is sent by email after checkout.",
  },
  {
    title: "Commercial rights available",
    detail: "The commercial tier allows use across unlimited client deliverables and direct team sharing.",
  },
  {
    title: "Secure checkout",
    detail: "Payment is processed by Gumroad. Agyflow never sees card numbers.",
  },
  {
    title: "Clear refund policy",
    detail: "If the files are missing, corrupted, or materially different from the product description, contact support within 14 days.",
  },
];

export default function AgencyComplianceTrustLayer() {
  return (
    <section id="agency-toolkit" className="bg-neutral-void py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-mint">
              EU Website Launch Readiness Kit
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-paper sm:text-5xl" style={{ letterSpacing: "-0.022em" }}>
              A repeatable pre-launch review for client websites.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-neutral-fog">
              Built for web freelancers and small agencies that need to spot website risks, document the work, and explain the next step to a client without starting from a blank page.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products/agency-compliance-toolkit"
                className="inline-flex items-center justify-center rounded-button bg-brand-mint px-5 py-3 text-sm font-semibold text-neutral-void transition-colors hover:bg-brand-mint/90"
              >
                See the three ways to buy
              </Link>
              <Link
                href="/products/gdpr-checklist"
                className="inline-flex items-center justify-center rounded-button border border-neutral-graphite bg-neutral-carbon px-5 py-3 text-sm font-medium text-neutral-mist transition-colors hover:border-neutral-smoke hover:text-neutral-paper"
              >
                Start with the $9 checklist
              </Link>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {bundleItems.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="rounded-card border border-neutral-graphite bg-neutral-carbon/80 p-5"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-button bg-brand-mint/10 text-brand-mint">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-neutral-paper">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-fog">
                      {item.detail}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-card border border-neutral-graphite bg-neutral-carbon/70 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-brand-mint">
                  For
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-neutral-fog">
                  {perfectFor.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-mint" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-card border border-neutral-graphite bg-neutral-carbon/70 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-mist">
                  Not for
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-neutral-fog">
                  {notFor.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-neutral-smoke" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trustBadges.map((badge) => (
                <div
                  key={badge.title}
                  className="rounded-card border border-neutral-graphite bg-neutral-carbon/60 p-4"
                >
                  <h3 className="text-sm font-semibold text-neutral-paper">
                    {badge.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-fog">
                    {badge.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
