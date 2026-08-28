// script.js - Efecto de escritura, menú desplegable y navegación
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script cargado correctamente');

    // ===== EFECTO DE ESCRITURA PARA EL TÍTULO =====
    const titulo = document.getElementById('tituloNojavid');
    if (titulo) {
        console.log('Título encontrado');
        titulo.style.animation = 'none';
        titulo.offsetHeight;
        titulo.style.animation = 'escribir 2.5s steps(25) 1s forwards, parpadeo 0.8s step-end 3';
        
        titulo.addEventListener('animationend', function() {
            this.style.borderColor = 'transparent';
        }, { once: true });
    } else {
        console.error('No se encontró el título');
    }

    // ===== MENÚ QUE SE DESLIZA DESDE LA IZQUIERDA =====
    const menuBtn = document.getElementById('menuBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuSlide = document.getElementById('menuSlide');
    const menuClose = document.getElementById('menuClose');

    window.cerrarMenuYScroll = function(seccionId) {
        cerrarMenu();
        setTimeout(() => {
            scrollToSeccion(seccionId);
        }, 300);
    };

    if (menuBtn && menuOverlay && menuSlide) {
        function cerrarMenu() {
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        function abrirMenu() {
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            abrirMenu();
        });

        menuClose.addEventListener('click', function(e) {
            e.stopPropagation();
            cerrarMenu();
        });

        menuOverlay.addEventListener('click', function(e) {
            if (e.target === menuOverlay) {
                cerrarMenu();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
                cerrarMenu();
            }
        });

        menuSlide.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        document.addEventListener('click', function(e) {
            if (menuOverlay.classList.contains('active')) {
                const isClickInsideMenu = menuSlide.contains(e.target);
                const isClickOnMenuBtn = menuBtn.contains(e.target);
                const isClickOnCloseBtn = menuClose.contains(e.target);
                
                if (!isClickInsideMenu && !isClickOnMenuBtn && !isClickOnCloseBtn) {
                    cerrarMenu();
                }
            }
        });
    }

    // ===== FUNCIÓN PARA SCROLL SUAVE A SECCIONES =====
    window.scrollToSeccion = function(seccionId) {
        const elemento = document.getElementById(seccionId);
        if (elemento) {
            const headerOffset = 80;
            const elementPosition = elemento.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };
});