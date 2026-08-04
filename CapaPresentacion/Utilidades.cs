using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
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

        public string UploadPhotoToCloud(MemoryStream stream, string fileName)
        {
            string imageUrl = "";

            try
            {
                // 1. Configurar las credenciales (Lo ideal es leer esto del Web.config)
                Account account = new Account(
                    "gfggfddfs",
                    "ererererrw",
                    "egrrretererrtrer"
                );

                Cloudinary cloudinary = new Cloudinary(account);

                // 2. Asegurar que el stream esté al inicio
                stream.Position = 0;

                // 3. Configurar los parámetros de subida
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(fileName, stream),
                    Folder = "FutsalRiberalta/Jugadores", // Crea carpetas ordenadas en tu nube
                    Overwrite = true
                };

                // 4. Ejecutar la subida
                var uploadResult = cloudinary.Upload(uploadParams);

                // 5. Verificar si fue exitoso
                if (uploadResult.StatusCode == HttpStatusCode.OK)
                {
                    // Devolvemos la URL segura (https) generada por Cloudinary
                    imageUrl = uploadResult.SecureUrl.ToString();
                }
            }
            catch (Exception)
            {
                // Opcional: Loguear el error
                imageUrl = "";
            }

            return imageUrl;
        }

        public string UploadPhotoToCloudUser(MemoryStream stream, string fileName)
        {
            string imageUrl = "";

            try
            {
                // 1. Configurar las credenciales (Lo ideal es leer esto del Web.config)
                Account account = new Account(
                    "wfsdfsdfs",
                    "sdfsfsdfs",
                    "asfasdasda"
                );

                Cloudinary cloudinary = new Cloudinary(account);

                // 2. Asegurar que el stream esté al inicio
                stream.Position = 0;

                // 3. Configurar los parámetros de subida
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(fileName, stream),
                    Folder = "FutsalRiberalta/Usuarios", // Crea carpetas ordenadas en tu nube
                    Overwrite = true
                };

                // 4. Ejecutar la subida
                var uploadResult = cloudinary.Upload(uploadParams);

                // 5. Verificar si fue exitoso
                if (uploadResult.StatusCode == HttpStatusCode.OK)
                {
                    // Devolvemos la URL segura (https) generada por Cloudinary
                    imageUrl = uploadResult.SecureUrl.ToString();
                }
            }
            catch (Exception)
            {
                // Opcional: Loguear el error
                imageUrl = "";
            }

            return imageUrl;
        }

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

        public string Hash(string password)
        {
            // Validamos que no nos envíen contraseñas vacías
            if (string.IsNullOrEmpty(password))
                return string.Empty;

            // Encripta la contraseña. BCrypt genera y aplica el "Salt" automáticamente
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool Verify(string password, string hash)
        {
            // Validamos que ninguno de los dos sea nulo o vacío
            if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(hash))
                return false;

            // Verifica si la contraseña en texto plano coincide con el hash de la BD
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }

    }
}