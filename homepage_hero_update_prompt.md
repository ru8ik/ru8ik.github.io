# Claude Code Prompt — Homepage Hero Update
**Scope: index.html + home.css only. Do not touch any other page.**

---

## Prompt

Read `index.html` and `css/home.css` (or the main CSS file if home.css doesn't exist yet) fully before making any change.

Make the following precise changes to the homepage hero section. I will describe each change, where it is, what to remove, and what to replace it with. Do not invent additional changes.

---

### CHANGE 1 — Remove the duplicate name label above the h1

**What to find:** A line above the main h1 heading that reads "RUBIK SEVIYANTS" (likely in a `<p>`, `<span>`, or `<div>` with a class like `.hero-label`, `.eyebrow`, or `.name-label`).

**Why:** My name is already in the nav logo. It should appear only once on the page.

**What to replace it with:**
```html
<p class="hero-label">OPEN TO NEW OPPORTUNITIES · REMOTE &amp; ON-SITE</p>
```

Keep the same element type and class. Only change the text content. Do not change the styling of this element.

---

### CHANGE 2 — Rewrite the main h1 headline

**What to find:** The `<h1>` containing "Software Engineer & QA Specialist" (likely split across styled `<span>` elements with accent color on "QA Specialist").

**What to replace it with:**
```html
<h1 class="hero-title">
  Software Engineer &amp; <span class="accent">Automation</span> Expert
</h1>
```

Rules:
- Keep the same h1 structure and class names as before.
- Apply the teal/accent color class ONLY to the single word "Automation" — not to "Expert".
- Remove teal/accent from all other words in the h1.
- The word "& " (ampersand) should remain in the muted/gray color it currently is, or in white — not teal.
- Do not change font size, weight, or line-height.

---

### CHANGE 3 — Rewrite the subtitle paragraph

**What to find:** The `<p>` under the h1 that reads:
"I build reliable web applications and the test automation that keeps them that way."

**What to replace it with:**
```html
<p class="hero-subtitle">
  I build and test web products across the full cycle — adapting across stacks, 
  owning quality end-to-end, and integrating AI tools where they add real leverage.
</p>
```

Keep the same class name. Then in the CSS, increase the font-size of `.hero-subtitle` (or whatever the subtitle class is):
- If currently under 18px: set to 20px
- If currently 18px: set to 21px
- If already 20px or above: leave it

Also increase `line-height` to 1.65 if it isn't already.

---

### CHANGE 4 — Add a capability strip between the subtitle and the buttons

**Where:** In the HTML, insert this block AFTER the subtitle `<p>` and BEFORE the CTA button row.

```html
<p class="hero-strip">
  Frontend &nbsp;·&nbsp; Backend &nbsp;·&nbsp; Test Automation &nbsp;·&nbsp; CI/CD &nbsp;·&nbsp; AI-Assisted Dev
</p>
```

Then add this CSS for `.hero-strip`:
```css
.hero-strip {
  font-size: 13px;
  color: var(--text-muted, rgba(255,255,255,0.4));
  letter-spacing: 0.04em;
  margin-top: 1.25rem;
  margin-bottom: 0;
}
```

This should look like quiet metadata — muted, small, not pill tags. It sits between the subtitle and the buttons.

---

### CHANGE 5 — Fix the CTA buttons

**What to find:** Two buttons in the hero — one labeled "View Projects" and one labeled "View LinkedIn".

**What to do:**

Primary button — keep exactly as is:
```html
<a href="projects.html" class="btn-primary">View Projects</a>
```

Secondary button — REMOVE the "View LinkedIn" button entirely. Do not replace it with anything. The LinkedIn link already exists in the trust bar below — it does not need to be a button.

After removing the secondary button, if the button row `<div>` now contains only one button, remove any `gap` or flex spacing that was designed for two buttons. The single button should sit left-aligned (or wherever it was), not centered with phantom space.

---

### CHANGE 6 — Verify the trust bar (do not break it)

**What to find:** The row below the buttons containing the GitHub and LinkedIn icon links (github.com/ru8ik and linkedin.com/in/ru8ik).

**What to do:** Leave this completely unchanged. This is where LinkedIn lives and it stays here. No edits.

---

### CHANGE 7 — Teal accent audit

After making all changes above, scan the entire hero section for any remaining uses of the accent/teal color class or inline color style.

There should be exactly ONE element with the accent color in the hero after your edits: the word "Automation" in the h1.

If you find the accent color applied anywhere else in the hero section (other than the "View Projects" button which can keep its teal fill), remove it.

---

## What NOT to change

- Do not touch the nav, footer, or any section below the hero.
- Do not change any font families, font weights, or the overall dark background.
- Do not add any animations, hover states, or new CSS that wasn't asked for.
- Do not change the background glow if one exists — leave it as is.
- Do not rename any CSS classes unless instructed.
- Do not touch any other page (projects.html, workshop.html, articles.html).

---

## Verification checklist — confirm before finishing

After making all changes, read back the modified hero section HTML and confirm:

- [ ] "RUBIK SEVIYANTS" is gone — replaced with the availability line
- [ ] h1 reads: "Software Engineer & Automation Expert" — only "Automation" is teal
- [ ] Subtitle reads the new copy and font-size is 20px or above
- [ ] Capability strip is present between subtitle and buttons
- [ ] Only ONE button remains in the CTA row ("View Projects")
- [ ] LinkedIn button is gone (LinkedIn stays in trust bar only)
- [ ] Teal accent appears exactly once in the hero (the word "Automation")
- [ ] Name "Rubik" or "Rubik Seviyants" appears only once on the page (in the nav logo)
