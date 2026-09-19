# Himanshu Kumar — Engineering Portfolio

A responsive, static portfolio focused on production AI, agent workflows, cloud infrastructure, and developer tools. The site uses semantic HTML, CSS, and native JavaScript modules, with no installation or build step.

## Design reference

The classic view follows [Prashant Tandel’s Developer Portfolio UI](https://dribbble.com/shots/27414961-Developer-Portfolio-UI-Where-Code-Meets-Conversion): a dark editor shell, profile sidebar, file tabs, line numbers, oversized typography, project title bars, and a section index. It adapts the reference to Himanshu’s engineering content using original HTML/CSS project illustrations.

## Source layout

- `dist/index.html`: profile content, experience, project cards, and semantic page structure.
- `dist/styles.css`: editor-inspired charcoal theme, light theme, fixed sidebars, file tabs, and responsive layouts.
- `dist/project-visuals.css`: local project illustrations and the interactive workflow diagram.
- `dist/app.js`: workflow demonstration, project notes, filters, grid/list controls, section tracking, line numbers, dialogs, quick navigation, and theme preference.
- `dist/fonts.css` and `dist/assets/`: self-hosted fonts, favicon, GitHub profile portrait, and the supplied profile PDF.
- `dist/depth/`: the depth-mode variation — `index.html`, `depth.css`, `depth.js`.
- `.openai/hosting.json`: Site identity and static hosting configuration.
- `docs/`: font licenses and content provenance.

## Development

Serve `dist/` with any static HTTP server. For example, from the project root:

```sh
python3 -m http.server 8000 --directory dist
```

There are no application API keys, package dependencies, or external runtime data requests. All portfolio content is served locally. Project and social links open their actual external destinations. Contact uses `mailto:` and the browser clipboard.

## Editing content

Update profile text, metrics, experience, project summaries, and links in `dist/index.html`. Update the corresponding project notes in the `projectNotes` object in `dist/app.js`. Both the visible card and the notes should remain grounded in the linked repository. Replace the PDF in `dist/assets/` when the profile changes.

Theme tokens are at the beginning of `dist/styles.css`. The desktop layout has a fixed profile sidebar, a scrollable document with decorative line numbers, and a section index. At tablet sizes the index collapses; at phone sizes, file tabs and an expandable navigation menu keep content and controls accessible. All text remains selectable and document scrolling stays native.

## Interactions

- Select a workflow node to inspect its role, or run the local step-by-step demonstration.
- Filter the six projects by AI/data or developer tools.
- Switch between grid and list layouts. On phones, list view shows compact project summaries.
- Navigate with file tabs or the section index; the active section and line position follow scrolling.
- Open project notes in a native modal dialog.
- Expand experience entries with native disclosure controls.
- Use Ctrl+K or Command+K for searchable quick navigation; use arrow keys and Enter to navigate.
- Switch between dark and light themes. Only the local theme preference is persisted.
- Copy the contact email or open an email application.

The system workflow, terminal records, table data, and signal graph are clearly labelled illustrative. They are not live infrastructure telemetry, LLM outputs, repository screenshots, or measured results.

## Accessibility and reliability

The site includes a skip link, visible focus indicators, native dialog focus management, keyboard navigation, semantic sections, touch controls, readable text, responsive layouts, a motion-pause control, and `prefers-reduced-motion` support. Core content and source links remain available without JavaScript. Animation does not gate navigation.

The redesign is checked in Chromium using agent-browser, including responsive layouts, filters, grid/list controls, project dialogs, mobile navigation, quick navigation search, theme switching, experience disclosures, email-copy feedback, and the workflow demonstration. Static checks cover duplicate IDs, fragment targets, local assets, and JavaScript syntax. See `docs/REDESIGN-QA.md` for the verification record.

## Three views

The same content is presented three ways, and a switcher in the top bar of every
view moves between them:

| View | Where | What it is |
| --- | --- | --- |
| **Classic** | `/` | The editor-inspired scrolling portfolio. |
| **Depth** | `/depth/` | A camera that travels forward along the Z axis, plane by plane. |
| **Flat** | `/depth/?view=flat` | Depth mode's content as one ordinary scrollable page. |

Classic links out with `?view=depth` and `?view=flat`; the depth page switches
between depth and flat in place and links back to classic. The last choice is kept
in `localStorage`, and an explicit `?view=` always wins over it.

## Depth mode

`dist/depth/` walks 22 planes grouped into 8 chapters: ingress, impact, pipeline,
stack, work, experience, about, and contact.

How it behaves:

- **It opens as a flat 2D page.** At rest the corridor, particle field, chapter rail
  and readout are almost invisible. They switch on across the first half-plane of
  travel, so the visitor starts on a still page and scrolls *into* the world.
- **Scrolling moves a camera.** Each plane has a scroll span; the first 45% parks the
  camera on it so the text sits still, crisp, and at natural size, and the rest flies
  to the next one. Text is never read mid-flight.
- **A critically damped spring carries the camera**, so a chunky mouse wheel arrives
  as one continuous glide. It has no overshoot, and the last fraction closes on an
  exponential so a plane truly lands at `z = 0` and renders unscaled.
- **Native scrolling is not hijacked.** A tall spacer supplies the page height and the
  camera reads `scrollY`, so inertia, the scrollbar, touch, and keyboard paging behave
  normally. `PgDn`/`PgUp` and the arrow keys skip a plane, `Home`/`End` jump to the ends.
- **Jumps are bounded.** The rail, the work index, and `#plane-…` links fly the camera
  in from at most 2.2 planes out, so a twenty-plane jump is not a twenty-plane flight.
  Tabbing into a plane brings the camera to it, so keyboard focus is never off-screen.
- **The background is a canvas**: a receding corridor, flying particles that streak
  with scroll speed, and a dot lattice that scatters and lights up around the pointer.
  It is decoration only; no content lives in it.

Progressive enhancement and fallback:

- The document is a plain, readable, stacked page by default. `depth.js` adds
  `.is-depth` to `<html>` and only then does the 3D stage exist. Without JavaScript,
  every plane, link, and paragraph is still there in order.
- Flat view is the default for visitors who ask for reduced motion.
- Blur, particle streaks, and most of the dot lattice are dropped on coarse-pointer and
  low-memory devices. Project visuals are hidden below 960px so copy keeps the plane.

Editing: add or reorder a `<section class="plane">` and the camera, rail, and readout
pick it up. `data-span` sets how much scroll a plane gets, `data-chapter` groups it in
the rail, and `data-depth` on a `.layer` sets that layer's own Z offset for parallax.
Only `.layer` elements may carry `data-depth`: they are the elements the camera fades,
and CSS flattens 3D inside anything that is faded, so a nested depth would be lost.

## Publishing

This checkout is connected to the Site's source repository. The saved source revision and static output are packaged together through Sites. The initial publication is owner-private.
