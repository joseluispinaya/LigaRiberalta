
let tablaData;
let idEditar = 0;


$(document).ready(function () {
    cargarTodasTorneos();
    cargarTodasCategorias();
    cargarClubes();
    cargarSeries();
});

function cargarClubes() {

    $("#cboClub").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "Clubes.aspx/ListaClubes",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                // 1. Empezamos con la opción por defecto
                let opcionesHTML = '<option value="">-- Seleccione Club --</option>';

                // 2. Concatenamos todas las opciones en la variable (en memoria)
                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdClub}">${row.NombreClub}</option>`;
                });

                // 3. Inyectamos todo al DOM en un solo movimiento
                $("#cboClub").html(opcionesHTML);

            } else {
                $("#cboClub").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboClub").html('<option value="">Error de conexión</option>');
        }
    });
}

function cargarTodasTorneos() {

    let combosTorneos = $("#cboFiltroTorneo, #cboTorneo");

    // 2. Mostramos el mensaje de carga en todos a la vez
    combosTorneos.html('<option value="">Cargando...</option>');

    $.ajax({
        url: "Torneos.aspx/ListaTorneos",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">-- Seleccione un Torneo --</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdTorneo}">${row.NombreTorneo}</option>`;
                });

                // 3. ¡LA MAGIA! Inyectamos el HTML en los 4 selects al mismo tiempo
                combosTorneos.html(opcionesHTML);

            } else {
                combosTorneos.html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            combosTorneos.html('<option value="">Error de conexión</option>');
        }
    });
}

function cargarTodasCategorias() {

    let combosCategorias = $("#cboFiltroCategoria, #cboCategoria");

    // 2. Mostramos el mensaje de carga en todos a la vez
    combosCategorias.html('<option value="">Cargando...</option>');

    $.ajax({
        url: "Categorias.aspx/ListaCategorias",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">-- Seleccione una Categoría --</option>';

                $.each(response.d.Data, function (i, row) {

                    // 1. Evaluamos la letra que llega de la base de datos
                    let textoGenero = row.Genero === 'M' ? 'Varones' : 'Damas';

                    // 2. Concatenamos el NombreCategoria y el textoGenero
                    // Ej: "Sub 8" + " " + "Varones"
                    opcionesHTML += `<option value="${row.IdCategoria}">${row.NombreCategoria} ${textoGenero}</option>`;
                });

                // 3. ¡LA MAGIA! Inyectamos el HTML en los 4 selects al mismo tiempo
                combosCategorias.html(opcionesHTML);

            } else {
                combosCategorias.html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            combosCategorias.html('<option value="">Error de conexión</option>');
        }
    });
}

function cargarSeries() {

    $("#cboSerie").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "Torneos.aspx/ListaSeries",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                // 1. Empezamos con la opción por defecto
                let opcionesHTML = '<option value="">-- Seleccione Serie --</option>';

                // 2. Concatenamos todas las opciones en la variable (en memoria)
                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdSerie}">${row.NombreSerie}</option>`;
                });

                // 3. Inyectamos todo al DOM en un solo movimiento
                $("#cboSerie").html(opcionesHTML);

            } else {
                $("#cboSerie").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboSerie").html('<option value="">Error de conexión</option>');
        }
    });
}

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
                    opcionesHTML += `<option value="${row.IdCategoria}">${row.NombreCategoria}</option>`;
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

    // Verificamos si la tabla ya fue inicializada alguna vez
    if ($.fn.DataTable.isDataTable("#tbData")) {
        tablaData.ajax.reload();
    } else {
        // Si es la primera vez que seleccionan algo, dibujamos la tabla
        listaEquiposInscritos();
    }
});

