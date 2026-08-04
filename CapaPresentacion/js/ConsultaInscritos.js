
$(document).ready(function () {
    cargarTorneosFiltro();
    cargarCategoriasFiltro();

    // 2. Evento: Cambio en Torneo
    $("#cboFiltroTorneo").on("change", function () {
        $("#cboFiltroCategoria").val("");
        limpiarContenedor();
    });

    $("#cboFiltroCategoria").on("change", function () {
        const idCategoria = $(this).val();
        const idTorneo = $("#cboFiltroTorneo").val();

        // Validamos que ambos combos tengan un valor seleccionado
        if (idTorneo && idCategoria) {
            // Como ya no usamos DataTables, simplemente llamamos a tu función
            cargarEquiposInscritos();
        } else {
            limpiarContenedor();
            MensajeToast("Atención", "Debe seleccionar un Torneo y una Categoría.", "warning");
            $(this).val("");
        }
    });
});

// Reemplazamos limpiarTabla() por esta nueva función
function limpiarContenedor() {
    // En lugar de usar clear().draw(), simplemente inyectamos un mensaje inicial en el DIV
    $("#contenedorEquipos").html(`
        <div class="col-12 text-center p-5">
            <div class="alert alert-secondary border-0 shadow-sm text-muted">
                <i class="fa fa-filter fa-2x mb-2"></i><br>
                Seleccione un <strong>Torneo</strong> y una <strong>Categoría</strong> para visualizar los equipos inscritos.
            </div>
        </div>
    `);
}

