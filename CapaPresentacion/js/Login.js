


$(document).ready(function () {

    // 1. LÓGICA DEL BOTÓN INICIAR SESIÓN
    $("#btnIniciarSesion").on("click", function () {
        let correo = $("#txtCorreo").val().trim();
        let password = $("#txtPassword").val().trim();

        // Validaciones básicas
        if (correo === "") {
            mostrarAlertaLogin("warning", "Campo Vacío", "Por favor, ingresa tu correo electrónico.");
            $("#txtCorreo").focus();
            return;
        }

        if (password === "") {
            mostrarAlertaLogin("warning", "Campo Vacío", "Por favor, ingresa tu contraseña.");
            $("#txtPassword").focus();
            return;
        }

        // Aquí iría tu llamada AJAX real. Simulamos el proceso con un loading
        let btnOriginalHtml = $(this).html();
        $(this).html('<i class="fa-solid fa-circle-notch fa-spin me-2"></i> Verificando...');
        $(this).prop("disabled", true);

        // Simulación de delay de red (quitar en producción)
        setTimeout(function () {
            // Ejemplo de validación exitosa "falsa"
            if (correo === "adminDev@gmail.com" && password === "123456") {
                sessionStorage.setItem('userLog', 'Admin Dev');
                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: 'Redirigiendo al panel de administración...',
                    showConfirmButton: false,
                    timer: 1500,
                    background: 'var(--glass-bg)', // Mantiene el estilo oscuro
                    color: 'white'
                }).then(() => {
                    window.location.href = "Inicio.aspx";
                    //console.log("Redirigiendo...");
                    $("#btnIniciarSesion").html(btnOriginalHtml).prop("disabled", false);
                });
            } else {
                mostrarAlertaLogin("error", "Error de Credenciales", "El correo o contraseña son incorrectos.");
                $("#btnIniciarSesion").html(btnOriginalHtml).prop("disabled", false);
            }
        }, 1000);
    });

    // 2. LÓGICA DEL BOTÓN RECUPERAR CONTRASEÑA (Modal Swal2)
    $("#btnRecuperar").on("click", function () {

        // SweetAlert2 permite crear modales interactivos con inputs muy elegantes
        Swal.fire({
            title: "Recuperar Contraseña",
            text: "Ingresa el correo electrónico asociado a tu cuenta. Te enviaremos instrucciones para restablecerla.",
            input: "email",
            inputPlaceholder: "ejemplo@correo.com",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Enviar Enlace",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "var(--futsal-blue)",
            cancelButtonColor: "#6c757d",
            background: "var(--glass-bg)",
            color: "white",
            // Validación del input dentro del modal
            preConfirm: (email) => {
                if (!email) {
                    Swal.showValidationMessage('Debes ingresar un correo electrónico');
                }
                return email;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // El usuario ingresó el correo y presionó enviar
                let correoIngresado = result.value;

                // Aquí iría tu AJAX para enviar el correo real

                // Mostramos mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: '¡Correo Enviado!',
                    text: `Se han enviado las instrucciones a: ${correoIngresado}`,
                    confirmButtonColor: "var(--futsal-red)",
                    background: "var(--glass-bg)",
                    color: "white"
                });
            }
        });
    });

    // 3. FUNCIONES AUXILIARES
    function mostrarAlertaLogin(icono, titulo, mensaje) {
        Swal.fire({
            icon: icono, // 'success', 'error', 'warning', 'info'
            title: titulo,
            text: mensaje,
            confirmButtonColor: "var(--futsal-red)",
            background: "var(--glass-bg)",
            color: "white",
            customClass: {
                confirmButton: 'btn btn-danger px-4 rounded-pill fw-bold'
            }
        });
    }

    // Permitir enviar con la tecla Enter
    $('#txtPassword').on('keypress', function (e) {
        if (e.which === 13) {
            $("#btnIniciarSesion").click();
        }
    });

});