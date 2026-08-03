namespace CapaEntidad.DTOs
{
    public class DetalleSancionDTO
    {
        public int IdSancion { get; set; }
        public int Minuto { get; set; }
        public string TipoEvento { get; set; }
        public int IdTipoEvento { get; set; }
        public string NombreJugador { get; set; }
        public int Dorsal { get; set; }
        public decimal Monto { get; set; }
    }
}
