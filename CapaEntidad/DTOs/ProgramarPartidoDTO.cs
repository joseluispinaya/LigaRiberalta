namespace CapaEntidad.DTOs
{
    public class ProgramarPartidoDTO
    {
        public int IdEquipoLocal { get; set; }
        public int IdEquipoVisitante { get; set; }
        public int IdFase { get; set; }
        public string Fecha { get; set; } // Llegará como "dd/MM/yyyy"
        public string Hora { get; set; }  // Llegará como "HH:mm"
        public string Cancha { get; set; }
    }
}
