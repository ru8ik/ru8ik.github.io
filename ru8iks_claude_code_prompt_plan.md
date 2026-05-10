# Claude Code Prompt Plan — ru8iks.com Full Rebuild
**Constraint: Pure static site — HTML, CSS, vanilla JS only. Hosted on GitHub Pages. No build tools, no backend, no SSR.**

---

## How to use this plan

Run each phase as a separate Claude Code session, in order. Each prompt is self-contained — it includes the audit context you need so you don't have to re-explain the codebase each time. Copy the full prompt block into Claude Code's chat. Do not skip phases — each one builds on the last.

Before starting: make sure Claude Code has access to your local repo folder containing your current HTML/CSS/JS files.

---

## PHASE 0 — Audit & Structure Setup ✅ DONE

**Goal:** Understand the current codebase before touching anything.

**Status:** Complete. Key findings are embedded in each phase below.

---

## PHASE 1 — Design System & Shared CSS

**Goal:** Rebuild `css/style.css` as a proper design system with CSS custom properties. This single file replaces the current one and is the foundation all later phases depend on.

**Audit context for this phase:**
- Current `css/style.css` is 893 lines with zero CSS custom properties
- Colors are hard-coded throughout: `#8e44ad`/`#9b59b6` (purple accent), `#121212`/`#1e1e1e`/`#252525`/`#2d2d2d` (dark backgrounds), `#333`/`#444` (borders), `#fff`/`#e0e0e0`/`#ccc`/`#888`/`#777` (text scale)
- Current font: Roboto (300/400/500/700) via Google Fonts — replace this
- Current icon library: Font Awesome 6.4.0 via cdnjs — keep for now
- Dead selector `#nav` (lines 314–319) — delete it, all pages use `#main-nav`
- `.project` class is split across two locations (lines 241–283 and lines 601–610) — consolidate
- Only two responsive breakpoints currently: 768px and 480px — keep minimal for now, Phase 8 expands them

**Prompt:**

```
I am rebuilding my static portfolio site (GitHub Pages, pure HTML/CSS/JS — no frameworks, no build tools).
The audience is technical recruiters and potential clients. I am a Software Engineer and QA specialist.

Rebuild the existing file `css/style.css` from scratch as a complete design system.
Do NOT create a separate design-system.css — everything goes into css/style.css.

AESTHETIC DIRECTION:
- Professional but with personality. NOT generic template-like.
- Refined, editorial feel — think a senior engineer's personal site, not a bootcamp portfolio.
- Dark-first color scheme. Primary background: near-black (#0f0f0f or similar).
  Accent: a single sharp color (pick one: electric teal #00d4aa, or sharp amber #f5a623, or neon coral — choose the most professional-feeling one and commit to it).
- Typography: Load 2 fonts from Google Fonts.
  Display font for headings: something distinctive but readable (NOT Inter, NOT Roboto, NOT Space Grotesk — consider Sora, DM Sans, Outfit, or Epilogue).
  Mono font for code/tags: JetBrains Mono or Fira Code.
- Generous whitespace, tight prose, high contrast.

WHAT TO INCLUDE IN css/style.css:

1. CSS custom properties (variables) for:
   - Colors: --bg-primary, --bg-secondary, --bg-card, --text-primary, --text-secondary, --text-muted, --accent, --accent-hover, --border, --border-hover
   - Typography: --font-display, --font-body, --font-mono
   - Spacing scale: --space-xs through --space-2xl
   - Border radius: --radius-sm, --radius-md, --radius-lg
   - Transitions: --transition-fast, --transition-base

2. CSS reset (modern, minimal — Eric Meyer style but updated for 2025)

3. Base typography styles: body, h1–h4, p, a, code, strong

4. Utility classes:
   - .container (max-width 1100px, centered, horizontal padding)
   - .section (vertical padding)
   - .btn-primary and .btn-secondary (call-to-action buttons with hover states and subtle animation)
   - .tag (small pill for tech stack labels, e.g. Python, Selenium)
   - .card (base card component: bg-card, border, radius, padding, subtle hover lift)
   - .badge (for status indicators like "In Progress", "Live", "2024")
   - .sr-only (screen-reader only, for accessibility)

5. Shared layout: nav and footer base styles

6. Smooth scroll behavior and subtle page-load fade-in on body

Add the Google Fonts <link> tags at the top as a comment block so I can paste them into each HTML <head>.

No responsive media queries yet — those come in Phase 8.
```

---

## PHASE 2 — Shared Nav & Footer Components

**Goal:** Create a single JS file that injects nav and footer into all pages, eliminating the copy-paste duplication.

**Audit context for this phase:**
- Nav and footer are manually duplicated across all 8 HTML files: index.html, projects.html, workshop.html, articles.html, fullstack-demo.html, games/index.html, games/game.html, games/game2.html
- Back-to-top button + its scroll script: inline `<script>` block in every page — NOT in main.js — must be moved here
- Copyright year: set in main.js AND re-inlined in games/index.html and fullstack-demo.html — consolidate here
- Nav links differ correctly per page (each page omits itself from the nav)
- games/game.html and games/game2.html currently have NO nav or footer at all — they are raw canvas pages
- games/index.html references `../css/style.css` (one directory up — correct relative path, keep this pattern)
- After this phase, main.js will only be needed for projects page API logic (removed in Phase 4) and articles pagination (removed in Phase 6) — it will be deleted after Phase 6

**Prompt:**

