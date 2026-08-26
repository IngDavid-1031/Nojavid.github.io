// script.js
document.addEventListener('DOMContentLoaded',function() {
    // Obtener elementos del DOM
    const menuToggle = document.getElementById('menuToggle');
    const navPrincipal = document.getElementById('navPrincipal');

    //Verificar que los elementos existan
    if (menuToggle && navPrincipal) {
        //Agrega evento de clic al boton hamburguesa
        menuToggle.addEventListener('click',function() {
            //Altenar la clase 'activo' en el nav
            navPrincipal.classList.toggle('activo');
    });

    //Al cerrar el menu al hacer clic en un enlace (opciona pero recomendado)
    document.querySelectorAll('.nav-lista a').forEach(enlace => {
        enlace.addEventListener ('click', function() {
            navPrincipal.classList.remove('activo');
        });
    });
    }
});