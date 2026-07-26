

let listaJugadoresExcel = [];

$(document).ready(function () {

    // Inicializar Select2 para Club
    $("#cboClub").select2({
        width: '100%',
        placeholder: "-- Seleccione un Club --",
        templateResult: formatoResultadosClub,
        templateSelection: formatoSeleccionClub
    });

    cargarClubes();

    // ==========================================
    // EVENTO 1: LEER EXCEL Y PREVISUALIZAR
    // ==========================================
    $("#btnVerArchivo").on("click", function () {
        var fileUpload = $("#txtarchivo").get(0);
        var files = fileUpload.files;

        if (files.length === 0) {
            MensajeToast("Atención", "Debe seleccionar un archivo Excel.", "warning");
            return;
        }

        var file = files[0];

        // --- VALIDACIÓN DE EXTENSIÓN ---
        var extension = file.name.split('.').pop().toLowerCase();
        if (extension !== "xlsx" && extension !== "xls") {
            MensajeToast("Atención", "Formato no válido. Seleccione un archivo .xls o .xlsx", "warning");
            $("#txtarchivo").val('');
            return;
        }

        var reader = new FileReader();

        reader.onload = function (e) {
            var base64String = e.target.result.split(',')[1];

            $.ajax({
                url: "ExcelJugadores.aspx/ProcesarExcelJugadores",
                type: "POST",
                data: JSON.stringify({ archivoBase64: base64String }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response.d.Estado) {
                        listaJugadoresExcel = response.d.Data;
                        mostrarVistaPrevia(listaJugadoresExcel);
                    } else {
                        alertaTimer("Atención", response.d.Mensaje, "warning");
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
                    MensajeToast("Error Crítico", "No se pudo conectar con el servidor.", "error");
                }
            });
        };

        reader.readAsDataURL(file);
    });

    // ==========================================
    // EVENTO 2: ELIMINAR FILA DE LA PREVISUALIZACIÓN
    // ==========================================
    $("#tbData tbody").on("click", ".btn-delete-row", function () {
        let index = $(this).data("index");

        // Eliminamos al jugador problemático del array en memoria
        listaJugadoresExcel.splice(index, 1);

        // Redibujamos la tabla
        mostrarVistaPrevia(listaJugadoresExcel);
    });

    // ==========================================
    // EVENTO 3: GUARDAR REGISTROS
    // ==========================================
    $("#btnRegistroMasivo").on("click", function () {
        if (listaJugadoresExcel.length === 0) {
            MensajeToast("Atención", "No hay datos para el registro de jugadores.", "warning");
            return;
        }

        let idClubSeleccionado = $("#cboClub").val();

        if (idClubSeleccionado === "") {
            MensajeToast("Campo incompleto", "Debe seleccionar un club.", "warning");
            $("#cboClub").select2('open');
            return;
        }

        ConfirmarSweet(
            "¿Guardar Jugadores?",
            `Se guardará la lista con ${listaJugadoresExcel.length} registros de jugadores.`,
            "warning",
            "Sí, Guardar",
            function () {
                $("#btnRegistroMasivo").prop("disabled", true).html('<i class="fa fa-spinner fa-spin me-1"></i>PROCESANDO...');
                ejecutarGuardadoAJAX();
            }
        );
    });

});

// ==========================================
// FUNCIONES GLOBALES
// ==========================================

