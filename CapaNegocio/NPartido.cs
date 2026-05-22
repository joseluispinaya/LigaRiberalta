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
    public class NPartido
    {
        #region "PATRON SINGLETON"
        private static NPartido instancia = null;
        private NPartido() { }
        public static NPartido GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NPartido();
            }
            return instancia;
        }
        #endregion

        public Respuesta<List<ResumenSerieDTO>> ResumenSeries(int IdTorneo, int IdCategoria)
        {
            return DPartido.GetInstance().ResumenSeries(IdTorneo, IdCategoria);
        }

        // MÉTODO 1: OBTENER TABLA DE POSICIONES
        public Respuesta<List<PosicionDTO>> ListaTablaPosiciones(int idTorneo, int idCategoria, int idSerie)
        {
            return DPartido.GetInstance().ListaTablaPosiciones(idTorneo, idCategoria, idSerie);
        }

        // MÉTODO 2: OBTENER FIXTURE / PARTIDOS
        public Respuesta<List<PartidoSerieDTO>> ListaPartidosSerie(int idTorneo, int idCategoria, int idSerie)
        {
            return DPartido.GetInstance().ListaPartidosSerie(idTorneo, idCategoria, idSerie);
        }

        public Respuesta<List<EFasesTorneo>> FasesTorneo()
        {
            return DPartido.GetInstance().FasesTorneo();
        }

        public Respuesta<List<ComboEquipoDTO>> ListaEquiposSerieCombo(int idTorneo, int idCategoria, int idSerie)
        {
            return DPartido.GetInstance().ListaEquiposSerieCombo(idTorneo, idCategoria, idSerie);
        }

        public Respuesta<int> ProgramarPartido(ProgramarPartidoDTO obj, DateTime FechaPartido, TimeSpan HoraPartido)
        {
            return DPartido.GetInstance().ProgramarPartido(obj, FechaPartido, HoraPartido);
        }
    }
}
