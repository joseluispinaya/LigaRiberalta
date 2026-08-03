
let tablaData;

$(document).ready(function () {
    // 1. Cargar combos principales al inicio
    cargarTorneosFiltro();
    cargarCategoriasFiltro();

    // 2. Evento: Cambio en Torneo
    $("#cboFiltroTorneo").on("change", function () {
        $("#cboFiltroCategoria").val(""); // Reseteamos categoría
        limpiarTabla();
    });


    // 4. LA MAGIA: Cambio en Categoría dispara la búsqueda
    $("#cboFiltroCategoria").on("change", function () {
        const idCategoria = $(this).val();
        const idTorneo = $("#cboFiltroTorneo").val();

        // Verificamos que los 3 combos tengan valor antes de buscar
        if (idTorneo && idCategoria) {

            // Verificamos si la tabla ya fue inicializada
            if ($.fn.DataTable.isDataTable("#tbData")) {
                tablaData.ajax.reload();
            } else {
                cargarEquiposDeudores();
            }

        } else {
            limpiarTabla();
            MensajeToast("Atención", "Debe seleccionar un Torneo primero.", "warning");
            $(this).val(""); // Devolvemos a vacío
        }
    });
});

// Función auxiliar para limpiar visualmente la tabla si el usuario deselecciona algo
function limpiarTabla() {
    if ($.fn.DataTable.isDataTable("#tbData")) {
        $("#tbData").DataTable().clear().draw();
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

function cargarEquiposDeudores() {
    tablaData = $("#tbData").DataTable({
        responsive: true,
        destroy: true,
        "ajax": {
            "url": 'ControlInscripciones.aspx/ObtenerEquiposDeudores',
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
                if (json.d.Estado) {
                    let cantidad = json.d.Data.length;
                    if (cantidad === 0) {
                        alertaTimer("¡Atención!", "No se encontraron clubes con pagos pendientes.", "info");
                    }
                    return json.d.Data;
                } else {
                    alertaTimer("¡Atención!", json.d.Mensaje, "error");
                    return [];
                }
            }
        },
        "columns": [
            {
                "data": "LogoUrl",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, row) {
                    let logo = row.LogoUrl ? row.LogoUrl : 'Logos/sinLogo.png';
                    return `
                        <div class="d-flex align-items-center">
                            <div class="w-40px h-40px rounded-circle d-flex align-items-center justify-content-center bg-light overflow-hidden shadow-sm me-3">
                                <img src="${logo}" alt="" class="mw-100 mh-100" />
                            </div>
                            <div>
                                <div class="fw-bold fs-14px text-body">${row.NombreClub}</div>
                                <div class="fs-12px text-gray-500">Fundado: ${row.NombreSerie}</div>
                            </div>
                        </div>
                    `;
                }
            },
            //{
            //    "data": "PuntosPenalizacion",
            //    "className": "text-center align-middle",
            //    "render": function (data) {
            //        if (data > 0) {
            //            return `<span class="badge bg-danger fs-12px" title="Puntos restados en mesa"><i class="fa fa-minus-circle me-1"></i>${data} pts</span>`;
            //        } else {
            //            return `<span class="text-muted fs-12px"><i class="fa fa-check text-success me-1"></i>0</span>`;
            //        }
            //    }
            //},
            {
                "data": "InscripcionPagada",
                "className": "text-center align-middle",
                "render": function (data) {
                    if (data === true) {
                        return '<span class="badge bg-success bg-opacity-20 text-success fs-12px px-2 py-1 rounded-pill"><i class="fas fa-check-circle fs-10px me-1"></i>Pagado</span>';
                    } else {
                        return '<span class="badge bg-warning bg-opacity-20 text-warning fs-12px px-2 py-1 rounded-pill"><i class="fas fa-clock fs-10px me-1"></i>Pendiente</span>';
                    }
                }
            },
            {
                "defaultContent": '<button class="btn btn-lime btn-pagar btn-sm me-2" title="Pagar Inscripción"><i class="fas fa-money-bill-wave me-1"></i>Pagar</button>' +
                    '<button class="btn btn-indigo btn-notificar btn-sm" title="Enviar Notificación"><i class="fas fa-comment-dots me-1"></i>Notificar</button>',
                "orderable": false,
                "searchable": false,
                "className": "text-center align-middle"
            }
        ],
        "order": [],
        "language": { "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json" }
    });
}

$('#tbData tbody').on('click', '.btn-pagar', function () {

    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    swal({
        title: "¿Está seguro de procesar el pago?",
        text: `Se pagara la inscripción del club: ${data.NombreClub}.`,
        icon: "info",
        buttons: {
            cancel: {
                text: 'Cancelar',
                value: null,
                visible: true,
                className: 'btn btn-danger',
                closeModal: true,
            },
            confirm: {
                text: 'Sí, Procesar el Pago',
                value: true,
                visible: true,
                className: 'btn btn-indigo',
                closeModal: false
            }
        }
    }).then((willSave) => {
        if (willSave) {
            $.ajax({
                type: "POST",
                url: "ControlInscripciones.aspx/ActualizarPagoInscripcion",
                data: JSON.stringify({ IdEquipo: data.IdEquipo }),
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                success: function (response) {

                    MensajeToast(
                        response.d.Estado ? '¡Excelente!' : 'Atención',
                        response.d.Mensaje,
                        response.d.Valor
                    );
                    if (response.d.Estado) {
                        if (tablaData) {
                            tablaData.ajax.reload(null, false);
                        } else {
                            cargarEquiposDeudores();
                        }
                    }
                },
                error: function (xhr) {
                    console.log(xhr.responseText);
                    MensajeToast("¡Error Crítico!", "Fallo de comunicación con el servidor.", "error");
                },
                complete: function () {
                    swal.stopLoading();
                    swal.close();
                }
            });
        }
    });

});

$('#tbData tbody').on('click', '.btn-notificar', function () {

    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();

    let nombreTorneo = $("#cboFiltroTorneo option:selected").text().trim();
    let nombreCategoria = $("#cboFiltroCategoria option:selected").text().trim();

    let titulo = "Deuda de Inscripción";
    let mensaje = "Solicitud de pago de inscripción pendiente.";
    let informacion = `Se adeuda la inscripción para el Torneo: ${nombreTorneo}, Categoría: ${nombreCategoria}`;
    // abrire un modal para enviar notificación al club

    swal({
        title: "¿Desea enviar notificación de Cobro?",
        text: `Se enviara notificaciones al personal del club: ${data.NombreClub}.`,
        icon: "info",
        buttons: {
            cancel: {
                text: 'No, gracias',
                value: false,
                visible: true,
                className: 'btn btn-danger',
                closeModal: true,
            },
            confirm: {
                text: 'Sí, notificar',
                value: true,
                visible: true,
                className: 'btn btn-indigo',
                closeModal: false
            }
        }
    }).then((enviar) => {
        if (enviar) {
            $.ajax({
                type: "POST",
                url: "ControlInscripciones.aspx/NotificacionInscripcionPendiente",
                data: JSON.stringify({ idEquipo: data.IdEquipo, titulo: titulo, mensaje: mensaje, informacion: informacion }),
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                success: function (response) {

                    alertaTimer(
                        response.d.Estado ? '¡Excelente!' : 'Atención',
                        response.d.Mensaje,
                        response.d.Valor
                    );
                },
                error: function (xhr) {
                    console.log(xhr.responseText);
                    MensajeToast("¡Error Crítico!", "Fallo de comunicación con el servidor.", "error");
                },
                complete: function () {
                    swal.stopLoading();
                    swal.close();
                }
            });
        }
    });

});

// fin