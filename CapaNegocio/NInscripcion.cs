using CapaDatos;
using CapaEntidad.DTOs;
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
    public class NInscripcion
    {
        #region "PATRON SINGLETON"
        private static NInscripcion instancia = null;
        private NInscripcion() { }
        public static NInscripcion GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NInscripcion();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditInscripcion(EInscripcion objeto)
        {
            return DInscripcion.GetInstance().GuardarOrEditInscripcion(objeto);
        }

        public Respuesta<List<InscritosDTO>> ListaEquiposInscritos(int IdTorneo, int IdCategoria)
        {
            return DInscripcion.GetInstance().ListaEquiposInscritos(IdTorneo, IdCategoria);
        }

        public Respuesta<InscritosDTO> BuscarEquipoInscrito(int IdEquipo)
        {
            return DInscripcion.GetInstance().BuscarEquipoInscrito(IdEquipo);
        }

        public Respuesta<List<PlantelJugadoresDTO>> ListaJugadoresElegibles(int IdEquipo)
        {
            return DInscripcion.GetInstance().ListaJugadoresElegibles(IdEquipo);
        }

        public Respuesta<int> GuardarPlantillaMasiva(int idEquipo, string jsonJugadores)
        {
            return DInscripcion.GetInstance().GuardarPlantillaMasiva(idEquipo, jsonJugadores);
        }

        public Respuesta<int> GuardarCuerpoTecnicoMasiva(DataTable dtDetalles)
        {
            return DInscripcion.GetInstance().GuardarCuerpoTecnicoMasiva(dtDetalles);
        }

        public Respuesta<List<ListCuerpoTecnicoDTO>> ListaCuerpoTecnico(int IdEquipo)
        {
            return DInscripcion.GetInstance().ListaCuerpoTecnico(IdEquipo);
        }

    }
}
