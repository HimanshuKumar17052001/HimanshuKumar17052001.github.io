import { initLens } from './motion.js?v=20260920-review10';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const email = 'himanshu.kumar0012@gmail.com';

// Logos for tag labels: reuse icons already on the page, plus dialog-only ones from the template.
const tagIcons = new Map();
[...$$('.tags span'), ...$$('[data-tag]', $('#tag-icons').content)].forEach(span => {
  const icon = span.querySelector('.tool-icon');
  if (icon) tagIcons.set(span.dataset.tag || span.textContent.trim(), icon);
});

const menuButton = $('.mobile-menu-button');
const mobileNav = $('#mobile-nav');
function setMenu(open) {
  mobileNav.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', `${open ? 'Close' : 'Open'} navigation`);
}
menuButton.addEventListener('click', () => setMenu(mobileNav.hidden));
$$('a', mobileNav).forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) { setMenu(false); menuButton.focus(); }
});
window.matchMedia('(min-width: 681px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

// The diagram is an illustrative local animation; it makes no inference requests.
const nodes = {
  input: { label: '01 / REQUEST', description: 'A user request enters the workflow with its task, context, and available documents.' },
  agent: { label: '02 / ORCHESTRATION', description: 'LangGraph connects reasoning, tools, and context into configurable agent workflows.' },
  retrieval: { label: '03 / RETRIEVAL', description: 'Vector search brings relevant document context into the workflow. Qdrant stores and retrieves embeddings.' },
  tools: { label: '03 / TOOL EXECUTION', description: 'A dynamic tool registry gives the agent access to task-specific capabilities and connected files.' },
  inference: { label: '03 / INFERENCE', description: 'LiteLLM and AWS Bedrock provide model access for reasoning and generating responses.' },
  output: { label: '04 / RESPONSE', description: 'The workflow returns a structured result that an application or a person can use.' },
};
let demoRunning = false;
function selectNode(key, running = false) {
  if (!nodes[key]) return;
  $$('.system-node').forEach(node => {
    const selected = node.dataset.node === key;
    node.classList.toggle('active', selected);
    node.classList.toggle('running', selected && running);
    node.setAttribute('aria-pressed', String(selected));
  });
  $('#inspector-label').textContent = nodes[key].label;
  $('#inspector-description').textContent = nodes[key].description;
}
$$('.system-node').forEach(node => node.addEventListener('click', () => {
  if (!demoRunning) selectNode(node.dataset.node);
}));
const motionButton = $('#motion-toggle');
let motionPaused = reducedMotion.matches;
function syncMotion() {
  if (reducedMotion.matches) motionPaused = true;
  motionButton.disabled = reducedMotion.matches;
  document.body.classList.toggle('motion-paused', motionPaused);
  motionButton.setAttribute('aria-pressed', String(motionPaused));
  motionButton.setAttribute('aria-label', `${motionPaused ? 'Resume' : 'Pause'} animations`);
  motionButton.setAttribute('title', `${motionPaused ? 'Resume' : 'Pause'} animation`);
  motionButton.firstElementChild.textContent = motionPaused ? '▷' : 'Ⅱ';
  $('.motion-label').textContent = reducedMotion.matches ? 'Reduced motion' : motionPaused ? 'Resume motion' : 'Pause motion';
  if (reducedMotion.matches) motionButton.setAttribute('aria-label', 'Animations disabled by reduced-motion preference');
  document.dispatchEvent(new CustomEvent('portfolio:motion', { detail: { paused: motionPaused } }));
}
motionButton.addEventListener('click', () => { motionPaused = !motionPaused; syncMotion(); });
reducedMotion.addEventListener('change', event => { motionPaused = event.matches; syncMotion(); });
syncMotion();
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
$('#run-demo').addEventListener('click', async () => {
  if (demoRunning) return;
  demoRunning = true;
  const runButton = $('#run-demo');
  runButton.disabled = true;
  runButton.firstChild.textContent = 'Running demo ';
  $$('.system-node').forEach(node => { node.disabled = true; });
  const steps = ['input', 'agent', 'retrieval', 'tools', 'inference', 'output'];
  for (let i = 0; i < steps.length; i++) {
    selectNode(steps[i], true);
    $('#run-status').textContent = `Demo step ${i + 1} / ${steps.length}`;
    await delay(reducedMotion.matches ? 150 : 650);
  }
  $$('.system-node').forEach(node => { node.classList.remove('running'); node.disabled = false; });
  $('#inspector-label').textContent = '04 / DEMO COMPLETE';
  $('#inspector-description').textContent = 'Request → orchestration → retrieval, tools, and inference → structured response. That’s the path from an idea to a useful result.';
  $('#run-status').textContent = 'Demo complete · explore any node';
  runButton.firstChild.textContent = 'Run again ';
  runButton.disabled = false;
  demoRunning = false;
});

// Accessible project filters keep every repository available without a request.
$$('.filter').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  $$('.filter').forEach(other => {
    const active = other === button;
    other.classList.toggle('active', active);
    other.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  $$('.project-card').forEach(card => {
    const shown = filter === 'all' || card.dataset.category === filter;
    card.hidden = !shown;
    if (shown) { card.classList.add('visible'); count++; }
  });
  $('.filter-status').textContent = `Showing ${count} ${filter === 'all' ? '' : filter === 'ai' ? 'AI and data ' : 'developer tools '}projects.`;
}));