function cargarTorneosFiltro() {

    $("#cboFiltroTorneo").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "Torneos.aspx/ListaTorneos",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">-- Seleccione Torneo --</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdTorneo}">${row.NombreTorneo}</option>`;
                });

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

function cargarCategoriasFiltro() {

    $("#cboFiltroCategoria").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "Categorias.aspx/ListaCategorias",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">-- Seleccione Categoría --</option>';

                $.each(response.d.Data, function (i, row) {

                    let textoGenero = row.Genero === 'M' ? 'Varones' : 'Damas';
                    opcionesHTML += `<option value="${row.IdCategoria}">${row.NombreCategoria} ${textoGenero}</option>`;
                });

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

function cargarEquiposInscritos() {
    let request = {
        IdTorneo: parseInt($("#cboFiltroTorneo").val()) || 0,
        IdCategoria: parseInt($("#cboFiltroCategoria").val()) || 0
    };

    $("#contenedorEquipos").html('<div class="col-12 text-center p-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Cargando equipos...</p></div>');

    $.ajax({
        url: "Inscripciones.aspx/ListaEquiposInscritos",
        type: "POST",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                let lista = response.d.Data;
                if (lista != null && lista.length > 0) {

                    let htmlCards = '';

                    $.each(lista, function (i, row) {
                        let logo = row.LogoUrl ? row.LogoUrl : 'Logos/sinLogo.png';

                        htmlCards += `
                            <div class="col-md-6 col-lg-4 mb-4">
                                <div class="profile__card">
                                    <div class="profile__content">
                                        <img src="${logo}" alt="Logo" class="profile__img">
                                        
                                        <div class="profile__data">
                                            <h3 class="profile__name">${row.NombreClub}</h3>
                                            <p class="profile__profession text-muted mb-0">${row.NombreSerie}</p>
                                        </div>
                            
                                        <div class="profile__button btn-toggle-menu">
                                            <i class="fa fa-bars profile__menu"></i>
                                            <i class="fa fa-times profile__close"></i>
                                        </div>
                                    </div>
                        
                                    <div class="profile__social">
                                        <a href="javascript:;" class="profile__link btn-accion" data-accion="detalle" data-idequipo="${row.IdEquipo}" title="Ver Detalle">
                                            <span><i class="fa fa-info-circle"></i></span>
                                        </a>
                                        <a href="javascript:;" class="profile__link btn-accion" data-accion="equipo" data-idequipo="${row.IdEquipo}" title="Jugadores">
                                            <span><i class="fa fa-users"></i></span>
                                        </a>
                                        <a href="javascript:;" class="profile__link btn-accion" data-accion="tecnicos" data-idequipo="${row.IdEquipo}" title="Cuerpo Técnico">
                                            <span><i class="fa fa-user-tie"></i></span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        `;
                    });

                    $("#contenedorEquipos").html(htmlCards);

                } else {
                    $("#contenedorEquipos").html(`
                        <div class="col-12 text-center p-4">
                            <div class="alert alert-warning border-0 shadow-sm">No se encontraron equipos inscritos con los filtros seleccionados.</div>
                        </div>`);
                }
            } else {
                MensajeToast("Error", response.d.Mensaje, "error");
                $("#contenedorEquipos").empty();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#contenedorEquipos").html('<div class="col-12 text-center text-danger">Error de comunicación con el servidor.</div>');
        }
    });
}

// ====================================================================
// EVENTO CLICK: Para abrir/cerrar el menú circular de forma dinámica
// ====================================================================
$(document).on('click', '.btn-toggle-menu', function (e) {
    e.preventDefault();

    let btn = $(this);
    let card = btn.closest('.profile__card');
    let menuSocial = card.find('.profile__social');

    // Opcional: Cerrar otros menús abiertos antes de abrir este
    $('.profile__card').removeClass('active-card');
    $('.profile__social').not(menuSocial).removeClass('show-social');
    $('.btn-toggle-menu').not(btn).removeClass('show-icon');

    // Alternar clases de animación para el card seleccionado
    card.toggleClass('active-card');
    menuSocial.toggleClass('show-social');
    btn.toggleClass('show-icon');
});

// ====================================================================
// EVENTO CLICK: Para capturar la acción (Detalle, Equipo, Técnicos)
// ====================================================================
$(document).on('click', '.btn-accion', function (e) {
    e.preventDefault();
    let accion = $(this).data('accion');
    let idEquipo = $(this).data('idequipo');

    if (accion === 'detalle') {
        console.log("Abrir detalle del equipo:", idEquipo);
        // Aquí llamas a tu función para abrir modal de detalle
    } else if (accion === 'equipo') {
        plantillaEquipo(idEquipo);
        $("#mdPlantillaEquipo").modal("show");
        //console.log("Abrir plantilla de jugadores del equipo:", idEquipo);
        // Aquí llamas a tu función para ver jugadores
    } else if (accion === 'tecnicos') {
        listaCuerpoTecni(idEquipo);
        $("#mdCuerpoTecnico").modal("show");
        // Aquí llamas a tu función para ver técnicos
    }
});

function plantillaEquipo(idEquipo) {
    if ($.fn.DataTable.isDataTable("#tbJugadores")) {
        $("#tbJugadores").DataTable().destroy();
        $('#tbJugadores tbody').empty();
    }

    $("#tbJugadores").DataTable({
        responsive: true,
        "ajax": {
            "url": 'PanelResultados.aspx/ObtenerPlantillaEquipo',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                let request = {
                    IdEquipo: idEquipo
                };
                return JSON.stringify(request);
            },
            "dataSrc": function (json) {
                return json.d.Estado ? json.d.Data : [];
            }
        },
        "columns": [
            {
                "data": null,
                "orderable": false,
                "searchable": false,
                "render": function (data, type, row) {
                    let foto = row.FotografiaUrl ? row.FotografiaUrl : 'Imagen/sinimagen.png'; // Cambia la ruta a tu imagen por defecto
                    let nombreCompleto = row.Nombres + ' ' + row.Apellidos;
                    let dorsal = row.Dorsal === 0 ? 'S/N' : row.Dorsal;

                    return `
                        <div class="d-flex align-items-center">
                            <div class="w-40px h-40px rounded-circle d-flex align-items-center justify-content-center bg-light overflow-hidden shadow-sm me-3">
                                <img src="${foto}" alt="Foto" class="mw-100 mh-100" style="object-fit: contain;" />
                            </div>
                            <div>
                                <div class="fw-bold fs-14px text-body">${nombreCompleto}</div>
                                <div class="fs-12px text-muted"><i class="fas fa-tshirt me-1"></i>Dorsal #${dorsal}</div>
                            </div>
                        </div>
                    `;
                }
            },
            {
                "data": "CI",
                "className": "text-center align-middle",
                "render": function (data) {
                    return `<span class="badge p-2 bg-warning text-dark fs-12px me-1"><i class="fas fa-id-card text-dark me-1"></i>${data}</span>`;
                }
            }
        ],
        "order": [],
        "info": false,      // Oculta el texto "Mostrando 1 de X registros" para hacerlo más limpio
        "paging": false,    // Normalmente no hay más de 5-6 tarjetas por equipo en un partido
        "searching": false, // Oculta la barra de búsqueda interna del modal
        "language": { "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json" }
    });
}

function listaCuerpoTecni(idEquipo) {

    if ($.fn.DataTable.isDataTable("#tbCuerpoTecnico")) {
        $("#tbCuerpoTecnico").DataTable().destroy();
        $('#tbCuerpoTecnico tbody').empty();
    }

    $("#tbCuerpoTecnico").DataTable({
        responsive: true,
        "ajax": {
            "url": 'Plantillas.aspx/ListaCuerpoTecnico',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                let request = {
                    IdEquipo: idEquipo
                };
                return JSON.stringify(request);
            },
            "dataSrc": function (json) {
                return json.d.Estado ? json.d.Data : [];
            }
        },
        "columns": [
            {
                "data": null,
                "orderable": false,
                "searchable": false,
                "render": function (data, type, row) {
                    let foto = 'Imagen/sinimagen.png'; // Cambia la ruta a tu imagen por defecto
                    let nombreCompleto = row.Nombres + ' ' + row.Apellidos;

                    return `
                        <div class="d-flex align-items-center">
                            <div class="w-40px h-40px rounded-circle d-flex align-items-center justify-content-center bg-light overflow-hidden shadow-sm me-3">
                                <img src="${foto}" alt="Foto" class="mw-100 mh-100" style="object-fit: contain;" />
                            </div>
                            <div>
                                <div class="fw-bold fs-14px text-body">${nombreCompleto}</div>
                                <div class="fs-12px text-muted"><i class="fas fa-futbol me-1"></i>Cargo ${row.Cargo}</div>
                            </div>
                        </div>
                    `;
                }
            },
            {
                "data": "CI",
                "className": "text-center align-middle",
                "render": function (data) {
                    return `<span class="badge p-2 bg-warning text-dark fs-12px me-1"><i class="fas fa-id-card text-dark me-1"></i>${data}</span>`;
                }
            }
        ],
        "order": [],
        "info": false,      // Oculta el texto "Mostrando 1 de X registros" para hacerlo más limpio
        "paging": false,    // Normalmente no hay más de 5-6 tarjetas por equipo en un partido
        "searching": false, // Oculta la barra de búsqueda interna del modal
        "language": { "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json" }
    });
}

// fin