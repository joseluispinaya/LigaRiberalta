
let tablaData;
let idEditar = 0;


$("#btnNuevoReg").on("click", function () {

    idEditar = 0;
    $("#txtNomCatego").val("");
    $("#cboGenero").val(1);
    $("#txtEdad").val("");
    $("#cboEstado").val(1).prop("disabled", true);

    $("#modalLabeldetalle").text("Nuevo Registro");

    $("#modalAdd").modal("show");
})

// fin