        const calendarGrid = document.getElementById('calendarGrid');
        const currentMonthElement = document.getElementById('currentMonth');
        const prevMonthButton = document.getElementById('prevMonth');
        const nextMonthButton = document.getElementById('nextMonth');

        let currentDate = new Date();
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        function generateCalendar() {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const today = new Date();
            
            currentMonthElement.textContent = `${months[month]} ${year}`;
            
            calendarGrid.innerHTML = '';
            
            const dayHeaders = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            dayHeaders.forEach(day => {
                const dayElement = document.createElement('div');
                dayElement.style.cssText = `
                    background: var(--primary-color);
                    color: white;
                    padding: 0.5rem;
                    text-align: center;
                    font-weight: bold;
                `;
                dayElement.textContent = day;
                calendarGrid.appendChild(dayElement);
            });
            
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const daysInPrevMonth = new Date(year, month, 0).getDate();
            
            for (let i = firstDay - 1; i >= 0; i--) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day other-month';
                dayElement.textContent = daysInPrevMonth - i;
                calendarGrid.appendChild(dayElement);
            }
            
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                
                if (year === today.getFullYear() && 
                    month === today.getMonth() && 
                    day === today.getDate()) {
                    dayElement.classList.add('today');
                }
                
                dayElement.innerHTML = `
                    <strong>${day}</strong>
                    ${getEventsForDay(day).join('<br>')}
                `;
                
                calendarGrid.appendChild(dayElement);
            }
            
            const totalCells = 42; 
            const cellsUsed = firstDay + daysInMonth;
            for (let day = 1; cellsUsed + day - 1 < totalCells; day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day other-month';
                dayElement.textContent = day;
                calendarGrid.appendChild(dayElement);
            }
        }

        function getEventsForDay(day) {
            const events = [];
            if (day === 12) events.push('📦 Entrega');
            if (day === 15) events.push('🔍 Inspección');
            if (day === 20) events.push('📋 Reunión');
            return events;
        }

        prevMonthButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            generateCalendar();
        });

        nextMonthButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            generateCalendar();
        });

        generateCalendar();

        const style = document.createElement('style');
        style.textContent = `
            .badge {
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.75rem;
                font-weight: 500;
            }
            .badge-success {
                background: var(--accent-color);
                color: white;
            }
            .badge-warning {
                background: var(--secondary-color);
                color: white;
            }
        `;
        document.head.appendChild(style);