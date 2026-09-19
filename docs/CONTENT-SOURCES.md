# Content provenance

Content was prepared on 6 September 2026 from the user's supplied profile PDF and the public GitHub account at https://github.com/HimanshuKumar17052001. The profile PDF was replaced with an updated resume on 7 September 2026. On the same date the project selection was revised and the experience, skills, and education content was reconciled against that resume.

## Profile PDF

- Name, AI Engineer role, Bengaluru location, email, and LinkedIn URL.
- OnFinance AI experience, June 2025–present.
- Agent Studio, LLM/RAG/document intelligence work, 100M+ monthly tokens, 20+ enterprise accounts, AWS Kubernetes operations, data systems, CI/CD, and $260K+ infrastructure credits.
- Outlier, Soul AI, Schneider Electric, and IIT Kharagpur experience.
- M.Sc. Economics at IIT Kharagpur, 2020–2025, 7.9/10.0 CGPA, and AI4ICPS certification. The degree wording and CGPA follow the September 2026 resume; the AI4ICPS certificate is retained from the earlier profile PDF and is not contradicted by the newer one.
- Photography leadership and advisor roles at the Technology Filmmaking and Photography Society.

## Institute Order of Merit

The Institute Order of Merit (Social & Cultural) was supplied directly by the user on 7 September 2026 and is not drawn from the resume or from GitHub. The user pointed to their LinkedIn profile as the record of it; LinkedIn returns HTTP 999 to unauthenticated requests, so the claim itself could not be verified from here and rests on the user’s own statement about their own award.

The surrounding description was checked against public sources. The Technology Students’ Gymkhana at IIT Kharagpur presents annual awards in Sports & Games, Technology, Social & Cultural, and Special Recognition categories, with tiers of Institute Order of Merit, Honorable Mention, and Special Mention.

- https://wiki.metakgp.org/w/Technology_Students%27_Gymkhana — award categories and tier names.
- https://gymkhana.iitkgp.ac.in/awards — official Hall of Fame; the award listings are rendered client-side and could not be read in full.


The displayed employment dates use calendar dates from the PDF rather than its automatically calculated tenure strings.

## GitHub repositories

Repository metadata was retrieved through GitHub's public API. All selected repositories are original work except `open-agents`, which is a fork of https://github.com/vercel-labs/open-agents (MIT). The site labels it as a fork, credits the upstream project, and describes only the change that is actually present in the fork.

- https://github.com/HimanshuKumar17052001/refund-desk — README, service layout, `requirements.txt` files, `services/web/package.json`, test files, and `evals/results/haiku-20*.json`. The quoted figures (80% accuracy, 5% false-refund rate, $0.0125 and about 11 seconds per ticket on 20 tickets; 50% on the first run) come from those result files. Test counts are the defined test functions: 32 in `tests/` and 12 Playwright tests in `services/web/e2e/`.
- https://github.com/HimanshuKumar17052001/loop-lab — README, `loop_lab/` source, and `tests/test_loop.py` (46 test functions; the README's older figure of 17 is not used).
- https://github.com/HimanshuKumar17052001/polygon-custom-mcp — README, `server.py` (four MCP tools, Chroma, ARIMA), and `client.py` (LangGraph ReAct agent on Groq). The repository name says Polygon; the project uses Polymarket, so the site calls it the Polymarket MCP Server.
- https://github.com/HimanshuKumar17052001/real-time-anomaly-detection — description and README.
- https://github.com/HimanshuKumar17052001/open-agents — repository metadata, README, and the one commit that is not inherited from upstream.

### Project selection (20 September 2026)

All 30 repositories, public and private, were reviewed. TerminalHistory, CSVChat, and System Design Academy were replaced by Refund Desk, loop-lab, and the Polymarket MCP server, which are recent, AI-engineering-specific, and carry measured or testable evidence. Not featured:

- `extraction-agent`, `AR`, `drhp-note-generation`, `drhp-ipo-tool-frontend`, `investigation-video-processing`: financial-document and client work that appears to belong to OnFinance AI; the document-intelligence card already represents this work without exposing it.
- Older notebooks and small experiments (`BERT-sentiment-analysis`, `groq-chatbot-streamlit`, `weather-app`, analytics notebooks): superseded by the featured projects.

## Project without a repository

The Hierarchical Document Parsing and Agentic Traversal Engine card comes from the resume’s projects section, not from GitHub. It is internal work at OnFinance AI, so the card carries no repository link and its dialog shows a note in place of the source button. The resume dates this project September to November 2024; those dates are not shown on the site, because they precede the stated OnFinance start date of June 2025 and the release of the model the resume names.

The portfolio does not copy any repository environment settings, credentials, or configuration examples. It does not present project descriptions as independently benchmarked results.

