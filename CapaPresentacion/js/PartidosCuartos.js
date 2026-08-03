
let tablaDataSerieA;
let tablaDataSerieB;

// Variable global para guardar los cruces generados y luego mandarlos a C#
let crucesGenerados = [];

function ObtenerFecha() {
    const d = new Date();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${d.getFullYear()}`;
}

function ObtenerHoraActual() {
    let ahora = new Date();
    let horas = String(ahora.getHours()).padStart(2, '0');
    let minutos = String(ahora.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
}

$(document).ready(function () {

    $("#txtFecha").datepicker({
        todayHighlight: true,
        language: "es",        // Activa el archivo de idioma que agregaste
        format: "dd/mm/yyyy",   // Define el formato visual de la fecha
        autoclose: true
    });

    $("#txtFecha").val(ObtenerFecha());
    $('#txtHora').timepicker({ showMeridian: false });

    cargarTorneosFiltro();
    cargarCategoriasFiltro();
});

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

$("#btnBuscarFiltro").on("click", function () {
    let idTorneo = $("#cboFiltroTorneo").val();
    let idCategoria = $("#cboFiltroCategoria").val();

    if (idTorneo === "") {
        MensajeToast("Campo incompleto", "Debe seleccionar un torneo.", "warning");
        $("#cboFiltroTorneo").focus();
        return;
    }

    if (idCategoria === "") {
        MensajeToast("Campo incompleto", "Debe seleccionar una categoría.", "warning");
        $("#cboFiltroCategoria").focus();
        return;
    }

    obtenerClasificadosSeries(idTorneo, idCategoria);
});

function obtenerClasificadosSeries(idTorneo, idCategoria) {

    // 1. Preparamos ambas peticiones AJAX
    let requestSerieA = $.ajax({
        type: "POST",
        url: "PartidosCuartos.aspx/ListaClasificados",
        data: JSON.stringify({ IdTorneo: idTorneo, IdCategoria: idCategoria, IdSerie: 1 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    });

    let requestSerieB = $.ajax({
        type: "POST",
        url: "PartidosCuartos.aspx/ListaClasificados",
        data: JSON.stringify({ IdTorneo: idTorneo, IdCategoria: idCategoria, IdSerie: 2 }),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    });

    // 2. Ejecutamos ambas y esperamos a que LAS DOS terminen exitosamente
    $.when(requestSerieA, requestSerieB).done(function (responseA, responseB) {

        // jQuery retorna un array [data, textStatus, jqXHR] para cada respuesta
        let resultA = responseA[0].d;
        let resultB = responseB[0].d;

        if (resultA.Estado && resultB.Estado) {
            let listaA = resultA.Data;
            let listaB = resultB.Data;

            // 3. Llenamos las DataTables
            cargarTablaClasificados("#tbSerieA", listaA);
            cargarTablaClasificados("#tbSerieB", listaB);

            // 4. Armamos los cruces matemáticos (1A vs 4B, etc.)
            armarLlavesCuartos(listaA, listaB);

        } else {
            MensajeToast("Aviso", "No se encontraron datos completos de ambas series.", "warning");
        }
    }).fail(function (xhr) {
        console.log(xhr);
        MensajeToast("Error Crítico", "Error al comunicarse con el servidor.", "error");
    });
}

// Función reutilizable para llenar los DataTables de Serie A y B
function cargarTablaClasificados(tablaId, data) {
    if ($.fn.DataTable.isDataTable(tablaId)) {
        $(tablaId).DataTable().clear().destroy();
    }

    $(tablaId).DataTable({
        data: data,
        responsive: true,
        ordering: false, // Desactivamos el ordenamiento por clic para respetar el matemático de SQL
        paging: false,   // Como son solo 4 equipos, no necesitamos paginación
        info: false,
        searching: false,
        columns: [
            {
                data: "PosicionClasificacion",
                className: "text-center fw-bold fs-5 text-primary"
            },
            {
                data: null,
                className: "text-start align-middle",
                render: function (data, type, row) {
                    let logo = row.LogoUrl ? row.LogoUrl : 'Logos/sinLogo.png';
                    return `<img src="${logo}" width="25" height="25" class="rounded-circle border shadow-sm me-2" style="object-fit: contain;">
                            <span class="fw-bold text-dark fs-13px">${row.NombreClub}</span>`;
                }
            },
            { data: "Puntos", className: "text-center fw-bold text-dark" },
            { data: "DG", className: "text-center" }
        ],
        language: { url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json" }
    });
}

// Función que aplica el Artículo 17 de tu reglamento
function armarLlavesCuartos(listaA, listaB) {
    $("#contenedorCruces").empty();
    crucesGenerados = []; // Limpiamos el array global

    // Validamos que ambas series tengan exactamente los 4 clasificados
    if (listaA.length >= 4 && listaB.length >= 4) {

        crucesGenerados = [
            { Titulo: "Llave 1", Local: listaA[0], Visitante: listaB[3] }, // 1ro A vs 4to B
            { Titulo: "Llave 2", Local: listaA[1], Visitante: listaB[2] }, // 2do A vs 3ro B
            { Titulo: "Llave 3", Local: listaA[2], Visitante: listaB[1] }, // 3ro A vs 2do B
            { Titulo: "Llave 4", Local: listaA[3], Visitante: listaB[0] }  // 4to A vs 1ro B
        ];

        let htmlCruces = "";

        // Generamos las tarjetas HTML para cada llave
        $.each(crucesGenerados, function (i, cruce) {
            htmlCruces += `
                <div class="col-md-6 mb-3">
                    <!-- AÑADIMOS LA CLASE card-llave, cursor-pointer Y LOS ATRIBUTOS DATA -->
                    <div class="card border-0 shadow-sm rounded-3 bg-white card-llave" style="cursor: pointer; transition: transform 0.2s;" 
                         data-idlocal="${cruce.Local.IdEquipo}" 
                         data-idvisitante="${cruce.Visitante.IdEquipo}"
                         data-nombrelocal="${cruce.Local.NombreClub}"
                         data-nombrevisitante="${cruce.Visitante.NombreClub}"
                         onmouseover="this.style.transform='scale(1.02)'" 
                         onmouseout="this.style.transform='scale(1)'">
                         
                        <div class="card-header bg-light border-bottom text-center py-2">
                            <span class="fw-bold text-muted fs-12px text-uppercase letter-spacing-1">${cruce.Titulo}</span>
                        </div>
                        <div class="card-body p-3">
                            <div class="d-flex justify-content-between align-items-center">
                                <!-- Local -->
                                <div class="text-center" style="width: 40%;">
                                    <h6 class="fw-bold text-dark mb-1 fs-13px text-truncate">${cruce.Local.NombreClub}</h6>
                                    <span class="badge bg-primary bg-opacity-10 text-primary fs-11px">Posición ${cruce.Local.PosicionClasificacion} (A)</span>
                                </div>
                                
                                <!-- VS -->
                                <div class="badge bg-dark rounded-circle shadow-sm d-flex align-items-center justify-content-center fw-bold fs-6" style="width: 35px; height: 35px;">
                                    VS
                                </div>

                                <!-- Visitante -->
                                <div class="text-center" style="width: 40%;">
                                    <h6 class="fw-bold text-dark mb-1 fs-13px text-truncate">${cruce.Visitante.NombreClub}</h6>
                                    <span class="badge bg-danger bg-opacity-10 text-danger fs-11px">Posición ${cruce.Visitante.PosicionClasificacion} (B)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        $("#contenedorCruces").html(htmlCruces);

    } else {
        $("#contenedorCruces").html(`
            <div class="col-12 text-center p-4">
                <i class="fa fa-exclamation-triangle fa-2x text-warning mb-2"></i>
                <h6 class="text-muted">Aún no están definidos los 4 clasificados de cada serie.</h6>
            </div>
        `);
    }
}

