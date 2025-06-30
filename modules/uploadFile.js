        
        const navTabs = document.querySelectorAll('.nav-tab');
        const tabContents = document.querySelectorAll('.tab-content');

        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                
                navTabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });

        const quickActions = document.querySelectorAll('.quick-action');
        quickActions.forEach(action => {
            action.addEventListener('click', () => {
                const actionType = action.getAttribute('data-action');
                switch(actionType) {
                    case 'nueva-obra':
                        document.querySelector('[data-tab="obras"]').click();
                        break;
                    case 'agregar-material':
                        document.querySelector('[data-tab="materiales"]').click();
                        break;
                    case 'consultar-ia':
                        document.querySelector('[data-tab="ia"]').click();
                        break;
                    case 'cargar-archivo':
                        document.querySelector('[data-tab="archivos"]').click();
                        break;
                }
            });
        });

        const uploadAreas = document.querySelectorAll('.upload-area');
        uploadAreas.forEach(area => {
            const fileInput = area.querySelector('input[type="file"]');
            
            area.addEventListener('click', () => {
                fileInput.click();
            });

            area.addEventListener('dragover', (e) => {
                e.preventDefault();
                area.style.borderColor = 'var(--primary-color)';
                area.style.background = 'rgba(37, 99, 235, 0.1)';
            });

            area.addEventListener('dragleave', () => {
                area.style.borderColor = 'var(--border)';
                area.style.background = 'var(--surface-hover)';
            });

            area.addEventListener('drop', (e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    handleFileUpload(files[0], area);
                }
                area.style.borderColor = 'var(--border)';
                area.style.background = 'var(--surface-hover)';
            });

            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    handleFileUpload(e.target.files[0], area);
                }
            });
        });

        function handleFileUpload(file, area) {
            const icon = area.querySelector('.upload-icon');
            const text = area.querySelector('p');
            
            icon.className = 'fas fa-check-circle upload-icon';
            icon.style.color = 'var(--accent-color)';
            text.textContent = `Archivo cargado: ${file.name}`;
            
            setTimeout(() => {
                alert('Archivo cargado exitosamente');
            }, 1000);
        }