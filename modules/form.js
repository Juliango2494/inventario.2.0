const obraForm = document.querySelector('#obras .form-grid');
if (obraForm) {
    const nuevaObraBtn = document.querySelector('#obras .btn-primary');
    nuevaObraBtn.addEventListener('click', () => {
        const inputs = obraForm.querySelectorAll('.form-input');
        const values = Array.from(inputs).map(input => input.value.trim());
        
        if (values.some(val => val === '')) {
            notificationSystem.show('Por favor complete todos los campos', 'warning');
            return;
        }
        
        // Agregar nueva fila a la tabla
        const tbody = document.querySelector('#obras tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${values[0]}</td>
            <td>${values[1]}</td>
            <td>$${parseInt(values[3]).toLocaleString()}</td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                0%
            </td>
            <td><span class="badge badge-success">Activa</span></td>
            <td>
                <button class="btn btn-secondary">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-secondary">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tbody.appendChild(newRow);
        
        // Limpiar formulario
        inputs.forEach(input => input.value = '');
        notificationSystem.show('Obra registrada exitosamente', 'success');
    });
}

const materialForm = document.querySelector('#materiales .form-grid');
if (materialForm) {
    const nuevoMaterialBtn = document.querySelector('#materiales .btn-primary');
    nuevoMaterialBtn.addEventListener('click', () => {
        const inputs = materialForm.querySelectorAll('.form-input');
        const values = Array.from(inputs).map(input => input.value.trim());
        
        if (values.some(val => val === '' || val === 'Seleccionar unidad')) {
            notificationSystem.show('Por favor complete todos los campos', 'warning');
            return;
        }
        
        const tbody = document.querySelector('#materiales tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${values[0]}</td>
            <td>${values[1]}</td>
            <td>${values[2]}</td>
            <td>$${parseInt(values[3]).toLocaleString()}</td>
            <td>0 ${values[2]}</td>
            <td>
                <button class="btn btn-secondary">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-secondary">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(newRow);
        
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

document.addEventListener('click', (e) => {
    if (e.target.closest('.fa-trash')) {
        if (confirm('¿Está seguro de eliminar este material?')) {
            e.target.closest('tr').remove();
            notificationSystem.show('Material eliminado', 'success');
        }
    }
});

const analisisButtons = document.querySelectorAll('#ia .btn');
analisisButtons.forEach(btn => {
    if (btn.id !== 'sendChat') {
        btn.addEventListener('click', () => {
            const loadingText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analizando...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.innerHTML = loadingText;
                btn.disabled = false;
                
                const analysisType = btn.textContent.trim();
                let message = '';
                
                if (analysisType.includes('Presupuesto')) {
                    message = 'Análisis completado: Se detectaron 3 oportunidades de optimización que podrían generar un ahorro del 12%. Se recomienda revisar los precios de cemento y acero.';
                } else if (analysisType.includes('Logística')) {
                    message = 'Recomendación: Basándome en el cronograma actual, sugiero adelantar el pedido de varillas para la semana 3. Stock crítico detectado en cemento.';
                } else if (analysisType.includes('Riesgos')) {
                    message = 'Análisis de riesgos: Riesgo medio detectado en actividades de cimentación por posibles retrasos en permisos. Probabilidad de lluvia alta para las próximas 2 semanas.';
                }
                
                addMessage(message);
            }, 3000);
        });
    }
});

function updateStats() {
    const obrasCount = document.querySelectorAll('#obras tbody tr').length;
    const materialesCount = document.querySelectorAll('#materiales tbody tr').length;
    const alertasCount = Math.floor(Math.random() * 15) + 5;
    
    document.querySelector('.stat-card .stat-number').textContent = obrasCount;
    document.querySelector('.stat-card.secondary .stat-number').textContent = materialesCount;
    document.querySelector('.stat-card.warning .stat-number').textContent = alertasCount;
}

setInterval(updateStats, 30000);
