
let v_IdPartido = 0;
let estadoPartido = 0;
let esModoDetalle = false;

$(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const idPartidoUrl = urlParams.get('idPartido');
    const esDetalleParam = urlParams.get('esDetalle');

    if (!idPartidoUrl || idPartidoUrl.trim() === "") {
        MensajeToast("Error de acceso", "Falta parámetro para ver los detalles del partido.", "error");
        setTimeout(function () {
            window.location.href = 'PartidosResult.aspx';
        }, 2200);
    } else {
        // guardamos en la variable global como entero
        v_IdPartido = parseInt(idPartidoUrl);
        esModoDetalle = (esDetalleParam === 'true');
        cargarDetallePartido();
        cargarEstadosPartido();
    }

});

function cargarEstadosPartido() {

    $("#cboEstPart").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "DetallesSerie.aspx/ListaEstadosPartido",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                // 1. Empezamos con la opción por defecto
                let opcionesHTML = '<option value="">-- Seleccione Estado --</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdEstado}">${row.NombreEstado}</option>`;
                });

                // 3. Inyectamos todo al DOM en un solo movimiento
                $("#cboEstPart").html(opcionesHTML);

            } else {
                $("#cboEstPart").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboEstPart").html('<option value="">Error de conexión</option>');
        }
    });
}

function cargarDetallePartido() {
    let request = { IdPartido: v_IdPartido };

    $.ajax({
        url: "PanelResultados.aspx/ObtenerDetallePartido",
        type: "POST",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                const data = response.d.Data;

                // 1. Datos Generales del Partido
                $("#lblFechaHora").text(`${data.Fecha} - ${data.Hora}`);
                $("#lblCancha").text(data.Cancha);
                $("#lblFase").text(data.NombreFase);
                estadoPartido = data.IdEstado;

                // Colores dinámicos para el estado
                let claseEstado = "bg-info";
                if (data.IdEstado === 2) claseEstado = "bg-success";
                if (data.IdEstado >= 3) claseEstado = "bg-danger";

                $("#badgeEstadoPartido").removeClass().addClass(`badge ${claseEstado} fs-14px px-3 py-2 shadow-sm`).text(data.NombreEstado);

                // 2. Datos Equipo Local
                $("#lblClubLocal").text(data.ClubLocal);
                $("#imgLogoLocal").attr("src", data.LogoLocal || 'Logos/sinLogo.png');
                $("#lblGolesLocal").text(data.GolesLocal);

                // Guardamos el IdEquipo en el botón para usarlo al abrir el modal
                $("#btnPlantillaLocal").attr("data-idequipo", data.IdEquipoLocal).attr("data-nombre", data.ClubLocal);

                // 3. Datos Equipo Visitante
                $("#lblClubVisitante").text(data.ClubVisitante);
                $("#imgLogoVisitante").attr("src", data.LogoVisitante || 'Logos/sinLogo.png');
                $("#lblGolesVisitante").text(data.GolesVisitante);

                // Guardamos el IdEquipo en el botón
                $("#btnPlantillaVisitante").attr("data-idequipo", data.IdEquipoVisitante).attr("data-nombre", data.ClubVisitante);

                cargarEventosHistorial(data.IdEquipoLocal, data.IdEquipoVisitante);

                // LÓGICA CONDICIONAL DE LA VISTA
                if (esModoDetalle) {
                    // Ocultamos botones de acción
                    $("#btnFinalizarPartido").hide();
                    $("#btnPlantillaLocal").hide();
                    $("#btnPlantillaVisitante").hide();

                    // Mostramos contenedores de eventos y los cargamos
                    //$("#contenedorEventosLocal").removeClass("d-none");
                    //$("#contenedorEventosVisitante").removeClass("d-none");

                    // Pasamos los IDs de los equipos para saber en qué lado pintar cada evento
                    //cargarEventosHistorial(data.IdEquipoLocal, data.IdEquipoVisitante);
                } else {
                    // Si es edición, nos aseguramos de que los botones estén visibles
                    $("#btnFinalizarPartido").show();
                    $("#btnPlantillaLocal").show();
                    $("#btnPlantillaVisitante").show();
                }

            } else {
                MensajeToast("Error", response.d.Mensaje, "error");
                setTimeout(function () { window.location.href = 'PartidosResult.aspx'; }, 3000);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText);
            MensajeToast("Error Crítico", "Error de comunicación con el servidor.", "error");
        }
    });
}

