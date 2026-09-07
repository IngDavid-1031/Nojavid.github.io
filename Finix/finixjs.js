// ============================================
// 1. FECHA ACTUAL
// ============================================
function actualizarFecha() {
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const ahora = new Date();
    const mes = meses[ahora.getMonth()];
    const año = ahora.getFullYear();
    const fechaElement = document.getElementById('fechaActual');
    if (fechaElement) {
        fechaElement.textContent = mes + " de " + año;
    }
}
actualizarFecha();

// ============================================
// 2. MENÚ HAMBURGUESA
// ============================================
const menuBtn = document.getElementById('menuHamburguesa');
const menuOverlay = document.getElementById('menuOverlay');
const menuClose = document.getElementById('menuClose');

function abrirMenu() {
    if (menuOverlay) menuOverlay.classList.add('active');
}

function cerrarMenu() {
    if (menuOverlay) menuOverlay.classList.remove('active');
}

if (menuBtn) {
    menuBtn.addEventListener('click', abrirMenu);
}

if (menuClose) {
    menuClose.addEventListener('click', cerrarMenu);
}

if (menuOverlay) {
    menuOverlay.addEventListener('click', function(e) {
        if (e.target === this) cerrarMenu();
    });
}

// ============================================
// 3. AUDIO POPUP (INGRESO/GASTO)
// ============================================
const seccionAudio = document.getElementById('seccionAudio');
const audioPopup = document.getElementById('audioPopup');
const audioClose = document.getElementById('audioPopupClose');

function abrirAudioPopup(e) {
    if (e) e.stopPropagation();
    if (audioPopup) audioPopup.classList.add('active');
}

function cerrarAudioPopup() {
    if (audioPopup) audioPopup.classList.remove('active');
}

if (seccionAudio) {
    seccionAudio.addEventListener('click', abrirAudioPopup);
}

if (audioClose) {
    audioClose.addEventListener('click', cerrarAudioPopup);
}

if (audioPopup) {
    audioPopup.addEventListener('click', function(e) {
        if (e.target === this) cerrarAudioPopup();
    });
}

// ============================================
// 4. CÁMARA → camara.html
// ============================================
const seccionCamara = document.getElementById('seccionCamara');
if (seccionCamara) {
    seccionCamara.addEventListener('click', function() {
        window.location.href = 'camara.html';
    });
}

// ============================================
// 5. ANIMACIÓN DE ESCRITURA
// ============================================
const escrituraEl = document.getElementById('escrituraAnimada');
if (escrituraEl) {
    const textos = [
        'Almuerzo 25 mil + uber 12k',
        'Procesando...',
        'Almuerzo: $25.000\nUber: $12.000'
    ];
    let idx = 0;
    
    function animarTexto() {
        escrituraEl.textContent = textos[idx];
        idx = (idx + 1) % textos.length;
        setTimeout(animarTexto, 3000);
    }
    
    animarTexto();
}

// ============================================
// 6. NAVEGACIÓN INFERIOR (ya funciona con los href)
// ============================================
console.log('✅ FinixJS cargado correctamente');