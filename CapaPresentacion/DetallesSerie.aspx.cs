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
    }
}