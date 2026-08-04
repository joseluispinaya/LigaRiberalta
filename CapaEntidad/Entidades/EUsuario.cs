namespace CapaEntidad.Entidades
{
    public class EUsuario
    {
        public int IdUsuario { get; set; }
        public int IdRol { get; set; }
        public string NombreRol { get; set; } // Propiedad de apoyo para la grilla
        public string NroCi { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string NombreCompleto { get; set; } // Propiedad de apoyo
        public string Celular { get; set; }
        public string Correo { get; set; }

        public string Clave { get; set; } // Para enviar el hash desde el WebMethod
        public string FotoUrl { get; set; }

        public bool Estado { get; set; }
        public string FechaRegistro { get; set; }
    }
}
