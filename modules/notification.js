class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.count = 3;
        this.createNotificationContainer();
        this.updateBadge();
    }
    
    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 1000;
            max-width: 350px;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
    
    show(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        const id = Date.now();
        
        let bgColor;
        let icon;
        switch(type) {
            case 'success':
                bgColor = '#10b981';
                icon = 'fa-check-circle';
                break;
            case 'warning':
                bgColor = '#f59e0b';
                icon = 'fa-exclamation-triangle';
                break;
            case 'error':
                bgColor = '#ef4444';
                icon = 'fa-times-circle';
                break;
            default:
                bgColor = '#2563eb';
                icon = 'fa-info-circle';
        }
        
        notification.style.cssText = `
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            margin-bottom: 0.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease, opacity 0.3s ease;
            pointer-events: auto;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            line-height: 1.4;
        `;
        
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
            <button onclick="window.notificationSystem.remove(${id})" style="
                background: none;
                border: none;
                color: white;
                margin-left: auto;
                cursor: pointer;
                padding: 0;
                font-size: 1.2rem;
                opacity: 0.7;
            ">×</button>
        `;
        
        notification.dataset.id = id;
        const container = document.getElementById('notification-container');
        if (container) {
            container.appendChild(notification);
        }
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            this.remove(id);
        }, duration);
        
        this.notifications.push(id);
        return id;
    }
    
    remove(id) {
        const notification = document.querySelector(`[data-id="${id}"]`);
        if (notification) {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
        this.notifications = this.notifications.filter(n => n !== id);
    }
    
    updateBadge() {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            const style = document.createElement('style');
            style.id = 'notification-badge-style';
            const existingStyle = document.getElementById('notification-badge-style');
            if (existingStyle) {
                existingStyle.remove();
            }
            
            style.textContent = `
                .notification-badge::after {
                    content: '${this.count}';
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: var(--secondary-color);
                    color: white;
                    border-radius: 50%;
                    width: 18px;
                    height: 18px;
                    font-size: 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    addNotification() {
        this.count++;
        this.updateBadge();
    }
    
    clearNotifications() {
        this.count = 0;
        this.updateBadge();
    }
}
window.notificationSystem = new NotificationSystem();
class AlarmSystem {
    constructor() {
        this.alarms = [
            { id: 1, message: 'Stock bajo de cemento (< 100kg)', type: 'warning', active: true },
            { id: 2, message: 'Entrega retrasada - Torre Central', type: 'error', active: true },
            { id: 3, message: 'Revisión programada para mañana', type: 'info', active: true }
        ];
        this.checkAlarms();
    }
    
    checkAlarms() {
        this.alarms.forEach(alarm => {
            if (alarm.active) {
                notificationSystem.show(alarm.message, alarm.type, 6000);
                alarm.active = false; 
            }
        });
    }
    
    addAlarm(message, type = 'info') {
        const newAlarm = {
            id: Date.now(),
            message,
            type,
            active: true
        };
        this.alarms.push(newAlarm);
        notificationSystem.show(message, type);
        notificationSystem.addNotification();
    }
}

const alarmSystem = new AlarmSystem();

document.addEventListener('click', (e) => {
    if (e.target.closest('.fa-eye')) {
        notificationSystem.show('Abriendo vista detallada...', 'info');
    }
    
    if (e.target.closest('.fa-edit')) {
        notificationSystem.show('Modo de edición activado', 'warning');
    }
    
    if (e.target.closest('.fa-download')) {
        notificationSystem.show('Descargando archivo...', 'success');
    }
    
    if (e.target.closest('.notification-badge')) {
        notificationSystem.show('Todas las notificaciones revisadas', 'success');
        notificationSystem.clearNotifications();
    }
});

setInterval(() => {
    if (Math.random() > 0.8) {
        const messages = [
            { msg: 'Nueva entrega programada para mañana', type: 'info' },
            { msg: 'Actualización de precios disponible', type: 'warning' },
            { msg: 'Revisión de calidad completada', type: 'success' },
            { msg: 'Material crítico: Stock bajo', type: 'error' }
        ];
        const random = messages[Math.floor(Math.random() * messages.length)];
        alarmSystem.addAlarm(random.msg, random.type);
    }
}, 30000);

function addCalendarEvents() {
    const events = {
        '12': ['📦 Entrega cemento', '🚛 Transporte'],
        '15': ['🔍 Inspección torre', '📋 Reporte'],
        '20': ['📋 Reunión cliente', '💼 Presentación'],
        '25': ['🏗️ Inicio fase 2', '⚡ Actividad crítica']
    };
    
    const calendarDays = document.querySelectorAll('.calendar-day:not(.other-month)');
    calendarDays.forEach(day => {
        const dayNumber = day.querySelector('strong')?.textContent;
        if (events[dayNumber]) {
            const eventList = events[dayNumber].map(event => 
                `<div style="background: var(--primary-color); color: white; padding: 0.2rem; margin: 0.1rem 0; border-radius: 3px; font-size: 0.7rem;">${event}</div>`
            ).join('');
            day.innerHTML += eventList;
        }
    });
}

const originalGenerateCalendar = generateCalendar;
generateCalendar = function() {
    originalGenerateCalendar.call(this);
    setTimeout(addCalendarEvents, 100);
};

const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .form-input:focus {
        transform: scale(1.02);
    }
    
    .quick-action:active {
        transform: translateY(0) scale(0.98);
    }
    
    .btn:active {
        transform: translateY(0) scale(0.95);
    }
    
    .table tbody tr {
        transition: all 0.2s ease;
    }
    
    .upload-area.uploading {
        border-color: var(--accent-color);
        background: rgba(16, 185, 129, 0.1);
    }
`;
document.head.appendChild(animationStyles);

function addSearchFunctionality() {
    const tables = document.querySelectorAll('.table');
    tables.forEach(table => {
        const thead = table.querySelector('thead');
        if (thead) {
            const searchRow = document.createElement('tr');
            const headers = thead.querySelectorAll('th');
            
            headers.forEach((header, index) => {
                const searchCell = document.createElement('th');
                if (index < headers.length - 1) { 
                    searchCell.innerHTML = `<input type="text" style="width: 100%; padding: 0.25rem; border: 1px solid var(--border); border-radius: 4px;" placeholder="Buscar...">`;
                    const input = searchCell.querySelector('input');
                    input.addEventListener('input', (e) => {
                        filterTable(table, index, e.target.value);
                    });
                }
                searchRow.appendChild(searchCell);
            });
            
            thead.appendChild(searchRow);
        }
    });
}

function filterTable(table, columnIndex, searchTerm) {
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const cell = row.cells[columnIndex];
        if (cell) {
            const cellText = cell.textContent.toLowerCase();
            const shouldShow = cellText.includes(searchTerm.toLowerCase());
            row.style.display = shouldShow ? '' : 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    addCalendarEvents();
    addSearchFunctionality();
});