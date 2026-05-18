<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="Plantillas.aspx.cs" Inherits="CapaPresentacion.Plantillas" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <h1 class="page-header">PLANTILLAS <small>Modulo para Plantillas...</small></h1>

    <div class="row">
        <div class="col-xl-12">
            <div class="panel panel-inverse">
                <div class="panel-heading">
                    <h4 class="panel-title">Directorio de Inscripciones</h4>
                    <div class="panel-heading-btn">
                        <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
                        <a href="javascript:;" class="btn btn-xs btn-icon btn-warning" data-toggle="panel-collapse"><i class="fa fa-minus"></i></a>
                    </div>
                </div>

                <div class="panel-body">

                    <div class="d-flex align-items-center mb-4 border-bottom pb-3">
                        <div class="w-40px h-40px d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-3 me-3 fs-20px">
                            <i class="fa fa-users-cog"></i>
                        </div>

                        <div class="flex-fill">
                            <h5 class="mb-1">Plantillas de Jugadores</h5>
                            <p class="mb-0 text-gray-500 fs-13px">
                                Gestione los jugadores inscritos en los torneos, actualice su información y controle el estado de sus inscripciones.
                            </p>
                        </div>

                        <%--<div class="ms-3">
                            <button id="btnNuevaInscripcion" type="button" class="btn btn-success px-4 fw-bold rounded-pill shadow-sm">
                                <i class="fa fa-plus me-2"></i>Inscribir Jugador
                            </button>
                        </div>--%>
                    </div>

                    <div class="row mb-4 p-3 bg-secondary bg-opacity-10 rounded-3 align-items-end">
                        <div class="col-md-4 mb-3 mb-md-0">
                            <label class="form-label fw-bold" for="cboFiltroTorneo">
                                <i class="fa fa-trophy text-warning me-1"></i>Seleccione un Torneo:
                            </label>
                            <select id="cboFiltroTorneo" class="form-select form-select-sm">
                                <option value="">-- Todos los Torneos --</option>
                            </select>
                        </div>

                        <div class="col-md-3 mb-3 mb-md-0">
                            <label class="form-label fw-bold" for="cboFiltroCategoria">
                                <i class="fa fa-layer-group text-info me-1"></i>Seleccione una Categoría:
                            </label>
                            <select id="cboFiltroCategoria" class="form-select form-select-sm">
                                <option value="">-- Todas las Categorías --</option>
                            </select>
                        </div>

                        <div class="col-md-3 mb-3 mb-md-0">
                            <label class="form-label fw-bold" for="cboFiltroClub">
                                <i class="fa fa-shield-halved text-indigo me-1"></i>Seleccione Club:
                            </label>
                            <select id="cboFiltroClub" class="form-select form-select-sm">
                                <option value="">-- Todos los Clubs --</option>
                            </select>
                        </div>

                        <div class="col-md-2">
                            <button id="btnBuscarFiltro" type="button" class="btn btn-primary btn-sm w-100 fw-bold">
                                <i class="fa fa-search me-1"></i>Buscar
                            </button>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table id="tbData" width="100%" class="table table-striped table-bordered align-middle text-nowrap">
                            <thead>
                                <tr>
                                    <th>Foto</th>
                                    <th>Nombre</th>
                                    <th>Nro Ci</th>
                                    <th width="10%" class="text-center">Opciones</th>
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
    <script src="js/Plantillas.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
