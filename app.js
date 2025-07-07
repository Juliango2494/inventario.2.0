let notificationSystem, dataManager;

function initializeApp() {
  if (
    typeof DataManager === "undefined" ||
    typeof NotificationSystem === "undefined"
  ) {
    console.error("Dependencias no cargadas! Reintentando...");
    setTimeout(initializeApp, 100);
    return;
  }

  try {
    dataManager = new DataManager();
    notificationSystem = new NotificationSystem();

    window.dataManager = window.dataManager || dataManager;
    window.notificationSystem = window.notificationSystem || notificationSystem;

    setupTabs();
    setupForms();
    setupFileUpload();
    setupAuth();
    setupCalendar();
    setupChat();
    setupGantt();
    setupQuickActions();
    document.querySelectorAll(".btn-edit-actividad").forEach((btn) => {
      btn.addEventListener("click", function () {
        const actividadId = this.getAttribute("data-id");
        editActividad(actividadId);
      });
    });
    if (dataManager && typeof dataManager.get === "function") {
      loadTables();
      updateStats();
      console.log("Aplicación inicializada correctamente");
    } else {
      console.error("Error: DataManager no funciona correctamente");
      throw new Error("DataManager no funciona correctamente");
    }
  } catch (error) {
    console.error("Error al inicializar la aplicación:", error);
    if (notificationSystem) {
      notificationSystem.show("Error al inicializar la aplicación", "error");
    }
  }
}

window.showAlert = function (message, type) {
  if (window.notificationSystem) {
    window.notificationSystem.show(message, type);
  } else {
    alert(`${type.toUpperCase()}: ${message}`);
  }
};

function loadTables() {
  if (!dataManager || typeof dataManager.get !== "function") {
    console.error("DataManager no disponible para loadTables");
    return;
  }

  loadObrasTable();
  loadMaterialesTable();
  loadArchivosTable();
  loadActividadesTable();
  updateStats();
  checkMaterialAlerts();
}

