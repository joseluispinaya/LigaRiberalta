using System;

namespace CapaEntidad.Entidades
{
    public class EJugador
    {
        public int IdJugador { get; set; }
        public int IdClubActual { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string NroComet { get; set; }
        public string CI { get; set; }
        public char Genero { get; set; }
        public string FechaNacimiento { get; set; } // Ej: "03/05/2016" para mostrar en el frontend
        public DateTime VFechaNacimiento { get; set; } // Para manejar internamente como DateTime
        public string FotografiaUrl { get; set; }
        public string ClaveHash { get; set; }
        // NUEVA PROPIEDAD DE LECTURA: Edad Deportiva
        public string Edad
        {
            get
            {
                // Calculamos solo restando los años
                int edadDeportiva = DateTime.Now.Year - VFechaNacimiento.Year;

                // Validamos por si acaso es 1 año (para no decir "1 años")
                return edadDeportiva == 1 ? "1 año" : edadDeportiva + " años";
            }
        }
    }
}
