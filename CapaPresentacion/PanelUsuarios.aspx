<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="PanelUsuarios.aspx.cs" Inherits="CapaPresentacion.PanelUsuarios" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <h1 class="page-header">Gestión de Usuarios <small>Panel de Administración</small></h1>

<div class="row">
    <div class="col-xl-12">
        <div class="panel panel-inverse shadow-sm border-0">
            
            <!-- PANEL HEADING -->
            <div class="panel-heading bg-dark text-white d-flex justify-content-between align-items-center">
                <h4 class="panel-title"><i class="fa fa-users me-2"></i>Lista de Usuarios Registrados</h4>
                
                <!-- BOTÓN NUEVO REGISTRO -->
                <button type="button" class="btn btn-lime btn-sm fw-bold shadow-sm" id="btnNuevoUsuario" data-bs-toggle="modal" data-bs-target="#mdUsuario">
                    <i class="fa fa-plus me-1"></i>Nuevo Usuario
                </button>
            </div>

            <!-- PANEL BODY (TABLA) -->
            <div class="panel-body">
                <div class="table-responsive">
                    <table id="tbUsuarios" width="100%" class="table table-hover table-striped table-bordered align-middle text-nowrap text-center mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Foto</th>
                                <th>Nro. CI</th>
                                <th>Usuario</th>
                                <th>Contacto</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Llenado dinámicamente con JS -->
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>
</div>

<!-- ======================================================== -->
<!-- MODAL: REGISTRO Y EDICIÓN DE USUARIO -->
<!-- ======================================================== -->
<div class="modal fade" id="mdUsuario" tabindex="-1" aria-labelledby="modalUsuarioLabel" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
            
            <div class="modal-header bg-dark text-white">
                <h5 class="modal-title fw-bold" id="modalUsuarioLabel">
                    <i class="fa fa-user-edit me-2"></i><span id="lblTituloModal">Nuevo Usuario</span>
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <div class="modal-body bg-light p-4">

                <div class="row">
                    <!-- COLUMNA IZQUIERDA: Datos Personales -->
                    <div class="col-md-8">

                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-dark">Nro. CI <span class="text-danger">*</span></label>
                                <div class="input-group">
                                    <span class="input-group-text bg-white"><i class="fa fa-id-card text-muted"></i></span>
                                    <input type="text" class="form-control model" name="Nro CI" id="txtNroCi" placeholder="Ej: 12345678" maxlength="10">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-dark">Rol del Sistema <span class="text-danger">*</span></label>
                                <select class="form-select" id="cboRol">
                                    <option value="">Seleccione...</option>
                                    <!-- Llenar con JS -->
                                </select>
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-dark">Nombres <span class="text-danger">*</span></label>
                                <input type="text" class="form-control model" id="txtNombres" name="Nombres" placeholder="Nombres del usuario" maxlength="50">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-dark">Apellidos <span class="text-danger">*</span></label>
                                <input type="text" class="form-control model" id="txtApellidos" name="Apellidos" placeholder="Apellidos del usuario" maxlength="50">
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-dark">Celular <span class="text-danger">*</span></label>
                                <div class="input-group">
                                    <span class="input-group-text bg-white"><i class="fa fa-mobile-alt text-muted"></i></span>
                                    <input type="text" class="form-control model" name="Celular" id="txtCelular" placeholder="Ej: 71234567" maxlength="10">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-dark">Correo Electrónico <span class="text-danger">*</span></label>
                                <div class="input-group">
                                    <span class="input-group-text bg-white"><i class="fa fa-envelope text-muted"></i></span>
                                    <input type="email" class="form-control model" name="Correo" id="txtCorreo" placeholder="correo@ejemplo.com" maxlength="100">
                                </div>
                            </div>
                        </div>

                        <!-- Nota sobre la contraseña -->
                        <div class="alert alert-info py-2 px-3 mb-0 border-0 shadow-sm fs-12px">
                            <i class="fa fa-info-circle me-1"></i>La contraseña inicial por defecto será el <strong>Nro. de CI</strong> del usuario.
                        </div>

                    </div>

                    <!-- COLUMNA DERECHA: Fotografía -->
                    <div class="col-md-4 d-flex flex-column align-items-center justify-content-center border-start">
                        <label class="form-label fw-bold text-dark text-center w-100">Fotografía</label>

                        <!-- Contenedor del Preview -->
                        <div class="mb-3 text-center">
                            <img id="imgPreview" src="Imagen/sinimagen.png" alt="Vista Previa" class="rounded-circle border shadow-sm" style="width: 140px; height: 140px; object-fit: cover; background-color: #fff;">
                        </div>

                        <!-- Input File Oculto (Se activa con el botón) -->
                        <input type="file" id="fileFoto" class="d-none" accept="image/png, image/jpeg, image/jpg">

                        <button type="button" class="btn btn-secondary btn-sm w-100 shadow-sm" onclick="document.getElementById('fileFoto').click();">
                            <i class="fa fa-camera me-1"></i>Seleccionar Imagen
                        </button>
                        <small class="text-muted fs-11px mt-2 text-center">Max 2MB. Formatos: JPG, PNG.</small>
                    </div>
                </div>
            </div>
            
            <div class="modal-footer bg-white">
                <button type="button" class="btn btn-danger shadow-sm" data-bs-dismiss="modal">
                    <i class="fa fa-times me-1"></i>Cancelar
                </button>
                <button type="button" class="btn btn-indigo shadow-sm fw-bold" id="btnGuardarUsuario">
                    <i class="fa fa-save me-1"></i>Guardar Usuario
                </button>
            </div>

        </div>
    </div>
</div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="js/PanelUsuarios.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
