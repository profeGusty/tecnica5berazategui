const firebaseConfig = {
    apiKey: "AIzaSyDRYgVY1lDX9IKVdYitVAX_vtSJIoeCcK0",
    authDomain: "noticiaswebproject.firebaseapp.com",
    projectId: "noticiaswebproject",
    storageBucket: "noticiaswebproject.appspot.com", 
    messagingSenderId: "799349890",
    appId: "1:799349890:web:89c7be345a70a923de289b"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const noticiasRef = db.collection('noticias');


// =========================================================
//              LÓGICA DE CREACIÓN (crear.html)
// =========================================================
const formulario = document.getElementById('formulario-noticia');
const mensajeEstado = document.getElementById('mensaje-estado');

if (formulario) {
    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();

        const titulo = document.getElementById('titulo').value;
        const subtitulo = document.getElementById('subtitulo').value;
        const desarrollo = document.getElementById('desarrollo').value;
        const imagenUrl = document.getElementById('imagenUrl').value;
        const linkNoticia = document.getElementById('linkNoticia').value;

        try {
            const nuevaNoticia = {
                titulo: titulo,
                subtitulo: subtitulo,
                desarrollo: desarrollo,
                imagenUrl: imagenUrl,
                link: linkNoticia || null,
                fechaCreacion: firebase.firestore.FieldValue.serverTimestamp()
            };

            await noticiasRef.add(nuevaNoticia);

            mensajeEstado.textContent = '✅ Noticia creada y guardada exitosamente!';
            formulario.reset();
        } catch (error) {
            console.error("Error al guardar la noticia: ", error);
            mensajeEstado.textContent = '❌ Error al guardar la noticia. Revisa la consola.';
        }
    });
}


// =========================================================
//              LÓGICA DE INICIO (index.html)
// =========================================================
const noticiasContainer = document.getElementById('noticias-container');
const cargandoMensaje = document.getElementById('cargando-mensaje');

if (noticiasContainer && cargandoMensaje) { 
    
    const cargarUltimasNoticias = async () => {
        try {
            const snapshot = await noticiasRef
                .orderBy('fechaCreacion', 'desc')
                .limit(4)
                .get();

            noticiasContainer.innerHTML = '<h2>Últimas Noticias</h2>';
            
            const gridContainer = document.createElement('div');
            gridContainer.id = 'grid-noticias'; 
            noticiasContainer.appendChild(gridContainer);
            
            if (snapshot.empty) {
                noticiasContainer.innerHTML += '<p>No hay noticias para mostrar.</p>';
                return;
            }

            let contador = 0; 
            snapshot.forEach(doc => {
                const noticia = doc.data();
                
                const fecha = noticia.fechaCreacion ? 
                    noticia.fechaCreacion.toDate().toLocaleDateString('es-ES') : 
                    'Fecha desconocida';
                const clasePrincipal = (contador === 0) ? 'noticia-principal' : 'noticia-secundaria'; 
                const leerMasHTML = `<a href="archivo.html" class="link-leer-mas">🔎 Noticia Completa</a>`;
                const linkAdicionalHTML = noticia.link ?
                    `<a href="${noticia.link}" target="_blank" class="boton-adicional-card">🔗 Link</a>` :
                    '';

                const noticiaHTML = `
                    <div class="noticia-card ${clasePrincipal}">
                        <img src="${noticia.imagenUrl}" alt="${noticia.titulo}"
                        onerror="this.onerror=null; this.src='./LOGO2.webp';">
                        <div class="card-content">
                            <h3>${noticia.titulo}</h3>
                            <h4>${noticia.subtitulo}</h4>
                            <p><strong>Publicado el:</strong> ${fecha}</p>
                            <p>${noticia.desarrollo.substring(0, 100)}...</p>

                            <div class="card-actions">
                                ${leerMasHTML}
                                ${linkAdicionalHTML} 
                            </div>
                        </div>
                    </div>
                `;
                gridContainer.innerHTML += noticiaHTML;
                contador++;
            });

        } catch (error) {
            console.error("Error al cargar las noticias: ", error);
            noticiasContainer.innerHTML += '<p>❌ Hubo un error al cargar las noticias.</p>';
        }
    };

    cargarUltimasNoticias();
}


// =========================================================
//              LÓGICA DE ARCHIVO (archivo.html)
// =========================================================
const archivoContainer = document.getElementById('archivo-container');
const cargandoArchivo = document.getElementById('cargando-archivo');

if (archivoContainer && cargandoArchivo) {

    // Función para cargar TODAS las noticias
    const cargarTodasLasNoticias = async () => {
        try {
            const snapshot = await noticiasRef
                .orderBy('fechaCreacion', 'desc')
                // SIN LÍMITE DE REGISTROS
                .get();

            // Esto es importante para limpiar el mensaje de "Cargando"
            archivoContainer.innerHTML = '<h2>Todas las Noticias</h2>';
            
            // Crear contenedor simple de lista para el Archivo
            const listaContainer = document.createElement('div');
            listaContainer.id = 'lista-noticias'; 
            archivoContainer.appendChild(listaContainer);
            
            if (snapshot.empty) {
                archivoContainer.innerHTML += '<p>No hay noticias para mostrar en el archivo.</p>';
                return;
            }

            snapshot.forEach(doc => {
                const noticia = doc.data();
                
                const fecha = noticia.fechaCreacion ? 
                    noticia.fechaCreacion.toDate().toLocaleDateString('es-ES') : 
                    'Fecha desconocida';

                // 1. CAMBIO CLAVE: Desarrollo Completo (NO se usa .substring())
                const desarrolloCompleto = noticia.desarrollo;
                
                // 2. CAMBIO CLAVE: Botón de Link Adicional (Solo si existe el link)
                const linkAdicionalHTML = noticia.link ? 
                    `<a href="${noticia.link}" target="_blank" class="  l">🔗 Ir al Link</a>` : 
                    '';

                const noticiaHTML = `
                    <div class="noticia-card noticia-archivo">
                        <img src="${noticia.imagenUrl}" 
                             alt="${noticia.titulo}"
                             onerror="this.onerror=null; this.src='./LOGO2.webp';"> 
                        <div class="card-content">
                            <h3>${noticia.titulo}</h3>
                            <h4>${noticia.subtitulo}</h4>
                            <p><strong>Publicado el:</strong> ${fecha}</p>
                            <p class="desarrollo-completo">${desarrolloCompleto}</p> 
                            
                            ${linkAdicionalHTML}
                        </div>
                    </div>
                `;
                listaContainer.innerHTML += noticiaHTML;
            });

        } catch (error) {
            console.error("Error al cargar las noticias del archivo: ", error);
            archivoContainer.innerHTML += '<p>❌ Hubo un error al cargar las noticias del archivo.</p>';
        }
    };

    cargarTodasLasNoticias();
}
// Funcionalidad del Menú de Navegación Responsive
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('nav ul');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

// Funcionalidad del Sticky Navbar
const stickyNav = () => {
    const nav = document.querySelector('.navbar-container');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // El número 50 es la distancia de scroll para que se active
            nav.classList.add('sticky');
        } else {
            nav.classList.remove('sticky');
        }
    });
};

// Llama a las funciones para que se ejecuten al cargar la página
navSlide();
stickyNav();

// Funcionalidad del Slider de Imágenes
let slideIndex = 1;
showSlides(slideIndex);

// Controles Siguiente/Anterior
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Controles de puntos
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}


