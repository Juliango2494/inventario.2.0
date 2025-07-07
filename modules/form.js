function setupForms() {
    try {
        if (!window.dataManager) {
            throw new Error('DataManager no está disponible');
        }


        const obraBtn = document.querySelector('#obras .btn-primary');
        if (obraBtn) {
            obraBtn.innerHTML = '<i class="fas fa-plus"></i> Nueva Obra';
            obraBtn.onclick = () => {
            };
            obraBtn.addEventListener('click', () => {
                const inputs = document.querySelectorAll('#obras .form-input');
                const values = Array.from(inputs).map(i => i.value.trim());
                
                if (values.some(v => !v)) {
                    showAlert('Complete todos los campos', 'warning');
                    return;
                }
                
                const obra = {
                    codigo: values[0], 
                    nombre: values[1], 
                    objeto: values[2],
                    valor: parseInt(values[3]), 
                    duracion: parseInt(values[4]),
                    fechaInicio: values[5], 
                    progreso: 0, 
                    estado: 'Activa'
                };
                
                window.dataManager.add('obras', obra);
                inputs.forEach(i => i.value = '');
                window.loadTables();
                showAlert('Obra registrada', 'success');
            });
        }
        
        const materialBtn = document.querySelector('#materiales .btn-primary');
        if (materialBtn) {
            materialBtn.innerHTML = '<i class="fas fa-plus"></i> Nuevo Material';
            materialBtn.onclick = () => {
            };
            materialBtn.addEventListener('click', () => {
                const inputs = document.querySelectorAll('#materiales .form-input');
                const values = Array.from(inputs).map(i => i.value.trim());
                const select = document.querySelector('#materiales select');
                
                if (values.some(v => !v) || !select.value || select.value === 'Seleccionar unidad') {
                    showAlert('Complete todos los campos', 'warning');
                    return;
                }
                
                const material = {
                    codigo: values[0], 
                    nombre: values[1], 
                    unidad: select.value,
                    precio: parseInt(values[2]), 
                    stock: 0,
                    minimo: 0
                };
                
                window.dataManager.add('materiales', material);
                inputs.forEach(i => i.value = '');
                select.selectedIndex = 0;
                window.loadTables();
                showAlert('Material registrado', 'success');
            });
        }
        
        const actividadBtn = document.querySelector('#actividades .btn-primary');
        if (actividadBtn) {
            actividadBtn.addEventListener('click', () => {
                const obraSelect = document.getElementById('obra-select');
                const nombreActividad = document.getElementById('nombre-actividad');
                const fechaInicio = document.getElementById('fecha-inicio-actividad');
                const fechaFin = document.getElementById('fecha-fin-actividad');
                
                if (!obraSelect.value || !nombreActividad.value || !fechaInicio.value || !fechaFin.value) {
                    showAlert('Complete todos los campos', 'warning');
                    return;
                }
                
                const actividad = {
                    obraId: obraSelect.value,
                    nombre: nombreActividad.value,
                    fechaInicio: fechaInicio.value,
                    fechaFin: fechaFin.value,
                    progreso: 0,
                    materiales: []
                };
                
                window.dataManager.add('actividades', actividad);
                nombreActividad.value = '';
                fechaInicio.value = '';
                fechaFin.value = '';
                window.loadTables();
                showAlert('Actividad registrada', 'success');
            });
        }
        
        } catch (error) {
            console.error('Error al configurar formularios:', error);
            showAlert('Error al configurar formularios', 'error');
        }
    }
