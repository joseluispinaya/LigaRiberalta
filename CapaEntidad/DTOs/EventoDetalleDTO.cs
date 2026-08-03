namespace CapaEntidad.DTOs
{
    public class EventoDetalleDTO
    {
        public int IdEvento { get; set; }
        public int Minuto { get; set; }
        public string TipoEvento { get; set; }
        public int IdTipoEvento { get; set; }
        public string NombreJugador { get; set; }
        public int IdEquipo { get; set; }
        public int Dorsal { get; set; }
    }
}
