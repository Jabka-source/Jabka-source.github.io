import { WORKS } from "./works.js";

const worksSection = document.querySelector(".works");
const worksViewport = document.querySelector(".works__viewport");
const worksStage = document.querySelector(".works__stage");
const worksImage = document.querySelector(".works__frame img");
const worksTitle = document.querySelector(".works__title");
const worksCategory = document.querySelector(".works__category");
const progressBar = document.querySelector(".works__progress-bar");
const prevBtn = document.querySelector(".works__nav--prev");
const nextBtn = document.querySelector(".works__nav--next");
const worksFrame = document.querySelector(".works__frame");
const lightbox = document.querySelector(".lightbox");
const lightboxImg = document.querySelector(".lightbox__img");
const lightboxClose = document.querySelector(".lightbox__close");
const lightboxBackdrop = document.querySelector(".lightbox__backdrop");
const filtersList = document.querySelector(".works__filters-list");

const FILTER_ORDER = ["Плакат", "Иллюстрация", "Полиграфия", "Баннер", "Коллаж"];

const colorCache = new Map();
let filteredWorks = [...WORKS];
let activeFilter = "all";
let activeIndex = 0;
let isAnimating = false;
let isDragging = false;
let dragStartX = 0;
let dragMoved = false;

function assetPath(file) {
  return `assets/works/${encodeURIComponent(file)}`;
}

function wrapIndex(index) {
  if (!filteredWorks.length) return 0;
  return ((index % filteredWorks.length) + filteredWorks.length) % filteredWorks.length;
}

function getCategoryCounts() {
  const counts = new Map();

  WORKS.forEach((work) => {
    counts.set(work.category, (counts.get(work.category) || 0) + 1);
  });

  return counts;
}

function buildFilters() {
  const counts = getCategoryCounts();
  const categories = FILTER_ORDER.filter((category) => counts.has(category));

  filtersList.innerHTML = "";

  const allButton = document.createElement("button");
  allButton.type = "button";
  allButton.className = "works__filter is-active";
  allButton.dataset.filter = "all";
  allButton.setAttribute("role", "tab");
  allButton.setAttribute("aria-selected", "true");
  allButton.innerHTML = "Все";
  filtersList.appendChild(allButton);

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "works__filter";
    button.dataset.filter = category;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", "false");
    button.textContent = category;
    filtersList.appendChild(button);
  });

  filtersList.addEventListener("click", (event) => {
    const button = event.target.closest(".works__filter");
    if (!button) return;

    setFilter(button.dataset.filter);
  });
}

function setFilter(filter) {
  if (filter === activeFilter) return;

  activeFilter = filter;
  filteredWorks =
    filter === "all" ? [...WORKS] : WORKS.filter((work) => work.category === filter);

  filtersList.querySelectorAll(".works__filter").forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  activeIndex = 0;
  clearStageClasses();
  setStageContent(0);
  applySlideTheme(0);
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / delta + 2) * 60;
        break;
      default:
        h = ((r - g) / delta + 4) * 60;
    }
  }

  return { h, s: s * 100, l: l * 100 };
}

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function relativeLuminance(r, g, b) {
  const channels = [r, g, b].map((value) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function buildThemeFromAccent(hex) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);

  const bgLightness =
    l > 62
      ? Math.max(20, Math.min(l * 0.52, 42))
      : l > 35
        ? Math.max(16, l * 0.58)
        : Math.max(12, l * 0.72);

  const bgSaturation = Math.min(Math.max(s, 28), 88);
  const bg = hslToRgb(h, bgSaturation, bgLightness);
  const bgHex = rgbToHex(bg.r, bg.g, bg.b);
  const luminance = relativeLuminance(bg.r, bg.g, bg.b);
  const textColor = luminance > 0.42 ? "#121212" : "#ffffff";
  const muted =
    textColor === "#ffffff"
      ? "rgba(255, 255, 255, 0.68)"
      : "rgba(18, 18, 18, 0.62)";

  return {
    accent: hex,
    background: bgHex,
    text: textColor,
    muted,
  };
}