function cargarEventosHistorial(idLocal, idVisitante) {

    // Mostramos un loader provisional
    $("#contenedorEventosLocal, #contenedorEventosVisitante").html('<div class="text-center text-muted fs-12px"><i class="fa fa-spinner fa-spin me-1"></i>Cargando eventos...</div>');

    $.ajax({
        url: "PanelResultados.aspx/ObtenerEventosPartido",
        type: "POST",
        data: JSON.stringify({ IdPartido: v_IdPartido }),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {

            $("#contenedorEventosLocal").empty();
            $("#contenedorEventosVisitante").empty();

            if (response.d.Estado) {
                let lista = response.d.Data;

                if (lista && lista.length > 0) {
                    $.each(lista, function (i, evento) {

                        // Determinamos el icono visual según el Tipo de Evento
                        let iconoHtml = '';
                        if (evento.IdTipoEvento === 1) iconoHtml = '<i class="fas fa-futbol text-dark me-2"></i>'; // Gol
                        if (evento.IdTipoEvento === 2) iconoHtml = '<i class="fas fa-square text-warning me-2"></i>'; // Amarilla
                        if (evento.IdTipoEvento === 3) iconoHtml = '<i class="fas fa-square text-danger me-2"></i>'; // Roja
                        if (evento.IdTipoEvento === 4) iconoHtml = '<i class="fas fa-futbol text-danger me-2"></i> <span class="text-danger fs-10px fw-bold">(e/c)</span>'; // Autogol

                        // Construimos el bloque HTML del evento INCLUYENDO EL DORSAL
                        let eventoDiv = `
                            <div class="d-flex align-items-center mb-2 border-bottom pb-2">
                                <div class="fw-bold fs-13px text-muted me-2" style="width: 35px;">${evento.Minuto}'</div>
                                <div>${iconoHtml}</div>
                                <div class="fs-13px text-dark fw-semibold text-truncate" title="#${evento.Dorsal} ${evento.NombreJugador}">
                                    <span class="text-muted fw-bold me-1">#${evento.Dorsal}</span>${evento.NombreJugador}
                                </div>
                            </div>
                        `;

                        // Inyectamos al contenedor correspondiente
                        if (evento.IdEquipo === idLocal) {
                            $("#contenedorEventosLocal").append(eventoDiv);
                        } else if (evento.IdEquipo === idVisitante) {
                            $("#contenedorEventosVisitante").append(eventoDiv);
                        }
                    });
                }

                // Si algún lado quedó vacío, ponemos un mensaje sutil
                if ($("#contenedorEventosLocal").is(':empty')) {
                    $("#contenedorEventosLocal").html('<div class="text-center text-muted fs-11px fst-italic">Sin eventos registrados</div>');
                }
                if ($("#contenedorEventosVisitante").is(':empty')) {
                    $("#contenedorEventosVisitante").html('<div class="text-center text-muted fs-11px fst-italic">Sin eventos registrados</div>');
                }

            } else {
                $("#contenedorEventosLocal").html('<div class="text-center text-danger fs-12px">Error al cargar</div>');
                $("#contenedorEventosVisitante").html('<div class="text-center text-danger fs-12px">Error al cargar</div>');
            }
        }
    });
}

