
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

    let excelTextContent = '';

    try {
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

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Analiza el siguiente contenido de un documento Excel relacionado con una obra de construcción. El objetivo es proporcionar un análisis conciso y estructurado. Identifica claramente los siguientes puntos:
- **Tipo de Obra/Proyecto**: ¿Qué tipo de construcción o proyecto se describe (ej., renovación, edificación nueva, infraestructura)?
- **Fases/Etapas Clave**: ¿Se mencionan fases específicas de la construcción (ej., demolición, cimientos, estructura, acabados)?
- **Materiales/Equipos**: ¿Qué materiales o equipos son destacados?
- **Costos/Presupuesto**: Si se mencionan números o estimaciones de costos, ¿cuáles son? (Menciona si son valores totales, por item, etc.)
- **Plazos/Cronogramas**: ¿Hay alguna indicación de fechas, duraciones o hitos importantes?
- **Recursos Humanos**: ¿Se mencionan roles, equipos de trabajo, o cantidad de personal?
- **Posibles Riesgos/Desafíos**: ¿Se identifican posibles obstáculos o problemas?
- **Información Adicional Relevante**: Cualquier otro dato importante que resalte el documento para el contexto de una obra.

Formatea tu respuesta de manera legible, usando listas o párrafos claros para cada punto. Si alguna información no está presente en el texto, indícalo explícitamente (ej., "Costos: No especificados en el documento."). Sé lo más específico posible basándote en los datos proporcionados.

Contenido del documento Excel:
"""
${excelTextContent.substring(0, 30000)} // Limita el contenido para evitar exceder límites de tokens de Gemini
"""
`;
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