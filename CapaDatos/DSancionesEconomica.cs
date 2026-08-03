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
    public class DSancionesEconomica
    {
        #region "PATRON SINGLETON"
        private static DSancionesEconomica instancia = null;
        private DSancionesEconomica() { }
        public static DSancionesEconomica GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DSancionesEconomica();
            }
            return instancia;
        }
        #endregion

        public Respuesta<List<EquipoDeudorSancionDTO>> ObtenerEquiposDeudoresSanciones(int idTorneo, int idCategoria, int idFase)
        {
            try
            {
                List<EquipoDeudorSancionDTO> rptLista = new List<EquipoDeudorSancionDTO>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_EquiposDeudoresSanciones", con))
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
                                rptLista.Add(new EquipoDeudorSancionDTO
                                {
                                    IdPartido = Convert.ToInt32(dr["IdPartido"]),
                                    Fecha = Convert.ToDateTime(dr["Fecha"]).ToString("dd/MM/yyyy"),
                                    Hora = ((TimeSpan)dr["Hora"]).ToString(@"hh\:mm"),
                                    NombreFase = dr["NombreFase"].ToString(),

                                    IdEquipo = Convert.ToInt32(dr["IdEquipo"]),
                                    NombreClub = dr["NombreClub"].ToString(),
                                    LogoUrl = dr["LogoUrl"].ToString(),

                                    NroSanciones = Convert.ToInt32(dr["NroSanciones"]),
                                    DeudaTotal = Convert.ToDecimal(dr["DeudaTotal"])
                                });
                            }
                        }
                    }
                }

                return new Respuesta<List<EquipoDeudorSancionDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Datos obtenidos correctamente."
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<EquipoDeudorSancionDTO>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener las sanciones: {ex.Message}"
                };
            }
        }

        public Respuesta<List<DetalleSancionDTO>> ObtenerDetalleSanciones(int idPartido, int idEquipo)
        {
            try
            {
                List<DetalleSancionDTO> rptLista = new List<DetalleSancionDTO>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_DetalleSancionesEquipoPartido", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdPartido", idPartido);
                        comando.Parameters.AddWithValue("@IdEquipo", idEquipo);

                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new DetalleSancionDTO
                                {
                                    IdSancion = Convert.ToInt32(dr["IdSancion"]),
                                    Minuto = Convert.ToInt32(dr["Minuto"]),
                                    TipoEvento = dr["TipoEvento"].ToString(),
                                    IdTipoEvento = Convert.ToInt32(dr["IdTipoEvento"]),
                                    NombreJugador = dr["NombreJugador"].ToString(),
                                    Dorsal = Convert.ToInt32(dr["Dorsal"]),
                                    Monto = Convert.ToDecimal(dr["Monto"])
                                });
                            }
                        }
                    }
                }

                return new Respuesta<List<DetalleSancionDTO>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Detalles obtenidos correctamente."
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<DetalleSancionDTO>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener los detalles: {ex.Message}"
                };
            }
        }

        public Respuesta<bool> ActualizarPagoSancion(int idSancion)
        {
            try
            {
                bool exito = false;
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ActualizarPagoSancion", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;

                        comando.Parameters.AddWithValue("@IdSancion", idSancion);

                        // Configurar el parámetro OUTPUT
                        SqlParameter ptrResultado = new SqlParameter("@Resultado", SqlDbType.Bit);
                        ptrResultado.Direction = ParameterDirection.Output;
                        comando.Parameters.Add(ptrResultado);

                        con.Open();
                        comando.ExecuteNonQuery();

                        exito = Convert.ToBoolean(ptrResultado.Value);
                    }
                }

                return new Respuesta<bool>()
                {
                    Estado = exito,
                    Valor = exito ? "success" : "warning",
                    Mensaje = exito ? "El pago se registró correctamente." : "No se pudo registrar el pago. Verifique si la sanción existe.",
                    Data = exito
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<bool>()
                {
                    Estado = false,
                    Valor = "error",
                    Mensaje = $"Error de comunicación con la base de datos: {ex.Message}",
                    Data = false
                };
            }
        }

    }
}