## Design research

- https://brittanychiang.com/ — clear experience hierarchy and project presentation.
- https://rauno.me/ — concise engineering identity and attention to interaction details.
- https://leerob.com/ — minimal, direct personal presentation.

These references informed the earlier design. The September editor redesign uses the user-requested reference documented below. No reference portfolio’s source code or branding was copied.

### Depth mode

The `dist/depth/` variation takes its interaction concept from scroll-driven Z-axis
sites, where a camera travels forward through content planes, and its pointer-reactive
dot field from Razorpay's AI Builder page:

- https://razorpay.com/ — brand colour direction: Dodger Blue #0D94FB, Prussian Blue #012652, white and greys.
- Razorpay AI Builder — camera travel on scroll, flying particles, and a dot grid that scatters under the cursor.

Only the interaction ideas and the publicly documented brand colour values were
referenced. The camera model, spring easing, corridor and particle field, HUD,
layout, styling, and copy are original to this project, and no Razorpay source,
branding, artwork, logo, or copy was used. The site does not claim any association
with Razorpay. Depth mode presents the same profile and repository content
documented above; it introduces no new claims.

## Fonts

Space Grotesk and IBM Plex Mono were obtained from the Google Fonts stylesheet service and converted to WOFF for self-hosting. They are distributed under the SIL Open Font License; the corresponding license files accompany this source.

## September 2026 editor redesign

The classic view was redesigned on 19 September 2026 using the user-requested reference by Prashant Tandel:

- https://dribbble.com/shots/27414961-Developer-Portfolio-UI-Where-Code-Meets-Conversion

The reference was visually inspected from its full-resolution Dribbble image. Its three-column editor layout, charcoal surfaces, file tabs, line numbers, oversized headline, and project title bars informed this implementation. The source code is original and the content remains based on the portfolio records above. Project previews are local HTML/CSS illustrations, not product screenshots. The reference artwork is not distributed with the site.

The profile portrait was downloaded from the user’s public GitHub avatar at https://github.com/HimanshuKumar17052001.png?size=160 and is self-hosted as `dist/assets/himanshu-avatar.png`.

## Current atmospheric design

The user supplied these references on 19 September 2026, replacing the earlier request to choose a design from a shortlist:

- `original-1f1610f0a43c0aed537ab125d7ef8e45.mp4` — 16-second motion reference; inspected at multiple timestamps.
- `original-87029f4a232a3377371a49a1daed0de0.webp` — style reference identifying Manrope, orange `#FFA800`, and cyan `#00FFE0`.

The artwork identifies Desire Agency and shows a Veronica PW portfolio concept. The implementation adapts its typography, blue atmospheric background, cursor lens, staggered hero, and overlapping project cards to Himanshu’s engineering content. No affiliation is claimed. The original artwork and video are not distributed in the site.

Manrope’s variable font and its SIL Open Font License were downloaded from the Google Fonts repository:

- https://github.com/google/fonts/tree/main/ofl/manrope

The portrait is the same public GitHub avatar at its original 460px size, retrieved through `https://github.com/HimanshuKumar17052001.png?size=800`. Orange italic text uses the visitor’s Georgia/Times New Roman serif font. All existing experience claims, metrics, project provenance, upstream credits, and internal-project restrictions remain grounded in the records above.

## Professional review additions

