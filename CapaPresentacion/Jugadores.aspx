<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="Jugadores.aspx.cs" Inherits="CapaPresentacion.Jugadores" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="assets/plugins/bootstrap-datepicker/dist/css/bootstrap-datepicker.css" rel="stylesheet" />
    <link href="assets/plugins/select2ori/dist/css/select2.min.css" rel="stylesheet" />
    <link href="assets/css/mifileinp.css" rel="stylesheet"/>
    <style>
        .est-perfil {
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
    <h1 class="page-header">JUGADORES <small>Modulo para Jugadores...</small></h1>

    <div class="row">
        <div class="col-xl-12">
            <div class="panel panel-inverse">
                <div class="panel-heading">
                    <h4 class="panel-title">Directorio de Jugadores</h4>
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
                            <h5 class="mb-1">Administración de Jugadores</h5>
                            <p class="mb-0 text-gray-500 fs-13px">
                                Gestiona los jugadores por clubes para torneos deportivos
                            </p>
                        </div>

                        <div class="input-group input-group-sm ms-3" style="max-width: 280px;">
                            <span class="input-group-text"><i class="fa fa-shield-halved text-indigo me-1"></i>Club</span>
                            <select class="form-select" id="cboClubFiltro">
                            </select>
                        </div>

                        <div class="ms-3">
                            <button id="btnNuevoReg" type="button" class="btn btn-success btn-sm px-3 fw-bold rounded-pill shadow-sm d-flex align-items-center">
                                <i class="fa fa-plus me-1"></i>Nuevo Registro
                            </button>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table id="tbData" width="100%" class="table table-striped table-bordered align-middle text-nowrap">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Jugador</th>
                                    <th>Demografía</th>
                                    <th>Nro CI</th>
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

    <div class="modal fade" id="modalAdd" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="modalLabeldetalle">Jugadores</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-hidden="true"></button>
                </div>
                <div class="modal-body">

                    <div class="row">
                        <div class="col-md-8">

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="txtNombres">Nombres</label>
                                    <input class="form-control form-control-sm model" type="text" id="txtNombres" placeholder="Nombres" name="Nombres" />
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="txtApellidos">Apellidos</label>
                                    <input class="form-control form-control-sm model" type="text" id="txtApellidos" placeholder="Apellidos" name="Apellidos" />
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-4">
                                    <label class="form-label" for="txtFechaNacido">Nacido el:</label>
                                    <div class="input-group input-group-sm mb-3">
                                        <span class="input-group-text input-group-addon"><i class="fa fa-calendar"></i></span>
                                        <input type="text" class="form-control text-center" id="txtFechaNacido" readonly style="cursor: pointer;" />
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label" for="txtCI">Nro CI:</label>
                                    <div class="input-group input-group-sm mb-3">
                                        <span class="input-group-text input-group-addon"><i class="fa fa-id-card"></i></span>
                                        <input type="text" class="form-control model" id="txtCI" name="Nro CI" />
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label" for="txtCredencial">Credencial:</label>
                                    <div class="input-group input-group-sm mb-3">
                                        <span class="input-group-text input-group-addon"><i class="fa fa-id-card"></i></span>
                                        <input type="text" class="form-control model" id="txtCredencial" name="Credencial" />
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-4">
                                    <label class="form-label" for="cboGenero">Genero</label>
                                    <div class="input-group mb-3">
                                        <span class="input-group-text"><i class="fas fa-futbol"></i></span>
                                        <select class="form-select" id="cboGenero">
                                            <option value="1">Masculino</option>
                                            <option value="0">Femenino</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-8">
                                    <div class="mb-3">
                                        <label class="form-label" for="cboClub">Seleccione Club</label>
                                        <select class="form-select form-select-sm" id="cboClub">
                                        </select>
                                    </div>
                                </div>
                            </div>


                            <%--<div class="row">
                                <div class="col-md-4">
                                    <div class="input-group input-group-sm mb-3">
                                        <span class="input-group-text"><i class="fas fa-futbol"></i></span>
                                        <select class="form-select" id="cboGenero">
                                            <option value="1">Masculino</option>
                                            <option value="0">Femenino</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-8">
                                    <input type="file" id="txtFoto" accept="image/*" class="d-none" />

                                    <div class="input-group input-group-sm">
                                        <label class="input-group-text custom-file-button" for="txtFoto">
                                            <i class="fas fa-image me-2"></i>Seleccionar
                                        </label>

                                        <input type="text" class="form-control custom-file-text" id="txtFotoName" placeholder="Ningún arc... seleccionado" readonly onclick="document.getElementById('txtFoto').click();" />
                                    </div>
                                </div>
                            </div>--%>

                            

                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <input type="file" id="txtFoto" accept="image/*" class="d-none" />

                                <div class="input-group input-group-sm">
                                    <label class="input-group-text custom-file-button" for="txtFoto">
                                        <i class="fas fa-image me-2"></i>Foto
                                    </label>

                                    <input type="text" class="form-control custom-file-text" id="txtFotoName" placeholder="Ningún arc... seleccionado" readonly onclick="document.getElementById('txtFoto').click();" />
                                </div>
                            </div>
                            <div class="mb-2 text-center">
                                <p class="mb-0">Imagen del Jugador</p>
                            </div>
                            <div class="mb-1 text-center">
                                <img id="imgJugador" src="Imagen/sinimagen.png" alt="Foto est" class="est-perfil">
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
    <script src="assets/plugins/select2ori/dist/js/select2.min.js"></script>
    <script src="js/Jugadores.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
