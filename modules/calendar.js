function setupCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    if (!calendarGrid || !currentMonthElement) return;
    
    let currentDate = new Date();
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    function generateCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const today = new Date();
        
        currentMonthElement.textContent = `${months[month]} ${year}`;
        calendarGrid.innerHTML = '';
        
        // Headers
        ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.style.cssText = 'background: var(--primary-color); color: white; padding: 0.5rem; text-align: center; font-weight: bold;';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        });
        
        // Days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            dayElement.textContent = new Date(year, month, 0).getDate() - i;
            calendarGrid.appendChild(dayElement);
        }
        
        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayElement.classList.add('today');
            }
            
            dayElement.innerHTML = `<strong>${day}</strong>`;
            
            // Add events
            if (day === 12) dayElement.innerHTML += '<br>📦 Entrega';
            if (day === 15) dayElement.innerHTML += '<br>🔍 Inspección';
            if (day === 20) dayElement.innerHTML += '<br>📋 Reunión';
            
            calendarGrid.appendChild(dayElement);
        }
        
        // Next month days
        const totalCells = 42;
        const cellsUsed = firstDay + daysInMonth;
        for (let day = 1; cellsUsed + day - 1 < totalCells; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day other-month';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
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
