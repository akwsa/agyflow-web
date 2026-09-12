Agyflow deployment verification — 2026-09-12

Scope
- Applied the pending Linear-inspired visual refresh.
- Confirmed the SEO/schema cleanup in the generated static output.
- Confirmed the sitemap contains canonical URLs only.

Local project
- Repository: agyflow-web
- Branch: main
- Static output: out/
- Hosting: Rumahweb cPanel shared hosting via FTP.

Visual refresh verified in source
- Brand colors: acid lime #e4f222, signal teal #02b8cc, iris violet #6366f1.
- Inter font loading and typography updates.
- Neutral palette, consistent card/button/pill radii, hairline borders, scrollbar, and tactile button utility.
- Updated files: app/globals.css, app/layout.tsx, components/Hero.tsx, components/Navbar.tsx, components/PricingSection.tsx, tailwind.config.ts.

SEO and conversion cleanup verified in out/
- aggregateRating is absent from index.html, de.html, and fr.html.
- PrivacyPage AI appears in all three localized HTML files.
- Each localized page has the expected lang attribute: en, de, fr.
- Each page contains three Lemon Squeezy checkout references using /checkout/buy/{variant_id}.
- The obsolete UUID-plus-query checkout form is absent.
- sitemap.xml contains exactly three canonical URLs: /, /de, and /fr.
- sitemap.xml contains no URL fragments.
- out/.htaccess is present and must be uploaded as a hidden file.

Hosting verification before upload
- FTP login to agyflow.com succeeded.
- FTP root contains public_html.
- Production must be checked after upload at /, /de, /fr, /robots.txt, and /sitemap.xml.

Repository status
- Source changes are currently uncommitted.
- Remotes configured: GitHub origin and GitLab gitlab.
- Do not commit credentials; agyflow-main.md is ignored.
