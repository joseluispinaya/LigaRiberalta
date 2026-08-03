
let idEditar = 0;

let tablaPosiciones;
let tablaPartidos;

// Variables globales para guardar los IDs de la URL
let v_IdTorneo = 0;
let v_IdCategoria = 0;
let v_IdFase = 0;

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
    const idFaseUrl = urlParams.get('idFase');

    if (!idTorneoUrl || !idCategoriaUrl || !idFaseUrl || idTorneoUrl.trim() === "") {
        MensajeToast("Error de acceso", "Faltan parámetros para ver los detalles de la fase.", "error");
        setTimeout(function () {
            window.location.href = 'PartidosCuartos.aspx';
        }, 2200);
    } else {
        // Los guardamos en las variables globales como enteros
        v_IdTorneo = parseInt(idTorneoUrl);
        v_IdCategoria = parseInt(idCategoriaUrl);
        v_IdFase = parseInt(idFaseUrl);

        $("#txtFechaEdi").datepicker({
            todayHighlight: true,
            language: "es",        // Activa el archivo de idioma que agregaste
            format: "dd/mm/yyyy",   // Define el formato visual de la fecha
            autoclose: true
        });

        $("#txtFechaEdi").val(ObtenerFecha());

        $('#txtHoraEdi').timepicker({ showMeridian: false });

        cargarFixture();
    }

});

function cargarFixture() {
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
                    IdTorneo: v_IdTorneo,
                    IdCategoria: v_IdCategoria,
                    IdFase: v_IdFase
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
                "orderable": false,
                "searchable": false,
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
                "orderable": false,
                "searchable": false,
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
                    switch (row.IdEstado) {
                        case 1: // Programado
                            return `<span class="badge bg-info bg-opacity-20 text-info px-2 py-1"><i class="fa fa-calendar me-1"></i>${data}</span>`;
                        case 2: // Finalizado
                            return `<span class="badge bg-success bg-opacity-20 text-success px-2 py-1"><i class="fa fa-check me-1"></i>${data}</span>`;
                        case 3: // W.O. Local
                        case 4: // W.O. Visitante
                            return `<span class="badge bg-danger bg-opacity-20 text-danger px-2 py-1"><i class="fa fa-times-circle me-1"></i>${data}</span>`;
                        case 5: // Suspendido
                            return `<span class="badge bg-warning bg-opacity-20 text-warning px-2 py-1"><i class="fa fa-exclamation-triangle me-1"></i>${data}</span>`;
                        default:
                            return `<span class="badge bg-secondary px-2 py-1">${data}</span>`;
                    }
                }
            },
            // Opciones (Botones dinámicos según el estado)
            {
                "data": null,
                "className": "text-center align-middle",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, row) {
                    if (row.IdEstado === 1) {
                        // Retornamos ambos botones juntos. 
                        // Nota: Agregué 'me-1' al primer botón para separarlos visualmente y lo puse color primary.
                        return `<button class="btn btn-primary btn-sm px-2 py-1 fw-bold btn-editar me-1" title="Editar Partido" data-id="${row.IdPartido}">
                        <i class="fas fa-pencil-alt me-1"></i>Editar
                    </button>
                    <button class="btn btn-lime btn-sm px-2 py-1 fw-bold btn-resultado" title="Mesa de Control / Resultados" data-id="${row.IdPartido}">
                        <i class="fa fa-play me-1"></i>Resultado
                    </button>`;
                    }

                    // Si el estado es diferente de 1, mostramos solo el Acta
                    return `<button class="btn btn-white border btn-sm px-2 py-1 fw-bold text-gray-700 btn-acta" title="Ver Acta" data-id="${row.IdPartido}">
                    <i class="fa fa-file-alt me-1"></i>Acta
                </button>`;
                }
            }
        ],
        "order": [], // Mantiene el orden por fecha y hora de tu SQL
        "language": { "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json" }
    });
}

$('#tbPartidos tbody').on('click', '.btn-resultado', function () {

    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaPartidos.row(fila).data();
    window.location.href = 'PanelResultados.aspx?idPartido=' + data.IdPartido + '&esDetalle=false';

});

$('#tbPartidos tbody').on('click', '.btn-editar', function () {

    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaPartidos.row(fila).data();

    $("#txtIdPartidoEdit").val(data.IdPartido);

    $("#lblEquiposvs").text(`${data.ClubLocal} Vs ${data.ClubVisitante}`);

    $("#txtFechaEdi").val(data.Fecha);
    $("#txtCanchaEdi").val(data.Cancha);
    $("#txtHoraEdi").val(data.Hora);

    $("#mdEditarPartido").modal("show");
});

function habilitarBoton() {
    $('#btnGuardarCamEdit').prop('disabled', false);
}

$("#btnGuardarCamEdit").on("click", function () {

    let $btn = $(this);

    let idPartido = $("#txtIdPartidoEdit").val().trim();
    let fechaStr = $("#txtFechaEdi").val().trim();
    let horaStr = $("#txtHoraEdi").val().trim();
    let canchaStr = $("#txtCanchaEdi").val().trim();

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

    let ahora = new Date();

    if (fechaStr === "" || horaStr === "") {
        MensajeToast("Campo requerido", "La fecha y la hora son obligatorias.", "warning");
        return;
    }
    if (canchaStr === "") {
        MensajeToast("Campo requerido", "Debe especificar la cancha donde se jugará.", "warning");
        $("#txtCanchaEdi").focus();
        return;
    }

    if (idPartido === "" || idPartido === "0") {
        MensajeToast("Campo incompleto", "Por favor, seleccione un Partido.", "warning");
        return;
    }

    const objeto = {
        IdPartido: parseInt(idPartido),
        Fecha: fechaStr,
        Hora: horaStr,
        Cancha: canchaStr
    };

    if (fechaPartidoExacta < ahora) {
        // En lugar de un Toast y un return, le preguntamos
        swal({
            title: "Fecha en el pasado",
            text: "Está reprogramando un partido con una fecha u hora que ya pasó. ¿Es una actualizacion atrasado?",
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
                    text: 'Sí, actualizar de todos modos',
                    value: true,
                    visible: true,
                    className: 'btn btn-indigo',
                    closeModal: true
                }
            }
        }).then((willSave) => {
            if (willSave) {
                // 4. Bloquear botón usando la variable $btn
                $btn.prop('disabled', true);
                ejecutarEditAJAX(objeto);
            }
        });
    } else {
        // Bloquear botón usando la variable $btn
        $btn.prop('disabled', true);
        ejecutarEditAJAX(objeto);
    }

});


function ejecutarEditAJAX(objeto) {
    $("#mdEditarPartido").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "DetallesSerie.aspx/ActualizarFechaPartido",
        data: JSON.stringify(objeto),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#mdEditarPartido").find("div.modal-content").LoadingOverlay("hide");

            alertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
            );

            if (response.d.Estado) {
                $("#mdEditarPartido").modal("hide");
                $("#txtIdPartidoEdit").val("0");
                $("#txtCanchaEdi").val("");

                if (tablaPartidos) {
                    tablaPartidos.ajax.reload(null, false);
                } else {
                    cargarFixture();
                }
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#mdEditarPartido").find("div.modal-content").LoadingOverlay("hide");
            MensajeToast("¡Error Crítico!", "Fallo de comunicación con el servidor.", "error");
        },
        complete: function () {
            habilitarBoton();
        }
    });
}

$('#tbPartidos tbody').on('click', '.btn-acta', function () {

    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaPartidos.row(fila).data();
    window.location.href = 'PanelResultados.aspx?idPartido=' + data.IdPartido + '&esDetalle=true';

});

// fin