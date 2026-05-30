<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="CapaPresentacion.Default" %>

<!DOCTYPE html>

<html lang="es">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>A.M.F.S.R. - Inicio</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link href="assets/css/defaultpage.css" rel="stylesheet" type="text/css" />
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark navbar-futsal fixed-top">
        <div class="container">
            <a class="navbar-brand fw-bold text-uppercase d-flex align-items-center" href="#">
                <i class="fa-solid fa-futbol text-danger fs-3 me-2"></i>
                A.M.F.S.R.
            </a>

            <div class="d-flex ms-auto">
                <a href="Login.aspx" class="btn btn-login">
                    <i class="fa-solid fa-user me-2"></i> Iniciar Sesión
                </a>
            </div>
        </div>
    </nav>

    <header class="hero-section text-center">
        <img src="img/baner-futsal2.jpg" alt="Banner A.M.F.S.R." class="hero-banner-img img-fluid" />
    </header>

    <section class="info-section">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6 mb-5 mb-lg-0 text-center text-lg-start">
                    <h6 class="text-danger fw-bold tracking-wide text-uppercase mb-2">Bienvenidos a la pasión que nos
                        une</h6>
                    <h2 class="display-5 fw-black mb-4" style="font-weight: 900;">ASOCIACIÓN MUNICIPAL DE<br><span
                            style="color: var(--futsal-blue);">FÚTBOL DE SALÓN</span></h2>
                    <p class="lead text-secondary mb-4">
                        Sigue de cerca cada partido, descubre a los mejores talentos y mantente al día con las tablas de
                        posiciones de todas nuestras categorías. ¡El deporte ráfaga se vive aquí en Riberalta!
                    </p>
                    <a href="#clubes" class="btn btn-outline-light rounded-pill px-4 py-2 fw-bold">
                        Ver Clubes <i class="fa-solid fa-arrow-down ms-2"></i>
                    </a>
                </div>
                <div class="col-lg-6 text-center">
                    <div class="glow-image-container">
                        <img src="img/cover-sidebar-user2.jpg" alt="Escudo AMFSR" class="img-fluid info-image"
                            style="max-width: 350px;" />
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="clubes" class="clubs-section text-center">
        <div class="container">
            <h3 class="fw-bold mb-2">CLUBES AFILIADOS</h3>
            <div class="divider mx-auto mb-5"
                style="width: 60px; height: 4px; background: var(--futsal-red); border-radius: 2px;"></div>

            <div class="row justify-content-center">
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="club-card">
                        <img src="img/logo1.jpg" alt="Club 1" class="img-fluid club-logo" />
                        <h6 class="fw-bold mb-0 text-light">Dep. Riberalta</h6>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="club-card">
                        <img src="img/logo2.jpg" alt="Club 2" class="img-fluid club-logo" />
                        <h6 class="fw-bold mb-0 text-light">Club Chichuriro</h6>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="club-card">
                        <img src="img/logo3.jpg" alt="Club 3" class="img-fluid club-logo" />
                        <h6 class="fw-bold mb-0 text-light">FC Import Sport</h6>
                    </div>
                </div>
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="club-card">
                        <img src="img/logo4.jpeg" alt="Club 4" class="img-fluid club-logo" />
                        <h6 class="fw-bold mb-0 text-light">FC Ing. Civil</h6>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer-futsal">
        <div class="container">
            <p class="mb-0 text-secondary">
                &copy; <span id="currentYear"></span> A.M.F.S.R. - Todos los derechos reservados.<br />
                <small>Desarrollado para la gestión deportiva de Riberalta.</small>
            </p>
        </div>
    </footer>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

    <!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script> -->
    <script>
        document.getElementById("currentYear").textContent = new Date().getFullYear();
    </script>
</body>
</html>