```
I have a static GitHub Pages site (pure HTML/CSS/JS, no frameworks). I need a shared navigation and footer that works consistently across all pages without any server-side includes.

Create a file called `js/components.js`. This file will be loaded by every page and will inject the nav, footer, and back-to-top button into placeholder divs.

NAVIGATION requirements:
- Logo/brand on the left: "Rubik" in display font, links to index.html
- Links on the right: Projects | About | Articles
  (Note: "Workshop" page is being renamed to "About")
- Active state: highlight the current page link automatically using window.location.pathname
- On mobile: hamburger menu that toggles links (CSS class toggle, no libraries)
- Sticky on scroll (position: fixed top, with a subtle backdrop-blur or solid bg-secondary on scroll)
- Inject into: <div id="nav-root"></div>

FOOTER requirements:
- Simple two-line footer
- Left: "© Rubik Seviyants — Software Engineer & QA Specialist"
- Right: Icon links for LinkedIn (https://www.linkedin.com/in/ru8ik/) and GitHub (https://github.com/ru8ik) — use inline SVG icons for both (no external icon library dependency)
- Below that, one centered line: "Built with HTML, CSS & JS · Hosted on GitHub Pages"
- Inject into: <div id="footer-root"></div>

BACK-TO-TOP BUTTON:
- Also inject a back-to-top button and its scroll logic from components.js
- Show button when scrolled > 300px, hide otherwise
- Smooth scroll to top on click
- Inject into: <div id="back-to-top-root"></div>

COPYRIGHT YEAR:
- Also set document.getElementById('current-year').textContent in components.js (the <span id="current-year"> in each page footer)

Also create `css/nav.css` with all navigation and footer styles using CSS variables from style.css.

IMPORTANT PATH NOTE:
- Pages in the root use: href="css/nav.css" and src="js/components.js"
- Pages in games/ subdirectory use: href="../css/nav.css" and src="../js/components.js"
- The active link detection in components.js must handle both /games/index.html and /index.html correctly

Show me the exact HTML snippet I need to add to every page's <head> and <body> to use these components.
```

---

## PHASE 3 — Homepage Rebuild (index.html)

**Goal:** Rewrite the homepage from scratch. Replace the vague welcome message with a sharp value proposition, featured proof of work, skill evidence, and CTAs.

**Audit context for this phase:**
- Current index.html loads 12+ devicon SVGs from jsDelivr CDN + 1 from raw.githubusercontent.com for the tech icon grid — replace all of these with tag pills (no external images, faster load)
- Cover.png is the current banner image in the header — the new design removes the banner image entirely (text-focused hero)
- WebImage1.jpg exists at root but is not referenced anywhere — can be deleted
- main.js is loaded but after Phase 3 the only index.html functionality left in it is copyright year (moving to components.js) and smooth scroll (moving to style.css)

**Prompt:**

```
Rewrite index.html for my static portfolio site (GitHub Pages, HTML/CSS/JS only).

MY DETAILS (use exactly as provided):
- Name: Rubik (Reuben Seviyants)
- Role: Software Engineer & QA Specialist
- Stack: JavaScript, Python, C#, SQL
- Testing tools: Selenium, Cypress, PyTest, TestNG, Postman, JMeter
- CI/CD: Jenkins, Docker, Kubernetes, Git, GitHub Actions
- Cloud: AWS, Azure
- Monitoring: Grafana, Redshift
- Management: Jira, Confluence
- LinkedIn: https://www.linkedin.com/in/ru8ik/
- GitHub: https://github.com/ru8ik
- I write technical articles on LinkedIn Pulse (10+ published)

PAGE STRUCTURE — build these sections in order:

1. HERO SECTION
   - Large heading (h1): "Software Engineer & QA Specialist"
   - Subheading: "I build reliable web applications and the test automation that keeps them that way."
   - Two CTA buttons side by side:
     · Primary: "View Projects" → projects.html
     · Secondary: "Download CV" → /cv.pdf (placeholder href, I will add the file later)
   - Below buttons: small trust bar — GitHub icon + "github.com/ru8ik" | LinkedIn icon + "linkedin.com/in/ru8ik"
   - NO giant banner image. Clean text-focused hero with the accent color used on the h1 or a subtle decorative element.

2. ABOUT STRIP (compact, 2-column on desktop)
   - Left: 3–4 sentence professional bio.
     Write it in first person, confident, specific tone. Example direction:
     "I specialize in building and testing web applications with a focus on reliability and fast feedback cycles.
     With [X] years of experience across QA and development, I work across the full cycle — from writing test strategies
     to shipping features — proficient in JavaScript, Python, and C#."
     Leave [X] as a placeholder I can fill in.
   - Right: 4 stat cards in a 2x2 grid:
     · "10+" / Articles published
     · "[X]+" / Years in QA & Dev (placeholder)
     · "Manual + Automated" / Testing expertise
     · "Open to" / New opportunities

3. SKILLS SECTION
   - Title: "Toolkit"
   - Do NOT show a wall of icons. Instead, show 3 horizontal category rows:
     · Testing & QA: Selenium, Cypress, PyTest, TestNG, Postman, JMeter — shown as .tag pills
     · Languages: JavaScript, Python, C#, SQL — shown as .tag pills
     · DevOps & Cloud: Jenkins, Docker, Kubernetes, AWS, Azure, Git — shown as .tag pills
   - Small note under: "Full tool details on my GitHub"
   - No logos/icons needed — the pill tags are cleaner and faster to load

4. FEATURED ARTICLES TEASER (3 cards)
   Use these real articles (hardcoded):
   - "Myth of 100% Automation — Balancing Manual & Automated Testing" | Dec 2024 | https://www.linkedin.com/pulse/myth-100-automation-balancing-manual-automated-seviyants-xrxcc/
   - "Manual Testing vs Automated — The New Era of Software & The Role of AI" | Oct 2024 | https://www.linkedin.com/pulse/manual-testing-automated-new-era-software-role-ai-seviyants-m3g1c/
   - "Shifted from Manual to Automation Testing — How You Can Too" | Nov 2024 | https://www.linkedin.com/pulse/shifted-from-manual-automation-testing-how-you-can-too-seviyants-gbbpc/
   - Each card: title, date, one-line description, "Read →" link (opens in new tab)
   - "See all articles →" link below the row

5. CONTACT / CTA STRIP
   - Clean dark band: "Let's work together"
   - Subtitle: "Open to QA engineering, test automation, and full-stack development roles."
   - Two buttons: "Message on LinkedIn" | "View GitHub"

TECHNICAL REQUIREMENTS:
- Use <div id="nav-root"></div> at top and <div id="footer-root"></div> and <div id="back-to-top-root"></div> at bottom
- Load css/style.css, css/nav.css, and js/components.js on every page
- Create css/home.css for homepage-specific styles only
- Do NOT load js/main.js — it is being phased out
- All external links open in target="_blank" rel="noopener noreferrer"
- No JavaScript required for the homepage to render content (JS only for nav component injection)
- Semantic HTML5: <main>, <section>, <article>, <header>, <footer>
- Add meta description: "Software Engineer and QA Specialist — portfolio of Rubik Seviyants. Test automation, web development, CI/CD."
```

