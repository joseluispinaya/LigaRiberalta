namespace CapaEntidad.DTOs
{
    public class EquipoDeudorDTO
    {
        public int IdPartido { get; set; }
        public string Fecha { get; set; }
        public string Hora { get; set; }
        public string Cancha { get; set; }
        public string NombreFase { get; set; }

        // Datos específicos del equipo que debe el arbitraje
        public int IdEquipo { get; set; }
        public string NombreClub { get; set; }
        public string LogoUrl { get; set; }

        // Datos de contexto (Si jugó de Local o Visitante y cuántos goles hizo)
        public string Condicion { get; set; }
        public int GolesAnotados { get; set; }
    }
}