function mostrarVistaPrevia(data) {
    if ($.fn.DataTable.isDataTable("#tbData")) {
        $("#tbData").DataTable().destroy();
    }

    $("#tbData").DataTable({
        data: data,
        responsive: true,
        // Limpiamos la interfaz para que sea una tabla de revisión limpia
        searching: false,
        paging: false,
        info: false,
        columns: [
            { "data": "Nombres" },
            { "data": "Apellidos" },
            { "data": "NroComet" },
            { "data": "CI" },
            {
                "data": "Genero",
                "className": "text-center"
            },
            { "data": "FechaNacimiento" },
            {
                "data": null,
                "orderable": false,  // Clave: desactiva el ordenamiento en esta columna
                "searchable": false, // Excluye esta columna de búsquedas
                "render": function (data, type, row, meta) {
                    return `<button class="btn btn-danger btn-sm btn-delete-row" data-index="${meta.row}">
                                <i class="fa fa-trash"></i>
                            </button>`;
                },
                "className": "text-center"
            }
        ],
        language: {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });

    // Controlamos el botón de guardado según haya o no datos en el array
    if (data.length > 0) {
        $("#btnRegistroMasivo").prop("disabled", false);
    } else {
        $("#btnRegistroMasivo").prop("disabled", true);
    }
}

function formatoResultadosClub(estado) {
    // Si no tiene id (es el placeholder vacío), devolvemos el texto normal
    if (!estado.id) {
        return estado.text;
    }

    // Extraemos la información de los atributos data-*
    // OJO: JavaScript convierte las mayúsculas de los data- attributes a minúsculas,
    // así que 'data-nombreClub' se lee como 'dataset.nombreclub'
    let logoUrl = estado.element.dataset.logo;
    let nombre = estado.element.dataset.nombreclub;
    let fundacion = estado.element.dataset.fundacion;

    // Validación por si no tiene logo
    let logo = logoUrl ? logoUrl : 'Logos/sinLogo.png';
    let textoFundacion = fundacion ? fundacion : 'Sin registro';

    // Construimos un diseño HTML compacto usando flexbox, similar a tu tabla
    let $html = $(`
        <div class="d-flex align-items-center py-1 border-bottom border-light">
            <div class="w-30px h-30px rounded-circle d-flex align-items-center justify-content-center bg-light overflow-hidden shadow-sm me-2">
                <img src="${logo}" alt="Logo" class="mw-100 mh-100" style="object-fit: contain;">
            </div>
            <div class="flex-fill">
                <div class="fw-bold text-dark fs-13px">${nombre}</div>
                <div class="fs-11px text-gray-500"><i class="fa fa-calendar-alt me-1"></i>Fundado: ${textoFundacion}</div>
            </div>
        </div>
    `);

    return $html;
}

function formatoSeleccionClub(estado) {
    // Si no tiene id (es el placeholder vacío), devolvemos el texto normal
    if (!estado.id) {
        return estado.text;
    }

    let nombre = estado.element.dataset.nombreclub;

    // Cómo se verá el cajoncito cerrado (usamos el ícono de escudo de FontAwesome)
    return $(`<span><i class="fa fa-shield-halved text-indigo me-1"></i> <b>${nombre}</b></span>`);
}

function cargarClubes() {
    $("#cboClub").html('<option value=""></option>').trigger('change');

    $.ajax({
        url: "Clubes.aspx/ListaClubes", // Asegúrate de apuntar a la URL correcta si estás en otra página
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value=""></option>';

                $.each(response.d.Data, function (i, row) {
                    // AQUÍ ESTÁ LA MAGIA: 
                    // 1. Guardamos la data extra.
                    // 2. CORRECCIÓN: Cambié ${row.Placa} por ${row.NombreClub} en el texto del option
                    opcionesHTML += `
                        <option value="${row.IdClub}" 
                                data-logo="${row.LogoUrl}" 
                                data-nombreclub="${row.NombreClub}" 
                                data-fundacion="${row.FechaFundacion}">
                            ${row.NombreClub}
                        </option>`;
                });

                $("#cboClub").html(opcionesHTML).trigger('change');

            } else {
                $("#cboClub").html('<option value="">Error al cargar</option>').trigger('change');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboClub").html('<option value="">Error de conexión</option>').trigger('change');
        }
    });
}

function ejecutarGuardadoAJAX() {

    $("#cargann").LoadingOverlay("show");

    let idClubSeleccionado = $("#cboClub").val();

    let listaLimpiaParaCsharp = listaJugadoresExcel.map(function (item) {
        return {
            IdClubActual: parseInt(idClubSeleccionado),
            Nombres: item.Nombres,
            Apellidos: item.Apellidos,
            NroComet: item.NroComet,
            CI: item.CI,
            Genero: item.Genero,
            FechaNacimiento: item.FechaNacimiento,
            FotografiaUrl: item.FotografiaUrl || "",
            ClaveHash: item.ClaveHash || ""
        };
    });

    // 2. Petición AJAX
    $.ajax({
        type: "POST",
        url: "ExcelJugadores.aspx/GuardarJugadoresMasiva",
        data: JSON.stringify({
            listaJugadores: listaLimpiaParaCsharp // Enviamos la lista limpia
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {

            $("#cargann").LoadingOverlay("hide");

            alertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
            );

            // 3. Evaluamos la respuesta
            if (response.d.Estado) {
                setTimeout(function () {
                    location.reload();
                }, 3200);

            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#cargann").LoadingOverlay("hide");
            alertaTimer("Error Crítico", "Ocurrió un problema de conexión con el servidor.", "error");
        },
        complete: function () {
            $("#btnRegistroMasivo").prop("disabled", false).html('<i class="fa fa-save me-1"></i>Guardar Registro');
        }
    });

}

// fin