using CapaEntidad.DTOs;
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
    public partial class Inscripciones : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<InscritosDTO>> ListaEquiposInscritos(int IdTorneo, int IdCategoria)
        {
            return NInscripcion.GetInstance().ListaEquiposInscritos(IdTorneo, IdCategoria);
        }

        [WebMethod]
        public static Respuesta<int> GuardarOrEditInscripcion(EInscripcion objeto)
        {
            return NInscripcion.GetInstance().GuardarOrEditInscripcion(objeto);
        }

        [WebMethod]
        public static Respuesta<InscritosDTO> BuscarEquipoInscrito(int IdEquipo)
        {
            return NInscripcion.GetInstance().BuscarEquipoInscrito(IdEquipo);
        }

        [WebMethod]
        public static Respuesta<List<PlantelJugadoresDTO>> ListaJugadoresElegibles(int IdEquipo)
        {
            return NInscripcion.GetInstance().ListaJugadoresElegibles(IdEquipo);
        }
    }
}