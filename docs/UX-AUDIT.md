# Portfolio design and content review

Date: 20 September 2026 · Branch: `feat/curated-engineering-portfolio`

## Scope and method

The current portfolio is one scrolling page, with six project-detail dialogs and a quick-navigation dialog. This review covers its complete desktop and mobile content, navigation, and interaction states. The older `/depth/` and `/depth/?view=flat` experiments are retained as archived routes; the current portfolio no longer links to them. They are not represented as the redesigned experience.

[Open the visual attention report](audit/index.html). It includes before/after desktop and mobile screenshots, a map for each page section, and the first viewport of every project dialog at both sizes. Dialogs also have scrollable content, checked separately.

**These are heuristic attention maps, not visitor heat maps.** No analytics, eye tracking, click tracking, or user study was available or installed. The maps mark headings, illustrations, prominent links, and metrics from measured DOM coordinates, using type size and element size as visual-emphasis proxies. They deliberately do not report fixation probabilities, click percentages, conversion increases, or a numerical design score. They support inspection; they do not prove usability gains.

## Findings and implemented changes

| Perspective | Problem in the earlier version | Implemented response |
| --- | --- | --- |
| UI/UX designer | Oversized “Applied” dominated the hero; the only forward cue was a thin arrow. | Accurate “AI Engineer” heading, concise specialisation, prominent work action and visible résumé link. Kept Manrope, restrained orange italics, atmospheric gradients, and native scrolling. |
| UI/UX designer | Several labels were 9–11px; carousel selectors were narrow; two illustration palettes had contrast failures. | Enlarged functional text and carousel controls, improved illustration-label contrast, retained visible focus, reduced-motion support, and explicit motion pause. |
| UI/UX designer | Repetitive introductory copy and oversized recognition section lengthened the page. | Shortened the featured introduction, reduced illustration heights, and condensed recognition into a secondary section. |
| Recruiter | Employer, résumé, experience, and scale were difficult to find quickly. | Employer and background in the hero; résumé in desktop navigation and hero; impact strip immediately after the hero; experience before biography. |
| Recruiter | The first featured project was a macOS utility despite the AI engineering positioning. | Document intelligence first in the carousel and project index, followed by Refund Desk (an evaluated production-style agent) and loop-lab (agent engineering). Replaced TerminalHistory, CSVChat, and System Design Academy on 20 September 2026. |
| Engineer | Project descriptions mainly listed features and technologies. | Six structured notes explain the problem, implementation/contribution, engineering decisions, and evidence/scope. Source links remain explicit. |
| Engineer | Skill lists were visually repetitive and crowded. | Reduced the main inventory to 31 tools across five groups. Every tool has a small monochrome logo beside its readable name, so the marks aid recognition without favouring some tools. The same logos, plus neutral outline icons for concepts such as RAG and RLHF, mark tags on project cards, experience entries, and project dialogs. No proficiency bars or arbitrary scores. |
| AI engineer | Internal work, a fork, simulated ML, and public retrieval projects could be mistaken for equivalent production evidence. | Explicit internal/fork/simulation labels and scope in project notes. Open Agents distinguishes the upstream platform from the MongoDB contribution. |
| AI engineer | Model-related claims lacked visible context. | Document-parsing reduction is attributed to the résumé with a non-public benchmark caveat. Refund Desk reports its false-refund rate alongside accuracy and states that labels are policy-derived. No invented evaluation, accuracy, latency, or adoption metrics. |
| All | Depth mode competed with the intended portfolio experience. | Removed the Depth mode entry from the current portfolio. |

## Section-by-section attention review

- **Home:** earlier emphasis was almost entirely the decorative title. The revised hierarchy is role → specialisation → work/résumé, with employer and education as supporting information. On mobile the primary actions remain visible in the initial viewport at 390 × 844.
- **Impact:** previously below the biography. Now directly after the hero, attributed to OnFinance AI and linked to responsibilities; figures remain factual résumé content rather than anonymous decorative counters.
- **Featured work:** AI work is visible without changing slides. The carousel is supplementary; the project index provides access to every item without using it.
- **Project index:** AI relevance sets order. Public source links, internal/fork credits, and engineering notes serve different review depths. Illustrations are labeled as such.
- **Experience:** role, company, dates, and production ownership are scannable. Four themed bullets replace seven dense bullets for the current role; earlier experience remains expandable.
- **About:** the portrait and economics background support personal context after professional evidence. Education and photography retain personality without leading the hiring decision.
- **Stack:** typography carries the hierarchy. All 31 tools have small monochrome logos in one neutral colour, so they help recognition without becoming a competing colour system.
- **Recognition:** shorter, secondary presentation; removed the unnecessary comparison with lower award tiers.
- **Contact:** direct email, copy control, GitHub, LinkedIn, and résumé. No form or invented availability claim. Footer no longer redirects visitors into a different design mode.
- **Project dialogs:** problem and contribution are first; engineering reasoning and evidence follow. Internal work has no false source button. Native dialog Escape/focus behavior is preserved.

## Verification and practical limits

See [the browser verification record](REDESIGN-QA.md) and the JSON files in `docs/audit/` for executed checks. Automated accessibility checks supplement visual and keyboard review; gradient-backed and illustrative text requires manual assessment, so zero detected violations is not a claim of full WCAG conformance.

The portfolio still has a real evidence limitation: not every AI project has a public evaluation dataset or benchmark. The design now states the available evidence honestly. Adding actual retrieval evaluation sets, failure analyses, latency/cost measurements, and approved architecture write-ups would strengthen the technical content further; those cannot be invented during a visual redesign.

## References

- [W3C: minimum contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): check readable text against its actual background.
- [W3C: minimum target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): the AA criterion uses 24 CSS pixels with exceptions; this review uses 44px controls for the carousel and key icon actions for additional room.
- Technology logos: Simple Icons, LobeHub Icons, theSVG, selfh.st/icons, Tabler Icons, and the official XGBoost logo. Sources and licences are listed in `docs/CONTENT-SOURCES.md`.
