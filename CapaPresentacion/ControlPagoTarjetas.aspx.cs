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
    public partial class ControlPagoTarjetas : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<EquipoDeudorSancionDTO>> ObtenerEquiposDeudoresSanciones(int IdTorneo, int IdCategoria, int IdFase)
        {
            return NSancionesEconomica.GetInstance().ObtenerEquiposDeudoresSanciones(IdTorneo, IdCategoria, IdFase);
        }


        [WebMethod]
        public static Respuesta<List<DetalleSancionDTO>> ObtenerDetalleSanciones(int IdPartido, int IdEquipo)
        {
            return NSancionesEconomica.GetInstance().ObtenerDetalleSanciones(IdPartido, IdEquipo);
        }

        [WebMethod]
        public static Respuesta<bool> NotificacionCobroTarjetas(int idEquipo, string titulo, string mensaje, string informacion)
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

                System.Threading.Thread.Sleep(2000);

                // 2. Creamos la respuesta
                Respuesta<bool> response = new Respuesta<bool>
                {
                    Estado = true,
                    Valor = "success",
                    Mensaje = "El Mensaje se envio correctamente. (Prueba Simulada Cobro de Tarjetas)",
                    Data = true
                };

                return response;
            }
            catch (Exception)
            {
                return new Respuesta<bool> { Estado = false, Valor = "error", Mensaje = "Error en el servidor" };
            }
        }

        [WebMethod]
        public static Respuesta<bool> ActualizarPagoSancion(int IdSancion)
        {
            if (IdSancion <= 0)
            {
                return new Respuesta<bool>
                {
                    Estado = false,
                    Valor = "error",
                    Mensaje = "El Id de la sanción no es válido."
                };
            }
            return NSancionesEconomica.GetInstance().ActualizarPagoSancion(IdSancion);
        }
    }
}