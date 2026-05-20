using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace CapaPresentacion
{
    public class Utilidades
    {
        #region "PATRON SINGLETON"
        private static Utilidades _instancia = null;

        private Utilidades()
        {

        }

        public static Utilidades GetInstance()
        {
            if (_instancia == null)
            {
                _instancia = new Utilidades();
            }
            return _instancia;
        }
        #endregion

        public string UploadPhoto(MemoryStream stream, string folder)
        {
            string rutaa = "";

            try
            {
                stream.Position = 0;

                var guid = Guid.NewGuid().ToString();
                var file = $"{guid}.jpg";

                var fullPath = $"{folder}{file}";
                var path = Path.Combine(HttpContext.Current.Server.MapPath(folder), file);

                // Guardar la imagen en el sistema de archivos
                File.WriteAllBytes(path, stream.ToArray());

                // Verificar si el archivo fue guardado correctamente
                if (File.Exists(path))
                {
                    rutaa = fullPath;
                }
            }
            catch (IOException)
            {
                rutaa = "";
            }
            catch (Exception)
            {
                rutaa = "";
            }
            return rutaa;
        }

    }
}