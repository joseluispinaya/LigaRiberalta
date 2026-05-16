<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="Categorias.aspx.cs" Inherits="CapaPresentacion.Categorias" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <h1 class="page-header">CATEGORIAS <small>Modulo para Categorias...</small></h1>

<div class="row">
    <div class="col-xl-12">
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <h4 class="panel-title">Directorio de Categorias</h4>
                <div class="panel-heading-btn">
                    <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
                    <a href="javascript:;" class="btn btn-xs btn-icon btn-warning" data-toggle="panel-collapse"><i class="fa fa-minus"></i></a>
                </div>
            </div>

            <div class="panel-body">
                <div class="d-flex align-items-center mb-4 border-bottom pb-3">
                    <div class="w-40px h-40px d-flex align-items-center justify-content-center bg-indigo bg-opacity-10 text-indigo rounded-3 me-3 fs-20px">
                        <i class="fa fa-shield-halved"></i>
                    </div>

                    <div class="flex-fill">
                        <h5 class="mb-1">Administración de Categorias</h5>
                        <p class="mb-0 text-gray-500 fs-13px">
                            Gestiona las categorias para torneos deportivos
                        </p>
                    </div>

                    <div class="ms-3">
                        <button id="btnNuevoReg" type="button" class="btn btn-indigo px-4 fw-bold rounded-pill shadow-sm">
                            <i class="fa fa-plus me-2"></i>Nuevo Registro
                        </button>
                    </div>
                </div>

                <div class="table-responsive">
                    <table id="tbData" width="100%" class="table table-striped table-bordered align-middle text-nowrap">
                        <thead>
                            <tr>
                                <th>Categoria</th>
                                <th>Genero</th>
                                <th>Estado</th>
                                <th>Edad Maxima</th>
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

<div class="modal fade" id="modalAdd" tabindex="-1" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modalLabeldetalle">Club</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
            </div>
            <div class="modal-body">

                <div class="row">
                    <div class="col-md-7">
                        <label class="form-label" for="txtNomCatego">Categoria</label>
                        <div class="input-group input-group-sm mb-3">
                            <span class="input-group-text input-group-addon"><i class="fa fa-calendar"></i></span>
                            <input type="text" class="form-control" id="txtNomCatego" />
                        </div>
                    </div>
                    <div class="col-md-5">
                        <label class="form-label" for="cboGenero">Genero</label>
                        <div class="input-group input-group-sm mb-3">
                            <span class="input-group-text"><i class="fas fa-futbol"></i></span>
                            <select class="form-select" id="cboGenero">
                                <option value="1">Masculino</option>
                                <option value="0">Femenino</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <label class="form-label" for="txtEdad">Edad Maxima</label>
                        <div class="input-group input-group-sm mb-3">
                            <span class="input-group-text input-group-addon"><i class="fa fa-calendar"></i></span>
                            <input type="number" class="form-control" id="txtEdad" />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="cboEstado">Estado</label>
                        <div class="input-group input-group-sm mb-3">
                            <span class="input-group-text"><i class="fas fa-plug"></i></span>
                            <select class="form-select" id="cboEstado">
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                        </div>
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <a href="javascript:;" class="btn btn-sm btn-danger" data-bs-dismiss="modal">Cancelar</a>
                <button id="btnGuardarReg" type="button" class="btn btn-sm btn-lime">Guardar Cambios</button>
            </div>
        </div>
    </div>
</div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="js/Categorias.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>

</asp:Content>