---

## PHASE 4 — Projects Page Rebuild (projects.html)

**Goal:** Replace the JS-dependent loading state with hardcoded project cards that are visible immediately.

**Audit context for this phase:**
- Current projects.html shows "Under Development" badge and a loading spinner — content is 100% dependent on the GitHub API fetch in main.js
- GitHub API call: `https://api.github.com/users/ru8ik/repos` filtered to 9 repos: e2e-automation-testing-framework, toronto-calls-for-service, ant-table-app, api-PyArrow-case-study-sec-gov, TodoApp, CS-UI-API-Automation, games, work-shifts-manager, FullstackDevelopment
- Hardcoded demo URLs in main.js: ant-table-app → `https://ru8ik.github.io/ant-table-app/`, work-shifts-manager → `https://ru8ik.github.io/work-shifts-manager/`, toronto-calls-for-service → `https://www.ru8iks.com/toronto-calls-for-service/`
- The `games` repo card links to `games/index.html` — keep this link in the hardcoded card
- The `FullstackDevelopment` repo links to `fullstack-demo.html` which shows `images/Demos/Demo2.gif` — keep fullstack-demo.html as-is, just link to it from the projects card
- After this phase, main.js contains only articles pagination logic (removed in Phase 6) — note this and delete main.js after Phase 6

**Prompt:**

```
Rewrite projects.html for my static GitHub Pages portfolio (HTML/CSS/JS only).

The current page shows "Under Development" and a JS loading spinner — this is damaging to my portfolio.
Replace it entirely with hardcoded content. Content must be visible before any JS runs.

PAGE HEADER:
- h1: "Projects"
- Subtitle: "A selection of things I've built, tested, and shipped."

PROJECT CARDS — hardcode these projects. I will update placeholder details myself:

PROJECT 1 (Featured / pinned):
- Title: "Portfolio Website — ru8iks.com"
- Status badge: "Live"
- Year: 2024–2025
- Description: "This site. A static portfolio built and maintained as a living project — continuously refactored for performance, UX, and content quality. Also serves as a sandbox for front-end experimentation."
- Stack tags: HTML5, CSS3, JavaScript, GitHub Pages
- Links: [Live Site ↗] (https://www.ru8iks.com) | [GitHub ↗] (https://github.com/ru8ik/ru8ik.github.io)
- Note label: "What I tested: cross-browser layout, page load performance, accessibility basics"

PROJECT 2 — Games Collection:
- Title: "Browser Games Collection"
- Status badge: "Live"
- Year: 2024
- Description: "Two canvas-based browser games built with vanilla JavaScript — PaddlePong (a pong clone with mouse control and AI opponent) and Break Brick (a breakout-style game). Built as a hands-on exercise in game loop logic and canvas rendering."
- Stack tags: HTML5 Canvas, JavaScript
- Links: [Play Games ↗] (games/index.html) | [GitHub ↗] (https://github.com/ru8ik/games)
- Note label: "What I tested: game loop timing, edge collision handling, browser compatibility"

PROJECT 3 — FullstackDevelopment:
- Title: "Fullstack Development Demo"
- Status badge: "Completed"
- Year: 2024
- Description: "[Short description — fill in yourself]"
- Stack tags: [Fill in]
- Links: [Demo ↗] (fullstack-demo.html) | [GitHub ↗] (https://github.com/ru8ik/FullstackDevelopment)
- Note label: "What I tested: [fill in]"

PROJECT 4 (placeholder — fill in):
- Title: "[Project Name]"
- Status badge: "In Progress"
- Year: 2025
- Description: "[Short description — what it is, what problem it solves]"
- Stack tags: [Tech 1], [Tech 2], [Tech 3]
- Links: [GitHub ↗] | [Demo ↗]
- Note label: "What I tested: [test approach]"

CARD DESIGN:
- Each card: project title (h3), status badge (color-coded: green=Live, amber=In Progress, gray=Completed), year, description paragraph, stack tags row, links row, and the "What I tested" note in a subtle bordered callout box
- Featured project card (Project 1) has an accent border or is slightly larger
- Cards in a responsive grid: 1 col mobile, 2 col tablet, 2–3 col desktop

BOTTOM SECTION:
- "More on GitHub" banner: "I maintain additional scripts, automation tools, and experiments on GitHub." + "Visit GitHub →" button

TECHNICAL:
- css/projects.css for page-specific styles
- Use <div id="nav-root"></div>, <div id="footer-root"></div>, <div id="back-to-top-root"></div>
- Load css/style.css, css/nav.css, css/projects.css, and js/components.js
- Do NOT load js/main.js
- Zero content dependent on JavaScript — all cards are in the HTML
- Remove all references to the previous loading state, GitHub API, and "Under Development" badge
```

