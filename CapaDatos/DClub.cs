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
    public class DClub
    {
        #region "PATRON SINGLETON"
        private static DClub instancia = null;
        private DClub() { }
        public static DClub GetInstance()
        {
            if (instancia == null)
            {
                instancia = new DClub();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditClub(EClub objeto, DateTime FechaFundacion)
        {
            Respuesta<int> response = new Respuesta<int>();
            int resultadoCodigo = 0;

            try
            {
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand cmd = new SqlCommand("usp_GuardarOrEditClubes", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@IdClub", objeto.IdClub);
                        cmd.Parameters.AddWithValue("@NombreClub", objeto.NombreClub);
                        cmd.Parameters.AddWithValue("@LogoUrl", string.IsNullOrEmpty(objeto.LogoUrl) ? "" : objeto.LogoUrl);

                        cmd.Parameters.AddWithValue("@FechaFundacion", FechaFundacion);
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
                        response.Mensaje = "Ya existe un club con ese nombre.";
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

        public Respuesta<List<EClub>> ListaClubes()
        {
            try
            {
                List<EClub> rptLista = new List<EClub>();
                using (SqlConnection con = ConexionBD.GetInstance().ConexionDB())
                {
                    using (SqlCommand comando = new SqlCommand("usp_ClubesListar", con))
                    {
                        comando.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader dr = comando.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                rptLista.Add(new EClub
                                {
                                    IdClub = Convert.ToInt32(dr["IdClub"]),
                                    NombreClub = dr["NombreClub"].ToString(),
                                    LogoUrl = dr["LogoUrl"].ToString(),
                                    FechaFundacion = Convert.ToDateTime(dr["FechaFundacion"]).ToString("dd/MM/yyyy"),
                                    Estado = Convert.ToBoolean(dr["Estado"])
                                });
                            }
                        }
                    }
                }
                return new Respuesta<List<EClub>>()
                {
                    Estado = true,
                    Data = rptLista,
                    Mensaje = "Lista obtenida correctamente"
                };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<EClub>>()
                {
                    Estado = false,
                    Data = null,
                    Mensaje = $"Error al obtener la lista: {ex.Message}"
                };
            }
        }
    }
}
