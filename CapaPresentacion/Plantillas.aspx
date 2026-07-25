<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="Plantillas.aspx.cs" Inherits="CapaPresentacion.Plantillas" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
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
    <h1 class="page-header">Gestión de Cuerpo Técnico <small>Registro y control de personal</small></h1>

    <div class="row">
        <!-- COLUMNA IZQUIERDA (3): Información del Equipo -->
        <div class="col-xl-3">
            <div class="panel panel-inverse">
                <div class="panel-heading">
                    <h4 class="panel-title">Datos del Equipo</h4>
                </div>
                <div class="panel-body text-center">
                    <!-- Tu JS usará estos IDs para inyectar los datos -->
                    <div class="mb-3 mt-2">
                        <img id="imgClubLogo" src="Logos/sinLogo.png" class="logo-club" alt="Logo Club" />
                    </div>
                    <h4 id="lblNombreClub" class="mb-1">Cargando equipo...</h4>
                    <p class="text-muted fs-13px">Torneo Actual</p>

                    <hr />
                    <!-- Campo oculto para guardar el IdEquipo que recuperaste de la URL -->
                    <input type="hidden" id="txtIdEquipo" />

                    <div class="d-grid mt-3">
                        <a href="Inscripciones.aspx" class="btn btn-default"><i class="fa fa-arrow-left me-1"></i>Volver a Inscripciones</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- COLUMNA DERECHA (9): Pestañas de Registro -->
        <div class="col-xl-9">
            <!-- CABECERA DE TABS -->
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a href="#tab-individual" data-bs-toggle="tab" class="nav-link active">
                        <i class="fa fa-user-plus me-1"></i>
                        <span class="d-none d-sm-inline">Registro Individual</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#tab-excel" data-bs-toggle="tab" class="nav-link">
                        <i class="fa fa-file-excel me-1"></i>
                        <span class="d-none d-sm-inline">Carga desde Excel</span>
                    </a>
                </li>
            </ul>

            <!-- CONTENIDO DE TABS -->
            <div class="tab-content panel rounded-0 p-3 m-0 border-top-0">

                <!-- ======================================= -->
                <!-- TAB 1: REGISTRO INDIVIDUAL Y LISTADO -->
                <!-- ======================================= -->
                <div class="tab-pane fade active show" id="tab-individual">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h4 class="m-0"><i class="fa fa-users text-theme me-2"></i>Cuerpo Técnico Inscrito</h4>
                        <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalRegistroMiembro">
                            <i class="fa fa-plus me-1"></i>Agregar Miembro
                        </button>
                    </div>

                    <!-- Tabla para DataTables -->
                    <div class="table-responsive">
                        <table id="tbCuerpoTecnico" class="table table-striped table-bordered align-middle w-100">
                            <thead class="table-light">
                                <tr>
                                    <th>Nombres</th>
                                    <th>Apellidos</th>
                                    <th>C.I.</th>
                                    <th>Cargo</th>
                                    <th width="10%">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Llenado por DataTables -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- ======================================= -->
                <!-- TAB 2: CARGA MASIVA EXCEL -->
                <!-- ======================================= -->
                <div class="tab-pane fade" id="tab-excel">
                    <div class="mb-4">
                        <h4 class="m-0"><i class="fa fa-upload text-theme me-2"></i>Importar desde Excel</h4>
                        <p class="text-muted fs-13px mt-1">Sube un archivo Excel con las columnas: <strong>Nombres, Apellidos, CI</strong>. Podrás asignar los cargos en la tabla antes de guardar.</p>
                    </div>

                    <div class="input-group mb-4">
                        <input type="file" class="form-control" id="fileExcelCT" accept=".xlsx, .xls" />
                        <button class="btn btn-indigo" type="button" id="btnPreviewExcel">
                            <i class="fa fa-eye me-1"></i>Previsualizar Datos
                        </button>
                    </div>

                    <div class="table-responsive mb-3" id="cargann">
                        <table id="tbPreviewExcel" class="table table-striped table-bordered align-middle w-100">
                            <thead class="table-light">
                                <tr>
                                    <th>Nombres</th>
                                    <th>Apellidos</th>
                                    <th>C.I.</th>
                                    <!-- Tu idea brillante: Columna select para el cargo -->
                                    <th width="25%">Asignar Cargo <span class="text-danger">*</span></th>
                                    <th width="5%" class="text-center"><i class="fa fa-trash"></i></th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Llenado dinámico tras leer excel. 
                                 Aquí insertarás el <select class="form-select form-select-sm select-cargo"> 
                                 desde Javascript -->
                            </tbody>
                        </table>
                    </div>

                    <div class="text-end">
                        <button class="btn btn-success" id="btnGuardarExcel" disabled>
                            <i class="fa fa-save me-1"></i>Guardar Todo el Personal
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <div class="modal fade" id="modalRegistroMiembro" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Registrar Miembro del Cuerpo Técnico</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Nombres <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="txtNombresCT" placeholder="Ej. Juan Carlos" autocomplete="off" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Apellidos <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="txtApellidosCT" placeholder="Ej. Perez" autocomplete="off" />
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">C.I. <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="txtCICT" placeholder="Ej. 1234567" autocomplete="off" />
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Cargo Técnico <span class="text-danger">*</span></label>
                            <!-- Este select lo llenarás por AJAX consultando CARGOS_TECNICOS -->
                            <select class="form-select" id="cboCargoCT">
                                <option value="">Seleccione...</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="btnGuardarMiembro"><i class="fa fa-save me-1"></i>Guardar</button>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="js/Plantillas.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
