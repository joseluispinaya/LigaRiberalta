namespace CapaEntidad.DTOs
{
    public class ResultadosPartidoDTO
    {
        public int IdPartido { get; set; }
        public int GolesLocal { get; set; }
        public int GolesVisitante { get; set; }
        public int GolesPenalesLocal { get; set; }
        public int GolesPenalesVisitante { get; set; }
        public bool PagoArbitrajeLocal { get; set; }
        public bool PagoArbitrajeVisitante { get; set; }
        public int IdEstado { get; set; }
    }
}
