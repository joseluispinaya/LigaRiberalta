<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="ControlPagoArbitraje.aspx.cs" Inherits="CapaPresentacion.ControlPagoArbitraje" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <h1 class="page-header">CONTROL DE PAGOS <small>ARBITRAJE</small></h1>

    <div class="row">
        <div class="col-xl-12">
            <div class="panel panel-inverse shadow-sm border-0">
                <!-- Cabecera del Panel -->
                <div class="panel-heading">
                    <h4 class="panel-title"><i class="fa fa-sitemap me-2"></i>Control de Pago de Arbitraje</h4>
                </div>

                <div class="panel-body p-0">

                    <!-- Sección 1: Encabezado del Filtro -->
                    <div class="p-4 border-bottom bg-light bg-opacity-50">
                        <div class="d-flex align-items-center">
                            <div class="w-50px h-50px d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle me-3 fs-24px shadow-sm">
                                <i class="fas fa-filter"></i>
                            </div>
                            <div class="flex-fill">
                                <h5 class="mb-1 fw-bold text-dark">Filtros Inteligentes</h5>
                                <p class="mb-0 text-muted fs-13px">
                                    Seleccione el torneo y la categoría. La tabla se cargará automáticamente al elegir una Fase.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Sección 2: Los 3 Selectores Simétricos -->
                    <div class="p-4 border-bottom bg-white">
                        <div class="row g-4 align-items-end">

                            <!-- Columna 1: Torneo -->
                            <div class="col-md-4">
                                <label class="form-label fw-bold text-dark mb-2" for="cboFiltroTorneo">
                                    <i class="fa fa-trophy text-warning me-1"></i>Seleccione Torneo:
                                </label>
                                <select id="cboFiltroTorneo" class="form-select form-select-lg bg-light border-0 shadow-none cursor-pointer">
                                </select>
                            </div>

                            <!-- Columna 2: Categoría -->
                            <div class="col-md-4">
                                <label class="form-label fw-bold text-dark mb-2" for="cboFiltroCategoria">
                                    <i class="fa fa-layer-group text-info me-1"></i>Seleccione Categoría:
                                </label>
                                <select id="cboFiltroCategoria" class="form-select form-select-lg bg-light border-0 shadow-none cursor-pointer">
                                </select>
                            </div>

                            <!-- Columna 3: Fase -->
                            <div class="col-md-4">
                                <label class="form-label fw-bold text-dark mb-2" for="cboFiltroFase">
                                    <i class="fa fa-list-ol text-success me-1"></i>Seleccione Fase:
                                </label>
                                <select id="cboFiltroFase" class="form-select form-select-lg bg-light border-0 shadow-none cursor-pointer">
                                </select>
                            </div>

                        </div>
                    </div>

                    <!-- Sección 3: Tabla de Resultados -->
                    <div class="p-4 bg-white">
                        <!-- Contenedor Flex: El título se queda a la izquierda, el botón se va a la derecha -->
                        <div class="d-flex align-items-center justify-content-between mb-3">
                            <h6 class="text-dark fw-bold mb-0">
                                <i class="fa fa-table text-muted me-2"></i>Resultados de la Búsqueda
                            </h6>

                            <button id="btnReporte" type="button" class="btn btn-sm btn-primary fw-bold shadow-sm">
                                <i class="fa fa-file-alt me-1"></i>Generar Reporte
                            </button>
                        </div>

                        <div class="table-responsive">
                            <table id="tbPartidos" width="100%" class="table table-hover table-bordered align-middle text-nowrap text-center mb-0">
                                <!-- Cabecera de tabla oscura para mayor contraste -->
                                <thead>
                                    <tr>
                                        <th>Fecha / Hora</th>
                                        <th>Fase</th>
                                        <th>Equipos Deudores</th>
                                        <th>Condicion</th>
                                        <th>Cancha</th>
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
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="js/ControlPagoArbitraje.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
