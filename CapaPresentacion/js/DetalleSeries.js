
let idEditar = 0;

let tablaPosiciones;
let tablaPartidos;

// Variables globales para guardar los IDs de la URL
let v_IdTorneo = 0;
let v_IdCategoria = 0;
let v_IdSerie = 0;

function ObtenerFecha() {
    const d = new Date();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${d.getFullYear()}`;
}

$(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Capturamos los 3 parámetros
    const idTorneoUrl = urlParams.get('idTorneo');
    const idCategoriaUrl = urlParams.get('idCategoria');
    const idSerieUrl = urlParams.get('idSerie');

    if (!idTorneoUrl || !idCategoriaUrl || !idSerieUrl || idTorneoUrl.trim() === "") {
        MensajeToast("Error de acceso", "Faltan parámetros para ver los detalles de la serie.", "error");
        setTimeout(function () {
            window.location.href = 'Partidos.aspx';
        }, 2200);
    } else {
        // Los guardamos en las variables globales como enteros
        v_IdTorneo = parseInt(idTorneoUrl);
        v_IdCategoria = parseInt(idCategoriaUrl);
        v_IdSerie = parseInt(idSerieUrl);

        $("#txtFecha").datepicker({
            todayHighlight: true,
            language: "es",        // Activa el archivo de idioma que agregaste
            format: "dd/mm/yyyy",   // Define el formato visual de la fecha
            autoclose: true
        });

        $("#txtFecha").val(ObtenerFecha());

        $('#txtHora').timepicker({ showMeridian: false });

        // Cargamos ambas tablas inmediatamente
        cargarTablaPosiciones();
        cargarFixture();
        cargarCombosModal();
    }
    
});

// 1. CARGAR TABLA DE POSICIONES
function cargarTablaPosiciones() {
    tablaPosiciones = $("#tbPosiciones").DataTable({
        responsive: true,
        destroy: true, // Permite recargar la tabla si es necesario
        "ajax": {
            "url": 'Partidos.aspx/ListaTablaPosiciones',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                let request = {
                    IdTorneo: v_IdTorneo,
                    IdCategoria: v_IdCategoria,
                    IdSerie: v_IdSerie
                };
                return JSON.stringify(request);
            },
            "dataSrc": function (json) {
                return json.d.Estado ? json.d.Data : [];
            }
        },
        "columns": [
            // Posición (Auto-generada por DataTables basándose en el orden del SQL)
            {
                "data": null,
                "className": "text-center fw-bold text-muted",
                "render": function (data, type, row, meta) {
                    return meta.row + 1; // 1, 2, 3, 4...
                }
            },
            // Nombre y Logo del Club
            {
                "data": null,
                "className": "text-start",
                "render": function (data, type, row) {
                    let logo = row.LogoUrl ? row.LogoUrl : 'Logos/sinLogo.png';
                    return `
                        <div class="d-flex align-items-center">
                            <div class="w-30px h-30px rounded-circle bg-light d-flex align-items-center justify-content-center me-2 overflow-hidden shadow-sm">
                                <img src="${logo}" alt="" class="mw-100 mh-100" style="object-fit: contain;">
                            </div>
                            <div class="fw-bold text-dark fs-13px">${row.NombreClub}</div>
                        </div>
                    `;
                }
            },
            { "data": "PJ", "className": "text-center bg-light bg-opacity-50 fw-semibold" },
            { "data": "PG", "className": "text-center text-success" },
            { "data": "PE", "className": "text-center text-muted" },
            { "data": "PP", "className": "text-center text-danger" },
            { "data": "GF", "className": "text-center" },
            { "data": "GC", "className": "text-center" },
            // Diferencia de Goles (Con símbolo + y -)
            {
                "data": "DG",
                "className": "text-center fw-bold",
                "render": function (data) {
                    if (data > 0) return `<span class="text-success">+${data}</span>`;
                    if (data < 0) return `<span class="text-danger">${data}</span>`;
                    return data;
                }
            },
            // PUNTOS TOTALES (Resaltado)
            {
                "data": "Puntos",
                "className": "text-center fw-bold bg-primary bg-opacity-10 text-primary fs-15px"
            }
        ],
        "bSort": false,  // CRÍTICO: Evita que el frontend reordene y respeta tu SQL
        "paging": false, // En tablas de posiciones se muestran todos los equipos de golpe
        "searching": false, // No se necesita buscar en un grupo de 6 o 10 equipos
        "info": false,
        "language": { "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json" }
    });
}

// ==========================================
// 2. CARGAR FIXTURE (PARTIDOS PROGRAMADOS)
// ==========================================
function cargarFixture() {
    tablaPartidos = $("#tbPartidos").DataTable({
        responsive: true,
        destroy: true,
        "ajax": {
            "url": 'Partidos.aspx/ListaPartidosSerie',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                let request = {
                    IdTorneo: v_IdTorneo,
                    IdCategoria: v_IdCategoria,
                    IdSerie: v_IdSerie
                };
                return JSON.stringify(request);
            },
            "dataSrc": function (json) {
                return json.d.Estado ? json.d.Data : [];
            }
        },
        "columns": [
            // Fecha y Hora
            {
                "data": null,
                "className": "text-center align-middle",
                "render": function (data, type, row) {
                    return `<div class="fw-semibold text-dark">${row.Fecha}</div>
                            <div class="fs-12px text-muted"><i class="fa fa-clock me-1"></i>${row.Hora}</div>`;
                }
            },
            // Fase
            { "data": "NombreFase", "className": "text-center align-middle fs-13px" },
            // Equipo Local
            {
                "data": null,
                "className": "text-end align-middle",
                "render": function (data, type, row) {
                    let logo = row.LogoLocal ? row.LogoLocal : 'Logos/sinLogo.png';
                    return `<span class="fw-bold fs-13px me-2 text-dark">${row.ClubLocal}</span>
                            <img src="${logo}" width="30" height="30" class="rounded-circle border shadow-sm" style="object-fit: contain; background: white;">`;
                }
            },
            // MARCADOR (VS o Goles)
            {
                "data": null,
                "className": "text-center align-middle",
                "render": function (data, type, row) {
                    if (row.IdEstado === 1) {
                        return `<span class="badge bg-light text-dark border fs-14px px-3 py-2">VS</span>`;
                    } else {
                        return `<span class="badge bg-dark fs-14px px-3 py-2">${row.GolesLocal} - ${row.GolesVisitante}</span>`;
                    }
                }
            },
            // Equipo Visitante
            {
                "data": null,
                "className": "text-start align-middle",
                "render": function (data, type, row) {
                    let logo = row.LogoVisitante ? row.LogoVisitante : 'Logos/sinLogo.png';
                    return `<img src="${logo}" width="30" height="30" class="rounded-circle border shadow-sm me-2" style="object-fit: contain; background: white;">
                            <span class="fw-bold fs-13px text-dark">${row.ClubVisitante}</span>`;
                }
            },
            // Cancha
            { "data": "Cancha", "className": "text-center align-middle fs-12px text-muted" },
            // Estado (Programado / Finalizado)
            {
                "data": "NombreEstado",
                "className": "text-center align-middle",
                "render": function (data, type, row) {
                    if (row.IdEstado === 1) return `<span class="badge bg-info bg-opacity-20 text-info px-2 py-1"><i class="fa fa-calendar me-1"></i>${data}</span>`;
                    if (row.IdEstado === 2) return `<span class="badge bg-success bg-opacity-20 text-success px-2 py-1"><i class="fa fa-check me-1"></i>${data}</span>`;
                    return `<span class="badge bg-warning bg-opacity-20 text-warning px-2 py-1">${data}</span>`;
                }
            },
            // Opciones (Botones dinámicos según el estado)
            {
                "data": null,
                "className": "text-center align-middle",
                "render": function (data, type, row) {
                    if (row.IdEstado === 1) {
                        return `<button class="btn btn-lime btn-sm px-2 py-1 fw-bold btn-resultado" title="Mesa de Control / Resultados" data-id="${row.IdPartido}"><i class="fa fa-play me-1"></i>Iniciar</button>`;
                    }
                    return `<button class="btn btn-white border btn-sm px-2 py-1 fw-bold text-gray-700 btn-detalles" title="Ver Acta" data-id="${row.IdPartido}"><i class="fa fa-file-alt me-1"></i>Acta</button>`;
                }
            }
        ],
        "order": [], // Mantiene el orden por fecha y hora de tu SQL
        "language": { "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json" }
    });
}

function cargarCombosModal() {
    // A) Cargar Fases (Igual que antes)
    $.ajax({
        type: "POST",
        url: "DetallesSerie.aspx/ListaFasesCombo",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            let html = '<option value="">-- Seleccione Fase --</option>';
            if (response.d.Estado) {
                response.d.Data.forEach(fase => {
                    html += `<option value="${fase.IdFase}">${fase.NombreFase}</option>`;
                });
            }
            $("#cboFase").html(html);
        }
    });

    // B) Cargar Equipos con Logos
    let requestEquipos = {
        IdTorneo: v_IdTorneo,
        IdCategoria: v_IdCategoria,
        IdSerie: v_IdSerie
    };

    $.ajax({
        type: "POST",
        url: "DetallesSerie.aspx/ListaEquiposSerieCombo",
        data: JSON.stringify(requestEquipos),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            let html = '<option value=""></option>';
            if (response.d.Estado) {
                response.d.Data.forEach(equipo => {
                    // Inyectamos el LogoUrl en el data-logo
                    html += `<option value="${equipo.IdEquipo}" 
                                     data-logo="${equipo.LogoUrl}" 
                                     data-nombre="${equipo.NombreClub}">
                                ${equipo.NombreClub}
                             </option>`;
                });
            }
            $("#cboEquipoLocal, #cboEquipoVisitante").html(html);

            // Una vez cargados los options, inicializamos Select2
            inicializarSelect2Equipos();
        }
    });
}

// ==========================================
// 2. CONFIGURACIÓN DE SELECT2
// ==========================================
function inicializarSelect2Equipos() {
    $("#cboEquipoLocal, #cboEquipoVisitante").select2({
        dropdownParent: $('#modalProgramar'),
        width: '100%',
        placeholder: "-- Seleccione Club --",
        templateResult: formatoResultadosEquipo
    });
}

function formatoResultadosEquipo(estado) {
    if (!estado.id) { return estado.text; }

    let logoUrl = estado.element.dataset.logo;
    let nombre = estado.element.dataset.nombre;
    let logo = (logoUrl && logoUrl !== "null") ? logoUrl : 'Logos/sinLogo.png';

    // Diseño compacto para la lista desplegable
    return $(`
        <div class="d-flex align-items-center py-1">
            <div class="w-25px h-25px rounded-circle d-flex align-items-center justify-content-center bg-light overflow-hidden shadow-sm me-2">
                <img src="${logo}" alt="" class="mw-100 mh-100" style="object-fit: contain;">
            </div>
            <div class="fw-bold text-dark fs-13px">${nombre}</div>
        </div>
    `);
}

// ==========================================
// 3. EVENTOS: ACTUALIZAR IMÁGENES AL SELECCIONAR
// ==========================================
$("#cboEquipoLocal").on("change", function () {
    let $selected = $(this).find(':selected');
    let logo = $selected.data("logo");

    // Si no hay logo o está vacío, ponemos el default
    logo = (logo && logo !== "null") ? logo : 'Logos/sinLogo.png';
    $("#imgLocal").attr("src", logo);
    validarCruceEquipos(); // Verificamos que no sea el mismo equipo
});

$("#cboEquipoVisitante").on("change", function () {
    let $selected = $(this).find(':selected');
    let logo = $selected.data("logo");

    logo = (logo && logo !== "null") ? logo : 'Logos/sinLogo.png';
    $("#imgVisitante").attr("src", logo);
    validarCruceEquipos();
});

// Extraemos la validación a una función limpia
function validarCruceEquipos() {
    let idLocal = $("#cboEquipoLocal").val();
    let idVisitante = $("#cboEquipoVisitante").val();

    if (idLocal !== "" && idVisitante !== "" && idLocal === idVisitante) {
        MensajeToast("Enfrentamiento Inválido", "Un equipo no puede jugar contra sí mismo.", "warning");
        // Reseteamos el visitante por defecto
        $("#cboEquipoVisitante").val("").trigger("change");
    }
}

$("#btnAbrirModalProgramar").on("click", function () {

    // 1. Resetear los Selects 
    // (Usamos .trigger('change') para que Select2 se entere de que lo vaciamos y actualice la UI)
    $("#cboFase").val("");
    $("#cboEquipoLocal").val("").trigger("change");
    $("#cboEquipoVisitante").val("").trigger("change");

    // 2. Resetear las Imágenes de los escudos
    $("#imgLocal").attr("src", "Logos/sinLogo.png");
    $("#imgVisitante").attr("src", "Logos/sinLogo.png");

    // 3. Resetear los campos de texto
    $("#txtCancha").val("");
    //$("#txtHora").val("");

    // Volvemos a poner la fecha de hoy usando tu excelente función
    $("#txtFecha").val(ObtenerFecha());

    // Opcional: Poner el foco en el primer campo para que el usuario escriba más rápido
    setTimeout(() => {
        $("#cboFase").focus();
    }, 500);

    // 4. Mostrar el Modal
    $("#modalProgramar").modal("show");
});
function habilitarBotonPartido() {
    $('#btnGuardarPartido').prop('disabled', false).html('<i class="fa fa-save me-1"></i>Confirmar Partido');
}

$("#btnGuardarPartido").on("click", function () {
    // MAGIA: Guardamos la referencia del botón actual antes de perder el scope
    let $btn = $(this);

    // 1. Recolección de datos
    let idFase = $("#cboFase").val();
    let fechaStr = $("#txtFecha").val().trim();
    let horaStr = $("#txtHora").val().trim();
    let canchaStr = $("#txtCancha").val().trim();

    let idLocal = $("#cboEquipoLocal").val();
    let idVisitante = $("#cboEquipoVisitante").val();

    // Cortamos la fecha y la hora para armar un objeto Date exacto
    let partesFecha = fechaStr.split('/');
    let partesHora = horaStr.split(':');

    // Date(Año, Mes (0-11), Día, Hora, Minuto, Segundo)
    let fechaPartidoExacta = new Date(
        partesFecha[2],
        partesFecha[1] - 1,
        partesFecha[0],
        partesHora[0],
        partesHora[1],
        0
    );

    let ahora = new Date(); // Captura la fecha y hora de este mismo segundo

    // 2. Validaciones Fail-Fast Front-End
    if (idFase === "") {
        MensajeToast("Campo requerido", "Debe seleccionar la Fase del torneo.", "warning");
        $("#cboFase").focus();
        return;
    }
    if (fechaStr === "" || horaStr === "") {
        MensajeToast("Campo requerido", "La fecha y la hora son obligatorias.", "warning");
        return;
    }
    if (canchaStr === "") {
        MensajeToast("Campo requerido", "Debe especificar la cancha donde se jugará.", "warning");
        $("#txtCancha").focus();
        return;
    }
    if (idLocal === "" || idVisitante === "") {
        MensajeToast("Campo requerido", "Debe seleccionar al equipo Local y al Visitante.", "warning");
        return;
    }
    if (idLocal === idVisitante) {
        MensajeToast("Enfrentamiento inválido", "Un equipo no puede jugar contra sí mismo.", "warning");
        return;
    }

    // 3. Armar el DTO para C#
    const objeto = {
        IdEquipoLocal: parseInt(idLocal),
        IdEquipoVisitante: parseInt(idVisitante),
        IdFase: parseInt(idFase),
        Fecha: fechaStr,
        Hora: horaStr,
        Cancha: canchaStr
    };

    if (fechaPartidoExacta < ahora) {
        // En lugar de un Toast y un return, le preguntamos
        swal({
            title: "Fecha en el pasado",
            text: "Está programando un partido con una fecha u hora que ya pasó. ¿Es un registro atrasado?",
            icon: "warning",
            buttons: {
                cancel: {
                    text: 'Cancelar',
                    value: null,
                    visible: true,
                    className: 'btn btn-danger',
                    closeModal: true,
                },
                confirm: {
                    text: 'Sí, registrar de todos modos',
                    value: true,
                    visible: true,
                    className: 'btn btn-indigo',
                    closeModal: true
                }
            }
        }).then((willSave) => {
            if (willSave) {
                // 4. Bloquear botón usando la variable $btn
                $btn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin me-1"></i>Guardando...');
                ejecutarGuardadoAJAX(objeto);
            }
        });
    } else {
        // Bloquear botón usando la variable $btn
        $btn.prop('disabled', true).html('<i class="fa fa-spinner fa-spin me-1"></i>Guardando...');
        ejecutarGuardadoAJAX(objeto);
    }
});

function ejecutarGuardadoAJAX(objeto) {
    $("#modalProgramar").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "DetallesSerie.aspx/ProgramarPartido",
        data: JSON.stringify({ objeto: objeto }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#modalProgramar").find("div.modal-content").LoadingOverlay("hide");

            alertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
            );

            if (response.d.Estado) {
                $("#modalProgramar").modal("hide");
                $("#txtCancha").val("");

                if (tablaPartidos) {
                    tablaPartidos.ajax.reload(null, false);
                } else {
                    cargarFixture();
                }
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#modalProgramar").find("div.modal-content").LoadingOverlay("hide");
            MensajeToast("¡Error Crítico!", "Fallo de comunicación con el servidor.", "error");
        },
        complete: function () {
            habilitarBotonPartido();
        }
    });
}


$('#tbPartidos tbody').on('click', '.btn-resultado', function () {

    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaPartidos.row(fila).data();

    $("#txtIdPartidoRe").val(data.IdPartido);

    $("#txtGolLocal").val("0");
    $("#txtGolVisitante").val("0");

    $("#txtGolPenalLocal").val("0");
    $("#txtGolPenalVisitante").val("0");

    $("#lblEquipoLocal").text(data.ClubLocal);
    $("#lblEquipoVisitante").text(data.ClubVisitante);

    $("#imgLocalResu").attr("src", data.LogoLocal || "Logos/sinLogo.png");
    $("#imgVisitanteResu").attr("src", data.LogoVisitante || "Logos/sinLogo.png");
    $("#modalResultados").modal("show");
});

function habilitarBoton() {
    $('#btnGuardarResultados').prop('disabled', false);
}

$("#btnGuardarResultados").on("click", function () {
    // Bloqueo inmediato
    $('#btnGuardarResultados').prop('disabled', true);

    let idPartido = $("#txtIdPartidoRe").val();

    if (idPartido === "" || idPartido === "0") {
        MensajeToast("Campo incompleto", "Por favor, seleccione un Partido.", "warning");
        habilitarBoton();
        return;
    }

    const golLocal = parseInt($("#txtGolLocal").val()) || 0;
    const golVisitante = parseInt($("#txtGolVisitante").val()) || 0;

    const golPenalLocal = parseInt($("#txtGolPenalLocal").val()) || 0;
    const golPenalVisitante = parseInt($("#txtGolPenalVisitante").val()) || 0;

    if (golPenalLocal < 0) {
        MensajeToast("Valor inválido", "Los goles de penal del equipo local no pueden ser números negativos.", "warning");
        $("#txtGolPenalLocal").focus();
        habilitarBoton();
        return;
    }

    if (golPenalVisitante < 0) {
        MensajeToast("Valor inválido", "Los goles de penal del equipo visitante no pueden ser números negativos.", "warning");
        $("#txtGolPenalVisitante").focus();
        habilitarBoton();
        return;
    }

    if (golLocal < 0) {
        MensajeToast("Valor inválido", "Los goles del equipo local no pueden ser números negativos.", "warning");
        $("#txtGolLocal").focus();
        habilitarBoton();
        return;
    }

    if (golVisitante < 0) {
        MensajeToast("Valor inválido", "Los goles del equipo visitante no pueden ser números negativos.", "warning");
        $("#txtGolVisitante").focus();
        habilitarBoton();
        return;
    }

    let arbitrajePagoLocal = $("#chkPagadoLocal").is(":checked");
    let arbitrajePagoVisitante = $("#chkPagadoVisitante").is(":checked");

    // 2. ARMAR EL OBJETO
    const objeto = {
        IdPartido: parseInt(idPartido),
        GolesLocal: golLocal,
        GolesVisitante: golVisitante,
        GolesPenalesLocal: golPenalLocal,
        GolesPenalesVisitante: golPenalVisitante,
        PagoArbitrajeLocal: arbitrajePagoLocal,
        PagoArbitrajeVisitante: arbitrajePagoVisitante
    };

    console.log("Objeto a enviar:", objeto);

    $("#modalResultados").find("div.modal-content").LoadingOverlay("show");

    setTimeout(function () {
        $("#modalResultados").find("div.modal-content").LoadingOverlay("hide");

        $("#modalResultados").modal("hide");

        MensajeToast("¡Atención!", "Prueba de datos.", "success", 2000);

        habilitarBoton();
    }, 2200);
});

// fin