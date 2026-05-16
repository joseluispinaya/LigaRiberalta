
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
});

$("#btnNuevoReg").on("click", function () {

    idEditar = 0;
    $("#txtNombreClub").val("");
    $("#txtFecha").val(ObtenerFecha());
    $("#cboEstado").val(1).prop("disabled", true);
    $('#imgLogo').attr('src', "Imagen/sinimagen.png");
    $("#txtFoto").val("");

    // NUEVO: Limpiamos el texto falso al abrir modal
    $("#txtFotoName").val(""); 

    $("#modalLabeldetalle").text("Nuevo Registro");

    $("#modalAdd").modal("show");
})



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
    $('#imgLogo').attr('src', "Imagen/sinimagen.png");
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

$("#btnGuardarReg").on("click", function () {
})

// fin