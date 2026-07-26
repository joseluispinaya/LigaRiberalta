namespace CapaEntidad.DTOs
{
    public class JugadoresDTO
    {
        public int IdClubActual { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string NroComet { get; set; }
        public string CI { get; set; }
        public char Genero { get; set; }
        public string FechaNacimiento { get; set; }
        public string FotografiaUrl { get; set; }
        // NUEVO CAMPO
        public string ClaveHash { get; set; }
    }
}
