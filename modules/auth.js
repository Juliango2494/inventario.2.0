function setupAuth() {
    window.abrirModalUsuario = () => document.getElementById('modalUsr').style.display = 'block';
    window.cerrarModalUsuario = () => document.getElementById('modalUsr').style.display = 'none';
    window.abrirModalReg = () => document.getElementById('modalReg').style.display = 'block';
    window.cerrarModalReg = () => document.getElementById('modalReg').style.display = 'none';
    
    window.registrar = () => {
        const usuario = document.getElementById('usuarioIn')?.value;
        const password = document.getElementById('passwordIn')?.value;
        const email = document.getElementById('emailIn')?.value;
        
        if (usuario && password && email) {
            localStorage.setItem('username', usuario);
            localStorage.setItem('password', password);
            localStorage.setItem('email', email);
            notificationSystem.show('Usuario registrado', 'success');
            cerrarModalReg();
        }
    };
    
    window.iniciarSesion = () => {
        const usuario = document.getElementById('usuarioInput')?.value.trim();
        const password = document.getElementById('passwordInput')?.value.trim();
        const savedUser = localStorage.getItem('username');
        const savedPass = localStorage.getItem('password');
        
        if (usuario === savedUser && password === savedPass) {
            notificationSystem.show('Sesión iniciada', 'success');
            cerrarModalUsuario();
            
            const userIcon = document.querySelector('.user-menu .fa-user-circle');
            const userBtn = document.querySelector('.user-menu .usuariosBtn');
            if (userIcon) userIcon.style.color = 'var(--primary-color)';
            if (userBtn) {
                userBtn.textContent = 'Bienvenido, Admin';
                userBtn.onclick = null;
            }
        } else {
            notificationSystem.show('Credenciales incorrectas', 'error');
            document.getElementById('usuarioInput').value = '';
            document.getElementById('passwordInput').value = '';
        }
    };
}