function loadObrasTable() {
  try {
    const tbody = document.querySelector("#obras tbody");
    if (!tbody) return;

    const obras = dataManager.get("obras");
    tbody.innerHTML = obras
      .map(
        (obra) => `
            <tr>
                <td>${obra.codigo}</td>
                <td>${obra.nombre}</td>
                <td>$${obra.valor.toLocaleString()}</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${
                          obra.progreso
                        }%"></div>
                    </div>
                    ${obra.progreso}%
                </td>
                <td><span class="badge badge-success">${obra.estado}</span></td>
                <td>
                    <button class="btn btn-secondary view-gantt" data-obra="${
                      obra.id
                    }">
                        <i class="fas fa-chart-gantt"></i> Gantt
                    </button>
                    <button class="btn btn-secondary" onclick="editObra('${
                      obra.id
                    }')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </td>
            </tr>
        `
      )
      .join("");

    // Configurar eventos Gantt
    setupGantt();
  } catch (error) {
    console.error("Error cargando tabla de obras:", error);
    if (notificationSystem) {
      notificationSystem.show("Error al cargar tabla de obras", "error");
    }
  }
}
function loadMaterialesTable() {
  try {
    const tbody = document.querySelector("#materiales tbody");
    if (!tbody) return;

    const materiales = dataManager.get("materiales");
    tbody.innerHTML = materiales
      .map((material) => {
        const precio = material.precio !== null ? Number(material.precio) : 0;

        return `
                <tr>
                    <td>${material.codigo || ""}</td>
                    <td>${material.nombre || ""}</td>
                    <td>${material.unidad || ""}</td>
                    <td>$${precio.toLocaleString()}</td>
                    <td>${material.stock || 0} ${material.unidad || ""}</td>
                    <td>
                        <button class="btn btn-secondary" onclick="editMaterial('${
                          material.id
                        }')">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-secondary" onclick="deleteMaterial('${
                          material.id
                        }')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
      })
      .join("");
  } catch (error) {
    console.error("Error cargando tabla de materiales:", error);
    if (notificationSystem) {
      notificationSystem.show("Error al cargar tabla de materiales", "error");
    }
  }
}

function loadArchivosTable() {
  try {
    const tbody = document.querySelector("#archivos tbody");
    if (!tbody) return;

    const archivos = dataManager.get("archivos");
    tbody.innerHTML = archivos
      .map(
        (archivo) => `
            <tr>
                <td>${archivo.nombre}</td>
                <td>${archivo.tipo}</td>
                <td>${archivo.fecha}</td>
                <td><span class="badge badge-success">Procesado</span></td>
                <td>
                    <button class="btn btn-secondary"><i class="fas fa-download"></i></button>
                    <button class="btn btn-secondary"><i class="fas fa-eye"></i></button>
                </td>
            </tr>
        `
      )
      .join("");
  } catch (error) {
    console.error("Error cargando tabla de archivos:", error);
    if (notificationSystem) {
      notificationSystem.show("Error al cargar tabla de archivos", "error");
    }
  }
}

function loadActividadesTable() {
  try {
    const tbody = document.querySelector("#actividades tbody");
    const obraSelect = document.getElementById("obra-select");

    if (!tbody || !obraSelect) return;

    // Obtener datos
    const obras = dataManager.get("obras");
    const actividades = dataManager.get("actividades");

    // Poblar selector de obras
    obraSelect.innerHTML = '<option value="">Seleccionar obra</option>';
    obras.forEach((obra) => {
      const option = document.createElement("option");
      option.value = obra.id;
      option.textContent = obra.nombre;
      obraSelect.appendChild(option);
    });

    // Poblar tabla de actividades
    tbody.innerHTML = actividades
      .map((actividad) => {
        const obra = obras.find((o) => o.id === actividad.obraId);
        return `
                <tr>
                    <td>${obra ? obra.nombre : "Desconocida"}</td>
                    <td>${actividad.nombre || ""}</td>
                    <td>${actividad.fechaInicio || ""}</td>
                    <td>${actividad.fechaFin || ""}</td>
                    <td>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${
                              actividad.progreso || 0
                            }%"></div>
                        </div>
                        ${actividad.progreso || 0}%
                    </td>
                    <td>
                        <button class="btn btn-secondary" onclick="editActividad('${
                          actividad.id
                        }')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `;
      })
      .join("");
  } catch (error) {
    console.error("Error cargando tabla de actividades:", error);
    if (notificationSystem) {
      notificationSystem.show("Error al cargar actividades", "error");
    }
  }
}
function editObra(obraId) {
  try {
    const obra = dataManager.getObraById(obraId);
    if (!obra) {
      throw new Error("Obra no encontrada");
    }

    const inputs = document.querySelectorAll("#obras .form-input");
    inputs[0].value = obra.codigo;
    inputs[1].value = obra.nombre;
    inputs[2].value = obra.objeto;
    inputs[3].value = obra.valor;
    inputs[4].value = obra.duracion;
    inputs[5].value = obra.fechaInicio;

    const obraBtn = document.querySelector("#obras .btn-primary");
    obraBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
    obraBtn.onclick = () => saveObraChanges(obraId);

    if (notificationSystem) {
      notificationSystem.show(`Editando obra: ${obra.nombre}`, "info");
    }
  } catch (error) {
    console.error("Error al editar obra:", error);
    if (notificationSystem) {
      notificationSystem.show("Error al editar obra", "error");
    }
  }
}
function editMaterial(materialId) {
  try {
    const material = dataManager.getMaterialById(materialId);
    if (!material) {
      throw new Error("Material no encontrado");
    }

    const inputs = document.querySelectorAll("#materiales .form-input");
    inputs[0].value = material.codigo;
    inputs[1].value = material.nombre;
    inputs[2].value = material.precio;

    const select = document.querySelector("#materiales select");
    if (select) {
      select.value = material.unidad || "Seleccionar unidad";
    }

    const materialBtn = document.querySelector("#materiales .btn-primary");
    materialBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
    materialBtn.onclick = () => saveMaterialChanges(materialId);

    if (notificationSystem) {
      notificationSystem.show(`Editando material: ${material.nombre}`, "info");
    }
  } catch (error) {
    console.error("Error al editar material:", error);
    if (notificationSystem) {
      notificationSystem.show("Error al editar material", "error");
    }
  }
}
function saveMaterialChanges(materialId) {
  try {
    const material = dataManager.getMaterialById(materialId);
    if (!material) {
      throw new Error("Material no encontrado");
    }

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

    material.codigo = values[0];
    material.nombre = values[1];
    material.unidad = select.value;
    material.precio = parseInt(values[2]);

    dataManager.save("materiales", dataManager.get("materiales"));

    const materialBtn = document.querySelector("#materiales .btn-primary");
    materialBtn.innerHTML = '<i class="fas fa-plus"></i> Nuevo Material';
    materialBtn.onclick = () => setupForms();

    inputs.forEach((i) => (i.value = ""));
    select.selectedIndex = 0;

    loadTables();
    showAlert("Cambios guardados exitosamente", "success");
  } catch (error) {
    console.error("Error al guardar cambios de material:", error);
    showAlert("Error al guardar cambios", "error");
  }
}
function saveObraChanges(obraId) {
  try {
    const obra = dataManager.getObraById(obraId);
    if (!obra) {
      throw new Error("Obra no encontrada");
    }

    const inputs = document.querySelectorAll("#obras .form-input");
    const values = Array.from(inputs).map((i) => i.value.trim());

    if (values.some((v) => !v)) {
      showAlert("Complete todos los campos", "warning");
      return;
    }

    obra.codigo = values[0];
    obra.nombre = values[1];
    obra.objeto = values[2];
    obra.valor = parseInt(values[3]);
    obra.duracion = parseInt(values[4]);
    obra.fechaInicio = values[5];

    dataManager.save("obras", dataManager.get("obras"));

    const obraBtn = document.querySelector("#obras .btn-primary");
    obraBtn.innerHTML = '<i class="fas fa-plus"></i> Nueva Obra';
    obraBtn.onclick = () => setupForms();

    loadTables();
    showAlert("Cambios guardados exitosamente", "success");
  } catch (error) {
    console.error("Error al guardar cambios de obra:", error);
    showAlert("Error al guardar cambios", "error");
  }
}

