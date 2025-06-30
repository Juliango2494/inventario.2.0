function setupFileUpload() {
    document.querySelectorAll('.upload-area').forEach(area => {
        const fileInput = area.querySelector('input[type="file"]');
        if (!fileInput) return;
        
        area.addEventListener('click', () => fileInput.click());
        
        area.addEventListener('dragover', (e) => {
            e.preventDefault();
            area.style.borderColor = 'var(--primary-color)';
        });
        
        area.addEventListener('dragleave', () => {
            area.style.borderColor = 'var(--border)';
        });
        
        area.addEventListener('drop', (e) => {
            e.preventDefault();
            if (e.dataTransfer.files.length > 0) {
                handleFileUpload(e.dataTransfer.files[0], area);
            }
            area.style.borderColor = 'var(--border)';
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileUpload(e.target.files[0], area);
            }
        });
    });
}

function handleFileUpload(file, area) {
    const icon = area.querySelector('.upload-icon');
    const text = area.querySelector('p');
    
    if (icon && text) {
        icon.className = 'fas fa-check-circle upload-icon';
        icon.style.color = 'var(--accent-color)';
        text.textContent = `Archivo cargado: ${file.name}`;
        
        // Guardar archivo
        const tipo = area.id === 'presupuesto-upload' ? 'Presupuesto' : 
                    area.id === 'programacion-upload' ? 'Programación' : 'Documento';
        
        dataManager.add('archivos', {
            nombre: file.name,
            tipo: tipo,
            fecha: new Date().toISOString().split('T')[0]
        });
        
        setTimeout(() => {
            notificationSystem.show('Archivo cargado exitosamente', 'success');
            loadTables();
        }, 1000);
    }
}       