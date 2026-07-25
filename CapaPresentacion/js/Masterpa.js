
// VARIABLES GLOBALES

// apiwebliga1
const API_BASE_URL = "https://localhost:44383/api";

// weapiinscripciones
const API_BASE_URL2 = "https://localhost:44378/api";

const BASE_URL_IMG = "https://localhost:44383";

/* ==========================================================
   HELPER PARA NOTIFICACIONES GRITTER (TOASTS)
   Uso: MensajeGritter("Título", "Mensaje de texto", "success");
   ========================================================== */
function MensajeGritter(titulo, mensaje, tipo) {
    let imagenUrl = '';
    let claseColor = ''; // Color Admin usa clases CSS para personalizar

    // Definimos iconos o imágenes según el tipo
    switch (tipo) {
        case 'success':
            imagenUrl = 'Imagen/success.png'; // O un icono check
            // Nota: Gritter no tiene colores nativos "success", pero podemos usar clases
            // Si quieres personalizar colores, usa 'class_name'
            break;
        case 'warning':
            imagenUrl = 'Imagen/alerta.png'; // O icono alerta
            break;
        case 'error':
            imagenUrl = 'assets/img/user/user-14.jpg'; // O icono error
            break;
        default:
            imagenUrl = 'assets/img/user/user-2.jpg';
    }

    $.gritter.add({
        title: titulo,
        text: mensaje,
        image: imagenUrl, // Puedes quitar esto si prefieres solo texto
        sticky: false,    // Se desvanece solo
        time: 4000,       // 4 segundos
        class_name: 'my-sticky-class' // Puedes añadir 'gritter-light' para fondo blanco
    });
}

/* ==========================================================
   HELPER PARA SWEETALERT (MODALES)
   Uso: MensajeSweet("Título", "Mensaje", "success", function() { ... });
   ========================================================== */
function MensajeSweet(titulo, mensaje, tipo, callbackConfirm) {
    let btnClass = 'btn-default';

    // Asignamos el color del botón según el estilo de Color Admin
    if (tipo === 'success') btnClass = 'btn-success';
    else if (tipo === 'warning') btnClass = 'btn-warning';
    else if (tipo === 'error') btnClass = 'btn-danger';
    else if (tipo === 'info') btnClass = 'btn-info';

    swal({
        title: titulo,
        text: mensaje,
        icon: tipo, // 'success', 'warning', 'error', 'info'
        buttons: {
            confirm: {
                text: 'Aceptar',
                value: true,
                visible: true,
                className: 'btn ' + btnClass, // Estilo Color Admin
                closeModal: true
            }
        }
    }).then((valor) => {
        // Si el usuario da click en Aceptar y hay una función callback, la ejecutamos
        if (valor && callbackConfirm) {
            callbackConfirm();
        }
    });
}

function ConfirmarSweet(titulo, mensaje, tipo, textoConfirmar, callbackConfirm) {
    let btnClass = 'btn-primary';

    // Asignamos el color del botón de confirmación según el tipo
    if (tipo === 'success') btnClass = 'btn-success';
    else if (tipo === 'warning') btnClass = 'btn-warning';
    else if (tipo === 'error') btnClass = 'btn-danger';
    else if (tipo === 'info') btnClass = 'btn-info';

    swal({
        title: titulo,
        text: mensaje,
        icon: tipo,
        buttons: {
            cancel: {
                text: 'Cancelar',
                value: null,
                visible: true,
                className: 'btn btn-default', // Estilo neutro para cancelar
                closeModal: true,
            },
            confirm: {
                text: textoConfirmar || 'Aceptar',
                value: true,
                visible: true,
                className: 'btn ' + btnClass,
                closeModal: true
            }
        }
    }).then((valor) => {
        // 'valor' será true si presiona el botón de confirmación, null si presiona cancelar
        if (valor && callbackConfirm) {
            callbackConfirm();
        }
    });
}

// Función global para mostrar alertas SweetAlert
function mostrarAlerta(titulo, mensaje, tipo) {

    let btnClass = 'btn-default';

    // Asignamos el color del botón según el estilo de Color Admin
    if (tipo === 'success') btnClass = 'btn-success';
    else if (tipo === 'warning') btnClass = 'btn-warning';
    else if (tipo === 'error') btnClass = 'btn-danger';
    else if (tipo === 'info') btnClass = 'btn-info';

    swal({
        title: titulo,
        text: mensaje,
        icon: tipo,
        buttons: {
            confirm: {
                text: 'Aceptar',
                value: true,
                visible: true,
                className: 'btn ' + btnClass, // Estilo Color Admin
                closeModal: true
            }
        }
    });
}

function alertaTimer(titulo, mensaje, tipo, tiempo = 3000) {

    let btnClass = 'btn-default';

    // Asignamos el color del botón según el estilo de Color Admin
    if (tipo === 'success') btnClass = 'btn-success';
    else if (tipo === 'warning') btnClass = 'btn-warning';
    else if (tipo === 'error') btnClass = 'btn-danger';
    else if (tipo === 'info') btnClass = 'btn-info';

    swal({
        title: titulo,
        text: mensaje,
        icon: tipo,
        timer: tiempo,
        buttons: {
            confirm: {
                text: 'Aceptar',
                value: true,
                visible: true,
                className: 'btn btn-sm ' + btnClass, // Estilo Color Admin
                closeModal: true
            }
        }
    });
}

/* ==========================================================
   HELPER GLOBAL PARA TOASTR
   Uso: MensajeToast("Título Opcional", "Mensaje del cuerpo", "success");
   Tipos: 'success', 'info', 'warning', 'error'
   ========================================================== */
function MensajeToast(titulo, mensaje, tipo) {

    // Configuración Global (Se aplica a todos los toasts)
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true, // Muestra los nuevos arriba
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000", // 5 segundos visible
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    // Mapeo de tipos para llamar al método correcto de toastr
    switch (tipo.toLowerCase()) {
        case 'success':
            toastr.success(mensaje, titulo || "Éxito");
            break;
        case 'warning':
            toastr.warning(mensaje, titulo || "Advertencia");
            break;
        case 'error':
            toastr.error(mensaje, titulo || "Error");
            break;
        case 'info':
        default:
            toastr.info(mensaje, titulo || "Información");
            break;
    }
}

$(document).ready(function () {
    const usuarioAdmin = sessionStorage.getItem('userLog');

    if (!usuarioAdmin) {
        window.location.replace('Login.aspx');
        return;
    }

    try {
        //const usua = JSON.parse(usuarioAdmin);
        // mostrar la imagen y nombre del usuairo 
        //$(".imgAdminVo").attr("src", usua.ImagenUser || "images/sinimagen.png");

        $(".texApellidosAdm").text("Cuani Nay");
        $("#lblDatosAd").text("Administrador");
    } catch (error) {
        console.error("Error leyendo sesión", error);
        sessionStorage.clear();
        window.location.replace('Login.aspx');
    }
});

$('#salirsis').on('click', function (e) {
    e.preventDefault();

    ConfirmarSweet(
        "¿Cerrar Sesión?",
        "¿Estás seguro que deseas salir del sistema?",
        "warning",
        "Sí, salir", // Texto personalizado para el botón
        function () {
            // Esta función solo se ejecuta si el usuario hace clic en "Sí, salir"
            EjecutarCierreSesion();
        }
    );
});

// Tu función original (a modo de ejemplo)

function EjecutarCierreSesion() {
    sessionStorage.clear();
    window.location.replace('Login.aspx');
}