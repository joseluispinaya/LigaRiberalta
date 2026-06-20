using CapaDatos;
using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaNegocio
{
    public class NJugador
    {
        #region "PATRON SINGLETON"
        private static NJugador instancia = null;
        private NJugador() { }
        public static NJugador GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NJugador();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditJugadores(EJugador objeto, DateTime FechaNacimiento)
        {
            return DJugador.GetInstance().GuardarOrEditJugadores(objeto, FechaNacimiento);
        }

        public Respuesta<List<EJugador>> ListaJugadoresIdClub(int IdClub)
        {
            return DJugador.GetInstance().ListaJugadoresIdClub(IdClub);
        }

        public Respuesta<int> GuardarJugadoresMasiva(DataTable dtDetalles)
        {
            return DJugador.GetInstance().GuardarJugadoresMasiva(dtDetalles);
        }
    }
}
