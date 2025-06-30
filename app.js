let notificationSystem, dataManager;

function initializeApp() {
    // notificationSystem = new NotificationSystem();
    // dataManager = new DataManager();
    
    setupTabs();
    // setupForms();
    // setupFileUpload();
    setupAuth(); 
    // setupCalendar();
    // setupChat();
    loadTables();
    updateStats();
    
    console.log('ObraSmart v1.0 - Inicializado');
}

function setupTabs() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            if (targetTab !== 'inicio') loadTables();
        });
    });
}

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
            alert('Usuario registrado exitosamente');
            cerrarModalReg();
            
            document.getElementById('usuarioIn').value = '';
            document.getElementById('passwordIn').value = '';
            document.getElementById('emailIn').value = '';
        } else {
            alert('Complete todos los campos');
        }
    };
    
    window.iniciarSesion = () => {
        const usuario = document.getElementById('usuarioInput')?.value.trim();
        const password = document.getElementById('passwordInput')?.value.trim();
        const savedUser = localStorage.getItem('username');
        const savedPass = localStorage.getItem('password');
        
        if (usuario === savedUser && password === savedPass) {
            alert('Sesión iniciada correctamente');
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
            alert('Credenciales incorrectas');
            document.getElementById('usuarioInput').value = '';
            document.getElementById('passwordInput').value = '';
        }
    };
}

function loadTables() {
    loadObrasTable();
    loadMaterialesTable();
    loadArchivosTable();
    updateStats();
}

function loadObrasTable() {
    const tbody = document.querySelector('#obras tbody');
    if (!tbody) return;
    
    const obras = []; 
    tbody.innerHTML = obras.map(obra => `
        <tr>
            <td>${obra.codigo}</td>
            <td>${obra.nombre}</td>
            <td>$${obra.valor.toLocaleString()}</td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${obra.progreso}%"></div>
                </div>
                ${obra.progreso}%
            </td>
            <td><span class="badge badge-success">${obra.estado}</span></td>
            <td>
                <button class="btn btn-secondary"><i class="fas fa-eye"></i></button>
                <button class="btn btn-secondary"><i class="fas fa-edit"></i></button>
            </td>
        </tr>
    `).join('');
}

function loadMaterialesTable() {
    const tbody = document.querySelector('#materiales tbody');
    if (!tbody) return;
    
    const materiales = []; // temporal
    tbody.innerHTML = materiales.map(material => `
        <tr>
            <td>${material.codigo}</td>
            <td>${material.nombre}</td>
            <td>${material.unidad}</td>
            <td>$${material.precio.toLocaleString()}</td>
            <td>${material.stock} ${material.unidad}</td>
            <td>
                <button class="btn btn-secondary"><i class="fas fa-edit"></i></button>
                <button class="btn btn-secondary" onclick="deleteMaterial('${material.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function loadArchivosTable() {
    const tbody = document.querySelector('#archivos tbody');
    if (!tbody) return;
    
    const archivos = []; // temporal
    tbody.innerHTML = archivos.map(archivo => `
        <tr>
            <td>${archivo.nombre}</td>
            <td>${archivo.tipo}</td>
            <td>${archivo.fecha}</td>
            <td><span class="badge badge-success">Procesado</span></td>
            <td>
                <button class="btn btn-secondary"><i class="fas fa-download"></i></button>
                <button class="btn btn-secondary"><i class="fas fa-eye"></i></button>
            </td>
        </tr>
    `).join('');
}

function updateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    if (stats[0]) stats[0].textContent = 0;
    if (stats[1]) stats[1].textContent = 0;
    if (stats[2]) stats[2].textContent = Math.floor(Math.random() * 15) + 5;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}