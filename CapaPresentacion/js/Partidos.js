
let tablaData;

$(document).ready(function () {
    cargarTorneosTable();
    cargarCategoriasTable();
});

function cargarTorneosTable() {

    $("#cboFiltroTorneo").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "Torneos.aspx/ListaTorneos",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                // 1. Empezamos con la opción por defecto
                let opcionesHTML = '<option value="">-- Seleccione Torneo --</option>';

                // 2. Concatenamos todas las opciones en la variable (en memoria)
                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdTorneo}">${row.NombreTorneo}</option>`;
                });

                // 3. Inyectamos todo al DOM en un solo movimiento
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

function cargarCategoriasTable() {

    $("#cboFiltroCategoria").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "Categorias.aspx/ListaCategorias",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                // 1. Empezamos con la opción por defecto
                let opcionesHTML = '<option value="">-- Seleccione Categoría --</option>';

                // 2. Concatenamos todas las opciones en la variable (en memoria)
                $.each(response.d.Data, function (i, row) {

                    let textoGenero = row.Genero === 'M' ? 'Varones' : 'Damas';
                    opcionesHTML += `<option value="${row.IdCategoria}">${row.NombreCategoria} ${textoGenero}</option>`;
                });

                // 3. Inyectamos todo al DOM en un solo movimiento
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

$("#btnBuscarFiltro").on("click", function () {
    let idTorneo = $("#cboFiltroTorneo").val();
    let idCategoria = $("#cboFiltroCategoria").val();

    if (idTorneo === "" || idTorneo == null) {
        MensajeToast("Campo incompleto", "Debe seleccionar un torneo.", "warning");
        $("#cboFiltroTorneo").focus();
        return;
    }

    if (idCategoria === "" || idCategoria == null) {
        MensajeToast("Campo incompleto", "Debe seleccionar una categoría.", "warning");
        $("#cboFiltroCategoria").focus();
        return;
    }

    if ($.fn.DataTable.isDataTable("#tbData")) {
        tablaData.ajax.reload();
    } else {
        listarSeriesResumenOriginal();
    }
});

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