---

## PHASE 5 — About Page (workshop.html)

**Goal:** Replace the meta-page about the website with a professional About page about you.

**Audit context for this phase:**
- workshop.html currently describes the website itself, not you as an engineer — the whole framing must change
- Known typos to fix: "trough" → "through" (line 44), "must of" → "most of" (line 44), "adjusments" → "adjustments" (line 44), "fell free" → "feel free" (line 46)
- Emoticon =) on line 38 — remove
- Wix and Canva listed in the tech stack (lines 58–59) — remove from a professional About page
- "work in progress" / "I enjoy tweaking it" framing throughout (lines 40–41) — replace entirely
- Cover.png banner image is in the current header — remove, use text-focused header like other pages
- Page title is "Rubik's Digital Workshop - About" — update to "About — Rubik Seviyants"

**Prompt:**

```
Rewrite workshop.html. Keep the filename workshop.html to avoid broken links, but change the page title, nav labels, and all content to "About".

NEW PAGE STRUCTURE:

1. PAGE HEADER
   - h1: "About"
   - Subtitle: "Engineer, tester, and continuous learner."

2. MY STORY (2–3 paragraphs)
   Write in clean, confident, first-person professional English:
   - Para 1: Who I am and what I do. Software engineer with a QA background. I bridge development and quality — I don't just test products, I understand how they're built and why they break.
   - Para 2: How I approach my work. I believe quality is built in, not bolted on. I think about test strategy the same way I think about system architecture — early, deliberately, and with the user in mind.
   - Para 3: Beyond work. I write technical articles to share what I learn. I built this site to practice in public. I believe in learning by shipping.
   (Write these paragraphs fully — do not leave placeholders)

3. HOW I WORK (3-column card row)
   Each card has an icon (inline SVG or Unicode symbol), a title, and 2 sentences:
   - "Shift Left" — I integrate testing early in the development cycle. Finding issues at design time costs a fraction of finding them in production.
   - "Automate Deliberately" — Not everything should be automated. I prioritize test cases by risk, frequency, and ROI — not by what's easiest to script.
   - "Iterate in Public" — This site, my GitHub, and my LinkedIn articles are all part of how I practice and document continuous improvement.

4. THIS SITE (small, honest section)
   - Title: "About this site"
   - 2 sentences: "This portfolio is a static site built with HTML, CSS, and JavaScript, hosted on GitHub Pages. It is intentionally lightweight — fast to load, easy to maintain, and a small example of how I approach technical decisions: choose simple tools that do the job well."
   - Stack tags: HTML5, CSS3, JavaScript, GitHub Pages

5. CONNECT
   - "Want to talk engineering, testing, or a potential collaboration?"
   - LinkedIn button + GitHub button

TECHNICAL:
- Update the <title> tag to: "About — Rubik Seviyants"
- Update meta description to: "About Rubik Seviyants — Software Engineer and QA Specialist. Engineering approach, background, and how I work."
- css/about.css for page-specific styles
- Use <div id="nav-root"></div>, <div id="footer-root"></div>, <div id="back-to-top-root"></div>
- Load css/style.css, css/nav.css, css/about.css, and js/components.js
- Do NOT load js/main.js
- No banner image (Cover.png) — text-focused header only
```

---

## PHASE 6 — Articles Page Rebuild (articles.html)

**Goal:** Replace paginated image grid with a clean full-list layout with tag filtering.

**Audit context for this phase:**
- Current articles.html has 10 articles across 3 pages (4 / 4 / 3 layout)
- Pagination logic is DUPLICATED: identical code runs in both main.js (lines 38–94) AND inline in articles.html (lines 307–361) simultaneously — both will be deleted in this phase
- 11 article images exist in `images/articles/` (PNG/JPEG) — these are referenced in the current page but will be replaced with category-colored tag headers, so the images folder can be deleted after this phase
- After this phase main.js has no remaining functionality — delete it

**Prompt:**

