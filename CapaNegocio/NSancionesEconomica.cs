using CapaDatos;
using CapaEntidad.DTOs;
using CapaEntidad.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaNegocio
{
    public class NSancionesEconomica
    {
        #region "PATRON SINGLETON"
        private static NSancionesEconomica instancia = null;
        private NSancionesEconomica() { }
        public static NSancionesEconomica GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NSancionesEconomica();
            }
            return instancia;
        }
        #endregion

        public Respuesta<List<EquipoDeudorSancionDTO>> ObtenerEquiposDeudoresSanciones(int idTorneo, int idCategoria, int idFase)
        {
            return DSancionesEconomica.GetInstance().ObtenerEquiposDeudoresSanciones(idTorneo, idCategoria, idFase);
        }

        public Respuesta<List<DetalleSancionDTO>> ObtenerDetalleSanciones(int idPartido, int idEquipo)
        {
            return DSancionesEconomica.GetInstance().ObtenerDetalleSanciones(idPartido, idEquipo);
        }

        public Respuesta<bool> ActualizarPagoSancion(int idSancion)
        {
            return DSancionesEconomica.GetInstance().ActualizarPagoSancion(idSancion);
        }

    }
}