function listaEquiposInscritos() {

    tablaData = $("#tbData").DataTable({
        responsive: true,
        "ajax": {
            "url": 'Inscripciones.aspx/ListaEquiposInscritos',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                let idTorneoSeleccionado = $("#cboFiltroTorneo").val();
                let idCategoriaSeleccionada = $("#cboFiltroCategoria").val();

                let request = {
                    IdTorneo: parseInt(idTorneoSeleccionado) || 0,
                    IdCategoria: parseInt(idCategoriaSeleccionada) || 0
                };
                return JSON.stringify(request);
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
            // Columna Oculta: ID del Equipo Inscrito (Útil para editar)
            { "data": "IdEquipo", "visible": false, "searchable": false },

            // Columna 1: CLUB INSCRITO (Logo + Nombre)
            {
                "data": null,
                "render": function (data, type, row) {
                    let logo = row.LogoUrl ? row.LogoUrl : 'Logos/sinLogo.png';
                    return `
                        <div class="d-flex align-items-center">
                            <div class="w-30px h-30px rounded-circle d-flex align-items-center justify-content-center bg-light overflow-hidden shadow-sm me-2">
                                <img src="${logo}" alt="" class="mw-100 mh-100" style="object-fit: contain;" />
                            </div>
                            <div class="fw-bold fs-13px text-dark">${row.NombreClub}</div>
                        </div>
                    `;
                }
            },

            // Columna 2: SERIE
            {
                "data": "NombreSerie",
                "className": "align-middle",
                "render": function (data) {
                    return `<span class="fw-semibold text-primary"><i class="fa fa-layer-group me-1 opacity-5"></i>${data}</span>`;
                }
            },

            // Columna 3: PENALIZACIÓN (Visualmente clara si hay puntos en contra)
            {
                "data": "PuntosPenalizacion",
                "className": "text-center align-middle",
                "render": function (data) {
                    if (data > 0) {
                        // Si tiene penalización, resalta en rojo
                        return `<span class="badge bg-danger fs-12px" title="Puntos restados en mesa"><i class="fa fa-minus-circle me-1"></i>${data} pts</span>`;
                    } else {
                        // Si está limpio, gris sutil
                        return `<span class="text-muted fs-12px"><i class="fa fa-check text-success me-1"></i>0</span>`;
                    }
                }
            },

            // Columna 4: PAGO DE INSCRIPCIÓN (Pendiente vs Pagado)
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

            // Columna 5: OPCIONES
            {
                "defaultContent": '<button class="btn btn-lime btn-editar btn-sm me-2" title="Editar"><i class="fas fa-pencil-alt"></i></button>' +
                    '<button class="btn btn-info btn-detalle btn-sm me-2" title="Detalles"><i class="fas fa-eye"></i></button>' +
                    '<button class="btn btn-danger btn-addplantilla btn-sm" title="Plantilla"><i class="fas fa-futbol"></i></button>',
                "orderable": false,
                "searchable": false,
                "className": "text-center align-middle"
            }
        ],
        "order": [], // Mantiene el ORDER BY de tu SQL Server
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

// EVENTOS DE BOTONES EN LA TABLA
// ==========================================

$('#tbData tbody').on('click', '.btn-editar', function () {

    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    idEditar = data.IdEquipo;

    // Llenamos los selects normales directamente
    $("#cboTorneo").val(data.IdTorneo);
    $("#cboCategoria").val(data.IdCategoria);
    $("#cboClub").val(data.IdClub);
    $("#cboSerie").val(data.IdSerie);

    // Llenamos los campos extras
    $("#txtPenalizacion").val(data.PuntosPenalizacion);
    $("#chkPagado").prop("checked", data.InscripcionPagada);

    // Usamos html() en vez de text() para no borrar el icono de FontAwesome
    $("#modalLabeldetalle").html('<i class="fa fa-edit text-success me-2"></i>Editar Inscripción');
    $("#modalAdd").modal("show");
});

$('#tbData tbody').on('click', '.btn-detalle', function () {

    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    const textoSms = `El club ${data.NombreClub} está asignado a la serie ${data.NombreSerie}. Actualmente tiene ${data.PuntosPenalizacion} puntos de penalización.`;
    mostrarAlerta("Detalles de Inscripción", textoSms, "info");

});

$('#tbData tbody').on('click', '.btn-addplantilla', function () {

    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    var url = 'PlantelEquipo.aspx?id=' + data.IdEquipo;
    window.location.href = url;
    //const textoSms = `El Id Equipo: ${data.IdEquipo}.`;
    //mostrarAlerta("Agrgar Plantilla", textoSms, "info");

});

// ==========================================
// EVENTO: NUEVA INSCRIPCIÓN
// ==========================================

$("#btnNuevaInscripcion").on("click", function () {
    idEditar = 0;

    // Truco UX: Tomar los valores de los filtros de búsqueda para autocompletar el modal
    let filtroTorneo = $("#cboFiltroTorneo").val();
    let filtroCategoria = $("#cboFiltroCategoria").val();

    $("#cboTorneo").val(filtroTorneo);
    $("#cboCategoria").val(filtroCategoria);

    // Limpiar Club y Serie
    $("#cboClub").val("");
    $("#cboSerie").val("");

    // Limpiar otros campos
    $("#txtPenalizacion").val("0");
    $("#chkPagado").prop("checked", false);

    $("#modalLabeldetalle").html('<i class="fa fa-plus-circle text-success me-2"></i>Nueva Inscripción');
    $("#modalAdd").modal("show");
});

// ==========================================
// EVENTO: GUARDAR CAMBIOS
// ==========================================

function habilitarBoton() {
    $('#btnGuardarReg').prop('disabled', false);
}

$("#btnGuardarReg").on("click", function () {
    // Bloqueo inmediato
    $('#btnGuardarReg').prop('disabled', true);

    let idTorneo = $("#cboTorneo").val();
    let idCategoria = $("#cboCategoria").val();
    let idClub = $("#cboClub").val();
    let idSerie = $("#cboSerie").val();

    if (idTorneo === "" || idTorneo == null) {
        MensajeToast("Campo incompleto", "Por favor, seleccione un Torneo.", "warning");
        $("#cboTorneo").focus();
        habilitarBoton();
        return;
    }

    if (idCategoria === "" || idCategoria == null) {
        MensajeToast("Campo incompleto", "Por favor, seleccione una Categoría.", "warning");
        $("#cboCategoria").focus();
        habilitarBoton();
        return;
    }

    if (idClub === "" || idClub == null) {
        MensajeToast("Campo incompleto", "Por favor, seleccione un Club.", "warning");
        $("#cboClub").focus();
        habilitarBoton();
        return;
    }

    if (idSerie === "" || idSerie == null) {
        MensajeToast("Campo incompleto", "Por favor, seleccione una Serie.", "warning");
        $("#cboSerie").focus();
        habilitarBoton();
        return;
    }

    const ptsPenalizacion = parseInt($("#txtPenalizacion").val()) || 0;

    if (ptsPenalizacion < 0) {
        MensajeToast("Valor inválido", "Los puntos de Penalización no pueden ser números negativos.", "warning");
        $("#txtPenalizacion").focus();
        habilitarBoton();
        return;
    }

    let inscriPago = $("#chkPagado").is(":checked");

    // 2. ARMAR EL OBJETO
    const objeto = {
        IdEquipo: idEditar,
        IdClub: parseInt(idClub),
        IdCategoria: parseInt(idCategoria),
        IdTorneo: parseInt(idTorneo),
        IdSerie: parseInt(idSerie),
        PuntosPenalizacion: ptsPenalizacion,
        InscripcionPagada: inscriPago
    };

    $("#modalAdd").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "Inscripciones.aspx/GuardarOrEditInscripcion",
        data: JSON.stringify({ objeto: objeto }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#modalAdd").find("div.modal-content").LoadingOverlay("hide");
            alertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
            );

            if (response.d.Estado) {
                $("#modalAdd").modal("hide");

                // Actualizamos los filtros de búsqueda directamente
                $("#cboFiltroTorneo").val(idTorneo);
                $("#cboFiltroCategoria").val(idCategoria);

                if (tablaData) {
                    tablaData.ajax.reload(null, false);
                } else {
                    listaEquiposInscritos();
                }

                idEditar = 0;
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#modalAdd").find("div.modal-content").LoadingOverlay("hide");
            MensajeToast("¡Atención!", "Error de comunicación con el servidor.", "error");
        },
        complete: function () {
            habilitarBoton();
        }
    });
});

// fin