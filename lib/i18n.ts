export type Lang = "en" | "de" | "fr";

export const LANGS: Lang[] = ["en", "de", "fr"];

const en = {
  meta: {
    title: "Agyflow | Autonomous Multi-Agent Workflows for Digital Teams",
    description:
      "Orchestrate specialized AI agents, streamline customer support, generate GDPR compliance documents, and run automated business pipelines on agyflow.com.",
    keywords: [
      "AI agents",
      "multi-agent workflows",
      "ADK multi-agent",
      "GDPR generator",
      "AI customer support",
      "SaaS workspace",
      "Agyflow",
    ],
    ogTitle: "Agyflow | Autonomous Multi-Agent Workflows",
    ogDescription:
      "Orchestrate specialized AI agents and automate your business operations with agyflow.com.",
    twitterDescription:
      "Orchestrate specialized AI agents and automated pipelines with agyflow.com",
  },
  nav: {
    tagline: "AUTONOMOUS SUITE",
    engine: "Agent Engine",
    products: "Products",
    features: "Features",
    pricing: "Pricing",
    faq: "FAQ",
    signIn: "Sign In",
    deploy: "Deploy Workflow",
  },
  hero: {
    badge: "Autonomous Multi-Agent Architecture • Google ADK & MCP Ready",
    title1: "Orchestrate AI Agents into",
    titleAccent: "Unstoppable Workflows",
    subtitle:
      "Replace chaotic manual operations with self-orchestrating agent teams. Deploy GDPR compliance generators, automated customer support, and deterministic business pipelines with complete control.",
    ctaPrimary: "Get Started Free",
    ctaSecondary: "Explore Agent Engine",
    proof: [
      "EU GDPR & Privacy Ready",
      "Lemon Squeezy Billing Integrated",
      "Deterministic State Synchronization",
    ],
    box1: {
      title: "Root Orchestrator",
      desc: "Receives human intent, maps tasks, and dispatches sub-agents in tree topology.",
      log1Label: "Dispatched:",
      log1Text: "3 agents",
      log2Label: "Policy:",
      log2Text: "Guardrail Pass",
    },
    box2: {
      title: "Writers Room (Loop)",
      desc: "Researcher → Screenwriter → Critic evaluation loop until criteria is reached.",
      log1Label: "Loop #2:",
      log1Text: "Critic approved",
      log2Label: "exit_loop:",
      log2Text: "True",
    },
    box3: {
      title: "Legal & Compliance Shield",
      desc: "Auto-sanitizes PII, validates budget constraints, and formats final deliverables.",
      log1Label: "GDPR Score:",
      log1Text: "100% Valid",
      log2Label: "Export:",
      log2Text: "Hosted Page + PDF",
    },
  },
  engine: {
    badge: "Multi-Agent Execution Engine",
    title: "Predictable Pipelines. Deterministic Results.",
    subtitle:
      "Switch from chaotic single prompts to structured multi-agent topologies based on Google ADK patterns and the Model Context Protocol (MCP).",
    tabSeq: "Sequential Agent",
    tabLoop: "Loop Agent",
    tabParallel: "Parallel Fan-Out",
    seq: {
      title: "Sequential Assembly Pipeline",
      desc: "Executes sub-agents in strict linear succession. Output of one agent feeds context to the next.",
      chip: "Execution: Linear (100% Deterministic)",
      steps: [
        {
          step: "STEP 01",
          title: "Input Analysis",
          desc: "Extracts user goals, language, and constraints.",
        },
        {
          step: "STEP 02",
          title: "Document Synthesis",
          desc: "Generates legal clauses or support drafts.",
        },
        {
          step: "STEP 03",
          title: "Compliance Export",
          desc: "Renders live hosted URLs and PDF documents.",
        },
      ],
    },
    loop: {
      title: "Iterative Refinement Loop (Writers Room)",
      desc: "Sub-agents generate, critique, and refine content cyclically until the policy guardrail triggers `exit_loop`.",
      chip: "Max Iterations: 5 Cycles",
      cards: [
        {
          tag: "01. GENERATOR",
          title: "Author Agent",
          desc: "Drafts the customer reply or policy based on uploaded knowledge base files.",
        },
        {
          tag: "02. CRITIC & EVALUATOR",
          title: "Policy Evaluator",
          desc: "Evaluates tone, safety guidelines, and missing GDPR articles. Loops back if score < 95%.",
        },
        {
          tag: "03. TERMINATION TOOL",
          title: "exit_loop Trigger",
          desc: "Once all criteria are met, executes `exit_loop` and transfers control to the deployment phase.",
        },
      ],
    },
    par: {
      title: "Parallel Fan-Out & Gather",
      desc: "Spawns multiple isolated agents simultaneously for speed, gathering reports without shared-state conflicts.",
      chip: "Latency Reduction: Up to 4x",
      branches: [
        {
          title: "Branch A: Privacy Audit",
          desc: "Runs full scan against EU 2016/679 GDPR mandates.",
        },
        {
          title: "Branch B: Cookie Consent",
          desc: "Scrapes third-party scripts and compiles cookie banner text.",
        },
        {
          title: "Branch C: Terms of Service",
          desc: "Drafts liability limits, dispute resolution, and refund policies.",
        },
      ],
    },
  },
  bento: {
    kicker: "Architectural Excellence",
    title: "Engineered for High-Reliability Operations",
    subtitle:
      "Agyflow blends Google ADK tree-routing and universal MCP connectors to build digital workspaces that never break down.",
    card1: {
      tag: "Google ADK Topology",
      title: "Hierarchical Tree Routing",
      desc: "Eliminate chaos and hallucinations with strict routing rules. Agents can only transfer context to their sub-agents, back to their parent, or to sibling peers—preventing cross-context contamination.",
    },
    treeComment: "# Strict transfer enforcement: Peer-to-peer allowed",
    card2: {
      chip: "STANDARDIZED",
      title: "Universal MCP Integration",
      desc: "Connect external databases, Shopify webhooks, Google Maps, or custom APIs effortlessly using the Model Context Protocol standard.",
      foot: "No custom API wrappers required",
    },
    card3: {
      title: "Session State & Memory",
      desc: "Persistent dictionary memory shared across turn-by-turn interactions using key templating:",
      foot: "ToolContext.state sync",
    },
    card4: {
      title: "Policy Guardrails",
      desc: "Automatic budget limits validator, PII anonymizer, and legal disclaimer enforcers prior to final outputs.",
      foot: "Zero Legal Hallucination",
    },
  },
  products: {
    kicker: "Micro-SaaS Ecosystem",
    title: "Specialized Digital Tools. Unified Workspace.",
    subtitle:
      "Access targeted business software designed to compress time, eliminate compliance risks, and accelerate revenue.",
    items: [
      {
        id: "gdpr",
        badge: "Most Popular",
        title: "GDPR & Privacy Policy Assistant",
        subtitle: "Turn website compliance into minutes for agencies & business owners.",
        features: [
          "Custom Privacy Policy questionnaire",
          "Interactive Cookie Banner copy generator",
          "Terms of Service & Data Deletion templates",
          "Hosted live compliance page + PDF export",
          "Monthly regulatory compliance checklist",
        ],
        pricing: "Starts at $15/mo",
        ctaText: "Launch Compliance Tool",
      },
      {
        id: "support",
        badge: "E-Commerce Ready",
        title: "AI Customer Support Reply Assistant",
        subtitle: "Turn repetitive customer tickets into polite, on-brand replies in seconds.",
        features: [
          "Paste & generate multi-language replies",
          "Knowledge base & FAQ document upload",
          "Human-in-the-loop approval safeguard",
          "Complaint escalation & angry tone detector",
          "One-click copy-to-clipboard integration",
        ],
        pricing: "Starts at $10/mo",
        ctaText: "Launch Support Assistant",
      },
      {
        id: "invoice",
        badge: "Cashflow Automation",
        title: "Invoice Follow-Up & Reminder SaaS",
        subtitle: "Automate polite, awkward invoice follow-ups and get paid 2x faster.",
        features: [
          "Due date tracking & payment status dashboard",
          "Polite multi-stage reminder email generator",
          "Client communication timeline history",
          "One-click CSV & invoice data export",
          "Integrated payment recovery metrics",
        ],
        pricing: "Starts at $10/mo",
        ctaText: "Launch Invoice Tracker",
      },
    ],
  },
  shop: {
    kicker: "Digital Product Catalog",
    title: "Toolkits You Can Download Today",
    subtitle:
      "Instant-download compliance, operations, and AI governance products for web freelancers and agencies — in English, German, and French. One-time purchase, yours forever.",
    viewAll: "Browse all products",
    view: "View product",
    buyNow: "Buy now",
    from: "from",
    oneTime: "one-time",
    save: "Save",
    languagesLabel: "Languages",
    formatsLabel: "Formats",
    bundleTitle: "Need everything?",
    bundleText:
      "Get all five toolkits in the Agency Compliance Toolkit bundle and save 54% versus buying separately.",
    bundleCta: "View the bundle",
  },
  pricing: {
    kicker: "Transparent Pricing",
    title: "Predictable Plans for High-Output Teams",
    subtitle:
      "Global tax & VAT handled seamlessly via Lemon Squeezy Merchant of Record. Cancel or upgrade anytime.",
    monthly: "Monthly Billing",
    annual: "Annual Billing",
    save: "Save 20%",
    perMonth: "/month",
    popular: "Most Popular",
    starter: {
      name: "Starter",
      desc: "Ideal for solo founders and single website operators needing essential compliance and automation.",
      features: [
        "1 Active Website / Workspace",
        "GDPR & Privacy Policy Generator",
        "Standard Cookie Banner Copy",
        "Hosted Legal Page URL",
        "Up to 250 AI Support Credits / mo",
        "Email Support",
      ],
      cta: "Choose Starter",
    },
    pro: {
      name: "Pro Founder",
      desc: "Designed for fast-moving startups and freelancers needing complete multi-agent workflows.",
      features: [
        "Up to 5 Websites / Workspaces",
        "Full GDPR, Terms & Cookie Suite",
        "Automated Monthly Compliance Audit",
        "AI Customer Support Reply Assistant",
        "1,500 AI Execution Credits / mo",
        "Custom Tone & Knowledge Base Upload",
        "Priority Email & Chat Support",
      ],
      cta: "Upgrade to Pro",
    },
    agency: {
      name: "Agency Suite",
      desc: "For web agencies and studios managing compliance and client operations at scale.",
      features: [
        "Unlimited Client Websites",
        "White-Label Hosted Legal Pages",
        "PDF & HTML Export with Agency Branding",
        "Multi-Team Seat Access (5 Seats)",
        "5,000 AI Execution Credits / mo",
        "Invoice Follow-Up & Reminder Tools",
        "Dedicated Account Manager",
      ],
      cta: "Get Agency Suite",
    },
  },
  faq: {
    kicker: "Got Questions?",
    title: "Frequently Asked Questions",
    items: [
      {
        q: "How does Agyflow differ from basic single-prompt chatbots?",
        a: "Traditional chatbots attempt to solve every problem in one monolithic prompt, which causes instructions to be forgotten (context rot) and hallucinations. Agyflow organizes specialized sub-agents into a hierarchical tree (Google ADK architecture) with deterministic pipelines (Sequential, Loop, and Parallel) to guarantee consistent, reliable business results.",
      },
      {
        q: "Are the generated GDPR documents legally binding?",
        a: "Our GDPR and privacy assistants generate comprehensive, high-standard policy drafts aligned with EU Regulation 2016/679 and California CCPA guidelines. However, we position our tool as a compliance assistant, not as a replacement for certified legal counsel. We recommend having your specific industry nuances reviewed by an attorney.",
      },
      {
        q: "What payment methods are supported?",
        a: "All subscription and license payments are securely processed by Lemon Squeezy as our Merchant of Record. We accept all major Credit Cards (Visa, Mastercard, Amex), PayPal, Apple Pay, and Google Pay with automatic VAT/sales tax invoices for US and EU businesses.",
      },
      {
        q: "Can I connect my own custom domain to hosted legal pages?",
        a: "Yes! On the Pro and Agency plans, you can host your generated privacy policies, cookie banners, and support documentation directly on your own subdomains (e.g., privacy.yourcompany.com) with automated free SSL certificates.",
      },
      {
        q: "Can I cancel or change my plan anytime?",
        a: "Yes, you can upgrade, downgrade, or cancel your subscription at any time directly through your Lemon Squeezy customer billing portal with zero lock-in contracts.",
      },
    ],
  },
  footer: {
    blurb:
      "Autonomous multi-agent workspace and business automation suite. Designed for web agencies, developers, and digital creators worldwide.",
    status: "agyflow.com • All Systems Operational",
    colProducts: "Products",
    productLinks: [
      "GDPR & Privacy Assistant",
      "AI Customer Support Reply",
      "Invoice & Payment Reminders",
      "Multi-Agent Engine",
    ],
    colTrust: "Compliance & Trust",
    trust: [
      "EU GDPR 2016/679 Aligned",
      "Lemon Squeezy MoR Protected",
      "Zero Data Training Policy",
      "SSL / TLS 1.3 Encrypted",
    ],
    colSupport: "Product Support",
    labels: {
      gdpr: "GDPR:",
      ai: "AI Help:",
      billing: "Billing:",
      general: "General:",
    },
    disclaimerTitle: "Legal Disclaimer:",
    disclaimer:
      "Agyflow provides automated compliance assistants, document drafting templates, and operational AI workflows. Agyflow is not a law firm, does not provide legal advice, and our services do not substitute for qualified legal review. Users should ensure documents comply with their local jurisdiction and industry regulations.",
    rights: "Agyflow (agyflow.com). All rights reserved.",
    built: "Built with Next.js 14, Tailwind CSS & Google ADK Standards",
  },
  jsonld: {
    orgDescription:
      "Autonomous multi-agent workspace and business operations automation suite.",
    appDescription:
      "PrivacyPage AI is a GDPR and privacy policy generator that creates editable compliance-policy drafts for websites.",
    offers: {
      starter: "Starter Plan",
      pro: "Pro Plan",
      agency: "Agency Suite",
    },
  },
};

