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
// 5. ANIMACIÓN MÁQUINA DE ESCRIBIR CON ESTILOS
// ============================================
const escrituraEl = document.getElementById('escrituraAnimada');
let animacionInterval = null;
let estaEditando = false;
let textoOriginal = '';
let animacionEnCurso = false;

// Textos para la animación
const textosAnimacion = [
    'Almuerzo 25 mil + uber 12k',
    'Procesando...',
    'Almuerzo: $25.000\nUber: $12.000'
];

// Función para escribir con efecto máquina de escribir
function escribirConEfecto(texto, velocidad = 50, callback) {
    if (!escrituraEl || estaEditando) return;
    
    animacionEnCurso = true;
    let index = 0;
    escrituraEl.textContent = '';
    escrituraEl.style.color = '#c0d0e0';
    
    function escribirLetra() {
        if (index < texto.length) {
            const char = texto.charAt(index);
            const textoActual = escrituraEl.textContent + char;
            escrituraEl.textContent = textoActual;
            index++;
            
            let velocidadActual = velocidad;
            if (char === ' ' || char === '.') {
                velocidadActual = velocidad * 1.5;
            } else if (index % 5 === 0) {
                velocidadActual = velocidad * 0.8;
            }
            
            setTimeout(escribirLetra, velocidadActual);
        } else {
            animacionEnCurso = false;
            if (callback) callback();
        }
    }
    
    escribirLetra();
}

