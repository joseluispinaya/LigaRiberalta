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
    public partial class PanelResultados : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<PartidoSerieDTO> ObtenerDetallePartido(int IdPartido)
        {
            return NPartido.GetInstance().ObtenerDetallePartido(IdPartido);
        }

        [WebMethod]
        public static Respuesta<List<PlantillaJugadorEvDTO>> ObtenerPlantillaEquipo(int IdEquipo)
        {
            return NPartido.GetInstance().ObtenerPlantillaEquipo(IdEquipo);
        }

        [WebMethod]
        public static Respuesta<int> RegistrarEvento(EventoPartidoDTO objeto)
        {
            try
            {
                return NPartido.GetInstance().RegistrarEvento(objeto);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

        [WebMethod]
        public static Respuesta<List<EventoDetalleDTO>> ObtenerEventosPartido(int IdPartido)
        {
            return NResultados.GetInstance().ObtenerEventosPartido(IdPartido);
        }

    }
}