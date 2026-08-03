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
    public partial class Partidos : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<ResumenSerieDTO>> ResumenSeries(int IdTorneo, int IdCategoria)
        {
            return NPartido.GetInstance().ResumenSeries(IdTorneo, IdCategoria);
        }

        [WebMethod]
        public static Respuesta<List<PosicionDTO>> ListaTablaPosiciones(int IdTorneo, int IdCategoria, int IdSerie)
        {
            return NPartido.GetInstance().ListaTablaPosiciones(IdTorneo, IdCategoria, IdSerie);
        }

        [WebMethod]
        public static Respuesta<List<PartidoSerieDTO>> ListaPartidosSerie(int IdTorneo, int IdCategoria, int IdSerie)
        {
            return NPartido.GetInstance().ListaPartidosSerie(IdTorneo, IdCategoria, IdSerie);
        }

        [WebMethod]
        public static Respuesta<List<PartidoSerieDTO>> ObtenerPartidosFase(int IdTorneo, int IdCategoria, int IdFase)
        {
            return NResultados.GetInstance().ObtenerPartidosFase(IdTorneo, IdCategoria, IdFase);
        }
    }
}