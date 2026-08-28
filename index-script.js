// script.js - Efecto de escritura y menú desplegable
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script cargado correctamente');

    // ===== EFECTO DE ESCRITURA PARA EL TÍTULO =====
    const titulo = document.getElementById('tituloNojavid');
    if (titulo) {
        console.log('Título encontrado');
        // Reiniciar la animación al cargar
        titulo.style.animation = 'none';
        titulo.offsetHeight; // reflow
        titulo.style.animation = 'escribir 2.5s steps(25) 1s forwards, parpadeo 0.8s step-end 3';
        
        // Al terminar la animación, mantener el borde transparente
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

    if (menuBtn && menuOverlay && menuSlide) {
        // Función para cerrar el menú
        function cerrarMenu() {
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Función para abrir el menú
        function abrirMenu() {
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Abrir menú
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            abrirMenu();
        });

        // Cerrar menú con el botón X
        menuClose.addEventListener('click', function(e) {
            e.stopPropagation();
            cerrarMenu();
        });

        // Cerrar menú al hacer clic en el overlay (cualquier parte fuera del menú)
        menuOverlay.addEventListener('click', function(e) {
            // Si el clic fue en el overlay (no en el menú), cerrar
            if (e.target === menuOverlay) {
                cerrarMenu();
            }
        });

        // Cerrar menú al hacer clic en cualquier elemento del menú
        const menuItems = menuSlide.querySelectorAll('.menu-item-full');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                cerrarMenu();
            });
        });

        // Cerrar menú con tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
                cerrarMenu();
            }
        });

        // Prevenir que los clics dentro del menú cierren el overlay
        menuSlide.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // ===== CERRAR MENÚ AL HACER CLIC EN CUALQUIER PARTE DE LA PÁGINA =====
        // Escuchar clics en todo el documento
        document.addEventListener('click', function(e) {
            // Si el menú está abierto
            if (menuOverlay.classList.contains('active')) {
                // Verificar si el clic fue dentro del menú o en el botón del menú
                const isClickInsideMenu = menuSlide.contains(e.target);
                const isClickOnMenuBtn = menuBtn.contains(e.target);
                const isClickOnCloseBtn = menuClose.contains(e.target);
                
                // Si el clic NO fue dentro del menú, NO fue en el botón del menú, 
                // y NO fue en el botón de cerrar, entonces cerrar el menú
                if (!isClickInsideMenu && !isClickOnMenuBtn && !isClickOnCloseBtn) {
                    cerrarMenu();
                }
            }
        });
    }
});