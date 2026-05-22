<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="Partidos.aspx.cs" Inherits="CapaPresentacion.Partidos" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <h1 class="page-header">PARTIDOS <small>Modulo para Partidos...</small></h1>

    <div class="row">
        <div class="col-xl-4 col-lg-5 mb-3">
            <div class="panel panel-inverse">
                <div class="panel-heading">
                    <h4 class="panel-title"><i class="fa fa-filter me-1"></i>Filtros de Competición</h4>
                </div>
                <div class="panel-body bg-light bg-opacity-50">
                    <div class="alert alert-success border-0 rounded-3 mb-4 py-2 px-3 fs-13px">
                        <i class="fa fa-info-circle me-1"></i>Seleccione el torneo y la categoría para ver las series disponibles.
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

                    <button id="btnBuscarFiltro" type="button" class="btn btn-primary w-100 fw-bold shadow-sm py-2">
                        <i class="fa fa-search me-2"></i>Buscar Series
                    </button>
                </div>
            </div>
        </div>

        <div class="col-xl-8 col-lg-7">
            <div class="panel panel-inverse">
                <div class="panel-heading">
                    <h4 class="panel-title"><i class="fa fa-sitemap me-1"></i>Resumen de Series / Grupos</h4>
                </div>
                <div class="panel-body">
                    <div class="table-responsive">
                        <table id="tbData" width="100%" class="table table-striped table-bordered align-middle text-nowrap">
                            <thead>
                                <tr>
                                    <th>Series</th>
                                    <th class="text-center">Equipos</th>
                                    <th class="text-center">Partidos</th>
                                    <th class="text-center" width="10%">Opciones</th>
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
    <script src="js/Partidos.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>

</asp:Content>
