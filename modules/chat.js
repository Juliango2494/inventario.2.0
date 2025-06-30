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