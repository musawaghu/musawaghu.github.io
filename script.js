// Portfolio interactions: pill ↔ folder hover sync, and the case-study dialog.
const archive = document.querySelector(".archive");
const dialog = document.getElementById("case-overlay");
const caseBody = dialog.querySelector(".case-body");
let lastTrigger = null;

// ---------- Pill hover/focus lifts the matching folder ----------
function setActive(slug) {
  archive.classList.toggle("is-open", Boolean(slug));
  archive.querySelectorAll(".project-folder").forEach((folder) => {
    folder.classList.toggle("is-active", folder.dataset.project === slug);
  });
}

document.querySelectorAll(".project-card").forEach((card) => {
  const slug = card.dataset.project;
  card.addEventListener("mouseenter", () => setActive(slug));
  // Only keyboard focus lifts the folder; mouse clicks and the focus restored after closing
  // the dialog with the mouse don't, so the folder isn't left raised when the pointer moves away.
  card.addEventListener("focus", () => {
    if (card.matches(":focus-visible")) setActive(slug);
  });
  card.addEventListener("mouseleave", () => setActive(null));
  card.addEventListener("blur", () => setActive(null));
});

// ---------- Case-study dialog ----------
// Small DOM helper; text always goes through textContent (never innerHTML).
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

// A section is a heading plus a paragraph (string) or a bullet list (array).
function section(heading, content) {
  const wrap = el("section", "case-section");
  wrap.append(el("h3", null, heading));
  if (Array.isArray(content)) {
    const list = el("ul");
    content.forEach((item) => list.append(el("li", null, item)));
    wrap.append(list);
  } else {
    wrap.append(el("p", null, content));
  }
  return wrap;
}

function mediaItem(item) {
  const figure = el("figure", "case-media");
  if (item.type === "video") {
    const video = el("video");
    video.src = item.src;
    video.poster = item.poster;
    video.controls = true;
    video.preload = "none";
    video.playsInline = true;
    figure.append(video);
  } else {
    // Clicking a screenshot opens the full-size file in a new tab.
    const link = el("a");
    link.href = item.src;
    link.target = "_blank";
    link.rel = "noopener";
    const img = el("img");
    img.src = item.src;
    img.alt = item.alt;
    img.loading = "lazy";
    link.append(img);
    figure.append(link);
  }
  const caption = item.caption || item.alt;
  if (caption) figure.append(el("figcaption", null, caption));
  return figure;
}

function renderCase(project) {
  const header = el("header", "case-header");
  header.append(
    el("span", "case-number", `PROJECT / ${project.number}`),
    el("h2", "case-title", project.title),
    el("p", "case-type", project.type)
  );
  header.querySelector(".case-title").id = "case-title";

  const parts = [header, section("What it is", project.overview), section("The problem", project.problem), section("How I solved it", project.solution), section("Results", project.results)];
  if (project.lessons) parts.push(section("Lessons learned", project.lessons));

  if (project.media.length) {
    const gallery = el("section", "case-section");
    gallery.append(el("h3", null, project.media.length > 1 ? "Screenshots" : "Demo"));
    const grid = el("div", "case-gallery");
    project.media.forEach((item) => grid.append(mediaItem(item)));
    gallery.append(grid);
    parts.push(gallery);
  }

  if (project.note) parts.push(el("p", "case-note", project.note));

  const links = el("div", "case-links");
  project.links.forEach(({ label, href }) => {
    const a = el("a", "case-link", `${label} ↗`);
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    links.append(a);
  });
  parts.push(links);

  caseBody.replaceChildren(...parts);
}

function openCase(slug, trigger) {
  const project = window.PROJECTS[slug];
  if (!project) return;
  lastTrigger = trigger;
  renderCase(project);
  dialog.showModal();
  dialog.querySelector(".case-inner").scrollTop = 0;
}

document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => openCase(button.dataset.project, button));
});

dialog.querySelector(".case-close").addEventListener("click", () => dialog.close());

// The dialog element itself has no padding (it lives on .case-inner),
// so a click whose target is the dialog can only be on the backdrop.
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

// Escape also fires "close". Clearing the body stops any playing video.
// "close" fires asynchronously, so skip it if another case study was opened in the meantime.
dialog.addEventListener("close", () => {
  if (dialog.open) return;
  caseBody.replaceChildren();
  if (lastTrigger) lastTrigger.focus();
});
