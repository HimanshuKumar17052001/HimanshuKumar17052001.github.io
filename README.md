# Himanshu Kumar — Engineering Portfolio

A responsive static portfolio for AI engineering, agent workflows, cloud infrastructure, and developer tools. Built with semantic HTML, CSS, and native JavaScript modules; no installation or build step is required.

## Design

The current design follows the image and motion reference supplied by the user: a full-screen composition with Manrope typography, staggered oversized text, orange italic accents, blue atmospheric gradients, grain, a pointer-controlled glass lens, and a layered project carousel over amber, magenta, and teal light.

The reference’s visual direction is adapted to Himanshu’s actual engineering work. Gradients, grain, project illustrations, and motion are implemented in HTML/CSS/JavaScript. The supplied reference video and artwork are not shipped as page backgrounds. Fonts and the profile portrait are served locally.

The professional review adds an accurate AI Engineer title, visible résumé and work actions, earlier production evidence, AI-first project ordering, structured engineering notes, and small monochrome logos on every skill and technology tag. See [the four-perspective audit](docs/UX-AUDIT.md) and [the visual attention report](docs/audit/index.html).

## Development

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:8000. The preview is local; production publication is a separate step.

## Source layout

- `dist/index.html`: portfolio content, featured carousel, project cards, experience, skills, and contact.
- `dist/styles.css`: typography, layouts, atmospheric backgrounds, transitions, mobile layouts, and reduced-motion behavior.
- `dist/project-visuals.css`: original project illustrations and the workflow diagram.
- `dist/app.js`: carousel, filters, project dialogs, workflow demonstration, navigation, and motion controls.
- `dist/motion.js`: decorative glass lens that magnifies whichever section is under the pointer, from the hero to the footer.
- `dist/fonts.css` and `dist/assets/`: self-hosted Manrope, existing fonts for depth mode, profile portrait, favicon, and resume PDF.
- `dist/depth/`: existing depth and flat views.
- `dist/robots.txt`, `dist/sitemap.xml`, `dist/404.html`, `dist/assets/og-image.jpg`: search, link-preview, and not-found support.
- `docs/CONTENT-SOURCES.md`: content and design provenance.
- `docs/REDESIGN-QA.md`: browser and static verification.
- `docs/previews/`: desktop and mobile screenshots.

## Interactions and accessibility

- Browse featured projects using previous/next buttons, direct selectors, arrow keys, or horizontal touch swipes. Only the active card can receive focus. Slides do not advance automatically.
- Filter all six projects by AI/data or developer tools, and open their details in a native modal dialog.
- Read previews of the five most-read LinkedIn posts in the Writing section; each opens the original post.
- Expand experience entries and the optional interactive AI workflow.
- Use Ctrl+K or Command+K for searchable quick navigation.
- Copy the contact email, open an email application, or download the profile PDF.
- Pause background motion using the footer control. The operating system’s reduced-motion preference disables decorative animations and the pointer lens.
- Background movement pauses for sections outside the viewport and when the tab is hidden. The lens is disabled for touch input, and it steps aside over links, buttons, form controls, the header, and open dialogs. Each section is copied once for the lens and re-copied only after it changes; the lens moves with compositor-only transforms and follows the content under a still pointer while scrolling.

Scrolling remains native. The page provides a skip link, visible keyboard focus, semantic headings, native dialogs, descriptive controls, and mobile navigation. Core content and repository links are present in the HTML without JavaScript. Project visuals, sample data, and the workflow are illustrative rather than live telemetry.

## Editing

Edit profile text, experience, links, and project summaries in `dist/index.html`. Update matching project notes in the `projectNotes` and `engineeringNotes` objects in `dist/app.js`. Keep the featured carousel and project list consistent. Replace the PDF and portrait in `dist/assets/` when those change.

Theme tokens and typography are defined at the beginning of `dist/styles.css`. Manrope is licensed under the SIL Open Font License; see `docs/manrope-OFL.txt`.

## Current portfolio and archived experiments

The current portfolio at `/` is the reviewed experience. The earlier depth and flat routes remain in the repository but are no longer linked from the portfolio:

| View | Where | What it is |
| --- | --- | --- |
| **Classic** | `/` | The atmospheric, reference-inspired scrolling portfolio. |
| **Depth** | `/depth/` | A camera that travels forward along the Z axis, plane by plane. |
| **Flat** | `/depth/?view=flat` | Depth mode's content as one ordinary scrollable page. |

The archived depth page switches between its depth and flat views. Its preference is stored in `localStorage`; it does not select the main portfolio design.

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
