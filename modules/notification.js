class NotificationSystem {
    constructor() {
        this.createContainer();
        // Bind event listeners if needed for advanced interaction, e.g., closing
    }

    createContainer() {
        if (document.getElementById('notification-container')) return;

        const container = document.createElement('div');
        container.id = 'notification-container';
        container.setAttribute('aria-live', 'polite'); // Announce changes politely
        container.setAttribute('aria-atomic', 'true'); // Announce the entire region as a whole
        container.classList.add('notification-container'); // Apply CSS class for styling

        document.body.appendChild(container);
    }

    /**
     * Shows a notification message.
     * @param {string} message The message to display.
     * @param {string} type The type of notification (success, warning, error, info).
     * @param {number} duration The duration in milliseconds before the notification is removed.
     */
    show(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.classList.add('notification-item');
        notification.classList.add(`notification-item--${type}`);
        notification.setAttribute('role', 'status'); // For screen readers to announce it as a status update
        notification.textContent = message;

        const container = document.getElementById('notification-container');
        if (!container) {
            console.error("Notification container not found. Call createContainer() first.");
            return;
        }
        container.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });

        // Auto-remove after duration
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            notification.addEventListener('transitionend', () => notification.remove(), { once: true });
        }, duration);
    }
}