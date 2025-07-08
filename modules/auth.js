function setupAuth() {
    window.abrirModalUsuario = () => document.getElementById('modalUsr').style.display = 'block';
    window.cerrarModalUsuario = () => document.getElementById('modalUsr').style.display = 'none';
    window.abrirModalReg = () => document.getElementById('modalReg').style.display = 'block';
    window.cerrarModalReg = () => document.getElementById('modalReg').style.display = 'none';

    const showAppNotification = (message, type) => {
        if (window.notificationSystem) {
            window.notificationSystem.show(message, type);
        } else {
            alert(message);
        }
    };

    async function hashString(str) {
        const textEncoder = new TextEncoder();
        const data = textEncoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashedPassword;
    }

    window.registrar = async () => {
        const usuarioInput = document.getElementById('usuarioIn');
        const passwordInput = document.getElementById('passwordIn');
        const emailInput = document.getElementById('emailIn');
        const registerButton = document.querySelector('.modal-registro button[onclick="registrar()"]'); 
        const usuario = usuarioInput?.value.trim();
        const password = passwordInput?.value.trim();
        const email = emailInput?.value.trim();

        if (!usuario || !password || !email) {
            showAppNotification('Complete todos los campos', 'warning');
            return;
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            showAppNotification('Ingrese un formato de correo electrónico válido', 'warning');
            return;
        }

        if (password.length < 6) { 
            showAppNotification('La contraseña debe tener al menos 6 caracteres', 'warning');
            return;
        }

        if (registerButton) {
            registerButton.disabled = true;
            registerButton.textContent = 'Registrando...';
            registerButton.style.cursor = 'wait';
        }

        try {
            const hashedPassword = await hashString(password);

            localStorage.setItem('username', usuario);
            localStorage.setItem('password', hashedPassword);
            localStorage.setItem('email', email);

            showAppNotification('Usuario registrado exitosamente', 'success');
            cerrarModalReg();

            usuarioInput.value = '';
            passwordInput.value = '';
            emailInput.value = '';
        } catch (error) {
            console.error('Error during registration:', error);
            showAppNotification('Error al registrar usuario. Intente de nuevo.', 'error');
        } finally {
            if (registerButton) {
                registerButton.disabled = false;
                registerButton.textContent = 'Registrarse';
                registerButton.style.cursor = 'pointer';
            }
        }
    };

    window.iniciarSesion = async () => {
        const usuarioInput = document.getElementById('usuarioInput');
        const passwordInput = document.getElementById('passwordInput');
        const loginButton = document.querySelector('.modal-content button[onclick="iniciarSesion()"]'); 

        const usuario = usuarioInput?.value.trim();
        const password = passwordInput?.value.trim();

        const savedUser = localStorage.getItem('username');
        const savedPassHash = localStorage.getItem('password');

        if (!usuario || !password) {
            showAppNotification('Complete todos los campos', 'warning');
            return;
        }

        if (loginButton) {
            loginButton.disabled = true;
            loginButton.textContent = 'Iniciando...';
            loginButton.style.cursor = 'wait';
        }

        try {
            const enteredPasswordHash = await hashString(password);

            if (usuario === savedUser && enteredPasswordHash === savedPassHash) {
                showAppNotification('Sesión iniciada correctamente', 'success');
                cerrarModalUsuario();

                const userIcon = document.querySelector('.user-menu .fa-user-circle');
                const userBtn = document.querySelector('.user-menu .usuariosBtn');
                if (userIcon) userIcon.style.color = 'var(--primary-color)';
                if (userBtn) {
                    userBtn.textContent = `Bienvenido, ${usuario}`;
                    userBtn.onclick = null; 
                }

                usuarioInput.value = '';
                passwordInput.value = '';
            } else {
                showAppNotification('Credenciales incorrectas', 'error');
                usuarioInput.value = '';
                passwordInput.value = '';
            }
        } catch (error) {
            console.error('Error during login:', error);
            showAppNotification('Error al iniciar sesión. Intente de nuevo.', 'error');
        } finally {
            if (loginButton) {
                loginButton.disabled = false;
                loginButton.textContent = 'Iniciar Sesión';
                loginButton.style.cursor = 'pointer';
            }
        }
    };
}