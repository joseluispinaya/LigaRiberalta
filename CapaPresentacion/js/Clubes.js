
let tablaData;
let idEditar = 0;

function ObtenerFecha() {
    const d = new Date();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${d.getFullYear()}`;
}

$(document).ready(function () {
    $("#txtFecha").datepicker({
        todayHighlight: true,
        language: "es",        // Activa el archivo de idioma que agregaste
        format: "dd/mm/yyyy",   // Define el formato visual de la fecha
        autoclose: true
    });

    $("#txtFecha").val(ObtenerFecha());
    listaClubesOriginal();
});

// consume microservicio
function listaClubes() {

    tablaData = $("#tbData").DataTable({
        responsive: true,
        "ajax": {
            "url": `${API_BASE_URL}/clubes/listaClubes`,
            "type": "GET",
            "dataType": "json",
            "dataSrc": function (json) {
                if (json.Estado) {
                    return json.Data;
                } else {
                    mostrarAlerta("Mensaje", json.Mensaje, "warning");
                    return [];
                }
            },
            "error": function (xhr, error, thrown) {
                // Captura si la API se cae, no está disponible o da error 500/404
                console.log("Error status:", xhr.status, "Detalles:", thrown);
                mostrarAlerta("¡Atención!", "Error de comunicación con el servidor.", "error");

                // 1. Ocultar forzosamente el mensaje de "Cargando..."
                $("#tbData_processing").hide();

                // 2. Colocar un mensaje manual en el cuerpo de la tabla (usamos colspan="4" porque tienes 4 columnas visibles)
                $("#tbData tbody").html('<tr><td colspan="4" class="text-center text-muted">No se pudieron cargar los datos debido a un error de conexión.</td></tr>');
            }
        },
        "columns": [
            { "data": "IdClub", "visible": false, "searchable": false },
            {
                "data": "LogoUrl",
                "orderable": false,
                "searchable": false,
                render: function (data, type, row) {
                    let logo = row.LogoUrl ? row.LogoUrl : 'Logos/sinLogo.png';
                    //let logo = row.LogoUrl ? `${BASE_URL_IMG}${row.LogoUrl}` : 'Logos/sinLogo.png';
                    return `
                        <div class="d-flex align-items-center">
                            <div class="w-40px h-40px rounded-circle d-flex align-items-center justify-content-center bg-light overflow-hidden shadow-sm me-3">
                                <img src="${logo}" alt="" class="mw-100 mh-100" />
                            </div>
                            <div>
                                <div class="fw-bold fs-14px text-body">${row.NombreClub}</div>
                                <div class="fs-12px text-gray-500">Fundado: ${row.FechaFundacion}</div>
                            </div>
                        </div>
                    `;
                }
            },
            {
                "data": "Estado", "className": "text-center", render: function (data) {
                    if (data === true)
                        return '<span class="badge bg-yellow text-black fs-12px">Activo</span>';
                    else
                        return '<span class="badge bg-danger fs-12px">Inactivo</span>';
                }
            },
            {
                "defaultContent": '<button class="btn btn-lime btn-editar btn-sm"><i class="fas fa-pencil-alt"></i></button>',
                "orderable": false,
                "searchable": false,
                "className": "text-center"
            }
        ],
        "order": [[0, "desc"]],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

function listaClubesOriginal() {
    //if ($.fn.DataTable.isDataTable("#tbData")) {
    //    $("#tbData").DataTable().destroy();
    //    $('#tbData tbody').empty();
    //}

    tablaData = $("#tbData").DataTable({
        responsive: true,
        "ajax": {
            "url": 'Clubes.aspx/ListaClubes',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function (d) {
                return JSON.stringify(d);
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
            { "data": "IdClub", "visible": false, "searchable": false },
            {
                "data": "LogoUrl",
                "orderable": false,
                "searchable": false,
                render: function (data, type, row) {
                    let logo = row.LogoUrl ? row.LogoUrl : 'Logos/sinLogo.png';
                    return `
                        <div class="d-flex align-items-center">
                            <div class="w-40px h-40px rounded-circle d-flex align-items-center justify-content-center bg-light overflow-hidden shadow-sm me-3">
                                <img src="${logo}" alt="" class="mw-100 mh-100" />
                            </div>
                            <div>
                                <div class="fw-bold fs-14px text-body">${row.NombreClub}</div>
                                <div class="fs-12px text-gray-500">Fundado: ${row.FechaFundacion}</div>
                            </div>
                        </div>
                    `;
                }
            },
            {
                "data": "Estado", "className": "text-center", render: function (data) {
                    if (data === true)
                        return '<span class="badge bg-yellow text-black fs-12px">Activo</span>';
                    else
                        return '<span class="badge bg-danger fs-12px">Inactivo</span>';
                }
            },
            {
                "defaultContent": '<button class="btn btn-lime btn-editar btn-sm"><i class="fas fa-pencil-alt"></i></button>',
                "orderable": false,
                "searchable": false,
                "className": "text-center"
            }
        ],
        "order": [[0, "desc"]],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

$('#tbData tbody').on('click', '.btn-editar', function () {

    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    idEditar = data.IdClub;

    $("#txtNombreClub").val(data.NombreClub);
    $("#txtFecha").val(data.FechaFundacion);
    $("#cboEstado").val(data.Estado ? 1 : 0).prop("disabled", false);

    // 1. Evaluamos y concatenamos la ruta del logo
    //let logoUrl = data.LogoUrl ? `${BASE_URL_IMG}${data.LogoUrl}` : 'Logos/sinLogo.png';

    // 2. Asignamos la ruta final al atributo src de la imagen
    //$("#imgLogo").attr("src", logoUrl);

    $("#imgLogo").attr("src", data.LogoUrl || "Logos/sinLogo.png");
    $("#txtFoto").val("");

    // NUEVO: Limpiamos el texto falso al abrir modal
    $("#txtFotoName").val("");

    $("#modalLabeldetalle").text("Editar Registro");
    $("#modalAdd").modal("show");
});

$('#tbData tbody').on('click', '.btn-detalle', function () {

    let fila = $(this).closest('tr');

    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    const textoSms = `Detalles del Club: ${data.NombreClub}.`;
    mostrarAlerta("¡Mensaje!", textoSms, "info");

});

const TAMANO_MAXIMO = 2 * 1024 * 1024; // 2 MB en bytes

function mostrarImagenSeleccionada(input) {
    let file = input.files[0];
    let reader = new FileReader();

    // Si NO se seleccionó archivo (ej: presionaron "Cancelar")
    if (!file) {
        resetearVistaFoto(input);
        return;
    }

    // Validación: si no es imagen, mostramos error
    if (!esImagen(file)) {
        MensajeToast("Error", "El archivo seleccionado no es una imagen válida.", "error");

        resetearVistaFoto(input);
        return;
    }

    if (file.size > TAMANO_MAXIMO) {
        MensajeToast("Error", "El archivo seleccionado excede el tamaño máximo permitido (2 MB).", "error");

        resetearVistaFoto(input);
        return;
    }

    // Si todo es válido → mostrar vista previa
    reader.onload = (e) => $('#imgLogo').attr('src', e.target.result);
    reader.readAsDataURL(file);
}

function esImagen(file) {
    return file && file.type.startsWith("image/");
}

function resetearVistaFoto(input) {
    $('#imgLogo').attr('src', "Logos/sinLogo.png");
    input.value = ""; // Limpia el input file real
    $('#txtFotoName').val(""); // NUEVO: Limpia el texto de nuestra interfaz
}

// 1. Modifica el evento change para actualizar el texto
$('#txtFoto').change(function () {
    mostrarImagenSeleccionada(this);

    // Captura el nombre del archivo, ignorando la ruta ("C:\fakepath\imagen.jpg" -> "imagen.jpg")
    let fileName = $(this).val().split('\\').pop();

    // Si el usuario seleccionó algo, muestra el nombre. Si no, vuelve al texto por defecto.
    if (fileName) {
        $('#txtFotoName').val(fileName);
    } else {
        $('#txtFotoName').val("");
    }
});

$("#btnNuevoReg").on("click", function () {

    idEditar = 0;
    $("#txtNombreClub").val("");
    $("#txtFecha").val(ObtenerFecha());
    $("#cboEstado").val(1).prop("disabled", true);
    $('#imgLogo').attr('src', "Logos/sinLogo.png");
    $("#txtFoto").val("");

    // NUEVO: Limpiamos el texto falso al abrir modal
    $("#txtFotoName").val("");

    $("#modalLabeldetalle").text("Nuevo Registro");

    $("#modalAdd").modal("show");
})

function habilitarBoton() {
    $('#btnGuardarCambios').prop('disabled', false);
}

$("#btnGuardarCambios").on("click", function () {
    // Bloqueo inmediato
    $('#btnGuardarCambios').prop('disabled', true);

    let fechaStr = $("#txtFecha").val().trim();

    if (fechaStr === "") {
        MensajeToast("Campo incompleto", "Por favor, ingrese una fecha.", "warning");
        $("#txtFecha").focus();
        habilitarBoton();
        return;
    }

    if ($("#txtNombreClub").val().trim() === "") {
        MensajeToast("Campo incompleto", "Por favor, ingrese el nombre del Club.", "warning");
        $("#txtNombreClub").focus();
        habilitarBoton();
        return;
    }

    // 2. ARMAR EL OBJETO
    const objeto = {
        IdClub: idEditar,
        NombreClub: $("#txtNombreClub").val().trim(),
        FechaFundacion: fechaStr,
        Estado: ($("#cboEstado").val() === "1" ? true : false),
        LogoUrl: "" // Lo enviamos siempre vacío. Si hay foto nueva, el Base64 la reemplazará en C#.
    };

    //let ver = objeto.IdRegional;

    // 3. PROCESAR EL INPUT FILE
    const fileInput = document.getElementById('txtFoto');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // Extraemos solo el texto Base64, quitando la cabecera (data:image/jpeg;base64,)
            const base64String = e.target.result.split(',')[1];

            // Disparamos el AJAX enviando la imagen
            enviarAjaxClub(objeto, base64String);
        };
        reader.readAsDataURL(file);
    } else {
        // Si no hay foto, disparamos el AJAX mandando el base64 vacío
        enviarAjaxClub(objeto, "");
    }
});

function enviarAjaxClub(objeto, base64String) {
    $("#modalAdd").find("div.modal-content").LoadingOverlay("show");

    // INCORPORAMOS LA IMAGEN DIRECTAMENTE AL OBJETO
    // Esto hace "match" con tu nueva propiedad public string Base64Image { get; set; } en C#
    objeto.Base64Image = base64String;

    $.ajax({
        type: "POST",
        // Ajusta "/clubes" si tu RoutePrefix en el controlador es diferente
        url: `${API_BASE_URL}/clubes/registroNuevoClub`,

        // Enviamos el objeto plano
        data: JSON.stringify(objeto),

        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#modalAdd").find("div.modal-content").LoadingOverlay("hide");

            // Quitamos el .d
            alertaTimer(
                response.Estado ? '¡Excelente!' : 'Atención',
                response.Mensaje,
                response.Valor
            );

            if (response.Estado) {
                $("#modalAdd").modal("hide");
                if (tablaData) {
                    tablaData.ajax.reload(null, false);
                }

                idEditar = 0;
            }
        },
        error: function (xhr, status, error) {
            // Captura de errores optimizada
            console.log("Estado HTTP:", xhr.status, "Error:", error);
            console.log("Respuesta servidor:", xhr.responseText);

            $("#modalAdd").find("div.modal-content").LoadingOverlay("hide");
            MensajeToast("Error Crítico", "No se pudo conectar con el servidor.", "error");
        },
        complete: function () {
            habilitarBoton(); // Asumo que es tu función global para desbloquear botones
        }
    });
}

function enviarAjaxClubOriginal(objeto, base64String) {
    $("#modalAdd").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "Clubes.aspx/GuardarOrEditClub",
        data: JSON.stringify({ objeto: objeto, base64Image: base64String }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#modalAdd").find("div.modal-content").LoadingOverlay("hide");

            alertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención', // Título dinámico
                response.d.Mensaje, // Texto del servidor
                response.d.Valor // Icono (success/error/warning) 
            );

            if (response.d.Estado) {
                $("#modalAdd").modal("hide");
                if (tablaData) {
                    tablaData.ajax.reload(null, false);
                }
                idEditar = 0;
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#modalAdd").find("div.modal-content").LoadingOverlay("hide");
            MensajeToast("Error Crítico", "No se pudo conectar con el servidor.", "error");
        },
        complete: function () {
            habilitarBoton();
        }
    });
}

// fin