using CapaEntidad.DTOs;
using CapaEntidad.Responses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class DResultados
    {
        #region "PATRON SINGLETON"
        private static DResultados instancia = null;
        private DResultados() { }
        public static DResultados GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DResultados();
            }
            return instancia;
        }
        #endregion

        public Respuesta<List<EventoDetalleDTO>> ObtenerEventosPartido(int IdPartido)
        {
            try
            {
                List<EventoDetalleDTO> rptLista = new List<EventoDetalleDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerEventosPartido", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdPartido", IdPartido);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EventoDetalleDTO
                                {
                                    IdEvento = Convert.ToInt32(dr["IdEvento"]),
                                    Minuto = Convert.ToInt32(dr["Minuto"]),
                                    TipoEvento = dr["TipoEvento"].ToString(),
                                    IdTipoEvento = Convert.ToInt32(dr["IdTipoEvento"]),
                                    NombreJugador = dr["NombreJugador"].ToString(),
                                    IdEquipo = Convert.ToInt32(dr["IdEquipo"]),
                                    Dorsal = Convert.ToInt32(dr["Dorsal"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EventoDetalleDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<EventoDetalleDTO>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<PartidoActaDTO> DetallePartidoActa(int IdPartido)
        {
            try
            {
                PartidoActaDTO obj = null;

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerDetallePartidoActa", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdPartido", IdPartido);

                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                obj = new PartidoActaDTO
                                {
                                    IdPartido = Convert.ToInt32(dr["IdPartido"]),

                                    // Formateo limpio de Fecha y Hora para el Frontend
                                    Fecha = Convert.ToDateTime(dr["Fecha"]).ToString("dd/MM/yyyy"),
                                    Hora = ((TimeSpan)dr["Hora"]).ToString(@"hh\:mm"),

                                    Cancha = dr["Cancha"].ToString(),
                                    NombreFase = dr["NombreFase"].ToString(),

                                    IdEquipoLocal = Convert.ToInt32(dr["IdEquipoLocal"]),
                                    ClubLocal = dr["ClubLocal"].ToString(),
                                    LogoLocal = dr["LogoLocal"].ToString(),
                                    GolesLocal = dr["GolesLocal"] != DBNull.Value ? Convert.ToInt32(dr["GolesLocal"]) : 0,
                                    PagoArbitrajeLocal = Convert.ToBoolean(dr["PagoArbitrajeLocal"]),

                                    IdEquipoVisitante = Convert.ToInt32(dr["IdEquipoVisitante"]),
                                    ClubVisitante = dr["ClubVisitante"].ToString(),
                                    LogoVisitante = dr["LogoVisitante"].ToString(),
                                    GolesVisitante = dr["GolesVisitante"] != DBNull.Value ? Convert.ToInt32(dr["GolesVisitante"]) : 0,
                                    PagoArbitrajeVisitante = Convert.ToBoolean(dr["PagoArbitrajeVisitante"]),

                                    IdEstado = Convert.ToInt32(dr["IdEstado"]),
                                    NombreEstado = dr["NombreEstado"].ToString()
                                };
                            }
                        }
                    }
                }

                // Si obj es null, es que el correo no existe
                return new Respuesta<PartidoActaDTO>
                {
                    Estado = obj != null,
                    Data = obj,
                    Mensaje = obj != null ? "Informacion encontrado" : "No se encontro resultados"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<PartidoActaDTO>
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<List<PartidoSerieDTO>> ObtenerPartidosFase(int idTorneo, int idCategoria, int idFase)
        {
            try
            {
                List<PartidoSerieDTO> rptLista = new List<PartidoSerieDTO>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerPartidosFase", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdTorneo", idTorneo);
                        comando.Parameters.AddWithValue("@IdCategoria", idCategoria);
                        comando.Parameters.AddWithValue("@IdFase", idFase);

                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new PartidoSerieDTO
                                {
                                    IdPartido = Convert.ToInt32(dr["IdPartido"]),

                                    // Formateo limpio de Fecha y Hora para el Frontend
                                    Fecha = Convert.ToDateTime(dr["Fecha"]).ToString("dd/MM/yyyy"),
                                    Hora = ((TimeSpan)dr["Hora"]).ToString(@"hh\:mm"),

                                    Cancha = dr["Cancha"].ToString(),
                                    NombreFase = dr["NombreFase"].ToString(),

                                    IdEquipoLocal = Convert.ToInt32(dr["IdEquipoLocal"]),
                                    ClubLocal = dr["ClubLocal"].ToString(),
                                    LogoLocal = dr["LogoLocal"].ToString(),
                                    GolesLocal = dr["GolesLocal"] != DBNull.Value ? Convert.ToInt32(dr["GolesLocal"]) : 0,

                                    IdEquipoVisitante = Convert.ToInt32(dr["IdEquipoVisitante"]),
                                    ClubVisitante = dr["ClubVisitante"].ToString(),
                                    LogoVisitante = dr["LogoVisitante"].ToString(),
                                    GolesVisitante = dr["GolesVisitante"] != DBNull.Value ? Convert.ToInt32(dr["GolesVisitante"]) : 0,

                                    IdEstado = Convert.ToInt32(dr["IdEstado"]),
                                    NombreEstado = dr["NombreEstado"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<PartidoSerieDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Fixture obtenido correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<PartidoSerieDTO>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener los partidos: {ex.Message}"
                };
            }
        }

        public Respuesta<List<InscritosDTO>> ObtenerEquiposDeudores(int IdTorneo, int IdCategoria)
        {
            try
            {
                List<InscritosDTO> rptLista = new List<InscritosDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerEquiposDeudores", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdTorneo", IdTorneo);
                        comando.Parameters.AddWithValue("@IdCategoria", IdCategoria);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new InscritosDTO
                                {
                                    IdEquipo = Convert.ToInt32(dr["IdEquipo"]),
                                    NombreClub = dr["NombreClub"].ToString(),
                                    LogoUrl = dr["LogoUrl"].ToString(),
                                    // nombre serie uso como fecha del equipo
                                    NombreSerie = dr["FechaFundacion"].ToString(),
                                    PuntosPenalizacion = Convert.ToInt32(dr["PuntosPenalizacion"]),
                                    InscripcionPagada = Convert.ToBoolean(dr["InscripcionPagada"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<InscritosDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<InscritosDTO>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<List<NotificarPagosDTO>> NotificacionesPagos(int idEquipo)
        {
            try
            {
                List<NotificarPagosDTO> rptLista = new List<NotificarPagosDTO>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_CuerpoTecnicoNotificaciones", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdEquipo", idEquipo);
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new NotificarPagosDTO
                                {
                                    IdEquipo = Convert.ToInt32(dr["IdEquipo"]),
                                    NombreTecnico = dr["NombreTecnico"].ToString(),
                                    ExpoPushToken = dr["ExpoPushToken"].ToString(),
                                    Cargo = dr["Cargo"].ToString(),
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<NotificarPagosDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<NotificarPagosDTO>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

        public Respuesta<bool> ActualizarPagoInscripcion(int IdEquipo)
        {
            Respuesta<bool> response = new Respuesta<bool>();
            bool result = false;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ActualizarPagoInscripcion", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdEquipo", IdEquipo);

                        SqlParameter outputParam = new SqlParameter("@Resultado", SqlDbType.Bit)
                        {
                            Direction = ParameterDirection.Output
                        };
                        cmd.Parameters.Add(outputParam);

                        con.Open();
                        cmd.ExecuteNonQuery();
                        result = Convert.ToBoolean(outputParam.Value);
                    }
                }

                response.Data = result;

                // Interpretamos el código que devuelve tu SP
                if (result)
                {
                    response.Estado = true;
                    response.Valor = "success";
                    response.Mensaje = "Pago de inscripción actualizado.";
                }
                else
                {
                    response.Estado = false;
                    response.Valor = "error";
                    response.Mensaje = "No se pudo actualizar el pago de inscripción.";
                }

            }
            catch (Exception ex)
            {
                response.Estado = false;
                response.Valor = "error";
                response.Mensaje = "Error en Base de Datos: " + ex.Message;
            }

            return response;
        }

        public Respuesta<int> ActualizarFechaPartido(int IdPartido, DateTime FechaPartido, TimeSpan HoraPartido, string Cancha)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ActualizarFechaPartido", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdPartido", IdPartido);
                        cmd.Parameters.AddWithValue("@Fecha", FechaPartido);
                        cmd.Parameters.AddWithValue("@Hora", HoraPartido);
                        cmd.Parameters.AddWithValue("@Cancha", Cancha);

                        SqlParameter outputParam = new SqlParameter("@Resultado", SqlDbType.Int)
                        {
                            Direction = ParameterDirection.Output
                        };
                        cmd.Parameters.Add(outputParam);

                        con.Open();
                        cmd.ExecuteNonQuery();

                        resultadoCodigo = Convert.ToInt32(outputParam.Value);
                    }
                }

                response.Data = resultadoCodigo;

                // 2. Mapeo de las respuestas de tu SQL
                switch (resultadoCodigo)
                {
                    case 2:
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Partido actualizado correctamente.";
                        break;
                    case 1:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "Error: No se encontró el partido a actualizar.";
                        break;
                    case 4:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "Cruce de horarios: Ya existe un partido programado en esa cancha, fecha y hora.";
                        break;
                    default:
                        response.Estado = false;
                        response.Valor = "error";
                        response.Mensaje = "No se pudo completar la actualización del partido.";
                        break;
                }
            }
            catch (Exception ex)
            {
                //response.Data = 0;
                response.Estado = false;
                response.Valor = "error";
                response.Mensaje = "Error interno: " + ex.Message;
            }

            return response;
        }

        public Respuesta<List<EquipoDeudorDTO>> EquiposDeudoresArbitraje(int idTorneo, int idCategoria, int idFase)
        {
            try
            {
                List<EquipoDeudorDTO> rptLista = new List<EquipoDeudorDTO>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_EquiposDeudoresArbitraje", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdTorneo", idTorneo);
                        comando.Parameters.AddWithValue("@IdCategoria", idCategoria);
                        comando.Parameters.AddWithValue("@IdFase", idFase);

                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EquipoDeudorDTO
                                {
                                    IdPartido = Convert.ToInt32(dr["IdPartido"]),

                                    // Formateo limpio de Fecha y Hora para el Frontend
                                    Fecha = Convert.ToDateTime(dr["Fecha"]).ToString("dd/MM/yyyy"),
                                    Hora = ((TimeSpan)dr["Hora"]).ToString(@"hh\:mm"),

                                    Cancha = dr["Cancha"].ToString(),
                                    NombreFase = dr["NombreFase"].ToString(),

                                    // Datos del Equipo
                                    IdEquipo = Convert.ToInt32(dr["IdEquipo"]),
                                    NombreClub = dr["NombreClub"].ToString(),
                                    LogoUrl = dr["LogoUrl"].ToString(),

                                    // Contexto
                                    Condicion = dr["Condicion"].ToString(),
                                    GolesAnotados = dr["GolesAnotados"] != DBNull.Value ? Convert.ToInt32(dr["GolesAnotados"]) : 0
                                });
                            }
                        }
                    }
                }

                return new Respuesta<List<EquipoDeudorDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Equipos deudores obtenidos correctamente."
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<EquipoDeudorDTO>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener los equipos deudores: {ex.Message}"
                };
            }
        }

        public Respuesta<bool> ActualizarPagoArbitraje(int IdPartido, int IdEquipo)
        {
            Respuesta<bool> response = new Respuesta<bool>();
            bool result = false;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ActualizarPagoArbitraje", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdPartido", IdPartido);
                        cmd.Parameters.AddWithValue("@IdEquipo", IdEquipo);

                        SqlParameter outputParam = new SqlParameter("@Resultado", SqlDbType.Bit)
                        {
                            Direction = ParameterDirection.Output
                        };
                        cmd.Parameters.Add(outputParam);

                        con.Open();
                        cmd.ExecuteNonQuery();
                        result = Convert.ToBoolean(outputParam.Value);
                    }
                }

                response.Data = result;

                // Interpretamos el código que devuelve tu SP
                if (result)
                {
                    response.Estado = true;
                    response.Valor = "success";
                    response.Mensaje = "Pago de arbitraje actualizado.";
                }
                else
                {
                    response.Estado = false;
                    response.Valor = "error";
                    response.Mensaje = "No se pudo actualizar el pago de arbitraje.";
                }

            }
            catch (Exception ex)
            {
                response.Estado = false;
                response.Valor = "error";
                response.Mensaje = "Error en Base de Datos: " + ex.Message;
            }

            return response;
        }

    }
}
