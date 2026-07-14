document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initHeader();
  initMobileMenu();
  initScrollAnimations(reduceMotion);
  initFaqAccordion(reduceMotion);
  initContactForm();
  initSmoothScroll();
  initActiveNav();
  initWorksCarousel(reduceMotion);
  initLightbox();
});

function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let ticking = false;

  const update = () => {
    header.classList.toggle('header--scrolled', window.pageYOffset > 40);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if (!hamburger || !nav) return;

  let overlay = document.querySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  const navLinks = nav.querySelectorAll('.nav__link');

  const closeMenu = () => {
    nav.classList.remove('active');
    hamburger.classList.remove('active');
    overlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    nav.classList.add('active');
    hamburger.classList.add('active');
    overlay.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  hamburger.addEventListener('click', () => {
    if (nav.classList.contains('active')) closeMenu();
    else openMenu();
  });

  overlay.addEventListener('click', closeMenu);
  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });
}

function initScrollAnimations(reduceMotion) {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  if (reduceMotion) {
    elements.forEach((el) => el.classList.add('aos-animate'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const siblings = el.parentElement
          ? [...el.parentElement.querySelectorAll('[data-aos]')]
          : [el];
        const index = Math.max(0, siblings.indexOf(el));
        const delay = Number(el.dataset.aosDelay) || index * 90;

        el.style.transitionDelay = `${delay}ms`;
        el.classList.add('aos-animate');
        observer.unobserve(el);

        el.addEventListener('transitionend', () => {
          el.style.transitionDelay = '';
          el.style.willChange = 'auto';
        }, { once: true });
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

function initFaqAccordion(reduceMotion) {
  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  const closeItem = (item) => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    if (!answer) return;

    item.classList.remove('is-open');
    if (question) question.setAttribute('aria-expanded', 'false');

    if (reduceMotion) {
      answer.style.height = '0px';
      return;
    }

    answer.style.height = `${answer.scrollHeight}px`;
    requestAnimationFrame(() => {
      answer.style.height = '0px';
    });
  };

  const openItem = (item) => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    if (!answer) return;

    item.classList.add('is-open');
    if (question) question.setAttribute('aria-expanded', 'true');

    if (reduceMotion) {
      answer.style.height = 'auto';
      return;
    }

    answer.style.height = '0px';
    requestAnimationFrame(() => {
      answer.style.height = `${answer.scrollHeight}px`;
    });
  };

  items.forEach((item) => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    if (!question || !answer) return;

    answer.style.height = '0px';
    item.classList.remove('is-open');
    question.setAttribute('aria-expanded', 'false');

    answer.addEventListener('transitionend', (e) => {
      if (e.propertyName !== 'height') return;
      if (item.classList.contains('is-open')) {
        answer.style.height = 'auto';
      }
    });

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      items.forEach((other) => {
        if (other !== item && other.classList.contains('is-open')) {
          closeItem(other);
        }
      });

      if (isOpen) closeItem(item);
      else openItem(item);
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const WHATSAPP_NUMBER = form.dataset.whatsapp || '5585989458022';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service');
    const serviceText = service.options[service.selectedIndex]?.text || '';
    const message = document.getElementById('message').value.trim();

    if (!name || !phone || !service.value) {
      form.reportValidity();
      return;
    }

    let text = `Olá, Solare Film! 👋\n\n`;
    text += `Gostaria de solicitar um orçamento.\n\n`;
    text += `*Nome:* ${name}\n`;
    text += `*Telefone:* ${phone}\n`;
    text += `*Serviço:* ${serviceText}\n`;

    if (message) {
      text += `*Mensagem:* ${message}\n`;
    }

    text += `\nAguardo o retorno. Obrigado(a)!`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    form.reset();
  });

  const phoneInput = document.getElementById('phone');
  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }

    e.target.value = value;
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      });
    },
    { threshold: 0.25, rootMargin: '-80px 0px -45% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

function initWorksCarousel(reduceMotion) {
  const root = document.querySelector('[data-carousel]');
  if (!root) return;

  const track = root.querySelector('.works-carousel__track');
  const slides = Array.from(root.querySelectorAll('.works-carousel__slide'));
  const prevBtn = root.querySelector('[data-carousel-prev]');
  const nextBtn = root.querySelector('[data-carousel-next]');
  const dotsWrap = root.querySelector('[data-carousel-dots]');
  if (!track || !slides.length || !prevBtn || !nextBtn || !dotsWrap) return;

  let index = 0;
  let timer = null;

  const getPerView = () => {
    const width = window.innerWidth;
    if (width <= 768) return 1;
    if (width <= 1100) return 2;
    return 3;
  };

  const maxIndex = () => Math.max(0, slides.length - getPerView());

  const renderDots = () => {
    const pages = maxIndex() + 1;
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pages; i += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'works-carousel__dot' + (i === index ? ' is-active' : '');
      dot.setAttribute('aria-label', `Ir para grupo ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  };

  const update = () => {
    const clamped = Math.min(index, maxIndex());
    index = clamped;
    track.style.transform = `translateX(-${(100 / getPerView()) * index}%)`;
    dotsWrap.querySelectorAll('.works-carousel__dot').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
    });
  };

  const goTo = (next) => {
    index = Math.max(0, Math.min(next, maxIndex()));
    update();
    restart();
  };

  const next = () => goTo(index >= maxIndex() ? 0 : index + 1);
  const prev = () => goTo(index <= 0 ? maxIndex() : index - 1);

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const restart = () => {
    stop();
    if (reduceMotion) return;
    timer = setInterval(next, 4200);
  };

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', restart);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', restart);

  let startX = 0;
  track.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].clientX;
    stop();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    } else {
      restart();
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    renderDots();
    update();
  });

  renderDots();
  update();
  restart();
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const imgEl = lightbox.querySelector('.lightbox__img');
  const captionEl = lightbox.querySelector('.lightbox__caption');
  const triggers = Array.from(
    document.querySelectorAll('.svc-card__media img, .works-carousel__slide img')
  );
  if (!imgEl || !captionEl || !triggers.length) return;

  let index = 0;

  const open = (i) => {
    index = (i + triggers.length) % triggers.length;
    const source = triggers[index];
    imgEl.src = source.currentSrc || source.src;
    imgEl.alt = source.alt || '';
    captionEl.textContent = source.alt || '';
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const next = () => open(index + 1);
  const prev = () => open(index - 1);

  triggers.forEach((img, i) => {
    img.classList.add('is-zoomable');
    img.setAttribute('role', 'button');
    img.setAttribute('tabindex', '0');
    img.setAttribute('aria-label', `Ampliar foto: ${img.alt || 'trabalho'}`);

    img.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      open(i);
    });

    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(i);
      }
    });
  });

  lightbox.querySelectorAll('[data-lightbox-close]').forEach((el) => {
    el.addEventListener('click', close);
  });

  lightbox.querySelector('[data-lightbox-next]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    next();
  });

  lightbox.querySelector('[data-lightbox-prev]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    prev();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });
}
