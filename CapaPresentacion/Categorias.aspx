<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="Categorias.aspx.cs" Inherits="CapaPresentacion.Categorias" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <h1 class="page-header">CATEGORIAS <small>Modulo para Categorias...</small></h1>

    <div class="row">
        <div class="col-xl-4 col-lg-5 mb-3">
            <div class="panel panel-inverse">
                <div class="panel-heading">
                    <h4 class="panel-title"><i class="fa fa-info-circle me-1"></i>Guía de Administración</h4>
                    <div class="panel-heading-btn">
                        <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
                        <a href="javascript:;" class="btn btn-xs btn-icon btn-warning" data-toggle="panel-collapse"><i class="fa fa-minus"></i></a>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="alert alert-blue alert-dismissible fade show mb-4 rounded-3 shadow-sm">
                        <div class="d-flex align-items-center mb-2">
                            <div class="w-40px h-40px bg-white bg-opacity-25 d-flex align-items-center justify-content-center rounded-3 fs-20px text-white me-3">
                                <i class="fa fa-lightbulb"></i>
                            </div>
                            <h5 class="mb-0 text-white">Directorio Oficial</h5>
                        </div>
                        <p class="mb-0 text-white text-opacity-80 fs-13px">
                            Gestione las categorias deportivas afiliadas a la asociación. Un club debe estar registrado y <b>Activo</b> para poder inscribir equipos y jugadores en los torneos.
                        </p>
                    </div>

                    <div>
                        <h6 class="mb-3 text-body"><i class="fa fa-check-circle text-success me-2"></i>Consideraciones Importantes:</h6>
                        <div class="d-flex mb-3">
                            <div class="w-30px text-center text-primary fs-16px me-2"><i class="fa fa-image"></i></div>
                            <div class="text-gray-500 fs-13px">
                                Se recomienda que el <b>Logo de la Categoria</b> tenga formato PNG con fondo transparente para un mejor diseño en las tablas.
                            </div>
                        </div>
                        <div class="d-flex mb-3">
                            <div class="w-30px text-center text-warning fs-16px me-2"><i class="fa fa-calendar-alt"></i></div>
                            <div class="text-gray-500 fs-13px">
                                La <b>Fecha de Fundación</b> es útil para mostrar aniversarios en el panel principal del sistema.
                            </div>
                        </div>
                        <div class="d-flex">
                            <div class="w-30px text-center text-danger fs-16px me-2"><i class="fa fa-ban"></i></div>
                            <div class="text-gray-500 fs-13px">
                                Si cambia el estado de una categoria a <b>Inactivo</b>, sus jugadores no podrán participar en la gestión actual.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-8 col-lg-7">
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
                                Lista completa de categorias disponibles en la asociación.
                            </p>
                        </div>

                        <div class="ms-3">
                            <button id="btnNuevoReg" type="button" class="btn btn-indigo btn-sm px-3 fw-bold rounded-pill shadow-sm d-flex align-items-center">
                                <i class="fa fa-plus me-1"></i>Nuevo Registro
                            </button>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table id="tbData" width="100%" class="table table-striped table-bordered align-middle text-nowrap">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Categoria</th>
                                    <th>Estado</th>
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
                                <option value="1">Varones</option>
                                <option value="0">Damas</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <%--<label class="form-label" for="txtEdad">Edad Maxima</label>--%>
                        <div class="input-group input-group-sm mb-3">
                            <span class="input-group-text input-group-addon"><i class="fa fa-calendar me-2"></i>Edad Maxima</span>
                            <input type="number" class="form-control" id="txtEdad" />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <%--<label class="form-label" for="cboEstado">Estado</label>--%>
                        <div class="input-group input-group-sm mb-3">
                            <span class="input-group-text"><i class="fas fa-plug me-2"></i>Estado</span>
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
                <button id="btnGuardarCambios" type="button" class="btn btn-sm btn-lime">Guardar Cambios</button>
            </div>
        </div>
    </div>
</div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="js/Categorias.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>

</asp:Content>
