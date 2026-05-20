

"use strict";

(function () {
    // Estado interno
    let tablaData = null;
    let idEditar = 0;

    // Selectores reutilizables
    const sel = {
        table: '#tbData',
        modal: '#modalAdd',
        modalContent: '#modalAdd div.modal-content',
        txtNombre: '#txtNomCatego',
        cboGenero: '#cboGenero',
        txtEdad: '#txtEdad',
        cboEstado: '#cboEstado',
        btnGuardar: '#btnGuardarCambios',
        btnNuevo: '#btnNuevoReg',
        modalLabel: '#modalLabeldetalle'
    };

    // Inicialización
    $(document).ready(function () {
        inicializarEventos();
        inicializarTabla();
    });

    // Inicializa DataTable (destruye si ya existe)
    function inicializarTabla() {
        if ($.fn.DataTable.isDataTable(sel.table)) {
            $(sel.table).DataTable().destroy();
            $(`${sel.table} tbody`).empty();
        }

        tablaData = $(sel.table).DataTable({
            responsive: true,
            ajax: {
                url: 'Categorias.aspx/ListaCategorias',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: function (d) {
                    return JSON.stringify(d);
                },
                dataSrc: function (json) {
                    return (json && json.d && json.d.Estado) ? json.d.Data : [];
                }
            },
            columns: [
                { data: 'IdCategoria', visible: false, searchable: false },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    render: function (data, type, row) {
                        return construirCeldaPrincipal(row);
                    }
                },
                {
                    data: 'Estado',
                    className: 'text-center',
                    render: function (data) {
                        return data === true
                            ? '<span class="badge bg-yellow text-black fs-12px">Activo</span>'
                            : '<span class="badge bg-danger fs-12px">Inactivo</span>';
                    }
                },
                {
                    defaultContent:
                        '<button class="btn btn-lime btn-editar btn-sm me-2"><i class="fas fa-pencil-alt"></i></button>' +
                        '<button class="btn btn-info btn-detalle btn-sm"><i class="fas fa-eye"></i></button>',
                    orderable: false,
                    searchable: false,
                    className: 'text-center'
                }
            ],
            order: [[0, 'desc']],
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json'
            }
        });
    }

    // Construye el HTML de la celda principal de forma compacta
    function construirCeldaPrincipal(row) {
        const edadTexto = (row.EdadMaxima === 0 || row.EdadMaxima === null) ? 'Categoría Libre' : `Edad Máxima: ${row.EdadMaxima} años`;
        const esVaron = row.Genero === 'M';
        const textoGenero = esVaron ? 'Varones' : 'Damas';
        const colorFondo = esVaron ? 'bg-blue bg-opacity-10 text-blue' : 'bg-pink bg-opacity-10 text-pink';
        const iconoGenero = esVaron ? 'fa-mars' : 'fa-venus';

        return `
            <div class="d-flex align-items-center">
                <div class="w-40px h-40px rounded-circle d-flex align-items-center justify-content-center ${colorFondo} shadow-sm me-3 fs-18px">
                    <i class="fa fa-users"></i>
                </div>
                <div>
                    <div class="fw-bold fs-14px text-body">${escapeHtml(row.NombreCategoria)}</div>
                    <div class="fs-12px text-gray-500">
                        <i class="fa ${iconoGenero} me-1"></i>${textoGenero} &nbsp;|&nbsp; ${edadTexto}
                    </div>
                </div>
            </div>
        `;
    }

    // Evita inyección básica al mostrar texto
    function escapeHtml(text) {
        if (text == null) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Mapeo para obtener la fila real cuando DataTables usa child row
    function obtenerFilaReal($btn) {
        let $fila = $btn.closest('tr');
        if ($fila.hasClass('child')) {
            $fila = $fila.prev();
        }
        return $fila;
    }

    // Bind de eventos
    function inicializarEventos() {
        // Editar
        $(`${sel.table} tbody`).on('click', '.btn-editar', function () {
            const $fila = obtenerFilaReal($(this));
            const data = tablaData.row($fila).data();
            abrirModalEdicion(data);
        });

        // Detalle (solo muestra alerta)
        $(`${sel.table} tbody`).on('click', '.btn-detalle', function () {
            const $fila = obtenerFilaReal($(this));
            const data = tablaData.row($fila).data();
            const textoSms = `Detalles de la Categoría: ${data.NombreCategoria}.`;
            mostrarAlerta('¡Mensaje!', textoSms, 'info');
        });

        // Nuevo registro
        $(sel.btnNuevo).on('click', function () {
            idEditar = 0;
            $(sel.txtNombre).val('');
            $(sel.cboGenero).val(1);
            $(sel.txtEdad).val('0');
            $(sel.cboEstado).val(1).prop('disabled', true);
            $(sel.modalLabel).text('Nuevo Registro');
            $(sel.modal).modal('show');
        });

        // Guardar cambios
        $(sel.btnGuardar).on('click', function () {
            guardarCambios();
        });
    }

    // Abre modal para edición con datos de la fila
    function abrirModalEdicion(data) {
        if (!data) return;
        idEditar = data.IdCategoria;
        $(sel.txtNombre).val(data.NombreCategoria);
        $(sel.cboGenero).val(data.Genero === 'M' ? 1 : 0);
        $(sel.cboEstado).val(data.Estado ? 1 : 0).prop('disabled', false);
        $(sel.txtEdad).val(data.EdadMaxima);
        $(sel.modalLabel).text('Editar Registro');
        $(sel.modal).modal('show');
    }

    // Habilita el botón guardar
    function habilitarBoton() {
        $(sel.btnGuardar).prop('disabled', false);
    }

    // Validaciones y envío
    function guardarCambios() {
        // Bloqueo inmediato
        $(sel.btnGuardar).prop('disabled', true);

        const nombre = $(sel.txtNombre).val().trim();
        if (nombre === '') {
            MensajeToast('Campo incompleto', 'Por favor, ingrese el nombre de la categoría.', 'warning');
            $(sel.txtNombre).focus();
            habilitarBoton();
            return;
        }

        const genero = $(sel.cboGenero).val() === '1' ? 'M' : 'F';
        const edad = parseInt($(sel.txtEdad).val(), 10) || 0;

        // NUEVA VALIDACIÓN: No permitir negativos
        // ==========================================
        if (edad < 0) {
            MensajeToast('Valor inválido', 'La edad máxima no puede ser un número negativo.', 'warning');
            $(sel.txtEdad).focus();
            habilitarBoton(); // Volvemos a habilitar el botón para que pueda corregir
            return; // Detenemos la ejecución
        }

        const estado = $(sel.cboEstado).val() === '1';

        const objeto = {
            IdCategoria: idEditar,
            NombreCategoria: nombre,
            Genero: genero,
            EdadMaxima: edad,
            Estado: estado
        };

        $(sel.modalContent).LoadingOverlay('show');

        $.ajax({
            type: 'POST',
            url: 'Categorias.aspx/GuardarOrEditCategorias',
            data: JSON.stringify({ objeto: objeto }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                $(sel.modalContent).LoadingOverlay('hide');

                alertaTimer(
                    response && response.d && response.d.Estado ? '¡Excelente!' : 'Atención',
                    response && response.d ? response.d.Mensaje : 'Respuesta inesperada del servidor.',
                    response && response.d ? response.d.Valor : 'info'
                );

                if (response && response.d && response.d.Estado) {
                    $(sel.modal).modal('hide');
                    if (tablaData) {
                        tablaData.ajax.reload(null, false);
                    }
                    idEditar = 0;
                }
            },
            error: function (xhr) {
                console.error(xhr && xhr.responseText ? xhr.responseText : xhr);
                $(sel.modalContent).LoadingOverlay('hide');
                MensajeToast('¡Atención!', 'Error de comunicación con el servidor.', 'error');
            },
            complete: function () {
                habilitarBoton();
            }
        });
    }

}());


// fin