
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