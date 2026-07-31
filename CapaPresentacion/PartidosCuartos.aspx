<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="PartidosCuartos.aspx.cs" Inherits="CapaPresentacion.PartidosCuartos" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="assets/plugins/bootstrap-datepicker/dist/css/bootstrap-datepicker.css" rel="stylesheet" />
    <link href="assets/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <h1 class="page-header">PANEL DE PARTIDOS <small>Y RESULTADOS FASE CUARTOS DE FINAL</small></h1>

    <div class="row">
        <div class="col-xl-12">
            <div class="panel panel-inverse shadow-sm border-0">
                <!-- Cabecera del Panel -->
                <div class="panel-heading">
                    <h4 class="panel-title"><i class="fa fa-sitemap me-2"></i>Gestión de Partidos Programados Cuartos de Final</h4>
                </div>

                <div class="panel-body">

                    <div class="row">
                        <div class="col-md-4">
                            <div class="p-3 bg-secondary bg-opacity-10 rounded-3">
                                <div class="d-flex align-items-center">
                                    <div class="w-50px h-50px d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle me-3 fs-24px shadow-sm">
                                        <i class="fas fa-filter"></i>
                                    </div>
                                    <div class="flex-fill">
                                        <h5 class="mb-1 fw-bold text-dark">Filtros Inteligentes</h5>
                                        <p class="mb-0 text-muted fs-13px">
                                            Seleccione el torneo y la categoría.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="row p-3 bg-secondary bg-opacity-10 rounded-3 align-items-end">
                                <div class="col-md-5 mb-3 mb-md-0">
                                    <label class="form-label fw-bold" for="cboFiltroTorneo">
                                        <i class="fa fa-trophy text-warning me-1"></i>Seleccione un Torneo:
                                    </label>
                                    <select id="cboFiltroTorneo" class="form-select form-select-sm">
                                    </select>
                                </div>

                                <div class="col-md-5 mb-3 mb-md-0">
                                    <label class="form-label fw-bold" for="cboFiltroCategoria">
                                        <i class="fa fa-layer-group text-info me-1"></i>Seleccione una Categoría:
                                    </label>
                                    <select id="cboFiltroCategoria" class="form-select form-select-sm">
                                    </select>
                                </div>

                                <div class="col-md-2">
                                    <button id="btnBuscarFiltro" type="button" class="btn btn-primary btn-sm w-100 fw-bold">
                                        <i class="fa fa-search me-1"></i>Buscar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <div class="row mb-4">
        <!-- TABLA SERIE A -->
        <div class="col-md-6">
            <div class="panel panel-inverse shadow-sm">
                <div class="panel-heading bg-primary text-white">
                    <h4 class="panel-title">Clasificados Serie A</h4>
                </div>
                <div class="panel-body">
                    <table id="tbSerieA" class="table table-bordered text-center align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Posición</th>
                                <th class="text-start">Club</th>
                                <th>Pts</th>
                                <th>DG</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Llenado por DataTables -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- TABLA SERIE B -->
        <div class="col-md-6">
            <div class="panel panel-inverse shadow-sm">
                <div class="panel-heading bg-danger text-white">
                    <h4 class="panel-title">Clasificados Serie B</h4>
                </div>
                <div class="panel-body">
                    <table id="tbSerieB" class="table table-bordered text-center align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Posición</th>
                                <th class="text-start">Club</th>
                                <th>Pts</th>
                                <th>DG</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Llenado por DataTables -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-xl-12">
            <!-- SECCIÓN DE CRUCES GENERADOS -->
            <div class="panel panel-inverse shadow-sm border-0">
                <div class="panel-heading bg-dark text-white d-flex justify-content-between align-items-center">
                    <h4 class="panel-title"><i class="fa fa-sitemap me-2"></i>Llaves Generadas: Cuartos de Final</h4>
                    <button id="btnProgramarCuartos" class="btn btn-success btn-sm fw-bold">
                        <i class="fa fa-calendar-check me-1"></i>Resultados y Eventos
                    </button>
                </div>
                <div class="panel-body bg-light">
                    <!-- Aquí inyectas las tarjetas de los partidos con JS -->
                    <div id="contenedorCruces" class="row"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="mdPartido" tabindex="-1" role="dialog" data-bs-backdrop="static">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title fw-bold fs-16px">
                        <i class="fa fa-calendar-plus me-2"></i>Programar Partido
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-hidden="true"></button>
                </div>
                <div class="modal-body bg-light">

                    <div class="text-center mb-4">
                        <span class="badge bg-lime fs-12px px-2 py-2 border w-100" id="lblEquiposvs">Enfrentamiento
                        </span>
                    </div>

                    <input type="hidden" id="txtIdEquipo1" value="0" />
                    <input type="hidden" id="txtIdEquipo2" value="0" />

                    <div class="row mb-3">
                        <div class="col-md-7">
                            <label class="form-label fw-bold" for="txtFecha">Fecha:</label>
                            <input type="text" id="txtFecha" class="form-control form-control-sm text-center" readonly style="cursor: pointer;">
                        </div>
                        <div class="col-md-5">
                            <label class="form-label fw-bold" for="txtHora">Hora:</label>
                            <input type="text" id="txtHora" class="form-control form-control-sm text-center" readonly style="cursor: pointer;">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold" for="txtCancha">Cancha:</label>
                        <input type="text" id="txtCancha" class="form-control form-control-sm" placeholder="Ej: Cancha 1" autocomplete="off">
                    </div>

                </div>
                <div class="modal-footer bg-white border-top">
                    <button type="button" class="btn btn-white fw-bold" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" id="btnGuardarPartido" class="btn btn-primary fw-bold">
                        <i class="fa fa-save me-1"></i>Confirmar Partido
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
    <script src="js/PartidosCuartos.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
