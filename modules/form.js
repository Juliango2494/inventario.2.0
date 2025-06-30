function setupForms() {
    // Formulario de obras
    const obraBtn = document.querySelector('#obras .btn-primary');
    if (obraBtn) {
        obraBtn.addEventListener('click', () => {
            const inputs = document.querySelectorAll('#obras .form-input');
            const values = Array.from(inputs).map(i => i.value.trim());
            
            if (values.some(v => !v)) {
                notificationSystem.show('Complete todos los campos', 'warning');
                return;
            }
            
            const obra = {
                codigo: values[0], nombre: values[1], objeto: values[2],
                valor: parseInt(values[3]), duracion: parseInt(values[4]),
                fechaInicio: values[5], progreso: 0, estado: 'Activa'
            };
            
            dataManager.add('obras', obra);
            inputs.forEach(i => i.value = '');
            loadTables();
            notificationSystem.show('Obra registrada', 'success');
        });
    }
    
    // Formulario de materiales
    const materialBtn = document.querySelector('#materiales .btn-primary');
    if (materialBtn) {
        materialBtn.addEventListener('click', () => {
            const inputs = document.querySelectorAll('#materiales .form-input');
            const values = Array.from(inputs).map(i => i.value.trim());
            
            if (values.some(v => !v || v === 'Seleccionar unidad')) {
                notificationSystem.show('Complete todos los campos', 'warning');
                return;
            }
            
            const material = {
                codigo: values[0], nombre: values[1], unidad: values[2],
                precio: parseInt(values[3]), stock: 0
            };
            
            dataManager.add('materiales', material);
            inputs.forEach(i => i.tagName === 'SELECT' ? i.selectedIndex = 0 : i.value = '');
            loadTables();
            notificationSystem.show('Material registrado', 'success');
        });
    }
}