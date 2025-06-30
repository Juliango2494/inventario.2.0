<<<<<<< Updated upstream
        const chatInput = document.getElementById('chatInput');
        const chatMessages = document.getElementById('chatMessages');
        const sendButton = document.getElementById('sendChat');

        function addMessage(message, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = `
                margin-bottom: 1rem;
                padding: 0.75rem;
                border-radius: 8px;
                ${isUser ? 
                    'background: var(--primary-color); color: white; margin-left: 2rem; text-align: right;' : 
                    'background: var(--surface); border: 1px solid var(--border); margin-right: 2rem;'
                }
            `;
            messageDiv.textContent = message;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function sendMessage() {
            const message = chatInput.value.trim();
            if (message) {
                addMessage(message, true);
                chatInput.value = '';
                
                setTimeout(() => {
                    const responses = [
                        'He analizado tu consulta. Basándome en los datos disponibles, te recomiendo revisar los costos de materiales en el ítem de estructura.',
                        'Puedo ayudarte con eso. ¿Podrías especificar qué tipo de análisis necesitas: presupuesto, cronograma o materiales?',
                        'Según mi análisis, detecté una posible optimización en la programación de actividades que podría ahorrarte un 15% en tiempo.',
                        'Te sugiero revisar los precios de cemento, ya que han aumentado un 8% en el último mes según datos de mercado.'
                    ];
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    addMessage(randomResponse);
                }, 1500);
            }
        }

        sendButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
=======
window.setupChat = function() {
    if (typeof window.GoogleGenerativeAI === 'undefined') {
        import('https://esm.run/@google/generative-ai').then(module => {
            window.GoogleGenerativeAI = module.GoogleGenerativeAI;
            initializeChat();
        }).catch(err => {
            console.error("Error loading GoogleGenerativeAI:", err);
            initializeBasicChat();
        });
    } else {
        initializeChat();
    }
};

function initializeChat() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const sendButton = document.getElementById('sendChat');

    const GEMINI_API_KEY = 'AIzaSyC-eZMGzq9WwTtKC6_8R4cOme1mMhMgnMw';

    if (!chatInput || !chatMessages || !sendButton) {
        console.error('Chat elements not found!');
        return;
    }

    if (typeof window.GoogleGenerativeAI === 'undefined') {
        console.error("GoogleGenerativeAI library not loaded. Falling back to basic chat.");
        initializeBasicChat();
        return;
    }

    try {
        const genAI = new window.GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.7,
                topP: 0.8,
                topK: 40,
                maxOutputTokens: 1024,
            },
        }); 

        let chatHistory = [];

        function addMessage(message, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
            
            const formattedMessage = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                           .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                           .replace(/\n/g, '<br>');
            
            messageDiv.innerHTML = formattedMessage;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight; 
        }

        async function sendMessage() {
            const message = chatInput.value.trim();
            if (!message) return;

            addMessage(message, true); 
            chatInput.value = ''; 

            chatInput.disabled = true;
            sendButton.disabled = true;
            addMessage("El asistente está escribiendo...", false); 

            try {
                const contextualPrompt = `Como asistente especializado en ObraSmart (sistema de gestión de construcción), responde a la siguiente consulta sobre gestión de obras, materiales, presupuestos o construcción en general. 

Usuario pregunta: ${message}

Proporciona una respuesta útil y específica relacionada con la gestión de proyectos de construcción.`;

                chatHistory.push({role: "user", parts: [{text: contextualPrompt}]});

                const chat = model.startChat({
                    history: chatHistory.slice(-10), 
                });

                const result = await chat.sendMessage(message);
                const response = await result.response;
                const text = response.text();

                chatHistory.push({role: "model", parts: [{text: text}]});

                const typingIndicator = chatMessages.querySelector('.bot-message:last-child');
                if (typingIndicator && typingIndicator.textContent === "El asistente está escribiendo...") {
                    chatMessages.removeChild(typingIndicator);
                }

                addMessage(text, false); 

            } catch (error) {
                console.error('Error calling Gemini API:', error);
                
                const typingIndicator = chatMessages.querySelector('.bot-message:last-child');
                if (typingIndicator && typingIndicator.textContent === "El asistente está escribiendo...") {
                    chatMessages.removeChild(typingIndicator);
                }
                
                let errorMessage = 'Lo siento, hubo un error al procesar tu solicitud.';
                
                if (error.message.includes('API key')) {
                    errorMessage = 'Error: Clave de API inválida. Por favor verifica la configuración.';
                } else if (error.message.includes('quota')) {
                    errorMessage = 'Error: Se ha excedido la cuota de la API. Intenta más tarde.';
                } else if (error.message.includes('404')) {
                    errorMessage = 'Error: Modelo no encontrado. Verificando configuración...';
                } else if (error.message.includes('403')) {
                    errorMessage = 'Error: Acceso denegado. Verifica los permisos de la API.';
                }
                
                addMessage(errorMessage, false);
            } finally {
                chatInput.disabled = false;
                sendButton.disabled = false;
                chatInput.focus();
            }
        }

        setTimeout(() => {
            addMessage("¡Hola! Soy tu asistente de IA especializado en **ObraSmart**. Puedo ayudarte con:\n\n• **Análisis de presupuestos** y optimización de costos\n• **Recomendaciones de materiales** y proveedores\n• **Planificación de cronogramas** y gestión de tiempos\n• **Control de inventarios** y logística\n• **Análisis de riesgos** en proyectos de construcción\n\n¿En qué puedo ayudarte hoy?", false);
        }, 1000);

        sendButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        console.log('Chat with Gemini AI initialized successfully with model: gemini-1.5-flash');

    } catch (error) {
        console.error('Error initializing Gemini AI:', error);
        initializeBasicChat();
    }
}

function initializeBasicChat() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const sendButton = document.getElementById('sendChat');

    if (!chatInput || !chatMessages || !sendButton) {
        console.error('Chat elements not found!');
        return;
    }

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; 
    }

    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        addMessage(message, true); 
        chatInput.value = ''; 

        setTimeout(() => {
            const responses = [
                "Gracias por tu consulta sobre construcción. El asistente de IA no está disponible temporalmente.",
                "He registrado tu pregunta sobre gestión de obras. Por favor, verifica la configuración de la API de Gemini.",
                "Tu consulta sobre materiales ha sido recibida. El servicio de IA se está inicializando.",
                "Mensaje recibido. Para activar el asistente especializado en construcción, verifica la clave API.",
                "Consulta registrada. El asistente de ObraSmart requiere conexión a la API de Gemini."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, false);
        }, 1000);
    }

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    setTimeout(() => {
        addMessage("⚠️ **Modo Sin Conexión**: El asistente de IA no está disponible. Las funciones básicas de ObraSmart están operativas.\n\nPara activar el asistente especializado:\n1. Verifica tu clave API de Google Gemini\n2. Asegúrate de tener conexión a internet\n3. Recarga la página", false);
    }, 500);

    console.log('Basic chat initialized (AI not available)');
}
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.setupChat();
    }, 500);
});
>>>>>>> Stashed changes
