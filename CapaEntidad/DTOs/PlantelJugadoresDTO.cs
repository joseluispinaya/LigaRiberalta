namespace CapaEntidad.DTOs
{
    public class PlantelJugadoresDTO
    {
        public int IdJugador { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string NroComet { get; set; }
        public string CI { get; set; }
        public string FechaNacimiento { get; set; } // Ej: "03/05/2016" para mostrar en el frontend
        public string FotografiaUrl { get; set; }
        public int EdadDeportiva { get; set; }
    }
}
