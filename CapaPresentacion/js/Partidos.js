
let tablaData;

let tablaPartidos;

$(document).ready(function () {
    // 1. Cargar combos principales al inicio
    cargarTorneosFiltro();
    cargarCategoriasFiltro();
    cargarFasesFiltro(); // <--- Llamamos al nuevo combo de Fases

    // 2. Evento: Cambio en Torneo
    $("#cboFiltroTorneo").on("change", function () {
        $("#cboFiltroCategoria").val(""); // Reseteamos categoría
        $("#cboFiltroFase").val("");      // Reseteamos fase
        limpiarTabla();
    });

    // 3. Evento: Cambio en Categoría
    $("#cboFiltroCategoria").on("change", function () {
        const idTorneo = $("#cboFiltroTorneo").val();

        if (!idTorneo) {
            MensajeToast("Atención", "Seleccione un Torneo primero.", "warning");
            $(this).val(""); // Devolvemos el combo a vacío
        }

        $("#cboFiltroFase").val(""); // Reseteamos fase
        limpiarTabla();
    });

    // 4. LA MAGIA: Cambio en Fase dispara la búsqueda
    $("#cboFiltroFase").on("change", function () {
        const idFase = $(this).val();
        const idTorneo = $("#cboFiltroTorneo").val();
        const idCategoria = $("#cboFiltroCategoria").val();

        // Verificamos que los 3 combos tengan valor antes de buscar
        if (idFase && idFase !== "" && idTorneo && idCategoria) {

            // Verificamos si la tabla ya fue inicializada
            if ($.fn.DataTable.isDataTable("#tbPartidos")) {
                tablaPartidos.ajax.reload();
            } else {
                cargarFixturePartidos();
            }

        } else {
            limpiarTabla();

            // Si eligió fase pero olvidó los anteriores, le avisamos
            if (idFase !== "" && (!idTorneo || !idCategoria)) {
                MensajeToast("Atención", "Debe seleccionar Torneo y Categoría primero.", "warning");
                $(this).val(""); // Devolvemos a vacío
            }
        }
    });
});

// Función auxiliar para limpiar visualmente la tabla si el usuario deselecciona algo
function limpiarTabla() {
    if ($.fn.DataTable.isDataTable("#tbPartidos")) {
        $("#tbPartidos").DataTable().clear().draw();
    }
}

function cargarTorneosFiltro() {

    $("#cboFiltroTorneo").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "Torneos.aspx/ListaTorneos",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">-- Seleccione Torneo --</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdTorneo}">${row.NombreTorneo}</option>`;
                });

                $("#cboFiltroTorneo").html(opcionesHTML);

            } else {
                $("#cboFiltroTorneo").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboFiltroTorneo").html('<option value="">Error de conexión</option>');
        }
    });
}

function cargarCategoriasFiltro() {

    $("#cboFiltroCategoria").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "Categorias.aspx/ListaCategorias",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">-- Seleccione Categoría --</option>';

                $.each(response.d.Data, function (i, row) {

                    let textoGenero = row.Genero === 'M' ? 'Varones' : 'Damas';
                    opcionesHTML += `<option value="${row.IdCategoria}">${row.NombreCategoria} ${textoGenero}</option>`;
                });

                $("#cboFiltroCategoria").html(opcionesHTML);

            } else {
                $("#cboFiltroCategoria").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboFiltroCategoria").html('<option value="">Error de conexión</option>');
        }
    });
}

function cargarFasesFiltro() {

    $("#cboFiltroFase").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "DetallesSerie.aspx/ListaFasesCombo",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">-- Seleccione Fase --</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdFase}">${row.NombreFase}</option>`;
                });

                $("#cboFiltroFase").html(opcionesHTML);

            } else {
                $("#cboFiltroFase").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboFiltroFase").html('<option value="">Error de conexión</option>');
        }
    });
}

function cargarFixturePartidos() {
    tablaPartidos = $("#tbPartidos").DataTable({
        responsive: true,
        destroy: true,
        "ajax": {
            "url": 'Partidos.aspx/ObtenerPartidosFase',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                let request = {
                    IdTorneo: parseInt($("#cboFiltroTorneo").val()) || 0,
                    IdCategoria: parseInt($("#cboFiltroCategoria").val()) || 0,
                    IdFase: parseInt($("#cboFiltroFase").val()) || 0
                };
                return JSON.stringify(request);
            },
            "dataSrc": function (json) {
                return json.d.Estado ? json.d.Data : [];
            }
        },
        "columns": [
            {
                "data": null,
                "className": "text-center align-middle",
                "render": function (data, type, row) {
                    return `<div class="fw-semibold text-dark">${row.Fecha}</div>
                            <div class="fs-12px text-muted"><i class="fa fa-clock me-1"></i>${row.Hora}</div>`;
                }
            },
            /*{ "data": "NombreFase", "className": "text-center align-middle fs-13px" },*/
            {
                "data": null,
                "className": "text-end align-middle",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, row) {
                    let logo = row.LogoLocal ? row.LogoLocal : 'Logos/sinLogo.png';
                    return `<span class="fw-bold fs-13px me-2 text-dark">${row.ClubLocal}</span>
                            <img src="${logo}" width="30" height="30" class="rounded-circle border shadow-sm" style="object-fit: contain; background: white;">`;
                }
            },
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
            {
                "data": null,
                "className": "text-start align-middle",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, row) {
                    let logo = row.LogoVisitante ? row.LogoVisitante : 'Logos/sinLogo.png';
                    return `<img src="${logo}" width="30" height="30" class="rounded-circle border shadow-sm me-2" style="object-fit: contain; background: white;">
                            <span class="fw-bold fs-13px text-dark">${row.ClubVisitante}</span>`;
                }
            },
            { "data": "Cancha", "className": "text-center align-middle fs-12px text-muted" },
            {
                "data": "NombreEstado",
                "className": "text-center align-middle",
                "render": function (data, type, row) {
                    switch (row.IdEstado) {
                        case 1:
                            return `<span class="badge bg-info bg-opacity-20 text-info px-2 py-1"><i class="fa fa-calendar me-1"></i>${data}</span>`;
                        case 2:
                            return `<span class="badge bg-danger bg-opacity-20 text-danger px-2 py-1"><i class="fa fa-check me-1"></i>${data}</span>`;
                        case 3:
                        case 4:
                            return `<span class="badge bg-danger bg-opacity-20 text-danger px-2 py-1"><i class="fa fa-times-circle me-1"></i>${data}</span>`;
                        case 5:
                            return `<span class="badge bg-warning bg-opacity-20 text-warning px-2 py-1"><i class="fa fa-exclamation-triangle me-1"></i>${data}</span>`;
                        default:
                            return `<span class="badge bg-secondary px-2 py-1">${data}</span>`;
                    }
                }
            }
        ],
        "order": [],
        "language": { "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json" }
    });
}