```
Rewrite articles.html for my static GitHub Pages portfolio. Keep all existing article data but improve the page structure and UX significantly.

EXISTING ARTICLES (hardcode all of these — do not load them dynamically):

1. Title: "Hosting Your Website for Free with GitHub Pages | Simple Guide"
   Date: Apr 15, 2025 | Tag: Tools | Read time: 5 min
   Excerpt: "A step-by-step walkthrough of hosting a static website for free using GitHub Pages — from repo setup to custom domain."
   URL: https://www.linkedin.com/pulse/hosting-your-website-free-github-pages-simple-guide-seviyants-v6qwc/

2. Title: "A Tester's Tale: Learning by Doing"
   Date: Apr 2, 2025 | Tag: Career | Read time: 6 min
   Excerpt: "A personal account of building projects as a learning tool — why hands-on experimentation beats passive study for QA engineers."
   URL: https://www.linkedin.com/pulse/testers-tale-learning-doing-reuben-rubik-seviyants-jjvzc/

3. Title: "Load, Stress & Performance — Say Hello to JMeter"
   Date: Feb 3, 2025 | Tag: Testing | Read time: 7 min
   Excerpt: "A practical introduction to Apache JMeter covering load testing concepts, test plan setup, and reading results."
   URL: https://www.linkedin.com/pulse/load-stress-performance-say-hello-jmeter-reuben-rubik-seviyants-ytj5c/

4. Title: "API Mocking & Testing with Requestly — A Beginner's Check"
   Date: Jan 20, 2025 | Tag: Testing | Read time: 5 min
   Excerpt: "How to use Requestly to intercept, mock, and test API responses — without changing a line of backend code."
   URL: https://www.linkedin.com/pulse/api-mocking-testing-requestly-beginners-check-seviyants-ekgqc/

5. Title: "API Testing Handshake with Postman — A Beginner's Guide"
   Date: Jan 6, 2025 | Tag: Testing | Read time: 6 min
   Excerpt: "Getting started with Postman for API testing: collections, environment variables, assertions, and automation with Newman."
   URL: https://www.linkedin.com/pulse/api-testing-handshake-postman-beginners-guide-seviyants-usnwc/

6. Title: "Myth of 100% Automation — Balancing Manual and Automated Testing"
   Date: Dec 16, 2024 | Tag: Strategy | Read time: 8 min
   Excerpt: "Why chasing 100% test automation is a trap, and how to build a sustainable testing strategy that uses both approaches where they excel."
   URL: https://www.linkedin.com/pulse/myth-100-automation-balancing-manual-automated-seviyants-xrxcc/

7. Title: "If Starting All Over | Tester or Want to Be One"
   Date: Dec 2, 2024 | Tag: Career | Read time: 7 min
   Excerpt: "Advice for those entering QA from scratch or switching careers into software testing — what to learn, what to skip, and where to start."
   URL: https://www.linkedin.com/pulse/starting-all-over-tester-want-2-one-reuben-rubik-seviyants-kadvc/

8. Title: "Using ChatGPT in Testing — Enhance Your Process, Don't Just Replace It"
   Date: Nov 21, 2024 | Tag: AI | Read time: 6 min
   Excerpt: "How to integrate AI tools like ChatGPT into a testing workflow as a productivity multiplier — not a replacement for critical thinking."
   URL: https://www.linkedin.com/pulse/using-chatgpt-testing-enhance-youre-process-dont-just-seviyants-xi7pc/

9. Title: "Steps to Make Your Testing Life Simple with Automation Tools"
   Date: Nov 11, 2024 | Tag: Automation | Read time: 7 min
   Excerpt: "Practical steps and tool recommendations to reduce manual effort, improve reliability, and build a testing workflow that scales."
   URL: https://www.linkedin.com/pulse/steps-make-your-testing-life-simple-automation-tool-seviyants-mnzyc/

10. Title: "Shifted from Manual to Automation Testing — How You Can Too"
    Date: Nov 5, 2024 | Tag: Automation | Read time: 8 min
    Excerpt: "A personal transition story from manual to automation testing, with a practical roadmap for engineers making the same move."
    URL: https://www.linkedin.com/pulse/shifted-from-manual-automation-testing-how-you-can-too-seviyants-gbbpc/

11. Title: "Manual Testing vs Automated — The New Era of Software & The Role of AI"
    Date: Oct 26, 2024 | Tag: AI | Read time: 9 min
    Excerpt: "An analysis of how AI is shifting the balance between manual and automated testing, and what it means for QA engineers in 2024–2025."
    URL: https://www.linkedin.com/pulse/manual-testing-automated-new-era-software-role-ai-seviyants-m3g1c/

PAGE STRUCTURE:

1. HEADER
   - h1: "Articles"
   - Subtitle: "11 articles on testing, automation, and engineering — published on LinkedIn."

2. FILTER BAR (vanilla JS, no library)
   - Filter buttons: All | Testing | Automation | Strategy | Career | AI | Tools
   - Active filter highlights with accent color
   - Clicking a filter shows only cards with that tag (JS classList toggle on cards)
   - Default: All shown

3. ARTICLE CARDS (full list, no pagination)
   Each card contains:
   - Tag pill (color-coded by category)
   - Title (h3, linked — opens in NEW TAB with target="_blank" rel="noopener noreferrer")
   - Excerpt (the text above)
   - Footer row: date on left, "X min read" on right
   - Subtle "Read on LinkedIn ↗" link at the bottom

   Layout: 2-column grid on desktop, 1-column on mobile

4. BOTTOM CTA
   - "Writing more in 2025 — follow on LinkedIn to get notified."
   - LinkedIn follow button

TECHNICAL:
- ALL content hardcoded in HTML — zero dynamic loading
- Remove all image references (images/articles/...) — use colored category-tag headers instead
- The filter is the only JavaScript on this page (inline <script> at bottom of body is fine)
- Remove the old pagination JS entirely — it existed both in main.js and inline in articles.html, both are gone
- After this phase, delete js/main.js entirely — it has no remaining functionality
- css/articles.css for page-specific styles
- Use <div id="nav-root"></div>, <div id="footer-root"></div>, <div id="back-to-top-root"></div>
- Load css/style.css, css/nav.css, css/articles.css, and js/components.js
```

