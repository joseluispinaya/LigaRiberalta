
let tablaPartidos;

$(document).ready(function () {
    // 1. Cargar combos principales al inicio
    cargarTorneosFiltro();
    cargarCategoriasFiltro();

    // 2. Evento: Cambio en Torneo
    $("#cboFiltroTorneo").on("change", function () {
        $("#cboFiltroCategoria").val(""); // Reseteamos categoría
        $("#cboFiltroSerie").html('<option value="">-- Seleccione una Serie --</option>').prop("disabled", true);
        limpiarTabla();
    });

    // 3. Evento: Cambio en Categoría
    $("#cboFiltroCategoria").on("change", function () {
        const idCategoria = $(this).val();
        const idTorneo = $("#cboFiltroTorneo").val();

        $("#cboFiltroSerie").prop("disabled", true);
        limpiarTabla(); // Limpiamos la tabla porque cambiaron los parámetros

        if (idCategoria && idTorneo) {
            cargarSeriesFull(idTorneo, idCategoria);
        } else if (!idTorneo && idCategoria) {
            MensajeToast("Atención", "Seleccione un Torneo primero.", "warning");
            $(this).val(""); // Devolvemos el combo a vacío
        }
    });

    // 4. LA MAGIA: Cambio en Serie dispara la búsqueda
    $("#cboFiltroSerie").on("change", function () {
        const idSerie = $(this).val();

        if (idSerie && idSerie !== "") {
            // Verificamos si la tabla ya fue inicializada
            if ($.fn.DataTable.isDataTable("#tbPartidos")) {
                tablaPartidos.ajax.reload();
            } else {
                cargarFixturePartidos();
            }
        } else {
            limpiarTabla();
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

function cargarSeriesFull(idTorneo, idCategoria) {

    $("#cboFiltroSerie").html('<option value="">Cargando...</option>');

    let request = {
        IdTorneo: parseInt(idTorneo) || 0,
        IdCategoria: parseInt(idCategoria) || 0
    };

    $.ajax({
        url: "Partidos.aspx/ResumenSeries",
        type: "POST",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let lista = response.d.Data;

                if (lista != null && lista.length > 0) {

                    let opcionesHTML = '<option value="">-- Seleccione una Serie --</option>';

                    $.each(lista, function (i, row) {
                        opcionesHTML += `<option value="${row.IdSerie}">${row.NombreSerie} Nro Equipos: ${row.NroEquipos}</option>`;
                    });

                    $("#cboFiltroSerie").html(opcionesHTML);
                    $("#cboFiltroSerie").prop("disabled", false);
                } else {
                    $("#cboFiltroSerie").html('<option value="">No hay series disponibles</option>');
                }

            } else {
                $("#cboFiltroSerie").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboFiltroSerie").html('<option value="">Error de conexión</option>');
        }
    });
}

function cargarFixturePartidos() {
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
                    IdTorneo: parseInt($("#cboFiltroTorneo").val()) || 0,
                    IdCategoria: parseInt($("#cboFiltroCategoria").val()) || 0,
                    IdSerie: parseInt($("#cboFiltroSerie").val()) || 0
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
                            return `<span class="badge bg-success bg-opacity-20 text-success px-2 py-1"><i class="fa fa-check me-1"></i>${data}</span>`;
                        case 3:
                        case 4:
                            return `<span class="badge bg-danger bg-opacity-20 text-danger px-2 py-1"><i class="fa fa-times-circle me-1"></i>${data}</span>`;
                        case 5:
                            return `<span class="badge bg-warning bg-opacity-20 text-warning px-2 py-1"><i class="fa fa-exclamation-triangle me-1"></i>${data}</span>`;
                        default:
                            return `<span class="badge bg-secondary px-2 py-1">${data}</span>`;
                    }
                }
            },
            {
                "data": null,
                "className": "text-center align-middle",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, row) {
                    if (row.IdEstado === 1) {
                        return `<button class="btn btn-lime btn-sm px-2 py-1 fw-bold btn-resultado" title="Mesa de Control / Resultados" data-id="${row.IdPartido}"><i class="fa fa-play me-1"></i>Resultado</button>`;
                    }
                    return `<button class="btn btn-white border btn-sm px-2 py-1 fw-bold text-gray-700 btn-detalles" title="Ver Acta" data-id="${row.IdPartido}"><i class="fa fa-file-alt me-1"></i>Acta</button>`;
                }
            }
        ],
        "order": [],
        "language": { "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json" }
    });
}

$('#tbPartidos tbody').on('click', '.btn-resultado', function () {

    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaPartidos.row(fila).data();
    var url = 'PanelResultados.aspx?idPartido=' + data.IdPartido;
    window.location.href = url;

});

$("#btnProgramarGrupos").on("click", function () {

    let t = $("#cboFiltroTorneo").val();
    let c = $("#cboFiltroCategoria").val();
    let s = $("#cboFiltroSerie").val();

    if ($("#cboFiltroTorneo").val() === "") {
        MensajeToast("Campo incompleto", "Debe seleccionar un torneo.", "warning");
        $("#cboFiltroTorneo").focus();
        return;
    }

    if ($("#cboFiltroCategoria").val() === "") {
        MensajeToast("Campo incompleto", "Debe seleccionar una categoría.", "warning");
        $("#cboFiltroCategoria").focus();
        return;
    }

    if ($("#cboFiltroSerie").val() === "") {
        MensajeToast("Campo incompleto", "Debe seleccionar una Serie.", "warning");
        $("#cboFiltroSerie").focus();
        return;
    }

    // Armamos la URL para viajar a la Página 2
    let urlDestino = `DetallesSerie.aspx?idTorneo=${t}&idCategoria=${c}&idSerie=${s}`;

    window.location.href = urlDestino;
});

// fin