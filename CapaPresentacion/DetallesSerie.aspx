<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="DetallesSerie.aspx.cs" Inherits="CapaPresentacion.DetallesSerie" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="assets/plugins/bootstrap-datepicker/dist/css/bootstrap-datepicker.css" rel="stylesheet" />
    <link href="assets/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css" rel="stylesheet" />
    <link href="assets/plugins/select2ori/dist/css/select2.min.css" rel="stylesheet" />
    <style>
        .logo-club {
            width: 120px;
            height: 120px;
            /* border-radius: 50%; */
            object-fit: contain; /* EL CAMBIO MÁGICO: Evita recortes */
            object-position: center; /* Centra el logo en la caja */
            /* Opcional pero recomendado para logos: un fondito muy tenue */
            background-color: #f8f9fa;
            padding: 5px;
            border-radius: 8px; /* Un ligero borde redondeado a la caja */
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <%--<h1 class="page-header">DETALLES <small>Modulo para Series...</small></h1>--%>

    <div class="d-flex align-items-center mb-4">
        <a href="Partidos.aspx" class="btn btn-white shadow-sm me-3 px-3 fw-bold text-body">
            <i class="fa fa-arrow-left me-2"></i>Volver a Series
        </a>
        <%--<div>
            <h2 class="page-header mb-0" id="lblTituloSerie">Cargando Serie...</h2>
            <span class="fs-13px text-gray-500 fw-semibold" id="lblSubtituloCompeticion">Torneo - Categoría</span>
        </div>--%>
    </div>

    <div class="row">
        <div class="col-xl-12 mb-4">
            <div class="panel panel-inverse" data-sortable-id="panel-posiciones">
                <div class="panel-heading">
                    <h4 class="panel-title fs-14px"><i class="fa fa-list-ol me-2"></i>Tabla de Posiciones Oficial</h4>
                    <div class="panel-heading-btn">
                        <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="table-responsive">
                        <table id="tbPosiciones" width="100%" class="table table-striped table-bordered align-middle text-nowrap text-center">
                            <thead>
                                <tr>
                                    <th width="1%">Pos</th>
                                    <th class="text-start">Club</th>
                                    <th width="5%" title="Partidos Jugados">PJ</th>
                                    <th width="5%" title="Partidos Ganados">PG</th>
                                    <th width="5%" title="Partidos Empatados">PE</th>
                                    <th width="5%" title="Partidos Perdidos">PP</th>
                                    <th width="5%" title="Goles a Favor">GF</th>
                                    <th width="5%" title="Goles en Contra">GC</th>
                                    <th width="5%" title="Diferencia de Goles">DG</th>
                                    <th width="5%" class="bg-primary text-body fs-15px" title="Puntos Totales">PTS</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-12">
            <div class="panel panel-inverse" data-sortable-id="panel-fixture">
                <div class="panel-heading">
                    <h4 class="panel-title fs-14px"><i class="fa fa-calendar-alt me-2"></i>Fixture de Partidos</h4>
                    <div class="panel-heading-btn">
                        <button id="btnAbrirModalProgramar" class="btn btn-xs btn-success fw-bold px-2 rounded-pill shadow-sm">
                            <i class="fa fa-plus me-1"></i>Programar Partido
                        </button>
                    </div>
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

    <div class="modal fade" id="modalProgramar" tabindex="-1" role="dialog" data-bs-backdrop="static">
        <div class="modal-dialog modal-lg">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header bg-inverse text-white">
                    <h5 class="modal-title"><i class="fa fa-calendar-plus me-2 text-success"></i>Programar Nuevo Partido</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-hidden="true"></button>
                </div>
                <div class="modal-body">

                    <h6 class="text-indigo mb-3 border-bottom pb-2"><i class="fa fa-clock me-2"></i>Detalles de Programación</h6>
                    <div class="row mb-4">
                        <div class="col-md-3">
                            <label class="form-label fw-bold" for="cboFase">Fase del Torneo:</label>
                            <select id="cboFase" class="form-select form-select-sm"></select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label fw-bold" for="txtFecha">Fecha:</label>
                            <input type="text" id="txtFecha" class="form-control form-control-sm text-center" readonly style="cursor: pointer;">
                        </div>
                        <div class="col-md-2">
                            <label class="form-label fw-bold" for="txtHora">Hora:</label>
                            <input type="text" id="txtHora" class="form-control form-control-sm" readonly style="cursor: pointer;">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-bold" for="txtCancha">Cancha:</label>
                            <input type="text" id="txtCancha" class="form-control form-control-sm" placeholder="Ej: Cancha 1" autocomplete="off">
                        </div>
                    </div>

                    <h6 class="text-warning mb-3 border-bottom pb-2 mt-2"><i class="fa fa-users me-2"></i>Enfrentamiento</h6>
                    <div class="row align-items-center bg-light bg-opacity-50 p-3 rounded-3 border">
                        <div class="col-md-5">
                            <div class="mb-2">
                                <label class="form-label fw-bold text-primary fs-14px"><i class="fa fa-home me-1"></i>Equipo Local</label>
                                <select id="cboEquipoLocal" class="form-select form-select-lg fw-semibold"></select>
                            </div>
                            <div class="mb-1 text-center">
                                <img id="imgLocal" src="Logos/sinLogo.png" alt="Logo Local" class="logo-club">
                            </div>
                        </div>

                        <div class="col-md-2 text-center">
                            <div class="w-40px h-40px bg-dark text-white rounded-circle d-flex align-items-center justify-content-center mx-auto fw-bold fs-5 shadow-sm">
                                VS
                            </div>
                        </div>

                        <div class="col-md-5">
                            <div class="mb-2 text-end">
                                <label class="form-label fw-bold text-danger fs-14px"><i class="fa fa-plane me-1"></i>Equipo Visitante</label>
                                <select id="cboEquipoVisitante" class="form-select form-select-lg fw-semibold"></select>
                            </div>
                            <div class="mb-1 text-center">
                                <img id="imgVisitante" src="Logos/sinLogo.png" alt="Logo Visitante" class="logo-club">
                            </div>
                        </div>
                    </div>

                </div>
                <div class="modal-footer bg-light">
                    <button type="button" class="btn btn-sm btn-white" data-bs-dismiss="modal">Cancelar</button>
                    <button id="btnGuardarPartido" type="button" class="btn btn-sm btn-success px-4 fw-bold">
                        <i class="fa fa-save me-1"></i>Confirmar Partido
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="modalResultados" tabindex="-1" role="dialog" data-bs-backdrop="static">
        <div class="modal-dialog modal-lg">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header bg-inverse text-white">
                    <h5 class="modal-title"><i class="fa fa-calendar-plus me-2 text-success"></i>Resultados</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-hidden="true"></button>
                </div>
                <div class="modal-body">
                    <input id="txtIdPartidoRe" value="0" type="hidden" />
                    <div class="row align-items-center bg-opacity-10 rounded-3 p-2">
                        <div class="col-md-8">
                            <h6 class="text-warning"><i class="fa fa-users me-2"></i>Enfrentamiento</h6>
                        </div>

                        <div class="col-md-4 mb-3 mb-md-0">
                            <label class="form-label fw-bold" for="cboEstPart">
                                <i class="fa fa-trophy text-warning me-1"></i>Estado Partido
                            </label>
                            <select id="cboEstPart" class="form-select form-select-sm">
                            </select>
                        </div>
                    </div>
                    <%--<h6 class="text-warning mb-3 border-bottom pb-2"><i class="fa fa-users me-2"></i>Enfrentamiento</h6>--%>
                    <div class="row align-items-center bg-light bg-opacity-50 p-3 rounded-3 border">
                        <div class="col-md-5">
                            <div class="mb-2 text-center">
                                <label class="form-label fw-bold text-primary fs-14px">
                                    <i class="fa fa-home me-1"></i><span id="lblEquipoLocal"></span>
                                </label>
                            </div>
                            <div class="mb-1 text-center">
                                <img id="imgLocalResu" src="Logos/sinLogo.png" alt="Logo Local" class="logo-club">
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <label class="form-label" for="txtGolLocal">Gol Local:</label>
                                    <div class="input-group input-group-sm mb-3">
                                        <span class="input-group-text input-group-addon"><i class="fas fa-baseball"></i></span>
                                        <input type="number" class="form-control model" id="txtGolLocal" name="Gol Local" value="0" min="0" />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label" for="txtGolPenalLocal">Gol Penal:</label>
                                    <div class="input-group input-group-sm mb-3">
                                        <span class="input-group-text input-group-addon"><i class="fas fa-baseball"></i></span>
                                        <input type="number" class="form-control model" id="txtGolPenalLocal" name="Gol Penal Local" value="0" min="0" />
                                    </div>
                                </div>
                            </div>

                            <div class="form-check form-switch ms-md-3">
                                <input class="form-check-input cursor-pointer" type="checkbox" id="chkPagadoLocal">
                                <label class="form-check-label fw-bold ms-2 cursor-pointer" for="chkPagadoLocal">
                                    <i class="fa fa-money-bill-wave text-danger me-1"></i>Arbitraje Pagada
                                </label>
                            </div>
                        </div>

                        <div class="col-md-2 text-center">
                            <div class="w-40px h-40px bg-dark text-white rounded-circle d-flex align-items-center justify-content-center mx-auto fw-bold fs-5 shadow-sm">
                                VS
                            </div>
                        </div>

                        <div class="col-md-5">
                            <div class="mb-2 text-center">
                                <label class="form-label fw-bold text-danger fs-14px">
                                    <i class="fa fa-plane me-1"></i><span id="lblEquipoVisitante"></span>
                                </label>
                            </div>
                            <div class="mb-1 text-center">
                                <img id="imgVisitanteResu" src="Logos/sinLogo.png" alt="Logo Visitante" class="logo-club">
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <label class="form-label" for="txtGolVisitante">Gol Visitante:</label>
                                    <div class="input-group input-group-sm mb-3">
                                        <span class="input-group-text input-group-addon"><i class="fas fa-baseball"></i></span>
                                        <input type="number" class="form-control model" id="txtGolVisitante" name="Gol Visitante" value="0" min="0" />
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label" for="txtGolPenalVisitante">Gol Penal:</label>
                                    <div class="input-group input-group-sm mb-3">
                                        <span class="input-group-text input-group-addon"><i class="fas fa-baseball"></i></span>
                                        <input type="number" class="form-control model" id="txtGolPenalVisitante" name="Gol Penal Visitante" value="0" min="0" />
                                    </div>
                                </div>
                            </div>

                            <div class="form-check form-switch ms-md-3">
                                <input class="form-check-input cursor-pointer" type="checkbox" id="chkPagadoVisitante">
                                <label class="form-check-label fw-bold ms-2 cursor-pointer" for="chkPagadoVisitante">
                                    <i class="fa fa-money-bill-wave text-danger me-1"></i>Arbitraje Pagada
                                </label>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="modal-footer bg-light">
                    <button type="button" class="btn btn-sm btn-white" data-bs-dismiss="modal">Cancelar</button>
                    <button id="btnGuardarResultados" type="button" class="btn btn-sm btn-success px-4 fw-bold">
                        <i class="fa fa-save me-1"></i>Guardar Resultado
                    </button>
                </div>
            </div>
        </div>
    </div>

</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="assets/plugins/bootstrap-datepicker/dist/js/bootstrap-datepicker.js"></script>

    <script src="assets/plugins/bootstrap-datepicker/dist/locales/bootstrap-datepicker.es.min.js"></script>
    <script src="assets/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js"></script>
    <script src="assets/plugins/select2ori/dist/js/select2.min.js"></script>
    <script src="js/DetalleSeries.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
