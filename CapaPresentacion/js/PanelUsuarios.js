
let tablaData;
let idEditar = 0;
const TAMANO_MAXIMO = 2 * 1024 * 1024; // 2 MB

$(document).ready(function () {
    cargarRoles();
    listaUsuarios();

    $('#fileFoto').change(function () {
        mostrarImagenSeleccionada(this);
    });

    $('#fileFoto').on('cancel', function () {
        if (idEditar > 0) {
            this.value = ""; // Limpiamos el input por seguridad
        } else {
            // Modo Nuevo Registro: Resetea a sinimagen.png
            resetearVistaFoto(this);
        }
    });

});

// =======================================================================
// 1. CARGAR COMBOS
// =======================================================================
function cargarRoles() {
    $("#cboRol").html('<option value="">Cargando...</option>');
    $.ajax({
        url: "PanelUsuarios.aspx/ListaRoles",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                let opcionesHTML = '<option value="">-- Seleccione --</option>';
                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdRol}">${row.NombreRol}</option>`;
                });
                $("#cboRol").html(opcionesHTML);
            } else {
                $("#cboRol").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText);
            $("#cboRol").html('<option value="">Error de conexión</option>');
        }
    });
}

// =======================================================================
// 2. LISTAR USUARIOS (DataTable Completado)
// =======================================================================
function listaUsuarios() {
    tablaData = $("#tbUsuarios").DataTable({
        responsive: true,
        "ajax": {
            "url": 'PanelUsuarios.aspx/ObtenerUsuarios',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function (d) {
                return JSON.stringify(d);
            },
            "dataSrc": function (json) {
                return json.d.Estado ? json.d.Data : [];
            }
        },
        "columns": [
            {
                // Foto de Perfil
                "data": "FotoUrl",
                "className": "text-center align-middle",
                "orderable": false,
                "render": function (data, type, row) {
                    let img = data ? data : "Imagen/sinimagen.png";
                    return `<img src="${img}" class="rounded-circle border shadow-sm" style="width: 40px; height: 40px; object-fit: cover; background: white;">`;
                }
            },
            { "data": "NroCi", "className": "text-center align-middle fw-bold" },
            {
                // Nombre Completo y Correo debajo
                "data": null,
                "className": "text-start align-middle",
                "render": function (data, type, row) {
                    return `<div class="fw-bold text-dark">${row.NombreCompleto}</div>
                            <div class="fs-12px text-muted"><i class="fa fa-envelope me-1"></i>${row.Correo}</div>`;
                }
            },
            {
                // Celular
                "data": "Celular",
                "className": "text-center align-middle",
                "render": function (data) {
                    return `<i class="fa fa-mobile-alt text-muted me-1"></i>${data}`;
                }
            },
            {
                // Rol con Badge
                "data": "NombreRol",
                "className": "text-center align-middle",
                "render": function (data) {
                    return `<span class="badge bg-indigo bg-opacity-10 text-indigo border border-indigo px-2 py-1">${data}</span>`;
                }
            },
            {
                // Estado Activo/Inactivo
                "data": "Estado",
                "className": "text-center align-middle",
                "render": function (data) {
                    if (data) {
                        return '<span class="badge bg-success shadow-sm">Activo</span>';
                    } else {
                        return '<span class="badge bg-danger shadow-sm">Inactivo</span>';
                    }
                }
            },
            {
                // Opciones
                "data": null,
                "className": "text-center align-middle",
                "orderable": false,
                "render": function (data, type, row) {
                    return `<button class="btn btn-primary btn-sm btn-editar shadow-sm" title="Editar"><i class="fa fa-pencil-alt"></i></button>`;
                }
            }
        ],
        "order": [],
        "language": { "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json" }
    });
}

// =======================================================================
// 3. EVENTOS DE LOS BOTONES
// =======================================================================
$('#tbUsuarios tbody').on('click', '.btn-editar', function () {
    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }
    let data = tablaData.row(fila).data();

    idEditar = data.IdUsuario;

    // Llenar datos
    $("#txtNroCi").val(data.NroCi);
    $("#cboRol").val(data.IdRol);
    $("#txtNombres").val(data.Nombres);
    $("#txtApellidos").val(data.Apellidos);
    $("#txtCelular").val(data.Celular);
    $("#txtCorreo").val(data.Correo);

    // Cargar imagen
    $("#imgPreview").attr("src", data.FotoUrl ? data.FotoUrl : "Imagen/sinimagen.png");
    $("#fileFoto").val("");

    $("#lblTituloModal").text("Editar Usuario");
    $("#mdUsuario").modal("show");
});