const projectNotes = {
  docparse: {
    title: 'Hierarchical Document Parsing & Agentic Traversal Engine', category: 'DOCUMENT INTELLIGENCE / INTERNAL PROJECT',
    description: 'An engine that turns a document into a navigable tree rather than a flat page dump, so an agent can move through structure instead of re-reading everything.',
    tags: ['Python', 'Claude Haiku 4.5', 'Vision', 'Document intelligence', 'Agentic traversal'], repo: null,
    note: 'Internal work at OnFinance AI, so there is no public repository for this one.',
  },
  refunddesk: {
    title: 'Refund Desk', category: 'AI AGENTS / PRODUCTION SYSTEMS',
    description: 'An AI agent that resolves customer refund requests against a real backend where it can move money, so everything that decides whether money moves is ordinary, deterministic software.',
    tags: ['Python', 'FastAPI', 'Kubernetes', 'Helm', 'LiteLLM', 'PostgreSQL', 'Redis', 'React', 'Playwright', 'Evals'], repo: 'refund-desk',
  },
  looplab: {
    title: 'loop-lab', category: 'AGENT ENGINEERING / OPEN SOURCE',
    description: 'A hand-written agentic loop for the Claude Messages API, written to be read rather than used as a framework, with a trace of every run and tests that exercise the control flow offline.',
    tags: ['Python', 'Claude API', 'Tool use', 'Prompt caching', 'pytest'], repo: 'loop-lab',
  },
  polymarketmcp: {
    title: 'Polymarket MCP Server', category: 'AI & DATA / MODEL CONTEXT PROTOCOL',
    description: 'A Model Context Protocol server and command-line agent for exploring Polymarket prediction markets and how their events could affect an investor’s portfolio.',
    tags: ['Python', 'MCP', 'LangGraph', 'Groq', 'Chroma', 'ARIMA'], repo: 'polygon-custom-mcp',
  },
  openagents: {
    title: 'Open Agents', category: 'OPEN SOURCE / CLOUD AGENTS',
    description: 'An open-source reference app for running background coding agents in the cloud. I forked it from vercel-labs/open-agents to explore the architecture and extend it.',
    tags: ['TypeScript', 'Next.js', 'Vercel Workflows', 'Python', 'MongoDB'], repo: 'open-agents',
  },
  anomaly: {
    title: 'Real-time Anomaly Detection', category: 'AI & DATA / STREAMING ML',
    description: 'A dashboard for simulating a live data stream, detecting unusual observations, and inspecting the results as they arrive.',
    tags: ['Python', 'River', 'Dash', 'Plotly', 'SNARIMAX'], repo: 'real-time-anomaly-detection',
  },
};

