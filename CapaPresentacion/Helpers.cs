using CapaEntidad.DTOs;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;

namespace CapaPresentacion
{
    public class Helpers
    {
        #region "PATRON SINGLETON"
        private static Helpers _instancia = null;

        private Helpers() { }

        public static Helpers GetInstance()
        {
            if (_instancia == null)
            {
                _instancia = new Helpers();
            }
            return _instancia;
        }
        #endregion

        public bool NotificacionPartidos(List<ListaTokensDTO> listaTokensActivos, string titulo, string mensaje, string informacion)
        {
            if (listaTokensActivos == null || listaTokensActivos.Count == 0) return false;

            // 2. Filtramos tokens inválidos y armamos el array de mensajes individuales
            var mensajes = listaTokensActivos
                .Where(d => !string.IsNullOrWhiteSpace(d.ExpoPushToken) && d.ExpoPushToken.StartsWith("ExponentPushToken"))
                .Select(d => new
                {
                    to = d.ExpoPushToken,
                    title = titulo,
                    body = mensaje,
                    sound = "default",
                    data = new
                    {
                        codigo = "0",
                        informacion
                    }
                }).ToList();

            if (mensajes.Count == 0) return false;

            try
            {
                string jsonPayload = JsonConvert.SerializeObject(mensajes);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                using (var http = new HttpClient())
                {
                    http.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

                    var response = http
                        .PostAsync("https://exp.host/--/api/v2/push/send", content)
                        .GetAwaiter()
                        .GetResult();

                    return response.IsSuccessStatusCode;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al enviar notificaciones dinámicas: " + ex.Message);
                return false;
            }
        }

    }
}