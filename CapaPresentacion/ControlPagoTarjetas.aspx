<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="ControlPagoTarjetas.aspx.cs" Inherits="CapaPresentacion.ControlPagoTarjetas" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <h1 class="page-header">CONTROL FINANCIERO <small>Sanciones por Tarjetas</small></h1>

    <div class="row">
        <!-- ======================================================== -->
        <!-- COLUMNA IZQUIERDA: Imagen y Filtros -->
        <!-- ======================================================== -->
        <div class="col-xl-4 col-lg-5 mb-3">
            <div class="panel panel-inverse shadow-sm border-0">
                <div class="panel-heading bg-dark text-white">
                    <h4 class="panel-title"><i class="fa fa-filter me-1"></i>Filtros de Búsqueda</h4>
                </div>
                <div class="panel-body bg-light bg-opacity-50 p-4">

                    <!-- IMAGEN PROMOCIONAL / ILUSTRATIVA -->
                    <!-- CORRECCIÓN: Reducimos max-height, agregamos max-width y object-fit: contain -->
                    <div class="text-center mb-4">
                        <img src="img/logoPagos.jpg" alt="Control de Sanciones" class="img-fluid rounded-4 shadow-sm border border-3 border-white" style="max-height: 150px; max-width: 85%; object-fit: cover;">
                    </div>

                    <!-- INFO DE AYUDA -->
                    <div class="alert alert-danger alert-dismissible fade show mb-4 rounded-3 shadow-sm border-0 bg-danger bg-opacity-10 text-danger p-3">
                        <div class="d-flex align-items-center">
                            <!-- CORRECCIÓN: Agregamos flex-shrink-0 y forzamos el width/height fijo -->
                            <div class="bg-danger text-white d-flex align-items-center justify-content-center rounded-circle fs-20px me-3 shadow-sm flex-shrink-0" style="width: 40px; height: 40px;">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <p class="mb-0 fs-13px fw-semibold">
                                Seleccione los parámetros. Al elegir la <strong>Fase</strong>, la tabla mostrará los equipos deudores.
                            </p>
                        </div>
                    </div>

                    <!-- SELECT: TORNEO -->
                    <div class="mb-3">
                        <label class="form-label fw-bold text-dark" for="cboFiltroTorneo">
                            <i class="fa fa-trophy text-warning me-1"></i>Torneo:
                        </label>
                        <select id="cboFiltroTorneo" class="form-select form-select-lg shadow-sm border-0 cursor-pointer">
                            <option value="">Cargando...</option>
                        </select>
                    </div>

                    <!-- SELECT: CATEGORÍA -->
                    <div class="mb-3">
                        <label class="form-label fw-bold text-dark" for="cboFiltroCategoria">
                            <i class="fa fa-layer-group text-info me-1"></i>Categoría:
                        </label>
                        <select id="cboFiltroCategoria" class="form-select form-select-lg shadow-sm border-0 cursor-pointer">
                            <option value="">Cargando...</option>
                        </select>
                    </div>

                    <!-- SELECT: FASE -->
                    <div class="mb-2">
                        <label class="form-label fw-bold text-dark" for="cboFiltroFase">
                            <i class="fa fa-list-ol text-success me-1"></i>Fase:
                        </label>
                        <select id="cboFiltroFase" class="form-select form-select-lg shadow-sm border-0 cursor-pointer">
                            <option value="">Cargando...</option>
                        </select>
                    </div>

                </div>
            </div>
        </div>

        <!-- ======================================================== -->
        <!-- COLUMNA DERECHA: Tabla de Resultados -->
        <!-- ======================================================== -->
        <div class="col-xl-8 col-lg-7">
            <div class="panel panel-inverse shadow-sm border-0">
                <div class="panel-heading bg-dark text-white d-flex justify-content-between align-items-center">
                    <h4 class="panel-title"><i class="fas fa-hand-holding-dollar me-1"></i>Equipos con Sanciones Pendientes</h4>
                </div>

                <div class="panel-body">

                    <!-- ENCABEZADO Y BOTÓN REPORTE -->
                    <div class="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                        <div class="d-flex align-items-center">
                            <div class="w-40px h-40px d-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger rounded-3 me-3 fs-20px">
                                <i class="fas fa-receipt"></i>
                            </div>
                            <div>
                                <h5 class="mb-1 fw-bold text-dark">Multas por Tarjetas Amarillas/Rojas</h5>
                                <p class="mb-0 text-muted fs-13px">Listado de clubes que deben pagar sanciones económicas.</p>
                            </div>
                        </div>

                        <div>
                            <button id="btnReporte" type="button" class="btn btn-danger btn-sm px-3 fw-bold rounded-pill shadow-sm d-flex align-items-center">
                                <i class="fa fa-file-pdf me-1"></i>Generar Reporte
                            </button>
                        </div>
                    </div>

                    <!-- DATATABLE -->
                    <div class="table-responsive">
                        <table id="tbDeudoresTarjetas" width="100%" class="table table-hover table-striped table-bordered align-middle text-nowrap text-center mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th>Fecha / Hora</th>
                                    <th>Club (Fase)</th>
                                    <th>Deuda (Sanciones)</th>
                                    <th>Opciones</th>
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
    </div>

    <div class="modal fade" id="mdDetalleSanciones" tabindex="-1" aria-labelledby="modalSancionesLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">

                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title fw-bold" id="modalSancionesLabel">
                        <i class="fa fa-list-alt me-2"></i>Detalle de Jugadores Sancionados
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body bg-light p-4">

                    <!-- CABECERA DINÁMICA DEL CLUB (Se llena con JS al abrir el modal) -->
                    <div class="d-flex align-items-center justify-content-between mb-4 bg-white p-3 rounded-3 shadow-sm border-start border-4 border-indigo">
                        <div class="d-flex align-items-center">
                            <img id="imgModalLogoClub" src="Logos/sinLogo.png" width="50" height="50" class="rounded-circle border shadow-sm me-3" style="object-fit: contain;">
                            <div>
                                <h5 class="mb-1 fw-bold text-dark" id="lblModalNombreClub">Nombre del Club</h5>
                                <div class="fs-13px text-muted"><i class="fa fa-trophy text-warning me-1"></i><span id="lblModalFase">Fase</span></div>
                            </div>
                        </div>
                        <div class="text-end">
                            <div class="fs-12px text-muted text-uppercase fw-bold mb-1">Deuda Total</div>
                            <h4 class="mb-0 text-danger fw-bold" id="lblModalDeudaTotal">Bs 0.00</h4>
                        </div>
                    </div>

                    <!-- TABLA DE JUGADORES SANCIONADOS -->
                    <div class="table-responsive shadow-sm rounded-3">
                        <table id="tbJugadoresSancionados" class="table table-hover table-striped table-bordered text-center align-middle bg-white w-100 mb-0">
                            <thead>
                                <tr>
                                    <th class="text-start">Jugador / Dorsal</th>
                                    <th>Min. Falta</th>
                                    <th>Monto Multa</th>
                                    <th>Opción</th>
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
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="js/ControlPagoTarjetas.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