const engineeringNotes = {
  "docparse": [
    [
      "Problem",
      "Long documents contain useful structure that is lost when every page is treated as a flat block of text. Agents need to locate a section and return to its surrounding context."
    ],
    [
      "My implementation",
      "Built a hierarchy of pages, sections, and bounding boxes using Claude Haiku 4.5 vision. Each node receives a natural-language description; agents navigate with parent, child, sibling, section-search, and bounding-box tools."
    ],
    [
      "Engineering decision",
      "Cache the document tree and revisit ambiguous nodes selectively. This makes model calls targeted and preserves document relationships during traversal."
    ],
    [
      "Evidence & scope",
      "Internal work at OnFinance AI. My résumé reports a reduction of more than 60% in vision API calls; the benchmark and source code are not public. No public accuracy or latency evaluation is provided here."
    ]
  ],
  "refunddesk": [
    [
      "Problem",
      "An agent that can issue refunds must not be argued out of policy, retry its way into duplicate payments, or approve its own decisions."
    ],
    [
      "My implementation",
      "Five services on Kubernetes from one Helm chart: a React web app, a FastAPI orders, policy, and refunds API, JWT authentication, the agent, and a LiteLLM gateway that is the cluster’s only route to a model. The agent holds no provider key."
    ],
    [
      "Engineering decision",
      "The agent only proposes. Policy is a pure function that the API re-checks on every mutation, the agent’s token cannot approve refunds, and a UNIQUE constraint makes retries idempotent."
    ],
    [
      "Evidence & scope",
      "Benchmarked on the public Olist dataset: 98,666 orders and 5,022 refund complaints in Portuguese. On 20 real tickets: 80% accuracy, 5% false-refund rate, about $0.0125 and 11 seconds per ticket. Accuracy rose from 50% through harness and benchmark fixes, not model changes. Labels come from the policy engine applied to real facts, not human annotation. 32 backend tests and 12 Playwright end-to-end tests. Runs on a local Kubernetes cluster; it is not a deployed service."
    ]
  ],
  "looplab": [
    [
      "Problem",
      "Frameworks hide the control flow where agent bugs live: rebuilt assistant turns, split tool results, runaway loops, and context that is re-sent and paid for on every turn."
    ],
    [
      "My implementation",
      "Wrote the loop directly on the Claude Messages API with a sandboxed tool registry, guards for turn caps, token budgets, and repeated calls, and a JSONL trace of tokens, latency, and tool calls per turn."
    ],
    [
      "Engineering decision",
      "Guards live in the harness, not the prompt. Failed tool calls return to the model as data so it can recover. Two rolling cache breakpoints sit at the end of the conversation, and the loop warns when no cache read occurs."
    ],
    [
      "Evidence & scope",
      "46 offline tests drive the control flow through a scripted stand-in for the SDK. Refund Desk runs this engine unmodified. A reference harness for understanding agent loops, not a framework."
    ]
  ],
  "polymarketmcp": [
    [
      "Problem",
      "Prediction markets price real-world events, but finding the relevant markets, reading live prices, and reasoning about where probabilities may move takes several separate tools."
    ],
    [
      "My implementation",
      "A FastMCP server exposes four tools: market search over a Chroma index, concurrent order-book requests to the Polymarket CLOB API, price history, and ARIMA forecasts with automatic order selection. A LangGraph ReAct client on Groq loads the tools over MCP."
    ],
    [
      "Engineering decision",
      "Keep data access and forecasting behind typed MCP tools, so any MCP-compatible client can use them and the model reasons over tool results instead of calling APIs directly."
    ],
    [
      "Evidence & scope",
      "Public repository linked below. Forecasts are statistical projections from price history, not trading advice; no backtest or accuracy result is claimed."
    ]
  ],
  "openagents": [
    [
      "Starting point",
      "A fork of vercel-labs/open-agents, an open-source reference app for background coding agents. The upstream project provides the agent, sandbox, and durable workflow architecture."
    ],
    [
      "My contribution",
      "Added a MongoDB connector to the Python agent with schema discovery, read-only queries, result-size and execution guards, rejection of write operators, and a PII-redacting audit log."
    ],
    [
      "Engineering focus",
      "Constrain database tools before exposing them to an agent: limit what a query can do, how much it returns, and what is retained in logs."
    ],
    [
      "Evidence & scope",
      "The linked repository is my fork. The cloud agent platform and its original architecture belong to the upstream project; my contribution is the MongoDB extension."
    ]
  ],
  "anomaly": [
    [
      "Problem",
      "Inspect unusual observations as a time series changes, rather than waiting for a batch report."
    ],
    [
      "Implementation",
      "Combined River’s Predictive Anomaly Detection and a SNARIMAX model with a Dash and Plotly interface. The stream can simulate anomalies and concept drift."
    ],
    [
      "Interaction",
      "Start, stop, or reset the stream, inspect detected anomalies, and export results as CSV."
    ],
    [
      "Evidence & scope",
      "Public repository linked below. The stream is simulated; this project is not presented as a deployed fraud or incident detection system."
    ]
  ]
};

