const HF_IMAGES = {
  heroYellow:
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80",
  heroGreen:
    "https://images.unsplash.com/photo-1616486338812-68d258c6383f?auto=format&fit=crop&w=900&q=80",
  heroPeach:
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80",
  catalog1:
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
  catalog2:
    "https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=800&q=80",
  catalog3:
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80",
  catalog4:
    "https://images.unsplash.com/photo-1555041469-a586c632e60b?auto=format&fit=crop&w=1200&q=80",
  catalog5:
    "https://images.unsplash.com/photo-1617103996702-96ff29b4c274?auto=format&fit=crop&w=1200&q=80",
  news:
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
  aboutSofa:
    "https://images.unsplash.com/photo-1555041469-a586c632e60b?auto=format&fit=crop&w=900&q=80",
  aboutLamp:
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80",
};

function hfTemplate() {
  return `
    <div class="hf__grid-bg" aria-hidden="true"></div>
    <div class="hf__shell">
      <div class="hf__topbar">
        <span>Категории</span>
        <span>Поиск</span>
        <span>Дизайнер</span>
      </div>

      <header class="hf__header">
        <nav class="hf__nav hf__nav--left">
          <a href="#">Контакты</a>
          <a href="#">Новости</a>
          <a href="#">О нас</a>
        </nav>
        <a class="hf__logo" href="#">HOMEFORT</a>
        <div class="hf__header-right">
          <nav class="hf__nav hf__nav--right">
            <a href="#">Акции</a>
            <a href="#">Аккаунт</a>
            <a href="#">Корзина</a>
          </nav>
          <button class="hf__theme" type="button" aria-label="Тёмная тема">☾</button>
        </div>
      </header>

      <section class="hf__hero" aria-label="Подборки">
        <div class="hf__hero-viewport">
          <div class="hf__hero-track">
            <article class="hf__hero-card hf__hero-card--yellow">
              <div class="hf__hero-card-media">
                <img src="${HF_IMAGES.heroYellow}" alt="" loading="lazy" />
              </div>
              <a class="hf__pill-btn" href="#">к каталогу</a>
            </article>
            <article class="hf__hero-card hf__hero-card--green hf__hero-card--active">
              <p class="hf__hero-script">mid-century</p>
              <div class="hf__hero-card-media hf__hero-card-media--center">
                <img src="${HF_IMAGES.heroGreen}" alt="" loading="lazy" />
              </div>
              <a class="hf__pill-btn" href="#">к каталогу</a>
            </article>
            <article class="hf__hero-card hf__hero-card--peach">
              <p class="hf__hero-tag">NORDIC</p>
              <div class="hf__hero-card-media">
                <img src="${HF_IMAGES.heroPeach}" alt="" loading="lazy" />
              </div>
              <a class="hf__pill-btn" href="#">к каталогу</a>
            </article>
          </div>
        </div>
        <div class="hf__hero-dots" role="tablist" aria-label="Слайды">
          <button type="button" class="hf__hero-dot" aria-label="Слайд 1"></button>
          <button type="button" class="hf__hero-dot is-active" aria-label="Слайд 2"></button>
          <button type="button" class="hf__hero-dot" aria-label="Слайд 3"></button>
        </div>
      </section>

      <a class="hf__promo" href="#">
        <span>не пропустите большие скидки на этой неделе — скидки до 40%</span>
        <span class="hf__promo-arrow" aria-hidden="true">↗</span>
      </a>

      <section class="hf__section">
        <div class="hf__section-head">
          <h2 class="hf__section-title">HOMEFORT <span>•</span> КАТАЛОГ</h2>
          <div class="hf__section-nav">
            <a href="#">Акции</a>
            <a href="#">Аккаунт</a>
            <a href="#">Корзина</a>
          </div>
        </div>
        <div class="hf__catalog">
          <article class="hf__cat-card">
            <span class="hf__badge">скидка 50%</span>
            <button class="hf__round-btn" type="button" aria-label="Подробнее">↗</button>
            <img src="${HF_IMAGES.catalog1}" alt="" loading="lazy" />
            <p class="hf__cat-caption">обустройтесь по максимуму</p>
          </article>
          <article class="hf__cat-card">
            <span class="hf__badge">скидка 50%</span>
            <button class="hf__round-btn" type="button" aria-label="Подробнее">↗</button>
            <img src="${HF_IMAGES.catalog2}" alt="" loading="lazy" />
            <p class="hf__cat-caption">обустройтесь по максимуму</p>
          </article>
          <article class="hf__cat-card">
            <span class="hf__badge">скидка 50%</span>
            <button class="hf__round-btn" type="button" aria-label="Подробнее">↗</button>
            <img src="${HF_IMAGES.catalog3}" alt="" loading="lazy" />
            <p class="hf__cat-caption">обустройтесь по максимуму</p>
          </article>
          <article class="hf__cat-card hf__cat-card--wide">
            <span class="hf__badge">скидка 50%</span>
            <button class="hf__round-btn" type="button" aria-label="Подробнее">↗</button>
            <img src="${HF_IMAGES.catalog4}" alt="" loading="lazy" />
            <p class="hf__cat-caption">обустройтесь по максимуму</p>
          </article>
          <article class="hf__cat-card hf__cat-card--wide">
            <span class="hf__badge">скидка 50%</span>
            <button class="hf__round-btn" type="button" aria-label="Подробнее">↗</button>
            <img src="${HF_IMAGES.catalog5}" alt="" loading="lazy" />
            <p class="hf__cat-caption">обустройтесь по максимуму</p>
          </article>
        </div>
      </section>

      <section class="hf__section">
        <div class="hf__section-head">
          <h2 class="hf__section-title">HOMEFORT <span>•</span> НОВОСТИ</h2>
        </div>
        <div class="hf__news">
          <figure class="hf__news-photo">
            <img src="${HF_IMAGES.news}" alt="" loading="lazy" />
            <figcaption>Новая мастерская Homefort открыла двери для клиентов</figcaption>
          </figure>
          <article class="hf__news-card">
            <p class="hf__news-logo">HOMEFORT <span>26</span></p>
            <p class="hf__news-text">
              Мы открыли новую мастерскую, где создаём мебель в духе mid-century и
              скандинавского минимализма. Приходите посмотреть материалы, подобрать
              отделку и собрать комплект под ваш интерьер.
            </p>
            <div class="hf__news-nav">
              <button type="button" class="hf__news-arrow" aria-label="Назад">←</button>
              <button type="button" class="hf__news-arrow" aria-label="Вперёд">→</button>
            </div>
          </article>
        </div>
      </section>

      <section class="hf__section hf__section--about">
        <div class="hf__section-head">
          <h2 class="hf__section-title">HOMEFORT <span>•</span> О НАС</h2>
        </div>
        <div class="hf__about">
          <div class="hf__about-copy">
            <p class="hf__about-logo">HOMEFORT</p>
            <p>
              Homefort — мебельный бренд с акцентом на форму, тактильность и
              спокойную палитру. Мы проектируем предметы, которые не перегружают
              пространство, а собирают его в цельную историю.
            </p>
            <p>
              В каталоге — диваны, стеллажи, свет и аксессуары. Каждая коллекция
              продумана так, чтобы её можно было комбинировать: от студии до
              просторной гостиной.
            </p>
            <p>
              Мы работаем с натуральными материалами, тёплыми оттенками и честной
              геометрией — без лишнего декора, но с характером.
            </p>
          </div>
          <div class="hf__about-visual">
            <img class="hf__about-lamp" src="${HF_IMAGES.aboutLamp}" alt="" loading="lazy" />
            <img class="hf__about-sofa" src="${HF_IMAGES.aboutSofa}" alt="" loading="lazy" />
          </div>
        </div>
      </section>

      <footer class="hf__footer">
        <div class="hf__social">
          <a href="#" aria-label="Instagram">Ig</a>
          <a href="#" aria-label="YouTube">Yt</a>
          <a href="#" aria-label="Telegram">Tg</a>
        </div>
        <p class="hf__copy">homefort © 2026</p>
        <p class="hf__address">Ростов-на-Дону, ул. Большая Садовая, 1</p>
      </footer>
    </div>
  `;
}

