namespace CapaEntidad.DTOs
{
    public class EventoPartidoDTO
    {
        public int IdPartido { get; set; }
        public int IdJugador { get; set; }
        public int IdTipoEvento { get; set; }
        public int Minuto { get; set; }
        public string Observaciones { get; set; }
    }
}
