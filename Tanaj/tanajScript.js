// ============================================
// 1. RUTA DEL ARCHIVO DE DATOS
// ============================================
const RUTA_JSON = 'tanaj.json';

// ============================================
// 2. VARIABLES GLOBALES
// ============================================
let datosCompletos = [];
let indiceActual = 0;
let vistaActual = 'capitulo'; // 'capitulo', 'lista-capitulos' o 'lista-versiculos'
let versuloAResaltar = null; // Número de versículo a resaltar

// Variables para el swipe
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

// ============================================
// 3. FUNCIÓN PARA CARGAR LOS DATOS
// ============================================
async function cargarBiblia() {
    const contenedor = document.getElementById('contenedor-principal');
    contenedor.innerHTML = '<div class="mensaje-carga">Cargando archivo de datos...</div>';

    try {
        const respuesta = await fetch(RUTA_JSON);

        if (!respuesta.ok) {
            throw new Error('No se pudo cargar el archivo JSON');
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos) || datos.length === 0) {
            throw new Error('El JSON debe ser un arreglo con al menos un capítulo');
        }

        datosCompletos = datos;
        
        // Verificar si hay parámetros en la URL
        const urlParams = new URLSearchParams(window.location.search);
        const capituloParam = urlParams.get('capitulo');
        const versoParam = urlParams.get('verso');
        
        if (capituloParam !== null) {
            indiceActual = parseInt(capituloParam);
            if (versoParam !== null) {
                versuloAResaltar = parseInt(versoParam);
            }
        } else {
            indiceActual = 0;
        }
        
        generarListaLibrosDesdeJSON();
        
        // Mostrar el capítulo correspondiente
        if (versuloAResaltar !== null) {
            mostrarCapituloConResaltado(indiceActual, versuloAResaltar);
        } else {
            mostrarCapituloPorIndice(indiceActual);
        }

    } catch (error) {
        document.getElementById('contenedor-principal').innerHTML = 
            '<div class="mensaje-error">ERROR: ' + error.message + '. Verifica que el archivo "' + RUTA_JSON + '" exista.</div>';
    }
}

// ============================================
// 4. GENERAR LISTA DE LIBROS DESDE JSON
// ============================================
function generarListaLibrosDesdeJSON() {
    const lista = document.getElementById('lista-libros-menu');
    if (!lista) return;
    
    lista.innerHTML = '';
    
    const librosAgrupados = {};
    
    datosCompletos.forEach((capitulo, index) => {
        const titulo = capitulo.titulo || 'Sin título';
        if (!librosAgrupados[titulo]) {
            librosAgrupados[titulo] = {
                titulo: titulo,
                indices: []
            };
        }
        librosAgrupados[titulo].indices.push(index);
    });
    
    Object.keys(librosAgrupados).forEach((titulo) => {
        const grupo = librosAgrupados[titulo];
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = titulo;
        a.dataset.titulo = titulo;
        a.dataset.indices = JSON.stringify(grupo.indices);
        a.title = grupo.indices.length + ' capítulos';
        
        a.addEventListener('click', function(e) {
            e.preventDefault();
            const tituloSeleccionado = this.dataset.titulo;
            const indices = JSON.parse(this.dataset.indices);
            mostrarListaCapitulos(tituloSeleccionado, indices);
            cerrarMenu();
        });
        
        li.appendChild(a);
        lista.appendChild(li);
    });
}

