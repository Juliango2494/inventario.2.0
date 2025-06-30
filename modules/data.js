class DataStorage {
    constructor() {
        this.storageKeys = {
            obras: 'obrasmart_obras',
            materiales: 'obrasmart_materiales',
            archivos: 'obrasmart_archivos',
            eventos: 'obrasmart_eventos',
            configuracion: 'obrasmart_config'
        };
        this.initializeStorage();
    }

    // Inicializar datos por defecto si no existen
    initializeStorage() {
        if (!this.getData('obras')) {
            this.saveData('obras', [
                {
                    id: 'OB-001',
                    codigo: 'OB-001',
                    nombre: 'Torre Residencial Central',
                    objeto: 'Construcción edificio residencial',
                    valor: 500000000,
                    duracion: 365,
                    fechaInicio: '2025-01-15',
                    progreso: 45,
                    estado: 'Activa'
                },
                {
                    id: 'OB-002',
                    codigo: 'OB-002',
                    nombre: 'Centro Comercial Norte',
                    objeto: 'Construcción centro comercial',
                    valor: 750000000,
                    duracion: 400,
                    fechaInicio: '2024-10-01',
                    progreso: 78,
                    estado: 'Activa'
                }
            ]);
        }

        if (!this.getData('materiales')) {
            this.saveData('materiales', [
                {
                    id: 'MAT-001',
                    codigo: 'MAT-001',
                    nombre: 'Cemento Portland',
                    unidad: 'kg',
                    precio: 25000,
                    stock: 500
                },
                {
                    id: 'MAT-002',
                    codigo: 'MAT-002',
                    nombre: 'Varilla #4',
                    unidad: 'unidad',
                    precio: 15000,
                    stock: 200
                }
            ]);
        }

        if (!this.getData('archivos')) {
            this.saveData('archivos', [
                {
                    id: 'ARCH-001',
                    nombre: 'presupuesto_torre_central.xlsx',
                    tipo: 'Presupuesto',
                    fecha: '2025-06-08',
                    estado: 'Procesado'
                }
            ]);
        }

        if (!this.getData('eventos')) {
            this.saveData('eventos', [
                {
                    id: 'EV-001',
                    fecha: '2025-06-12',
                    titulo: 'Entrega de materiales',
                    obra: 'Torre Residencial',
                    tipo: 'Entrega'
                },
                {
                    id: 'EV-002',
                    fecha: '2025-06-15',
                    titulo: 'Revisión de calidad',
                    obra: 'Centro Comercial',
                    tipo: 'Inspección'
                }
            ]);
        }
    }

    saveData(key, data) {
        try {
            localStorage.setItem(this.storageKeys[key], JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error guardando datos:', error);
            return false;
        }
    }

    getData(key) {
        try {
            const data = localStorage.getItem(this.storageKeys[key]);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error obteniendo datos:', error);
            return null;
        }
    }

    addObra(obra) {
        const obras = this.getData('obras') || [];
        obra.id = `OB-${String(obras.length + 1).padStart(3, '0')}`;
        obra.progreso = 0;
        obra.estado = 'Activa';
        obras.push(obra);
        this.saveData('obras', obras);
        return obra;
    }

    addMaterial(material) {
        const materiales = this.getData('materiales') || [];
        material.id = `MAT-${String(materiales.length + 1).padStart(3, '0')}`;
        material.stock = 0;
        materiales.push(material);
        this.saveData('materiales', materiales);
        return material;
    }

    deleteMaterial(id) {
        const materiales = this.getData('materiales') || [];
        const updatedMateriales = materiales.filter(m => m.id !== id);
        this.saveData('materiales', updatedMateriales);
        return true;
    }

    addArchivo(archivo) {
        const archivos = this.getData('archivos') || [];
        archivo.id = `ARCH-${String(archivos.length + 1).padStart(3, '0')}`;
        archivo.fecha = new Date().toISOString().split('T')[0];
        archivo.estado = 'Procesado';
        archivos.push(archivo);
        this.saveData('archivos', archivos);
        return archivo;
    }

    updateObraProgress(id, progreso) {
        const obras = this.getData('obras') || [];
        const obra = obras.find(o => o.id === id);
        if (obra) {
            obra.progreso = progreso;
            this.saveData('obras', obras);
            return true;
        }
        return false;
    }

    getStats() {
        const obras = this.getData('obras') || [];
        const materiales = this.getData('materiales') || [];
        const eventos = this.getData('eventos') || [];
        
        return {
            obrasActivas: obras.filter(o => o.estado === 'Activa').length,
            totalMateriales: materiales.length,
            alertasPendientes: Math.floor(Math.random() * 15) + 5
        };
    }
}

const dataStorage = new DataStorage();

function loadObrasTable() {
    const tbody = document.querySelector('#obras tbody');
    const obras = dataStorage.getData('obras') || [];
    
    tbody.innerHTML = '';
    obras.forEach(obra => {
        const row = document.createElement('tr');
        row.innerHTML = `
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
                <button class="btn btn-secondary">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-secondary">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadMaterialesTable() {
    const tbody = document.querySelector('#materiales tbody');
    const materiales = dataStorage.getData('materiales') || [];
    
    tbody.innerHTML = '';
    materiales.forEach(material => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${material.codigo}</td>
            <td>${material.nombre}</td>
            <td>${material.unidad}</td>
            <td>$${material.precio.toLocaleString()}</td>
            <td>${material.stock} ${material.unidad}</td>
            <td>
                <button class="btn btn-secondary">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-secondary" onclick="deleteMaterial('${material.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadArchivosTable() {
    const tbody = document.querySelector('#archivos tbody');
    const archivos = dataStorage.getData('archivos') || [];
    
    tbody.innerHTML = '';
    archivos.forEach(archivo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${archivo.nombre}</td>
            <td>${archivo.tipo}</td>
            <td>${archivo.fecha}</td>
            <td><span class="badge badge-success">${archivo.estado}</span></td>
            <td>
                <button class="btn btn-secondary">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn btn-secondary">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadEventosTable() {
    const tbody = document.querySelector('#calendario tbody');
    const eventos = dataStorage.getData('eventos') || [];
    
    if (tbody) {
        tbody.innerHTML = '';
        eventos.forEach(evento => {
            const row = document.createElement('tr');
            const badgeClass = evento.tipo === 'Entrega' ? 'badge-success' : 'badge-warning';
            row.innerHTML = `
                <td>${evento.fecha}</td>
                <td>${evento.titulo}</td>
                <td>${evento.obra}</td>
                <td><span class="badge ${badgeClass}">${evento.tipo}</span></td>
            `;
            tbody.appendChild(row);
        });
    }
}

function updateStatsFromStorage() {
    const stats = dataStorage.getStats();
    const statCards = document.querySelectorAll('.stat-number');
    
    if (statCards[0]) statCards[0].textContent = stats.obrasActivas;
    if (statCards[1]) statCards[1].textContent = stats.totalMateriales;
    if (statCards[2]) statCards[2].textContent = stats.alertasPendientes;
}

function deleteMaterial(id) {
    if (confirm('¿Está seguro de eliminar este material?')) {
        dataStorage.deleteMaterial(id);
        loadMaterialesTable();
        updateStatsFromStorage();
        notificationSystem.show('Material eliminado exitosamente', 'success');
    }
}

const originalObraHandler = document.querySelector('#obras .btn-primary');
if (originalObraHandler) {
    originalObraHandler.replaceWith(originalObraHandler.cloneNode(true));
    document.querySelector('#obras .btn-primary').addEventListener('click', () => {
        const inputs = document.querySelectorAll('#obras .form-input');
        const values = Array.from(inputs).map(input => input.value.trim());
        
        if (values.some(val => val === '')) {
            notificationSystem.show('Por favor complete todos los campos', 'warning');
            return;
        }
        
        const nuevaObra = {
            codigo: values[0],
            nombre: values[1],
            objeto: values[2],
            valor: parseInt(values[3]),
            duracion: parseInt(values[4]),
            fechaInicio: values[5]
        };
        
        dataStorage.addObra(nuevaObra);
        loadObrasTable();
        updateStatsFromStorage();
        
        inputs.forEach(input => input.value = '');
        notificationSystem.show('Obra registrada exitosamente', 'success');
    });
}

const originalMaterialHandler = document.querySelector('#materiales .btn-primary');
if (originalMaterialHandler) {
    originalMaterialHandler.replaceWith(originalMaterialHandler.cloneNode(true));
    document.querySelector('#materiales .btn-primary').addEventListener('click', () => {
        const inputs = document.querySelectorAll('#materiales .form-input');
        const values = Array.from(inputs).map(input => input.value.trim());
        
        if (values.some(val => val === '' || val === 'Seleccionar unidad')) {
            notificationSystem.show('Por favor complete todos los campos', 'warning');
            return;
        }
        
        const nuevoMaterial = {
            codigo: values[0],
            nombre: values[1],
            unidad: values[2],
            precio: parseInt(values[3])
        };
        
        dataStorage.addMaterial(nuevoMaterial);
        loadMaterialesTable();
        updateStatsFromStorage();
        
        inputs.forEach(input => {
            if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            } else {
                input.value = '';
            }
        });
        notificationSystem.show('Material registrado exitosamente', 'success');
    });
}

function handleFileUploadWithStorage(file, area) {
    const icon = area.querySelector('.upload-icon');
    const text = area.querySelector('p');
    
    icon.className = 'fas fa-check-circle upload-icon';
    icon.style.color = 'var(--accent-color)';
    text.textContent = `Archivo cargado: ${file.name}`;
    
    // Determinar tipo de archivo
    let tipo = 'Documento';
    if (area.id === 'presupuesto-upload') {
        tipo = 'Presupuesto';
    } else if (area.id === 'programacion-upload') {
        tipo = 'Programación';
    }
    
    // Guardar en localStorage
    const nuevoArchivo = {
        nombre: file.name,
        tipo: tipo
    };
    
    dataStorage.addArchivo(nuevoArchivo);
    loadArchivosTable();
    
    setTimeout(() => {
        notificationSystem.show('Archivo cargado y guardado exitosamente', 'success');
    }, 1000);
}

window.handleFileUpload = handleFileUploadWithStorage;

document.addEventListener('DOMContentLoaded', () => {
    loadObrasTable();
    loadMaterialesTable();
    loadArchivosTable();
    loadEventosTable();
    updateStatsFromStorage();
});

document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        setTimeout(() => {
            if (targetTab === 'obras') loadObrasTable();
            if (targetTab === 'materiales') loadMaterialesTable();
            if (targetTab === 'archivos') loadArchivosTable();
            if (targetTab === 'calendario') loadEventosTable();
            if (targetTab === 'inicio') updateStatsFromStorage();
        }, 100);
    });
});
class DataManager {
    constructor() {
        this.storageKeys = {
            obras: 'obrasmart_obras',
            materiales: 'obrasmart_materiales',
            archivos: 'obrasmart_archivos',
            eventos: 'obrasmart_eventos'
        };
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem(this.storageKeys.obras)) {
            this.saveData('obras', [
                {
                    id: 'OB-001',
                    codigo: 'OB-001',
                    nombre: 'Torre Residencial Central',
                    valor: 500000000,
                    progreso: 45,
                    estado: 'Activa'
                }
            ]);
        }
    }

    saveData(key, data) {
        try {
            localStorage.setItem(this.storageKeys[key], JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error guardando datos:', error);
            this[key] = data;
            return false;
        }
    }

    getData(key) {
        try {
            const data = localStorage.getItem(this.storageKeys[key]);
            return data ? JSON.parse(data) : (this[key] || null);
        } catch (error) {
            console.error('Error obteniendo datos:', error);
            return this[key] || null;
        }
    }
}

window.dataManager = new DataManager();

function deleteMaterial(id) {
    if (confirm('¿Está seguro de eliminar este material?')) {
        const materiales = window.dataManager.getData('materiales') || [];
        const updated = materiales.filter(m => m.id !== id);
        window.dataManager.saveData('materiales', updated);
        loadMaterialesTable();
        window.notificationSystem.show('Material eliminado exitosamente', 'success');
    }
}


window.handleFileUpload = function(file, area) {
    const icon = area.querySelector('.upload-icon');
    const text = area.querySelector('p');
    
    if (icon && text) {
        icon.className = 'fas fa-check-circle upload-icon';
        icon.style.color = 'var(--accent-color)';
        text.textContent = `Archivo cargado: ${file.name}`;
        
        setTimeout(() => {
            window.notificationSystem.show('Archivo cargado exitosamente', 'success');
        }, 1000);
    }
};

console.log('localStorage funcionando');