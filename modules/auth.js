function setupAuth() {
    window.abrirModalUsuario = () => document.getElementById('modalUsr').style.display = 'block';
    window.cerrarModalUsuario = () => document.getElementById('modalUsr').style.display = 'none';
    window.abrirModalReg = () => document.getElementById('modalReg').style.display = 'block';
    window.cerrarModalReg = () => document.getElementById('modalReg').style.display = 'none';

    async function hashString(str) {
        const textEncoder = new TextEncoder();
        const data = textEncoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashedPassword;
    }

    window.registrar = async () => {
        const usuario = document.getElementById('usuarioIn')?.value;
        const password = document.getElementById('passwordIn')?.value;
        const email = document.getElementById('emailIn')?.value;

        if (usuario && password && email) {
            const hashedPassword = await hashString(password); 

            localStorage.setItem('username', usuario);
            localStorage.setItem('password', hashedPassword); 
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

    window.iniciarSesion = async () => { 
        const usuario = document.getElementById('usuarioInput')?.value.trim();
        const password = document.getElementById('passwordInput')?.value.trim();
        const savedUser = localStorage.getItem('username');
        const savedPassHash = localStorage.getItem('password'); 

        if (usuario && password) {
            const enteredPasswordHash = await hashString(password); 

            if (usuario === savedUser && enteredPasswordHash === savedPassHash) { 
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
        } else {
             if (window.notificationSystem) {
                window.notificationSystem.show('Complete todos los campos', 'warning');
            } else {
                alert('Complete todos los campos');
            }
        }
    };
}