function openDialog(dialog) {
  dialog.showModal();
  document.body.classList.add('dialog-open');
}
$$('dialog').forEach(dialog => {
  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});
$$('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projectNotes[button.dataset.project];
  if (!project) return;
  $('#dialog-category').textContent = project.category;
  $('#dialog-title').textContent = project.title;
  $('#dialog-description').textContent = project.description;
  const notes = document.createElement('div');
  notes.className = 'case-study';
  for (const [label, text] of engineeringNotes[button.dataset.project]) {
    const heading = document.createElement('h3');
    heading.textContent = label;
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    notes.append(heading, paragraph);
  }
  $('#dialog-details').replaceChildren(notes);
  $('#dialog-tags').replaceChildren(...project.tags.map(tag => {
    const span = document.createElement('span');
    span.textContent = tag;
    const icon = tagIcons.get(tag);
    if (icon) span.prepend(icon.cloneNode(true));
    return span;
  }));
  const note = $('#dialog-note');
  note.textContent = project.note || '';
  note.hidden = !project.note;
  $('.dialog-actions').hidden = !project.repo;
  if (project.repo) $('#dialog-source').href = `https://github.com/HimanshuKumar17052001/${project.repo}`;
  openDialog($('#project-dialog'));
}));

// A small native-dialog command menu supports keyboard and touch navigation.
const commandDialog = $('#command-dialog');
const commandSearch = $('#command-search');
const commandLinks = $$('[data-command]');
let commandIndex = 0;
function visibleCommands() { return commandLinks.filter(link => !link.hidden); }
function highlightCommand(index, scroll = false) {
  const visible = visibleCommands();
  commandIndex = visible.length ? (index + visible.length) % visible.length : 0;
  commandLinks.forEach(link => link.classList.remove('keyboard-selected'));
  const selected = visible[commandIndex];
  if (selected) {
    selected.classList.add('keyboard-selected');
    if (scroll) selected.scrollIntoView({ block: 'nearest' });
  }
}
function openCommands() {
  if ($('#project-dialog').open) return;
  commandSearch.value = '';
  commandLinks.forEach(link => { link.hidden = false; });
  $('#command-empty').hidden = true;
  highlightCommand(0);
  openDialog(commandDialog);
  commandSearch.focus();
}
$$('.command-trigger, .mobile-command').forEach(button => button.addEventListener('click', () => { setMenu(false); openCommands(); }));
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (commandDialog.open) commandDialog.close(); else openCommands();
  }
});
commandSearch.addEventListener('input', () => {
  const query = commandSearch.value.trim().toLowerCase();
  commandLinks.forEach(link => { link.hidden = !(link.dataset.command + ' ' + link.textContent.toLowerCase()).includes(query); });
  $('#command-empty').hidden = visibleCommands().length > 0;
  highlightCommand(0);
});
commandSearch.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    highlightCommand(commandIndex + (event.key === 'ArrowDown' ? 1 : -1), true);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    visibleCommands()[commandIndex]?.click();
  }
});
commandLinks.forEach(link => link.addEventListener('click', () => {
  commandDialog.close();
  const hash = link.getAttribute('href');
  if (hash.startsWith('#')) {
    const target = $(hash);
    if (target) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
  }
}));

