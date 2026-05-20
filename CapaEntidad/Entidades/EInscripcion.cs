namespace CapaEntidad.Entidades
{
    public class EInscripcion
    {
        public int IdEquipo { get; set; }
        public int IdClub { get; set; }
        public int IdCategoria { get; set; }
        public int IdTorneo { get; set; }
        public int IdSerie { get; set; }
        public int PuntosPenalizacion { get; set; }
        public bool InscripcionPagada { get; set; }
    }
}