function extractDominantColorFromImage(image) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const size = 96;

  canvas.width = size;
  canvas.height = size;
  context.drawImage(image, 0, 0, size, size);

  const { data } = context.getImageData(0, 0, size, size);
  const hueBins = Array.from({ length: 36 }, () => ({
    weight: 0,
    r: 0,
    g: 0,
    b: 0,
  }));

  for (let index = 0; index < data.length; index += 4) {
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const alpha = data[index + 3];

    if (alpha < 120) continue;

    const { h, s, l } = rgbToHsl(r, g, b);

    if (s < 10) continue;
    if (l < 4 || l > 98) continue;

    let weight = 1;

    if (l >= 45 && l <= 88) {
      weight *= 1.8;
    } else if (l < 22) {
      weight *= 0.2;
    } else if (l > 88) {
      weight *= 0.35;
    }

    weight *= 0.6 + (s / 100) * 0.6;

    const bin = Math.min(35, Math.floor(h / 10));
    hueBins[bin].weight += weight;
    hueBins[bin].r += r * weight;
    hueBins[bin].g += g * weight;
    hueBins[bin].b += b * weight;
  }

  let bestIndex = 0;
  let bestWeight = 0;

  for (let index = 0; index < hueBins.length; index += 1) {
    const prev = hueBins[(index + 35) % 36];
    const next = hueBins[(index + 1) % 36];
    const mergedWeight =
      hueBins[index].weight + prev.weight * 0.35 + next.weight * 0.35;

    if (mergedWeight > bestWeight) {
      bestWeight = mergedWeight;
      bestIndex = index;
    }
  }

  const bestBin = hueBins[bestIndex];

  if (bestWeight === 0) {
    return "#ff316b";
  }

  return rgbToHex(
    Math.round(bestBin.r / bestBin.weight),
    Math.round(bestBin.g / bestBin.weight),
    Math.round(bestBin.b / bestBin.weight)
  );
}

function waitForImage(image) {
  if (image.complete && image.naturalWidth > 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    image.addEventListener("load", resolve, { once: true });
    image.addEventListener("error", resolve, { once: true });
  });
}

async function extractDominantColor(src) {
  if (colorCache.has(src)) {
    return colorCache.get(src);
  }

  const color = await new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      resolve(extractDominantColorFromImage(image));
    };
    image.onerror = () => resolve("#ff316b");
    image.src = src;
  });

  colorCache.set(src, color);
  return color;
}

function applyTheme(theme) {
  worksSection.style.setProperty("--works-bg", theme.background);
  worksSection.style.setProperty("--works-text", theme.text);
  worksSection.style.setProperty("--works-muted", theme.muted);
}

function waitForTransition(element) {
  return new Promise((resolve) => {
    const onEnd = (event) => {
      if (event.target !== element) return;
      element.removeEventListener("transitionend", onEnd);
      resolve();
    };

    element.addEventListener("transitionend", onEnd);
    window.setTimeout(resolve, 750);
  });
}

function setStageContent(index) {
  const work = filteredWorks[index];
  if (!work) return;

  const src = assetPath(work.file);

  worksImage.src = src;
  worksImage.alt = work.title;
  worksTitle.textContent = work.title;
  worksCategory.textContent = work.category;
  progressBar.style.width = `${((index + 1) / filteredWorks.length) * 100}%`;
}

async function applySlideTheme(index) {
  await waitForImage(worksImage);
  const accent = extractDominantColorFromImage(worksImage);
  const src = worksImage.currentSrc || worksImage.src;
  colorCache.set(src, accent);
  applyTheme(buildThemeFromAccent(accent));
}

function clearStageClasses() {
  worksStage.classList.remove(
    "is-exiting-left",
    "is-exiting-right",
    "is-entering-left",
    "is-entering-right"
  );
}

async function goToSlide(index, direction = 0, animate = true) {
  const nextIndex = wrapIndex(index);
  if (nextIndex === activeIndex && direction === 0) return;
  if (isAnimating) return;

  const resolvedDirection =
    direction !== 0
      ? direction
      : nextIndex === activeIndex
        ? 0
        : nextIndex === wrapIndex(activeIndex + 1)
          ? 1
          : nextIndex === wrapIndex(activeIndex - 1)
            ? -1
            : 1;

  if (!animate) {
    clearStageClasses();
    activeIndex = nextIndex;
    setStageContent(activeIndex);
    await applySlideTheme(activeIndex);
    return;
  }

  isAnimating = true;

  clearStageClasses();
  worksStage.classList.add(
    resolvedDirection > 0 ? "is-exiting-left" : "is-exiting-right"
  );

  await waitForTransition(worksStage);

  activeIndex = nextIndex;
  setStageContent(activeIndex);

  clearStageClasses();
  worksStage.classList.add(
    resolvedDirection > 0 ? "is-entering-right" : "is-entering-left"
  );

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      clearStageClasses();
    });
  });

  await applySlideTheme(activeIndex);
  isAnimating = false;
}