---

## PHASE 7 — Games Pages Update

**Goal:** Bring the games subfolder pages up to the same standard as the rest of the site — shared styles, proper HTML structure, nav, footer, and clean content. Do not touch the game logic itself.

**Audit context for this phase:**
- `games/index.html`: Has full HTML structure and nav/footer. Has inline `<style>` block with .game-container, .game-card, .game-link, .game-description — these must move to `css/games.css`. Has back-to-top button + inline script (to be replaced by component). Has typos: "cumputer" → "computer", "muse" → "mouse"
- `games/game.html` (PaddlePong): Has no `<!DOCTYPE>`, no `<head>`, no nav, no footer, no CSS link, no viewport meta, no `<title>`. Has offensive text in the win/loss screen: "Click to Play F\*\*er" and "LORRRR !!!" — must be replaced with professional alternatives. The game logic (canvas, JS game loop) must not be touched.
- `games/game2.html` (Break Brick): Has DOCTYPE and html/head/body but is missing viewport meta, title, CSS link, nav, and footer. Has debug mouse coordinate text rendering on the canvas (colorText line) — this is a game bug that should be noted for the user to fix manually, but leave the game logic untouched. Has legacy charset meta format.
- All games/ pages reference `../css/` and `../js/` (one level up) — maintain this relative path pattern

**Prompt:**

```
Update the three HTML files in the games/ subfolder of my static site to match the standard of the rest of the site. Do NOT modify any game logic (canvas drawing, game loops, collision detection, scoring). Only update structure, styles, and content.

CONTEXT:
- The site uses css/style.css, css/nav.css, and js/components.js loaded from the root
- Games pages must use relative paths: ../css/style.css, ../css/nav.css, ../js/components.js
- Nav injection uses <div id="nav-root"></div>, footer uses <div id="footer-root"></div>, back-to-top uses <div id="back-to-top-root"></div>
- components.js active-link detection must correctly identify games/ pages as not matching root pages

GAMES/INDEX.HTML — update:
- Replace the inline <style> block by moving all styles to a new file: css/games.css
- Add <div id="nav-root"></div>, <div id="footer-root"></div>, <div id="back-to-top-root"></div>
- Remove the existing inline nav, footer, and back-to-top <script> block — components.js handles all of this
- Load ../css/style.css, ../css/nav.css, ../css/games.css, ../js/components.js
- Fix typos: "cumputer" → "computer", "muse" → "mouse", "Breack" → "Break", "briks" → "bricks"
- Update page title to: "Games — Rubik Seviyants"

GAMES/GAME.HTML (PaddlePong) — update:
- Add proper HTML5 structure: <!DOCTYPE html>, <html lang="en">, <head>, <body>
- Add: <meta charset="UTF-8">, <meta name="viewport" content="width=device-width, initial-scale=1.0">
- Add: <title>PaddlePong — Rubik Seviyants</title>
- Add: <link rel="stylesheet" href="../css/style.css"> and <link rel="stylesheet" href="../css/nav.css">
- Add: <div id="nav-root"></div> at top of body, <div id="footer-root"></div> and <div id="back-to-top-root"></div> at bottom
- Add: <script src="../js/components.js"></script>
- Replace offensive win/loss screen text inside the existing JS:
  · "Click to Play F**er" → "Click anywhere to play again"
  · "LORRRR !!!" → "Computer wins! Click to play again"
  · "You WON ! " → "You win! Click to play again"
- Wrap the canvas in a div with class "game-wrapper" for layout purposes
- The <canvas> element and ALL game JavaScript must remain exactly as-is (except the 3 text string replacements above)

GAMES/GAME2.HTML (Break Brick) — update:
- Keep the existing DOCTYPE, html, head, body structure
- Replace the legacy charset meta with: <meta charset="UTF-8">
- Add: <meta name="viewport" content="width=device-width, initial-scale=1.0">
- Add: <title>Break Brick — Rubik Seviyants</title>
- Add: <link rel="stylesheet" href="../css/style.css"> and <link rel="stylesheet" href="../css/nav.css">
- Add: <div id="nav-root"></div> at top of body, <div id="footer-root"></div> and <div id="back-to-top-root"></div> at bottom
- Add: <script src="../js/components.js"></script>
- Wrap the canvas in a div with class "game-wrapper" for layout purposes
- The <canvas> element and ALL game JavaScript must remain exactly as-is
- NOTE: the colorText(mouseX+","+mouseY...) debug line is a known issue — leave it, just note it in your response as something to fix manually

CSS/GAMES.CSS — create this file with:
- Styles for .game-container grid, .game-card, .game-link, .game-description (moved from inline styles)
- .game-wrapper: centers the canvas, adds margin, max-width so it doesn't overflow on large screens
- Canvas: display: block, margin: 0 auto, max-width: 100% (canvas games will not be fully responsive on mobile — this is an accepted limitation, just prevent horizontal overflow)
- Accent color and card hover styles to match the design system variables from css/style.css
```

