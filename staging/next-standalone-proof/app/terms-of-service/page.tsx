import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { loadProducts } from "@/lib/products";

const effectiveDate = "September 23, 2026";

export const metadata: Metadata = {
  title: "Terms of Service | Agyflow",
  description:
    "Terms of service for Agyflow digital downloads, commercial licenses, checkout providers, and website use.",
  alternates: { canonical: "/terms-of-service" },
};

const sections = [
  {
    title: "Who these terms apply to",
    body: [
      "These Terms of Service apply when you visit agyflow.com, buy an Agyflow digital product, download a product file, use a license key or download link, or contact Agyflow for support. By using the website or buying a product, you agree to these terms.",
      "Agyflow sells downloadable templates, checklists, spreadsheets, policy drafts, onboarding files, and related digital business materials. These materials are practical tools, not legal advice, financial advice, tax advice, or a substitute for qualified professional review.",
    ],
  },
  {
    title: "Checkout and payment providers",
    body: [
      "Agyflow products may be sold through Gumroad, Lemon Squeezy, or another named checkout provider. The checkout provider may act as merchant of record, reseller, payment processor, tax calculator, file delivery provider, or invoice issuer for the purchase.",
      "You must provide accurate billing and contact information during checkout. Payment disputes, chargebacks, VAT, sales tax, local payment methods, and payment security may be handled under the checkout provider's own terms in addition to these terms.",
    ],
  },
  {
    title: "Digital delivery",
    body: [
      "Products are delivered as digital downloads, links, ZIP files, spreadsheets, documents, Notion templates, Markdown files, PDFs, or similar electronic files. Delivery is normally immediate after successful checkout, but email filters, provider review, payment checks, or network issues can delay access.",
      "If a download link fails or a purchased file is missing, contact support@agyflow.com with the email address used at checkout and your order identifier. Do not share download links publicly or with people outside the scope of your license.",
    ],
  },
  {
    title: "License grant",
    body: [
      "Unless a product page, checkout page, or included LICENSE.txt says otherwise, Agyflow grants you a non-exclusive, non-transferable license to use the purchased product for your own business operations. You may edit the templates and create internal working documents from them.",
      "A Commercial License, where purchased or included, allows use for client projects, agency deliverables, and internal team workflows for the buyer's organization. It does not allow resale of the original files, redistribution as a competing template pack, public posting of the source files, or transfer of the license to another business.",
      "An Individual License, where offered, is for one person or one business owner and does not include redistribution, marketplace resale, or broad team sharing unless the product page explicitly allows it.",
    ],
  },
  {
    title: "Restrictions",
    body: [
      "You may not resell, sublicense, upload, publish, share, scrape, clone, or distribute Agyflow product files as standalone products or as part of a competing template library. You may not remove license notices, claim authorship of the original files, or use the files in a way that infringes third-party rights or violates law.",
      "You may not use agyflow.com to attack, overload, reverse engineer, bypass access controls, test stolen payment methods, harvest email addresses, or interfere with the website, hosting account, analytics, checkout, or product delivery systems.",
    ],
  },
  {
    title: "Compliance and legal review",
    body: [
      "Agyflow products may mention GDPR, DSGVO, privacy policies, AI disclosure, cookie audits, invoicing, onboarding, or other regulated topics. The products help you organize work and draft documents, but they do not guarantee legal compliance and do not create an attorney-client relationship.",
      "You are responsible for adapting each file to your jurisdiction, business model, client contract, data flows, and professional obligations. Have qualified legal counsel review policy documents, client-facing terms, privacy notices, and compliance claims before formal use.",
    ],
  },
  {
    title: "Updates and product changes",
    body: [
      "Agyflow may update product files, product descriptions, pricing, included formats, checkout providers, or licensing language. Unless a product page promises a specific update period, a purchase gives you access to the files delivered at the time of purchase and any updates Agyflow chooses to provide through the same delivery channel.",
      "We may remove or replace products that are outdated, unavailable, duplicated, or no longer suitable for sale. Existing buyers can contact support if they need access to a past order that is still available in our records.",
    ],
  },
  {
    title: "Refunds and cancellations",
    body: [
      "Refund requests are handled under the Refund Policy at /refund-policy and under the checkout provider rules that apply to the transaction. Because products are digital downloads, we may consider whether files were accessed, whether the request is timely, whether there is a technical defect, and whether the request appears abusive or fraudulent.",
      "If a subscription or hosted service is later offered, cancellation will stop future billing according to the plan terms, but it will not automatically refund past charges unless the product page or checkout terms say so.",
    ],
  },
  {
    title: "Disclaimers",
    body: [
      "The website and products are provided as available. We do not promise that every file will fit your exact legal, tax, accounting, compliance, design, educational, or commercial situation. We do not promise uninterrupted website access, permanent hosting of download links, or compatibility with every software version.",
      "To the fullest extent allowed by law, Agyflow disclaims implied warranties of merchantability, fitness for a particular purpose, non-infringement, and legal sufficiency of any document created from a template.",
    ],
  },
  {
    title: "Liability limit",
    body: [
      "To the fullest extent allowed by law, Agyflow will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, including lost profits, lost revenue, loss of data, business interruption, or legal penalties arising from use of the website or products.",
      "Where liability cannot be excluded, Agyflow's total liability for a claim will be limited to the amount you paid for the product that caused the claim, unless applicable law requires a higher amount.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For product support, email support@agyflow.com. For billing and refund questions, email billing@agyflow.com. For privacy or GDPR questions, email gdpr@agyflow.com. We may update these terms by posting a revised version on this page with a new effective date.",
    ],
  },
];

export default async function TermsOfServicePage() {
  const products = await loadProducts();

  return (
    <LegalPage
      title="Terms of Service"
      description="The rules for using agyflow.com, buying Agyflow digital products, and applying the included individual or commercial licenses."
      effectiveDate={effectiveDate}
      sections={sections}
      products={products}
    />
  );
}
