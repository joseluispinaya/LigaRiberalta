
let tablaData;
let tablaDataSanciones;

$(document).ready(function () {
    cargarTorneosFiltro();
    cargarCategoriasFiltro();
    cargarFasesFiltro();

    // 2. Evento: Cambio en Torneo
    $("#cboFiltroTorneo").on("change", function () {
        $("#cboFiltroCategoria").val("");
        $("#cboFiltroFase").val("");
        limpiarTabla();
    });

    // 3. Evento: Cambio en Categoría
    $("#cboFiltroCategoria").on("change", function () {
        const idTorneo = $("#cboFiltroTorneo").val();

        if (!idTorneo) {
            MensajeToast("Atención", "Seleccione un Torneo primero.", "warning");
            $(this).val("");
        }

        $("#cboFiltroFase").val("");
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
            if ($.fn.DataTable.isDataTable("#tbDeudoresTarjetas")) {
                tablaData.ajax.reload();
            } else {
                cargarEquiposDeudoresSanciones();
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
    if ($.fn.DataTable.isDataTable("#tbDeudoresTarjetas")) {
        $("#tbDeudoresTarjetas").DataTable().clear().draw();
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

function cargarEquiposDeudoresSanciones() {
    tablaData = $("#tbDeudoresTarjetas").DataTable({
        responsive: true,
        destroy: true,
        "ajax": {
            "url": 'ControlPagoTarjetas.aspx/ObtenerEquiposDeudoresSanciones',
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
                // 1. FECHA Y HORA
                "data": null,
                "className": "text-center align-middle",
                "render": function (data, type, row) {
                    return `<div class="fw-semibold text-dark">${row.Fecha}</div>
                            <div class="fs-12px text-muted"><i class="fa fa-clock me-1"></i>${row.Hora}</div>`;
                }
            },
            {
                // 2. CLUB Y FASE (Compacto)
                "data": null,
                "className": "text-start align-middle",
                "orderable": false,
                "render": function (data, type, row) {
                    let logo = row.LogoUrl ? row.LogoUrl : 'Logos/sinLogo.png';
                    return `<div class="d-flex align-items-center">
                                <img src="${logo}" width="36" height="36" class="rounded-circle border shadow-sm me-3" style="object-fit: contain; background: white;">
                                <div>
                                    <div class="fw-bold fs-13px text-dark">${row.NombreClub}</div>
                                    <div class="fs-12px text-muted"><i class="fa fa-list-ol me-1 text-success"></i>${row.NombreFase}</div>
                                </div>
                            </div>`;
                }
            },
            {
                // 3. SANCIONES Y DEUDA TOTAL (Compacto)
                "data": null,
                "className": "text-center align-middle",
                "render": function (data, type, row) {
                    return `<div class="fw-bold fs-13px text-danger mb-1">Bs ${row.DeudaTotal.toFixed(2)}</div>
                            <span class="badge bg-warning text-dark border border-warning shadow-sm fs-11px">
                                <i class="fas fa-copy me-1"></i>${row.NroSanciones} Sanciones
                            </span>`;
                }
            },
            {
                // 4. BOTONES DE OPCIONES
                "data": null,
                "orderable": false,
                "searchable": false,
                "className": "text-center align-middle",
                "render": function (data, type, row) {
                    // Ya no necesitamos los data-atributos aquí, porque usaremos row(fila).data() en el evento click
                    return `<button class="btn btn-lime btn-detalle btn-sm me-2 shadow-sm" title="Ver Detalle Sanción">
                                <i class="fas fa-eye me-1"></i>Detalle
                            </button>
                            <button class="btn btn-indigo btn-notificar btn-sm shadow-sm" title="Enviar Notificación">
                                <i class="fas fa-comment-dots me-1"></i>Notificar
                            </button>`;
                }
            }
        ],
        "order": [],
        "language": { "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json" }
    });
}

$('#tbDeudoresTarjetas tbody').on('click', '.btn-notificar', function () {

    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();

    let fase = data.NombreFase;
    let deudaTotal = `Bs ${data.DeudaTotal.toFixed(2)}`;
    let fechaHora = `${data.Fecha} ${data.Hora}`;

    let titulo = "Deuda de Tarjetas Amarillas y Rojas";
    let mensaje = "Solicitud de pago de tarjetas.";
    let informacion = `Se adeuda el pago de tarjetas amarillas y rojas del partido de ${fase} que se jugó el ${fechaHora}, con un monto total de ${deudaTotal}.`;
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
                url: "ControlPagoTarjetas.aspx/NotificacionCobroTarjetas",
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

$('#tbDeudoresTarjetas tbody').on('click', '.btn-detalle', function () {
    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();

    // 1. Usamos la data para inyectar información dinámica en el Modal antes de abrirlo
    // Supongamos que tienes estas etiquetas en tu modal:
    $("#lblModalNombreClub").text(data.NombreClub);
    $("#imgModalLogoClub").attr("src", data.LogoUrl ? data.LogoUrl : 'Logos/sinLogo.png');
    $("#lblModalDeudaTotal").text(`Bs ${data.DeudaTotal.toFixed(2)}`);
    $("#lblModalFase").text(data.NombreFase);

    // 2. Llamamos a la función que hará el AJAX para traer la lista de tarjetas (jugadores)
    // Le pasamos los IDs exactos.
    cargarDetalleSanciones(data.IdPartido, data.IdEquipo);

    // 3. Mostramos el Modal
    $("#mdDetalleSanciones").modal("show");
});

function cargarDetalleSanciones(idPartido, idEquipo) {
    if ($.fn.DataTable.isDataTable("#tbJugadoresSancionados")) {
        $("#tbJugadoresSancionados").DataTable().destroy();
        $('#tbJugadoresSancionados tbody').empty();
    }

    tablaDataSanciones = $("#tbJugadoresSancionados").DataTable({
        responsive: true,
        "ajax": {
            "url": 'ControlPagoTarjetas.aspx/ObtenerDetalleSanciones',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                let request = {
                    IdPartido: idPartido,
                    IdEquipo: idEquipo
                };
                return JSON.stringify(request);
            },
            "dataSrc": function (json) {
                return json.d.Estado ? json.d.Data : [];
            }
        },
        "columns": [
            {
                // 1. Jugador y Dorsal
                "data": null,
                "className": "text-start align-middle",
                "render": function (data, type, row) {
                    return `<div class="fw-bold text-dark fs-14px">${row.NombreJugador}</div>
                            <div class="fs-12px text-muted"><i class="fas fa-tshirt me-1"></i>Dorsal #${row.Dorsal}</div>`;
                }
            },
            {
                // 2. Minuto y Tipo de Tarjeta
                "data": null,
                "className": "text-center align-middle",
                "render": function (data, type, row) {
                    // 2 = Amarilla, 3 = Roja
                    let esAmarilla = row.IdTipoEvento === 2;
                    let badgeColor = esAmarilla ? 'warning' : 'danger';
                    let textColor = esAmarilla ? 'text-dark' : 'text-white';

                    return `<span class="badge bg-${badgeColor} ${textColor} border shadow-sm p-2 fs-13px" title="${row.TipoEvento}">
                                <i class="fas fa-square me-1"></i>Min ${row.Minuto}'
                            </span>`;
                }
            },
            {
                // 1. Jugador y Dorsal
                "data": null,
                "className": "text-center align-middle",
                "render": function (data, type, row) {
                    // 2 = Amarilla, 3 = Roja
                    let esAmarilla = row.IdTipoEvento === 2;
                    let textColor = esAmarilla ? 'text-warning' : 'text-danger';

                    return `<div class="fw-bold text-danger fs-14px">Bs ${row.Monto.toFixed(2)}</div>
                            <div class="fs-12px text-muted"><i class="fas fa-mobile-button ${textColor} me-1"></i>${row.TipoEvento}</div>`;
                }
            },
            {
                // 4. Botón Pagar
                "data": null,
                "className": "text-center align-middle",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, row) {
                    return `<button class="btn btn-lime btn-pagar btn-sm shadow-sm fw-bold" title="Procesar Pago">
                                <i class="fas fa-money-bill-wave me-1"></i>Pagar
                            </button>`;
                }
            }
        ],
        "order": [],
        "info": false,      // Oculta el texto "Mostrando 1 de X registros" para hacerlo más limpio
        "paging": false,    // Normalmente no hay más de 5-6 tarjetas por equipo en un partido
        "searching": false, // Oculta la barra de búsqueda interna del modal
        "language": { "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json" }
    });
}

$('#tbJugadoresSancionados tbody').on('click', '.btn-pagar', function () {

    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaDataSanciones.row(fila).data();

    swal({
        title: "¿Está seguro de procesar el pago?",
        text: `Se pagará la sanción de: ${data.NombreJugador} por Bs ${data.Monto.toFixed(2)}.`,
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
                text: 'Sí, Procesar Pago',
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
                url: "ControlPagoTarjetas.aspx/ActualizarPagoSancion",
                data: JSON.stringify({ IdSancion: data.IdSancion }),
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                success: function (response) {

                    MensajeToast(
                        response.d.Estado ? '¡Excelente!' : 'Atención',
                        response.d.Mensaje,
                        response.d.Valor
                    );

                    if (response.d.Estado) {
                        // 1. Recargamos la tabla interna del Modal (desaparecerá la tarjeta pagada)
                        tablaDataSanciones.ajax.reload(null, false);

                        // 2. Recargamos la tabla de atrás (se actualizará el monto total o desaparecerá el equipo si ya no debe nada)
                        if (typeof tablaData !== 'undefined') {
                            tablaData.ajax.reload(null, false);
                        }

                        // Nota: Retiramos el $("#mdDetalleSanciones").modal("hide"); 
                        // para que el cajero pueda seguir cobrando las demás tarjetas si existen.
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

// fin