- Technology logos: all 31 tools in the stack section have a small monochrome mark, embedded as inline SVG (no runtime requests). Sources:
  - [Simple Icons](https://simpleicons.org) (CC0): Python, LangGraph, LangChain, PyTorch, TensorFlow, scikit-learn, Hugging Face (for Transformers), Kubernetes, Docker, Linux, GitHub Actions, Argo (for Argo CD), Cloudflare, MongoDB, Qdrant, Redis, RabbitMQ, Trino, FastAPI, Pydantic, TypeScript, Swift, Streamlit, pandas.
  - [LobeHub Icons](https://github.com/lobehub/lobe-icons) (MIT): AWS, Groq.
  - [theSVG](https://github.com/glincker/thesvg) via Iconify (MIT): LlamaIndex, Amazon Bedrock.
  - [selfh.st/icons](https://github.com/selfhst/icons) via Iconify ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)): LiteLLM. Recoloured to one colour at three opacities.
  - [Tabler Icons](https://github.com/tabler/tabler-icons) (MIT, `docs/tabler-LICENSE.txt`): SQL. SQL is a language with no official logo, so this is a generic SQL glyph.
  - XGBoost: the decision-tree glyph cropped from the official logo at https://xgboost.ai/images/logo/xgboost-logo.svg, recoloured to one colour. The full wordmark is too wide for a tag.
- The same marks appear on every tag list: project cards, experience entries, and project dialogs (dialog-only icons live in the `#tag-icons` template in `dist/index.html`). Additional sources for those tags:
  - Simple Icons (CC0): Claude (Claude Haiku 4.5), Next.js, SQLite, Vercel (Vercel Workflows), Apple (macOS; the macOS mark is a wordmark), Meta (FAISS, a Meta AI library), Plotly (Plotly and Dash; Simple Icons' “Dash” is an unrelated cryptocurrency).
  - River: its official three-wave icon (https://github.com/online-ml/river/blob/main/docs/img/icon.png) is only published as a PNG, so it is redrawn as a vector.
  - Concepts without a brand use Tabler outline icons (MIT): AI research (microscope), Agentic traversal (route), CLI (terminal), Developer tooling (tools), Document intelligence (file-text-ai), Embeddings (vector), Generative AI (sparkles), Model evaluation (report-analytics), Preference ranking (arrows-sort), Prompt engineering (prompt), RAG (database-search), RLHF (thumb-up), Sandbox VM (box), System design (sitemap), Tool calling (api), Vector search (list-search), Vision (eye), SNARIMAX (chart-line), IIT Kharagpur (school; the institute crest is illegible at 12px).
  - Logos are trademarks of their owners and are used only to identify the tools.
- Engineering notes restructure existing project and résumé content. Refund Desk labels are derived by its policy engine, as its README states; the site says so rather than implying human-annotated ground truth.
- Attention maps in `docs/audit/` are layout heuristics from DOM measurements. They are not recorded user behavior.

## Writing section (20 September 2026)

The five posts were chosen from the owner's LinkedIn activity page, read on 20 September 2026 in a browser session the owner signed in to. Of 32 original posts found, LinkedIn showed impression counts for 13 recent ones. The section shows the five highest-reach posts about AI, leaving out personal updates and a joke post:

| Post | Date | Impressions |
| --- | --- | --- |
| Bhashini and NITI Aayog, voice-first AI in 22 languages (`urn:li:activity:7496877288589008897`) | 22 Aug 2026 | 77,122 |
| Apple's "Illusion of Thinking" paper (`7339365119509815298`) | 13 Jun 2025 | 2,895 |
| OpenAI gpt-oss open-weight models (`7358597916464164866`) | 5 Aug 2025 | 1,106 |
| DeepSeek's plugin harness (`7499562609029939200`) | 29 Aug 2026 | 741 |
| Google I/O 2025 (`7330991638585958400`) | 21 May 2025 | 578 |

"Explore more writing" (a native `<details>` disclosure) adds eight further AI posts, newest first, chosen for substance rather than reach; four are older than LinkedIn's impression reporting, so these cards show a topic instead of a count: Jev decision engine (`7507134651652624384`, 19 Sep 2026), OpenAI Navier-Stokes controversy (`7503561984009916417`, 9 Sep 2026), LinkedIn 360brew (`7484681378987499520`, 19 Jul 2026), Google Veo (`7243533437389729792`, 22 Sep 2024), Sarvam AI (`7235790721759252480`, 31 Aug 2024), OpenAI Strawberry and Orion (`7234897887439069185`, 29 Aug 2024), the $1 Chevy prompt injection (`7233733067368988672`, 26 Aug 2024), and LangGraph Studio (`7226650100142338048`, 6 Aug 2024). Not included: personal and company-page posts, one-line posts, and a Cloudflare security post outside the AI theme.

Dates are decoded from the activity IDs. Titles and excerpts are condensed from each post's own text. Impression counts are a September 2026 snapshot and will drift; update them in `dist/index.html` when refreshing the section.

## Sharing and search

- `dist/assets/og-image.jpg` (1200 × 630): an original card rendered from HTML in the site's own style, using the self-hosted Manrope font and portrait.
- `index.html` head: Open Graph and Twitter card tags, a canonical URL, and a schema.org `Person` block (name, title, employer, alma mater, GitHub, LinkedIn).
- `dist/robots.txt` (excludes the archived `/depth/` routes), `dist/sitemap.xml`, and `dist/404.html`.

## Tab icon

`dist/assets/favicon.svg`, `dist/favicon.ico` (16, 32, 48px), and `dist/apple-touch-icon.png` (180px) show an orange italic “H” with a white full stop, echoing the “AI Engineer.” heading, on the site’s dark blue gradient. The letter is the outline of “H” from Gelasio Italic at weight 700 (SIL Open Font License, `docs/gelasio-OFL.txt`; https://github.com/google/fonts/tree/main/ofl/gelasio), a Georgia-compatible serif, converted to a path so the icon does not depend on installed fonts.
