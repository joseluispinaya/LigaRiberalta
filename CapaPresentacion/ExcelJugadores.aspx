<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="ExcelJugadores.aspx.cs" Inherits="CapaPresentacion.ExcelJugadores" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="assets/plugins/select2ori/dist/css/select2.min.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <h1 class="page-header">MODULO <small>Registro de Jugadores...</small></h1>

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
                            <h5 class="mb-1">Registro de Jugadores</h5>
                            <p class="mb-0 text-gray-500 fs-13px">
                                Registro masivo mediante Archivo Excel.
                            </p>
                        </div>

                        <div class="ms-3">
                            <input class="form-control" type="file" id="txtarchivo">
                        </div>

                        <div class="ms-3">
                            <button id="btnVerArchivo" type="button" class="btn btn-success btn-sm px-3 fw-bold rounded-pill shadow-sm d-flex align-items-center">
                                <i class="fa fa-plus me-1"></i>Cargar Archivo
                            </button>
                        </div>
                    </div>

                    <div class="d-flex align-items-center mb-4 border-bottom pb-3">
                        <div class="w-40px h-40px d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-3 me-3 fs-20px">
                            <i class="fa fa-users-cog"></i>
                        </div>

                        <div class="flex-fill">
                            <h5 class="mb-1">Confirmar registro de Jugadores</h5>
                            <p class="mb-0 text-gray-500 fs-13px">
                                Una vez revisado los jugadores seleccione el club.
                            </p>
                        </div>

                        <div class="ms-3" style="width: 320px;">
                            <label class="form-label" for="cboClub">Seleccione Club</label>
                            <select class="form-select form-select-sm" id="cboClub">
                            </select>
                        </div>

                        <%--<div class="input-group input-group-sm ms-3" style="max-width: 280px;">
                            <span class="input-group-text"><i class="fa fa-shield-halved text-indigo me-1"></i>Club</span>
                            <select class="form-select" id="cboClubes">
                            </select>
                        </div>--%>

                        <div class="ms-3">
                            <button id="btnRegistroMasivo" type="button" class="btn btn-indigo btn-lg px-3 fw-bold rounded-pill shadow-sm d-flex align-items-center" disabled>
                                <i class="fa fa-save me-1"></i>Guardar Registro
                            </button>
                        </div>
                    </div>

                    <div class="table-responsive" id="cargann">
                        <table id="tbData" width="100%" class="table table-striped table-bordered align-middle text-nowrap">
                            <thead>
                                <tr>
                                    <th>Nombres</th>
                                    <th>Apellidos</th>
                                    <th>Nro Comet</th>
                                    <th>Nro CI</th>
                                    <th>Genero</th>
                                    <th>Fecha Nacido</th>
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
    <script src="assets/plugins/select2ori/dist/js/select2.min.js"></script>
    <script src="js/ExcelJugadores.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
