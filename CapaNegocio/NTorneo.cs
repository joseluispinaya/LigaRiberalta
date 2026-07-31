using CapaDatos;
using CapaEntidad.DTOs;
using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaNegocio
{
    public class NTorneo
    {
        #region "PATRON SINGLETON"
        private static NTorneo instancia = null;
        private NTorneo() { }
        public static NTorneo GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NTorneo();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditTorneos(ETorneo objeto)
        {
            return DTorneo.GetInstance().GuardarOrEditTorneos(objeto);
        }

        public Respuesta<List<ETorneo>> ListaTorneos()
        {
            return DTorneo.GetInstance().ListaTorneos();
        }

        public Respuesta<List<ESerie>> ListaSeries()
        {
            return DTorneo.GetInstance().ListaSeries();
        }

        public Respuesta<List<ClasificadosSerieDTO>> ObtenerClasificadosSerie(int idTorneo, int idCategoria, int idSerie)
        {
            return DTorneo.GetInstance().ObtenerClasificadosSerie(idTorneo, idCategoria, idSerie);
        }
    }
}
