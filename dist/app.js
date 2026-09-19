const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const email = 'himanshu.kumar0012@gmail.com';

// Local preferences never leave the visitor's browser.
const themeButtons = $$('.theme-toggle, .mobile-theme');
function syncThemeButton() {
  const dark = document.documentElement.dataset.theme !== 'light';
  themeButtons.forEach(button => button.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`));
  $('meta[name="theme-color"]').content = dark ? '#1e1e1e' : '#f6f5f0';
}
themeButtons.forEach(button => button.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('hk-theme', theme); } catch { /* Private browsing may disable storage. */ }
  syncThemeButton();
}));
syncThemeButton();

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
window.matchMedia('(min-width: 701px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

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
  document.body.classList.toggle('motion-paused', motionPaused);
  motionButton.setAttribute('aria-pressed', String(motionPaused));
  motionButton.setAttribute('aria-label', `${motionPaused ? 'Resume' : 'Pause'} diagram animation`);
  motionButton.setAttribute('title', `${motionPaused ? 'Resume' : 'Pause'} animation`);
  motionButton.firstElementChild.textContent = motionPaused ? '▷' : 'Ⅱ';
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
  terminalhistory: {
    title: 'TerminalHistory', category: 'DEVELOPER TOOLS / SWIFT',
    description: 'A native macOS menu bar app and CLI that captures terminal sessions automatically and replays them with a fresh shell in the original working directory.',
    details: ['Captures sessions through a login-shell wrapper across terminal applications, IDEs, Docker, and SSH.', 'Provides a day-grouped menu bar dropdown and a dedicated search window.', 'Stores sessions locally in SQLite, with no third-party package dependencies.'],
    tags: ['Swift', 'macOS', 'SQLite', 'CLI'], repo: 'terminalhistory',
  },
  csvchat: {
    title: 'CSVChat', category: 'AI & DATA / CONVERSATIONAL RETRIEVAL',
    description: 'A conversational retrieval system that turns CSV data into searchable knowledge, so people can ask questions in natural language.',
    details: ['Loads CSV data, splits it into chunks, and generates sentence-transformer embeddings.', 'Stores embeddings in FAISS for similarity search.', 'Uses a LangChain conversational retrieval chain and a Groq language model for contextual Q&A.'],
    tags: ['Python', 'LangChain', 'FAISS', 'Groq', 'Embeddings'], repo: 'CSVChat-Intelligent-CSV-Data-Explorer',
  },
  academy: {
    title: 'System Design Academy', category: 'DEVELOPER TOOLS / SYSTEM DESIGN',
    description: 'A TypeScript and Next.js learning platform that takes developers from system-design foundations to distributed systems, operations, and interview preparation.',
    details: ['Organises the curriculum into eight phases, from foundations and low-level design to distributed systems and reliability.', 'Includes interactive simulations, multiple quiz formats, progress tracking, and an AI learning assistant.', 'Connects concepts to case studies such as messaging, ride matching, video streaming, and search autocomplete.'],
    tags: ['TypeScript', 'Next.js', 'System design'], repo: 'system-design-academy',
  },
  anomaly: {
    title: 'Real-time Anomaly Detection', category: 'AI & DATA / STREAMING ML',
    description: 'A dashboard for simulating a live data stream, detecting unusual observations, and inspecting the results as they arrive.',
    details: ['Uses River’s Predictive Anomaly Detection with a SNARIMAX time-series model.', 'Simulates concept drift and occasional anomalies, visualised with Dash and Plotly.', 'Includes start, stop, and reset controls, plus CSV export of detected anomalies.'],
    tags: ['Python', 'River', 'Dash', 'Plotly', 'SNARIMAX'], repo: 'real-time-anomaly-detection',
  },
  docparse: {
    title: 'Hierarchical Document Parsing & Agentic Traversal Engine', category: 'DOCUMENT INTELLIGENCE / INTERNAL PROJECT',
    description: 'An engine that turns a document into a navigable tree rather than a flat page dump, so an agent can move through structure instead of re-reading everything.',
    details: ['Parses documents into a hierarchy of pages, sections, and bounding boxes, using Claude Haiku 4.5 vision calls to infer section boundaries across varied layouts.', 'Generates a natural-language description for every node, so sections can be found by meaning rather than by coordinates.', 'Adds an agentic traversal engine with tree-navigation tools: parent, child, and sibling traversal, section-label search, and bounding-box filtering.', 'Caches tree state and re-queries only ambiguous nodes, cutting vision model API calls by more than 60%.'],
    tags: ['Python', 'Claude Haiku 4.5', 'Vision', 'Document intelligence', 'Agentic traversal'], repo: null,
    note: 'Internal work at OnFinance AI, so there is no public repository for this one.',
  },
  openagents: {
    title: 'Open Agents', category: 'OPEN SOURCE / CLOUD AGENTS',
    description: 'An open-source reference app for running background coding agents in the cloud. I forked it from vercel-labs/open-agents to explore the architecture and extend it.',
    details: ['Runs chat-driven coding agents with file, search, shell, and task tools over a cloned repository.', 'Keeps the agent separate from its sandbox: the isolated VM snapshots and resumes while the durable Vercel workflow streams and stays cancellable.', 'Handles branch management with optional commits, pushes, and pull requests, plus read-only session sharing.', 'My fork adds a hardened MongoDB connector to the Python agent: schema discovery, read-only queries with size and execution guards, rejected write operators, and a PII-redacting audit log.'],
    tags: ['TypeScript', 'Next.js', 'Vercel Workflows', 'Python', 'MongoDB'], repo: 'open-agents',
  },
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
  const list = document.createElement('ul');
  for (const detail of project.details) {
    const item = document.createElement('li');
    item.textContent = detail;
    list.append(item);
  }
  $('#dialog-details').replaceChildren(list);
  $('#dialog-tags').replaceChildren(...project.tags.map(tag => {
    const span = document.createElement('span');
    span.textContent = tag;
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

// Project layouts retain the same content, links, and filter state.
$$('.layout-button').forEach(button => button.addEventListener('click', () => {
  const list = button.dataset.layout === 'list';
  $('.project-grid').classList.toggle('is-list', list);
  $$('.layout-button').forEach(other => {
    const active = other === button;
    other.classList.toggle('active', active);
    other.setAttribute('aria-pressed', String(active));
  });
  updateScrollProgress();
}));

// Decorative line numbers follow the document height, including open disclosures.
const lineNumbers = $('.line-numbers');
let lineCount = 0;
function updateLineNumbers() {
  const count = Math.ceil($('.editor-content').offsetHeight / 25);
  if (count === lineCount) return;
  lineCount = count;
  lineNumbers.replaceChildren(...Array.from({ length: count }, (_, index) => {
    const line = document.createElement('span');
    line.textContent = index + 1;
    return line;
  }));
}
if ('ResizeObserver' in window) {
  new ResizeObserver(() => { updateLineNumbers(); updateScrollProgress(); }).observe($('.editor-content'));
}
updateLineNumbers();

const indexedSections = $$('main > section[id], #stack');
function updateNavigation() {
  const offset = 150;
  const atBottom = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  const current = atBottom ? 'contact' : indexedSections.filter(section => section.getBoundingClientRect().top <= offset).at(-1)?.id || 'home';
  $$('.desktop-nav a').forEach(link => {
    const active = link.hash === `#${current}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  const tab = current === 'work' ? 'work' : current === 'contact' ? 'contact' : 'home';
  $$('.file-tabs a').forEach(link => {
    const active = link.hash === `#${tab}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
let progressPending = false;
function updateScrollProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progress = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
  $('.scroll-progress').style.transform = `scaleX(${progress})`;
  $('#read-position').textContent = `Ln ${Math.floor(window.scrollY / 25) + 1}, Col 1`;
  updateNavigation();
  progressPending = false;
}
window.addEventListener('scroll', () => {
  if (!progressPending) { requestAnimationFrame(updateScrollProgress); progressPending = true; }
}, { passive: true });
window.addEventListener('resize', updateScrollProgress, { passive: true });
updateScrollProgress();
const localTime = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false });
function updateTime() { $('#local-time').textContent = `${localTime.format(new Date())} IST`; }
$('#year').textContent = new Date().getFullYear();
updateTime();
setInterval(updateTime, 60000);
