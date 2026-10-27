import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { loadProducts } from "@/lib/products";

const effectiveDate = "September 23, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy | Agyflow",
  description:
    "Privacy policy for Agyflow digital products, website analytics, checkout processors, and GDPR or DSGVO rights.",
  alternates: { canonical: "/privacy-policy" },
};

const sections = [
  {
    title: "Controller and contact",
    body: [
      "Agyflow operates agyflow.com and sells digital downloads for freelancers, agencies, and digital creators. For questions about privacy, GDPR, DSGVO, or data rights, contact gdpr@agyflow.com. For support requests, contact support@agyflow.com.",
      "If you buy through Gumroad or Lemon Squeezy, that checkout provider acts as the merchant, payment processor, tax handler, or reseller for the transaction as described in its own terms and privacy policy. Agyflow receives the order details needed to deliver the product, provide support, and maintain business records.",
    ],
  },
  {
    title: "Personal data we process",
    body: [
      "We may process your name, email address, billing country, order identifier, purchased product, license type, invoice or tax status, support messages, and technical information such as IP address, browser type, device type, referring page, and security logs.",
      "We do not request payment card numbers on agyflow.com. Card, PayPal, Apple Pay, Google Pay, VAT, and sales tax processing is handled by the checkout provider you use. Agyflow may receive confirmation that a payment succeeded, failed, was refunded, or was disputed.",
    ],
  },
  {
    title: "Legal basis under GDPR and DSGVO",
    body: [
      "We process order and delivery data to perform a contract under Article 6(1)(b) GDPR. We process accounting, tax, fraud prevention, and record keeping data to meet legal obligations under Article 6(1)(c) GDPR. We process security logs, customer support history, product improvement signals, and basic website analytics based on legitimate interests under Article 6(1)(f) GDPR.",
      "Where you consent to receive optional messages, we process that data under Article 6(1)(a) GDPR. You can withdraw consent at any time without affecting processing that happened before withdrawal.",
    ],
  },
  {
    title: "Analytics and cookies",
    body: [
      "Agyflow uses Plausible Analytics to understand page visits and referral sources. Plausible is configured as privacy-friendly analytics that does not use cookies, does not create cross-site profiles, and reports aggregate statistics rather than individual visitor histories.",
      "The checkout provider may use its own cookies or fraud prevention technologies when you leave agyflow.com for checkout. Those cookies are controlled by Gumroad, Lemon Squeezy, or the payment method provider, not by Agyflow.",
    ],
  },
  {
    title: "Processors and third-party services",
    body: [
      "We use service providers only where needed to run the website, deliver products, process payments, handle taxes, answer support requests, prevent abuse, and maintain records. Current relevant providers include Plausible for analytics, Gumroad and Lemon Squeezy for checkout and digital delivery, hosting and DNS providers for the website, and email providers for support communications.",
      "These providers may process data in the European Economic Area, the United Kingdom, the United States, Indonesia, or other countries where they operate. Where required, transfers rely on adequacy decisions, standard contractual clauses, data processing agreements, or the provider's lawful transfer mechanism.",
    ],
  },
  {
    title: "Product files, licenses, and customer records",
    body: [
      "Agyflow products are digital files and templates. We keep purchase records so we can verify access, provide product updates, confirm the license you bought, handle refunds, and respond to disputes. Commercial license purchases may be retained as evidence of usage rights for agency and client work.",
      "We do not use your private documents, client data, or uploaded files to train AI models. If you send us support material, use test data or redact client information unless the information is necessary for the support request.",
    ],
  },
  {
    title: "Retention",
    body: [
      "We keep order, refund, invoice, tax, and license records for as long as needed for accounting, tax, legal, fraud prevention, and customer support purposes. Support emails are kept for a reasonable period so we can resolve follow-up issues. Security logs are normally kept for shorter operational periods unless needed to investigate abuse or protect the service.",
      "When data is no longer needed, we delete it, anonymize it, or keep only the minimum record required by law or legitimate business needs.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "Depending on your location, you may have the right to access, correct, delete, restrict, object to processing, receive a portable copy of your data, withdraw consent, and lodge a complaint with a supervisory authority. In Germany, these rights apply under the GDPR and the German Federal Data Protection Act where relevant.",
      "To exercise your rights, email gdpr@agyflow.com from the address connected to your order. We may need to verify your identity before changing or disclosing personal data. If the relevant data is controlled by Gumroad or Lemon Squeezy, we may direct you to that provider or work with them to answer the request.",
    ],
  },
  {
    title: "Children and sensitive data",
    body: [
      "Agyflow is intended for business users and adults. We do not knowingly sell products to children or collect personal data from children. Do not send health data, government identifiers, payment card numbers, passwords, client secrets, or other sensitive data through support unless we explicitly request a safe transfer method.",
    ],
  },
  {
    title: "Changes to this policy",
    body: [
      "We may update this privacy policy when our products, processors, analytics setup, or legal obligations change. The effective date at the top of the page shows when this version took effect. Material changes will be reflected on this page before or when they become active.",
    ],
  },
];

export default async function PrivacyPolicyPage() {
  const products = await loadProducts();

  return (
    <LegalPage
      title="Privacy Policy"
      description="How Agyflow handles personal data for website visitors, digital-product buyers, support contacts, and license holders."
      effectiveDate={effectiveDate}
      sections={sections}
      products={products}
    />
  );
}
