

let tablaData;
let idEditar = 0;


$(document).ready(function () {
    listaCategorias();
});

function listaCategorias() {
    //if ($.fn.DataTable.isDataTable("#tbData")) {
    //    $("#tbData").DataTable().destroy();
    //    $('#tbData tbody').empty();
    //}

    tablaData = $("#tbData").DataTable({
        responsive: true,
        "ajax": {
            "url": 'Categorias.aspx/ListaCategorias',
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
            { "data": "IdCategoria", "visible": false, "searchable": false },
            {
                "data": null, // Cambiamos LogoUrl por null porque usaremos toda la fila (row)
                "orderable": false,
                "searchable": false,
                render: function (data, type, row) {
                    // 1. Controlamos la Edad Máxima
                    let textoEdad = row.EdadMaxima === 0 ? "Categoría Libre" : `Edad Máxima: ${row.EdadMaxima} años`;

                    // 2. Controlamos el Género y los colores del icono
                    let textoGenero = row.Genero === 'M' ? "Varones" : "Damas";
                    let colorFondo = row.Genero === 'M' ? "bg-blue bg-opacity-10 text-blue" : "bg-pink bg-opacity-10 text-pink";
                    let iconoGenero = row.Genero === 'M' ? "fa-mars" : "fa-venus";

                    // 3. Devolvemos el HTML compacto
                    return `
                        <div class="d-flex align-items-center">
                            <div class="w-40px h-40px rounded-circle d-flex align-items-center justify-content-center ${colorFondo} shadow-sm me-3 fs-18px">
                                <i class="fa fa-users"></i>
                            </div>
                            
                            <div>
                                <div class="fw-bold fs-14px text-body">${row.NombreCategoria}</div>
                                <div class="fs-12px text-gray-500">
                                    <i class="fa ${iconoGenero} me-1"></i>${textoGenero} &nbsp;|&nbsp; ${textoEdad}
                                </div>
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
                "defaultContent": '<button class="btn btn-lime btn-editar btn-sm me-2"><i class="fas fa-pencil-alt"></i></button>' +
                    '<button class="btn btn-info btn-detalle btn-sm"><i class="fas fa-eye"></i></button>',
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
    idEditar = data.IdCategoria;

    $("#txtNomCatego").val(data.NombreCategoria);
    $("#cboGenero").val(data.Genero === "M" ? 1 : 0);
    $("#cboEstado").val(data.Estado ? 1 : 0).prop("disabled", false);

    $("#txtEdad").val(data.EdadMaxima);

    $("#modalLabeldetalle").text("Editar Registro");
    $("#modalAdd").modal("show");
});

$('#tbData tbody').on('click', '.btn-detalle', function () {

    let fila = $(this).closest('tr');

    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    const textoSms = `Detalles de la Categoría: ${data.NombreCategoria}.`;
    mostrarAlerta("¡Mensaje!", textoSms, "info");

});


$("#btnNuevoReg").on("click", function () {

    idEditar = 0;
    $("#txtNomCatego").val("");
    $("#cboGenero").val(1);
    $("#txtEdad").val("");
    $("#cboEstado").val(1).prop("disabled", true);

    $("#modalLabeldetalle").text("Nuevo Registro");

    $("#modalAdd").modal("show");
})

function habilitarBoton() {
    $('#btnGuardarCambios').prop('disabled', false);
}

$("#btnGuardarCambios").on("click", function () {
    // Bloqueo inmediato
    $('#btnGuardarCambios').prop('disabled', true);

    if ($("#txtNomCatego").val().trim() === "") {
        MensajeToast("Campo incompleto", "Por favor, ingrese el nombre de la categoría.", "warning");
        $("#txtNomCatego").focus();
        habilitarBoton();
        return;
    }

    // 2. ARMAR EL OBJETO
    const objeto = {
        IdCategoria: idEditar,
        NombreCategoria: $("#txtNomCatego").val().trim(),
        Genero: ($("#cboGenero").val() === "1" ? "M" : "F"),
        EdadMaxima: parseInt($("#txtEdad").val()) || 0,
        Estado: ($("#cboEstado").val() === "1" ? true : false)
    };

    $("#modalAdd").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "Categorias.aspx/GuardarOrEditCategorias",
        data: JSON.stringify({ objeto: objeto }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#modalAdd").find("div.modal-content").LoadingOverlay("hide");
            alertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
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
            MensajeToast("¡Atención!", "Error de comunicación con el servidor.", "error");
        },
        complete: function () {
            habilitarBoton();
        }
    });

});


// fin