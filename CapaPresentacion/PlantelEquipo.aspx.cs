using CapaEntidad.DTOs;
using CapaEntidad.Responses;
using CapaNegocio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion
{
    public partial class PlantelEquipo : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<int> GuardarPlantillaMasiva(int IdEquipo, List<JugadorPlantillaDTO> listaJugadores)
        {
            // 1. Validación Fail-Fast: Si la lista viene nula o vacía, rebotamos la petición inmediatamente
            if (listaJugadores == null || listaJugadores.Count == 0)
            {
                return new Respuesta<int>
                {
                    Estado = false,
                    Valor = "warning",
                    Mensaje = "No se recibieron jugadores para guardar. La plantilla está vacía."
                };
            }

            try
            {
                // 2. Serializamos en la capa de presentación
                string jsonJugadores = JsonSerializer.Serialize(listaJugadores);

                // 3. Enviamos el string puro a la capa de datos
                return NInscripcion.GetInstance().GuardarPlantillaMasiva(IdEquipo, jsonJugadores);
            }
            catch (Exception ex)
            {
                return new Respuesta<int>
                {
                    Estado = false,
                    Valor = "error",
                    Mensaje = "Error al procesar los datos: " + ex.Message
                };
            }
        }
    }
}