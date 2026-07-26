using CapaEntidad.DTOs;
using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using CapaNegocio;
using ClosedXML.Excel;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion
{
    public partial class Plantillas : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<ListCuerpoTecnicoDTO>> ListaCuerpoTecnico(int IdEquipo)
        {
            return NInscripcion.GetInstance().ListaCuerpoTecnico(IdEquipo);
        }

        [WebMethod]
        public static Respuesta<List<ECargosTec>> ListaCargosTecnicos()
        {
            return NCategoria.GetInstance().ListaCargosTecnicos();
        }

        [WebMethod]
        public static Respuesta<List<CuerpoTecnicoDTO>> ProcesarExcelCuerpoTec(string archivoBase64)
        {
            var listaCuerpoTecPreViz = new List<CuerpoTecnicoDTO>();

            try
            {
                byte[] fileBytes = Convert.FromBase64String(archivoBase64);

                using (var stream = new MemoryStream(fileBytes))
                using (var workbook = new XLWorkbook(stream))
                {
                    var worksheet = workbook.Worksheet(1);
                    var rows = worksheet.RangeUsed().RowsUsed();

                    foreach (var row in rows)
                    {
                        // Saltamos la fila 1 (los encabezados)
                        if (row.RowNumber() == 1) continue;

                        string nombreStr = row.Cell(1).GetString().Trim();

                        // Si llegamos a una fila vacía, terminamos de leer
                        if (string.IsNullOrEmpty(nombreStr)) break;

                        var fila = new CuerpoTecnicoDTO
                        {
                            Nombres = nombreStr,                               // Columna A
                            Apellidos = row.Cell(2).GetString().Trim(),        // Columna B
                            CI = row.Cell(3).GetString().Trim(),               // Columna C
                            IdCargo = 0,                                       // 0 por defecto, lo asignarán en la web
                            IdEquipo = 0,                                      // Se asignará al guardar en BD
                            IdMiembro = 0,
                            ClaveHash = ""
                        };

                        listaCuerpoTecPreViz.Add(fila);
                    }
                }

                return new Respuesta<List<CuerpoTecnicoDTO>> { Estado = true, Data = listaCuerpoTecPreViz };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<CuerpoTecnicoDTO>> { Estado = false, Mensaje = "Error al leer Excel: " + ex.Message };
            }
        }

        [WebMethod]
        public static Respuesta<int> GuardarCuerpoTecnicoMasiva(List<CuerpoTecnicoDTO> listaCuerpoTecnico)
        {
            if (listaCuerpoTecnico == null || listaCuerpoTecnico.Count == 0)
            {
                return new Respuesta<int>
                {
                    Estado = false,
                    Valor = "warning",
                    Mensaje = "No se tiene personal para el registro."
                };
            }

            try
            {
                // 1. CREAMOS EL DATATABLE (Debe coincidir con Type_ListaCuerpoTecnico)
                DataTable dtDetalles = new DataTable();
                dtDetalles.Columns.Add("IdEquipo", typeof(int));
                dtDetalles.Columns.Add("Nombres", typeof(string));
                dtDetalles.Columns.Add("Apellidos", typeof(string));
                dtDetalles.Columns.Add("IdCargo", typeof(int));
                dtDetalles.Columns.Add("CI", typeof(string));
                dtDetalles.Columns.Add("ClaveHash", typeof(string));

                // 2. ITERAMOS Y LLENAMOS LA TABLA
                foreach (var item in listaCuerpoTecnico)
                {
                    // Pequeña validación de seguridad extra en el backend
                    if (item.IdCargo <= 0)
                    {
                        return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = $"Debe seleccionar un cargo para {item.Nombres} {item.Apellidos}." };
                    }

                    item.ClaveHash = Utilidades.GetInstance().Hash(item.CI);

                    dtDetalles.Rows.Add(
                        item.IdEquipo,
                        item.Nombres,
                        item.Apellidos,
                        item.IdCargo,
                        item.CI,
                        item.ClaveHash
                    );
                }

                return NInscripcion.GetInstance().GuardarCuerpoTecnicoMasiva(dtDetalles);
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

    }
}