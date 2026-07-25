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
    public class DInscripcion
    {
        #region "PATRON SINGLETON"
        private static DInscripcion instancia = null;
        private DInscripcion() { }
        public static DInscripcion GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DInscripcion();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditInscripcion(EInscripcion objeto)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarOrEditEquiposInscritos", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdEquipo", objeto.IdEquipo);
                        cmd.Parameters.AddWithValue("@IdClub", objeto.IdClub);
                        cmd.Parameters.AddWithValue("@IdTorneo", objeto.IdTorneo);
                        cmd.Parameters.AddWithValue("@IdCategoria", objeto.IdCategoria);
                        cmd.Parameters.AddWithValue("@IdSerie", objeto.IdSerie);
                        cmd.Parameters.AddWithValue("@PuntosPenalizacion", objeto.PuntosPenalizacion);
                        cmd.Parameters.AddWithValue("@InscripcionPagada", objeto.InscripcionPagada);

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

                switch (resultadoCodigo)
                {
                    case 1: // duplicado validar
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "El club ya está inscrito en esta categoría y torneo.";
                        break;

                    case 2: // Registrado
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Registrado correctamente.";
                        break;

                    case 3: // Actualizado
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Actualizado correctamente.";
                        break;

                    case 0: // Error
                    default:
                        response.Estado = false;
                        response.Valor = "error";
                        response.Mensaje = "No se pudo completar la operación.";
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

        public Respuesta<List<InscritosDTO>> ListaEquiposInscritos(int IdTorneo, int IdCategoria)
        {
            try
            {
                List<InscritosDTO> rptLista = new List<InscritosDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerEquiposInscritos", con))
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
                                    IdClub = Convert.ToInt32(dr["IdClub"]),
                                    NombreClub = dr["NombreClub"].ToString(),
                                    LogoUrl = dr["LogoUrl"].ToString(),
                                    IdCategoria = Convert.ToInt32(dr["IdCategoria"]),
                                    IdTorneo = Convert.ToInt32(dr["IdTorneo"]),
                                    IdSerie = Convert.ToInt32(dr["IdSerie"]),
                                    NombreSerie = dr["NombreSerie"].ToString(),
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

        public Respuesta<InscritosDTO> BuscarEquipoInscrito(int IdEquipo)
        {
            try
            {
                InscritosDTO obj = null;

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_BuscarEquipoInscrito", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdEquipo", IdEquipo);

                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                obj = new InscritosDTO
                                {
                                    IdEquipo = Convert.ToInt32(dr["IdEquipo"]),
                                    IdClub = Convert.ToInt32(dr["IdClub"]),
                                    NombreClub = dr["NombreClub"].ToString(),
                                    LogoUrl = dr["LogoUrl"].ToString(),
                                    IdCategoria = Convert.ToInt32(dr["IdCategoria"]),
                                    IdTorneo = Convert.ToInt32(dr["IdTorneo"]),
                                    IdSerie = Convert.ToInt32(dr["IdSerie"]),
                                    NombreSerie = dr["NombreSerie"].ToString(),
                                    PuntosPenalizacion = Convert.ToInt32(dr["PuntosPenalizacion"]),
                                    InscripcionPagada = Convert.ToBoolean(dr["InscripcionPagada"])
                                };
                            }
                        }
                    }
                }

                // Si obj es null, es que el correo no existe
                return new Respuesta<InscritosDTO>
                {
                    Estado = obj != null,
                    Data = obj,
                    // Es buena práctica de seguridad decir "Credenciales incorrectas" y no "Correo no existe"
                    Mensaje = obj != null ? "Equipo encontrado" : "Equipo no encontrado"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<InscritosDTO>
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<List<PlantelJugadoresDTO>> ListaJugadoresElegibles(int IdEquipo)
        {
            try
            {
                List<PlantelJugadoresDTO> rptLista = new List<PlantelJugadoresDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerJugadoresElegibles", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdEquipo", IdEquipo);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new PlantelJugadoresDTO
                                {
                                    IdJugador = Convert.ToInt32(dr["IdJugador"]),
                                    Nombres = dr["Nombres"].ToString(),
                                    Apellidos = dr["Apellidos"].ToString(),
                                    NroComet = dr["NroComet"].ToString(),
                                    CI = dr["CI"].ToString(),
                                    EdadDeportiva = Convert.ToInt32(dr["EdadDeportiva"]),
                                    FechaNacimiento = Convert.ToDateTime(dr["FechaNacimiento"]).ToString("dd/MM/yyyy"),
                                    FotografiaUrl = dr["FotografiaUrl"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<PlantelJugadoresDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<PlantelJugadoresDTO>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<int> GuardarPlantillaMasiva(int idEquipo, string jsonJugadores)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarPlantillaMasiva", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdEquipo", idEquipo);
                        cmd.Parameters.AddWithValue("@JsonJugadores", jsonJugadores);

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

                switch (resultadoCodigo)
                {
                    case 2:
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Plantilla guardada correctamente.";
                        break;
                    case 4:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "Error: Uno o más números de camiseta ya están registrados en este equipo.";
                        break;
                    case 5:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "Error: Hay números de camiseta duplicados en la lista enviada.";
                        break;
                    default:
                        response.Estado = false;
                        response.Valor = "error";
                        response.Mensaje = "No se pudo completar la operación.";
                        break;
                }
            }
            catch (Exception ex)
            {
                response.Estado = false;
                response.Valor = "error";
                response.Mensaje = "Error de base de datos: " + ex.Message;
            }

            return response;
        }

        public Respuesta<int> GuardarCuerpoTecnicoMasiva(DataTable dtDetalles)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;
            int totalEnviados = dtDetalles.Rows.Count;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarCuerpoTecnicoMasiva", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        SqlParameter tvpParam = new SqlParameter("@ListaCuerpoTecnico", SqlDbType.Structured)
                        {
                            TypeName = "dbo.Type_ListaCuerpoTecnico",
                            Value = dtDetalles
                        };
                        cmd.Parameters.Add(tvpParam);

                        SqlParameter outputParam = new SqlParameter("@FilasInsertadas", SqlDbType.Int)
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

                // EVALUACIÓN BASADA EN CANTIDAD DE FILAS INSERTADAS
                if (resultadoCodigo == totalEnviados)
                {
                    response.Estado = true;
                    response.Valor = "success";
                    response.Mensaje = $"Se registraron correctamente los {resultadoCodigo} miembros del cuerpo técnico.";
                }
                else if (resultadoCodigo > 0 && resultadoCodigo < totalEnviados)
                {
                    int duplicados = totalEnviados - resultadoCodigo;
                    response.Estado = true;
                    response.Valor = "info";
                    response.Mensaje = $"Se registraron {resultadoCodigo} miembros. Se omitieron {duplicados} registros porque el C.I. ya estaba registrado en este equipo.";
                }
                else if (resultadoCodigo == 0)
                {
                    response.Estado = false;
                    response.Valor = "warning";
                    response.Mensaje = "No se registró a nadie. Todos los miembros del archivo ya existen en este equipo.";
                }
                else
                {
                    response.Estado = false;
                    response.Valor = "error";
                    response.Mensaje = "Ocurrió un error interno en la base de datos al procesar el archivo.";
                }
            }
            catch (Exception ex)
            {
                response.Estado = false;
                response.Valor = "error";
                response.Mensaje = "Error de conexión o ejecución: " + ex.Message;
            }

            return response;
        }

        public Respuesta<List<ListCuerpoTecnicoDTO>> ListaCuerpoTecnico(int IdEquipo)
        {
            try
            {
                List<ListCuerpoTecnicoDTO> rptLista = new List<ListCuerpoTecnicoDTO>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerCuerpoTecnicoList", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdEquipo", IdEquipo);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ListCuerpoTecnicoDTO
                                {
                                    IdMiembro = Convert.ToInt32(dr["IdMiembro"]),
                                    IdEquipo = Convert.ToInt32(dr["IdEquipo"]),
                                    Nombres = dr["Nombres"].ToString(),
                                    Apellidos = dr["Apellidos"].ToString(),
                                    IdCargo = Convert.ToInt32(dr["IdCargo"]),
                                    CI = dr["CI"].ToString(),
                                    Cargo = dr["Cargo"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ListCuerpoTecnicoDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<ListCuerpoTecnicoDTO>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

    }
}
