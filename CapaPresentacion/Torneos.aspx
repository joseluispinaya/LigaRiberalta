<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="Torneos.aspx.cs" Inherits="CapaPresentacion.Torneos" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="assets/plugins/bootstrap-datepicker/dist/css/bootstrap-datepicker.css" rel="stylesheet" />
    <link href="assets/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <h1 class="page-header">TORNEOS <small>Modulo de Creacion...</small></h1>
    <div class="row">
        <div class="col-xl-4 col-lg-5 mb-3">
            <div class="panel panel-inverse">
                <div class="panel-heading">
                    <h4 class="panel-title"><i class="fa fa-info-circle me-1"></i>Guía de Torneos</h4>
                    <div class="panel-heading-btn">
                        <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
                        <a href="javascript:;" class="btn btn-xs btn-icon btn-warning" data-toggle="panel-collapse"><i class="fa fa-minus"></i></a>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="alert alert-success alert-dismissible fade show mb-4 rounded-3 shadow-sm border-0">
                        <div class="d-flex align-items-center mb-2">
                            <div class="w-40px h-40px bg-success bg-opacity-25 d-flex align-items-center justify-content-center rounded-3 fs-20px text-success me-3">
                                <i class="fa fa-trophy"></i>
                            </div>
                            <h5 class="mb-0">Gestión de Campeonatos</h5>
                        </div>
                        <p class="mb-0 fs-13px">
                            Crea los eventos deportivos principales. Recuerda que un torneo engloba todas las categorías y define las reglas de puntuación para toda la gestión.
                        </p>
                    </div>

                    <div>
                        <h6 class="mb-3 text-body"><i class="fa fa-star text-warning me-2"></i>Sistema de Puntos Especial:</h6>
                        <div class="d-flex mb-3">
                            <div class="w-30px text-center text-primary fs-16px me-2"><i class="fa fa-house"></i></div>
                            <div class="text-gray-600 fs-13px">
                                <b class="text-body">Local:</b> Por defecto, las victorias suman 3 puntos y los empates 1 punto.
                            </div>
                        </div>
                        <div class="d-flex mb-3">
                            <div class="w-30px text-center text-danger fs-16px me-2"><i class="fa fa-plane"></i></div>
                            <div class="text-gray-600 fs-13px">
                                <b class="text-body">Visitante:</b> La victoria de visita tiene una bonificación configurada por defecto a 4 puntos y el empate a 2.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-8 col-lg-7">
            <div class="panel panel-inverse">
                <div class="panel-heading">
                    <h4 class="panel-title">Directorio de Torneos</h4>
                    <div class="panel-heading-btn">
                        <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
                        <a href="javascript:;" class="btn btn-xs btn-icon btn-warning" data-toggle="panel-collapse"><i class="fa fa-minus"></i></a>
                    </div>
                </div>

                <div class="panel-body">
                    <div class="d-flex align-items-center mb-4 border-bottom pb-3">
                        <div class="w-40px h-40px d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-3 me-3 fs-20px">
                            <i class="fa fa-medal"></i>
                        </div>

                        <div class="flex-fill">
                            <h5 class="mb-1">Administración de Torneos</h5>
                            <p class="mb-0 text-gray-500 fs-13px">
                                Lista de campeonatos y gestiones registradas.
                            </p>
                        </div>

                        <div class="ms-3">
                            <button id="btnNuevore" type="button" class="btn btn-success btn-sm px-3 fw-bold rounded-pill shadow-sm d-flex align-items-center">
                                <i class="fa fa-plus me-1"></i>Nuevo Registro
                            </button>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table id="tbData" width="100%" class="table table-striped table-bordered align-middle text-nowrap">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Torneo</th>
                                    <th>Config. Puntos</th>
                                    <th class="text-center">Estado</th>
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

    <div class="modal fade" id="modalAdd" tabindex="-1" role="dialog" data-bs-backdrop="static">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-inverse text-white">
                    <h4 class="modal-title" id="modalLabeldetalle">Nuevo Torneo</h4>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-hidden="true"></button>
                </div>
                <div class="modal-body">

                    <h6 class="text-indigo mb-3 border-bottom pb-2"><i class="fa fa-info-circle me-2"></i>Datos del Campeonato</h6>
                    <div class="row mb-3">
                        <div class="col-md-8">
                            <label class="form-label fw-bold" for="txtNombreTorneo">Nombre del Torneo:</label>
                            <div class="input-group input-group-sm mb-3">
                                <span class="input-group-text"><i class="fa fa-trophy"></i></span>
                                <input type="text" class="form-control" id="txtNombreTorneo" placeholder="Ej: Torneo Clausura Riberalta" autocomplete="off" />
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-bold" for="txtGestion">Gestión (Año):</label>
                            <div class="input-group input-group-sm mb-3">
                                <span class="input-group-text"><i class="fa fa-calendar-check"></i></span>
                                <input type="number" class="form-control text-center" id="txtGestion" min="2020" max="2050" step="1" />
                            </div>
                        </div>
                    </div>

                    <h6 class="text-warning mb-3 border-bottom pb-2 mt-2"><i class="fa fa-star me-2"></i>Configuración de Puntos</h6>

                    <div class="row">
                        <div class="col-md-6">
                            <label class="form-label" for="txtPtsVicLocal">Pts. Victoria (Local):</label>
                            <div class="input-group input-group-sm mb-3">
                                <span class="input-group-text bg-light"><i class="fa fa-arrow-up text-success"></i></span>
                                <input type="number" class="form-control text-center" id="txtPtsVicLocal" value="3" min="0" />
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label" for="txtPtsVicVisita">Pts. Victoria (Visitante):</label>
                            <div class="input-group input-group-sm mb-3">
                                <span class="input-group-text bg-light"><i class="fa fa-arrow-up text-primary"></i></span>
                                <input type="number" class="form-control text-center" id="txtPtsVicVisita" value="4" min="0" />
                            </div>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label" for="txtPtsEmpLocal">Pts. Empate (Local):</label>
                            <div class="input-group input-group-sm mb-3">
                                <span class="input-group-text bg-light"><i class="fa fa-minus text-secondary"></i></span>
                                <input type="number" class="form-control text-center" id="txtPtsEmpLocal" value="1" min="0" />
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label" for="txtPtsEmpVisita">Pts. Empate (Visitante):</label>
                            <div class="input-group input-group-sm mb-3">
                                <span class="input-group-text bg-light"><i class="fa fa-minus text-secondary"></i></span>
                                <input type="number" class="form-control text-center" id="txtPtsEmpVisita" value="2" min="0" />
                            </div>
                        </div>
                    </div>

                    <div class="row mt-2">
                        <div class="col-md-6">
                            <label class="form-label fw-bold" for="cboEstado">Estado del Torneo:</label>
                            <div class="input-group input-group-sm mb-3">
                                <span class="input-group-text"><i class="fas fa-plug"></i></span>
                                <select class="form-select" id="cboEstado">
                                    <option value="1">Activo</option>
                                    <option value="0">Finalizado</option>
                                </select>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="modal-footer bg-light">
                    <button type="button" class="btn btn-sm btn-danger" data-bs-dismiss="modal">Cancelar</button>
                    <button id="btnGuardarReg" type="button" class="btn btn-sm btn-lime px-4">Guardar Cambios</button>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="assets/plugins/bootstrap-datepicker/dist/js/bootstrap-datepicker.js"></script>

    <script src="assets/plugins/bootstrap-datepicker/dist/locales/bootstrap-datepicker.es.min.js"></script>
    <script src="assets/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js"></script>
    <script src="js/Torneos.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
