<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="PlantelEquipo.aspx.cs" Inherits="CapaPresentacion.PlantelEquipo" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <h1 class="page-header">JUGADORES <small>Modulo Plantel de jugadores...</small></h1>

    <div class="row">
        <div class="col-xl-4 col-lg-5 mb-3">
            <div class="panel panel-inverse">
                <div class="panel-heading">
                    <h4 class="panel-title"><i class="fa fa-shield-halved me-1"></i>Perfil del Equipo</h4>
                </div>
                <div class="panel-body text-center bg-light bg-opacity-50">
                    <div class="mb-3">
                        <img id="imgClubLogo" src="Logos/sinLogo.png" class="rounded-3 shadow-sm" style="width: 120px; height: 120px; object-fit: contain; background: #fff; padding: 5px;">
                    </div>

                    <h4 id="lblNombreClub" class="mb-1 fw-bold text-body">Cargando...</h4>
                    <p id="lblSerie" class="text-primary fw-semibold mb-4"><i class="fa fa-layer-group me-1"></i>---</p>

                    <hr class="mb-3">

                    <div class="d-flex justify-content-between align-items-center text-start mb-2 px-2">
                        <span class="text-body fw-bold fs-13px">Estado de Pago:</span>
                        <span id="lblEstadoPago" class="badge bg-secondary fs-12px">Cargando...</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center text-start px-2">
                        <span class="text-body fw-bold fs-13px">Penalización:</span>
                        <span id="lblPenalizacion" class="text-danger fw-bold fs-13px">0 pts</span>
                    </div>

                    <input type="hidden" id="txtIdEquipo" />
                    <div class="mt-4 pt-2 border-top">
                        <a href="Inscripciones.aspx" class="btn btn-white w-100 fw-bold shadow-sm text-body">
                            <i class="fa fa-arrow-left me-2"></i>Volver a Inscripciones
                    </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-8 col-lg-7">
            <div class="panel panel-inverse">
                <div class="panel-heading">
                    <h4 class="panel-title"><i class="fa fa-users me-1"></i>Armar Plantilla Oficial</h4>
                </div>

                <div class="panel-body">
                    <div class="alert alert-info border-0 rounded-3 mb-3 py-2 px-3 fs-13px">
                        <i class="fa fa-info-circle me-1"></i>Encienda el interruptor para convocar al jugador y asígnele un número de camiseta.
                    </div>

                    <div class="table-responsive">
                        <table id="tbData" width="100%" class="table table-striped table-bordered align-middle text-nowrap">
                            <thead class="table-light">
                                <tr>
                                    <th width="1%" class="text-center">Convocar</th>
                                    <th>Jugador Elegible</th>
                                    <th width="15%" class="text-center">Nro Camiseta</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>

                    <div class="text-end mt-4">
                        <button id="btnGuardarPlantilla" type="button" class="btn btn-success fw-bold px-4 rounded-pill shadow-sm">
                            <i class="fa fa-save me-2"></i>Guardar Plantilla
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
    <script src="js/PlantelEquipo.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</asp:Content>