// Función para mostrar el resultado con estilos
function mostrarResultadoConEstilos() {
    if (estaEditando) return;
    
    animacionEnCurso = true;
    escrituraEl.innerHTML = '';
    escrituraEl.style.color = '#c0d0e0';
    escrituraEl.style.display = 'flex';
    escrituraEl.style.flexDirection = 'column';
    escrituraEl.style.gap = '6px';
    escrituraEl.style.padding = '4px 0';
    
    // Crear elementos para cada ítem
    const items = [
        { 
            icono: '🍽️', 
            texto: 'Almuerzo: $25.000', 
            color: 'rgba(255, 50, 50, 0.15)',
            borderColor: 'rgba(255, 50, 50, 0.3)',
            glowColor: 'rgba(255, 50, 50, 0.1)'
        },
        { 
            icono: '🚗', 
            texto: 'Uber: $12.000', 
            color: 'rgba(50, 150, 255, 0.15)',
            borderColor: 'rgba(50, 150, 255, 0.3)',
            glowColor: 'rgba(50, 150, 255, 0.1)'
        }
    ];
    
    let itemIndex = 0;
    
    function agregarItemConEfecto() {
        if (itemIndex >= items.length || estaEditando) {
            animacionEnCurso = false;
            // Esperar y reiniciar el ciclo
            setTimeout(function() {
                if (!estaEditando && !animacionEnCurso) {
                    escrituraEl.innerHTML = '';
                    escrituraEl.style.display = 'block';
                    cicloAnimacion();
                }
            }, 3000);
            return;
        }
        
        const item = items[itemIndex];
        
        // Crear el contenedor del item
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            background: ${item.color};
            border: 1px solid ${item.borderColor};
            border-radius: 8px;
            padding: 6px 12px;
            margin: 2px 0;
            box-shadow: 0 0 20px ${item.glowColor};
            animation: aparecerItem 0.5s ease-out;
            opacity: 0;
            transform: translateX(-10px);
            transition: all 0.3s ease;
        `;
        
        // Icono
        const iconoSpan = document.createElement('span');
        iconoSpan.textContent = item.icono;
        iconoSpan.style.cssText = `
            font-size: 18px;
            margin-right: 4px;
        `;
        
        // Texto
        const textoSpan = document.createElement('span');
        textoSpan.textContent = item.texto;
        textoSpan.style.cssText = `
            color: white;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.3px;
        `;
        
        // Precio con formato especial
        const precioSpan = document.createElement('span');
        const partes = item.texto.split(': ');
        if (partes.length === 2) {
            textoSpan.textContent = partes[0] + ': ';
            const precio = document.createElement('span');
            precio.textContent = partes[1];
            precio.style.cssText = `
                color: #00FFD4;
                font-weight: 700;
                font-size: 13px;
            `;
            textoSpan.appendChild(precio);
        }
        
        itemDiv.appendChild(iconoSpan);
        itemDiv.appendChild(textoSpan);
        
        // Agregar al contenedor principal
        escrituraEl.appendChild(itemDiv);
        
        // Animar la aparición
        setTimeout(() => {
            itemDiv.style.opacity = '1';
            itemDiv.style.transform = 'translateX(0)';
        }, 50);
        
        itemIndex++;
        
        // Esperar entre items
        setTimeout(agregarItemConEfecto, 500);
    }
    
    // Agregar los items con efecto
    agregarItemConEfecto();
}

// Función para el ciclo completo de animación
function cicloAnimacion() {
    if (estaEditando || animacionEnCurso) return;
    
    // Restaurar estilo del contenedor
    escrituraEl.style.display = 'block';
    escrituraEl.style.padding = '0';
    escrituraEl.style.gap = '0';
    
    // Paso 1: Escribir "Almuerzo 25 mil + uber 12k"
    escribirConEfecto(textosAnimacion[0], 60, function() {
        setTimeout(function() {
            if (estaEditando) return;
            
            // Paso 2: Limpiar y escribir "Procesando..."
            escrituraEl.innerHTML = '';
            setTimeout(function() {
                if (estaEditando) return;
                escrituraEl.textContent = 'Procesando...';
                escrituraEl.style.color = '#00FFD4';
                escrituraEl.style.fontWeight = '600';
                
                setTimeout(function() {
                    if (estaEditando) return;
                    
                    // Paso 3: Mostrar resultado con estilos
                    escrituraEl.textContent = '';
                    escrituraEl.style.color = '#c0d0e0';
                    escrituraEl.style.fontWeight = '500';
                    
                    mostrarResultadoConEstilos();
                }, 1500);
            }, 300);
        }, 1000);
    });
}

// Función para iniciar la animación
function iniciarAnimacion() {
    if (animacionInterval) {
        clearInterval(animacionInterval);
        animacionInterval = null;
    }
    
    if (!estaEditando && escrituraEl && 
        (!escrituraEl.dataset.textoPersonalizado || escrituraEl.dataset.textoPersonalizado === 'false')) {
        escrituraEl.innerHTML = '';
        escrituraEl.style.color = '#c0d0e0';
        escrituraEl.style.fontWeight = '500';
        escrituraEl.style.display = 'block';
        escrituraEl.style.padding = '0';
        escrituraEl.style.gap = '0';
        
        setTimeout(function() {
            if (!estaEditando) {
                cicloAnimacion();
            }
        }, 500);
    }
}

// Función para detener la animación
function detenerAnimacion() {
    animacionEnCurso = false;
    if (animacionInterval) {
        clearInterval(animacionInterval);
        animacionInterval = null;
    }
}

// Función para entrar en modo edición
function entrarEnEdicion() {
    detenerAnimacion();
    animacionEnCurso = false;
    estaEditando = true;
    
    textoOriginal = escrituraEl.textContent;
    
    escrituraEl.innerHTML = '';
    escrituraEl.style.color = 'white';
    escrituraEl.style.display = 'block';
    escrituraEl.style.padding = '0';
    escrituraEl.style.gap = '0';
    escrituraEl.style.fontWeight = '500';
    
    escrituraEl.contentEditable = true;
    escrituraEl.focus();
    
    const selection = window.getSelection();
    if (selection) {
        selection.removeAllRanges();
    }
    
    const range = document.createRange();
    range.setStart(escrituraEl.firstChild || escrituraEl, 0);
    range.collapse(true);
    if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
    }
    
    escrituraEl.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    escrituraEl.style.border = '1px solid #00FFD4';
    escrituraEl.style.borderRadius = '4px';
    escrituraEl.style.padding = '8px';
    escrituraEl.style.outline = 'none';
    escrituraEl.style.color = 'white';
    
    escrituraEl.dataset.textoPersonalizado = 'true';
}

// Función para salir del modo edición
function salirDeEdicion(guardar = true) {
    estaEditando = false;
    animacionEnCurso = false;
    
    escrituraEl.contentEditable = false;
    
    escrituraEl.style.backgroundColor = 'transparent';
    escrituraEl.style.border = 'none';
    escrituraEl.style.borderRadius = '0';
    escrituraEl.style.padding = '0';
    escrituraEl.style.outline = 'none';
    escrituraEl.style.color = '#c0d0e0';
    escrituraEl.style.display = 'block';
    escrituraEl.style.gap = '0';
    escrituraEl.style.fontWeight = '500';
    escrituraEl.innerHTML = escrituraEl.textContent.replace(/\n/g, '<br>');
    
    if (!escrituraEl.textContent || escrituraEl.textContent.trim() === '') {
        escrituraEl.dataset.textoPersonalizado = 'false';
        escrituraEl.innerHTML = '';
        escrituraEl.style.color = '#c0d0e0';
        setTimeout(function() {
            if (!estaEditando) {
                iniciarAnimacion();
            }
        }, 300);
    } else {
        escrituraEl.dataset.textoPersonalizado = 'true';
        escrituraEl.style.color = '#c0d0e0';
        detenerAnimacion();
    }
    
    const selection = window.getSelection();
    if (selection) {
        selection.removeAllRanges();
    }
}

// Eventos
if (escrituraEl) {
    escrituraEl.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        if (!estaEditando) {
            entrarEnEdicion();
        }
    });
    
    escrituraEl.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            if (!e.shiftKey) {
                e.preventDefault();
                salirDeEdicion(true);
            }
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            if (textoOriginal && textoOriginal.trim() !== '') {
                escrituraEl.innerHTML = textoOriginal;
                escrituraEl.dataset.textoPersonalizado = 'true';
                escrituraEl.style.color = '#c0d0e0';
            } else {
                escrituraEl.dataset.textoPersonalizado = 'false';
                escrituraEl.innerHTML = '';
                escrituraEl.style.color = '#c0d0e0';
                setTimeout(function() {
                    if (!estaEditando) {
                        iniciarAnimacion();
                    }
                }, 300);
            }
            estaEditando = false;
            animacionEnCurso = false;
            escrituraEl.contentEditable = false;
            escrituraEl.style.backgroundColor = 'transparent';
            escrituraEl.style.border = 'none';
            escrituraEl.style.borderRadius = '0';
            escrituraEl.style.padding = '0';
            escrituraEl.style.outline = 'none';
            
            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
            }
        }
    });
}

document.addEventListener('click', function(e) {
    if (escrituraEl && estaEditando) {
        if (!escrituraEl.contains(e.target)) {
            salirDeEdicion(true);
        }
    }
});

if (escrituraEl) {
    escrituraEl.addEventListener('blur', function() {
        if (estaEditando) {
            salirDeEdicion(true);
        }
    });
}

// Iniciar la animación al cargar la página
setTimeout(function() {
    iniciarAnimacion();
}, 500);

// Agregar keyframes para la animación de aparición
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes aparecerItem {
        0% {
            opacity: 0;
            transform: translateX(-10px) scale(0.95);
        }
        100% {
            opacity: 1;
            transform: translateX(0) scale(1);
        }
    }
`;
document.head.appendChild(styleSheet);

console.log('✅ FinixJS cargado correctamente');