function stepSlide(direction) {
  goToSlide(activeIndex + direction, direction);
}

function bindLightbox() {
  const openLightbox = () => {
    const src = worksImage.currentSrc || worksImage.src;
    if (!src || src.endsWith("#") || src.endsWith("/")) return;

    lightboxImg.src = src;
    lightboxImg.alt = worksImage.alt;
    lightbox.removeAttribute("hidden");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  };

  const closeLightbox = () => {
    lightbox.setAttribute("hidden", "");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
  };

  worksFrame.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
  });

  worksFrame.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openLightbox();
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxBackdrop.addEventListener("click", closeLightbox);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hasAttribute("hidden")) {
      closeLightbox();
    }
  });
}

function bindSliderControls() {
  prevBtn.addEventListener("click", () => stepSlide(-1));
  nextBtn.addEventListener("click", () => stepSlide(1));

  window.addEventListener("keydown", (event) => {
    if (!isWorksInView()) return;

    if (event.key === "ArrowLeft") stepSlide(-1);
    if (event.key === "ArrowRight") stepSlide(1);
  });

  worksViewport.addEventListener(
    "wheel",
    (event) => {
      if (!isWorksInView() || isAnimating) return;

      const dominantDelta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;

      if (Math.abs(dominantDelta) < 8) return;

      event.preventDefault();
      stepSlide(dominantDelta > 0 ? 1 : -1);
    },
    { passive: false }
  );

  worksViewport.addEventListener("pointerdown", (event) => {
    if (isAnimating || event.target.closest(".works__frame")) return;

    isDragging = true;
    dragMoved = false;
    dragStartX = event.clientX;
    worksViewport.setPointerCapture(event.pointerId);
    document.body.classList.add("is-dragging");
  });

  worksViewport.addEventListener("pointermove", (event) => {
    if (!isDragging || isAnimating) return;

    const delta = event.clientX - dragStartX;
    if (Math.abs(delta) > 8) dragMoved = true;
    const clamped = Math.max(-80, Math.min(80, delta));

    worksStage.style.transition = "none";
    worksStage.style.transform = `translateX(${clamped}px)`;
    worksStage.style.opacity = `${1 - Math.abs(clamped) / 160}`;
  });

  worksViewport.addEventListener("pointerup", (event) => {
    if (!isDragging) return;

    isDragging = false;
    document.body.classList.remove("is-dragging");

    worksStage.style.transition = "";
    worksStage.style.transform = "";
    worksStage.style.opacity = "";

    const delta = event.clientX - dragStartX;
    const threshold = 56;

    if (delta < -threshold) stepSlide(1);
    else if (delta > threshold) stepSlide(-1);
  });

  worksViewport.addEventListener("pointercancel", () => {
    isDragging = false;
    document.body.classList.remove("is-dragging");
    worksStage.style.transition = "";
    worksStage.style.transform = "";
    worksStage.style.opacity = "";
  });
}

function isWorksInView() {
  const rect = worksSection.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25;
}

function bindRevealAnimations() {
  const items = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 0.06, 0.36)}s`;
    observer.observe(item);
  });
}

function bindHeaderTheme() {
  const observer = new IntersectionObserver(
    ([entry]) => {
      document.body.classList.toggle("works-active", entry.isIntersecting);
    },
    { threshold: 0.35 }
  );

  observer.observe(worksSection);
}

function bindCursorGlow() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  });
}

function bindAnchorScroll() {
  const headerHeight =
    parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) || 72;

  document.querySelectorAll('a[href="#works"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = document.getElementById("works");
      if (!target) return;

      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

async function init() {
  buildFilters();
  bindSliderControls();
  bindLightbox();
  bindRevealAnimations();
  bindHeaderTheme();
  bindCursorGlow();
  bindAnchorScroll();

  setStageContent(activeIndex);
  await applySlideTheme(activeIndex);

  WORKS.forEach((work) => {
    extractDominantColor(assetPath(work.file));
  });
}

init();
