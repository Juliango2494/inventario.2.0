class DataManager {
    constructor() {
        this.keys = {
            obras: 'obras_data',
            materiales: 'materiales_data',
            archivos: 'archivos_data'
        };
        this.init();
    }
    
    init() {
        // Datos iniciales si no existen
        if (!this.get('obras')) {
            this.save('obras', [
                {id: 'OB-001', codigo: 'OB-001', nombre: 'Torre Central', 
                 valor: 500000000, progreso: 45, estado: 'Activa'}
            ]);
        }
        if (!this.get('materiales')) {
            this.save('materiales', [
                {id: 'MAT-001', codigo: 'MAT-001', nombre: 'Cemento Portland', 
                 unidad: 'kg', precio: 25000, stock: 500}
            ]);
        }
        if (!this.get('archivos')) {
            this.save('archivos', []);
        }
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
        data.push(item);
        this.save(type, data);
        return item;
    }
    
    delete(type, id) {
        const data = this.get(type);
        const filtered = data.filter(item => item.id !== id);
        this.save(type, filtered);
    }
}
function deleteMaterial(id) {
    if (confirm('¿Eliminar este material?')) {
        dataManager.delete('materiales', id);
        loadTables();
        notificationSystem.show('Material eliminado', 'success');
    }
}