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
    public class DTorneo
    {
        #region "PATRON SINGLETON"
        private static DTorneo instancia = null;
        private DTorneo() { }
        public static DTorneo GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DTorneo();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditTorneos(ETorneo objeto)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarOrEditTorneos", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdTorneo", objeto.IdTorneo);
                        cmd.Parameters.AddWithValue("@NombreTorneo", objeto.NombreTorneo);
                        cmd.Parameters.AddWithValue("@Gestion", objeto.Gestion);
                        cmd.Parameters.AddWithValue("@PuntosVictoriaLocal", objeto.PuntosVictoriaLocal);
                        cmd.Parameters.AddWithValue("@PuntosVictoriaVisitante", objeto.PuntosVictoriaVisitante);
                        cmd.Parameters.AddWithValue("@PuntosEmpateLocal", objeto.PuntosEmpateLocal);
                        cmd.Parameters.AddWithValue("@PuntosEmpateVisitante", objeto.PuntosEmpateVisitante);
                        cmd.Parameters.AddWithValue("@Estado", objeto.Estado);

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
                        response.Mensaje = "Ya existe un torneo con ese nombre.";
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

        public Respuesta<List<ETorneo>> ListaTorneos()
        {
            try
            {
                List<ETorneo> rptLista = new List<ETorneo>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_TorneosListar", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ETorneo
                                {
                                    IdTorneo = Convert.ToInt32(dr["IdTorneo"]),
                                    NombreTorneo = dr["NombreTorneo"].ToString(),
                                    Gestion = Convert.ToInt32(dr["Gestion"]),
                                    PuntosVictoriaLocal = Convert.ToInt32(dr["PuntosVictoriaLocal"]),
                                    PuntosVictoriaVisitante = Convert.ToInt32(dr["PuntosVictoriaVisitante"]),
                                    PuntosEmpateLocal = Convert.ToInt32(dr["PuntosEmpateLocal"]),
                                    PuntosEmpateVisitante = Convert.ToInt32(dr["PuntosEmpateVisitante"]),
                                    Estado = Convert.ToBoolean(dr["Estado"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ETorneo>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<ETorneo>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

        public Respuesta<List<ESerie>> ListaSeries()
        {
            try
            {
                List<ESerie> rptLista = new List<ESerie>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListarSeries", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ESerie
                                {
                                    IdSerie = Convert.ToInt32(dr["IdSerie"]),
                                    NombreSerie = dr["NombreSerie"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ESerie>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<ESerie>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

        public Respuesta<List<ClasificadosSerieDTO>> ObtenerClasificadosSerie(int idTorneo, int idCategoria, int idSerie)
        {
            try
            {
                List<ClasificadosSerieDTO> rptLista = new List<ClasificadosSerieDTO>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ObtenerClasificadosSerie", con))
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
                                rptLista.Add(new ClasificadosSerieDTO
                                {
                                    PosicionClasificacion = Convert.ToInt32(dr["PosicionClasificacion"]),
                                    IdEquipo = Convert.ToInt32(dr["IdEquipo"]),
                                    NombreClub = dr["NombreClub"].ToString(),
                                    LogoUrl = dr["LogoUrl"].ToString(),
                                    DG = Convert.ToInt32(dr["DG"]),
                                    Puntos = Convert.ToInt32(dr["Puntos"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ClasificadosSerieDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Clasificados obtenido correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<ClasificadosSerieDTO>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener los Clasificados: {ex.Message}"
                };
            }
        }

    }
}
