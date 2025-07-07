let notificationSystem, dataManager;

function initializeApp() {
    if (typeof DataManager === 'undefined' || typeof NotificationSystem === 'undefined') {
        console.error('Dependencias no cargadas! Reintentando...');
        setTimeout(initializeApp, 100);
        return;
    }

    try {
        dataManager = new DataManager();
        notificationSystem = new NotificationSystem();
        
        window.dataManager = window.dataManager || dataManager;
        window.notificationSystem = window.notificationSystem || notificationSystem;

        setupTabs();
        setupForms();
        setupFileUpload();
        setupAuth(); 
        setupCalendar();
        setupChat();
        setupGantt();
        setupQuickActions();
        
        if (dataManager && typeof dataManager.get === 'function') {
            loadTables();
            updateStats();
            console.log('Aplicación inicializada correctamente');
        } else {
            console.error('Error: DataManager no funciona correctamente');
            throw new Error('DataManager no funciona correctamente');
        }
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        if (notificationSystem) {
            notificationSystem.show('Error al inicializar la aplicación', 'error');
        }
    }
}

function loadTables() {
    if (!dataManager || typeof dataManager.get !== 'function') {
        console.error('DataManager no disponible para loadTables');
        return;
    }
    
    loadObrasTable();
    loadMaterialesTable();
    loadArchivosTable();
    loadActividadesTable();
    updateStats();
    checkMaterialAlerts();
}

function loadObrasTable() {
    try {
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
                    <button class="btn btn-secondary view-gantt" data-obra="${obra.id}">
                        <i class="fas fa-chart-gantt"></i> Gantt
                    </button>
                    <button class="btn btn-secondary" onclick="editObra('${obra.id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </td>
            </tr>
        `).join('');
        
        // Configurar eventos Gantt
        setupGantt();
    } catch (error) {
        console.error('Error cargando tabla de obras:', error);
        if (notificationSystem) {
            notificationSystem.show('Error al cargar tabla de obras', 'error');
        }
    }
}
function loadMaterialesTable() {
    try {
        const tbody = document.querySelector('#materiales tbody');
        if (!tbody) return;
        
        const materiales = dataManager.get('materiales'); 
        tbody.innerHTML = materiales.map(material => {
            const precio = material.precio !== null ? Number(material.precio) : 0;
            
            return `
                <tr>
                    <td>${material.codigo || ''}</td>
                    <td>${material.nombre || ''}</td>
                    <td>${material.unidad || ''}</td>
                    <td>$${precio.toLocaleString()}</td>
                    <td>${material.stock || 0} ${material.unidad || ''}</td>
                    <td>
                        <button class="btn btn-secondary" onclick="editMaterial('${material.id}')">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-secondary" onclick="deleteMaterial('${material.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error cargando tabla de materiales:', error);
        if (notificationSystem) {
            notificationSystem.show('Error al cargar tabla de materiales', 'error');
        }
    }
}

function loadArchivosTable() {
    try {
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
    } catch (error) {
        console.error('Error cargando tabla de archivos:', error);
        if (notificationSystem) {
            notificationSystem.show('Error al cargar tabla de archivos', 'error');
        }
    }
}

