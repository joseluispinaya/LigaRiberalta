using CapaEntidad.DTOs;
using CapaEntidad.Responses;
using CapaNegocio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion
{
    public partial class ControlInscripciones : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<InscritosDTO>> ObtenerEquiposDeudores(int IdTorneo, int IdCategoria)
        {
            return NResultados.GetInstance().ObtenerEquiposDeudores(IdTorneo, IdCategoria);
        }

        [WebMethod]
        public static Respuesta<List<NotificarPagosDTO>> NotificacionesPagos(int IdEquipo)
        {
            return NResultados.GetInstance().NotificacionesPagos(IdEquipo);
        }

        [WebMethod]
        public static Respuesta<bool> NotificacionInscripcionPendiente(int idEquipo, string titulo, string mensaje, string informacion)
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

                if (idEquipo <= 0)
                {
                    return new Respuesta<bool>
                    {
                        Estado = false,
                        Valor = "error",
                        Mensaje = "El Id del equipo no es válido."
                    };
                }

                var resp = NResultados.GetInstance().NotificacionesPagos(idEquipo);

                if (!resp.Estado || resp.Data == null || resp.Data.Count == 0)
                {
                    return new Respuesta<bool>
                    {
                        Estado = false,
                        Valor = "warning",
                        Mensaje = "No hay usuarios para notificar."
                    };
                }

                // ==============================================================================
                // 3. TRANSFORMACIÓN DE LA LISTA USANDO LINQ
                // ==============================================================================
                // Mapeamos NotificarPagosDTO hacia ListaTokensDTO extrayendo solo el Token
                List<ListaTokensDTO> listaTokens = resp.Data
                    .Where(x => !string.IsNullOrWhiteSpace(x.ExpoPushToken)) // Filtro extra de seguridad
                    .Select(x => new ListaTokensDTO
                    {
                        ExpoPushToken = x.ExpoPushToken
                    }).ToList();

                // Si después de filtrar no quedaron tokens válidos, cortamos el proceso
                if (listaTokens.Count == 0)
                {
                    return new Respuesta<bool>
                    {
                        Estado = false,
                        Valor = "warning",
                        Mensaje = "Los usuarios encontrados no tienen un Token de notificación válido."
                    };
                }

                //bool exito = Helpers.GetInstance().NotificacionMultipleUso(listaTokens, titulo, mensaje, informacion);

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

        [WebMethod]
        public static Respuesta<bool> ActualizarPagoInscripcion(int IdEquipo)
        {
            if (IdEquipo <= 0)
            {
                return new Respuesta<bool>
                {
                    Estado = false,
                    Valor = "error",
                    Mensaje = "El Id del equipo no es válido."
                };
            }
            return NResultados.GetInstance().ActualizarPagoInscripcion(IdEquipo);
        }

    }
}