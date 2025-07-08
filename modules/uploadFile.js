function setupFileUpload() {
    document.querySelectorAll('.upload-area').forEach(area => {
        const fileInput = area.querySelector('input[type="file"]');
        const feedbackElement = area.querySelector('.upload-feedback');
        if (!fileInput) return;

        const resetFeedback = () => {
            if (feedbackElement) {
                feedbackElement.textContent = '';
                feedbackElement.classList.remove('success', 'error', 'info');
            }
            area.classList.remove('loading', 'success', 'error', 'dragover');
            area.style.borderColor = 'var(--border)';
        };

        // This is the core fix: The click on the area should trigger the hidden file input.
        // The fileInput's 'change' event will then handle the selected file.
        area.addEventListener('click', (e) => {
            // Prevent the click on the input from propagating and triggering the area's click again
            if (e.target === fileInput) {
                return;
            }
            resetFeedback();
            fileInput.click();
        });

        area.addEventListener('dragover', (e) => {
            e.preventDefault();
            area.style.borderColor = 'var(--primary-color)';
            area.classList.add('dragover');
        });

        area.addEventListener('dragleave', () => {
            area.style.borderColor = 'var(--border)';
            area.classList.remove('dragover');
        });

        area.addEventListener('drop', (e) => {
            e.preventDefault();
            area.style.borderColor = 'var(--border)';
            area.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                handleFileUpload(e.dataTransfer.files[0], area, feedbackElement);
            }
        });

        // This handles files selected via click (from area.click()) or drag-and-drop.
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileUpload(e.target.files[0], area, feedbackElement);
            }
        });
    });
}

/**
 * Maneja la subida individual de un archivo.
 * @param {File} file - El objeto File a subir.
 * @param {HTMLElement} area - El elemento .upload-area asociado.
 * @param {HTMLElement} feedbackElement - El elemento .upload-feedback para mensajes.
 */
async function handleFileUpload(file, area, feedbackElement) {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // Límite de 5MB
    const ALLOWED_EXCEL_TYPES = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const ALLOWED_DOC_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

    // Restablecer estilos y mensajes antes de iniciar una nueva carga
    resetFeedbackAndStyles(area, feedbackElement);
    area.classList.add('loading'); // Indica que la carga está en progreso
    if (feedbackElement) {
        feedbackElement.classList.add('info');
        feedbackElement.textContent = 'Procesando archivo...';
    }
    window.showAlert('Cargando archivo...', 'info'); // Alerta global

    if (file.size > MAX_FILE_SIZE) {
        showError(area, feedbackElement, 'El archivo excede el tamaño máximo permitido (5MB).');
        window.showAlert('El archivo es demasiado grande.', 'error');
        area.classList.remove('loading');
        return;
    }

    let fileTypeCategory = 'Documento General'; // Categoría por defecto
    if (ALLOWED_EXCEL_TYPES.includes(file.type)) {
        fileTypeCategory = 'Presupuesto';
    } else if (ALLOWED_DOC_TYPES.includes(file.type)) {
        fileTypeCategory = 'Programación';
    } else if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
        fileTypeCategory = 'Imagen';
    }
    // Puedes añadir más categorías según tus necesidades

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const fileContent = e.target.result.split(',')[1]; // Obtener solo el contenido Base64
            const fileId = `file-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            // Asegurarse de que dataManager esté disponible
            if (typeof window.dataManager !== 'undefined') {
                const newFile = {
                    id: fileId,
                    nombre: file.name,
                    tipo: fileTypeCategory, // Categoría asignada
                    fileType: file.type, // Tipo MIME real del archivo
                    fecha: new Date().toLocaleDateString('es-ES'), // Fecha actual formateada
                    estado: 'Cargado',
                    size: file.size // Tamaño del archivo
                };

                // Añadir el nuevo registro al DataManager
                const currentFiles = window.dataManager.get('archivos') || [];
                currentFiles.push(newFile);
                window.dataManager.save('archivos', currentFiles);

                // Almacenar el contenido del archivo en sessionStorage para su posterior visualización
                sessionStorage.setItem(`fileContent_${fileId}`, fileContent);

                showSuccess(area, feedbackElement, `Archivo "${file.name}" cargado.`);
                window.showAlert('Archivo cargado y guardado correctamente.', 'success');

                // Llama a la función global para actualizar la tabla de archivos en index.html
                if (typeof window.updateUploadedFilesTable === 'function') {
                    window.updateUploadedFilesTable();
                } else {
                    console.warn('Advertencia: updateUploadedFilesTable no está definida. La tabla de archivos no se actualizará.');
                }

            } else {
                showError(area, feedbackElement, 'Error: DataManager no está disponible.');
                window.showAlert('Error interno: DataManager no encontrado.', 'error');
            }
        } catch (error) {
            console.error('Error al leer o guardar el archivo:', error);
            showError(area, feedbackElement, 'Error al procesar el archivo.');
            window.showAlert('Error al procesar el archivo.', 'error');
        } finally {
            area.classList.remove('loading'); // Quita el estado de carga al finalizar
        }
    };

    reader.onerror = () => {
        showError(area, feedbackElement, 'Error al leer el archivo.');
        window.showAlert('Error de lectura del archivo.', 'error');
        area.classList.remove('loading');
    };

    reader.readAsDataURL(file); // Lee el archivo como una URL de datos (Base64)
}

// Funciones auxiliares para feedback visual
function resetFeedbackAndStyles(area, feedbackElement) {
    if (feedbackElement) {
        feedbackElement.textContent = '';
        feedbackElement.classList.remove('success', 'error', 'info');
    }
    area.classList.remove('loading', 'success', 'error', 'dragover');
    area.style.borderColor = 'var(--border)';
}

function showSuccess(area, feedbackElement, message) {
    if (feedbackElement) {
        feedbackElement.textContent = message;
        feedbackElement.classList.add('success');
    }
    area.classList.add('success');
}

function showError(area, feedbackElement, message) {
    if (feedbackElement) {
        feedbackElement.textContent = message;
        feedbackElement.classList.add('error');
    }
    area.classList.add('error');
}