// Capturamos el click de cualquiera de los dos botones de plantilla
$("#btnPlantillaLocal, #btnPlantillaVisitante").on("click", function () {

    // 1. Extraemos los datos que ocultamos en los atributos "data-" del HTML
    let idEquipo = $(this).attr("data-idequipo");
    let nombreEquipo = $(this).attr("data-nombre");

    // Validación rápida de seguridad
    if (!idEquipo || idEquipo == 0) {
        MensajeToast("Aviso", "No se encontró el identificador del equipo.", "warning");
        return;
    }

    // 2. Personalizamos el modal con el nombre del equipo seleccionado
    $("#lblTituloEquipoModal").text("Plantilla: " + nombreEquipo);

    // 3. Limpiamos la tabla y mostramos un mensaje de carga
    $("#tbPlantillaJugadores tbody").html(
        '<tr><td colspan="5" class="text-center py-4"><i class="fa fa-spinner fa-spin me-2 text-primary"></i>Cargando jugadores...</td></tr>'
    );

    // 4. Abrimos el modal en pantalla
    $("#modalPlantilla").modal("show");

    // 5. Armamos la petición para el WebMethod
    let request = { IdEquipo: parseInt(idEquipo) };

    $.ajax({
        url: "PanelResultados.aspx/ObtenerPlantillaEquipo",
        type: "POST",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                let lista = response.d.Data;
                let html = '';

                if (lista != null && lista.length > 0) {
                    // Iteramos sobre los jugadores que devuelve tu BD
                    $.each(lista, function (i, row) {

                        // Validaciones de presentación (foto y dorsal nulos)
                        let foto = row.FotografiaUrl ? row.FotografiaUrl : 'Imagen/sinimagen.png';
                        let dorsal = row.Dorsal === 0 ? 'S/N' : row.Dorsal;

                        // Construimos la fila de la tabla
                        html += `
                            <tr>
                                <td class="fw-bold fs-15px text-dark">${dorsal}</td>
                                <td>
                                    <img src="${foto}" class="rounded shadow-sm border" width="40" height="40" style="object-fit: cover;">
                                </td>
                                <td class="text-start fw-semibold text-dark">${row.Nombres} ${row.Apellidos}</td>
                                <td>${row.CI}</td>
                                <td>
                                    <button class="btn btn-sm btn-lime px-2 py-1 fw-bold btn-evento-jugador shadow-sm" data-idjugador="${row.IdJugador}">
                                        <i class="fa fa-bolt me-1"></i>Añadir Evento
                                    </button>
                                </td>
                            </tr>
                        `;
                    });
                } else {
                    html = '<tr><td colspan="5" class="text-center text-muted py-4"><i class="fa fa-info-circle me-2"></i>No hay jugadores habilitados en esta plantilla.</td></tr>';
                }

                // Inyectamos el HTML generado en el cuerpo de la tabla
                $("#tbPlantillaJugadores tbody").html(html);

            } else {
                $("#tbPlantillaJugadores tbody").html(
                    `<tr><td colspan="5" class="text-center text-danger py-4"><i class="fa fa-exclamation-triangle me-2"></i>${response.d.Mensaje}</td></tr>`
                );
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#tbPlantillaJugadores tbody").html(
                '<tr><td colspan="5" class="text-center text-danger py-4"><i class="fa fa-times-circle me-2"></i>Error de comunicación con el servidor.</td></tr>'
            );
        }
    });
});

// 1. Delegación de eventos para capturar el click en botones generados dinámicamente
$("#tbPlantillaJugadores tbody").on("click", ".btn-evento-jugador", function () {

    // Capturamos el IdJugador que guardaste en el botón
    let idJugador = $(this).data("idjugador");

    // Navegamos por el DOM para obtener el texto de la columna (td) que contiene el nombre.
    // Usamos :eq(2) porque el nombre está en la tercera columna (Dorsal=0, Foto=1, Nombres=2)
    let nombreJugador = $(this).closest("tr").find("td:eq(2)").text();

    // Llenamos el modal con los datos capturados
    $("#hdnIdJugadorEvento").val(idJugador);
    $("#lblNombreJugadorEvento").text(nombreJugador);

    // Limpiamos los campos en caso de que hubieran registrado un evento previo
    $("#cboTipoEvento").val("");
    $("#txtMinuto").val("");
    $("#txtObservaciones").val("");

    // Mostramos el modal superpuesto
    $("#modalEvento").modal("show");
});


