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

    }
}