function loadActividadesTable() {
    try {
        const tbody = document.querySelector('#actividades tbody');
        if (!tbody) return;
        
        const actividades = dataManager.get('actividades');
        const obras = dataManager.get('obras');
        
        tbody.innerHTML = actividades.map(actividad => {
            const obra = obras.find(o => o.id === actividad.obraId);
            return `
                <tr>
                    <td>${obra ? obra.nombre : 'Desconocida'}</td>
                    <td>${actividad.nombre}</td>
                    <td>${actividad.fechaInicio}</td>
                    <td>${actividad.fechaFin}</td>
                    <td>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${actividad.progreso}%"></div>
                        </div>
                        ${actividad.progreso}%
                    </td>
                    <td>
                        <button class="btn btn-secondary" onclick="viewActivityDetails('${actividad.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-secondary">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error cargando tabla de actividades:', error);
        if (notificationSystem) {
            notificationSystem.show('Error al cargar tabla de actividades', 'error');
        }
    }
}
function editObra(obraId) {
    try {
        const obra = dataManager.getObraById(obraId);
        if (!obra) {
            throw new Error('Obra no encontrada');
        }

        const inputs = document.querySelectorAll('#obras .form-input');
        inputs[0].value = obra.codigo;
        inputs[1].value = obra.nombre;
        inputs[2].value = obra.objeto;
        inputs[3].value = obra.valor;
        inputs[4].value = obra.duracion;
        inputs[5].value = obra.fechaInicio;

        const obraBtn = document.querySelector('#obras .btn-primary');
        obraBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
        obraBtn.onclick = () => saveObraChanges(obraId);

        if (notificationSystem) {
            notificationSystem.show(`Editando obra: ${obra.nombre}`, 'info');
        }
    } catch (error) {
        console.error('Error al editar obra:', error);
        if (notificationSystem) {
            notificationSystem.show('Error al editar obra', 'error');
        }
    }
}
function editMaterial(materialId) {
    try {
        const material = dataManager.getMaterialById(materialId);
        if (!material) {
            throw new Error('Material no encontrado');
        }

        const inputs = document.querySelectorAll('#materiales .form-input');
        inputs[0].value = material.codigo;
        inputs[1].value = material.nombre;
        inputs[2].value = material.precio;
        
        const select = document.querySelector('#materiales select');
        if (select) {
            select.value = material.unidad || 'Seleccionar unidad';
        }

        const materialBtn = document.querySelector('#materiales .btn-primary');
        materialBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
        materialBtn.onclick = () => saveMaterialChanges(materialId);

        if (notificationSystem) {
            notificationSystem.show(`Editando material: ${material.nombre}`, 'info');
        }
    } catch (error) {
        console.error('Error al editar material:', error);
        if (notificationSystem) {
            notificationSystem.show('Error al editar material', 'error');
        }
    }
}
function saveMaterialChanges(materialId) {
    try {
        const material = dataManager.getMaterialById(materialId);
        if (!material) {
            throw new Error('Material no encontrado');
        }

        const inputs = document.querySelectorAll('#materiales .form-input');
        const values = Array.from(inputs).map(i => i.value.trim());
        const select = document.querySelector('#materiales select');
        
        if (values.some(v => !v) || !select.value || select.value === 'Seleccionar unidad') {
            showAlert('Complete todos los campos', 'warning');
            return;
        }
        
        material.codigo = values[0];
        material.nombre = values[1];
        material.unidad = select.value;
        material.precio = parseInt(values[2]);
        
        dataManager.save('materiales', dataManager.get('materiales'));
        
        const materialBtn = document.querySelector('#materiales .btn-primary');
        materialBtn.innerHTML = '<i class="fas fa-plus"></i> Nuevo Material';
        materialBtn.onclick = () => setupForms(); 
        
        inputs.forEach(i => i.value = '');
        select.selectedIndex = 0;
        
        loadTables();
        showAlert('Cambios guardados exitosamente', 'success');
    } catch (error) {
        console.error('Error al guardar cambios de material:', error);
        showAlert('Error al guardar cambios', 'error');
    }
}
function saveObraChanges(obraId) {
    try {
        const obra = dataManager.getObraById(obraId);
        if (!obra) {
            throw new Error('Obra no encontrada');
        }

        const inputs = document.querySelectorAll('#obras .form-input');
        const values = Array.from(inputs).map(i => i.value.trim());
        
        if (values.some(v => !v)) {
            showAlert('Complete todos los campos', 'warning');
            return;
        }
        
        obra.codigo = values[0];
        obra.nombre = values[1]; 
        obra.objeto = values[2];
        obra.valor = parseInt(values[3]);
        obra.duracion = parseInt(values[4]);
        obra.fechaInicio = values[5];
        
        dataManager.save('obras', dataManager.get('obras'));
        
        const obraBtn = document.querySelector('#obras .btn-primary');
        obraBtn.innerHTML = '<i class="fas fa-plus"></i> Nueva Obra';
        obraBtn.onclick = () => setupForms(); 
        
        loadTables();
        showAlert('Cambios guardados exitosamente', 'success');
    } catch (error) {
        console.error('Error al guardar cambios de obra:', error);
        showAlert('Error al guardar cambios', 'error');
    }
}

function updateStats() {
    try {
        const stats = document.querySelectorAll('.stat-number');
        const obras = dataManager.get('obras').length;
        const materiales = dataManager.get('materiales').length;
        const alertas = dataManager.get('materiales').filter(m => m.stock < (m.minimo || 10)).length;
        
        if (stats[0]) stats[0].textContent = obras;
        if (stats[1]) stats[1].textContent = materiales;
        if (stats[2]) stats[2].textContent = alertas;
    } catch (error) {
        console.error('Error actualizando estadísticas:', error);
    }
}

function checkMaterialAlerts() {
    try {
        const materiales = dataManager.get('materiales');
        const alertas = [];
        
        materiales.forEach(material => {
            if (material.stock < (material.minimo || 10)) {
                alertas.push({
                    type: 'warning',
                    message: `Stock bajo de ${material.nombre} (${material.stock} ${material.unidad})`,
                    action: `Comprar más ${material.nombre}`
                });
            }
        });
        
        if (alertas.length > 0) {
            const notificationCount = document.getElementById('notificationCount');
            if (notificationCount) {
                notificationCount.textContent = alertas.length;
                notificationCount.style.display = 'flex';
            }
        } else {
            const notificationCount = document.getElementById('notificationCount');
            if (notificationCount) {
                notificationCount.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error verificando alertas de materiales:', error);
    }
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

function setupQuickActions() {
    document.querySelectorAll('.quick-action').forEach(action => {
        action.addEventListener('click', function() {
            const actionType = this.getAttribute('data-action');
            
            switch(actionType) {
                case 'nueva-obra':
                    document.querySelector('[data-tab="obras"]').click();
                    break;
                    
                case 'agregar-material':
                    document.querySelector('[data-tab="materiales"]').click();
                    break;
                    
                case 'consultar-ia':
                    document.querySelector('[data-tab="ia"]').click();
                    break;
                    
                case 'cargar-archivo':
                    document.querySelector('[data-tab="archivos"]').click();
                    break;
            }
            
            if (notificationSystem) {
                notificationSystem.show(`Acción rápida: ${this.querySelector('h3').textContent}`, 'info');
            }
        });
    });
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}