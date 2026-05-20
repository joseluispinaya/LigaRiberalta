
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

    $('#timepicker').timepicker({ showMeridian: false });
});

$("#btnNuevore").on("click", function () {

    idEditar = 0;

    $("#modalLabeldetalle").text("Nuevo Registro");

    $("#modalAdd").modal("show");
})

$("#btnGuardarReg").on("click", function () {

    let fechaSalidaStr = $("#txtFecha").val().trim();
    let horaSalidaStr = $("#timepicker").val().trim();

    const objeto = {
        IdPartido: idEditar,
        FechaStr: fechaSalidaStr,
        HoraStr: horaSalidaStr
    }

    console.log(objeto);
    mostrarAlerta("Mensaje", "Todo bien ver en consola.", "success");
})

// fin