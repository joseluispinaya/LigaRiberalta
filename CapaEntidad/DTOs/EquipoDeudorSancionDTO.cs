namespace CapaEntidad.DTOs
{
    public class EquipoDeudorSancionDTO
    {
        public int IdPartido { get; set; }
        public string Fecha { get; set; }
        public string Hora { get; set; }
        public string NombreFase { get; set; }

        public int IdEquipo { get; set; }
        public string NombreClub { get; set; }
        public string LogoUrl { get; set; }

        public int NroSanciones { get; set; }
        public decimal DeudaTotal { get; set; }
    }
}
