<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="ControlInscripciones.aspx.cs" Inherits="CapaPresentacion.ControlInscripciones" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <h1 class="page-header">CONTROL DE PAGOS <small>Inscripción de Clubes</small></h1>

    <div class="row">
        <div class="col-xl-4 col-lg-5 mb-3">
            <div class="panel panel-inverse">
                <div class="panel-heading">
                    <h4 class="panel-title"><i class="fa fa-info-circle me-1"></i>Guía de Administración</h4>
                </div>
                <div class="panel-body">
                    <div class="alert alert-blue alert-dismissible fade show mb-4 rounded-3 shadow-sm">
                        <div class="d-flex align-items-center mb-2">
                            <div class="w-40px h-40px bg-warning bg-opacity-25 d-flex align-items-center justify-content-center rounded-3 fs-20px me-3">
                                <i class="fa fa-lightbulb"></i>
                            </div>
                            <h5 class="mb-0">Pagos de Inscripción</h5>
                        </div>
                        <p class="mb-0 text-opacity-80 fs-13px">
                            Gestione los pagos de inscripción de los clubes envio de Notificaciones y control de estado de los clubes.
                        </p>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold text-dark" for="cboFiltroTorneo">
                            <i class="fa fa-trophy text-warning me-1"></i>Torneo:
                        </label>
                        <select id="cboFiltroTorneo" class="form-select"></select>
                    </div>

                    <div class="mb-4">
                        <label class="form-label fw-bold text-dark" for="cboFiltroCategoria">
                            <i class="fa fa-layer-group text-info me-1"></i>Categoría:
                        </label>
                        <select id="cboFiltroCategoria" class="form-select"></select>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-8 col-lg-7">
            <div class="panel panel-inverse">
                <div class="panel-heading">
                    <h4 class="panel-title"><i class="fas fa-hand-holding-dollar me-1"></i>Control de Pagos</h4>
                </div>

                <div class="panel-body">
                    <div class="d-flex align-items-center mb-4 border-bottom pb-3">
                        <div class="w-40px h-40px d-flex align-items-center justify-content-center bg-indigo bg-opacity-10 text-indigo rounded-3 me-3 fs-20px">
                            <i class="fa fa-shield-halved"></i>
                        </div>

                        <div class="flex-fill">
                            <h5 class="mb-1">Control Pagos de Inscripción</h5>
                            <p class="mb-0 text-gray-500 fs-13px">
                                Gestión de pagos y notificaciones para los clubes.
                            </p>
                        </div>

                        <div class="ms-3">
                            <button id="btnReporte" type="button" class="btn btn-indigo btn-sm px-3 fw-bold rounded-pill shadow-sm d-flex align-items-center">
                                <i class="fa fa-file-alt me-1"></i>Generar Reporte
                            </button>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table id="tbData" width="100%" class="table table-striped table-bordered align-middle text-nowrap">
                            <thead>
                                <tr>
                                    <th>Club Inscrito</th>
                                    <th>Inscripción</th>
                                    <th class="text-center">Opciones</th>
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
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="js/ControlInscripciones.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
