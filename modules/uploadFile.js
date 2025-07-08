function setupFileUpload() {
    document.querySelectorAll('.upload-area').forEach(area => {
        const fileInput = area.querySelector('input[type="file"]');
        const feedbackElement = area.querySelector('.upload-feedback');
        if (!fileInput) return;

        // Function to reset feedback and styling
        const resetFeedback = () => {
            feedbackElement.textContent = '';
            feedbackElement.classList.remove('success', 'error', 'info');
            area.classList.remove('loading', 'success', 'error');
            area.style.borderColor = 'var(--border)';
        };

        area.addEventListener('click', () => {
            resetFeedback(); // Reset on click to prepare for new upload
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

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileUpload(e.target.files[0], area, feedbackElement);
            }
        });
    });
}

function handleFileUpload(file, area, feedbackElement) {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    const allowedTypes = area.id === 'presupuesto-upload' ? ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'] :
                         area.id === 'programacion-upload' ? ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] :
                         ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'image/jpeg', 'image/jpg'];

    // Reset feedback before validation
    feedbackElement.textContent = '';
    feedbackElement.classList.remove('success', 'error', 'info');
    area.classList.remove('loading', 'success', 'error');

    // --- Validation ---
    if (file.size > MAX_FILE_SIZE) {
        feedbackElement.textContent = 'Error: El archivo excede el tamaño máximo de 5MB.';
        feedbackElement.classList.add('error');
        area.classList.add('error');
        return;
    }

    if (!allowedTypes.includes(file.type)) {
        feedbackElement.textContent = `Error: Tipo de archivo no permitido. Tipos aceptados: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}.`;
        feedbackElement.classList.add('error');
        area.classList.add('error');
        return;
    }

    // --- Feedback during upload (simulated) ---
    const icon = area.querySelector('.upload-icon');
    const text = area.querySelector('p');
    const originalText = text.textContent; // Store original text

    if (icon && text) {
        icon.className = 'fas fa-spinner fa-spin upload-icon'; // Loading spinner
        icon.style.color = 'var(--primary-color)';
        text.textContent = `Subiendo: ${file.name}...`;
        feedbackElement.textContent = 'Subiendo archivo...';
        feedbackElement.classList.add('info');
        area.classList.add('loading');
    }

    // --- Simulate Upload Process and Read File ---
    const reader = new FileReader();
    reader.onload = function(e) {
        const arrayBuffer = e.target.result; // This is the ArrayBuffer

        // Convert ArrayBuffer to Base64 string for storage
        const base64Content = btoa(
            new Uint8Array(arrayBuffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );

        setTimeout(() => {
            const isUploadSuccessful = Math.random() > 0.1; // 90% success rate for demo

            if (isUploadSuccessful) {
                // --- Success Feedback ---
                if (icon && text) {
                    icon.className = 'fas fa-check-circle upload-icon';
                    icon.style.color = 'var(--accent-color)';
                    text.textContent = `Archivo cargado: ${file.name}`;
                    feedbackElement.textContent = '¡Carga exitosa!';
                    feedbackElement.classList.remove('info');
                    feedbackElement.classList.add('success');
                    area.classList.remove('loading');
                    area.classList.add('success');
                }

                // Save file data (using assumed dataManager from previous context)
                const tipo = area.id === 'presupuesto-upload' ? 'Presupuesto' :
                             area.id === 'programacion-upload' ? 'Programación' : 'Documento';

                // Assuming dataManager and uploadedFilesTableBody exist globally or are passed
                if (typeof dataManager !== 'undefined') {
                    const fileId = `file-${Date.now()}-${Math.floor(Math.random() * 1000)}`; // Unique ID for the file

                    dataManager.add('archivos', {
                        id: fileId, // Add a unique ID
                        nombre: file.name,
                        tipo: tipo,
                        fecha: new Date().toISOString().split('T')[0], // Current date (YYYY-MM-DD)
                        estado: 'Procesado', // Or 'Pendiente'
                        fileType: file.type // Store original file type
                    });

                    // Store file content in sessionStorage if it's an Excel file
                    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {
                        sessionStorage.setItem(`fileContent_${fileId}`, base64Content);
                    }

                    updateUploadedFilesTable(); // Update the table of uploaded files
                } else {
                    console.warn('dataManager not found. File data not saved.');
                }

            } else {
                // --- Error Handling Feedback ---
                if (icon && text) {
                    icon.className = 'fas fa-times-circle upload-icon';
                    icon.style.color = 'var(--error-color)';
                    text.textContent = `Fallo al subir: ${file.name}`;
                    feedbackElement.textContent = 'Error en la carga. Inténtalo de nuevo.';
                    feedbackElement.classList.remove('info');
                    feedbackElement.classList.add('error');
                    area.classList.remove('loading');
                    area.classList.add('error');
                }
            }

            // Restore original text content after a delay, but keep status icon/color
            setTimeout(() => {
                if (text) {
                    // Keep the success/error message for a bit longer, then revert to prompt
                    text.textContent = originalText; // Revert prompt text
                    area.classList.remove('success', 'error'); // Remove status classes
                    icon.className = 'fas fa-cloud-upload-alt upload-icon'; // Revert to generic upload icon
                    icon.style.color = 'var(--text-secondary)'; // Revert icon color
                    feedbackElement.textContent = ''; // Clear specific feedback
                }
            }, 5000); // Revert after 5 seconds
        }, 1500); // Simulate network delay
    };

    // Read file as ArrayBuffer for XLSX.read
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {
        reader.readAsArrayBuffer(file);
    } else {
        // For other file types, you might not need to read their content here
        // or handle them differently if they are meant for viewing in other ways.
        // reader.readAsDataURL(file); // Example if you want to use Data URL for image/pdf
    }
}

function updateUploadedFilesTable() {
    const tableBody = document.getElementById('uploadedFilesTableBody');
    if (!tableBody || typeof dataManager === 'undefined') return;

    // Clear existing rows except the initial example if any
    tableBody.innerHTML = '';

    const files = dataManager.get('archivos');
    files.forEach(file => {
        const row = tableBody.insertRow();
        let viewButtonHtml = '';
        if (file.fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.fileType === 'application/vnd.ms-excel') {
            viewButtonHtml = `<button class="btn btn-secondary view-excel-btn" data-file-id="${file.id}"><i class="fas fa-eye"></i></button>`;
        } else {
            // You can add logic for other file types (e.g., open PDF in new tab or disable)
            viewButtonHtml = `<button class="btn btn-secondary" disabled><i class="fas fa-eye"></i></button>`;
        }

        row.innerHTML = `
            <td>${file.nombre}</td>
            <td>${file.tipo}</td>
            <td>${file.fecha}</td>
            <td><span class="badge badge-success">${file.estado}</span></td>
            <td>
                <button class="btn btn-secondary"><i class="fas fa-download"></i></button>
                ${viewButtonHtml}
            </td>
        `;
    });

    // Add event listeners to the new "View" buttons
    document.querySelectorAll('.view-excel-btn').forEach(button => {
        button.addEventListener('click', function() {
            const fileId = this.getAttribute('data-file-id');
            if (fileId) {
                // Redirect to excel.html, it will then read from sessionStorage
                window.location.href = `excel.html?fileId=${fileId}`;
            }
        });
    });
}

// Ensure this runs when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setupFileUpload();
    // Assuming dataManager is initialized and has existing 'archivos' data to populate on load
    if (typeof dataManager !== 'undefined') {
        updateUploadedFilesTable();
    }
});