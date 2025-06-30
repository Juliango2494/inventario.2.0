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
            
            if (window.notificationSystem) {
                window.notificationSystem.show('Usuario registrado', 'success');
            } else {
                alert('Usuario registrado exitosamente');
            }
            
            cerrarModalReg();
            
            document.getElementById('usuarioIn').value = '';
            document.getElementById('passwordIn').value = '';
            document.getElementById('emailIn').value = '';
        } else {
            if (window.notificationSystem) {
                window.notificationSystem.show('Complete todos los campos', 'warning');
            } else {
                alert('Complete todos los campos');
            }
        }
    };
    
    window.iniciarSesion = () => {
        const usuario = document.getElementById('usuarioInput')?.value.trim();
        const password = document.getElementById('passwordInput')?.value.trim();
        const savedUser = localStorage.getItem('username');
        const savedPass = localStorage.getItem('password');
        
        if (usuario === savedUser && password === savedPass) {
            if (window.notificationSystem) {
                window.notificationSystem.show('Sesión iniciada', 'success');
            } else {
                alert('Sesión iniciada correctamente');
            }
            
            cerrarModalUsuario();
            
            const userIcon = document.querySelector('.user-menu .fa-user-circle');
            const userBtn = document.querySelector('.user-menu .usuariosBtn');
            if (userIcon) userIcon.style.color = 'var(--primary-color)';
            if (userBtn) {
                userBtn.textContent = `Bienvenido, ${usuario}`;
                userBtn.onclick = null;
            }
            
            document.getElementById('usuarioInput').value = '';
            document.getElementById('passwordInput').value = '';
        } else {
            if (window.notificationSystem) {
                window.notificationSystem.show('Credenciales incorrectas', 'error');
            } else {
                alert('Credenciales incorrectas');
            }
            
            document.getElementById('usuarioInput').value = '';
            document.getElementById('passwordInput').value = '';
        }
    };
}