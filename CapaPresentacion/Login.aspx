<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="CapaPresentacion.Login" %>

<!DOCTYPE html>

<html lang="es">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>A.M.F.S.R. - Iniciar Sesión</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;900&display=swap" rel="stylesheet">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11.10.6/dist/sweetalert2.min.css" rel="stylesheet">
    <link href="assets/css/login.css" rel="stylesheet" />
</head>
<body>
    <div class="container px-3">
        <div class="row justify-content-center">
            <div class="col-12">
                <div class="login-card mx-auto d-flex flex-column flex-md-row">
                    
                    <div class="col-md-6 login-left-side d-none d-md-flex flex-column text-center">
                        <img src="img/cover-sidebar-user2.jpg" alt="Logo AMFSR" class="img-fluid rounded-circle login-logo mb-4 border border-dark border-4 shadow-lg">
                        <h4 class="fw-black text-white text-uppercase" style="font-weight: 900; letter-spacing: 2px;">Gestión Deportiva</h4>
                        <p class="text-secondary small">Panel de administración exclusivo para dirigentes y delegados de clubes.</p>
                    </div>

                    <div class="col-md-6 login-right-side">
                        <div class="text-center mb-4 d-md-none">
                            <i class="fa-solid fa-futbol text-danger fs-1 mb-2"></i>
                            <h4 class="fw-black text-white text-uppercase" style="font-weight: 900;">A.M.F.S.R.</h4>
                        </div>
                        
                        <h3 class="fw-bold mb-1">Bienvenido de vuelta</h3>
                        <p class="text-secondary mb-4">Ingresa tus credenciales para continuar.</p>

                        <div class="mb-3 position-relative">
                            <i class="fa-solid fa-envelope input-icon"></i>
                            <input type="email" class="form-control form-control-futsal w-100" id="txtCorreo" placeholder="Correo electrónico" autocomplete="off">
                        </div>

                        <div class="mb-4 position-relative">
                            <i class="fa-solid fa-lock input-icon"></i>
                            <input type="password" class="form-control form-control-futsal w-100" id="txtPassword" placeholder="Contraseña">
                        </div>

                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <%--<div class="form-check">
                                <input class="form-check-input bg-dark border-secondary" type="checkbox" id="chkRecordar">
                                <label class="form-check-label text-secondary small cursor-pointer" for="chkRecordar">
                                    Recordarme
                                </label>
                            </div>--%>
                            <a href="javascript:;" id="btnRecuperar" class="link-futsal fw-medium">¿Olvidaste tu contraseña?</a>
                        </div>

                        <button type="button" id="btnIniciarSesion" class="btn btn-login">
                            <i class="fa-solid fa-right-to-bracket me-2"></i> Iniciar Sesión
                        </button>
                        
                        <div class="text-center mt-4">
                            <a href="Default.aspx" class="text-secondary text-decoration-none small hover-white">
                                <i class="fa-solid fa-arrow-left me-1"></i> Volver al inicio
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.10.6/dist/sweetalert2.all.min.js"></script>
    <script src="js/Login.js?v=<%= DateTime.Now.ToString("yyyyMMddHHmmss") %>" type="text/javascript"></script>
</body>
</html>
