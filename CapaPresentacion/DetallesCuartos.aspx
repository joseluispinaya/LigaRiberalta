<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="DetallesCuartos.aspx.cs" Inherits="CapaPresentacion.DetallesCuartos" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="assets/plugins/bootstrap-datepicker/dist/css/bootstrap-datepicker.css" rel="stylesheet" />
    <link href="assets/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="d-flex align-items-center mb-4">
        <a href="PartidosCuartos.aspx" class="btn btn-white shadow-sm me-3 px-3 fw-bold text-body">
            <i class="fa fa-arrow-left me-2"></i>Volver a Partidos
        </a>
    </div>

    <div class="row">
        <div class="col-xl-12">
            <div class="panel panel-inverse" data-sortable-id="panel-fixture">
                <div class="panel-heading">
                    <h4 class="panel-title fs-14px"><i class="fa fa-calendar-alt me-2"></i>Fixture de Partidos Cuartos de Final</h4>
                </div>
                <div class="panel-body">
                    <div class="table-responsive">
                        <table id="tbPartidos" width="100%" class="table table-striped table-bordered align-middle text-nowrap text-center">
                            <thead>
                                <tr>
                                    <th>Fecha / Hora</th>
                                    <th>Fase</th>
                                    <th class="text-end">Equipo Local</th>
                                    <th width="12%">Marcador</th>
                                    <th class="text-start">Equipo Visitante</th>
                                    <th>Cancha</th>
                                    <th>Estado</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <div class="modal fade" id="mdEditarPartido" tabindex="-1" role="dialog" data-bs-backdrop="static">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title fw-bold fs-16px">
                        <i class="fa fa-calendar-plus me-2"></i>Editar Fecha Partido
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-hidden="true"></button>
                </div>
                <div class="modal-body bg-light">

                    <!-- Identificador visual del jugador seleccionado -->
                    <div class="text-center mb-4">
                        <span class="badge bg-lime fs-12px px-2 py-2 border w-100" id="lblEquiposvs">Enfrentamiento
                        </span>
                    </div>

                    <input type="hidden" id="txtIdPartidoEdit" value="0" />

                    <div class="row mb-3">
                        <div class="col-md-7">
                            <label class="form-label fw-bold" for="txtFechaEdi">Fecha:</label>
                            <input type="text" id="txtFechaEdi" class="form-control form-control-sm text-center" readonly style="cursor: pointer;">
                        </div>
                        <div class="col-md-5">
                            <label class="form-label fw-bold" for="txtHoraEdi">Hora:</label>
                            <input type="text" id="txtHoraEdi" class="form-control form-control-sm text-center" readonly style="cursor: pointer;">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold" for="txtCanchaEdi">Cancha:</label>
                        <input type="text" id="txtCanchaEdi" class="form-control form-control-sm" placeholder="Ej: Cancha 1" autocomplete="off">
                    </div>

                </div>
                <div class="modal-footer bg-white border-top">
                    <button type="button" class="btn btn-white fw-bold" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" id="btnGuardarCamEdit" class="btn btn-primary fw-bold">
                        <i class="fa fa-save me-1"></i>Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="modalDetalless" tabindex="-1" role="dialog" data-bs-backdrop="static">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg rounded-4">

                <!-- Cabecera -->
                <div class="modal-header bg-dark text-white border-0">
                    <h5 class="modal-title fw-bold">
                        <i class="fa fa-flag-checkered me-2 text-success"></i>Detalle del Partido
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-hidden="true"></button>
                </div>

                <div class="modal-body p-4 bg-light">

                    <!-- SECCIÓN 1: Estado del Partido -->
                    <div class="card border-0 shadow-sm mb-4 rounded-3">
                        <div class="card-body p-3">
                            <div class="row align-items-center">
                                <div class="col-md-8">
                                    <div class="d-flex flex-wrap gap-4">
                                        <div class="d-flex align-items-center">
                                            <div class="bg-white p-2 rounded shadow-sm text-primary me-2"><i class="fa fa-calendar-alt fa-lg"></i></div>
                                            <div>
                                                <small class="text-muted d-block fw-bold fs-11px text-uppercase">Fecha y Hora</small>
                                                <span id="lblFechaHora" class="fw-bold text-dark fs-13px">--/--/---- --:--</span>
                                            </div>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <div class="bg-white p-2 rounded shadow-sm text-success me-2"><i class="fa fa-map-marker-alt fa-lg"></i></div>
                                            <div>
                                                <small class="text-muted d-block fw-bold fs-11px text-uppercase">Cancha</small>
                                                <span id="lblCancha" class="fw-bold text-dark fs-13px">----------</span>
                                            </div>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <div class="bg-white p-2 rounded shadow-sm text-warning me-2"><i class="fa fa-trophy fa-lg"></i></div>
                                            <div>
                                                <small class="text-muted d-block fw-bold fs-11px text-uppercase">Fase</small>
                                                <span id="lblFase" class="fw-bold text-dark fs-13px">----------</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 text-end mt-3 mt-md-0">
                                    <button id="btnReporte" class="btn btn-danger btn-lg w-100 fw-bold shadow">
                                        <i class="fas fa-file-pdf me-2"></i>GENERAR REPORTE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- SECCIÓN DE LOS EQUIPOS LADO A LADO (MARCADOR) -->
                    <div class="row align-items-center justify-content-center text-center">

                        <!-- EQUIPO LOCAL (Izquierda) -->
                        <div class="col-md-4 col-sm-5">
                            <div class="card border-0 shadow-sm rounded-4 p-4 border-bottom border-primary border-4">
                                <h6 class="text-muted fw-bold mb-3 text-uppercase letter-spacing-1">Equipo Local</h6>
                                <div class="text-center">
                                    <img id="imgLogoLocal" src="Logos/sinLogo.png" alt="Logo Local" class="img-fluid rounded-circle shadow-sm border border-3 border-light mb-3" style="width: 90px; height: 90px; object-fit: contain;">
                                </div>
                                <h4 id="lblClubLocal" class="fw-bold text-dark mb-3">Cargando...</h4>
                                <%--<h6 class="fw-bold text-dark mb-2">
                                <i class="fa fa-money-bill-wave text-success me-1"></i><span id="lblArbitrajeLocal">Cargando...</span>
                            </h6>--%>
                                <h6 id="lblArbitrajeLocal" class="fw-bold text-dark mb-2">
                                    <i class="fa fa-money-bill-wave text-success me-1"></i>Cargando...
                                </h6>

                                <div id="contenedorEventosLocal" class="text-start w-100"></div>
                            </div>
                        </div>

                        <!-- CENTRO (VS o Marcador) -->
                        <div class="col-md-4 col-sm-2 text-center my-4 my-md-0">
                            <div class="d-flex justify-content-center align-items-center gap-3">
                                <div id="lblGolesLocal" class="bg-dark text-white rounded-3 shadow-lg d-flex align-items-center justify-content-center display-4 fw-bold" style="width: 70px; height: 90px;">
                                    0
                                </div>
                                <span class="text-muted fw-bold fs-4">VS</span>
                                <div id="lblGolesVisitante" class="bg-dark text-white rounded-3 shadow-lg d-flex align-items-center justify-content-center display-4 fw-bold" style="width: 70px; height: 90px;">
                                    0
                                </div>
                            </div>
                        </div>

                        <!-- EQUIPO VISITANTE (Derecha) -->
                        <div class="col-md-4 col-sm-5">
                            <div class="card border-0 shadow-sm rounded-4 p-4 border-bottom border-danger border-4">
                                <h6 class="text-muted fw-bold mb-3 text-uppercase letter-spacing-1">Equipo Visitante</h6>
                                <div class="text-center">
                                    <img id="imgLogoVisitante" src="Logos/sinLogo.png" alt="Logo Visitante" class="img-fluid rounded-circle shadow-sm border border-3 border-light mb-3" style="width: 90px; height: 90px; object-fit: contain;">
                                </div>
                                <h4 id="lblClubVisitante" class="fw-bold text-dark mb-3">Cargando...</h4>
                                <h6 id="lblArbitrajeVisitante" class="fw-bold text-dark mb-2">
                                    <i class="fa fa-money-bill-wave text-success me-1"></i>Cargando...
                                </h6>
                                <!-- NUEVO CONTENEDOR PARA EVENTOS -->
                                <div id="contenedorEventosVisitante" class="text-start w-100"></div>
                            </div>
                        </div>

                    </div>

                </div>

                <!-- Pie del Modal -->
                <div class="modal-footer bg-white justify-content-center">
                    <button type="button" class="btn btn-light fw-bold px-4 shadow-sm text-muted" data-bs-dismiss="modal">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="assets/plugins/bootstrap-datepicker/dist/js/bootstrap-datepicker.js"></script>

    <script src="assets/plugins/bootstrap-datepicker/dist/locales/bootstrap-datepicker.es.min.js"></script>
    <script src="assets/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js"></script>
    <script src="js/DetallesCuartos.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
