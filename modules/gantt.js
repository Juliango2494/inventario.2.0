function setupGantt() {
  document.querySelectorAll('.view-gantt').forEach(btn => {
    btn.addEventListener('click', function() {
      const obraId = this.getAttribute('data-obra');
      showGanttChart(obraId);
    });
  });
}

function isValidDate(dateString) {
  if (!dateString || typeof dateString !== 'string') {
    return false;
  }
  const date = new Date(dateString);
  
  return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === dateString;
}

function showGanttChart(obraId) {
  try {
    const obra = dataManager.getObraById(obraId);
    if (!obra) {
      throw new Error('Obra no encontrada');
    }

    let ganttContainer = document.getElementById('gantt-container');
    if (!ganttContainer) {
      ganttContainer = document.createElement('div');
      ganttContainer.id = 'gantt-container';
      ganttContainer.style.cssText = 'margin-top: 20px; padding: 20px; background: white; border-radius: 8px; box-shadow: var(--shadow);';
      document.querySelector('#obras .card').appendChild(ganttContainer);
    }

    const actividades = dataManager.getActividadesByObra(obraId);

    const tasks = actividades.map((actividad, index) => {
      const startDate = isValidDate(actividad.fechaInicio) ?
        actividad.fechaInicio : new Date().toISOString().split('T')[0];

      const endDate = isValidDate(actividad.fechaFin) ?
        actividad.fechaFin : new Date(Date.now() + 86400000).toISOString().split('T')[0];

      return {
        id: `Task_${index + 1}`,
        name: actividad.nombre || `Actividad ${index + 1}`,
        start: startDate,
        end: endDate,
        progress: actividad.progreso || 0,
        dependencies: ''
      };
    });

    if (tasks.length === 0) {
      ganttContainer.innerHTML = `
                <h3>Diagrama de Gantt - ${obra.nombre}</h3>
                <div class="alert alert-info" style="margin-top: 20px;">
                    No hay actividades registradas para esta obra.
                </div>
                <button class="btn btn-secondary" onclick="this.parentElement.style.display='none'"
                    style="margin-top: 10px;">
                    Cerrar diagrama
                </button>
            `;
      ganttContainer.style.display = 'block'; 
      return;
    }

    ganttContainer.innerHTML = `
            <h3>Diagrama de Gantt - ${obra.nombre}</h3>
            <div id="gantt-chart" style="height: 400px; margin-top: 20px;"></div>
            <button class="btn btn-secondary" onclick="this.parentElement.style.display='none'"
                style="margin-top: 10px;">
                Cerrar diagrama
            </button>
        `;

    try {
      if (typeof Gantt === 'undefined') {
        throw new Error('Frappe Gantt library no está cargada.');
      }
      const gantt = new Gantt("#gantt-chart", tasks, {
        view_mode: 'Day',
        language: 'es',
        custom_popup_html: function(task) {
          return `
                        <div class="gantt-popup">
                            <h5>${task.name}</h5>
                            <p>Inicio: ${task.start.toLocaleDateString()}</p>
                            <p>Fin: ${task.end.toLocaleDateString()}</p>
                            <p>Progreso: ${task.progress}%</p>
                        </div>
                    `;
        }
      });
    } catch (ganttError) {
      console.error('Error al inicializar gráfico Gantt:', ganttError);
      ganttContainer.innerHTML += `
                <div class="alert alert-danger" style="margin-top: 20px;">
                    Error al mostrar el diagrama Gantt: ${ganttError.message}. Verifique que la librería esté cargada y las fechas sean válidas.
                </div>
            `;
    }
    ganttContainer.style.display = 'block'; 
  } catch (error) {
    console.error('Error al mostrar gráfico Gantt:', error);
    if (window.notificationSystem) { 
      window.notificationSystem.show('Error al mostrar diagrama Gantt', 'error');
    } else {
      alert('Error al mostrar diagrama Gantt: ' + error.message);
    }
  }
}