class NotificationSystem {
    constructor() {
        this.createContainer();
    }
    
    createContainer() {
        if (document.getElementById('notification-container')) return;
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed; top: 80px; right: 20px; z-index: 1000;
            max-width: 350px; pointer-events: none;
        `;
        document.body.appendChild(container);
    }
    
    show(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: '#10b981',
            warning: '#f59e0b', 
            error: '#ef4444',
            info: '#2563eb'
        };
        
        notification.style.cssText = `
            background: ${colors[type]}; color: white; padding: 1rem;
            border-radius: 8px; margin-bottom: 0.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%); transition: transform 0.3s ease;
            pointer-events: auto; font-size: 0.9rem;
        `;
        notification.textContent = message;
        
        const container = document.getElementById('notification-container');
        container.appendChild(notification);
        
        setTimeout(() => notification.style.transform = 'translateX(0)', 10);
        setTimeout(() => notification.remove(), 4000);
    }
}