
let tablaData;

let tablaPartidos;

$(document).ready(function () {
    // 1. Cargar combos principales al inicio
    cargarTorneosFiltro();
    cargarCategoriasFiltro();
    cargarFasesFiltro();

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
                cargarEquiposDeudoresArbitraje();
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

function cargarEquiposDeudoresArbitraje() {
    tablaPartidos = $("#tbPartidos").DataTable({
        responsive: true,
        destroy: true,
        "ajax": {
            "url": 'ControlPagoArbitraje.aspx/EquiposDeudoresArbitraje',
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
                // 1. Fecha y Hora del Partido
                "data": null,
                "className": "text-center align-middle",
                "render": function (data, type, row) {
                    return `<div class="fw-semibold text-dark">${row.Fecha}</div>
                            <div class="fs-12px text-muted"><i class="fa fa-clock me-1"></i>${row.Hora}</div>`;
                }
            },
            {
                // 2. Fase (Para dar contexto)
                "data": "NombreFase",
                "className": "text-center align-middle fs-13px"
            },
            {
                // 3. EL EQUIPO DEUDOR (Escudo y Nombre)
                "data": null,
                "className": "text-start align-middle",
                "orderable": false,
                "render": function (data, type, row) {
                    let logo = row.LogoUrl ? row.LogoUrl : 'Logos/sinLogo.png';
                    return `<img src="${logo}" width="30" height="30" class="rounded-circle border shadow-sm me-2" style="object-fit: contain; background: white;">
                            <span class="fw-bold fs-13px text-dark">${row.NombreClub}</span>`;
                }
            },
            {
                // 4. Condición en la que jugó (Local o Visitante)
                "data": "Condicion",
                "className": "text-center align-middle",
                "render": function (data, type, row) {
                    // Colores dinámicos: Azul para Local, Rojo para Visitante
                    let claseColor = row.Condicion === 'Local' ? 'primary' : 'danger';
                    return `<span class="badge bg-${claseColor} bg-opacity-10 text-${claseColor} px-2 py-1 border border-${claseColor}">
                                ${row.Condicion}
                            </span>`;
                }
            },
            {
                // 5. Cancha
                "data": "Cancha",
                "className": "text-center align-middle fs-12px"
            },
            {
                // 6. Botones de Acción
                "data": null,
                "orderable": false,
                "searchable": false,
                "className": "text-center align-middle",
                "render": function (data, type, row) {
                    // Nota: Agregué data-idequipo y data-idpartido para que te sea más fácil capturarlos con jQuery luego
                    return `<button class="btn btn-lime btn-pagar btn-sm me-2" title="Registrar Pago de Arbitraje" data-idequipo="${row.IdEquipo}" data-idpartido="${row.IdPartido}">
                                <i class="fas fa-money-bill-wave me-1"></i>Pagar
                            </button>
                            <button class="btn btn-indigo btn-notificar btn-sm" title="Enviar Notificación" data-idequipo="${row.IdEquipo}">
                                <i class="fas fa-comment-dots me-1"></i>Notificar
                            </button>`;
                }
            }
        ],
        "order": [],
        "language": { "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json" }
    });
}

$('#tbPartidos tbody').on('click', '.btn-pagar', function () {

    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaPartidos.row(fila).data();
    swal({
        title: "¿Está seguro de procesar el pago?",
        text: `Se pagara el arbitraje del club: ${data.NombreClub}.`,
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
                url: "ControlPagoArbitraje.aspx/ActualizarPagoArbitraje",
                data: JSON.stringify({
                    IdPartido: data.IdPartido,
                    IdEquipo: data.IdEquipo
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                success: function (response) {

                    MensajeToast(
                        response.d.Estado ? '¡Excelente!' : 'Atención',
                        response.d.Mensaje,
                        response.d.Valor
                    );
                    if (response.d.Estado) {
                        if (tablaPartidos) {
                            tablaPartidos.ajax.reload(null, false);
                        } else {
                            cargarEquiposDeudoresArbitraje();
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

$('#tbPartidos tbody').on('click', '.btn-notificar', function () {

    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaPartidos.row(fila).data();

    let nombreTorneo = $("#cboFiltroTorneo option:selected").text().trim();
    let nombreCategoria = $("#cboFiltroCategoria option:selected").text().trim();

    let titulo = "Deuda de Arbitraje";
    let mensaje = "Solicitud de pago de arbitraje pendiente.";
    let informacion = `Se adeuda el pago de arbitraje para el Torneo: ${nombreTorneo}, Categoría: ${nombreCategoria} del ${data.Fecha}`;
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
                url: "ControlPagoArbitraje.aspx/NotificacionCobroArbitraje",
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