// 2. Lógica de validación y guardado
$("#btnGuardarEvento").on("click", function () {
    let btnGuardar = $(this);

    let idJugador = $("#hdnIdJugadorEvento").val();
    let idTipoEvento = $("#cboTipoEvento").val();
    let minuto = $("#txtMinuto").val();
    let observaciones = $("#txtObservaciones").val().trim();

    // Validaciones Fail-Fast
    if (idTipoEvento === "") {
        MensajeToast("Campo Requerido", "Debe seleccionar el tipo de evento.", "warning");
        $("#cboTipoEvento").focus();
        return;
    }
    if (minuto === "" || parseInt(minuto) <= 0) {
        MensajeToast("Campo Requerido", "Debe ingresar un minuto de juego válido.", "warning");
        $("#txtMinuto").focus();
        return;
    }

    // Armamos el objeto combinando los datos del modal con la variable global v_IdPartido
    let objetoEvento = {
        IdPartido: v_IdPartido,
        IdJugador: parseInt(idJugador),
        IdTipoEvento: parseInt(idTipoEvento),
        Minuto: parseInt(minuto),
        Observaciones: observaciones
    };

    // Bloqueamos el botón para evitar doble click
    btnGuardar.prop("disabled", true).html('<i class="fa fa-spinner fa-spin me-1"></i>Guardando...');

    // Petición AJAX a tu WebMethod
    $.ajax({
        url: "PanelResultados.aspx/RegistrarEvento",
        type: "POST",
        data: JSON.stringify({ objeto: objetoEvento }),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                MensajeToast("¡Registrado!", "El evento se guardó correctamente en el partido.", "success");
                $("#modalEvento").modal("hide");
                $("#modalPlantilla").modal("hide");

                // Opcional: Aquí podrías llamar a una función que recargue el marcador general
                cargarDetallePartido();
            } else {
                MensajeToast("Error", response.d.Mensaje, "error");
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            MensajeToast("Error Crítico", "Fallo al comunicar con el servidor.", "error");
        },
        complete: function () {
            // Restauramos el botón
            btnGuardar.prop("disabled", false).html('<i class="fa fa-save me-1"></i>Guardar Evento');
        }
    });
});

$("#btnFinalizarPartido").on("click", function () {

    // 1. Extraemos los datos visuales que ya están cargados en la pantalla
    let nombreLocal = $("#lblClubLocal").text();
    let logoLocal = $("#imgLogoLocal").attr("src");
    let golesLocal = $("#lblGolesLocal").text(); // Por si quieres iniciar el input con los goles actuales

    let nombreVisitante = $("#lblClubVisitante").text();
    let logoVisitante = $("#imgLogoVisitante").attr("src");
    let golesVisitante = $("#lblGolesVisitante").text();

    // 2. Poblamos los datos del Equipo Local en el modal
    $("#txtIdPartidoRe").val(v_IdPartido); // Tu variable global
    $("#lblEquipoLocal").text(nombreLocal);
    $("#imgLocalResu").attr("src", logoLocal);

    // Seteamos los inputs
    $("#txtGolLocal").val(golesLocal);
    $("#txtGolPenalLocal").val(0); // Reiniciamos penales
    $("#chkPagadoLocal").prop("checked", false); // Reiniciamos el pago

    // 3. Poblamos los datos del Equipo Visitante en el modal
    $("#lblEquipoVisitante").text(nombreVisitante);
    $("#imgVisitanteResu").attr("src", logoVisitante);

    // Seteamos los inputs
    $("#txtGolVisitante").val(golesVisitante);
    $("#txtGolPenalVisitante").val(0); // Reiniciamos penales
    $("#chkPagadoVisitante").prop("checked", false); // Reiniciamos el pago

    // 4. Aseguramos que el combo inicie vacío o en estado "Finalizado" (depende de cómo cargues cboEstPart)
    $("#cboEstPart").val(estadoPartido);

    // 5. Mostramos el Modal
    $("#modalResultados").modal("show");
});

