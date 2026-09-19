# Reference-based portfolio — verification

Date: 20 September 2026

Branch: `feat/curated-engineering-portfolio`

Local preview: http://127.0.0.1:8000

Browser: Chromium via agent-browser

## Reference and visual checks

Inspected the user-supplied style image and four frames from the 16-second motion reference. Implemented the Manrope typography, staggered hero, orange/cyan accents, blue atmospheric motion, grain, pointer lens, and layered featured-project cards with the existing engineering content.

Reviewed the hero, cursor lens, project carousel, and phone layout in the browser. Fixed missing spaces in the mobile showcase introduction and improved the mobile hero metadata sizing.

Screenshots: [desktop](previews/portfolio-desktop.png), [featured work](previews/portfolio-work.png), [mobile](previews/portfolio-mobile.png).

## Responsive checks

| Viewport width | Document width | Broken images |
| --- | --- | --- |
| 320px | 320px | 0 |
| 390px | 390px | 0 |
| 768px | 768px | 0 |
| 1024px | 1024px | 0 |
| 1440px | 1440px | 0 |

## Interaction checks

Final run after the professional review: 46 of 46 browser assertions passed ([results](audit/interaction-checks.json)), covering:

- “AI Engineer” heading and no Depth mode link. (The run also covered the first eight stack icons; the stack now has logos for all 31 tools, checked separately below.)
- Work and résumé calls to action; impact before selected work; experience before biography.
- Document intelligence as the first featured slide; previous/next controls; inactive slides inert.
- All-project, AI/data, and developer-tool filters.
- All six project dialogs: structured engineering notes, correct public-source visibility (none for the internal project), and focus return on close.
- Quick navigation and résumé search.
- Workflow node reachability and selection; earlier-experience disclosure.
- Fragment links, unique IDs, no broken images, and reduced-motion behaviour.

Separate responsive and control checks ([results](audit/responsive-checks.json)): mobile menu opens and closes, dialog close button works, the document-parsing and CSV dialogs scroll on mobile, and motion pauses and resumes.

Separately verified the pointer lens visually and checked that reduced-motion emulation pauses the page, removes background animation, hides the lens, and disables the manual motion control. Touch swipe handling is implemented; native swipe input was not exercised by this automated check.

## Accessibility checks

axe-core found 0 violations on the mobile page and the document-parsing and CSV dialogs ([main](audit/accessibility-main-mobile.json), [docparse](audit/accessibility-docparse-mobile.json), [csvchat](audit/accessibility-csvchat-mobile.json)). axe marked colour contrast as “incomplete” for 39 elements on the main page and 2 in the CSV dialog. That happens when text sits over gradients or illustrations that axe cannot measure. Those need manual review, and the result is not a claim of full WCAG conformance.

## Stack logos

At 390px and 1440px, all 31 stack tags render a visible logo (31 SVGs, none with zero size), with no horizontal overflow, script errors, or failed requests. A 3× zoom review confirmed each mark is legible at 15px. All other tag lists also carry logos: 66 of 66 page tags (stack, project cards, experience), and every tag in all six project dialogs (27 of 27), with no script errors at either width.

## Glass lens on every section

Headless Chromium, 1440 × 900, with a mouse pointer:

- The lens appears and magnifies content in all 10 regions: hero, impact strip, featured work, project index, experience, about, stack, recognition, contact, and footer.
- Alignment: for a text element in each region, the magnified copy sits exactly where an 8% enlargement about the pointer predicts (0px error in every region).
- It stays hidden over links and while a project dialog is open. When the page scrolls under a still pointer, it switches to the section now beneath it.
- It is hidden with reduced motion, on touch (iPhone 13 emulation), and while motion is paused from the footer; it returns when motion resumes.
- Cost: 120 pointer moves over the stack section caused no layout passes, about 17ms of style recalculation, and about 8ms of script in total. No script errors.

## Projects, writing, and sharing (20 September 2026)

- Six project cards in the order document intelligence, Refund Desk, loop-lab, Polymarket MCP, Open Agents, anomaly detection; filters show 4 AI/data and 2 developer-tool projects; the carousel cycles Document intelligence → Refund Desk → loop-lab.
- All six dialogs open with four engineering notes, the correct repository link (none for the internal project), and an icon on every tag.
- Project illustrations no longer clip at any width from 320px to 1440px (this also fixes Open Agents, which clipped on narrow screens before), and cards in the same row share a height.
- Writing: "Explore more writing" opens and closes by mouse and keyboard (Enter), reveals eight more post cards with working links, and needs no JavaScript; no horizontal overflow at 390 or 1440px.
- Writing: five post cards with working LinkedIn links, correct at 390, 768, and 1440px; "WRITING" highlights in the navigation, and quick navigation finds it.
- At 320, 390, 768, 1024, and 1440px: no horizontal overflow, broken images, duplicate IDs, broken fragment links, script errors, or failed requests.
- `robots.txt`, `sitemap.xml` (valid XML), `404.html`, and `og-image.jpg` are served; the JSON-LD block parses.

## Visual attention report

[The report](audit/index.html) was opened in headless Chromium. All 16 section and dialog options rendered at both desktop and mobile sizes, with no failed requests or script errors. Where no “before” capture exists (the impact strip and the project dialogs), the report shows an explanatory note instead.

## Static and runtime checks

- JavaScript syntax checks for `dist/app.js` and `dist/motion.js`.
- Unique HTML IDs, valid local fragment links, and existing local assets.
- No failed local resource requests or application JavaScript errors during the completed browser checks.
- `git diff --check`.
- Asset version parameters ensure browsers request the updated scripts and styles when opening this redesign.

Verification covers the local static site in Chromium. Production publication and cross-browser checks are not part of this preview. External email delivery is handled by the visitor’s email application.
