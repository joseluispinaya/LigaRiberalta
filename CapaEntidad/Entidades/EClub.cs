namespace CapaEntidad.Entidades
{
    public class EClub
    {
        public int IdClub { get; set; }
        public string NombreClub { get; set; }
        public string LogoUrl { get; set; }

        // Reciben el JSON crudo del frontend
        public string FechaFundacion { get; set; } // Ej: "03/05/2026"
        public bool Estado { get; set; }
    }
}
