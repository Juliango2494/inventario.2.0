

function setupCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    if (!calendarGrid || !currentMonthElement) return;

    let currentDate = new Date();
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const parseDate = (dateString) => {
        if (!dateString || typeof dateString !== 'string') return null;
        const parts = dateString.split('-');
        if (parts.length !== 3) return null;
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        if (isNaN(date.getTime())) return null;
        date.setHours(0, 0, 0, 0);
        return date;
    };

    function generateCalendar() {
        try {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            currentMonthElement.textContent = `${months[month]} ${year}`;
            calendarGrid.innerHTML = '';

            const activities = window.dataManager ? window.dataManager.get('actividades') : [];

            ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].forEach(day => {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-header';
                dayElement.textContent = day;
                calendarGrid.appendChild(dayElement);
            });

            const firstDayOfMonth = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let i = 0; i < firstDayOfMonth; i++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day other-month';
                calendarGrid.appendChild(dayElement);
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                const dayDate = new Date(year, month, day);

                if (dayDate.getTime() === today.getTime()) {
                    dayElement.classList.add('today');
                }

                const dayNumber = document.createElement('strong');
                dayNumber.textContent = day;
                dayElement.appendChild(dayNumber);

                const dayEvents = activities.filter(act => {
                    const startDate = parseDate(act.fechaInicio);
                    const endDate = parseDate(act.fechaFin);
                    return startDate && endDate && dayDate >= startDate && dayDate <= endDate;
                });

                if (dayEvents.length > 0) {
                    const eventsContainer = document.createElement('div');
                    eventsContainer.className = 'calendar-events';
                    dayEvents.forEach(event => {
                        const eventElement = document.createElement('div');
                        eventElement.className = 'calendar-event';
                        eventElement.textContent = event.nombre;
                        eventElement.title = event.nombre;
                        eventsContainer.appendChild(eventElement);
                    });
                    dayElement.appendChild(eventsContainer);
                }
                calendarGrid.appendChild(dayElement);
            }
        } catch (error) {
            console.error("Error al generar el calendario:", error);
            calendarGrid.innerHTML = '<p class="error-message">Error al cargar el calendario. Verifique los datos de las actividades.</p>';
        }
    }

    document.getElementById('prevMonth')?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar();
    });

    document.getElementById('nextMonth')?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar();
    });

    generateCalendar();
}
