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
    public partial class PartidosCuartos : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<ClasificadosSerieDTO>> ListaClasificados(int IdTorneo, int IdCategoria, int IdSerie)
        {
            return NTorneo.GetInstance().ObtenerClasificadosSerie(IdTorneo, IdCategoria, IdSerie);
        }
    }
}