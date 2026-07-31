<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="PanelResultados.aspx.cs" Inherits="CapaPresentacion.PanelResultados" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="mb-3">
        <a href="PartidosResult.aspx" class="btn btn-white btn-sm fw-bold shadow-sm">
            <i class="fa fa-arrow-left me-1"></i>Volver a la lista
        </a>
    </div>

    <div class="row">
        <div class="col-xl-12">
            <div class="panel panel-inverse shadow-lg border-0 mb-4">
                <div class="panel-heading bg-dark text-white d-flex justify-content-between align-items-center p-3">
                    <h4 class="panel-title mb-0 fs-16px"><i class="fa fa-futbol me-2"></i>Detalle del Encuentro</h4>
                    <!-- Etiqueta de Estado Dinámica -->
                    <div id="badgeEstadoPartido" class="badge bg-info fs-14px px-3 py-2 shadow-sm">
                        Cargando...
                    </div>
                </div>

                <div class="panel-body bg-light bg-opacity-50 p-4">

                    <!-- Fila superior: Datos del partido y Botón Finalizar -->
                    <div class="row mb-5 align-items-center border-bottom pb-4">
                        <div class="col-md-9">
                            <div class="d-flex flex-wrap gap-4">
                                <div class="d-flex align-items-center">
                                    <div class="bg-white p-2 rounded shadow-sm text-primary me-2"><i class="fa fa-calendar-alt fa-lg"></i></div>
                                    <div>
                                        <small class="text-muted d-block fw-bold fs-11px text-uppercase">Fecha y Hora</small>
                                        <span id="lblFechaHora" class="fw-bold text-dark fs-15px">--/--/---- --:--</span>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center">
                                    <div class="bg-white p-2 rounded shadow-sm text-success me-2"><i class="fa fa-map-marker-alt fa-lg"></i></div>
                                    <div>
                                        <small class="text-muted d-block fw-bold fs-11px text-uppercase">Cancha</small>
                                        <span id="lblCancha" class="fw-bold text-dark fs-15px">----------</span>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center">
                                    <div class="bg-white p-2 rounded shadow-sm text-warning me-2"><i class="fa fa-trophy fa-lg"></i></div>
                                    <div>
                                        <small class="text-muted d-block fw-bold fs-11px text-uppercase">Fase</small>
                                        <span id="lblFase" class="fw-bold text-dark fs-15px">----------</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 text-end mt-3 mt-md-0">
                            <button id="btnFinalizarPartido" class="btn btn-danger btn-lg w-100 fw-bold shadow">
                                <i class="fa fa-flag-checkered me-2"></i>FINALIZAR PARTIDO
                            </button>
                        </div>
                    </div>

                    <!-- SECCIÓN DE LOS EQUIPOS LADO A LADO (MARCADOR) -->
                    <div class="row align-items-center justify-content-center text-center px-lg-5">

                        <!-- EQUIPO LOCAL (Izquierda) -->
                        <div class="col-md-4 col-sm-5">
                            <div class="card border-0 shadow-sm rounded-4 p-4 border-bottom border-primary border-4">
                                <h6 class="text-muted fw-bold mb-3 text-uppercase letter-spacing-1">Equipo Local</h6>
                                <div class="text-center">
                                    <img id="imgLogoLocal" src="Logos/sinLogo.png" alt="Logo Local" class="img-fluid rounded-circle shadow-sm border border-3 border-light mb-3" style="width: 120px; height: 120px; object-fit: contain;">
                                </div>
                                <h4 id="lblClubLocal" class="fw-bold text-dark mb-4">Cargando...</h4>

                                <button id="btnPlantillaLocal" class="btn btn-outline-primary fw-bold w-100 rounded-pill" data-idequipo="0">
                                    <i class="fa fa-users me-1"></i>Ver Plantilla
                                </button>
                            </div>
                        </div>

                        <!-- CENTRO (VS o Marcador) -->
                        <div class="col-md-4 col-sm-2 text-center my-4 my-md-0">
                            <div class="d-flex justify-content-center align-items-center gap-3">
                                <div id="lblGolesLocal" class="bg-dark text-white rounded-3 shadow-lg d-flex align-items-center justify-content-center display-4 fw-bold" style="width: 80px; height: 100px;">
                                    0
                                </div>
                                <span class="text-muted fw-bold fs-4">VS</span>
                                <div id="lblGolesVisitante" class="bg-dark text-white rounded-3 shadow-lg d-flex align-items-center justify-content-center display-4 fw-bold" style="width: 80px; height: 100px;">
                                    0
                                </div>
                            </div>
                        </div>

                        <!-- EQUIPO VISITANTE (Derecha) -->
                        <div class="col-md-4 col-sm-5">
                            <div class="card border-0 shadow-sm rounded-4 p-4 border-bottom border-danger border-4">
                                <h6 class="text-muted fw-bold mb-3 text-uppercase letter-spacing-1">Equipo Visitante</h6>
                                <div class="text-center">
                                    <img id="imgLogoVisitante" src="Logos/sinLogo.png" alt="Logo Visitante" class="img-fluid rounded-circle shadow-sm border border-3 border-light mb-3" style="width: 120px; height: 120px; object-fit: contain;">
                                </div>
                                <h4 id="lblClubVisitante" class="fw-bold text-dark mb-4">Cargando...</h4>

                                <button id="btnPlantillaVisitante" class="btn btn-outline-info fw-bold w-100 rounded-pill" data-idequipo="0">
                                    <i class="fa fa-users me-1"></i>Ver Plantilla
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="modalPlantilla" tabindex="-1" aria-labelledby="modalPlantillaLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title fw-bold" id="modalPlantillaLabel">
                        <i class="fa fa-list-alt me-2"></i>Plantilla de Jugadores
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body bg-light">
                    <h4 id="lblTituloEquipoModal" class="text-center fw-bold text-dark mb-3">Nombre del Equipo</h4>

                    <!-- Aquí irá tu tabla de jugadores cargada por JS -->
                    <div class="table-responsive">
                        <table id="tbPlantillaJugadores" class="table table-hover table-bordered text-center align-middle bg-white w-100">
                            <thead class="table-light">
                                <tr>
                                    <th width="10%">Dorsal</th>
                                    <th width="15%">Foto</th>
                                    <th>Nombres y Apellidos</th>
                                    <th width="20%">C.I.</th>
                                    <th width="15%">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Se llena con JS -->
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="modalEvento" tabindex="-1" aria-labelledby="modalEventoLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <!-- modal-sm para formato compacto -->
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title fw-bold fs-16px" id="modalEventoLabel">
                        <i class="fa fa-bolt me-2"></i>Registrar Evento
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body bg-light">

                    <!-- Identificador visual del jugador seleccionado -->
                    <div class="text-center mb-4">
                        <span class="badge bg-secondary bg-opacity-10 text-dark fs-14px px-3 py-2 border w-100" id="lblNombreJugadorEvento">Nombre del Jugador
                        </span>
                    </div>

                    <!-- Campo Oculto para el IdJugador -->
                    <input type="hidden" id="hdnIdJugadorEvento" value="0" />

                    <!-- Combo de Tipos de Evento -->
                    <div class="mb-3">
                        <label class="form-label fw-bold text-dark fs-13px">Tipo de Evento:</label>
                        <select id="cboTipoEvento" class="form-select shadow-sm cursor-pointer">
                            <option value="">-- Seleccione --</option>
                            <!-- Los values deben coincidir con los IDs de tu tabla TIPO_EVENTOS -->
                            <option value="1">⚽ Gol</option>
                            <option value="2">🟨 Tarjeta Amarilla</option>
                            <option value="3">🟥 Tarjeta Roja</option>
                            <option value="4">🤦‍♂️ Autogol</option>
                        </select>
                    </div>

                    <!-- Input del Minuto -->
                    <div class="mb-3">
                        <label class="form-label fw-bold text-dark fs-13px">Minuto:</label>
                        <div class="input-group shadow-sm">
                            <input type="number" id="txtMinuto" class="form-control text-center fw-bold" min="1" max="120" placeholder="Ej. 45">
                            <span class="input-group-text bg-white"><i class="fa fa-clock text-muted"></i></span>
                        </div>
                    </div>

                    <!-- Textarea de Observaciones -->
                    <div class="mb-3">
                        <label class="form-label fw-bold text-dark fs-13px">Observaciones: <span class="fw-normal text-muted">(Opcional)</span></label>
                        <textarea id="txtObservaciones" class="form-control shadow-sm" rows="2" placeholder="Detalles de la incidencia..."></textarea>
                    </div>

                </div>
                <div class="modal-footer bg-white border-top">
                    <button type="button" class="btn btn-white fw-bold shadow-sm" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" id="btnGuardarEvento" class="btn btn-primary fw-bold shadow-sm">
                        <i class="fa fa-save me-1"></i>Guardar Evento
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="modalResultados" tabindex="-1" role="dialog" data-bs-backdrop="static">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg rounded-4">

                <!-- Cabecera -->
                <div class="modal-header bg-dark text-white border-0">
                    <h5 class="modal-title fw-bold">
                        <i class="fa fa-flag-checkered me-2 text-success"></i>Cierre y Resultados del Partido
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-hidden="true"></button>
                </div>

                <div class="modal-body p-4 bg-light">
                    <input id="txtIdPartidoRe" value="0" type="hidden" />

                    <!-- SECCIÓN 1: Estado del Partido -->
                    <div class="card border-0 shadow-sm mb-4 rounded-3">
                        <div class="card-body p-3">
                            <div class="row align-items-center">
                                <div class="col-md-7">
                                    <h6 class="mb-0 fw-bold text-dark">
                                        <i class="fa fa-info-circle me-2 text-primary"></i>Seleccione el estado final del encuentro
                                    </h6>
                                </div>
                                <div class="col-md-5 mt-3 mt-md-0">
                                    <div class="input-group input-group-sm shadow-sm">
                                        <span class="input-group-text bg-white fw-bold border-end-0"><i class="fa fa-trophy text-warning"></i></span>
                                        <select id="cboEstPart" class="form-select form-select-sm fw-bold border-start-0 cursor-pointer">
                                            <!-- Opciones cargadas por JS -->
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- SECCIÓN 2: Marcador y Equipos -->
                    <div class="row align-items-stretch g-0">

                        <!-- EQUIPO LOCAL -->
                        <div class="col-md-5">
                            <div class="card border-0 shadow-sm h-100 rounded-4 border-bottom border-primary border-4">
                                <div class="card-body text-center p-4">
                                    <h6 id="lblEquipoLocal" class="fw-bold text-primary mb-3 text-uppercase text-truncate">Cargando...</h6>
                                    <img id="imgLocalResu" src="Logos/sinLogo.png" alt="Logo Local" class="img-fluid rounded-circle shadow-sm mb-4 border border-2 border-light" style="width: 90px; height: 90px; object-fit: contain;">

                                    <div class="row g-2 mb-4">
                                        <!-- Input Goles -->
                                        <div class="col-6">
                                            <label class="form-label text-muted fs-11px fw-bold text-uppercase letter-spacing-1" for="txtGolLocal">Goles</label>
                                            <div class="input-group input-group-sm shadow-sm">
                                                <span class="input-group-text bg-primary text-white border-primary"><i class="fas fa-futbol"></i></span>
                                                <input type="number" class="form-control text-center fw-bold fs-5 text-dark" id="txtGolLocal" value="0" min="0" />
                                            </div>
                                        </div>
                                        <!-- Input Penales -->
                                        <div class="col-6">
                                            <label class="form-label text-muted fs-11px fw-bold text-uppercase letter-spacing-1" for="txtGolPenalLocal">Penales</label>
                                            <div class="input-group input-group-sm shadow-sm">
                                                <span class="input-group-text bg-white text-muted border-end-0"><i class="fas fa-futbol"></i></span>
                                                <input type="number" class="form-control text-center fw-bold fs-5" id="txtGolPenalLocal" value="0" min="0" />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Switch Pagado -->
                                    <div class="form-check form-switch d-flex justify-content-center align-items-center bg-light p-2 rounded-3 border">
                                        <input class="form-check-input cursor-pointer m-0" type="checkbox" id="chkPagadoLocal" style="width: 2.5em; height: 1.25em;">
                                        <label class="form-check-label fw-bold ms-2 cursor-pointer fs-13px text-dark" for="chkPagadoLocal">
                                            Arbitraje Pagado
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- SEPARADOR VS CENTRAL -->
                        <div class="col-md-2 d-flex flex-column justify-content-center align-items-center py-3">
                            <div class="badge bg-dark rounded-circle shadow-sm d-flex align-items-center justify-content-center fw-bold fs-5" style="width: 50px; height: 50px; z-index: 10;">
                                VS
                            </div>
                        </div>

                        <!-- EQUIPO VISITANTE -->
                        <div class="col-md-5">
                            <div class="card border-0 shadow-sm h-100 rounded-4 border-bottom border-danger border-4">
                                <div class="card-body text-center p-4">
                                    <h6 id="lblEquipoVisitante" class="fw-bold text-danger mb-3 text-uppercase text-truncate">Cargando...</h6>
                                    <img id="imgVisitanteResu" src="Logos/sinLogo.png" alt="Logo Visitante" class="img-fluid rounded-circle shadow-sm mb-4 border border-2 border-light" style="width: 90px; height: 90px; object-fit: contain;">

                                    <div class="row g-2 mb-4">
                                        <!-- Input Goles -->
                                        <div class="col-6">
                                            <label class="form-label text-muted fs-11px fw-bold text-uppercase letter-spacing-1" for="txtGolVisitante">Goles</label>
                                            <div class="input-group input-group-sm shadow-sm">
                                                <span class="input-group-text bg-danger text-white border-danger"><i class="fas fa-futbol"></i></span>
                                                <input type="number" class="form-control text-center fw-bold fs-5 text-dark" id="txtGolVisitante" value="0" min="0" />
                                            </div>
                                        </div>
                                        <!-- Input Penales -->
                                        <div class="col-6">
                                            <label class="form-label text-muted fs-11px fw-bold text-uppercase letter-spacing-1" for="txtGolPenalVisitante">Penales</label>
                                            <div class="input-group input-group-sm shadow-sm">
                                                <span class="input-group-text bg-white text-muted border-end-0"><i class="fas fa-futbol"></i></span>
                                                <input type="number" class="form-control text-center fw-bold fs-5" id="txtGolPenalVisitante" value="0" min="0" />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Switch Pagado -->
                                    <div class="form-check form-switch d-flex justify-content-center align-items-center bg-light p-2 rounded-3 border">
                                        <input class="form-check-input cursor-pointer m-0" type="checkbox" id="chkPagadoVisitante" style="width: 2.5em; height: 1.25em;">
                                        <label class="form-check-label fw-bold ms-2 cursor-pointer fs-13px text-dark" for="chkPagadoVisitante">
                                            Arbitraje Pagado
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Pie del Modal -->
                <div class="modal-footer bg-white border-top-0 pt-0 justify-content-center">
                    <button type="button" class="btn btn-light fw-bold px-4 shadow-sm text-muted" data-bs-dismiss="modal">Cancelar</button>
                    <button id="btnGuardarResultados" type="button" class="btn btn-success fw-bold px-5 shadow-sm">
                        <i class="fa fa-save me-2"></i>Guardar Resultado Final
                    </button>
                </div>
            </div>
        </div>
    </div>

</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="js/PanelResultados.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