$("#btnNuevoUsuario").on("click", function () {
    idEditar = 0; // Reseteamos la variable global

    // Limpiar inputs
    $("#txtNroCi").val("");
    $("#cboRol").val("");
    $("#txtNombres").val("");
    $("#txtApellidos").val("");
    $("#txtCelular").val("");
    $("#txtCorreo").val("");

    // Limpiar imagen
    resetearVistaFoto(document.getElementById('fileFoto'));

    $("#lblTituloModal").text("Nuevo Usuario");
    $("#mdUsuario").modal("show");
});

// =======================================================================
// 4. MANEJO DE IMÁGENES
// =======================================================================
function mostrarImagenSeleccionada(input) {
    let file = input.files[0];

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
        MensajeToast("Error", "El archivo excede el tamaño máximo (2 MB).", "error");
        resetearVistaFoto(input);
        return;
    }

    // Si todo es válido → mostrar vista previa
    let reader = new FileReader();
    reader.onload = (e) => $('#imgPreview').attr('src', e.target.result);
    reader.readAsDataURL(file);
}

function esImagen(file) {
    return file && file.type.startsWith("image/");
}

function resetearVistaFoto(input) {
    $('#imgPreview').attr('src', "Imagen/sinimagen.png");
    input.value = ""; // Limpia el input file real
}

// =======================================================================
// 5. GUARDADO (INSERT / UPDATE)
// =======================================================================
function habilitarBoton() {
    $('#btnGuardarUsuario').prop('disabled', false);
}

$("#btnGuardarUsuario").on("click", function () {
    // Bloqueo inmediato para evitar doble clic
    $('#btnGuardarUsuario').prop('disabled', true);

    // Validación dinámica usando las clases .model y el atributo name
    const inputs = $("#mdUsuario input.model").serializeArray();
    const inputs_sin_valor = inputs.filter(item => item.value.trim() === "");

    if (inputs_sin_valor.length > 0) {
        const mensaje = `Debe completar el campo: ${inputs_sin_valor[0].name}`;
        MensajeToast("Advertencia", mensaje, "warning");
        $(`input[name="${inputs_sin_valor[0].name}"]`).focus();
        habilitarBoton();
        return;
    }

    // Validar el Select (ya que no entra en el array de inputs)
    let idRol = $("#cboRol").val();
    if (idRol === "") {
        MensajeToast("Advertencia", "Debe seleccionar un Rol de usuario.", "warning");
        $("#cboRol").focus();
        habilitarBoton();
        return;
    }

    // ARMAR EL OBJETO (El campo Clave lo manejarás en C# dependiendo de idEditar)
    const objeto = {
        IdUsuario: idEditar,
        IdRol: parseInt(idRol),
        NroCi: $("#txtNroCi").val().trim(),
        Nombres: $("#txtNombres").val().trim(),
        Apellidos: $("#txtApellidos").val().trim(),
        Celular: $("#txtCelular").val().trim(),
        Correo: $("#txtCorreo").val().trim(),
        FotoUrl: "" // Base64 vacío por defecto
    };

    // PROCESAR EL INPUT FILE
    const fileInput = document.getElementById('fileFoto');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const base64String = e.target.result.split(',')[1];
            enviarAjaxUsuario(objeto, base64String);
        };
        reader.readAsDataURL(file);
    } else {
        enviarAjaxUsuario(objeto, "");
    }
});

function enviarAjaxUsuario(objeto, base64String) {
    // Agregamos animación de carga al modal
    $("#mdUsuario").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "PanelUsuarios.aspx/GuardarOrEditUsuarios",
        data: JSON.stringify({ objeto: objeto, base64Image: base64String }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#mdUsuario").find("div.modal-content").LoadingOverlay("hide");

            alertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
            );

            if (response.d.Estado) {
                $("#mdUsuario").modal("hide");
                if (tablaData) {
                    tablaData.ajax.reload(null, false);
                }
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#mdUsuario").find("div.modal-content").LoadingOverlay("hide");
            MensajeToast("Error Crítico", "No se pudo conectar con el servidor.", "error");
        },
        complete: function () {
            habilitarBoton();
        }
    });
}

// fin