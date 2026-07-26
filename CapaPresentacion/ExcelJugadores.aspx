<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="ExcelJugadores.aspx.cs" Inherits="CapaPresentacion.ExcelJugadores" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="assets/plugins/select2ori/dist/css/select2.min.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <h1 class="page-header">Registro Masivo <small>Importación de Jugadores desde Excel</small></h1>

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
                
                <!-- PASO 1: Carga de Archivo -->
                <div class="row align-items-center mb-4 border-bottom pb-3">
                    <div class="col-md-5 d-flex align-items-center mb-3 mb-md-0">
                        <div class="w-40px h-40px d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-3 me-3 fs-20px">
                            <i class="fa fa-file-excel"></i>
                        </div>
                        <div>
                            <h5 class="mb-1">1. Cargar Archivo</h5>
                            <p class="mb-0 text-gray-500 fs-13px">Seleccione el archivo Excel (.xlsx, .xls)</p>
                        </div>
                    </div>
                    <div class="col-md-7 d-flex justify-content-md-end align-items-center">
                        <!-- El input file con atributo accept para limitar visualmente los archivos -->
                        <input class="form-control me-3" type="file" id="txtarchivo" accept=".xlsx, .xls" style="max-width: 350px;">
                        <button id="btnVerArchivo" type="button" class="btn btn-success btn-sm px-3 fw-bold rounded-pill shadow-sm d-flex align-items-center">
                            <i class="fa fa-upload me-1"></i> Previsualizar
                        </button>
                    </div>
                </div>

                <!-- PASO 2: Confirmación y Destino -->
                <div class="row align-items-center mb-4 border-bottom pb-3">
                    <div class="col-md-5 d-flex align-items-center mb-3 mb-md-0">
                        <div class="w-40px h-40px d-flex align-items-center justify-content-center bg-indigo bg-opacity-10 text-indigo rounded-3 me-3 fs-20px">
                            <i class="fa fa-shield-halved"></i>
                        </div>
                        <div>
                            <h5 class="mb-1">2. Confirmar Destino</h5>
                            <p class="mb-0 text-gray-500 fs-13px">Una vez revisado, seleccione el club y guarde.</p>
                        </div>
                    </div>
                    <div class="col-md-7 d-flex justify-content-md-end align-items-center">
                        <div style="width: 250px;" class="me-3">
                            <select class="form-select form-select-sm" id="cboClub">
                                <!-- Llenado por Select2 -->
                            </select>
                        </div>
                        <button id="btnRegistroMasivo" type="button" class="btn btn-indigo btn-sm px-3 fw-bold rounded-pill shadow-sm d-flex align-items-center" disabled>
                            <i class="fa fa-save me-1"></i> Guardar Registro
                        </button>
                    </div>
                </div>

                <!-- TABLA DE PREVISUALIZACIÓN -->
                <div class="table-responsive" id="cargann">
                    <table id="tbData" class="table table-striped table-bordered align-middle text-nowrap w-100">
                        <thead class="table-light">
                            <tr>
                                <th>Nombres</th>
                                <th>Apellidos</th>
                                <th>Nro Comet</th>
                                <th>Nro CI</th>
                                <th class="text-center">Género</th>
                                <th>Fecha Nacimiento</th>
                                <!-- Columna de Acciones sin posibilidad de ordenamiento -->
                                <th class="text-center" width="5%"><i class="fa fa-trash"></i></th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Llenado dinámico por DataTables -->
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>
</div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="assets/plugins/select2ori/dist/js/select2.min.js"></script>
    <script src="js/ExcelJugadores.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
