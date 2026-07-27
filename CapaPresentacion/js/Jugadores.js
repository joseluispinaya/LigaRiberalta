
let tablaData;
let idEditar = 0;

function ObtenerFecha() {
    const d = new Date();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${d.getFullYear()}`;
}

$(document).ready(function () {
    $("#txtFechaNacido").datepicker({
        todayHighlight: true,
        language: "es",        // Activa el archivo de idioma que agregaste
        format: "dd/mm/yyyy",   // Define el formato visual de la fecha
        autoclose: true
    });

    $("#txtFechaNacido").val(ObtenerFecha());
    cargarClubesTable();

    // Inicializar Select2 para Club
    $("#cboClub").select2({
        dropdownParent: $('#modalAdd'),
        width: '100%',
        placeholder: "-- Seleccione un Club --",
        templateResult: formatoResultadosClub,  // Cambiamos el nombre de la función
        templateSelection: formatoSeleccionClub // Cambiamos el nombre de la función
    });

    cargarClubes();
});

function cargarClubesTable() {

    $("#cboClubFiltro").html('<option value="">Cargando...</option>');

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
                $("#cboClubFiltro").html(opcionesHTML);

            } else {
                $("#cboClubFiltro").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboClubFiltro").html('<option value="">Error de conexión</option>');
        }
    });
}

$("#cboClubFiltro").on("change", function () {

    // Verificamos si la tabla ya fue inicializada alguna vez
    if ($.fn.DataTable.isDataTable("#tbData")) {
        // Si ya existe, simplemente le decimos que se recargue. 
        // ¡Automáticamente leerá el nuevo valor del select!
        tablaData.ajax.reload();
    } else {
        // Si es la primera vez que seleccionan algo, dibujamos la tabla
        listaJugadores();
    }

});

function listaJugadores() {

    tablaData = $("#tbData").DataTable({
        responsive: true,
        "ajax": {
            "url": 'Jugadores.aspx/ListaJugadoresIdClub',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                // ¡LA MAGIA ESTÁ AQUÍ!
                // En vez de usar una variable estática, leemos el select en tiempo real
                let idClubSeleccionado = $("#cboClubFiltro").val();

                // Si por algún motivo es nulo o vacío, mandamos 0
                let request = {
                    IdClub: parseInt(idClubSeleccionado) || 0
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
            { "data": "IdJugador", "visible": false, "searchable": false },

            // Columna 1: JUGADOR (Foto, Nombre Completo y COMET)
            {
                "data": null,
                "orderable": false,
                "searchable": false,
                "render": function (data, type, row) {
                    let foto = row.FotografiaUrl ? row.FotografiaUrl : 'Imagen/sinimagen.png'; // Cambia la ruta a tu imagen por defecto
                    let nombreCompleto = row.Nombres + ' ' + row.Apellidos;

                    return `
                        <div class="d-flex align-items-center">
                            <div class="w-40px h-40px rounded-circle d-flex align-items-center justify-content-center bg-light overflow-hidden shadow-sm me-3">
                                <img src="${foto}" alt="Foto" class="mw-100 mh-100" style="object-fit: cover;" />
                            </div>
                            <div>
                                <div class="fw-bold fs-14px text-body">${nombreCompleto}</div>
                                <div class="fs-12px text-gray-500">COMET: <span class="text-dark fw-semibold">${row.NroComet}</span></div>
                            </div>
                        </div>
                    `;
                }
            },

            // Columna 2: DEMOGRAFÍA (Fecha Nac, Edad Deportiva y Género)
            {
                "data": null,
                "render": function (data, type, row) {
                    // Icono y color según el género
                    let iconoGenero = row.Genero === 'M'
                        ? '<i class="fa fa-mars text-blue me-1" title="Varón"></i>'
                        : '<i class="fa fa-venus text-pink me-1" title="Mujer"></i>';

                    return `
                        <div class="fw-semibold text-dark mb-1"><i class="fa fa-calendar-alt text-muted me-1"></i>${row.FechaNacimiento}</div>
                        <div class="fs-12px text-gray-600">${iconoGenero} ${row.Edad}</div>
                    `;
                }
            },

            // Columna 3: DOCUMENTO DE IDENTIDAD
            {
                "data": "CI",
                "className": "text-center",
                "render": function (data) {
                    return `<span class="badge p-2 bg-light text-dark fs-12px me-1"><i class="fas fa-id-card text-warning me-1"></i>${data}</span>`;
                }
            },

            // Columna 4: OPCIONES
            {
                "defaultContent": '<button class="btn btn-lime btn-editar btn-sm"><i class="fas fa-pencil-alt"></i></button>',
                "orderable": false,
                "searchable": false,
                "className": "text-center align-middle"
            }
        ],
        "order": [[0, "desc"]],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
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


// ==========================================
// CARGA DE DATOS AJAX
// ==========================================

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


$('#tbData tbody').on('click', '.btn-editar', function () {

    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    idEditar = data.IdJugador;

    $("#txtNombres").val(data.Nombres);
    $("#txtApellidos").val(data.Apellidos);
    $("#txtCI").val(data.CI);
    $("#txtCredencial").val(data.NroComet);
    $("#cboGenero").val(data.Genero === "M" ? 1 : 0);
    $("#txtFechaNacido").val(data.FechaNacimiento);

    $("#cboClub").val(data.IdClubActual.toString()).trigger("change");

    $("#imgJugador").attr("src", data.FotografiaUrl || "Imagen/sinimagen.png");
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
    const textoSms = `Detalles del Jugador: ${data.Nombres}.`;
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
    reader.onload = (e) => $('#imgJugador').attr('src', e.target.result);
    reader.readAsDataURL(file);
}

function esImagen(file) {
    return file && file.type.startsWith("image/");
}

function resetearVistaFoto(input) {
    $('#imgJugador').attr('src', "Imagen/sinimagen.png");
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
    $("#txtFechaNacido").val(ObtenerFecha());
    $("#txtNombres").val("");
    $("#txtApellidos").val("");
    $("#txtCI").val("");
    $("#txtCredencial").val("");
    $("#cboGenero").val(1);

    $("#cboClub").val("").trigger('change');

    $('#imgJugador').attr('src', "Imagen/sinimagen.png");
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

    const inputs = $("#modalAdd input.model").serializeArray();
    const inputs_sin_valor = inputs.filter(item => item.value.trim() === "");

    if (inputs_sin_valor.length > 0) {
        const mensaje = `Debe completar el campo: "${inputs_sin_valor[0].name}"`;
        MensajeToast("Advertencia", mensaje, "warning");
        $(`input[name="${inputs_sin_valor[0].name}"]`).focus();
        habilitarBoton();
        return;
    }


    let idClubSeleccionado = $("#cboClub").val();

    let fechaStr = $("#txtFechaNacido").val().trim();

    if (idClubSeleccionado === "") {
        MensajeToast("Campo incompleto", "Debe seleccionar un club.", "warning");
        $("#cboClub").select2('open');
        habilitarBoton();
        return;
    }

    if (fechaStr === "") {
        MensajeToast("Campo incompleto", "Por favor, ingrese una fecha.", "warning");
        $("#txtFechaNacido").focus();
        habilitarBoton();
        return;
    }

    // 2. ARMAR EL OBJETO
    const objeto = {
        IdJugador: idEditar,
        IdClubActual: parseInt(idClubSeleccionado),
        Nombres: $("#txtNombres").val().trim(),
        Apellidos: $("#txtApellidos").val().trim(),
        NroComet: $("#txtCredencial").val().trim(),
        CI: $("#txtCI").val().trim(),
        Genero: ($("#cboGenero").val() === "1" ? "M" : "F"),
        FechaNacimiento: fechaStr,
        FotografiaUrl: "" // Lo enviamos siempre vacío. Si hay foto nueva, el Base64 la reemplazará en C#.
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
            enviarAjaxJugador(objeto, base64String);
        };
        reader.readAsDataURL(file);
    } else {
        // Si no hay foto, disparamos el AJAX mandando el base64 vacío
        enviarAjaxJugador(objeto, "");
    }
});

function enviarAjaxJugador(objeto, base64String) {
    $("#modalAdd").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "Jugadores.aspx/GuardarOrEditJugadoresNew",
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

                $("#cboClubFiltro").val(objeto.IdClubActual);

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