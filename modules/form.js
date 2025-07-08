function setupForms() {
  try {
    if (!window.dataManager) {
      throw new Error("DataManager no está disponible");
    }

    const actividadBtn = document.querySelector('#actividades .btn-primary');
    if (actividadBtn) {
      actividadBtn.innerHTML = '<i class="fas fa-plus"></i> Nueva Actividad';
      actividadBtn.onclick = function() {
        const obraSelect = document.getElementById('obra-select');
        const nombreActividad = document.getElementById('nombre-actividad');
        const fechaInicio = document.getElementById('fecha-inicio-actividad');
        const fechaFin = document.getElementById('fecha-fin-actividad');

        if (!obraSelect.value || !nombreActividad.value || !fechaInicio.value || !fechaFin.value) {
          window.showAlert('Complete todos los campos', 'warning');
          return;
        }

        if (new Date(fechaFin.value) < new Date(fechaInicio.value)) {
          window.showAlert('La fecha de fin debe ser posterior o igual a la de inicio', 'warning');
          return;
        }

        const actividad = {
          obraId: obraSelect.value,
          nombre: nombreActividad.value,
          fechaInicio: fechaInicio.value,
          fechaFin: fechaFin.value,
          progreso: 0,
          materiales: []
        };

        window.dataManager.add('actividades', actividad);
        nombreActividad.value = '';
        fechaInicio.value = '';
        fechaFin.value = '';
        window.loadTables();
        window.showAlert('Actividad registrada', 'success');
      };
    }

    const obraBtn = document.querySelector("#obras .btn-primary");
    if (obraBtn) {
      obraBtn.innerHTML = '<i class="fas fa-plus"></i> Nueva Obra';
      obraBtn.onclick = () => {}; 
      obraBtn.addEventListener("click", () => {
        const inputs = document.querySelectorAll("#obras .form-input");
        const values = Array.from(inputs).map((i) => i.value.trim());

        if (values.some((v) => !v)) {
          showAlert("Complete todos los campos", "warning");
          return;
        }

        const obra = {
          codigo: values[0],
          nombre: values[1],
          objeto: values[2],
          valor: parseInt(values[3]),
          duracion: parseInt(values[4]),
          fechaInicio: values[5],
          progreso: 0,
          estado: "Activa",
        };

        window.dataManager.add("obras", obra);
        inputs.forEach((i) => (i.value = ""));
        window.loadTables();
        showAlert("Obra registrada", "success");
      });
    }

    const materialBtn = document.querySelector("#materiales .btn-primary");
    if (materialBtn) {
      materialBtn.innerHTML = '<i class="fas fa-plus"></i> Nuevo Material';
      materialBtn.onclick = () => {}; 
      materialBtn.addEventListener("click", () => {
        const inputs = document.querySelectorAll("#materiales .form-input");
        const values = Array.from(inputs).map((i) => i.value.trim());
        const select = document.querySelector("#materiales select");

        if (
          values.some((v) => !v) ||
          !select.value ||
          select.value === "Seleccionar unidad"
        ) {
          showAlert("Complete todos los campos", "warning");
          return;
        }

        const material = {
          codigo: values[0],
          nombre: values[1],
          unidad: select.value,
          precio: parseInt(values[2]),
          stock: 0,
          minimo: 0,
        };

        window.dataManager.add("materiales", material);
        inputs.forEach((i) => (i.value = ""));
        select.selectedIndex = 0;
        window.loadTables();
        showAlert("Material registrado", "success");
      });
    }

    window.editActividad = function(actividadId) {
      try {
        const actividades = window.dataManager.get('actividades');
        const actividad = actividades.find(a => a.id === actividadId);

        if (!actividad) {
          throw new Error('Actividad no encontrada');
        }

        document.getElementById('obra-select').value = actividad.obraId;
        document.getElementById('nombre-actividad').value = actividad.nombre;
        document.getElementById('fecha-inicio-actividad').value = actividad.fechaInicio;
        document.getElementById('fecha-fin-actividad').value = actividad.fechaFin;

        const actividadBtn = document.querySelector('#actividades .btn-primary');
        actividadBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
        actividadBtn.onclick = function() {
          saveActividadChanges(actividad.id); 
        };

        window.showAlert(`Editando actividad: ${actividad.nombre}`, 'info');
      } catch (error) {
        console.error('Error al editar actividad:', error);
        window.showAlert('Error al editar actividad', 'error');
      }
    };

    function saveActividadChanges(actividadId) {
      try {
        const actividades = window.dataManager.get("actividades"); 
        const actividad = actividades.find((a) => a.id === actividadId);
        if (!actividad) {
          throw new Error("Actividad no encontrada");
        }

        const obraSelect = document.getElementById("obra-select");
        const nombreActividad = document.getElementById("nombre-actividad");
        const fechaInicio = document.getElementById("fecha-inicio-actividad");
        const fechaFin = document.getElementById("fecha-fin-actividad");

        if (
          !obraSelect.value ||
          !nombreActividad.value ||
          !fechaInicio.value ||
          !fechaFin.value
        ) {
          showAlert("Complete todos los campos", "warning");
          return;
        }

        if (new Date(fechaFin.value) < new Date(fechaInicio.value)) {
          showAlert(
            "La fecha de fin debe ser posterior a la de inicio",
            "warning"
          );
          return;
        }

        actividad.obraId = obraSelect.value;
        actividad.nombre = nombreActividad.value;
        actividad.fechaInicio = fechaInicio.value;
        actividad.fechaFin = fechaFin.value;

        window.dataManager.save("actividades", actividades); 

        const actividadBtn = document.querySelector(
          "#actividades .btn-primary"
        );
        actividadBtn.innerHTML = '<i class="fas fa-plus"></i> Nueva Actividad';
        actividadBtn.onclick = () => {
          nombreActividad.value = "";
          fechaInicio.value = "";
          fechaFin.value = "";
          setupForms(); 
        };

        window.loadTables(); 
        window.showAlert("Cambios guardados exitosamente", "success"); showAlert
      } catch (error) {
        console.error("Error al guardar actividad:", error);
        window.showAlert("Error al guardar cambios", "error"); 
      }
    }
  } catch (error) {
    console.error("Error al configurar formularios:", error);
    window.showAlert("Error al configurar formularios", "error"); 
  }
}