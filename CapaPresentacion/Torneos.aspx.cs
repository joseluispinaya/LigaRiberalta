using CapaEntidad.Entidades;
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
    public partial class Torneos : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }


        [WebMethod]
        public static Respuesta<List<ETorneo>> ListaTorneos()
        {
            return NTorneo.GetInstance().ListaTorneos();
        }

        [WebMethod]
        public static Respuesta<int> GuardarOrEditTorneos(ETorneo objeto)
        {
            return NTorneo.GetInstance().GuardarOrEditTorneos(objeto);
        }

        [WebMethod]
        public static Respuesta<List<ESerie>> ListaSeries()
        {
            return NTorneo.GetInstance().ListaSeries();
        }
    }
}