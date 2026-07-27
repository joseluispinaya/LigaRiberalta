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
    public class DJugador
    {
        #region "PATRON SINGLETON"
        private static DJugador instancia = null;
        private DJugador() { }
        public static DJugador GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DJugador();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditJugadores(EJugador objeto, DateTime FechaNacimiento)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarOrEditJugadores", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdJugador", objeto.IdJugador);
                        cmd.Parameters.AddWithValue("@IdClubActual", objeto.IdClubActual);
                        cmd.Parameters.AddWithValue("@Nombres", objeto.Nombres);
                        cmd.Parameters.AddWithValue("@Apellidos", objeto.Apellidos);
                        cmd.Parameters.AddWithValue("@NroComet", objeto.NroComet);
                        cmd.Parameters.AddWithValue("@CI", objeto.CI);
                        cmd.Parameters.AddWithValue("@Genero", objeto.Genero);
                        cmd.Parameters.AddWithValue("@FechaNacimiento", FechaNacimiento);
                        cmd.Parameters.AddWithValue("@FotografiaUrl", string.IsNullOrEmpty(objeto.FotografiaUrl) ? "" : objeto.FotografiaUrl);
                        cmd.Parameters.AddWithValue("@ClaveHash", string.IsNullOrEmpty(objeto.ClaveHash) ? "" : objeto.ClaveHash);

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
                        response.Mensaje = "Ya existe un jugador con el Nro. C.I. o Nro. de Credencial ingresados.";
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

        public Respuesta<List<EJugador>> ListaJugadoresIdClub(int IdClub)
        {
            try
            {
                List<EJugador> rptLista = new List<EJugador>();

                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListarJugadoresClub", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        comando.Parameters.AddWithValue("@IdClub", IdClub);
                        con.Open();

                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EJugador
                                {
                                    IdJugador = Convert.ToInt32(dr["IdJugador"]),
                                    IdClubActual = Convert.ToInt32(dr["IdClubActual"]),
                                    Nombres = dr["Nombres"].ToString(),
                                    Apellidos = dr["Apellidos"].ToString(),
                                    NroComet = dr["NroComet"].ToString(),
                                    CI = dr["CI"].ToString(),
                                    Genero = Convert.ToChar(dr["Genero"]),
                                    FechaNacimiento = Convert.ToDateTime(dr["FechaNacimiento"]).ToString("dd/MM/yyyy"),
                                    VFechaNacimiento = Convert.ToDateTime(dr["FechaNacimiento"]),
                                    FotografiaUrl = dr["FotografiaUrl"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EJugador>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenidos correctamente"
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error inesperado
                return new Respuesta<List<EJugador>>()
                {
                    Estado = false,
                    Mensaje = "Ocurrió un error: " + ex.Message,
                    Data = null
                };
            }
        }

        public Respuesta<int> GuardarJugadoresMasiva(DataTable dtDetalles)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;
            int totalEnviados = dtDetalles.Rows.Count; // Cantidad total que intentamos registrar

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarJugadoresMasiva", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        SqlParameter tvpParam = new SqlParameter("@ListaJugadores", SqlDbType.Structured)
                        {
                            TypeName = "dbo.Type_ListaJugadores",
                            Value = dtDetalles
                        };
                        cmd.Parameters.Add(tvpParam);

                        // Parámetro de Salida
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
                    // Éxito Total: Se insertaron todos los registros del Excel
                    response.Estado = true;
                    response.Valor = "success";
                    response.Mensaje = $"Se registraron correctamente los {resultadoCodigo} jugadores.";
                }
                else if (resultadoCodigo > 0 && resultadoCodigo < totalEnviados)
                {
                    // Éxito Parcial: Se insertaron algunos, pero otros fueron ignorados (duplicados)
                    int duplicados = totalEnviados - resultadoCodigo;
                    response.Estado = true; // Sigue siendo true porque la transacción en sí no falló
                    response.Valor = "info";
                    response.Mensaje = $"Se registraron {resultadoCodigo} jugadores nuevos. Se omitieron {duplicados} registros porque el Nro. C.I. o Comet ya existían.";
                }
                else if (resultadoCodigo == 0)
                {
                    // Advertencia: El SP se ejecutó bien, pero ningún jugador era nuevo
                    response.Estado = false;
                    response.Valor = "warning";
                    response.Mensaje = "No se registró ningún jugador. Todos los registros del archivo ya existen en la base de datos.";
                }
                else
                {
                    // Error: El SP devolvió -1 (Cayó en el CATCH de SQL)
                    response.Estado = false;
                    response.Valor = "error";
                    response.Mensaje = "Ocurrió un error interno en la base de datos al procesar el archivo masivo.";
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

    }
}