---

## PHASE 8 — Responsive Design Pass

**Goal:** Make every page fully responsive — mobile, tablet, desktop. Run this after all pages are built.

**Audit context for this phase:**
- Current breakpoints before rebuild: only 768px (general) and 480px (pagination) — being replaced
- games/game.html and games/game2.html canvases are fixed at 800×600 — will overflow on very small screens. css/games.css already sets max-width: 100% on canvas. This is an accepted limitation for canvas games — do not try to make them fully responsive, just prevent overflow
- nav hamburger toggle JS is already in components.js from Phase 2 — verify it works

**Prompt:**

```
Add responsive CSS media queries to all CSS files in my static site: css/style.css, css/nav.css, css/home.css, css/projects.css, css/about.css, css/articles.css, css/games.css.

Read every CSS file and every HTML file first, then add responsive styles.

BREAKPOINTS to use:
- Mobile: max-width 640px
- Tablet: max-width 1024px
- Desktop: default (no media query)

REQUIREMENTS per page:

GLOBAL (style.css):
- .container: full width on mobile with 16px horizontal padding
- All h1 headings: scale down by ~20% on mobile
- .btn-primary / .btn-secondary: full width on mobile, inline on desktop
- .tag pills: wrap naturally

NAV (nav.css):
- Desktop: horizontal link row
- Mobile: hamburger menu (3-line icon) that toggles a dropdown nav
- The toggle JS is already in components.js from Phase 2 — verify the CSS class it toggles matches

HOMEPAGE (home.css):
- Hero: stack vertically on mobile (buttons full width, trust bar wraps)
- About strip: single column on mobile
- Stat cards: 2x2 on mobile
- Skills tags: wrap naturally (already flex-wrap)
- Article teaser: single column on mobile

PROJECTS (projects.css):
- Cards: 1 column on mobile, 2 on tablet, 2–3 on desktop (verify grid-template-columns)
- Featured card: full width on all sizes

ABOUT (about.css):
- "How I Work" cards: stack to 1 column on mobile

ARTICLES (articles.css):
- Filter bar: horizontally scrollable on mobile (overflow-x: auto, no wrap)
- Cards: 1 column on mobile

GAMES (games.css):
- game-container: 1 column on mobile
- Canvas: already has max-width: 100% — verify this prevents overflow on mobile
- Note: canvas games will not be touch-friendly — this is an accepted limitation

After making all changes, list every breakpoint rule you added and which file it went into.
```

---

## PHASE 9 — Analytics, SEO & Performance

**Goal:** Add analytics, fix SEO meta tags on all pages, and do a performance pass.

**Audit context for this phase:**
- No favicon exists on any page — add one
- No `<link rel="preconnect">` for Google Fonts on any page — add to all
- No Open Graph or Twitter Card meta tags anywhere — add to all
- No canonical links anywhere — add to all
- No analytics of any kind — add Plausible
- Font Awesome 6.4.0 loaded via cdnjs on every page without `defer` — fix this
- games/game.html now has a proper head after Phase 7 but started with none — double-check all meta tags were added
- games/game2.html had legacy charset format `<meta content="text/html;charset=utf-8" http-equiv="Content-Type">` — fixed in Phase 7, verify
- CNAME is set to www.ru8iks.com — canonical URLs should use this domain

**Prompt:**

```
I have a static site on GitHub Pages. Do the following across all HTML files:

HTML FILES TO UPDATE: index.html, projects.html, workshop.html, articles.html, fullstack-demo.html, games/index.html, games/game.html, games/game2.html

1. SEO META TAGS — update every page's <head> with correct tags:

index.html:
  - title: "Rubik Seviyants — Software Engineer & QA Specialist"
  - description: "Portfolio of Rubik Seviyants — Software Engineer and QA Specialist. Test automation, web development, CI/CD pipelines."
  - og:title, og:description, og:url: https://www.ru8iks.com/
  - og:type: website

projects.html:
  - title: "Projects — Rubik Seviyants"
  - description: "Software projects by Rubik Seviyants — test automation frameworks, web applications, and engineering tools."

workshop.html (About):
  - title: "About — Rubik Seviyants"
  - description: "About Rubik Seviyants — Software Engineer and QA Specialist. Engineering approach, background, and contact."

articles.html:
  - title: "Articles — Rubik Seviyants"
  - description: "11 technical articles on software testing, test automation, AI in QA, and engineering careers by Rubik Seviyants."

games/index.html:
  - title: "Games — Rubik Seviyants"
  - description: "Browser games built with HTML5 Canvas and JavaScript by Rubik Seviyants."

games/game.html:
  - title: "PaddlePong — Rubik Seviyants"

games/game2.html:
  - title: "Break Brick — Rubik Seviyants"

2. PLAUSIBLE ANALYTICS (privacy-first, free, GDPR-compliant):
   Add this script to every page's <head>:
   <script defer data-domain="ru8iks.com" src="https://plausible.io/js/script.js"></script>
   Note: create a free account at plausible.io and verify the domain separately after pushing.

3. PERFORMANCE — check every page for:
   - Add rel="preconnect" and rel="dns-prefetch" for Google Fonts on all pages that load them
   - Add defer to Font Awesome script tag on all pages
   - Any images without width/height attributes
   - Any missing alt text on images
   - Confirm all external resources load from HTTPS only

4. CANONICAL LINKS — add to every page:
   <link rel="canonical" href="https://www.ru8iks.com/[pagename].html" />
   (index.html gets https://www.ru8iks.com/)

5. FAVICON — add a placeholder favicon link to every page's <head>:
   <link rel="icon" type="image/png" href="/favicon.png">
   Note: add the actual favicon.png file to the repo root manually.

Report everything you changed, file by file.
```