export type Dict = typeof en;

const de: Dict = {
  meta: {
    title: "Agyflow | Autonome Multi-Agent-Workflows für digitale Teams",
    description:
      "Orchestrieren Sie spezialisierte KI-Agenten, optimieren Sie Ihren Kundensupport, erstellen Sie DSGVO-konforme Dokumente und automatisieren Sie Geschäftspipelines auf agyflow.com.",
    keywords: [
      "KI-Agenten",
      "Multi-Agent-Workflows",
      "ADK Multi-Agent",
      "DSGVO-Generator",
      "KI-Kundensupport",
      "SaaS-Workspace",
      "Agyflow",
    ],
    ogTitle: "Agyflow | Autonome Multi-Agent-Workflows",
    ogDescription:
      "Orchestrieren Sie spezialisierte KI-Agenten und automatisieren Sie Ihre Geschäftsabläufe mit agyflow.com.",
    twitterDescription:
      "Orchestrieren Sie spezialisierte KI-Agenten und automatisierte Pipelines mit agyflow.com",
  },
  nav: {
    tagline: "AUTONOME SUITE",
    engine: "Agent-Engine",
    products: "Produkte",
    features: "Funktionen",
    pricing: "Preise",
    faq: "FAQ",
    signIn: "Anmelden",
    deploy: "Workflow starten",
  },
  hero: {
    badge: "Autonome Multi-Agent-Architektur • Google ADK & MCP-fähig",
    title1: "Orchestrieren Sie KI-Agenten zu",
    titleAccent: "unaufhaltsamen Workflows",
    subtitle:
      "Ersetzen Sie chaotische manuelle Abläufe durch selbstorchestrierende Agententeams. Stellen Sie DSGVO-Compliance-Generatoren, automatisierten Kundensupport und deterministische Geschäftspipelines mit voller Kontrolle bereit.",
    ctaPrimary: "Kostenlos starten",
    ctaSecondary: "Agent-Engine entdecken",
    proof: [
      "EU-DSGVO & Datenschutz bereit",
      "Lemon Squeezy-Abrechnung integriert",
      "Deterministische Zustandssynchronisation",
    ],
    box1: {
      title: "Root-Orchestrator",
      desc: "Empfängt menschliche Absichten, plant Aufgaben und verteilt Sub-Agenten in einer Baumstruktur.",
      log1Label: "Verteilt:",
      log1Text: "3 Agenten",
      log2Label: "Richtlinie:",
      log2Text: "Guardrail bestanden",
    },
    box2: {
      title: "Writers Room (Loop)",
      desc: "Recherche → Drehbuch → Kritik: Evaluierungsschleife, bis die Kriterien erfüllt sind.",
      log1Label: "Schleife #2:",
      log1Text: "Kritik genehmigt",
      log2Label: "exit_loop:",
      log2Text: "True",
    },
    box3: {
      title: "Legal- & Compliance-Schild",
      desc: "Bereinigt personenbezogene Daten automatisch, validiert Budgetgrenzen und formatiert finale Ergebnisse.",
      log1Label: "DSGVO-Score:",
      log1Text: "100 % gültig",
      log2Label: "Export:",
      log2Text: "Gehostete Seite + PDF",
    },
  },
  engine: {
    badge: "Multi-Agent-Ausführungs-Engine",
    title: "Berechenbare Pipelines. Deterministische Ergebnisse.",
    subtitle:
      "Wechseln Sie von chaotischen Einzel-Prompts zu strukturierten Multi-Agent-Topologien auf Basis von Google-ADK-Patterns und dem Model Context Protocol (MCP).",
    tabSeq: "Sequenzieller Agent",
    tabLoop: "Loop-Agent",
    tabParallel: "Paralleles Fan-Out",
    seq: {
      title: "Sequenzielle Assemblierungs-Pipeline",
      desc: "Führt Sub-Agenten in strenger linearer Reihenfolge aus. Der Output eines Agenten liefert dem nächsten den Kontext.",
      chip: "Ausführung: Linear (100 % deterministisch)",
      steps: [
        {
          step: "SCHRITT 01",
          title: "Eingabeanalyse",
          desc: "Extrahiert Nutzerziele, Sprache und Einschränkungen.",
        },
        {
          step: "SCHRITT 02",
          title: "Dokumentensynthese",
          desc: "Erzeugt Rechtsklauseln oder Support-Entwürfe.",
        },
        {
          step: "SCHRITT 03",
          title: "Compliance-Export",
          desc: "Erstellt live gehostete URLs und PDF-Dokumente.",
        },
      ],
    },
    loop: {
      title: "Iterative Verbesserungsschleife (Writers Room)",
      desc: "Sub-Agenten generieren, kritisieren und verfeinern Inhalte zyklisch, bis die Policy-Guardrail `exit_loop` auslöst.",
      chip: "Max. Iterationen: 5 Zyklen",
      cards: [
        {
          tag: "01. GENERATOR",
          title: "Autor-Agent",
          desc: "Entwirft die Kundenantwort oder Richtlinie auf Basis hochgeladener Wissensdatenbank-Dateien.",
        },
        {
          tag: "02. KRITIK & BEWERTUNG",
          title: "Policy-Evaluator",
          desc: "Bewertet Tonalität, Sicherheitsrichtlinien und fehlende DSGVO-Artikel. Schleift zurück, wenn Score < 95 %.",
        },
        {
          tag: "03. TERMINIERUNGS-TOOL",
          title: "exit_loop-Auslöser",
          desc: "Sind alle Kriterien erfüllt, wird `exit_loop` ausgeführt und die Kontrolle an die Deployment-Phase übergeben.",
        },
      ],
    },
    par: {
      title: "Paralleles Fan-Out & Gather",
      desc: "Startet mehrere isolierte Agenten gleichzeitig für mehr Geschwindigkeit und sammelt Berichte ohne Shared-State-Konflikte.",
      chip: "Latenzreduktion: bis zu 4x",
      branches: [
        {
          title: "Zweig A: Datenschutz-Audit",
          desc: "Führt einen vollständigen Scan gegen die EU-DSGVO 2016/679 durch.",
        },
        {
          title: "Zweig B: Cookie-Consent",
          desc: "Extrahiert Third-Party-Skripte und erstellt Cookie-Banner-Texte.",
        },
        {
          title: "Zweig C: Nutzungsbedingungen",
          desc: "Entwirft Haftungsgrenzen, Streitbeilegung und Rückerstattungsrichtlinien.",
        },
      ],
    },
  },
  bento: {
    kicker: "Architektonische Exzellenz",
    title: "Gebaut für maximale Betriebszuverlässigkeit",
    subtitle:
      "Agyflow kombiniert Google-ADK-Baumrouting mit universellen MCP-Konnektoren, um digitale Workspaces zu bauen, die nie ausfallen.",
    card1: {
      tag: "Google ADK Topologie",
      title: "Hierarchisches Baum-Routing",
      desc: "Beenden Sie Chaos und Halluzinationen mit strengen Routing-Regeln. Agenten können Kontext nur an ihre Sub-Agenten, an ihren übergeordneten Agenten oder an Geschwister-Agenten übergeben — das verhindert Kontextkontamination.",
    },
    treeComment: "# Strenge Transfer-Regeln: Peer-to-peer erlaubt",
    card2: {
      chip: "STANDARDISIERT",
      title: "Universelle MCP-Integration",
      desc: "Verbinden Sie externe Datenbanken, Shopify-Webhooks, Google Maps oder eigene APIs mühelos über den Model-Context-Protocol-Standard.",
      foot: "Keine eigenen API-Wrapper erforderlich",
    },
    card3: {
      title: "Sitzungsstatus & Speicher",
      desc: "Persistenter Dictionary-Speicher, der über Interaktionen hinweg per Key-Templating geteilt wird:",
      foot: "ToolContext.state sync",
    },
    card4: {
      title: "Policy-Guardrails",
      desc: "Automatische Budgetlimit-Validierung, PII-Anonymisierung und Erzwingung rechtlicher Hinweise vor finalen Ausgaben.",
      foot: "Null Rechts-Halluzination",
    },
  },
  products: {
    kicker: "Micro-SaaS-Ökosystem",
    title: "Spezialisierte digitale Tools. Ein Workspace.",
    subtitle:
      "Greifen Sie auf zielgerichtete Business-Software zu, die Zeit spart, Compliance-Risiken eliminiert und Umsätze beschleunigt.",
    items: [
      {
        id: "gdpr",
        badge: "Beliebteste Wahl",
        title: "DSGVO- & Datenschutz-Assistent",
        subtitle: "Website-Compliance in Minuten — für Agenturen und Unternehmen.",
        features: [
          "Individueller Datenschutzrichtlinien-Fragebogen",
          "Interaktiver Cookie-Banner-Textgenerator",
          "Vorlagen für Nutzungsbedingungen & Datenlöschung",
          "Live gehostete Compliance-Seite + PDF-Export",
          "Monatliche Compliance-Checkliste",
        ],
        pricing: "Ab 15 $/Monat",
        ctaText: "Compliance-Tool starten",
      },
      {
        id: "support",
        badge: "E-Commerce-fähig",
        title: "KI-Kundensupport-Antwortassistent",
        subtitle: "Verwandeln Sie wiederkehrende Tickets in Sekunden in höfliche, markenkonforme Antworten.",
        features: [
          "Einfügen & mehrsprachige Antworten generieren",
          "Upload von Wissensdatenbank & FAQ-Dokumenten",
          "Freigabesicherung mit menschlicher Kontrolle",
          "Eskalations- & Verärgerungs-Ton-Erkennung",
          "One-Click-Kopieren in die Zwischenablage",
        ],
        pricing: "Ab 10 $/Monat",
        ctaText: "Support-Assistent starten",
      },
      {
        id: "invoice",
        badge: "Cashflow-Automatisierung",
        title: "Rechnungs-Follow-up & Erinnerungs-SaaS",
        subtitle: "Automatisieren Sie höfliche Rechnungserinnerungen und werden Sie 2x schneller bezahlt.",
        features: [
          "Fälligkeits-Tracking & Zahlungsstatus-Dashboard",
          "Höflicher mehrstufiger Erinnerungs-E-Mail-Generator",
          "Verlauf der Kundenkommunikation",
          "One-Click-CSV- & Rechnungsdaten-Export",
          "Integrierte Kennzahlen zum Zahlungseingang",
        ],
        pricing: "Ab 10 $/Monat",
        ctaText: "Rechnungs-Tracker starten",
      },
    ],
  },
  shop: {
    kicker: "Digitaler Produktkatalog",
    title: "Toolkits, die Sie heute herunterladen können",
    subtitle:
      "Sofort verfügbare Compliance-, Operations- und KI-Governance-Produkte für Web-Freelancer und Agenturen — auf Englisch, Deutsch und Französisch. Einmaliger Kauf, dauerhaft nutzbar.",
    viewAll: "Alle Produkte ansehen",
    view: "Produkt ansehen",
    buyNow: "Jetzt kaufen",
    from: "ab",
    oneTime: "einmalig",
    save: "Sparen",
    languagesLabel: "Sprachen",
    formatsLabel: "Formate",
    bundleTitle: "Brauchen Sie alles?",
    bundleText:
      "Holen Sie sich alle fünf Toolkits im Agency Compliance Toolkit Bundle und sparen Sie 54 % gegenüber dem Einzelkauf.",
    bundleCta: "Bundle ansehen",
  },
  pricing: {
    kicker: "Transparente Preise",
    title: "Berechenbare Tarife für leistungsstarke Teams",
    subtitle:
      "Weltweite Steuern & MwSt. werden nahtlos über Lemon Squeezy als Merchant of Record abgewickelt. Jederzeit kündigen oder upgraden.",
    monthly: "Monatliche Abrechnung",
    annual: "Jährliche Abrechnung",
    save: "20 % sparen",
    perMonth: "/Monat",
    popular: "Beliebteste Wahl",
    starter: {
      name: "Starter",
      desc: "Ideal für Solo-Gründer und Betreiber einer einzelnen Website, die wesentliche Compliance und Automatisierung benötigen.",
      features: [
        "1 aktive Website / Workspace",
        "DSGVO- & Datenschutzrichtlinien-Generator",
        "Standard-Cookie-Banner-Texte",
        "Gehostete URL der Rechtsseite",
        "Bis zu 250 KI-Support-Credits / Monat",
        "E-Mail-Support",
      ],
      cta: "Starter wählen",
    },
    pro: {
      name: "Pro Founder",
      desc: "Entwickelt für schnelle Startups und Freelancer, die vollständige Multi-Agent-Workflows benötigen.",
      features: [
        "Bis zu 5 Websites / Workspaces",
        "Vollständige DSGVO-, Nutzungs- & Cookie-Suite",
        "Automatisches monatliches Compliance-Audit",
        "KI-Kundensupport-Antwortassistent",
        "1.500 KI-Credits / Monat",
        "Eigener Ton & Wissensdatenbank-Upload",
        "Prioritäts-Support per E-Mail & Chat",
      ],
      cta: "Auf Pro upgraden",
    },
    agency: {
      name: "Agency Suite",
      desc: "Für Webagenturen und Studios, die Compliance und Kundenbetrieb im großen Stil verwalten.",
      features: [
        "Unbegrenzt Kunden-Websites",
        "White-Label gehostete Rechtsseiten",
        "PDF- & HTML-Export mit Agentur-Branding",
        "Multi-Team-Zugang (5 Plätze)",
        "5.000 KI-Credits / Monat",
        "Rechnungs-Follow-up & Erinnerungstools",
        "Persönlicher Account Manager",
      ],
      cta: "Agency Suite holen",
    },
  },
  faq: {
    kicker: "Fragen?",
    title: "Häufig gestellte Fragen",
    items: [
      {
        q: "Worin unterscheidet sich Agyflow von einfachen Single-Prompt-Chatbots?",
        a: "Herkömmliche Chatbots versuchen, jedes Problem in einem einzigen monolithischen Prompt zu lösen. Dadurch gehen Anweisungen verloren (Context Rot) und Halluzinationen entstehen. Agyflow organisiert spezialisierte Sub-Agenten in einer hierarchischen Baumstruktur (Google-ADK-Architektur) mit deterministischen Pipelines (sequenziell, Loop und parallel) für konsistente, zuverlässige Geschäftsergebnisse.",
      },
      {
        q: "Sind die generierten DSGVO-Dokumente rechtlich verbindlich?",
        a: "Unsere DSGVO- und Datenschutz-Assistenten erstellen umfassende Richtlinienentwürfe nach EU-Verordnung 2016/679 und den CCPA-Leitlinien Kaliforniens. Unser Tool ist ein Compliance-Assistent und ersetzt keine zertifizierte Rechtsberatung. Lassen Sie branchenspezifische Besonderheiten von einem Anwalt prüfen.",
      },
      {
        q: "Welche Zahlungsmethoden werden unterstützt?",
        a: "Alle Abonnements und Lizenzen werden sicher von Lemon Squeezy als Merchant of Record abgewickelt. Wir akzeptieren alle gängigen Kreditkarten (Visa, Mastercard, Amex), PayPal, Apple Pay und Google Pay — inklusive automatischer MwSt./Verkaufssteuer-Rechnungen für Unternehmen in den USA und der EU.",
      },
      {
        q: "Kann ich eine eigene Domain für gehostete Rechtsseiten verwenden?",
        a: "Ja! Mit den Pro- und Agency-Tarifen hosten Sie generierte Datenschutzrichtlinien, Cookie-Banner und Support-Dokumente direkt auf Ihren eigenen Subdomains (z. B. privacy.ihrefirma.de) — mit automatischen, kostenlosen SSL-Zertifikaten.",
      },
      {
        q: "Kann ich meinen Tarif jederzeit kündigen oder ändern?",
        a: "Ja, Sie können Ihr Abonnement jederzeit über Ihr Lemon-Squeezy-Kundenportal upgraden, downgraden oder kündigen — ohne Mindestlaufzeit.",
      },
    ],
  },
  footer: {
    blurb:
      "Autonomer Multi-Agent-Workspace und Business-Automatisierungssuite. Entwickelt für Webagenturen, Entwickler und digitale Kreative weltweit.",
    status: "agyflow.com • Alle Systeme betriebsbereit",
    colProducts: "Produkte",
    productLinks: [
      "DSGVO- & Datenschutz-Assistent",
      "KI-Kundensupport-Antworten",
      "Rechnungs- & Zahlungserinnerungen",
      "Multi-Agent-Engine",
    ],
    colTrust: "Compliance & Vertrauen",
    trust: [
      "EU-DSGVO 2016/679 konform",
      "Durch Lemon Squeezy MoR geschützt",
      "Zero-Data-Training-Richtlinie",
      "SSL / TLS 1.3 verschlüsselt",
    ],
    colSupport: "Produkt-Support",
    labels: {
      gdpr: "DSGVO:",
      ai: "KI-Hilfe:",
      billing: "Abrechnung:",
      general: "Allgemein:",
    },
    disclaimerTitle: "Rechtlicher Hinweis:",
    disclaimer:
      "Agyflow bietet automatisierte Compliance-Assistenten, Dokumentvorlagen und operative KI-Workflows. Agyflow ist keine Kanzlei, erteilt keine Rechtsberatung, und unsere Dienste ersetzen keine qualifizierte rechtliche Prüfung. Nutzer stellen sicher, dass Dokumente ihrer lokalen Rechtslage und den Branchenvorschriften entsprechen.",
    rights: "Agyflow (agyflow.com). Alle Rechte vorbehalten.",
    built: "Gebaut mit Next.js 14, Tailwind CSS & Google-ADK-Standards",
  },
  jsonld: {
    orgDescription:
      "Autonomer Multi-Agent-Workspace und Suite zur Automatisierung von Geschäftsabläufen.",
    appDescription:
      "PrivacyPage AI ist ein DSGVO- und Datenschutzrichtlinien-Generator für bearbeitbare Compliance-Entwürfe für Websites.",
    offers: {
      starter: "Starter-Tarif",
      pro: "Pro-Tarif",
      agency: "Agency Suite",
    },
  },
};

