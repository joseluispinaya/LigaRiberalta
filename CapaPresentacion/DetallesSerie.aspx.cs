using CapaEntidad.DTOs;
using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using CapaNegocio;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion
{
    public partial class DetallesSerie : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<EFasesTorneo>> ListaFasesCombo()
        {
            // Llama a tu capa de datos que ejecuta "usp_ObtenerFasesCombo"
            return NPartido.GetInstance().FasesTorneo();
        }

        [WebMethod]
        public static Respuesta<List<ComboEquipoDTO>> ListaEquiposSerieCombo(int IdTorneo, int IdCategoria, int IdSerie)
        {
            // Llama a tu capa de datos que ejecuta "usp_ObtenerEquiposSerieCombo"
            return NPartido.GetInstance().ListaEquiposSerieCombo(IdTorneo, IdCategoria, IdSerie);
        }

        [WebMethod]
        public static Respuesta<int> ProgramarPartido(ProgramarPartidoDTO objeto)
        {
            try
            {
                // 1. Validar y convertir Fecha de forma segura
                if (!DateTime.TryParseExact(objeto.Fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime fechaPartido))
                {
                    return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "El formato de la fecha no es válido. Debe ser dd/MM/yyyy." };
                }

                // 2. Validar y convertir Hora de forma segura
                if (!TimeSpan.TryParse(objeto.Hora, out TimeSpan horaPartido))
                {
                    return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "El formato de la hora no es válido. Debe ser HH:mm." };
                }

                // 3. Si todo está perfecto, enviamos a la capa de datos
                return NPartido.GetInstance().ProgramarPartido(objeto, fechaPartido, horaPartido);
            }
            catch (Exception ex)
            {
                // Esto solo saltará si se cae la base de datos o hay un error grave en la memoria
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

        [WebMethod]
        public static Respuesta<List<EstadoPartido>> ListaEstadosPartido()
        {
            return NPartido.GetInstance().ListaEstadosPartido();
        }

        [WebMethod]
        public static Respuesta<int> ResultadoPartido(ResultadosPartidoDTO objeto)
        {
            try
            {
                return NPartido.GetInstance().ResultadoPartido(objeto);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

        [WebMethod]
        public static Respuesta<PartidoActaDTO> DetallePartidoActa(int IdPartido)
        {
            return NResultados.GetInstance().DetallePartidoActa(IdPartido);
        }

        [WebMethod]
        public static Respuesta<int> ActualizarFechaPartido(int IdPartido, string Fecha, string Hora, string Cancha)
        {
            try
            {
                // 1. Validar y convertir Fecha de forma segura
                if (!DateTime.TryParseExact(Fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime fechaPartido))
                {
                    return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "El formato de la fecha no es válido. Debe ser dd/MM/yyyy." };
                }

                // 2. Validar y convertir Hora de forma segura
                if (!TimeSpan.TryParse(Hora, out TimeSpan horaPartido))
                {
                    return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "El formato de la hora no es válido. Debe ser HH:mm." };
                }

                return NResultados.GetInstance().ActualizarFechaPartido(IdPartido, fechaPartido, horaPartido, Cancha);
            }
            catch (Exception ex)
            {
                // Esto solo saltará si se cae la base de datos o hay un error grave en la memoria
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

        [WebMethod]
        public static Respuesta<int> ResultadoPartidoPruebas(ResultadosPartidoDTO objeto)
        {
            try
            {
                if (objeto == null)
                {
                    return new Respuesta<int>
                    {
                        Estado = false,
                        Valor = "warning",
                        Mensaje = "No se encontro datos para el registro"
                    };
                }

                System.Threading.Thread.Sleep(2000);

                return new Respuesta<int>
                {
                    Estado = true,
                    Data = 2,
                    Valor = "success",
                    Mensaje = "Prueba de simulacion exitosa"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

        [WebMethod]
        public static Respuesta<int> EditarPartidoPrueba(ProgramarPartidoDTO objeto)
        {
            try
            {
                // 1. Validar y convertir Fecha de forma segura
                if (!DateTime.TryParseExact(objeto.Fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime fechaPartido))
                {
                    return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "El formato de la fecha no es válido. Debe ser dd/MM/yyyy." };
                }

                // 2. Validar y convertir Hora de forma segura
                if (!TimeSpan.TryParse(objeto.Hora, out TimeSpan horaPartido))
                {
                    return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "El formato de la hora no es válido. Debe ser HH:mm." };
                }

                //return NPartido.GetInstance().EditarPartidoProgra(objeto, fechaPartido, horaPartido);

                System.Threading.Thread.Sleep(2000);

                Respuesta<int> response = new Respuesta<int>
                {
                    Estado = true,
                    Valor = "success",
                    Mensaje = "El Mensaje de edicion de partido Cuartos final. (Prueba Simulada)"
                };

                return response;
            }
            catch (Exception ex)
            {
                // Esto solo saltará si se cae la base de datos o hay un error grave en la memoria
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

        [WebMethod]
        public static Respuesta<bool> NotificacionNewPartido(string titulo, string mensaje, string informacion)
        {
            try
            {

                if (string.IsNullOrEmpty(titulo) || string.IsNullOrEmpty(mensaje) || string.IsNullOrEmpty(informacion))
                {
                    return new Respuesta<bool>
                    {
                        Estado = false,
                        Valor = "warning",
                        Mensaje = "Ingrese los datos requeridos (Título, Mensaje e Informacion)."
                    };
                }

                var resp = NPartido.GetInstance().ListaTokensNoti();

                if (!resp.Estado || resp.Data == null || resp.Data.Count == 0)
                {
                    return new Respuesta<bool>
                    {
                        Estado = false,
                        Valor = "warning",
                        Mensaje = "No hay usuarios para notificar."
                    };
                }

                System.Threading.Thread.Sleep(2000);

                // 2. Creamos la respuesta
                Respuesta<bool> response = new Respuesta<bool>
                {
                    Estado = true,
                    Valor = "success",
                    Mensaje = "El Mensaje se envio correctamente. (Prueba Simulada)",
                    Data = true
                };

                return response;

                // bool exito = Helpers.GetInstance().NotificacionPartidos(resp.Data, titulo, mensaje, informacion);

                // return new Respuesta<bool>
                // {
                //     Estado = exito,
                //     Valor = exito ? "success" : "warning",
                //     Mensaje = exito ? "Notificaciones enviadas correctamente" : "Hubo un problema al enviar algunas notificaciones."
                // };
            }
            catch (Exception)
            {
                return new Respuesta<bool> { Estado = false, Valor = "error", Mensaje = "Error en el servidor" };
            }
        }

    }
}