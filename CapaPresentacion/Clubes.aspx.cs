using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using CapaNegocio;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion
{
    public partial class Clubes : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<EClub>> ListaClubes()
        {
            return NClub.GetInstance().ListaClubes();
        }

        [WebMethod]
        public static Respuesta<int> GuardarOrEditClub(EClub objeto, string base64Image)
        {
            try
            {
                var utilidades = Utilidades.GetInstance();

                // 1. Manejo de la foto
                if (!string.IsNullOrEmpty(base64Image))
                {
                    byte[] imageBytes = Convert.FromBase64String(base64Image);
                    using (var stream = new MemoryStream(imageBytes))
                    {
                        string folder = "/Logos/";
                        objeto.LogoUrl = utilidades.UploadPhoto(stream, folder);
                    }
                }
                else
                {
                    objeto.LogoUrl = "";
                }

                // 1. Validar y convertir Fecha de forma segura
                if (!DateTime.TryParseExact(objeto.FechaFundacion, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime fechaFundacion))
                {
                    return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "El formato de la fecha no es válido. Debe ser dd/MM/yyyy." };
                }

                return NClub.GetInstance().GuardarOrEditClub(objeto, fechaFundacion);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

    }
}