// 1. EVENTO CLIC EN LA TARJETA DE LA LLAVE
$("#contenedorCruces").on("click", ".card-llave", function () {

    // Capturamos los datos incrustados en la tarjeta
    let idLocal = $(this).data("idlocal");
    let idVisitante = $(this).data("idvisitante");
    let nombreLocal = $(this).data("nombrelocal");
    let nombreVisitante = $(this).data("nombrevisitante");

    // Llenamos el modal con los datos
    $("#txtIdEquipo1").val(idLocal);
    $("#txtIdEquipo2").val(idVisitante);
    $("#lblEquiposvs").text(`${nombreLocal} VS ${nombreVisitante}`);

    // Limpiamos los campos de fecha, hora y cancha por si se programó otro antes
    $("#txtFecha").val(ObtenerFecha());

    // Usamos el método nativo del plugin para actualizar la hora correctamente
    //$('#txtHora').timepicker('setTime', ObtenerHoraActual());

    //$("#txtHora").val("");
    $("#txtCancha").val("");

    // Abrimos el modal
    $("#mdPartido").modal("show");
});

function habilitarBotonPartido() {
    $('#btnGuardarPartido').prop('disabled', false).html('<i class="fa fa-save me-1"></i>Confirmar Partido');
}

$("#btnGuardarPartido").on("click", function () {
    // MAGIA: Guardamos la referencia del botón actual antes de perder el scope
    let $btn = $(this);

    let idLocal = $("#txtIdEquipo1").val();
    let idVisitante = $("#txtIdEquipo2").val();

    // 1. Recolección de datos
    //let idFase = $("#cboFase").val();
    let fechaStr = $("#txtFecha").val().trim();
    let horaStr = $("#txtHora").val().trim();
    let canchaStr = $("#txtCancha").val().trim();

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
        MensajeToast("Campo requerido", "Debe seleccionar los equipos", "warning");
        return;
    }

    // 3. Armar el DTO para C#
    let objeto = {
        IdEquipoLocal: parseInt(idLocal),
        IdEquipoVisitante: parseInt(idVisitante),
        IdFase: 2,
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
    $("#mdPartido").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "DetallesSerie.aspx/ProgramarPartido",
        data: JSON.stringify({ objeto: objeto }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#mdPartido").find("div.modal-content").LoadingOverlay("hide");

            alertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
            );

            if (response.d.Estado) {
                $("#mdPartido").modal("hide");
                // Opcional: Podrías cambiar el color de la tarjeta programada para que el usuario sepa que ya está agendado
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#mdPartido").find("div.modal-content").LoadingOverlay("hide");
            MensajeToast("¡Error Crítico!", "Fallo de comunicación con el servidor.", "error");
        },
        complete: function () {
            habilitarBotonPartido();
        }
    });
}

$("#btnResultCuartos").on("click", function () {

    let t = $("#cboFiltroTorneo").val();
    let c = $("#cboFiltroCategoria").val();
    let s = 2;

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

    // Armamos la URL para viajar a la Página 2
    let urlDestino = `DetallesCuartos.aspx?idTorneo=${t}&idCategoria=${c}&idFase=${s}`;

    window.location.href = urlDestino;
});

// fin