let toastTimeout;
function showToast(message) {
  const toast = $('#toast');
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 3500);
}
$('.copy-email').addEventListener('click', async () => {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(email);
    showToast('Email address copied. Let’s talk.');
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents($('.contact-email'));
    selection?.removeAllRanges();
    selection?.addRange(range);
    showToast('Select and copy the email address, or click it to open your email app.');
  }
});

// Native scrolling, with the current section reflected in the top navigation.
const navSections = ['work', 'experience', 'about', 'writing', 'contact'].map(id => document.getElementById(id));
let progressPending = false;
function updateScrollProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progress = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
  $('.scroll-progress').style.transform = `scaleX(${progress})`;
  $('.site-header').classList.toggle('scrolled', window.scrollY > 70);
  const current = progress >= .999 && window.scrollY > 0 ? 'contact' : navSections.filter(section => section.getBoundingClientRect().top < 180).at(-1)?.id;
  $$('.desktop-nav a').forEach(link => {
    const active = link.hash === `#${current}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  progressPending = false;
}
window.addEventListener('scroll', () => {
  if (!progressPending) { requestAnimationFrame(updateScrollProgress); progressPending = true; }
}, { passive: true });
window.addEventListener('resize', updateScrollProgress, { passive: true });
new ResizeObserver(updateScrollProgress).observe($('main'));
updateScrollProgress();

// The featured deck responds to buttons, arrow keys, and horizontal touch swipes.
const carousel = $('.project-carousel');
const slides = $$('.showcase-card');
const slideButtons = $$('[data-slide-to]');
let currentSlide = 0;
function selectSlide(index, announce = true) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    const position = (i - currentSlide + slides.length) % slides.length;
    slide.dataset.position = position;
    slide.inert = position !== 0;
    slide.setAttribute('aria-hidden', String(position !== 0));
  });
  slideButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === currentSlide)));
  if (announce) $('.carousel-status').textContent = slides[currentSlide].getAttribute('aria-label');
}
slideButtons.forEach(button => button.addEventListener('click', () => selectSlide(Number(button.dataset.slideTo))));
$$('[data-direction]').forEach(button => button.addEventListener('click', () => selectSlide(currentSlide + Number(button.dataset.direction))));
carousel.addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  const focusWasInSlide = slides.some(slide => slide.contains(document.activeElement));
  selectSlide(currentSlide + (event.key === 'ArrowRight' ? 1 : -1));
  if (focusWasInSlide) $('[data-project]', slides[currentSlide]).focus({ preventScroll: true });
});
let swipeStart;
const deck = $('.project-deck');
deck.addEventListener('pointerdown', event => {
  if (event.pointerType === 'touch') swipeStart = { x: event.clientX, y: event.clientY };
});
deck.addEventListener('pointerup', event => {
  if (!swipeStart) return;
  const dx = event.clientX - swipeStart.x;
  const dy = event.clientY - swipeStart.y;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) selectSlide(currentSlide + (dx < 0 ? 1 : -1));
  swipeStart = null;
});
deck.addEventListener('pointercancel', () => { swipeStart = null; });
selectSlide(0, false);

// Content remains readable if motion is disabled or JavaScript is unavailable.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .08 });
  if (!reducedMotion.matches) document.documentElement.classList.add('js-motion');
  $$('.project-card, .about-copy, .stack-group, .section-heading, .writing-card, .honour-line').forEach(element => {
    element.classList.add('reveal');
    observer.observe(element);
  });
}
document.addEventListener('visibilitychange', () => document.body.classList.toggle('page-hidden', document.hidden));
const localTime = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false });
function updateTime() { $('#local-time').textContent = `${localTime.format(new Date())} IST`; }
$('#year').textContent = new Date().getFullYear();
updateTime();
setInterval(updateTime, 60000);

initLens([...$('#main').children, $('.site-footer')].filter(element => element.matches('section, [role="region"], footer')));

// Suspend background movement while its section is outside the viewport.
if ('IntersectionObserver' in window) {
  const atmosphereObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('ambient-offscreen', !entry.isIntersecting));
  });
  $$('.hero, .showcase, .contact-section').forEach(section => atmosphereObserver.observe(section));
}
