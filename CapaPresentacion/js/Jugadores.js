
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
});

$("#btnNuevoReg").on("click", function () {

    idEditar = 0;
    $("#txtFechaNacido").val(ObtenerFecha());
    $("#txtNombres").val("");
    $("#txtApellidos").val("");
    $("#txtCI").val("");
    $("#txtCredencial").val("");

    $('#imgJugador').attr('src', "Imagen/sinimagen.png");
    $("#txtFoto").val("");

    // NUEVO: Limpiamos el texto falso al abrir modal
    $("#txtFotoName").val(""); 

    $("#modalLabeldetalle").text("Nuevo Registro");

    $("#modalAdd").modal("show");
})

// fin