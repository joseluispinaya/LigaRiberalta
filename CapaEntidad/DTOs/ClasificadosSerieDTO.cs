namespace CapaEntidad.DTOs
{
    public class ClasificadosSerieDTO
    {
        public int PosicionClasificacion { get; set; }
        public int IdEquipo { get; set; }
        public string NombreClub { get; set; }
        public string LogoUrl { get; set; }
        public int DG { get; set; } // Diferencia de Goles
        public int Puntos { get; set; }
    }
}