const fr: Dict = {
  meta: {
    title: "Agyflow | Workflows multi-agents autonomes pour les équipes digitales",
    description:
      "Orchestrez des agents IA spécialisés, fluidifiez le support client, générez des documents conformes au RGPD et lancez des pipelines métier automatisés sur agyflow.com.",
    keywords: [
      "agents IA",
      "workflows multi-agents",
      "ADK multi-agents",
      "générateur RGPD",
      "support client IA",
      "espace de travail SaaS",
      "Agyflow",
    ],
    ogTitle: "Agyflow | Workflows multi-agents autonomes",
    ogDescription:
      "Orchestrez des agents IA spécialisés et automatisez vos opérations avec agyflow.com.",
    twitterDescription:
      "Orchestrez des agents IA spécialisés et des pipelines automatisés avec agyflow.com",
  },
  nav: {
    tagline: "SUITE AUTONOME",
    engine: "Moteur d'agents",
    products: "Produits",
    features: "Fonctionnalités",
    pricing: "Tarifs",
    faq: "FAQ",
    signIn: "Se connecter",
    deploy: "Lancer un workflow",
  },
  hero: {
    badge: "Architecture multi-agents autonome • Prête pour Google ADK et MCP",
    title1: "Orchestrez vos agents IA en",
    titleAccent: "workflows imbattables",
    subtitle:
      "Remplacez le chaos des opérations manuelles par des équipes d'agents auto-orchestrés. Déployez des générateurs de conformité RGPD, un support client automatisé et des pipelines métier déterministes, en gardant le contrôle total.",
    ctaPrimary: "Commencer gratuitement",
    ctaSecondary: "Explorer le moteur d'agents",
    proof: [
      "Conforme au RGPD européen",
      "Facturation Lemon Squeezy intégrée",
      "Synchronisation d'état déterministe",
    ],
    box1: {
      title: "Orchestrateur racine",
      desc: "Reçoit les intentions humaines, planifie les tâches et distribue les sous-agents en topologie arborescente.",
      log1Label: "Distribués :",
      log1Text: "3 agents",
      log2Label: "Règle :",
      log2Text: "Guardrail validé",
    },
    box2: {
      title: "Writers Room (Boucle)",
      desc: "Recherche → Scénario → Critique : boucle d'évaluation jusqu'à atteindre les critères.",
      log1Label: "Boucle n°2 :",
      log1Text: "Approuvé par le critique",
      log2Label: "exit_loop :",
      log2Text: "True",
    },
    box3: {
      title: "Bouclier juridique & conformité",
      desc: "Anonymise les données personnelles, valide les contraintes budgétaires et met en forme les livrables finaux.",
      log1Label: "Score RGPD :",
      log1Text: "100 % valide",
      log2Label: "Export :",
      log2Text: "Page hébergée + PDF",
    },
  },
  engine: {
    badge: "Moteur d'exécution multi-agents",
    title: "Des pipelines prévisibles. Des résultats déterministes.",
    subtitle:
      "Passez des prompts uniques chaotiques à des topologies multi-agents structurées, basées sur les patterns Google ADK et le Model Context Protocol (MCP).",
    tabSeq: "Agent séquentiel",
    tabLoop: "Agent boucle",
    tabParallel: "Fan-out parallèle",
    seq: {
      title: "Pipeline d'assemblage séquentiel",
      desc: "Exécute les sous-agents en succession strictement linéaire. La sortie de chaque agent alimente le suivant en contexte.",
      chip: "Exécution : linéaire (100 % déterministe)",
      steps: [
        {
          step: "ÉTAPE 01",
          title: "Analyse des entrées",
          desc: "Extrait les objectifs, la langue et les contraintes de l'utilisateur.",
        },
        {
          step: "ÉTAPE 02",
          title: "Synthèse documentaire",
          desc: "Génère les clauses juridiques ou les brouillons de support.",
        },
        {
          step: "ÉTAPE 03",
          title: "Export de conformité",
          desc: "Produit des URLs hébergées en direct et des documents PDF.",
        },
      ],
    },
    loop: {
      title: "Boucle d'affinement itératif (Writers Room)",
      desc: "Les sous-agents génèrent, critiquent et affinent le contenu de façon cyclique jusqu'à ce que le garde-fou déclenche `exit_loop`.",
      chip: "Itérations max : 5 cycles",
      cards: [
        {
          tag: "01. GÉNÉRATEUR",
          title: "Agent rédacteur",
          desc: "Rédige la réponse client ou la politique à partir des bases de connaissances importées.",
        },
        {
          tag: "02. CRITIQUE & ÉVALUATEUR",
          title: "Évaluateur de conformité",
          desc: "Évalue le ton, les règles de sécurité et les articles RGPD manquants. Boucle si score < 95 %.",
        },
        {
          tag: "03. OUTIL DE TERMINAISON",
          title: "Déclencheur exit_loop",
          desc: "Une fois tous les critères remplis, exécute `exit_loop` et transfère le contrôle à la phase de déploiement.",
        },
      ],
    },
    par: {
      title: "Fan-out & collecte parallèles",
      desc: "Lance simultanément plusieurs agents isolés pour plus de vitesse et collecte les rapports sans conflits d'état partagé.",
      chip: "Latence réduite : jusqu'à 4x",
      branches: [
        {
          title: "Branche A : Audit de confidentialité",
          desc: "Analyse complète conformément au RGPD UE 2016/679.",
        },
        {
          title: "Branche B : Consentement cookies",
          desc: "Analyse les scripts tiers et rédige le texte du bandeau cookies.",
        },
        {
          title: "Branche C : Conditions d'utilisation",
          desc: "Rédige les limites de responsabilité, la résolution des litiges et les politiques de remboursement.",
        },
      ],
    },
  },
  bento: {
    kicker: "Excellence architecturale",
    title: "Conçu pour des opérations d'une fiabilité totale",
    subtitle:
      "Agyflow combine le routage arborescent Google ADK et des connecteurs MCP universels pour créer des espaces de travail numériques qui ne tombent jamais en panne.",
    card1: {
      tag: "Topologie Google ADK",
      title: "Routage arborescent hiérarchique",
      desc: "Éliminez le chaos et les hallucinations grâce à des règles de routage strictes. Les agents ne peuvent transférer le contexte qu'à leurs sous-agents, à leur parent ou à leurs agents frères — évitant toute contamination croisée.",
    },
    treeComment: "# Transferts strictement contrôlés : peer-to-peer autorisé",
    card2: {
      chip: "STANDARDISÉ",
      title: "Intégration MCP universelle",
      desc: "Connectez facilement des bases de données externes, des webhooks Shopify, Google Maps ou vos propres API grâce au standard Model Context Protocol.",
      foot: "Aucun wrapper API personnalisé requis",
    },
    card3: {
      title: "État de session & mémoire",
      desc: "Mémoire persistante partagée d'un tour à l'autre grâce au templating par clés :",
      foot: "ToolContext.state sync",
    },
    card4: {
      title: "Garde-fous de conformité",
      desc: "Validation automatique des limites budgétaires, anonymisation des données personnelles et mentions légales obligatoires avant chaque livrable.",
      foot: "Zéro hallucination juridique",
    },
  },
  products: {
    kicker: "Écosystème Micro-SaaS",
    title: "Des outils spécialisés. Un espace de travail unifié.",
    subtitle:
      "Accédez à des logiciels métier ciblés, conçus pour gagner du temps, éliminer les risques de conformité et accélérer vos revenus.",
    items: [
      {
        id: "gdpr",
        badge: "Le plus populaire",
        title: "Assistant RGPD & Politique de confidentialité",
        subtitle: "La conformité de votre site en quelques minutes, pour agences et entreprises.",
        features: [
          "Questionnaire de politique de confidentialité personnalisé",
          "Générateur interactif de bandeau cookies",
          "Modèles de CGU et de suppression de données",
          "Page de conformité hébergée + export PDF",
          "Checklist de conformité mensuelle",
        ],
        pricing: "À partir de 15 $/mois",
        ctaText: "Lancer l'outil de conformité",
      },
      {
        id: "support",
        badge: "Prêt pour l'e-commerce",
        title: "Assistant de réponses support IA",
        subtitle: "Transformez les tickets répétitifs en réponses polies et fidèles à votre marque en quelques secondes.",
        features: [
          "Collez et générez des réponses multilingues",
          "Import de base de connaissances et de FAQ",
          "Validation humaine avant envoi",
          "Détection des escalades et des tons agacés",
          "Copie en un clic dans le presse-papiers",
        ],
        pricing: "À partir de 10 $/mois",
        ctaText: "Lancer l'assistant support",
      },
      {
        id: "invoice",
        badge: "Automatisation de trésorerie",
        title: "SaaS de relance de factures",
        subtitle: "Automatisez les relances de factures et soyez payé 2x plus vite.",
        features: [
          "Suivi des échéances et tableau de bord des paiements",
          "Générateur d'e-mails de relance multistage",
          "Historique des échanges clients",
          "Export CSV et données de facturation en un clic",
          "Indicateurs intégrés de recouvrement",
        ],
        pricing: "À partir de 10 $/mois",
        ctaText: "Lancer le suivi de factures",
      },
    ],
  },
  shop: {
    kicker: "Catalogue de produits numériques",
    title: "Des toolkits à télécharger dès aujourd'hui",
    subtitle:
      "Produits de conformité, d'opérations et de gouvernance IA en téléchargement immédiat pour freelances et agences web — en anglais, allemand et français. Achat unique, à vous pour toujours.",
    viewAll: "Voir tous les produits",
    view: "Voir le produit",
    buyNow: "Acheter",
    from: "à partir de",
    oneTime: "paiement unique",
    save: "Économisez",
    languagesLabel: "Langues",
    formatsLabel: "Formats",
    bundleTitle: "Besoin de tout ?",
    bundleText:
      "Obtenez les cinq toolkits dans le bundle Agency Compliance Toolkit et économisez 54 % par rapport à l'achat séparé.",
    bundleCta: "Voir le bundle",
  },
  pricing: {
    kicker: "Tarification transparente",
    title: "Des offres prévisibles pour les équipes ambitieuses",
    subtitle:
      "Taxes et TVA internationales gérées automatiquement via Lemon Squeezy, notre Merchant of Record. Annulez ou changez d'offre à tout moment.",
    monthly: "Facturation mensuelle",
    annual: "Facturation annuelle",
    save: "-20 %",
    perMonth: "/mois",
    popular: "Le plus populaire",
    starter: {
      name: "Starter",
      desc: "Idéal pour les fondateurs solos et les propriétaires d'un seul site qui ont besoin de l'essentiel en conformité et automatisation.",
      features: [
        "1 site / workspace actif",
        "Générateur RGPD & politique de confidentialité",
        "Texte de bandeau cookies standard",
        "URL de page légale hébergée",
        "Jusqu'à 250 crédits IA support / mois",
        "Support par e-mail",
      ],
      cta: "Choisir Starter",
    },
    pro: {
      name: "Pro Founder",
      desc: "Conçu pour les startups en croissance et les freelances qui ont besoin de workflows multi-agents complets.",
      features: [
        "Jusqu'à 5 sites / workspaces",
        "Suite complète RGPD, CGU & cookies",
        "Audit de conformité mensuel automatisé",
        "Assistant de réponses support IA",
        "1 500 crédits IA / mois",
        "Ton personnalisé & import de base de connaissances",
        "Support prioritaire e-mail & chat",
      ],
      cta: "Passer à Pro",
    },
    agency: {
      name: "Agency Suite",
      desc: "Pour les agences web et studios qui gèrent conformité et clients à grande échelle.",
      features: [
        "Sites clients illimités",
        "Pages légales hébergées en marque blanche",
        "Export PDF & HTML aux couleurs de l'agence",
        "Accès multi-équipe (5 sièges)",
        "5 000 crédits IA / mois",
        "Outils de relance de factures",
        "Account manager dédié",
      ],
      cta: "Obtenir l'Agency Suite",
    },
  },
  faq: {
    kicker: "Des questions ?",
    title: "Foire aux questions",
    items: [
      {
        q: "Qu'est-ce qui distingue Agyflow des chatbots mono-prompt classiques ?",
        a: "Les chatbots traditionnels tentent de tout résoudre en un seul prompt monolithique, ce qui provoque des oublis d'instructions (context rot) et des hallucinations. Agyflow organise des sous-agents spécialisés en arborescence hiérarchique (architecture Google ADK) avec des pipelines déterministes (séquentiel, boucle et parallèle) pour des résultats fiables et constants.",
      },
      {
        q: "Les documents RGPD générés sont-ils juridiquement contraignants ?",
        a: "Nos assistants RGPD génèrent des projets de politiques complets, alignés sur le règlement UE 2016/679 et les directives CCPA de Californie. Notre outil est un assistant de conformité, pas un substitut à un conseil juridique certifié. Nous recommandons de faire relire vos spécificités sectorielles par un avocat.",
      },
      {
        q: "Quels moyens de paiement sont acceptés ?",
        a: "Tous les abonnements et licences sont traités en toute sécurité par Lemon Squeezy, notre Merchant of Record. Nous acceptons les principales cartes bancaires (Visa, Mastercard, Amex), PayPal, Apple Pay et Google Pay, avec factures TVA/taxes automatiques pour les entreprises aux États-Unis et dans l'UE.",
      },
      {
        q: "Puis-je connecter mon propre domaine aux pages légales hébergées ?",
        a: "Oui ! Avec les offres Pro et Agency, hébergez vos politiques de confidentialité, bandeaux cookies et documents de support sur vos propres sous-domaines (ex. privacy.votreentreprise.com) avec des certificats SSL gratuits automatiques.",
      },
      {
        q: "Puis-je annuler ou changer d'offre à tout moment ?",
        a: "Oui, vous pouvez mettre à niveau, rétrograder ou annuler votre abonnement à tout moment depuis votre portail client Lemon Squeezy, sans engagement.",
      },
    ],
  },
  footer: {
    blurb:
      "Espace de travail multi-agents autonome et suite d'automatisation métier. Conçu pour les agences web, les développeurs et les créateurs digitaux du monde entier.",
    status: "agyflow.com • Tous les systèmes opérationnels",
    colProducts: "Produits",
    productLinks: [
      "Assistant RGPD & confidentialité",
      "Réponses support IA",
      "Relances de factures & paiements",
      "Moteur multi-agents",
    ],
    colTrust: "Conformité & confiance",
    trust: [
      "Aligné RGPD UE 2016/679",
      "Protégé par Lemon Squeezy MoR",
      "Politique zéro entraînement des données",
      "Chiffrement SSL / TLS 1.3",
    ],
    colSupport: "Support produit",
    labels: {
      gdpr: "RGPD :",
      ai: "Aide IA :",
      billing: "Facturation :",
      general: "Général :",
    },
    disclaimerTitle: "Avertissement juridique :",
    disclaimer:
      "Agyflow fournit des assistants de conformité automatisés, des modèles de documents et des workflows IA opérationnels. Agyflow n'est pas un cabinet d'avocats, ne fournit pas de conseil juridique et nos services ne remplacent pas un avis juridique qualifié. Les utilisateurs doivent s'assurer que leurs documents sont conformes à leur juridiction locale et à la réglementation de leur secteur.",
    rights: "Agyflow (agyflow.com). Tous droits réservés.",
    built: "Construit avec Next.js 14, Tailwind CSS et les standards Google ADK",
  },
  jsonld: {
    orgDescription:
      "Espace de travail multi-agents autonome et suite d'automatisation des opérations métier.",
    appDescription:
      "PrivacyPage AI est un générateur RGPD et de politiques de confidentialité créant des brouillons de conformité modifiables pour les sites web.",
    offers: {
      starter: "Offre Starter",
      pro: "Offre Pro",
      agency: "Agency Suite",
    },
  },
};

export const dictionaries: Record<Lang, Dict> = { en, de, fr };

export function getDict(lang: Lang): Dict {
  return dictionaries[lang] ?? dictionaries.en;
}

export const LANG_META: Record<Lang, { htmlLang: string; ogLocale: string }> = {
  en: { htmlLang: "en", ogLocale: "en_US" },
  de: { htmlLang: "de", ogLocale: "de_DE" },
  fr: { htmlLang: "fr", ogLocale: "fr_FR" },
};
