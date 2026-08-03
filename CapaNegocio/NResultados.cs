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
    public class NResultados
    {
        #region "PATRON SINGLETON"
        private static NResultados instancia = null;
        private NResultados() { }
        public static NResultados GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NResultados();
            }
            return instancia;
        }
        #endregion

        public Respuesta<List<EventoDetalleDTO>> ObtenerEventosPartido(int IdPartido)
        {
            return DResultados.GetInstance().ObtenerEventosPartido(IdPartido);
        }

        public Respuesta<PartidoActaDTO> DetallePartidoActa(int IdPartido)
        {
            return DResultados.GetInstance().DetallePartidoActa(IdPartido);
        }

        public Respuesta<List<PartidoSerieDTO>> ObtenerPartidosFase(int idTorneo, int idCategoria, int idFase)
        {
            return DResultados.GetInstance().ObtenerPartidosFase(idTorneo, idCategoria, idFase);
        }

        public Respuesta<List<InscritosDTO>> ObtenerEquiposDeudores(int IdTorneo, int IdCategoria)
        {
            return DResultados.GetInstance().ObtenerEquiposDeudores(IdTorneo, IdCategoria);
        }

        public Respuesta<List<NotificarPagosDTO>> NotificacionesPagos(int idEquipo)
        {
            return DResultados.GetInstance().NotificacionesPagos(idEquipo);
        }

        public Respuesta<bool> ActualizarPagoInscripcion(int IdEquipo)
        {
            return DResultados.GetInstance().ActualizarPagoInscripcion(IdEquipo);
        }

        public Respuesta<int> ActualizarFechaPartido(int IdPartido, DateTime FechaPartido, TimeSpan HoraPartido, string Cancha)
        {
            return DResultados.GetInstance().ActualizarFechaPartido(IdPartido, FechaPartido, HoraPartido, Cancha);
        }

        public Respuesta<List<EquipoDeudorDTO>> EquiposDeudoresArbitraje(int idTorneo, int idCategoria, int idFase)
        {
            return DResultados.GetInstance().EquiposDeudoresArbitraje(idTorneo, idCategoria, idFase);
        }

        public Respuesta<bool> ActualizarPagoArbitraje(int IdPartido, int IdEquipo)
        {
            return DResultados.GetInstance().ActualizarPagoArbitraje(IdPartido, IdEquipo);
        }
    }
}
