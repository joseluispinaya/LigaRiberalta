namespace CapaEntidad.DTOs
{
    public class PartidoSerieDTO
    {
        public int IdPartido { get; set; }
        public string Fecha { get; set; }
        public string Hora { get; set; }
        public string Cancha { get; set; }
        public string NombreFase { get; set; }

        // Datos Local
        public int IdEquipoLocal { get; set; }
        public string ClubLocal { get; set; }
        public string LogoLocal { get; set; }
        public int GolesLocal { get; set; }

        // Datos Visitante
        public int IdEquipoVisitante { get; set; }
        public string ClubVisitante { get; set; }
        public string LogoVisitante { get; set; }
        public int GolesVisitante { get; set; }

        // Estado
        public int IdEstado { get; set; }
        public string NombreEstado { get; set; }
    }
}