// ============================================
// 5. MOSTRAR LISTA DE CAPÍTULOS DE UN LIBRO
// ============================================
function mostrarListaCapitulos(titulo, indices) {
    const contenedor = document.getElementById('contenedor-principal');
    contenedor.innerHTML = '';
    vistaActual = 'lista-capitulos';

    if (!indices || indices.length === 0) {
        contenedor.innerHTML = '<div class="mensaje-error">No hay capítulos para mostrar.</div>';
        return;
    }

    // MENÚ HAMBURGUESA
    const menuDiv = document.createElement('div');
    menuDiv.className = 'menu-hamburguesa';
    
    const menuBtn = document.createElement('span');
    menuBtn.className = 'boton-hamburguesa';
    menuBtn.textContent = '☰';
    menuBtn.setAttribute('aria-label', 'Abrir menú de libros');
    menuBtn.addEventListener('click', toggleMenu);
    
    menuDiv.appendChild(menuBtn);
    contenedor.appendChild(menuDiv);

    // TÍTULO DEL LIBRO
    const tituloLibro = document.createElement('h1');
    tituloLibro.className = 'titulo-libro-completo';
    tituloLibro.textContent = titulo;
    contenedor.appendChild(tituloLibro);

    // LISTA DE CAPÍTULOS
    const listaContainer = document.createElement('div');
    listaContainer.className = 'lista-capitulos-container';
    listaContainer.style.marginTop = '30px';

    const subtituloLista = document.createElement('h3');
    subtituloLista.style.color = '#291b5a';
    subtituloLista.style.fontSize = '18px';
    subtituloLista.style.marginBottom = '20px';
    subtituloLista.style.borderBottom = '2px solid #a9b4d4';
    subtituloLista.style.paddingBottom = '10px';
    subtituloLista.textContent = '📖 Capítulos (' + indices.length + ')';
    listaContainer.appendChild(subtituloLista);

    const listaCaps = document.createElement('ul');
    listaCaps.style.listStyle = 'none';
    listaCaps.style.padding = '0';
    listaCaps.style.margin = '0';

    indices.forEach((index) => {
        const capitulo = datosCompletos[index];
        if (!capitulo) return;

        const li = document.createElement('li');
        li.style.margin = '8px 0';
        li.style.borderBottom = '1px solid #f0ece6';
        li.style.padding = '8px 0';

        const a = document.createElement('a');
        const nombreCapitulo = capitulo.capitulo || 'Capítulo ' + (indices.indexOf(index) + 1);
        a.textContent = '▶ ' + nombreCapitulo;
        a.href = '#';
        a.style.display = 'block';
        a.style.padding = '10px 15px';
        a.style.color = '#1f1a3d';
        a.style.textDecoration = 'none';
        a.style.borderRadius = '6px';
        a.style.transition = 'background 0.2s, color 0.2s';
        a.style.fontSize = '16px';
        a.style.cursor = 'pointer';
        
        a.addEventListener('mouseenter', function() {
            this.style.background = '#f0ece6';
        });
        a.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
        });

        a.addEventListener('click', function(e) {
            e.preventDefault();
            indiceActual = index;
            mostrarListaVersiculos(indiceActual);
            actualizarMenuActivo();
        });

        li.appendChild(a);
        listaCaps.appendChild(li);
    });

    listaContainer.appendChild(listaCaps);
    contenedor.appendChild(listaContainer);
}

// ============================================
// 6. MOSTRAR LISTA DE VERSÍCULOS DE UN CAPÍTULO (SOLO NÚMEROS)
// ============================================
function mostrarListaVersiculos(indice) {
    const contenedor = document.getElementById('contenedor-principal');
    contenedor.innerHTML = '';
    vistaActual = 'lista-versiculos';

    const capitulo = datosCompletos[indice];
    if (!capitulo) {
        contenedor.innerHTML = '<div class="mensaje-error">Capítulo no encontrado.</div>';
        return;
    }

    // --- CORRECCIÓN: Usar "versiculo" (singular) en lugar de "versiculos" ---
    const versiculosArray = capitulo.versiculo || capitulo.versiculos || [];
    
    if (versiculosArray.length === 0) {
        contenedor.innerHTML = '<div class="mensaje-error">No hay versículos en este capítulo.</div>';
        return;
    }

    // MENÚ HAMBURGUESA
    const menuDiv = document.createElement('div');
    menuDiv.className = 'menu-hamburguesa';
    
    const menuBtn = document.createElement('span');
    menuBtn.className = 'boton-hamburguesa';
    menuBtn.textContent = '☰';
    menuBtn.setAttribute('aria-label', 'Abrir menú de libros');
    menuBtn.addEventListener('click', toggleMenu);
    
    menuDiv.appendChild(menuBtn);
    contenedor.appendChild(menuDiv);

    // TÍTULO DEL LIBRO
    const titulo = document.createElement('h1');
    titulo.className = 'titulo-libro';
    titulo.textContent = capitulo.titulo || 'Sin título';
    contenedor.appendChild(titulo);

    // NOMBRE DEL CAPÍTULO
    const nombreCap = document.createElement('div');
    nombreCap.className = 'nombre-capitulo';
    nombreCap.textContent = capitulo.capitulo || 'Capítulo';
    contenedor.appendChild(nombreCap);

    // LISTA DE VERSÍCULOS (SOLO NÚMEROS)
    const listaContainer = document.createElement('div');
    listaContainer.className = 'lista-versiculos-container';
    listaContainer.style.marginTop = '20px';

    const subtituloLista = document.createElement('h3');
    subtituloLista.style.color = '#0a0a0a';
    subtituloLista.style.fontSize = '18px';
    subtituloLista.style.marginBottom = '20px';
    subtituloLista.style.borderBottom = '2px solid #010235';
    subtituloLista.style.paddingBottom = '10px';
    subtituloLista.textContent = '📜 Versículos (' + versiculosArray.length + ')';
    listaContainer.appendChild(subtituloLista);

    // Grid de números de versículos
    const gridVersos = document.createElement('div');
    gridVersos.style.display = 'grid';
    gridVersos.style.gridTemplateColumns = 'repeat(auto-fill, minmax(60px, 1fr))';
    gridVersos.style.gap = '10px';
    gridVersos.style.marginTop = '10px';

    versiculosArray.forEach((v) => {
        const btn = document.createElement('button');
        btn.textContent = v.numero;
        btn.dataset.numero = v.numero;
        btn.style.padding = '12px 8px';
        btn.style.border = '2px solid #180044';
        btn.style.borderRadius = '8px';
        btn.style.background = '#ffffff';
        btn.style.color = '#1a1d3d';
        btn.style.fontSize = '18px';
        btn.style.fontWeight = '600';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'background 0.2s, transform 0.1s, box-shadow 0.2s';
        btn.style.boxShadow = '0 2px 4px rgba(255, 255, 255, 0.05)';
        
        btn.addEventListener('mouseenter', function() {
            this.style.background = '#1f138b';
            this.style.color = '#fff';
            this.style.borderColor = '#13298b';
            this.style.transform = 'scale(1.05)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.background = '#faf6f0';
            this.style.color = '#201a3d';
            this.style.borderColor = '#030302';
            this.style.transform = 'scale(1)';
        });
        
        btn.addEventListener('click', function() {
            const numeroVerso = parseInt(this.dataset.numero);
            window.location.href = 'tanaj.html?capitulo=' + indice + '&verso=' + numeroVerso;
        });

        gridVersos.appendChild(btn);
    });

    listaContainer.appendChild(gridVersos);
    contenedor.appendChild(listaContainer);

    // SEPARADOR
    const separador = document.createElement('hr');
    separador.className = 'separador-capitulo';
    contenedor.appendChild(separador);
}

