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
    public class DUsuario
    {
        #region "PATRON SINGLETON"
        private static DUsuario instancia = null;
        private DUsuario() { }
        public static DUsuario GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DUsuario();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditUsuarios(EUsuario objeto)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarUsuario", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@IdUsuario", objeto.IdUsuario);
                        cmd.Parameters.AddWithValue("@IdRol", objeto.IdRol);
                        cmd.Parameters.AddWithValue("@NroCi", objeto.NroCi);
                        cmd.Parameters.AddWithValue("@Nombres", objeto.Nombres);
                        cmd.Parameters.AddWithValue("@Apellidos", objeto.Apellidos);
                        cmd.Parameters.AddWithValue("@Celular", objeto.Celular);
                        cmd.Parameters.AddWithValue("@Correo", objeto.Correo);

                        // Aseguramos que si en actualización no envías clave, llegue como cadena vacía
                        cmd.Parameters.AddWithValue("@Clave", string.IsNullOrEmpty(objeto.Clave) ? "" : objeto.Clave);
                        cmd.Parameters.AddWithValue("@FotoUrl", string.IsNullOrEmpty(objeto.FotoUrl) ? "" : objeto.FotoUrl);

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
                    case 1:
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Usuario registrado correctamente.";
                        break;

                    case 2:
                        response.Estado = true;
                        response.Valor = "success";
                        response.Mensaje = "Usuario actualizado correctamente.";
                        break;

                    case -1:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "El Nro. de CI ya se encuentra registrado por otro usuario.";
                        break;

                    case -2:
                        response.Estado = false;
                        response.Valor = "warning";
                        response.Mensaje = "El Correo Electrónico ingresado ya está en uso.";
                        break;

                    case 0:
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
                response.Mensaje = "Error interno: " + ex.Message;
            }

            return response;
        }

        public Respuesta<List<EUsuario>> ObtenerUsuarios()
        {
            Respuesta<List<EUsuario>> response = new Respuesta<List<EUsuario>>();
            List<EUsuario> rptLista = new List<EUsuario>();

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_ListarUsuarios", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        con.Open();

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EUsuario()
                                {
                                    IdUsuario = Convert.ToInt32(dr["IdUsuario"]),
                                    IdRol = Convert.ToInt32(dr["IdRol"]),
                                    NombreRol = dr["NombreRol"].ToString(),
                                    NroCi = dr["NroCi"].ToString(),
                                    Nombres = dr["Nombres"].ToString(),
                                    Apellidos = dr["Apellidos"].ToString(),
                                    NombreCompleto = dr["NombreCompleto"].ToString(),
                                    Celular = dr["Celular"].ToString(),
                                    Correo = dr["Correo"].ToString(),
                                    FotoUrl = dr["FotoUrl"].ToString(),
                                    Estado = Convert.ToBoolean(dr["Estado"])
                                });
                            }
                        }
                    }
                }

                response.Estado = true;
                response.Data = rptLista;
                response.Mensaje = "Datos obtenidos correctamente.";
            }
            catch (Exception ex)
            {
                response.Estado = false;
                response.Data = null;
                response.Mensaje = "Error al obtener usuarios: " + ex.Message;
            }

            return response;
        }

        public Respuesta<List<ERol>> ListaRoles()
        {
            try
            {
                List<ERol> rptLista = new List<ERol>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ListaRoles", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new ERol
                                {
                                    IdRol = Convert.ToInt32(dr["IdRol"]),
                                    NombreRol = dr["NombreRol"].ToString()
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<ERol>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<ERol>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }

    }
}