function habilitarBoton() {
    $('#btnGuardarResultados').prop('disabled', false);
}

$("#btnGuardarResultados").on("click", function () {
    // Bloqueo inmediato
    $('#btnGuardarResultados').prop('disabled', true);

    let idEstado = $("#cboEstPart").val();

    let idPartido = $("#txtIdPartidoRe").val();

    if (idPartido === "" || idPartido === "0") {
        MensajeToast("Campo incompleto", "Por favor, seleccione un Partido.", "warning");
        habilitarBoton();
        return;
    }

    if (idEstado === "") {
        MensajeToast("Campo incompleto", "Por favor, seleccione un Estado.", "warning");
        $("#cboEstPart").focus();
        habilitarBoton();
        return;
    }

    if (idEstado === "1") {
        MensajeToast("Advertencia", "El Estado No puede ser Programado.", "warning");
        $("#cboEstPart").focus();
        habilitarBoton();
        return;
    }

    const golLocal = parseInt($("#txtGolLocal").val()) || 0;
    const golVisitante = parseInt($("#txtGolVisitante").val()) || 0;

    const golPenalLocal = parseInt($("#txtGolPenalLocal").val()) || 0;
    const golPenalVisitante = parseInt($("#txtGolPenalVisitante").val()) || 0;

    if (golPenalLocal < 0) {
        MensajeToast("Valor inválido", "Los goles de penal del equipo local no pueden ser números negativos.", "warning");
        $("#txtGolPenalLocal").focus();
        habilitarBoton();
        return;
    }

    if (golPenalVisitante < 0) {
        MensajeToast("Valor inválido", "Los goles de penal del equipo visitante no pueden ser números negativos.", "warning");
        $("#txtGolPenalVisitante").focus();
        habilitarBoton();
        return;
    }

    if (golLocal < 0) {
        MensajeToast("Valor inválido", "Los goles del equipo local no pueden ser números negativos.", "warning");
        $("#txtGolLocal").focus();
        habilitarBoton();
        return;
    }

    if (golVisitante < 0) {
        MensajeToast("Valor inválido", "Los goles del equipo visitante no pueden ser números negativos.", "warning");
        $("#txtGolVisitante").focus();
        habilitarBoton();
        return;
    }

    let arbitrajePagoLocal = $("#chkPagadoLocal").is(":checked");
    let arbitrajePagoVisitante = $("#chkPagadoVisitante").is(":checked");

    // 2. ARMAR EL OBJETO
    const objeto = {
        IdPartido: parseInt(idPartido),
        GolesLocal: golLocal,
        GolesVisitante: golVisitante,
        GolesPenalesLocal: golPenalLocal,
        GolesPenalesVisitante: golPenalVisitante,
        PagoArbitrajeLocal: arbitrajePagoLocal,
        PagoArbitrajeVisitante: arbitrajePagoVisitante,
        IdEstado: parseInt(idEstado)
    };

    $("#modalResultados").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "DetallesSerie.aspx/ResultadoPartido",
        data: JSON.stringify({ objeto: objeto }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#modalResultados").find("div.modal-content").LoadingOverlay("hide");

            alertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
            );

            // Evaluamos la respuesta
            if (response.d.Estado) {
                $("#modalResultados").modal("hide");
                setTimeout(() => window.location.href = 'PartidosResult.aspx', 3200);

            }

        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#modalResultados").find("div.modal-content").LoadingOverlay("hide");
            MensajeToast("¡Error Crítico!", "Fallo de comunicación con el servidor.", "error");
        },
        complete: function () {
            habilitarBoton();
        }
    });
});

// fin