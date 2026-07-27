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
    public partial class Jugadores : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<EJugador>> ListaJugadoresIdClub(int IdClub)
        {
            return NJugador.GetInstance().ListaJugadoresIdClub(IdClub);
        }

        [WebMethod]
        public static Respuesta<int> GuardarOrEditJugadoresNew(EJugador objeto, string base64Image)
        {
            try
            {
                var utilidades = Utilidades.GetInstance();

                // 1. Validar y convertir Fecha de forma segura
                if (!DateTime.TryParseExact(objeto.FechaNacimiento, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime fechaNacimiento))
                {
                    return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "El formato de la fecha no es válido. Debe ser dd/MM/yyyy." };
                }

                // 1. Manejo de la foto
                if (!string.IsNullOrEmpty(base64Image))
                {
                    byte[] imageBytes = Convert.FromBase64String(base64Image);
                    using (var stream = new MemoryStream(imageBytes))
                    {
                        string fileName = $"{Guid.NewGuid()}.jpg";
                        objeto.FotografiaUrl = utilidades.UploadPhotoToCloud(stream, fileName);
                    }
                }
                else
                {
                    objeto.FotografiaUrl = "";
                }

                // 2. Manejo de la clave
                if (objeto.IdJugador == 0)
                {
                    objeto.ClaveHash = utilidades.Hash(objeto.CI);
                }
                else
                {
                    objeto.ClaveHash = "";
                }

                return NJugador.GetInstance().GuardarOrEditJugadores(objeto, fechaNacimiento);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

        [WebMethod]
        public static Respuesta<int> GuardarOrEditJugadores(EJugador objeto, string base64Image)
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
                        string folder = "/ImgJugadores/";
                        objeto.FotografiaUrl = utilidades.UploadPhoto(stream, folder);
                    }
                }
                else
                {
                    objeto.FotografiaUrl = "";
                }

                // 1. Validar y convertir Fecha de forma segura
                if (!DateTime.TryParseExact(objeto.FechaNacimiento, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime fechaNacimiento))
                {
                    return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = "El formato de la fecha no es válido. Debe ser dd/MM/yyyy." };
                }

                return NJugador.GetInstance().GuardarOrEditJugadores(objeto, fechaNacimiento);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

    }
}