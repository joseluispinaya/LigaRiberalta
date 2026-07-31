using CapaEntidad.DTOs;
using CapaEntidad.Entidades;
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
    public class DPartido
    {
        #region "PATRON SINGLETON"
        private static DPartido instancia = null;
        private DPartido() { }
        public static DPartido GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DPartido();
            }
            return instancia;
        }
        #endregion

        public Respuesta<List<ResumenSerieDTO>> ResumenSeries(int IdTorneo, int IdCategoria)
        {
            try
            {
                List<ResumenSerieDTO> rptLista = new List<ResumenSerieDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerResumenSeries", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdTorneo", IdTorneo);
                        comando.Parameters.AddWithValue("@IdCategoria", IdCategoria);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ResumenSerieDTO
                                {
                                    IdSerie = Convert.ToInt32(dr["IdSerie"]),
                                    NombreSerie = dr["NombreSerie"].ToString(),
                                    NroEquipos = Convert.ToInt32(dr["NroEquipos"]),
                                    NroPartidos = Convert.ToInt32(dr["NroPartidos"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ResumenSerieDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<ResumenSerieDTO>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        // MÉTODO 1: OBTENER TABLA DE POSICIONES
        public Respuesta<List<PosicionDTO>> ListaTablaPosiciones(int idTorneo, int idCategoria, int idSerie)
        {
            try
            {
                List<PosicionDTO> rptLista = new List<PosicionDTO>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerTablaPosiciones", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdTorneo", idTorneo);
                        comando.Parameters.AddWithValue("@IdCategoria", idCategoria);
                        comando.Parameters.AddWithValue("@IdSerie", idSerie);

                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new PosicionDTO
                                {
                                    IdEquipo = Convert.ToInt32(dr["IdEquipo"]),
                                    NombreClub = dr["NombreClub"].ToString(),
                                    LogoUrl = dr["LogoUrl"].ToString(),
                                    PJ = Convert.ToInt32(dr["PJ"]),
                                    PG = Convert.ToInt32(dr["PG"]),
                                    PE = Convert.ToInt32(dr["PE"]),
                                    PP = Convert.ToInt32(dr["PP"]),
                                    GF = Convert.ToInt32(dr["GF"]),
                                    GC = Convert.ToInt32(dr["GC"]),
                                    DG = Convert.ToInt32(dr["DG"]),
                                    PuntosPenalizacion = Convert.ToInt32(dr["PuntosPenalizacion"]),
                                    Puntos = Convert.ToInt32(dr["Puntos"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<PosicionDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Tabla de posiciones generada correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<PosicionDTO>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la tabla de posiciones: {ex.Message}"
                };
            }
        }

        // MÉTODO 2: OBTENER FIXTURE / PARTIDOS
        public Respuesta<List<PartidoSerieDTO>> ListaPartidosSerie(int idTorneo, int idCategoria, int idSerie)
        {
            try
            {
                List<PartidoSerieDTO> rptLista = new List<PartidoSerieDTO>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerPartidosSerie", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdTorneo", idTorneo);
                        comando.Parameters.AddWithValue("@IdCategoria", idCategoria);
                        comando.Parameters.AddWithValue("@IdSerie", idSerie);

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

        public Respuesta<List<EFasesTorneo>> FasesTorneo()
        {
            try
            {
                List<EFasesTorneo> rptLista = new List<EFasesTorneo>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerFasesCombo", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EFasesTorneo
                                {
                                    IdFase = Convert.ToInt32(dr["IdFase"]),
                                    NombreFase = dr["NombreFase"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EFasesTorneo>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<EFasesTorneo>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

        public Respuesta<List<ComboEquipoDTO>> ListaEquiposSerieCombo(int idTorneo, int idCategoria, int idSerie)
        {
            try
            {
                List<ComboEquipoDTO> rptLista = new List<ComboEquipoDTO>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerEquiposSerieCombo", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdTorneo", idTorneo);
                        comando.Parameters.AddWithValue("@IdCategoria", idCategoria);
                        comando.Parameters.AddWithValue("@IdSerie", idSerie);

                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ComboEquipoDTO
                                {
                                    IdEquipo = Convert.ToInt32(dr["IdEquipo"]),
                                    NombreClub = dr["NombreClub"].ToString(),
                                    LogoUrl = dr["LogoUrl"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ComboEquipoDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Equipos de la serie generados correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<ComboEquipoDTO>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener los equipos de la serie: {ex.Message}"
                };
            }
        }

        public Respuesta<int> ProgramarPartido(ProgramarPartidoDTO obj, DateTime FechaPartido, TimeSpan HoraPartido)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ProgramarPartido", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdEquipoLocal", obj.IdEquipoLocal);
                        cmd.Parameters.AddWithValue("@IdEquipoVisitante", obj.IdEquipoVisitante);
                        cmd.Parameters.AddWithValue("@IdFase", obj.IdFase);
                        cmd.Parameters.AddWithValue("@Fecha", FechaPartido);
                        cmd.Parameters.AddWithValue("@Hora", HoraPartido);
                        cmd.Parameters.AddWithValue("@Cancha", obj.Cancha);

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
                        response.Mensaje = "Partido programado correctamente en el fixture.";
                        break;
                    case 1:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "Error: Un equipo no puede jugar contra sí mismo.";
                        break;
                    case 4:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "Cruce de horarios: Ya existe un partido programado en esa cancha, fecha y hora.";
                        break;
                    case 5:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "Error: Los equipos no pertenecen al mismo torneo o categoría.";
                        break;
                    default:
                        response.Estado = false;
                        response.Valor = "error";
                        response.Mensaje = "No se pudo completar la programación del partido.";
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

        public Respuesta<List<EstadoPartido>> ListaEstadosPartido()
        {
            try
            {
                List<EstadoPartido> rptLista = new List<EstadoPartido>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListarEstadosPartido", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EstadoPartido
                                {
                                    IdEstado = Convert.ToInt32(dr["IdEstado"]),
                                    NombreEstado = dr["NombreEstado"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EstadoPartido>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<EstadoPartido>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

        public Respuesta<int> ResultadoPartido(ResultadosPartidoDTO obj)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_RegistrarResultadoPartido", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // Parámetros de entrada
                        cmd.Parameters.AddWithValue("@IdPartido", obj.IdPartido);
                        cmd.Parameters.AddWithValue("@GolesLocal", obj.GolesLocal);
                        cmd.Parameters.AddWithValue("@GolesVisitante", obj.GolesVisitante);

                        // Manejo seguro de nulos para los penales (opcional, si decides enviar 0 o NULL)
                        cmd.Parameters.AddWithValue("@GolesPenalesLocal", obj.GolesPenalesLocal);
                        cmd.Parameters.AddWithValue("@GolesPenalesVisitante", obj.GolesPenalesVisitante);

                        cmd.Parameters.AddWithValue("@PagoArbitrajeLocal", obj.PagoArbitrajeLocal);
                        cmd.Parameters.AddWithValue("@PagoArbitrajeVisitante", obj.PagoArbitrajeVisitante);
                        cmd.Parameters.AddWithValue("@IdEstado", obj.IdEstado);

                        // Parámetro de salida
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

                // Mapeo de las respuestas de tu SQL
                switch (resultadoCodigo)
                {
                    case 3:
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "El resultado del partido se guardó correctamente.";
                        break;
                    case -1:
                        response.Estado = false;
                        response.Valor = "error";
                        response.Mensaje = "Error crítico en la base de datos al registrar el resultado.";
                        break;
                    default:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "No se pudo actualizar el partido. Verifique los datos.";
                        break;
                }
            }
            catch (Exception ex)
            {
                response.Estado = false;
                response.Valor = "error";
                response.Mensaje = "Error interno: " + ex.Message;
            }

            return response;
        }

        public Respuesta<List<ListaTokensDTO>> ListaTokensNoti()
        {
            try
            {
                List<ListaTokensDTO> rptLista = new List<ListaTokensDTO>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerTodosTokensPush", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ListaTokensDTO
                                {
                                    ExpoPushToken = dr["ExpoPushToken"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ListaTokensDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<ListaTokensDTO>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

        public Respuesta<PartidoSerieDTO> ObtenerDetallePartido(int IdPartido)
        {
            try
            {
                PartidoSerieDTO obj = null;

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerDetallePartido", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdPartido", IdPartido);

                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                obj = new PartidoSerieDTO
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
                                };
                            }
                        }
                    }
                }

                // Si obj es null, es que el correo no existe
                return new Respuesta<PartidoSerieDTO>
                {
                    Estado = obj != null,
                    Data = obj,
                    Mensaje = obj != null ? "Informacion encontrado" : "No se encontro resultados"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<PartidoSerieDTO>
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<List<PlantillaJugadorEvDTO>> ObtenerPlantillaEquipo(int IdEquipo)
        {
            try
            {
                List<PlantillaJugadorEvDTO> rptLista = new List<PlantillaJugadorEvDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerPlantillaPorEquipo", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdEquipo", IdEquipo);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new PlantillaJugadorEvDTO
                                {
                                    IdJugador = Convert.ToInt32(dr["IdJugador"]),
                                    Dorsal = Convert.ToInt32(dr["Dorsal"]),
                                    Nombres = dr["Nombres"].ToString(),
                                    Apellidos = dr["Apellidos"].ToString(),
                                    CI = dr["CI"].ToString(),
                                    FotografiaUrl = dr["FotografiaUrl"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<PlantillaJugadorEvDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<PlantillaJugadorEvDTO>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<int> RegistrarEvento(EventoPartidoDTO obj)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_RegistrarEventoPartido", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // Parámetros de entrada
                        cmd.Parameters.AddWithValue("@IdPartido", obj.IdPartido);
                        cmd.Parameters.AddWithValue("@IdJugador", obj.IdJugador);
                        cmd.Parameters.AddWithValue("@IdTipoEvento", obj.IdTipoEvento);
                        cmd.Parameters.AddWithValue("@Minuto", obj.Minuto);

                        // Manejo seguro de nulos para las observaciones (opcional en SQL)
                        cmd.Parameters.AddWithValue("@Observaciones", string.IsNullOrEmpty(obj.Observaciones) ? (object)DBNull.Value : obj.Observaciones);

                        // Parámetro de salida
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

                // Mapeo de las respuestas de tu SQL
                switch (resultadoCodigo)
                {
                    case 1:
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "El evento se registró correctamente.";
                        break;
                    case -1:
                        response.Estado = false;
                        response.Valor = "error";
                        response.Mensaje = "Error crítico en la base de datos al registrar el evento.";
                        break;
                    default:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "No se pudo registrar el evento. Verifique los datos.";
                        break;
                }
            }
            catch (Exception ex)
            {
                response.Estado = false;
                response.Valor = "error";
                response.Mensaje = "Error interno: " + ex.Message;
            }

            return response;
        }

    }
}
