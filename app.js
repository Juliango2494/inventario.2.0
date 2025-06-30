document.addEventListener('DOMContentLoaded', initializeApp);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
function initializeApp() {
    try {
        if (!window.notificationSystem) {
            window.notificationSystem = new NotificationSystem();
        }
        
        if (!window.dataManager) {  
            window.dataManager = new DataManager();
        }

        updateStats();
        
        console.log('ObraSmart v1.0 - Sistema inicializado correctamente');
    } catch (error) {
        console.error('Error inicializando la aplicación:', error);
    }
}
function abrirModalUsuario() {
      document.getElementById('modalUsr').style.display = 'block';
    }

    function cerrarModalUsuario() {
      document.getElementById('modalUsr').style.display = 'none';
    }
function abrirModalReg() {
      document.getElementById('modalReg').style.display = 'block';
    }

    function cerrarModalReg() {
      document.getElementById('modalReg').style.display = 'none';
    }
