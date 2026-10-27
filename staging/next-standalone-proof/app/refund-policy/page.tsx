import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { loadProducts } from "@/lib/products";

const effectiveDate = "September 23, 2026";

export const metadata: Metadata = {
  title: "Refund Policy | Agyflow",
  description:
    "Refund policy for Agyflow digital products sold through Gumroad, Lemon Squeezy, and related checkout providers.",
  alternates: { canonical: "/refund-policy" },
};

const sections = [
  {
    title: "Policy summary",
    body: [
      "Agyflow sells digital downloads. We want buyers to receive working files that match the product page. If a file is missing, corrupted, inaccessible, or materially different from the product description, contact billing@agyflow.com and we will try to fix the issue or review the order for a refund.",
      "As a customer-friendly policy, eligible digital-product orders can be reviewed for refund within 14 days of purchase. Refund approval depends on the product, access history, checkout provider rules, applicable consumer law, and whether the request is genuine and specific.",
    ],
  },
  {
    title: "How to request a refund",
    body: [
      "Email billing@agyflow.com from the email address used at checkout. Include the order identifier, product name, purchase date, checkout provider, and a short explanation of the problem. If you bought through Gumroad or Lemon Squeezy, you may also be able to request a refund through that provider's receipt or customer portal.",
      "We normally respond by email. We may ask for screenshots, the affected file name, your software version, or details needed to confirm the order. Do not send payment card numbers, passwords, private client files, or sensitive personal data.",
    ],
  },
  {
    title: "Refund window",
    body: [
      "Requests should be sent within 14 days of purchase unless a mandatory consumer law gives you a longer right. For digital content, EU and local consumer rules can vary depending on consent to immediate delivery, access to the file, business purchase status, and the checkout provider's role as merchant or reseller.",
      "If the checkout provider is the merchant of record, that provider may make the final refund decision or process the funds on Agyflow's behalf. Agyflow will not ask you to make a second purchase to fix a delivery problem caused by Agyflow or its delivery setup.",
    ],
  },
  {
    title: "Eligible reasons",
    body: [
      "Refunds are most likely to be approved when the purchased file cannot be downloaded, the archive is corrupted, the wrong product was delivered, the product page materially misstated the included formats or license, or the buyer accidentally purchased the same product twice with the same email address.",
      "Before issuing a refund for a technical issue, we may provide a replacement link, resend the file, or offer a corrected version. If the corrected file solves the issue, a refund may no longer be necessary.",
    ],
  },
  {
    title: "Requests we may decline",
    body: [
      "We may decline refund requests where the product has been downloaded and used, the buyer changed their mind after accessing the files, the request is outside the refund window, the buyer expected custom legal advice or consulting that was not sold, the product was redistributed, or the request appears abusive, fraudulent, or connected to a chargeback threat.",
      "We may also decline requests based only on a buyer's failure to read the product description, format list, language list, license terms, or clear disclaimers that the product is a template and not legal advice.",
    ],
  },
  {
    title: "Commercial licenses and client work",
    body: [
      "Commercial License purchases may be refunded under the same review process, but we may ask whether the files were used for client deliverables, agency workflows, team sharing, or resale preparation. If the license has already been used in client work, a refund may be declined unless the product was defective or misdescribed.",
      "If a refund is issued, your license to use the refunded product ends. You must stop using the product files, remove them from shared workspaces, and stop using them for new client deliverables.",
    ],
  },
  {
    title: "Processing time",
    body: [
      "Approved refunds are sent through the original checkout provider or payment method where possible. After approval, the provider, card network, bank, PayPal, or wallet may need additional time to show the funds. Agyflow cannot control bank posting times or provider review delays.",
      "If you opened a chargeback or payment dispute, the checkout provider may lock the order while the dispute is reviewed. In that case, we may need to communicate through the provider's dispute process rather than issuing a separate refund manually.",
    ],
  },
  {
    title: "Taxes, fees, and exchange rates",
    body: [
      "Refunded tax, VAT, platform fees, currency conversion differences, and payment method fees are handled according to the checkout provider's rules and applicable law. The amount returned to your account may differ from the original amount if your bank or payment method applies exchange rates or fees.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For refunds and billing questions, email billing@agyflow.com. For delivery or product support, email support@agyflow.com. For privacy requests connected to a purchase, email gdpr@agyflow.com.",
    ],
  },
];

export default async function RefundPolicyPage() {
  const products = await loadProducts();

  return (
    <LegalPage
      title="Refund Policy"
      description="How Agyflow reviews refunds for digital downloads, commercial licenses, duplicate purchases, delivery problems, and checkout-provider transactions."
      effectiveDate={effectiveDate}
      sections={sections}
      products={products}
    />
  );
}
