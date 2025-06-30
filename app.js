import { NotificationSystem } from './notification.js';
import { DataManager } from './data.js';
import { setupForms } from './form.js';
import { setupFileUpload } from './uploadFile.js';
import { setupAuth } from './auth.js';
import { setupCalendar } from './calendar.js';
import { setupChat } from './chat.js';
let notificationSystem, dataManager;

export { loadTables, notificationSystem, dataManager };

function initializeApp() {
    notificationSystem = new NotificationSystem();
    dataManager = new DataManager();
    
    setupTabs();
    setupForms();
    setupFileUpload();
    setupAuth();
    setupCalendar();
    setupChat();
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
function loadTables() {
    loadObrasTable();
    loadMaterialesTable();
    loadArchivosTable();
    updateStats();
}

function loadObrasTable() {
    const tbody = document.querySelector('#obras tbody');
    if (!tbody) return;
    
    const obras = dataManager.get('obras');
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
    
    const materiales = dataManager.get('materiales');
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
    
    const archivos = dataManager.get('archivos');
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
    const obras = dataManager.get('obras');
    const materiales = dataManager.get('materiales');
    const stats = document.querySelectorAll('.stat-number');
    
    if (stats[0]) stats[0].textContent = obras.filter(o => o.estado === 'Activa').length;
    if (stats[1]) stats[1].textContent = materiales.length;
    if (stats[2]) stats[2].textContent = Math.floor(Math.random() * 15) + 5;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}