---

## PHASE 10 — Final Content QA Pass

**Goal:** Treat the site as a product and run a content quality pass — the same discipline you'd apply to code review.

**Audit context for this phase:**
- Known typos from workshop.html: "trough" → "through", "must of" → "most of", "adjusments" → "adjustments", "fell free" → "feel free" (should be fixed in Phase 5, verify they're gone)
- Known typos from games/index.html: "cumputer" → "computer", "muse" → "mouse" (should be fixed in Phase 7, verify)
- game.html offensive text: "Click to Play F\*\*er" → "Click anywhere to play again" (should be fixed in Phase 7, verify)
- Placeholder hrefs still needing manual action: /cv.pdf, [X] years of experience
- All nav labels should read: Projects | About | Articles across all pages
- Consistent name usage: "Rubik" informally, "Rubik Seviyants" in full professional contexts

**Prompt:**

```
Run a content QA pass on my entire static site. Read every HTML file.

HTML FILES TO CHECK: index.html, projects.html, workshop.html, articles.html, fullstack-demo.html, games/index.html, games/game.html, games/game2.html

Check for and fix ALL of the following:

SPELLING & GRAMMAR:
- Fix every typo, misspelling, and grammatical error
- Previously known issues (verify fixed from earlier phases): "trough"→"through", "must of"→"most of", "adjusments"→"adjustments", "fell free"→"feel free", "cumputer"→"computer", "muse"→"mouse"
- Scan for any remaining informal language or emoticons in professional sections

TONE & VOICE:
- Flag any sentences that sound junior or apologetic (e.g. "work in progress", "just for fun", "I'm still learning")
- Replace hedging language with confident, factual statements
- Confirm first-person is used consistently (not "Rubik is a developer" AND "I am a developer" mixed)

LINK AUDIT:
- List every external link on the site
- Confirm all LinkedIn and GitHub URLs are correct
- Flag any placeholder hrefs like "#", "/cv.pdf" that still need to be filled in
- Confirm all external links have target="_blank" rel="noopener noreferrer"

CONSISTENCY:
- Confirm my name is presented consistently: "Rubik" in casual contexts, "Rubik Seviyants" in full professional contexts (page titles, meta, footer)
- Confirm nav labels match exactly: Projects | About | Articles across all pages
- Confirm page titles follow format: "[Page] — Rubik Seviyants" on sub-pages, "Rubik Seviyants — ..." on homepage

OUTPUT FORMAT:
For each issue found, report:
- File: [filename]
- Location: [section/element]
- Issue: [what's wrong]
- Fix applied: [what you changed it to]

Make all fixes directly in the files.
```

---

## Quick reference — file structure after all phases

```
ru8iks.com/
├── index.html
├── projects.html
├── workshop.html            ← "About" in content and nav, filename preserved
├── articles.html
├── fullstack-demo.html      ← kept, linked from projects page
├── CNAME                    ← www.ru8iks.com
├── Cover.png                ← can delete after Phase 3 removes banner
├── favicon.png              ← ADD MANUALLY before launch
├── cv.pdf                   ← ADD MANUALLY before launch
├── css/
│   ├── style.css            ← design system: variables, reset, utilities, shared layout
│   ├── nav.css              ← nav + footer styles
│   ├── home.css
│   ├── projects.css
│   ├── about.css
│   ├── articles.css
│   └── games.css
├── js/
│   └── components.js        ← injects nav, footer, back-to-top into all pages
│   (main.js deleted after Phase 6)
├── images/
│   └── Demos/
│       └── Demo2.gif        ← kept for fullstack-demo.html
│   (images/articles/ folder can be deleted after Phase 6)
└── games/
    ├── index.html
    ├── game.html            ← PaddlePong
    └── game2.html           ← Break Brick

FILES TO DELETE (clean up after all phases):
- js/main.js                 (deleted end of Phase 6)
- temp_game.html             (orphaned, delete any time)
- WebImage1.jpg              (unreferenced root image, delete any time)
- images/articles/           (folder of old article images, delete after Phase 6)
```

---

## Before you push to GitHub — manual checklist

- [ ] Add `cv.pdf` to the repo root (linked from homepage Download CV button)
- [ ] Add `favicon.png` to the repo root
- [ ] Update all `[X]` placeholders in copy (years of experience)
- [ ] Fill in Project 4 placeholder card details with a real project
- [ ] Fill in FullstackDevelopment project description and stack tags
- [ ] Create free account at plausible.io and verify ru8iks.com domain
- [ ] Test every page on mobile (Chrome DevTools responsive mode)
- [ ] Test every external link by clicking it
- [ ] Test the articles filter buttons (All / Testing / etc.) in the browser
- [ ] Test the nav hamburger menu on mobile
- [ ] Confirm CV download link works
- [ ] Play both games (PaddlePong, Break Brick) and verify they work after HTML structure changes
- [ ] Fix the Break Brick debug mouse coordinate text if it still shows (game2.html colorText line)
- [ ] Push to GitHub and verify GitHub Pages deployment succeeds
- [ ] After deployment, confirm plausible.io shows data coming in
