import { readFile } from "node:fs/promises";

const files = {
  homepage: await readFile(new URL("../lib/i18n.ts", import.meta.url), "utf8"),
  copy: await readFile(new URL("../lib/i18n.ts", import.meta.url), "utf8"),
  pricing: await readFile(new URL("../components/PricingSection.tsx", import.meta.url), "utf8"),
  trustLayer: await readFile(
    new URL("../components/AgencyComplianceTrustLayer.tsx", import.meta.url),
    "utf8",
  ),
  homePage: await readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
};

const required = [
  ["homepage names the Launch Readiness Kit", files.homepage.includes("EU Website Launch Readiness Kit")],
  ["homepage explains the pre-launch outcome", files.homepage.includes("pre-launch review kit")],
  ["pricing uses one-time purchase language", files.copy.includes('oneTime: "one-time"')],
  ["pricing includes a $29 tier", files.copy.includes("$29")],
  ["pricing includes a commercial agency tier", files.copy.includes('name: "Agency License"')],
  ["pricing links to Gumroad", files.pricing.includes("wkagungster.gumroad.com")],
  ["pricing no longer links to Lemon Squeezy", !files.pricing.includes("lemonsqueezy.com")],
  ["kit section uses launch-readiness language", files.trustLayer.includes("EU Website Launch Readiness Kit")],
  ["agent engine is removed from the English homepage", !files.homePage.includes("InteractiveAgentFlow")],
  ["bento engine section is removed from the English homepage", !files.homePage.includes("BentoGrid")],
];

const failures = required.filter(([, passed]) => !passed).map(([label]) => label);

if (failures.length > 0) {
  console.error("Launch readiness check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Launch readiness check passed: ${required.length} assertions.`);