function updateStats() {
  try {
    const stats = document.querySelectorAll(".stat-number");
    const obras = dataManager.get("obras").length;
    const materiales = dataManager.get("materiales").length;
    const alertas = dataManager
      .get("materiales")
      .filter((m) => m.stock < (m.minimo || 10)).length;

    if (stats[0]) stats[0].textContent = obras;
    if (stats[1]) stats[1].textContent = materiales;
    if (stats[2]) stats[2].textContent = alertas;
  } catch (error) {
    console.error("Error actualizando estadísticas:", error);
  }
}

function checkMaterialAlerts() {
  try {
    const materiales = dataManager.get("materiales");
    const alertas = [];

    materiales.forEach((material) => {
      if (material.stock < (material.minimo || 10)) {
        alertas.push({
          type: "warning",
          message: `Stock bajo de ${material.nombre} (${material.stock} ${material.unidad})`,
          action: `Comprar más ${material.nombre}`,
        });
      }
    });

    if (alertas.length > 0) {
      const notificationCount = document.getElementById("notificationCount");
      if (notificationCount) {
        notificationCount.textContent = alertas.length;
        notificationCount.style.display = "flex";
      }
    } else {
      const notificationCount = document.getElementById("notificationCount");
      if (notificationCount) {
        notificationCount.style.display = "none";
      }
    }
  } catch (error) {
    console.error("Error verificando alertas de materiales:", error);
  }
}

function setupTabs() {
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab");

      document
        .querySelectorAll(".nav-tab")
        .forEach((t) => t.classList.remove("active"));
      document
        .querySelectorAll(".tab-content")
        .forEach((c) => c.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(targetTab).classList.add("active");

      if (targetTab !== "inicio") loadTables();
    });
  });
}

