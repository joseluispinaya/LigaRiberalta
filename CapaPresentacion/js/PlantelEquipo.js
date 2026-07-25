
$(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const idEquipo = urlParams.get('id');

    if (idEquipo === null || idEquipo.trim() === "") {
        MensajeToast("Error de acceso", "No hay un parámetro válido recibido.", "error");
        setTimeout(function () {
            window.location.href = 'Inscripciones.aspx'; // Ajusta a tu página real
        }, 3000);
    } else {
        $("#txtIdEquipo").val(idEquipo);
        datosEquipoInscrito(idEquipo);
    }
});

// ==========================================
// 1. OBTENER Y MOSTRAR DATOS DEL EQUIPO (Panel Izquierdo)
// ==========================================
function datosEquipoInscrito(idEquipo) {
    let request = { IdEquipo: parseInt(idEquipo) };

    $.ajax({
        url: "Inscripciones.aspx/BuscarEquipoInscrito", // ¡Ajusta el nombre de tu página!
        type: "POST",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                const data = response.d.Data;

                // Llenar Tarjeta Izquierda
                $("#imgClubLogo").attr("src", data.LogoUrl ? data.LogoUrl : 'Logos/sinLogo.png');
                $("#lblNombreClub").text(data.NombreClub);
                $("#lblSerie").html(`<i class="fa fa-layer-group me-1"></i> Serie: ${data.NombreSerie}`);

                // Pago
                if (data.InscripcionPagada) {
                    $("#lblEstadoPago").removeClass("bg-secondary").addClass("bg-success").text("Pagado");
                } else {
                    $("#lblEstadoPago").removeClass("bg-secondary").addClass("bg-warning text-dark").text("Pendiente");
                }

                // Penalización
                $("#lblPenalizacion").text(data.PuntosPenalizacion + " pts");

                // Cargar la tabla de la derecha
                cargarJugadoresElegibles(idEquipo);

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

// 2. CARGAR JUGADORES (Panel Derecho)
function cargarJugadoresElegibles(idEquipo) {
    // Mensaje de carga en la tabla
    $("#tbData tbody").html('<tr><td colspan="3" class="text-center py-4"><div class="spinner-border text-primary spinner-border-sm me-2"></div> Cargando jugadores elegibles...</td></tr>');

    let request = { IdEquipo: parseInt(idEquipo) };

    $.ajax({
        url: "Inscripciones.aspx/ListaJugadoresElegibles", // ¡Ajusta el nombre de tu página!
        type: "POST",
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {

            if (response.d.Estado) {
                let html = '';

                response.d.Data.forEach((item, index) => {
                    let foto = item.FotografiaUrl ? item.FotografiaUrl : 'Imagen/sinimagen.png';
                    let nombreCompleto = item.Nombres + ' ' + item.Apellidos;

                    // CONSTRUCCIÓN MODERNA (Template Literals)
                    html += `
                        <tr>
                            <td class="text-center align-middle">
                                <div class="form-check form-switch ms-3">
                                    <input class="form-check-input cursor-pointer chk-convocar fs-18px" type="checkbox" id="chk_${item.IdJugador}" data-idjugador="${item.IdJugador}">
                                </div>
                            </td>
                            
                            <td>
                                <div class="d-flex align-items-center">
                                    <div class="w-40px h-40px rounded-circle d-flex align-items-center justify-content-center bg-light overflow-hidden shadow-sm me-3">
                                        <img src="${foto}" alt="Foto" class="mw-100 mh-100" style="object-fit: cover;" />
                                    </div>
                                    <div>
                                        <div class="fw-bold fs-14px text-body"><label for="chk_${item.IdJugador}" class="cursor-pointer mb-0">${nombreCompleto}</label></div>
                                        <div class="fs-12px text-gray-500">COMET: <span class="text-dark fw-semibold">${item.NroComet}</span> &nbsp;|&nbsp; Edad: ${item.EdadDeportiva} años</div>
                                    </div>
                                </div>
                            </td>
                            
                            <td class="text-center align-middle">
                                <input type="number" class="form-control form-control-sm text-center txt-camiseta mx-auto fw-bold text-primary" style="width: 70px;" value="" placeholder="#" min="0" max="99" disabled data-idjugador="${item.IdJugador}" />
                            </td>
                        </tr>
                    `;
                });

                if (html === '') {
                    html = '<tr><td colspan="3" class="text-center py-4 text-danger"><i class="fa fa-exclamation-triangle me-2"></i>No se encontraron jugadores elegibles para este equipo.</td></tr>';
                }

                $("#tbData tbody").html(html);

                // =====================================
                // LOGICA INTERACTIVA DE LA TABLA
                // =====================================

                // 1. Cuando cambian el Switch
                $(".chk-convocar").on("change", function () {
                    let isChecked = $(this).is(":checked");
                    let $fila = $(this).closest("tr");
                    let $inputCamiseta = $fila.find(".txt-camiseta");

                    if (isChecked) {
                        $inputCamiseta.prop("disabled", false); // Habilitar input
                        $inputCamiseta.focus();                 // Enfocar para escribir rápido
                    } else {
                        $inputCamiseta.prop("disabled", true);  // Bloquear
                        $inputCamiseta.val("");                 // Limpiar el valor
                    }

                    // Efecto visual de fondo
                    if (isChecked) $fila.addClass("bg-success bg-opacity-10");
                    else $fila.removeClass("bg-success bg-opacity-10");
                });

                // 2. Validación para que no pongan -5 o letras en la camiseta
                $(".txt-camiseta").on("input", function () {
                    let valor = parseInt(this.value);
                    if (isNaN(valor) || valor < 0) {
                        this.value = "";
                    } else if (valor > 99) {
                        this.value = 99; // Límite lógico de camisetas (0 al 99)
                    }
                });

            } else {
                $("#tbData tbody").html(`<tr><td colspan="3" class="text-center text-danger">${response.d.Mensaje}</td></tr>`);
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#tbData tbody").html('<tr><td colspan="3" class="text-center text-danger">Error de conexión con el servidor.</td></tr>');
        }
    });
}

$("#btnGuardarPlantilla").on("click", function () {

    let idEquipo = $("#txtIdEquipo").val();
    let listaSeleccionados = [];
    let hayErrores = false;
    let dorsalesVistos = new Set(); // Set de JS para buscar duplicados ultra rápido

    // 1. Recorremos SOLO los switches que estén encendidos (convocados)
    $(".chk-convocar:checked").each(function () {
        let $fila = $(this).closest("tr");
        let idJugador = $(this).data("idjugador");
        let dorsalStr = $fila.find(".txt-camiseta").val().trim();

        // Validación A: Que no lo dejen en blanco
        if (dorsalStr === "") {
            MensajeToast("Falta Camiseta", "Debe asignar un número a todos los jugadores convocados.", "warning");
            $fila.find(".txt-camiseta").focus();
            hayErrores = true;
            return false; // Rompe el bucle .each()
        }

        let dorsal = parseInt(dorsalStr);

        // Validación B: Front-end check de duplicados (Mejora de UX)
        if (dorsalesVistos.has(dorsal)) {
            MensajeToast("Dorsal Duplicado", `El número ${dorsal} se ha asignado a más de un jugador.`, "warning");
            $fila.find(".txt-camiseta").focus();
            hayErrores = true;
            return false;
        }
        dorsalesVistos.add(dorsal);

        // Si pasa las validaciones, lo agregamos al array (Igual a tu DTO de C#)
        listaSeleccionados.push({
            IdJugador: idJugador,
            Dorsal: dorsal
        });
    });

    // Si hubo algún error en el bucle, detenemos el guardado
    if (hayErrores) return;

    // Validación C: Que al menos seleccionen a alguien
    if (listaSeleccionados.length === 0) {
        MensajeToast("Plantilla Vacía", "Debe convocar al menos a un jugador para guardar.", "warning");
        return;
    }

    // 2. Bloqueamos el botón y mostramos el loading
    let $btnGuardar = $(this);
    $btnGuardar.prop("disabled", true).html('<i class="fa fa-spinner fa-spin me-2"></i>Guardando...');
    $(".panel-body").LoadingOverlay("show");

    // 3. Petición AJAX enviando el Array directo
    $.ajax({
        type: "POST",
        url: "PlantelEquipo.aspx/GuardarPlantillaMasiva", // Ajusta a tu página
        data: JSON.stringify({
            IdEquipo: parseInt(idEquipo),
            listaJugadores: listaSeleccionados
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $(".panel-body").LoadingOverlay("hide");

            alertaTimer(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
            );

            if (response.d.Estado) {
                // Opcional: Redirigir o recargar la tabla después de un guardado exitoso
                setTimeout(() => {
                    window.location.href = 'Inscripciones.aspx';
                    //cargarJugadoresElegibles(idEquipo);
                }, 1500);
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $(".panel-body").LoadingOverlay("hide");
            MensajeToast("¡Atención!", "Error de comunicación con el servidor.", "error");
        },
        complete: function () {
            // Restauramos el botón
            $btnGuardar.prop("disabled", false).html('<i class="fa fa-save me-2"></i>Guardar Plantilla');
        }
    });

    //console.log(listaSeleccionados);
    //setTimeout(function () {
    //    $(".panel-body").LoadingOverlay("hide");
    //    MensajeToast("Éxito", "Plantilla guardada correctamente.", "success");
    //    $btnGuardar.prop("disabled", false).html('<i class="fa fa-save me-2"></i>Guardar Plantilla');
    //}, 3000);

});

// fin