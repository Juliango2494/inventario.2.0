import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = "AIzaSyC-eZMGzq9WwTtKC6_8R4cOme1mMhMgnMw"; 

const genAI = new GoogleGenerativeAI(API_KEY);

async function analyzeExcel() {
    const fileInput = document.getElementById('excelFileForAnalysis');
    const analysisResultDiv = document.getElementById('excelAnalysisResult');
    const loadingMessage = document.getElementById('excelLoadingMessage');
    const file = fileInput.files[0];

    analysisResultDiv.innerHTML = '';
    analysisResultDiv.classList.add('hidden');
    loadingMessage.classList.remove('hidden');
    loadingMessage.textContent = 'Cargando archivo...'; 

    if (!file) {
        analysisResultDiv.innerHTML = '<p class="error-message">Por favor, selecciona un archivo Excel para analizar.</p>';
        analysisResultDiv.classList.remove('hidden');
        loadingMessage.classList.add('hidden');
        return;
    }

    const allowedTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedTypes.includes(file.type)) {
        analysisResultDiv.innerHTML = '<p class="error-message">Tipo de archivo no válido. Por favor, sube un archivo Excel (.xls o .xlsx).</p>';
        analysisResultDiv.classList.remove('hidden');
        loadingMessage.classList.add('hidden');
        return;
    }

    const MAX_FILE_SIZE_MB = 10; 
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; 

    if (file.size > MAX_FILE_SIZE_BYTES) {
        analysisResultDiv.innerHTML = `<p class="error-message">El archivo excede el tamaño máximo permitido de ${MAX_FILE_SIZE_MB} MB.</p>`;
        analysisResultDiv.classList.remove('hidden');
        loadingMessage.classList.add('hidden');
        return;
    }

    let excelTextContent = '';

    try {
        loadingMessage.textContent = 'Leyendo contenido del archivo...'; 
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        excelTextContent = XLSX.utils.sheet_to_csv(worksheet);
        if (!excelTextContent.trim()) {
            analysisResultDiv.innerHTML = '<p class="error-message">El archivo Excel parece estar vacío o no contiene texto legible.</p>';
            analysisResultDiv.classList.remove('hidden');
            loadingMessage.classList.add('hidden');
            return;
        }

        console.log("Contenido extraído del Excel (primeras 500 caracteres):", excelTextContent.substring(0, 500));

        loadingMessage.textContent = 'Analizando con IA... Esto puede tomar un momento.'; 

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Como experto en construcción y gestión de proyectos, analiza este archivo Excel y proporciona:

1. **Resumen del Proyecto**:
   - Tipo de construcción (residencial, comercial, industrial, etc.)
   - Área aproximada (si se puede deducir)
   - Etapas principales identificadas

2. **Análisis de Materiales**:
   - Lista de materiales principales con cantidades
   - Costos estimados por categoría (estructura, acabados, instalaciones)
   - Posibles optimizaciones de materiales

3. **Cronograma y Plazos**:
   - Duración total estimada
   - Hitos clave
   - Posibles cuellos de botella

4. **Recomendaciones**:
   - Sugerencias para reducir costos
   - Alternativas de materiales
   - Optimización de tiempos

Formato de respuesta:
- Usa encabezados claros para cada sección
- Destaca números importantes en **negrita**
- Proporciona datos concretos cuando sea posible
- Si falta información, indícalo claramente

Contenido del Excel:
"""
${excelTextContent.substring(0, 30000)}
"""`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        analysisResultDiv.innerHTML = `<h3>Análisis de la Obra:</h3><p>${text}</p>`;
        analysisResultDiv.classList.remove('hidden');

    } catch (error) {
        console.error('Error durante el procesamiento del archivo o interacción con Gemini AI:', error);
        analysisResultDiv.innerHTML = `<p class="error-message">Ocurrió un error al leer el archivo o analizarlo. Asegúrate de que el Excel sea válido y el texto legible.</p><p class="error-message">Detalles del error: ${error.message}</p>`;
        analysisResultDiv.classList.remove('hidden');
    } finally {
        loadingMessage.classList.add('hidden');
    }
}

window.analyzeExcel = analyzeExcel;