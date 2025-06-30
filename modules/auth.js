function registrar(){
    const usuarioInput = document.getElementById('usuarioIn').value;
    const passwordInput = document.getElementById('passwordIn').value;
    const emailInput = document.getElementById('emailIn').value;



localStorage.setItem('username', usuarioInput)
localStorage.setItem('password', passwordInput)
localStorage.setItem('email', emailInput)
}

function iniciarSesion() {
    const usuarioInput = document.getElementById('usuarioInput');
    const passwordInput = document.getElementById('passwordInput');

    const usuario = usuarioInput.value.trim();
    const password = passwordInput.value.trim();

    const USERNAME = localStorage.getItem("username");
    const PASSWORD = localStorage.getItem("password");

    if (usuario === USERNAME && password === PASSWORD) {
        if (window.notificationSystem) {
            window.notificationSystem.show('Inicio de sesión exitoso', 'success');
        } else {
            console.warn('notificationSystem no está disponible.');
            alert('Inicio de sesión exitoso'); 
        }
        cerrarModalUsuario(); 
        const userIcon = document.querySelector('.user-menu .fa-user-circle');
        if (userIcon) {
            userIcon.style.color = 'var(--primary-color)'; 
        }
        const userBtn = document.querySelector('.user-menu .usuariosBtn');
        if (userBtn) {
            userBtn.textContent = 'Bienvenido, Admin'; 
            userBtn.onclick = null; 
            userBtn.style.cursor = 'default';
        }

    } else {
        if (window.notificationSystem) {
            window.notificationSystem.show('Usuario o contraseña incorrectos', 'error');
        } else {
            console.warn('notificationSystem no está disponible.');
            alert('Usuario o contraseña incorrectos'); 
        }
        usuarioInput.value = ''; 
        passwordInput.value = '';
    }
}