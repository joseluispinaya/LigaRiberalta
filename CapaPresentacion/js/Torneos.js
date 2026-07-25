
let tablaData;
let idEditar = 0;

$(document).ready(function () {
    listaTorneos();
});

// consume microservicio
function listaTorneos() {
    // Si decides descomentar la destrucción de la tabla, mantenlo aquí
    // if ($.fn.DataTable.isDataTable("#tbData")) {
    //     $("#tbData").DataTable().destroy();
    //     $('#tbData tbody').empty();
    // }

    tablaData = $("#tbData").DataTable({
        responsive: true,
        "ajax": {
            "url": `${API_BASE_URL}/torneos/listaTorneos`,
            "type": "GET", // La API usa [HttpGet]
            "dataType": "json",
            // Ya no necesitas contentType ni data al ser un GET sencillo

            "dataSrc": function (json) {
                // Evaluamos directamente 'json' (ya no existe json.d)
                if (json.Estado) {
                    return json.Data;
                } else {
                    // Si el servidor responde pero el estado es false (ej. error en BD)
                    mostrarAlerta("Mensaje", json.Mensaje, "warning");
                    return [];
                }
            },
            "error": function (xhr, error, thrown) {
                // Captura si la API se cae, no está disponible o da error 500/404
                console.log("Error status:", xhr.status, "Detalles:", thrown);
                mostrarAlerta("¡Atención!", "Error de comunicación con el servidor.", "error");

                // 1. Ocultar forzosamente el mensaje de "Cargando..."
                $("#tbData_processing").hide();

                // 2. Colocar un mensaje manual en el cuerpo de la tabla (usamos colspan="4" porque tienes 4 columnas visibles)
                $("#tbData tbody").html('<tr><td colspan="4" class="text-center text-muted">No se pudieron cargar los datos debido a un error de conexión con la API.</td></tr>');
            }
        },
        "columns": [
            { "data": "IdTorneo", "visible": false, "searchable": false },

            // Columna 1: NOMBRE DEL TORNEO
            {
                "data": "NombreTorneo",
                "render": function (data, type, row) {
                    return `<div class="fw-bold text-dark fs-14px"><i class="fa fa-trophy text-warning me-2"></i>${data}</div>`;
                }
            },

            // Columna 2: CONFIGURACIÓN DE PUNTOS
            {
                "data": null,
                "orderable": false,
                "searchable": false,
                "render": function (data, type, row) {
                    return `
                        <div class="d-flex flex-column gap-1">
                            <div class="fs-12px">
                                <span class="badge bg-primary bg-opacity-10 text-primary w-60px text-start me-1"><i class="fa fa-house me-1"></i>Local</span>
                                <span class="text-success fw-bold">Vic: ${row.PuntosVictoriaLocal}</span> <span class="text-muted mx-1">|</span> <span class="text-secondary fw-bold">Emp: ${row.PuntosEmpateLocal}</span>
                            </div>
                            <div class="fs-12px">
                                <span class="badge bg-danger bg-opacity-10 text-danger w-60px text-start me-1"><i class="fa fa-plane me-1"></i>Visita</span>
                                <span class="text-success fw-bold">Vic: ${row.PuntosVictoriaVisitante}</span> <span class="text-muted mx-1">|</span> <span class="text-secondary fw-bold">Emp: ${row.PuntosEmpateVisitante}</span>
                            </div>
                        </div>
                    `;
                }
            },

            // Columna 3: ESTADO
            {
                "data": "Estado",
                "className": "text-center align-middle",
                "render": function (data) {
                    if (data === true)
                        return '<span class="badge bg-yellow text-black fs-12px px-2 py-1 rounded-pill"><i class="fas fa-circle fs-9px me-1"></i>Activo</span>';
                    else
                        return '<span class="badge bg-danger fs-12px px-2 py-1 rounded-pill"><i class="fas fa-archive fs-9px me-1"></i>Finalizado</span>';
                }
            },

            // Columna 4: OPCIONES
            {
                "defaultContent": '<button class="btn btn-lime btn-editar btn-sm me-2"><i class="fas fa-pencil-alt"></i></button>' +
                    '<button class="btn btn-info btn-detalle btn-sm"><i class="fas fa-eye"></i></button>',
                "orderable": false,
                "searchable": false,
                "className": "text-center align-middle"
            }
        ],
        "order": [[0, "desc"]],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

function listaTorneosOriginal() {

    //if ($.fn.DataTable.isDataTable("#tbData")) {
    //    $("#tbData").DataTable().destroy();
    //    $('#tbData tbody').empty();
    //}

    tablaData = $("#tbData").DataTable({
        responsive: true,
        "ajax": {
            "url": 'Torneos.aspx/ListaTorneos',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function (d) {
                return JSON.stringify(d);
            },
            "dataSrc": function (json) {
                if (json.d.Estado) {
                    return json.d.Data;
                } else {
                    return [];
                }
            }
        },
        "columns": [
            { "data": "IdTorneo", "visible": false, "searchable": false },

            // Columna 1: NOMBRE DEL TORNEO
            {
                "data": "NombreTorneo",
                "render": function (data, type, row) {
                    return `<div class="fw-bold text-dark fs-14px"><i class="fa fa-trophy text-warning me-2"></i>${data}</div>`;
                }
            },

            // Columna 2: CONFIGURACIÓN DE PUNTOS (Diseño compacto y visual)
            {
                "data": null,
                "orderable": false,
                "searchable": false,
                "render": function (data, type, row) {
                    return `
                        <div class="d-flex flex-column gap-1">
                            <div class="fs-12px">
                                <span class="badge bg-primary bg-opacity-10 text-primary w-60px text-start me-1"><i class="fa fa-house me-1"></i>Local</span>
                                <span class="text-success fw-bold">Vic: ${row.PuntosVictoriaLocal}</span> <span class="text-muted mx-1">|</span> <span class="text-secondary fw-bold">Emp: ${row.PuntosEmpateLocal}</span>
                            </div>
                            <div class="fs-12px">
                                <span class="badge bg-danger bg-opacity-10 text-danger w-60px text-start me-1"><i class="fa fa-plane me-1"></i>Visita</span>
                                <span class="text-success fw-bold">Vic: ${row.PuntosVictoriaVisitante}</span> <span class="text-muted mx-1">|</span> <span class="text-secondary fw-bold">Emp: ${row.PuntosEmpateVisitante}</span>
                            </div>
                        </div>
                    `;
                }
            },

            // Columna 3: ESTADO
            {
                "data": "Estado", "className": "text-center align-middle", render: function (data) {
                    if (data === true)
                        return '<span class="badge bg-yellow text-black fs-12px px-2 py-1 rounded-pill"><i class="fas fa-circle fs-9px me-1"></i>Activo</span>';
                    else
                        return '<span class="badge bg-danger fs-12px px-2 py-1 rounded-pill"><i class="fas fa-archive fs-9px me-1"></i>Finalizado</span>';
                }
            },

            // Columna 4: OPCIONES
            {
                "defaultContent": '<button class="btn btn-lime btn-editar btn-sm me-2"><i class="fas fa-pencil-alt"></i></button>' +
                    '<button class="btn btn-info btn-detalle btn-sm"><i class="fas fa-eye"></i></button>',
                "orderable": false,
                "searchable": false,
                "className": "text-center align-middle"
            }
        ],
        "order": [[0, "desc"]],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

// ==========================================
// EVENTOS DE BOTONES EN LA TABLA
// ==========================================

$('#tbData tbody').on('click', '.btn-editar', function () {

    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    idEditar = data.IdTorneo;

    // Cargar datos en los inputs del modal
    $("#txtNombreTorneo").val(data.NombreTorneo);
    $("#txtGestion").val(data.Gestion);

    // Cargar puntos
    $("#txtPtsVicLocal").val(data.PuntosVictoriaLocal);
    $("#txtPtsVicVisita").val(data.PuntosVictoriaVisitante);
    $("#txtPtsEmpLocal").val(data.PuntosEmpateLocal);
    $("#txtPtsEmpVisita").val(data.PuntosEmpateVisitante);

    $("#cboEstado").val(data.Estado ? 1 : 0).prop("disabled", false);

    $("#modalLabeldetalle").text("Editar Torneo");
    $("#modalAdd").modal("show");
});

$('#tbData tbody').on('click', '.btn-detalle', function () {

    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    const textoSms = `El torneo ${data.NombreTorneo} de la gestión ${data.Gestion} otorga ${data.PuntosVictoriaVisitante} puntos por ganar de visitante.`;
    mostrarAlerta("Detalles de Puntuación", textoSms, "info");

});

// ==========================================
// EVENTO: NUEVO REGISTRO
// ==========================================

$("#btnNuevore").on("click", function () {
    idEditar = 0;

    // Limpiar campos de texto
    $("#txtNombreTorneo").val("");

    // Autocompletar la gestión con el año actual por defecto
    const anioActual = new Date().getFullYear();
    $("#txtGestion").val(anioActual);

    // Puntos por defecto (Local: 3/1 | Visita: 4/2)
    $("#txtPtsVicLocal").val(3);
    $("#txtPtsVicVisita").val(4);
    $("#txtPtsEmpLocal").val(1);
    $("#txtPtsEmpVisita").val(2);

    $("#cboEstado").val(1).prop("disabled", true);

    $("#modalLabeldetalle").text("Nuevo Torneo");
    $("#modalAdd").modal("show");
})

// ==========================================
// EVENTO: GUARDAR CAMBIOS
// ==========================================

function habilitarBoton() {
    $('#btnGuardarReg').prop('disabled', false); // Ojo: tu botón en HTML tiene el ID btnGuardarReg
}

$("#btnGuardarReg").on("click", function () {
    // Bloqueo inmediato
    $('#btnGuardarReg').prop('disabled', true);

    // 1. VALIDACIONES DE TEXTO
    if ($("#txtNombreTorneo").val().trim() === "") {
        MensajeToast("Campo incompleto", "Por favor, ingrese el nombre del Torneo.", "warning");
        $("#txtNombreTorneo").focus();
        habilitarBoton();
        return;
    }

    if ($("#txtGestion").val().trim() === "") {
        MensajeToast("Campo incompleto", "Por favor, ingrese el año de gestión.", "warning");
        $("#txtGestion").focus();
        habilitarBoton();
        return;
    }

    // 2. VALIDACIONES ESTRICTAS DE NÚMEROS NEGATIVOS PARA LOS PUNTOS
    const ptsVicLocal = parseInt($("#txtPtsVicLocal").val()) || 0;
    const ptsVicVisita = parseInt($("#txtPtsVicVisita").val()) || 0;
    const ptsEmpLocal = parseInt($("#txtPtsEmpLocal").val()) || 0;
    const ptsEmpVisita = parseInt($("#txtPtsEmpVisita").val()) || 0;

    if (ptsVicLocal < 0 || ptsVicVisita < 0 || ptsEmpLocal < 0 || ptsEmpVisita < 0) {
        MensajeToast("Valor inválido", "Los puntos de configuración no pueden ser números negativos.", "warning");
        habilitarBoton();
        return;
    }

    // Opcional: Validar que victoria valga más que empate (Lógica deportiva)
    if (ptsEmpLocal >= ptsVicLocal) {
        MensajeToast("Advertencia Lógica", "Normalmente, un empate de local no puede valer igual o más que una victoria.", "warning");
        // No ponemos return aquí para permitir guardar, es solo advertencia. Si quieres bloquear, pon el return.
        habilitarBoton();
        return;
    }

    // 3. ARMAR EL OBJETO
    const objeto = {
        IdTorneo: idEditar,
        NombreTorneo: $("#txtNombreTorneo").val().trim(),
        Gestion: parseInt($("#txtGestion").val()) || new Date().getFullYear(),
        PuntosVictoriaLocal: ptsVicLocal,
        PuntosVictoriaVisitante: ptsVicVisita,
        PuntosEmpateLocal: ptsEmpLocal,
        PuntosEmpateVisitante: ptsEmpVisita,
        Estado: ($("#cboEstado").val() === "1" ? true : false)
    };

    $("#modalAdd").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: `${API_BASE_URL}/torneos/registrarTorneo`,
        // CORRECCIÓN 1: Se envía el objeto directamente
        data: JSON.stringify(objeto),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#modalAdd").find("div.modal-content").LoadingOverlay("hide");
            // CORRECCIÓN 2: Se quita el ".d", leyendo directamente de response
            alertaTimer(
                response.Estado ? '¡Excelente!' : 'Atención',
                response.Mensaje,
                response.Valor
            );

            if (response.Estado) {
                $("#modalAdd").modal("hide");

                if (tablaData) {
                    tablaData.ajax.reload(null, false);
                }
                idEditar = 0;
            }
        },
        error: function (xhr, status, error) {
            // 1. Logs detallados para ti (el desarrollador)
            console.log("Estado HTTP:", xhr.status);
            console.log("Tipo de error:", status);
            console.log("Mensaje HTTP:", error);
            console.log("Respuesta del servidor (Detalle):", xhr.responseText);
            // console.log("Error status:", xhr.status, "Detalles:", thrown);
            $("#modalAdd").find("div.modal-content").LoadingOverlay("hide");
            MensajeToast("¡Atención!", "Error de comunicación con el servidor.", "error");
        },
        complete: function () {
            habilitarBoton();
        }
    });

    // 4. PETICIÓN AJAX
    //$.ajax({
    //    type: "POST",
    //    url: "Torneos.aspx/GuardarOrEditTorneos",
    //    data: JSON.stringify({ objeto: objeto }),
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    success: function (response) {
    //        $("#modalAdd").find("div.modal-content").LoadingOverlay("hide");
    //        alertaTimer(
    //            response.d.Estado ? '¡Excelente!' : 'Atención',
    //            response.d.Mensaje,
    //            response.d.Valor
    //        );

    //        if (response.d.Estado) {
    //            $("#modalAdd").modal("hide");

    //            if (tablaData) {
    //                tablaData.ajax.reload(null, false);
    //            }
    //            idEditar = 0;
    //        }
    //    },
    //    error: function (xhr) {
    //        console.log(xhr.responseText);
    //        $("#modalAdd").find("div.modal-content").LoadingOverlay("hide");
    //        MensajeToast("¡Atención!", "Error de comunicación con el servidor.", "error");
    //    },
    //    complete: function () {
    //        habilitarBoton();
    //    }
    //});

});

// fin