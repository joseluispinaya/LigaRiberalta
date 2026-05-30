<%@ Page Title="" Language="C#" MasterPageFile="~/PageMaster.Master" AutoEventWireup="true" CodeBehind="Inicio.aspx.cs" Inherits="CapaPresentacion.Inicio" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="assets/css/futsal-custom.css" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="body" runat="server">
    <div class="row mb-4 futsal-fade-in">
        <div class="col-12">
            <div class="card border-0 text-white futsal-hero-card overflow-hidden shadow-lg">
                <img src="img/baner-futsal2.jpg" class="card-img futsal-hero-img" alt="Futsal Riberalta">
                <div class="card-img-overlay d-flex flex-column justify-content-center futsal-hero-overlay">
                    <h1 class="card-title fw-bold display-4 mb-2 animate__animated animate__fadeInDown">
                        <i class="fa-solid fa-futbol text-warning"></i>
                    </h1>
                    <p class="card-text fs-4 mb-4 animate__animated animate__fadeInUp animate__delay-1s">
                        Asociación Municipal de Fútbol de Salón de Riberalta
                    </p>
                    <div class="animate__animated animate__zoomIn animate__delay-2s">
                        <button class="btn btn-warning btn-lg fw-bold rounded-pill shadow-sm px-4">
                            <i class="fa fa-trophy me-2"></i>Ver Torneos Activos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="row mb-3">
        <div class="col-xl-8 col-lg-7">
            <div class="panel panel-inverse shadow-sm" data-sortable-id="index-1">
                <div class="panel-heading bg-dark text-white">
                    <h4 class="panel-title"><i class="fa-solid fa-shield-halved me-2 text-lime"></i>Clubes Destacados</h4>
                    <div class="panel-heading-btn">
                        <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
                    </div>
                </div>
                <div class="panel-body bg-light bg-opacity-25">
                    <div class="row text-center">
                        <div class="col-md-3 col-6 mb-3">
                            <div class="card border-0 shadow-sm futsal-club-card p-3 h-100 rounded-4">
                                <img src="img/logo1.jpg" class="img-fluid mx-auto d-block mb-2 futsal-logo" alt="Club 1">
                                <h6 class="fw-bold mb-0">Deportivo Riberalta</h6>
                            </div>
                        </div>
                        <div class="col-md-3 col-6 mb-3">
                            <div class="card border-0 shadow-sm futsal-club-card p-3 h-100 rounded-4">
                                <img src="img/logo2.jpg" class="img-fluid mx-auto d-block mb-2 futsal-logo" alt="Club 2">
                                <h6 class="fw-bold mb-0">Club Chichuriro</h6>
                            </div>
                        </div>
                        <div class="col-md-3 col-6 mb-3">
                            <div class="card border-0 shadow-sm futsal-club-card p-3 h-100 rounded-4">
                                <img src="img/logo3.jpg" class="img-fluid mx-auto d-block mb-2 futsal-logo" alt="Club 3">
                                <h6 class="fw-bold mb-0">Club Sport</h6>
                            </div>
                        </div>
                        <div class="col-md-3 col-6 mb-3">
                            <div class="card border-0 shadow-sm futsal-club-card p-3 h-100 rounded-4">
                                <img src="img/logo4.jpeg" class="img-fluid mx-auto d-block mb-2 futsal-logo" alt="Club 4">
                                <h6 class="fw-bold mb-0">Ing. Civil</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-4 col-lg-5">
            <div class="panel panel-inverse shadow-sm" data-sortable-id="index-2">
                <div class="panel-heading bg-dark text-white">
                    <h4 class="panel-title"><i class="fa-regular fa-calendar-days me-2 text-warning"></i>Próximos Partidos</h4>
                </div>
                <div class="panel-body p-0">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item d-flex justify-content-between align-items-center p-3 futsal-match-list">
                            <div class="d-flex align-items-center w-45 justify-content-end">
                                <span class="fw-bold me-2">Dep. Riberalta</span>
                                <img src="img/logo1.jpg" width="30" class="rounded-circle shadow-sm" alt="">
                            </div>
                            <div class="w-10 text-center text-muted fw-bold fs-12px px-2">VS</div>
                            <div class="d-flex align-items-center w-45 justify-content-start">
                                <img src="img/logo2.jpg" width="30" class="rounded-circle shadow-sm me-2" alt="">
                                <span class="fw-bold">Club Chichuriro</span>
                            </div>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center p-3 futsal-match-list">
                            <div class="d-flex align-items-center w-45 justify-content-end">
                                <span class="fw-bold me-2">Sport</span>
                                <img src="img/logo3.jpg" width="30" class="rounded-circle shadow-sm" alt="">
                            </div>
                            <div class="w-10 text-center text-muted fw-bold fs-12px px-2">VS</div>
                            <div class="d-flex align-items-center w-45 justify-content-start">
                                <img src="img/logo4.jpeg" width="30" class="rounded-circle shadow-sm me-2" alt="">
                                <span class="fw-bold">Ing. Civil</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="panel-footer text-center">
                    <a href="javascript:;" class="text-decoration-none text-primary fw-bold">Ver fixture completo</a>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
    <div class="col-xl-3 col-md-6 mb-3">
        <div class="widget widget-stats bg-blue futsal-hover-lift shadow-sm">
            <div class="stats-icon"><i class="fa-solid fa-users-line"></i></div>
            <div class="stats-info">
                <h4>CLUBES REGISTRADOS</h4>
                <p>24</p>
            </div>
            <div class="stats-link">
                <a href="javascript:;">Ver listado <i class="fa fa-arrow-alt-circle-right"></i></a>
            </div>
        </div>
    </div>
    <div class="col-xl-3 col-md-6 mb-3">
        <div class="widget widget-stats bg-teal futsal-hover-lift shadow-sm">
            <div class="stats-icon"><i class="fa-solid fa-running"></i></div>
            <div class="stats-info">
                <h4>JUGADORES HABILITADOS</h4>
                <p>350</p>
            </div>
            <div class="stats-link">
                <a href="javascript:;">Ver padrón <i class="fa fa-arrow-alt-circle-right"></i></a>
            </div>
        </div>
    </div>
    <div class="col-xl-3 col-md-6 mb-3">
        <div class="widget widget-stats bg-orange futsal-hover-lift shadow-sm">
            <div class="stats-icon"><i class="fa-solid fa-medal"></i></div>
            <div class="stats-info">
                <h4>TORNEOS EN CURSO</h4>
                <p>3</p>
            </div>
            <div class="stats-link">
                <a href="javascript:;">Gestionar <i class="fa fa-arrow-alt-circle-right"></i></a>
            </div>
        </div>
    </div>
    <div class="col-xl-3 col-md-6 mb-3">
        <div class="widget widget-stats bg-red futsal-hover-lift shadow-sm">
            <div class="stats-icon"><i class="fa-solid fa-clock"></i></div>
            <div class="stats-info">
                <h4>PARTIDOS ESTA SEMANA</h4>
                <p>12</p>
            </div>
            <div class="stats-link">
                <a href="javascript:;">Ver fixture <i class="fa fa-arrow-alt-circle-right"></i></a>
            </div>
        </div>
    </div>
</div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="footer" runat="server">
</asp:Content>