// consume el microservicio
function listarSeriesResumen() {
    tablaData = $("#tbData").DataTable({
        responsive: true,
        "ajax": {
            // 1. Usamos la variable global de tu Master.js
            "url": `${API_BASE_URL2}/partidos/resumenseries`,
            "type": "GET",
            "dataType": "json",
            // NOTA: Se elimina contentType ya que es un GET

            // 2. Retornamos un objeto plano. jQuery lo serializa en la URL automáticamente
            "data": function (d) {
                return {
                    idTorneo: parseInt($("#cboFiltroTorneo").val()) || 0,
                    idCategoria: parseInt($("#cboFiltroCategoria").val()) || 0
                };
            },
            // 3. Leemos directamente del objeto json sin el envoltorio ".d"
            "dataSrc": function (json) {
                if (json.Estado) {
                    return json.Data;
                } else {
                    mostrarAlerta("Mensaje", json.Mensaje, "warning");
                    return [];
                }
            },
            // 4. Captura robusta de errores de red o caídas de backend
            "error": function (xhr, status, error) {
                console.log("Estado HTTP:", xhr.status, "Detalles:", error);
                mostrarAlerta("¡Atención!", "Error de comunicación con el servidor.", "error");

                $("#tbData_processing").hide();
                $("#tbData tbody").html('<tr><td colspan="4" class="text-center text-muted">No se pudieron cargar los datos debido a un error de conexión.</td></tr>');
            }
        },
        "columns": [
            {
                "data": "NombreSerie",
                "render": function (data) {
                    return `<span class="fw-bold text-dark"><i class="fa fa-folder-open text-warning me-2"></i>${data}</span>`;
                }
            },
            {
                "data": "NroEquipos",
                "className": "text-center fw-semibold",
                "render": function (data) {
                    return `${data} Equipos`;
                }
            },
            {
                "data": "NroPartidos",
                "className": "text-center fw-semibold text-primary"
            },
            {
                "data": null,
                "orderable": false,
                "searchable": false,
                "className": "text-center",
                "render": function (data, type, row) {
                    let t = $("#cboFiltroTorneo").val();
                    let c = $("#cboFiltroCategoria").val();
                    let s = row.IdSerie;

                    // El enlace de destino se mantiene igual hacia tu página aspx hija
                    let urlDestino = `DetallesSerie.aspx?idTorneo=${t}&idCategoria=${c}&idSerie=${s}`;

                    return `<a href="${urlDestino}" class="btn btn-primary btn-sm px-3 fw-bold shadow-sm">Detalles</a>`;
                }
            }
        ],
        "order": [],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

function listarSeriesResumenOriginal() {
    tablaData = $("#tbData").DataTable({
        responsive: true,
        "ajax": {
            "url": 'Partidos.aspx/ResumenSeries',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                let request = {
                    IdTorneo: parseInt($("#cboFiltroTorneo").val()) || 0,
                    IdCategoria: parseInt($("#cboFiltroCategoria").val()) || 0
                };
                return JSON.stringify(request);
            },
            "dataSrc": function (json) {
                return json.d.Estado ? json.d.Data : [];
            }
        },
        "columns": [
            {
                "data": "NombreSerie",
                "render": function (data) {
                    return `<span class="fw-bold text-dark"><i class="fa fa-folder-open text-warning me-2"></i>${data}</span>`;
                }
            },
            {
                "data": "NroEquipos",
                "className": "text-center fw-semibold",
                "render": function (data) {
                    return `${data} Equipos`;
                }
            },
            {
                "data": "NroPartidos",
                "className": "text-center fw-semibold text-primary"
            },
            {
                "data": null,
                "orderable": false,
                "searchable": false,
                "className": "text-center",
                "render": function (data, type, row) {
                    // Tomamos los filtros actuales
                    let t = $("#cboFiltroTorneo").val();
                    let c = $("#cboFiltroCategoria").val();
                    let s = row.IdSerie;

                    // Armamos la URL para viajar a la Página 2
                    let urlDestino = `DetallesSerie.aspx?idTorneo=${t}&idCategoria=${c}&idSerie=${s}`;

                    return `<a href="${urlDestino}" class="btn btn-primary btn-sm px-3 fw-bold shadow-sm">Detalles</a>`;
                }
            }
        ],
        "order": [],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

// fin