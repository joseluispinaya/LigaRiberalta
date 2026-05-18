<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="Inscripciones.aspx.cs" Inherits="CapaPresentacion.Inscripciones" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <h1 class="page-header">INSCRIPCIONES <small>Modulo para Inscripciones...</small></h1>

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
                            <h5 class="mb-1">Inscripción de Equipos</h5>
                            <p class="mb-0 text-gray-500 fs-13px">
                                Gestione los clubes participantes filtrando por el torneo y la categoría correspondiente.
                            </p>
                        </div>

                        <div class="ms-3">
                            <button id="btnNuevaInscripcion" type="button" class="btn btn-success px-4 fw-bold rounded-pill shadow-sm">
                                <i class="fa fa-plus me-2"></i>Inscribir Equipo
                            </button>
                        </div>
                    </div>

                    <div class="row mb-4 p-3 bg-secondary bg-opacity-10 rounded-3 align-items-end">
                        <div class="col-md-5 mb-3 mb-md-0">
                            <label class="form-label fw-bold" for="cboFiltroTorneo">
                                <i class="fa fa-trophy text-warning me-1"></i>Seleccione un Torneo:
                            </label>
                            <select id="cboFiltroTorneo" class="form-select form-select-sm">
                                <option value="">-- Todos los Torneos --</option>
                            </select>
                        </div>

                        <div class="col-md-5 mb-3 mb-md-0">
                            <label class="form-label fw-bold" for="cboFiltroCategoria">
                                <i class="fa fa-layer-group text-info me-1"></i>Seleccione una Categoría:
                            </label>
                            <select id="cboFiltroCategoria" class="form-select form-select-sm">
                                <option value="">-- Todas las Categorías --</option>
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
                                    <th width="5%">ID</th>
                                    <th>Club Inscrito</th>
                                    <th width="15%">Serie</th>
                                    <th width="15%" class="text-center">Penalización</th>
                                    <th width="15%" class="text-center">Pago Inscripción</th>
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

    <div class="modal fade" id="modalAdd" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="modalLabeldetalle">
                        <i class="fa fa-edit text-success me-2"></i>Inscripción de Equipo
                    </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                </div>

                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold" for="cboTorneo">
                                <i class="fa fa-trophy text-warning me-1"></i>Torneo
                            </label>
                            <select id="cboTorneo" class="form-select form-select-sm">
                                <option value="">-- Seleccione --</option>
                            </select>
                        </div>

                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold" for="cboCategoria">
                                <i class="fa fa-layer-group text-info me-1"></i>Categoría
                            </label>
                            <select id="cboCategoria" class="form-select form-select-sm">
                                <option value="">-- Seleccione --</option>
                            </select>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold" for="cboClub">
                                <i class="fa fa-shield-halved text-indigo me-1"></i>Club a Inscribir
                            </label>
                            <select id="cboClub" class="form-select form-select-sm">
                                <option value="">-- Seleccione --</option>
                            </select>
                        </div>

                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold" for="cboSerie">
                                <i class="fa fa-sitemap text-primary me-1"></i>Serie / Grupo
                            </label>
                            <select id="cboSerie" class="form-select form-select-sm">
                                <option value="">-- Seleccione --</option>
                            </select>
                        </div>
                    </div>

                    <div class="row align-items-center bg-light bg-opacity-10 rounded-3 p-2 mt-1">
                        <div class="col-md-6 mb-3 mb-md-0">
                            <label class="form-label text-danger fw-bold" for="txtPenalizacion">
                                <i class="fa fa-minus-circle me-1"></i>Pts. Penalización (Opcional)
                            </label>
                            <input type="number" id="txtPenalizacion" class="form-control form-control-sm" value="0" min="0" />
                            <small class="text-gray-500">Puntos a restar por faltas administrativas.</small>
                        </div>

                        <div class="col-md-6">
                            <div class="form-check form-switch ms-md-3">
                                <input class="form-check-input cursor-pointer" type="checkbox" id="chkPagado">
                                <label class="form-check-label fw-bold ms-2 cursor-pointer" for="chkPagado">
                                    <i class="fa fa-money-bill-wave text-success me-1"></i>Inscripción Pagada
                                </label>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="modal-footer">
                    <a href="javascript:;" class="btn btn-sm btn-danger" data-bs-dismiss="modal">
                        <i class="fa fa-times me-1"></i>Cancelar
                    </a>
                    <button id="btnGuardarReg" type="button" class="btn btn-sm btn-success px-3">
                        <i class="fa fa-save me-1"></i>Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    </div>

</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="js/Inscripciones.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>

</asp:Content>
