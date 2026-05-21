namespace CapaEntidad.DTOs
{
    public class InscritosDTO
    {
        public int IdEquipo { get; set; }
        public int IdClub { get; set; }
        public string NombreClub { get; set; }
        public string LogoUrl { get; set; }
        public int IdCategoria { get; set; }
        public int IdTorneo { get; set; }
        public int IdSerie { get; set; }
        public string NombreSerie { get; set; }
        public int PuntosPenalizacion { get; set; }
        public bool InscripcionPagada { get; set; }
    }
}
