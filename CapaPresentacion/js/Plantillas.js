
// --- VARIABLES GLOBALES ---
let tablaData;
let tablaDataTabInd;
let idEditar = 0;
let listaCargosGlobal = [];
let listaTecnicosExcel = [];
let v_IdEquipo = 0;

$(document).ready(function () {
    // 1. Lógica de inicio y validación de URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const idEquipo = urlParams.get('id');

    if (idEquipo === null || idEquipo.trim() === "") {
        MensajeToast("Error de acceso", "No hay un parámetro válido recibido.", "error");
        setTimeout(function () {
            window.location.href = 'Inscripciones.aspx';
        }, 3000);
    } else {
        $("#txtIdEquipo").val(idEquipo);
        v_IdEquipo = parseInt(idEquipo);
        datosEquipoInscrito(idEquipo);
        cargarListaCargos();
        listaCuerpoTecni();
    }

    // =========================================================
    // TODOS LOS EVENTOS DEBEN ESTAR DENTRO DEL DOCUMENT.READY
    // =========================================================

    // EVENTO 1: Clic en el botón "Previsualizar Datos"
    $("#btnPreviewExcel").on("click", function () {
        var fileUpload = $("#fileExcelCT").get(0);
        var files = fileUpload.files;

        if (files.length === 0) {
            MensajeToast("Atención", "Debe seleccionar un archivo Excel.", "warning");
            return;
        }

        var file = files[0];

        // Validación de extensión
        var extension = file.name.split('.').pop().toLowerCase();
        if (extension !== "xlsx" && extension !== "xls") {
            MensajeToast("Atención", "Formato no válido. Seleccione un archivo .xls o .xlsx", "warning");
            $("#fileExcelCT").val('');
            return;
        }

        var reader = new FileReader();

        reader.onload = function (e) {
            var base64String = e.target.result.split(',')[1];

            $.ajax({
                url: "Plantillas.aspx/ProcesarExcelCuerpoTec",
                type: "POST",
                data: JSON.stringify({ archivoBase64: base64String }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response.d.Estado) {
                        listaTecnicosExcel = response.d.Data;
                        mostrarVistaPrevia(listaTecnicosExcel);
                    } else {
                        MensajeToast("Atención", response.d.Mensaje, "warning");
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

    // EVENTO 2: Cambio en el select de "Cargo" dentro de la tabla
    $("#tbPreviewExcel tbody").on("change", ".select-cargo", function () {
        // Obtenemos qué fila se está modificando usando el data-index
        let index = $(this).data("index");
        let nuevoCargoId = $(this).val();

        // Actualizamos el array en memoria
        listaTecnicosExcel[index].IdCargo = parseInt(nuevoCargoId);
    });

    // EVENTO 3: Clic en el botón de eliminar fila dentro de la tabla
    $("#tbPreviewExcel tbody").on("click", ".btn-delete-row", function () {
        let index = $(this).data("index");

        // Eliminamos a esa persona del array
        listaTecnicosExcel.splice(index, 1);

        // Refrescamos la tabla para que desaparezca visualmente
        mostrarVistaPrevia(listaTecnicosExcel);
    });

});


// =========================================================
// FUNCIONES GLOBALES (Van fuera para mantener el orden)
// =========================================================

function listaCuerpoTecni() {
    tablaDataTabInd = $("#tbCuerpoTecnico").DataTable({
        responsive: true,
        destroy: true,
        "ajax": {
            "url": 'Plantillas.aspx/ListaCuerpoTecnico',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                let request = {
                    IdEquipo: v_IdEquipo
                };
                return JSON.stringify(request);
            },
            "dataSrc": function (json) {
                return json.d.Estado ? json.d.Data : [];
            }
        },
        "columns": [
            {
                "data": "Nombres",
                "className": "align-middle",
                "render": function (data) {
                    return `<span class="fw-semibold text-primary"><i class="fa fa-layer-group me-1 opacity-5"></i>${data}</span>`;
                }
            },
            {
                "data": "Apellidos",
                "className": "align-middle",
                "render": function (data) {
                    return `<span class="fw-semibold text-primary"><i class="fa fa-layer-group me-1 opacity-5"></i>${data}</span>`;
                }
            },
            {
                "data": "CI",
                "className": "text-center",
                "render": function (data) {
                    return `<span class="badge p-2 bg-light text-dark fs-12px me-1"><i class="fas fa-id-card text-warning me-1"></i>${data}</span>`;
                }
            },
            {
                "data": "Cargo",
                "className": "align-middle",
                "render": function (data) {
                    return `<span class="badge p-2 bg-light text-dark fs-12px me-1"><i class="fas fa-id-card text-warning me-1"></i>${data}</span>`;
                }
            },
            {
                "defaultContent": '<button class="btn btn-lime btn-editar btn-sm" title="Editar"><i class="fas fa-pencil-alt"></i></button>',
                "orderable": false,
                "searchable": false,
                "className": "text-center align-middle"
            }
        ],
        "order": [], // Mantiene el orden por fecha y hora de tu SQL
        "language": { "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json" }
    });
}

function cargarListaCargos() {
    $.ajax({
        url: "Plantillas.aspx/ListaCargosTecnicos",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                listaCargosGlobal = response.d.Data;
            } else {
                console.log("Error al cargar cargos: " + response.d.Mensaje);
            }
        },
        error: function (xhr) {
            console.log("Error de conexión al traer cargos.");
        }
    });
}

function datosEquipoInscrito(idEquipo) {
    let request = { IdEquipo: parseInt(idEquipo) };

    $.ajax({
        url: "Inscripciones.aspx/BuscarEquipoInscrito",
        type: "POST",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                const data = response.d.Data;
                $("#imgClubLogo").attr("src", data.LogoUrl ? data.LogoUrl : 'Logos/sinLogo.png');
                $("#lblNombreClub").text(data.NombreClub);
            } else {
                MensajeToast("Error", response.d.Mensaje, "error");
                setTimeout(function () { window.location.href = 'Inscripciones.aspx'; }, 3000);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText);
            MensajeToast("Error Crítico", "Error de comunicación con el servidor.", "error");
        }
    });
}

function mostrarVistaPrevia(data) {
    if ($.fn.DataTable.isDataTable("#tbPreviewExcel")) {
        $("#tbPreviewExcel").DataTable().destroy();
    }

    tablaData = $("#tbPreviewExcel").DataTable({
        data: data,
        responsive: true,
        searching: false, // Oculta la caja de búsqueda
        paging: false,    // Oculta la paginación (muestra todo de corrido)
        info: false,      // Oculta el texto "Mostrando 1 a N de N registros"
        columns: [
            { "data": "Nombres" },
            { "data": "Apellidos" },
            { "data": "CI" },
            {
                "data": "IdCargo",
                "orderable": false,   // Evita el ordenamiento en el Select
                "searchable": false,  // Lo excluye de búsquedas
                "render": function (data, type, row, meta) {
                    let selectHtml = `<select class="form-select form-select-sm select-cargo" data-index="${meta.row}">`;
                    selectHtml += `<option value="0">Seleccione Cargo...</option>`;

                    listaCargosGlobal.forEach(cargo => {
                        let selected = (data == cargo.IdCargo) ? "selected" : "";
                        selectHtml += `<option value="${cargo.IdCargo}" ${selected}>${cargo.Cargo}</option>`;
                    });

                    selectHtml += `</select>`;
                    return selectHtml;
                }
            },
            {
                "data": null,
                "orderable": false,   // Evita el ordenamiento en el botón
                "searchable": false,  // Lo excluye de búsquedas
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

    if (data.length > 0) {
        $("#btnGuardarExcel").prop("disabled", false);
    } else {
        $("#btnGuardarExcel").prop("disabled", true);
    }
}

// EVENTO: Clic en el botón Guardar del Tab de Excel
$("#btnGuardarExcel").on("click", function () {

    if (listaTecnicosExcel.length === 0) {
        MensajeToast("Atención", "No hay datos para el registro.", "warning");
        return;
    }

    let idEquipoSeleccionado = $("#txtIdEquipo").val();

    if (idEquipoSeleccionado === "") {
        MensajeToast("Error", "No se identificó el equipo actual.", "error");
        return;
    }

    // VALIDACIÓN ESTRELLA: Revisamos si alguien se quedó sin cargo asignado
    let personalSinCargo = listaTecnicosExcel.filter(x => x.IdCargo === 0 || x.IdCargo === undefined);
    if (personalSinCargo.length > 0) {
        MensajeToast("Falta Información", "Debe asignar un cargo a todos los miembros de la lista antes de guardar.", "warning");
        return;
    }

    ConfirmarSweet(
        "¿Guardar Cuerpo Técnico?",
        `Se registrarán ${listaTecnicosExcel.length} miembros en el equipo.`,
        "warning",
        "Sí, Guardar",
        function () {
            $("#btnGuardarExcel").prop("disabled", true).html('<i class="fa fa-spinner fa-spin me-1"></i>PROCESANDO...');
            ejecutarGuardadoMasivoCT(idEquipoSeleccionado);
        }
    );
});

function ejecutarGuardadoMasivoCT(idEquipo) {
    // Si usas un overlay general
    $("#cargann").LoadingOverlay("show");

    // Mapeamos para inyectar el IdEquipo correcto a cada fila
    let listaLimpiaParaCsharp = listaTecnicosExcel.map(function (item) {
        return {
            IdMiembro: 0, // Lo ignoramos
            IdEquipo: parseInt(idEquipo),
            Nombres: item.Nombres,
            Apellidos: item.Apellidos,
            IdCargo: parseInt(item.IdCargo),
            CI: item.CI,
            ClaveHash: item.ClaveHash || ""
        };
    });

    $.ajax({
        type: "POST",
        url: "Plantillas.aspx/GuardarCuerpoTecnicoMasiva",
        data: JSON.stringify({ listaCuerpoTecnico: listaLimpiaParaCsharp }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#cargann").LoadingOverlay("hide");

            alertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
            );

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
            $("#btnGuardarExcel").prop("disabled", false).html('<i class="fa fa-save me-1"></i> Guardar Todo el Personal');
        }
    });
}

// fin