function bindHeroSlider(root) {
  const viewport = root.querySelector(".hf__hero-viewport");
  const track = root.querySelector(".hf__hero-track");
  const cards = [...root.querySelectorAll(".hf__hero-card")];
  const dots = [...root.querySelectorAll(".hf__hero-dot")];
  if (!viewport || !track || !cards.length) return;

  let activeIndex = 1;

  function scrollToCard(index, behavior = "smooth") {
    activeIndex = index;
    const card = cards[index];
    if (!card) return;

    const offset =
      card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2;

    viewport.scrollTo({ left: offset, behavior });

    cards.forEach((item, itemIndex) => {
      item.classList.toggle("hf__hero-card--active", itemIndex === index);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => scrollToCard(index));
  });

  viewport.addEventListener(
    "scroll",
    () => {
      const center = viewport.scrollLeft + viewport.clientWidth / 2;
      let nearest = 0;
      let nearestDistance = Infinity;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(center - cardCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = index;
        }
      });

      if (nearest !== activeIndex) {
        activeIndex = nearest;
        cards.forEach((item, itemIndex) => {
          item.classList.toggle("hf__hero-card--active", itemIndex === nearest);
        });
        dots.forEach((dot, dotIndex) => {
          dot.classList.toggle("is-active", dotIndex === nearest);
        });
      }
    },
    { passive: true }
  );

  requestAnimationFrame(() => scrollToCard(1, "auto"));
}

let homefortReady = false;

export function initHomefort(root) {
  if (!root || homefortReady) return;

  root.innerHTML = hfTemplate();
  bindHeroSlider(root);
  homefortReady = true;
}
