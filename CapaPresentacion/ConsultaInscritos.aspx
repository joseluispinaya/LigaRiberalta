<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="ConsultaInscritos.aspx.cs" Inherits="CapaPresentacion.ConsultaInscritos" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="assets/css/cardzero.css" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <h1 class="page-header">CONSULTA INSCRIPCIONES <small>Torneo y Categoria</small></h1>

    <div class="row">
        <div class="col-xl-12">
            <div class="panel panel-inverse">
                <div class="panel-heading">
                    <h4 class="panel-title"><i class="fa fa-sitemap me-2"></i>Consultas de Equipos Inscritos</h4>
                </div>

                <div class="panel-body">

                    <div class="row px-3">
                        <div class="col-md-4">
                            <div class="alert alert-danger alert-dismissible fade show mb-2 rounded-3 shadow-sm border-0 bg-danger bg-opacity-10 text-danger p-3">
                                <div class="d-flex align-items-center">
                                    <div class="bg-danger text-white d-flex align-items-center justify-content-center rounded-circle fs-20px me-3 shadow-sm flex-shrink-0" style="width: 40px; height: 40px;">
                                        <i class="fa fa-users-cog"></i>
                                    </div>
                                    <p class="mb-0 fs-13px fw-semibold">
                                        Consulta los equipos inscritos filtrando por <strong>Torneo y Categoria</strong> correspondiente.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="row mb-2 p-3 bg-secondary bg-opacity-10 rounded-3 align-items-end">
                                <div class="col-md-5 mb-3 mb-md-0">
                                    <label class="form-label fw-bold" for="cboFiltroTorneo">
                                        <i class="fa fa-trophy text-warning me-1"></i>Seleccione Torneo:
                                    </label>
                                    <select id="cboFiltroTorneo" class="form-select form-select-sm">
                                    </select>
                                </div>

                                <div class="col-md-5 mb-3 mb-md-0">
                                    <label class="form-label fw-bold" for="cboFiltroCategoria">
                                        <i class="fa fa-layer-group text-info me-1"></i>Seleccione Categoría:
                                    </label>
                                    <select id="cboFiltroCategoria" class="form-select form-select-sm">
                                    </select>
                                </div>

                                <div class="col-md-2">
                                    <button id="btnReporte" type="button" class="btn btn-primary btn-sm w-100 fw-bold">
                                        <i class="fa fa-file-alt me-1"></i>Reporte
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-xl-12">
            <div class="panel panel-inverse">
                <div class="panel-heading">
                    <h4 class="panel-title"><i class="fa fa-sitemap me-2"></i>Lista de Equipos Inscritos</h4>
                </div>

                <div class="panel-body bg-secondary bg-opacity-10">
                    <div class="row" id="contenedorEquipos">
                        <!-- Los cards se inyectarán aquí -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="mdPlantillaEquipo" tabindex="-1" aria-labelledby="modalPlantillaLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">

                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title fw-bold" id="modalPlantillaLabel">
                        <i class="fa fa-list-alt me-2"></i>Plantilla del Equipo
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body bg-light p-4">

                    <%--<div class="d-flex align-items-center justify-content-between mb-3 bg-white p-3 rounded-3 shadow-sm border-start border-4 border-indigo">
                        <div class="d-flex align-items-center">
                            <img id="imgModalLogoClub" src="Logos/sinLogo.png" width="50" height="50" class="rounded-circle border shadow-sm me-3" style="object-fit: contain;">
                            <div>
                                <h5 class="mb-1 fw-bold text-dark" id="lblModalNombreClub">Nombre del Club</h5>
                                <div class="fs-13px text-muted"><i class="fa fa-trophy text-warning me-1"></i><span id="lblModalFase">Serie</span></div>
                            </div>
                        </div>
                        <div class="text-end">
                            <div class="fs-12px text-muted text-uppercase fw-bold mb-1">Nro Jugadores</div>
                            <h4 class="mb-0 text-danger fw-bold" id="lblModalDeudaTotal">0</h4>
                        </div>
                    </div>--%>

                    <div class="table-responsive shadow-sm rounded-3">
                        <table id="tbJugadores" class="table table-hover table-striped table-bordered text-center align-middle bg-white w-100 mb-0">
                            <thead>
                                <tr>
                                    <th>Jugador / Dorsal</th>
                                    <th>Nro. CI</th>
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

    <div class="modal fade" id="mdCuerpoTecnico" tabindex="-1" aria-labelledby="modalCuerpoTecnicoLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">

            <div class="modal-header bg-dark text-white">
                <h5 class="modal-title fw-bold" id="modalCuerpoTecnicoLabel">
                    <i class="fa fa-list-alt me-2"></i>Cuerpo Técnico del Equipo
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body bg-light p-4">

                <%--<div class="d-flex align-items-center justify-content-between mb-3 bg-white p-3 rounded-3 shadow-sm border-start border-4 border-indigo">
                    <div class="d-flex align-items-center">
                        <img id="imgModalLogoClubTec" src="Logos/sinLogo.png" width="50" height="50" class="rounded-circle border shadow-sm me-3" style="object-fit: contain;">
                        <div>
                            <h5 class="mb-1 fw-bold text-dark" id="lblModalNombreClubTec">Nombre del Club</h5>
                            <div class="fs-13px text-muted"><i class="fa fa-trophy text-warning me-1"></i><span id="lblModalTorneo">Torneo</span></div>
                        </div>
                    </div>
                    <div class="text-end">
                        <div class="fs-12px text-muted text-uppercase fw-bold mb-1">Nro Técnicos</div>
                        <h4 class="mb-0 text-danger fw-bold" id="lblModalTotalTec">0</h4>
                    </div>
                </div>--%>

                <div class="table-responsive shadow-sm rounded-3">
                    <table id="tbCuerpoTecnico" class="table table-hover table-striped table-bordered text-center align-middle bg-white w-100 mb-0">
                        <thead>
                            <tr>
                                <th>Cuerpo Técnico / Cargo</th>
                                <th>Nro. CI</th>
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
    <script src="js/ConsultaInscritos.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
