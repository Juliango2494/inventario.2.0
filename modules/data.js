class DataManager {
    constructor() {
        this.keys = {
            obras: 'obras_data',
            materiales: 'materiales_data',
            archivos: 'archivos_data',
            actividades: 'actividades_data',
            consumos: 'consumos_data'
        };
        this.init();
    }

    init() {
        if (!this.get('obras').length) {
            this.save('obras', [
                {
                    id: this.generateId('OB'),
                    codigo: 'OB-001',
                    nombre: 'Torre Central',
                    valor: 500000000,
                    progreso: 45,
                    estado: 'Activa',
                    objeto: 'Construcción edificio residencial',
                    duracion: 365,
                    fechaInicio: '2025-01-01'
                }
            ]);
        }

        if (!this.get('materiales').length) {
            this.save('materiales', [
                {
                    id: this.generateId('MAT'),
                    codigo: 'MAT-001',
                    nombre: 'Cemento Portland',
                    unidad: 'kg',
                    precio: 25000,
                    stock: 500,
                    minimo: 100
                }
            ]);
        }

        if (!this.get('actividades').length) {
            this.save('actividades', [
                {
                    id: this.generateId('ACT'), 
                    obraId: 'OB-001', 
                    nombre: 'Excavación',
                    fechaInicio: '2025-01-01',
                    fechaFin: '2025-01-05',
                    progreso: 100,
                    materiales: [
                        { materialId: 'MAT-001', cantidad: 50 }
                    ]
                }
            ]);
        }

        if (!this.get('archivos').length) {
            this.save('archivos', []);
        }

        if (!this.get('consumos').length) {
            this.save('consumos', []);
        }
    }

    generateId(prefix) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `${prefix}-${timestamp}-${random}`;
    }

    getObraById(id) {
        const obras = this.get('obras');
        return obras.find(o => o.id === id);
    }

    getMaterialById(id) {
        const materiales = this.get('materiales');
        return materiales.find(m => m.id === id);
    }

    getActividadesByObra(obraId) {
        const actividades = this.get('actividades');
        return actividades.filter(a => a.obraId === obraId);
    }

    getConsumosByMaterial(materialId) {
        const consumos = this.get('consumos');
        return consumos.filter(c => c.materialId === materialId);
    }

    save(key, data) {
        if (!Array.isArray(data)) {
            console.error(`Error: Data for key '${key}' must be an array.`);
            return;
        }
        try {
            localStorage.setItem(this.keys[key], JSON.stringify(data));
        } catch (e) {
            console.warn('Error guardando:', e);
        }
    }

    get(key) {
        try {
            const data = localStorage.getItem(this.keys[key]);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error obteniendo datos:', e);
            return [];
        }
    }

    add(type, item) {
        const data = this.get(type);

        let prefix;
        if (type === 'obras') prefix = 'OB';
        else if (type === 'materiales') prefix = 'MAT';
        else if (type === 'actividades') prefix = 'ACT'; 
        else if (type === 'archivos') prefix = 'ARCH';
        else if (type === 'consumos') prefix = 'CON'; 
        else prefix = 'ITEM';

        item.id = this.generateId(prefix);

        switch (type) {
            case 'obras':
                if (typeof item.nombre !== 'string' || typeof item.valor !== 'number' || typeof item.progreso !== 'number') {
                    console.error('Validation Error: Invalid data types for obra item.');
                    return null;
                }
                break;
            case 'materiales':
                if (typeof item.nombre !== 'string' || typeof item.precio !== 'number' || typeof item.stock !== 'number') {
                    console.error('Validation Error: Invalid data types for material item.');
                    return null;
                }
                break;
            case 'actividades':
                if (typeof item.obraId !== 'string' || typeof item.nombre !== 'string') {
                    console.error('Validation Error: Invalid data types for actividad item.');
                    return null;
                }
                if (!item.fechaInicio || !this.isValidDate(item.fechaInicio)) {
                    item.fechaInicio = new Date().toISOString().split('T')[0];
                }
                if (!item.fechaFin || !this.isValidDate(item.fechaFin)) {
                    const startDate = new Date(item.fechaInicio);
                    startDate.setDate(startDate.getDate() + 1);
                    item.fechaFin = startDate.toISOString().split('T')[0];
                }
                if (!Array.isArray(item.materiales)) {
                    item.materiales = [];
                }
                break;
        }


        data.push(item);
        this.save(type, data);
        return item;
    }

    isValidDate(dateString) {
        if (!dateString) return false;
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }

    delete(type, id) {
        const data = this.get(type);
        const filtered = data.filter(item => item.id !== id);
        this.save(type, filtered);
    }
}
window.DataManager = DataManager;

function deleteMaterial(id) {

    const dataManager = new DataManager(); 

    if (confirm('¿Eliminar este material?')) {
        dataManager.delete('materiales', id);
        // Assuming loadTables and notificationSystem are globally available or passed in
        if (typeof loadTables === 'function') {
            loadTables();
        } else {
            console.warn('loadTables function not found.');
        }
        if (typeof notificationSystem !== 'undefined' && typeof notificationSystem.show === 'function') {
            notificationSystem.show('Material eliminado', 'success');
        } else {
            console.warn('notificationSystem or its show method not found.');
        }
    }
}