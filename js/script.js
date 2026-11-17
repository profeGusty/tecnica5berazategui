// =========================================================
//              MENÚ HAMBURGUESA (responsive)
// =========================================================
const initNav = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('nav ul');
    if (!burger || !nav) return;

    const setNav = (open) => {
        nav.classList.toggle('nav-active', open);
        burger.classList.toggle('toggle', open);
        burger.setAttribute('aria-expanded', String(open));
    };

    burger.addEventListener('click', () => {
        setNav(!nav.classList.contains('nav-active'));
    });

    // Cierra el menú al tocar un enlace (por ejemplo, las anclas internas)
    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setNav(false));
    });
};

// =========================================================
//              NAVBAR FIJA AL HACER SCROLL
// =========================================================
const stickyNav = () => {
    const nav = document.querySelector('.navbar-container');
    if (!nav) return;

    const onScroll = () => {
        nav.classList.toggle('sticky', window.scrollY > 50);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
};

// =========================================================
//              SLIDER DE IMÁGENES
// =========================================================
let slideIndex = 1;

const loadSlideImage = (slide) => {
    const img = slide && slide.querySelector('img');
    if (img && !img.hasAttribute('src') && img.dataset.src) {
        img.setAttribute('src', img.dataset.src);
    }
};

const showSlides = (n) => {
    const slides = document.getElementsByClassName('slide');
    if (!slides.length) return;

    slideIndex = n;
    if (slideIndex > slides.length) slideIndex = 1;
    if (slideIndex < 1) slideIndex = slides.length;

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }

    const current = slides[slideIndex - 1];
    current.style.display = 'block';

    // Carga diferida: solo la imagen actual + las 2 siguientes (precarga)
    loadSlideImage(current);
    loadSlideImage(slides[slideIndex % slides.length]);
    loadSlideImage(slides[(slideIndex + 1) % slides.length]);
};

const initSlider = () => {
    const prev = document.querySelector('.prev');
    const next = document.querySelector('.next');
    if (prev) prev.addEventListener('click', () => showSlides(slideIndex - 1));
    if (next) next.addEventListener('click', () => showSlides(slideIndex + 1));
    showSlides(slideIndex);
};

// =========================================================
//              AÑO DINÁMICO DEL COPYRIGHT
// =========================================================
const setYear = () => {
    const el = document.getElementById('anio');
    if (el) el.textContent = new Date().getFullYear();
};

// =========================================================
//              INICIALIZACIÓN
// =========================================================
initNav();
stickyNav();
initSlider();
setYear();
