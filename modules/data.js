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
        if (!this.get('obras')) {
            this.save('obras', [
                {
                    id: 'OB-001', 
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
        
        if (!this.get('materiales')) {
            this.save('materiales', [
                {id: 'MAT-001', codigo: 'MAT-001', nombre: 'Cemento Portland', 
                 unidad: 'kg', precio: 25000, stock: 500, minimo: 100}
            ]);
        }
        
        if (!this.get('actividades')) {
            this.save('actividades', [
                {
                    obraId: 'OB-001',
                    nombre: 'Excavación',
                    fechaInicio: '2025-01-01',
                    fechaFin: '2025-01-05',
                    progreso: 100,
                    materiales: [
                        {materialId: 'MAT-001', cantidad: 50}
                    ]
                }
            ]);
        }
        
        if (!this.get('archivos')) {
            this.save('archivos', []);
        }
        
        if (!this.get('consumos')) {
            this.save('consumos', []);
        }
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
            return [];
        }
    }
    add(type, item) {
        const data = this.get(type);
        const prefix = type === 'obras' ? 'OB' : type === 'materiales' ? 'MAT' : 'ARCH';
        item.id = `${prefix}-${String(data.length + 1).padStart(3, '0')}`;
        
        if (type === 'actividades') {
            if (!item.fechaInicio || !this.isValidDate(item.fechaInicio)) {
                item.fechaInicio = new Date().toISOString().split('T')[0];
            }
            if (!item.fechaFin || !this.isValidDate(item.fechaFin)) {
                const startDate = new Date(item.fechaInicio);
                startDate.setDate(startDate.getDate() + 1);
                item.fechaFin = startDate.toISOString().split('T')[0];
            }
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
    if (confirm('¿Eliminar este material?')) {
        dataManager.delete('materiales', id);
        loadTables();
        notificationSystem.show('Material eliminado', 'success');
    }
}