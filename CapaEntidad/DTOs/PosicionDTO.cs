namespace CapaEntidad.DTOs
{
    public class PosicionDTO
    {
        public int IdEquipo { get; set; }
        public string NombreClub { get; set; }
        public string LogoUrl { get; set; }
        public int PJ { get; set; } // Partidos Jugados
        public int PG { get; set; } // Partidos Ganados
        public int PE { get; set; } // Partidos Empatados
        public int PP { get; set; } // Partidos Perdidos
        public int GF { get; set; } // Goles a Favor
        public int GC { get; set; } // Goles en Contra
        public int DG { get; set; } // Diferencia de Goles
        public int PuntosPenalizacion { get; set; }
        public int Puntos { get; set; }
    }
}