// ============================================
// 7. MOSTRAR CAPÍTULO CON VERSÍCULO RESALTADO (TEMPORAL + SCROLL)
// ============================================
function mostrarCapituloConResaltado(indice, numeroVerso) {
    const contenedor = document.getElementById('contenedor-principal');
    contenedor.innerHTML = '';
    vistaActual = 'capitulo';

    const capitulo = datosCompletos[indice];
    if (!capitulo) {
        contenedor.innerHTML = '<div class="mensaje-error">Capítulo no encontrado.</div>';
        return;
    }

    // --- CORRECCIÓN: Usar "versiculo" (singular) en lugar de "versiculos" ---
    const versiculosArray = capitulo.versiculo || capitulo.versiculos || [];

    // MENÚ HAMBURGUESA
    const menuDiv = document.createElement('div');
    menuDiv.className = 'menu-hamburguesa';
    
    const menuBtn = document.createElement('span');
    menuBtn.className = 'boton-hamburguesa';
    menuBtn.textContent = '☰';
    menuBtn.setAttribute('aria-label', 'Abrir menú de libros');
    menuBtn.addEventListener('click', toggleMenu);
    
    menuDiv.appendChild(menuBtn);
    contenedor.appendChild(menuDiv);

    // TÍTULO
    const titulo = document.createElement('h1');
    titulo.className = 'titulo-libro';
    titulo.textContent = capitulo.titulo || 'Sin título';
    contenedor.appendChild(titulo);

    // SUBTÍTULO
    if (capitulo.subtitulo) {
        const subtitulo = document.createElement('div');
        subtitulo.className = 'subtitulo-capitulo';
        subtitulo.textContent = capitulo.subtitulo;
        contenedor.appendChild(subtitulo);
    }

    // NOMBRE CAPÍTULO
    const nombreCap = document.createElement('div');
    nombreCap.className = 'nombre-capitulo';
    nombreCap.textContent = capitulo.capitulo || 'Capítulo';
    contenedor.appendChild(nombreCap);

    // VERSÍCULOS - con resaltado temporal para el seleccionado
    if (versiculosArray.length > 0) {
        for (let i = 0; i < versiculosArray.length; i++) {
            const v = versiculosArray[i];
            const p = document.createElement('p');
            p.className = 'versiculo';
            p.id = 'verso-' + v.numero;
            
            if (v.numero == numeroVerso) {
                p.classList.add('versiculo-resaltado-temporal');
                p.dataset.resaltado = 'true';
                
                setTimeout(function() {
                    p.classList.remove('versiculo-resaltado-temporal');
                    p.dataset.resaltado = 'false';
                }, 3500);
            }
            
            const spanNum = document.createElement('span');
            spanNum.className = 'numero';
            spanNum.textContent = v.numero + '.';
            
            const spanTexto = document.createElement('span');
            spanTexto.textContent = ' ' + v.texto;
            
            p.appendChild(spanNum);
            p.appendChild(spanTexto);
            contenedor.appendChild(p);
        }
    }

    // BOTONES DE NAVEGACIÓN ◀ ▶
    const navDiv = document.createElement('div');
    navDiv.className = 'nav-botones';

    const btnIzq = document.createElement('button');
    btnIzq.className = 'btn-nav';
    btnIzq.textContent = '◀';
    btnIzq.disabled = (indice === 0);

    const btnDer = document.createElement('button');
    btnDer.className = 'btn-nav';
    btnDer.textContent = '▶';
    btnDer.disabled = (indice === datosCompletos.length - 1);

    const indicador = document.createElement('span');
    indicador.className = 'indicador-capitulo';
    indicador.textContent = (indice + 1) + ' / ' + datosCompletos.length;

    btnIzq.addEventListener('click', function() {
        if (indiceActual > 0) {
            indiceActual--;
            window.location.href = 'tanaj.html?capitulo=' + indiceActual;
        }
    });

    btnDer.addEventListener('click', function() {
        if (indiceActual < datosCompletos.length - 1) {
            indiceActual++;
            window.location.href = 'tanaj.html?capitulo=' + indiceActual;
        }
    });

    navDiv.appendChild(btnIzq);
    navDiv.appendChild(indicador);
    navDiv.appendChild(btnDer);
    contenedor.appendChild(navDiv);

    // SEPARADOR
    const separador = document.createElement('hr');
    separador.className = 'separador-capitulo';
    contenedor.appendChild(separador);
    
    actualizarMenuActivo();
    
    // ============================================
    // SCROLL AUTOMÁTICO AL VERSÍCULO RESALTADO
    // ============================================
    setTimeout(function() {
        const versoElement = document.getElementById('verso-' + numeroVerso);
        if (versoElement) {
            const rect = versoElement.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetPosition = rect.top + scrollTop - 80;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }, 150);
    
    versuloAResaltar = null;
}

// ============================================
// 8. MOSTRAR UN CAPÍTULO SEGÚN ÍNDICE (Vista normal sin resaltado)
// ============================================
function mostrarCapituloPorIndice(indice) {
    const contenedor = document.getElementById('contenedor-principal');
    contenedor.innerHTML = '';
    vistaActual = 'capitulo';

    const capitulo = datosCompletos[indice];
    if (!capitulo) {
        contenedor.innerHTML = '<div class="mensaje-error">Capítulo no encontrado.</div>';
        return;
    }

    // --- CORRECCIÓN: Usar "versiculo" (singular) en lugar de "versiculos" ---
    const versiculosArray = capitulo.versiculo || capitulo.versiculos || [];

    // MENÚ HAMBURGUESA
    const menuDiv = document.createElement('div');
    menuDiv.className = 'menu-hamburguesa';
    
    const menuBtn = document.createElement('span');
    menuBtn.className = 'boton-hamburguesa';
    menuBtn.textContent = '☰';
    menuBtn.setAttribute('aria-label', 'Abrir menú de libros');
    menuBtn.addEventListener('click', toggleMenu);
    
    menuDiv.appendChild(menuBtn);
    contenedor.appendChild(menuDiv);

    // TÍTULO
    const titulo = document.createElement('h1');
    titulo.className = 'titulo-libro';
    titulo.textContent = capitulo.titulo || 'Sin título';
    contenedor.appendChild(titulo);

    // SUBTÍTULO
    if (capitulo.subtitulo) {
        const subtitulo = document.createElement('div');
        subtitulo.className = 'subtitulo-capitulo';
        subtitulo.textContent = capitulo.subtitulo;
        contenedor.appendChild(subtitulo);
    }

    // NOMBRE CAPÍTULO
    const nombreCap = document.createElement('div');
    nombreCap.className = 'nombre-capitulo';
    nombreCap.textContent = capitulo.capitulo || 'Capítulo';
    contenedor.appendChild(nombreCap);

    // VERSÍCULOS (sin resaltado)
    if (versiculosArray.length > 0) {
        for (let i = 0; i < versiculosArray.length; i++) {
            const v = versiculosArray[i];
            const p = document.createElement('p');
            p.className = 'versiculo';
            
            const spanNum = document.createElement('span');
            spanNum.className = 'numero';
            spanNum.textContent = v.numero + '.';
            
            const spanTexto = document.createElement('span');
            spanTexto.textContent = ' ' + v.texto;
            
            p.appendChild(spanNum);
            p.appendChild(spanTexto);
            contenedor.appendChild(p);
        }
    }

    // BOTONES DE NAVEGACIÓN
    const navDiv = document.createElement('div');
    navDiv.className = 'nav-botones';

    const btnIzq = document.createElement('button');
    btnIzq.className = 'btn-nav';
    btnIzq.textContent = '◀';
    btnIzq.disabled = (indice === 0);

    const btnDer = document.createElement('button');
    btnDer.className = 'btn-nav';
    btnDer.textContent = '▶';
    btnDer.disabled = (indice === datosCompletos.length - 1);

    const indicador = document.createElement('span');
    indicador.className = 'indicador-capitulo';
    indicador.textContent = (indice + 1) + ' / ' + datosCompletos.length;

    btnIzq.addEventListener('click', function() {
        if (indiceActual > 0) {
            indiceActual--;
            window.location.href = 'tanaj.html?capitulo=' + indiceActual;
        }
    });

    btnDer.addEventListener('click', function() {
        if (indiceActual < datosCompletos.length - 1) {
            indiceActual++;
            window.location.href = 'tanaj.html?capitulo=' + indiceActual;
        }
    });

    navDiv.appendChild(btnIzq);
    navDiv.appendChild(indicador);
    navDiv.appendChild(btnDer);
    contenedor.appendChild(navDiv);

    // SEPARADOR
    const separador = document.createElement('hr');
    separador.className = 'separador-capitulo';
    contenedor.appendChild(separador);
    
    actualizarMenuActivo();
}

// ============================================
// 9. ACTUALIZAR ELEMENTO ACTIVO EN EL MENÚ
// ============================================
function actualizarMenuActivo() {
    const enlaces = document.querySelectorAll('#lista-libros-menu a');
    enlaces.forEach((a) => {
        const indices = JSON.parse(a.dataset.indices || '[]');
        const esActivo = indices.includes(indiceActual);
        a.classList.toggle('activo', esActivo);
    });
}

// ============================================
// 10. FUNCIONES DEL MENÚ HAMBURGUESA
// ============================================
function toggleMenu() {
    const menu = document.getElementById('menu-lateral');
    const overlay = document.getElementById('overlay-menu');
    
    menu.classList.toggle('menu-abierto');
    menu.classList.toggle('menu-cerrado');
    overlay.classList.toggle('activo');
    
    document.body.style.overflow = menu.classList.contains('menu-abierto') ? 'hidden' : '';
}

function cerrarMenu() {
    const menu = document.getElementById('menu-lateral');
    const overlay = document.getElementById('overlay-menu');
    
    menu.classList.remove('menu-abierto');
    menu.classList.add('menu-cerrado');
    overlay.classList.remove('activo');
    document.body.style.overflow = '';
}

// ============================================
// 11. FUNCIONES DE SWIPE PARA MÓVIL
// ============================================

function irCapituloAnterior() {
    if (indiceActual > 0) {
        indiceActual--;
        window.location.href = 'tanaj.html?capitulo=' + indiceActual;
    }
}

function irCapituloSiguiente() {
    if (indiceActual < datosCompletos.length - 1) {
        indiceActual++;
        window.location.href = 'tanaj.html?capitulo=' + indiceActual;
    }
}

function handleTouchStart(event) {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
}

function handleTouchEnd(event) {
    if (vistaActual !== 'capitulo') return;
    
    touchEndX = event.changedTouches[0].screenX;
    touchEndY = event.changedTouches[0].screenY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const DISTANCIA_MINIMA = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > DISTANCIA_MINIMA) {
            if (deltaX > 0) {
                irCapituloAnterior();
            } else {
                irCapituloSiguiente();
            }
        }
    }
}

function configurarSwipe() {
    const contenedor = document.getElementById('contenedor-principal');
    if (contenedor) {
        contenedor.addEventListener('touchstart', handleTouchStart, { passive: true });
        contenedor.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
}

// ============================================
// 12. EJECUTAR
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    cargarBiblia();
    setTimeout(configurarSwipe, 100);
    
    const btnCerrar = document.getElementById('btn-cerrar-menu');
    const overlay = document.getElementById('overlay-menu');
    
    if (btnCerrar) btnCerrar.addEventListener('click', cerrarMenu);
    if (overlay) overlay.addEventListener('click', cerrarMenu);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') cerrarMenu();
    });
});