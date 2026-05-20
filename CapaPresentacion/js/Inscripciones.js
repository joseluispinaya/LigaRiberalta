
let tablaData;
let idEditar = 0;


$(document).ready(function () {
    cargarTodasTorneos();
    cargarTodasCategorias();
    cargarClubes();
    cargarSeries();
});

function cargarClubes() {

    $("#cboClub").html('<option value="">Cargando...</option>');

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
                $("#cboClub").html(opcionesHTML);

            } else {
                $("#cboClub").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboClub").html('<option value="">Error de conexión</option>');
        }
    });
}

function cargarTodasTorneos() {

    let combosTorneos = $("#cboFiltroTorneo, #cboTorneo");

    // 2. Mostramos el mensaje de carga en todos a la vez
    combosTorneos.html('<option value="">Cargando...</option>');

    $.ajax({
        url: "Torneos.aspx/ListaTorneos",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">-- Seleccione un Torneo --</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdTorneo}">${row.NombreTorneo}</option>`;
                });

                // 3. ¡LA MAGIA! Inyectamos el HTML en los 4 selects al mismo tiempo
                combosTorneos.html(opcionesHTML);

            } else {
                combosTorneos.html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            combosTorneos.html('<option value="">Error de conexión</option>');
        }
    });
}

function cargarTodasCategorias() {

    let combosCategorias = $("#cboFiltroCategoria, #cboCategoria");

    // 2. Mostramos el mensaje de carga en todos a la vez
    combosCategorias.html('<option value="">Cargando...</option>');

    $.ajax({
        url: "Categorias.aspx/ListaCategorias",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">-- Seleccione una Categoría --</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdCategoria}">${row.NombreCategoria}</option>`;
                });

                // 3. ¡LA MAGIA! Inyectamos el HTML en los 4 selects al mismo tiempo
                combosCategorias.html(opcionesHTML);

            } else {
                combosCategorias.html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            combosCategorias.html('<option value="">Error de conexión</option>');
        }
    });
}

function cargarSeries() {

    $("#cboSerie").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "Torneos.aspx/ListaSeries",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                // 1. Empezamos con la opción por defecto
                let opcionesHTML = '<option value="">-- Seleccione Serie --</option>';

                // 2. Concatenamos todas las opciones en la variable (en memoria)
                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdSerie}">${row.NombreSerie}</option>`;
                });

                // 3. Inyectamos todo al DOM en un solo movimiento
                $("#cboSerie").html(opcionesHTML);

            } else {
                $("#cboSerie").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboSerie").html('<option value="">Error de conexión</option>');
        }
    });
}

function cargarTorneosTable() {

    $("#cboFiltroTorneo").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "Torneos.aspx/ListaTorneos",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                // 1. Empezamos con la opción por defecto
                let opcionesHTML = '<option value="">-- Seleccione Torneo --</option>';

                // 2. Concatenamos todas las opciones en la variable (en memoria)
                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdTorneo}">${row.NombreTorneo}</option>`;
                });

                // 3. Inyectamos todo al DOM en un solo movimiento
                $("#cboFiltroTorneo").html(opcionesHTML);

            } else {
                $("#cboFiltroTorneo").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboFiltroTorneo").html('<option value="">Error de conexión</option>');
        }
    });
}

function cargarCategoriasTable() {

    $("#cboFiltroCategoria").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "Categorias.aspx/ListaCategorias",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                // 1. Empezamos con la opción por defecto
                let opcionesHTML = '<option value="">-- Seleccione Categoría --</option>';

                // 2. Concatenamos todas las opciones en la variable (en memoria)
                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdCategoria}">${row.NombreCategoria}</option>`;
                });

                // 3. Inyectamos todo al DOM en un solo movimiento
                $("#cboFiltroCategoria").html(opcionesHTML);

            } else {
                $("#cboFiltroCategoria").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboFiltroCategoria").html('<option value="">Error de conexión</option>');
        }
    });
}

$("#btnNuevaInscripcion").on("click", function () {

    idEditar = 0;

    //$("#modalLabeldetalle").text("Nuevo Registro");

    $("#modalAdd").modal("show");
})

// fin