<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="Clubes.aspx.cs" Inherits="CapaPresentacion.Clubes" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="assets/plugins/bootstrap-datepicker/dist/css/bootstrap-datepicker.css" rel="stylesheet" />
    <link href="assets/css/mifileinp.css" rel="stylesheet"/>
    <style>
        .logo-club {
            width: 120px;
            height: 120px;
            /* border-radius: 50%; */
            object-fit: contain; /* EL CAMBIO MÁGICO: Evita recortes */
            object-position: center; /* Centra el logo en la caja */
            /* Opcional pero recomendado para logos: un fondito muy tenue */
            background-color: #f8f9fa;
            padding: 5px;
            border-radius: 8px; /* Un ligero borde redondeado a la caja */
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <h1 class="page-header">CLUBES <small>Modulo para Clubes...</small></h1>

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
                            <div class="w-40px h-40px bg-warning bg-opacity-25 d-flex align-items-center justify-content-center rounded-3 fs-20px me-3">
                                <i class="fa fa-lightbulb"></i>
                            </div>
                            <h5 class="mb-0">Directorio Oficial</h5>
                        </div>
                        <p class="mb-0 text-opacity-80 fs-13px">
                            Gestione las instituciones deportivas afiliadas a la asociación. Un club debe estar registrado y <b>Activo</b> para poder inscribir equipos y jugadores en los torneos.
                        </p>
                    </div>

                    <div>
                        <h6 class="mb-3 text-body"><i class="fa fa-check-circle text-success me-2"></i>Consideraciones Importantes:</h6>
                        <div class="d-flex mb-3">
                            <div class="w-30px text-center text-primary fs-16px me-2"><i class="fa fa-image"></i></div>
                            <div class="text-gray-600 fs-13px">
                                Se recomienda que el <b>Logo del Club</b> tenga formato PNG con fondo transparente para un mejor diseño en las tablas.
                            </div>
                        </div>
                        <div class="d-flex mb-3">
                            <div class="w-30px text-center text-warning fs-16px me-2"><i class="fa fa-calendar-alt"></i></div>
                            <div class="text-gray-600 fs-13px">
                                La <b>Fecha de Fundación</b> es útil para mostrar aniversarios en el panel principal del sistema.
                            </div>
                        </div>
                        <div class="d-flex">
                            <div class="w-30px text-center text-danger fs-16px me-2"><i class="fa fa-ban"></i></div>
                            <div class="text-gray-600 fs-13px">
                                Si cambia el estado de un club a <b>Inactivo</b>, sus jugadores no podrán participar en la gestión actual.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-8 col-lg-7">
            <div class="panel panel-inverse">
                <div class="panel-heading">
                    <h4 class="panel-title">Directorio de Clubes</h4>
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
                            <h5 class="mb-1">Administración de Clubes</h5>
                            <p class="mb-0 text-gray-500 fs-13px">
                                Lista completa de clubes inscritos en la asociación.
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
                                    <th>Club</th>
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
                        <div class="col-md-8">
                            <div class="mb-3">
                                <label class="form-label" for="txtNombreClub">Nombre del Club</label>
                                <input class="form-control form-control-sm" type="text" id="txtNombreClub" placeholder="Nombre" name="Nombre" />
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <label class="form-label" for="txtFecha">Fundacion</label>
                                    <div class="input-group input-group-sm mb-3">
                                        <span class="input-group-text input-group-addon"><i class="fa fa-calendar"></i></span>
                                        <input type="text" class="form-control" id="txtFecha" readonly style="cursor: pointer;" />
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
                            <%--<div class="mt-1">
                                <input class="form-control form-control-sm" type="file" id="txtFotoOri" accept="image/*" />
                            </div>--%>

                            <div class="mt-1">
                                <input type="file" id="txtFoto" accept="image/*" class="d-none" />

                                <div class="input-group input-group-sm">
                                    <label class="input-group-text custom-file-button" for="txtFoto">
                                        <i class="fas fa-image me-2"></i>Seleccionar
                                    </label>

                                    <input type="text" class="form-control custom-file-text" id="txtFotoName" placeholder="Ningún arc... seleccionado" readonly onclick="document.getElementById('txtFoto').click();" />
                                </div>
                            </div>

                        </div>
                        <div class="col-md-4">
                            <div class="mb-2 text-center">
                                <p class="mb-0">Logo del Club</p>
                            </div>
                            <div class="mb-1 text-center">
                                <img id="imgLogo" src="Logos/sinLogo.png" alt="Foto est" class="logo-club">
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
    <script src="assets/plugins/bootstrap-datepicker/dist/js/bootstrap-datepicker.js"></script>

    <script src="assets/plugins/bootstrap-datepicker/dist/locales/bootstrap-datepicker.es.min.js"></script>
    <script src="js/Clubes.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
