function setupChat() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const sendButton = document.getElementById('sendChat');
    
    if (!chatInput || !chatMessages || !sendButton) return;
    
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            margin-bottom: 1rem; padding: 0.75rem; border-radius: 8px;
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
        if (!message) return;
        
        addMessage(message, true);
        chatInput.value = '';
        
        setTimeout(() => {
            const responses = [
                'He analizado tu consulta. Revisa los costos de materiales en estructura.',
                '¿Qué tipo de análisis necesitas: presupuesto, cronograma o materiales?',
                'Detecté una optimización que podría ahorrarte un 15% en tiempo.',
                'Los precios de cemento han aumentado 8% según datos de mercado.'
            ];
            const response = responses[Math.floor(Math.random() * responses.length)];
            addMessage(response);
        }, 1500);
    }
    
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}