function setupQuickActions() {
  document.querySelectorAll(".quick-action").forEach((action) => {
    action.addEventListener("click", function () {
      const actionType = this.getAttribute("data-action");

      switch (actionType) {
        case "nueva-obra":
          document.querySelector('[data-tab="obras"]').click();
          break;

        case "agregar-material":
          document.querySelector('[data-tab="materiales"]').click();
          break;

        case "consultar-ia":
          document.querySelector('[data-tab="ia"]').click();
          break;

        case "cargar-archivo":
          document.querySelector('[data-tab="archivos"]').click();
          break;
      }

      if (notificationSystem) {
        notificationSystem.show(
          `Acción rápida: ${this.querySelector("h3").textContent}`,
          "info"
        );
      }
    });
  });
}
window.editActividad = function (actividadId) {
  try {
    const actividades = window.dataManager.get("actividades");
    const actividad = actividades.find((a) => a.id === actividadId);

    if (!actividad) {
      throw new Error("Actividad no encontrada");
    }

    const obraSelect = document.getElementById("obra-select");
    const nombreInput = document.getElementById("nombre-actividad");
    const fechaInicioInput = document.getElementById("fecha-inicio-actividad");
    const fechaFinInput = document.getElementById("fecha-fin-actividad");
    const actividadBtn = document.querySelector("#actividades .btn-primary");

    obraSelect.value = actividad.obraId;
    nombreInput.value = actividad.nombre;
    fechaInicioInput.value = actividad.fechaInicio;
    fechaFinInput.value = actividad.fechaFin;

    actividadBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
    actividadBtn.onclick = function () {
      saveActividadChanges(actividadId);
    };

    if (window.notificationSystem) {
      window.notificationSystem.show(
        `Editando actividad: ${actividad.nombre}`,
        "info"
      );
    }
  } catch (error) {
    console.error("Error al editar actividad:", error);
    if (window.notificationSystem) {
      window.notificationSystem.show("Error al editar actividad", "error");
    }
  }
};

window.saveActividadChanges = function(actividadId) {
    try {
        // Obtener todas las actividades
        const actividades = window.dataManager.get('actividades');
        
        // Buscar el índice de la actividad a editar
        const index = actividades.findIndex(a => a.id === actividadId);
        
        if (index === -1) {
            throw new Error('Actividad no encontrada');
        }

        // Obtener valores del formulario
        const obraSelect = document.getElementById('obra-select');
        const nombreInput = document.getElementById('nombre-actividad');
        const fechaInicioInput = document.getElementById('fecha-inicio-actividad');
        const fechaFinInput = document.getElementById('fecha-fin-actividad');

        // Validaciones
        if (!obraSelect.value || !nombreInput.value || !fechaInicioInput.value || !fechaFinInput.value) {
            window.showAlert('Complete todos los campos', 'warning');
            return;
        }

        if (new Date(fechaFinInput.value) < new Date(fechaInicioInput.value)) {
            window.showAlert('La fecha de fin debe ser posterior a la de inicio', 'warning');
            return;
        }

        // Actualizar la actividad existente (no crear nueva)
        actividades[index] = {
            ...actividades[index], // Mantener los valores existentes
            obraId: obraSelect.value,
            nombre: nombreInput.value,
            fechaInicio: fechaInicioInput.value,
            fechaFin: fechaFinInput.value
        };

        // Guardar cambios
        window.dataManager.save('actividades', actividades);

        // Restaurar el formulario
        nombreInput.value = '';
        fechaInicioInput.value = '';
        fechaFinInput.value = '';
        
        // Restaurar el botón a su estado original
        const actividadBtn = document.querySelector('#actividades .btn-primary');
        actividadBtn.innerHTML = '<i class="fas fa-plus"></i> Nueva Actividad';
        actividadBtn.onclick = function() {
            // Aquí va tu función original para crear nuevas actividades
            setupForms();
        };

        // Recargar la tabla
        if (window.loadTables) {
            window.loadTables();
        }

        window.showAlert('Actividad actualizada correctamente', 'success');
    } catch (error) {
        console.error('Error al guardar actividad:', error);
        window.showAlert('Error al guardar actividad', 'error');
    }
};
window.editActividad = editActividad;
window.saveActividadChanges = saveActividadChanges;
window.loadTables = loadTables;
window.setupForms = setupForms;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
