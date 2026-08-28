// ============================================ 
// MANTENIMIENTO - SOLO PARA PC
// ============================================

function mostrarMantenimiento() {
    const anchoPantalla = window.innerWidth;
    
    // Si es PC (pantalla >= 769px)
    if (anchoPantalla >= 769) {
        // Ocultar todo
        const contenedor = document.getElementById('contenedor-principal');
        const menu = document.getElementById('menu-lateral');
        const overlay = document.getElementById('overlay-menu');
        
        if (contenedor) contenedor.style.display = 'none';
        if (menu) menu.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
        
        // Configurar body
        const body = document.body;
        body.style.margin = '0';
        body.style.padding = '0';
        body.style.background = '#0a0a1a';
        body.style.display = 'flex';
        body.style.flexDirection = 'column';
        body.style.justifyContent = 'center';
        body.style.alignItems = 'center';
        body.style.minHeight = '100vh';
        body.style.fontFamily = "'Segoe UI', Roboto, system-ui, sans-serif";
        
        // Eliminar cualquier contenido previo del body
        while (body.firstChild) {
            body.removeChild(body.firstChild);
        }
        
        // Crear el div de mantenimiento
        const mantDiv = document.createElement('div');
        mantDiv.id = 'pantalla-mantenimiento';
        mantDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem; max-width: 600px;">
                <div style="font-size: 80px; margin-bottom: 20px;">🛠️</div>
                <h1 style="font-size: 48px; font-weight: 700; margin-bottom: 20px; background: linear-gradient(135deg, #6c95c4, #a8b5d6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Mantenimiento no disponible</h1>
                <p style="font-size: 20px; color: #aab; margin-bottom: 30px; line-height: 1.6;">La versión de escritorio se encuentra en mantenimiento. Por favor, utiliza tu dispositivo móvil para acceder al contenido.</p>
                <div style="display: flex; justify-content: center; align-items: center; margin: 10px 0 30px 0;">
                    <div style="width: 80px; height: 80px; border: 6px solid rgba(108, 149, 196, 0.2); border-top: 6px solid #a8b5d6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                </div>
                <div style="width: 200px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; margin: 20px auto 0;">
                    <div style="height: 100%; width: 0%; background: linear-gradient(90deg, #6c95c4, #a8b5d6); border-radius: 4px; animation: cargaBarra 2s ease-in-out infinite;"></div>
                </div>
                <div style="font-size: 14px; color: #667; margin-top: 15px; letter-spacing: 2px; text-transform: uppercase; animation: parpadeo 1.5s ease-in-out infinite;">⚡ Actualizando sistema ⚡</div>
                <div style="margin-top: 40px; font-size: 12px; color: #445; letter-spacing: 1px;">Tanaj Digital • Versión 1.0</div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes cargaBarra {
                    0% { width: 0%; }
                    50% { width: 70%; }
                    100% { width: 100%; }
                }
                @keyframes parpadeo {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
            </style>
        `;
        
        body.appendChild(mantDiv);
        return true;
    }
    
    return false;
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    mostrarMantenimiento();
});