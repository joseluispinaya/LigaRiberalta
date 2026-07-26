using CapaEntidad.DTOs;
using CapaEntidad.Responses;
using CapaNegocio;
using ClosedXML.Excel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CapaPresentacion
{
    public partial class ExcelJugadores : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static Respuesta<List<JugadoresDTO>> ProcesarExcelJugadores(string archivoBase64)
        {
            var listaJugadoresPreViz = new List<JugadoresDTO>();

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
                        if (row.RowNumber() == 1) continue;

                        string nombreStr = row.Cell(1).GetString().Trim();

                        if (string.IsNullOrEmpty(nombreStr)) break;

                        // Extraemos el string del género
                        string generoStr = row.Cell(5).GetString().Trim();

                        // Formateamos la fecha a dd/MM/yyyy en caso de que ClosedXML la traiga en otro formato
                        string fechaNacimientoStr = "";
                        if (row.Cell(6).TryGetValue(out DateTime fecha))
                        {
                            fechaNacimientoStr = fecha.ToString("dd/MM/yyyy");
                        }
                        else
                        {
                            fechaNacimientoStr = row.Cell(6).GetString().Trim();
                        }

                        var fila = new JugadoresDTO
                        {
                            Nombres = nombreStr,
                            Apellidos = row.Cell(2).GetString().Trim(),
                            NroComet = row.Cell(3).GetString().Trim(),
                            CI = row.Cell(4).GetString().Trim(),

                            // Asignamos el char si no está vacío, sino por defecto mandamos espacio
                            Genero = string.IsNullOrEmpty(generoStr) ? ' ' : generoStr[0],

                            FechaNacimiento = fechaNacimientoStr,
                            FotografiaUrl = "",
                            ClaveHash = ""
                        };

                        listaJugadoresPreViz.Add(fila);
                    }
                }

                return new Respuesta<List<JugadoresDTO>> { Estado = true, Data = listaJugadoresPreViz };
            }
            catch (Exception)
            {
                return new Respuesta<List<JugadoresDTO>> { Estado = false, Mensaje = "Error al leer Excel" };
            }
        }


        [WebMethod]
        public static Respuesta<int> GuardarJugadoresMasiva(List<JugadoresDTO> listaJugadores)
        {
            if (listaJugadores == null || listaJugadores.Count == 0)
            {
                return new Respuesta<int>
                {
                    Estado = false,
                    Valor = "warning",
                    Mensaje = "No se tiene jugadores para el registro."
                };
            }

            try
            {
                // 1. CREAMOS EL DATATABLE
                DataTable dtDetalles = new DataTable();
                dtDetalles.Columns.Add("IdClubActual", typeof(int));
                dtDetalles.Columns.Add("Nombres", typeof(string));
                dtDetalles.Columns.Add("Apellidos", typeof(string));
                dtDetalles.Columns.Add("NroComet", typeof(string));
                dtDetalles.Columns.Add("CI", typeof(string));
                dtDetalles.Columns.Add("Genero", typeof(char));
                dtDetalles.Columns.Add("FechaNacimiento", typeof(DateTime));
                dtDetalles.Columns.Add("FotografiaUrl", typeof(string));
                dtDetalles.Columns.Add("ClaveHash", typeof(string));

                // 2. ITERAMOS, VALIDAMOS Y LLENAMOS LA TABLA
                foreach (var item in listaJugadores)
                {
                    // Validar y convertir Fecha
                    if (!DateTime.TryParseExact(item.FechaNacimiento, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime fechaNacido))
                    {
                        return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = $"El formato de fecha de nacimiento no es válido para {item.Nombres}." };
                    }

                    // Validar que el género no esté vacío (Opcional pero recomendado)
                    if (item.Genero == '\0' || item.Genero == ' ')
                    {
                        return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = $"El jugador {item.Nombres} no tiene un género válido especificado." };
                    }

                    item.ClaveHash = Utilidades.GetInstance().Hash(item.CI);

                    // Si todo está perfecto, agregamos la fila al DataTable
                    dtDetalles.Rows.Add(
                        item.IdClubActual,
                        item.Nombres,
                        item.Apellidos,
                        item.NroComet,
                        item.CI,
                        item.Genero, // Aquí ya pasamos el char de forma nativa
                        fechaNacido,
                        item.FotografiaUrl,
                        item.ClaveHash
                    );
                }

                return NJugador.GetInstance().GuardarJugadoresMasiva(dtDetalles);

            }
            catch (Exception)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor" };
            }
        }

        [WebMethod]
        public static Respuesta<List<JugadoresDTO>> ProcesarExcelJugadoresOriginal(string archivoBase64)
        {
            var listaJugadoresPreViz = new List<JugadoresDTO>();

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
                        if (row.RowNumber() == 1) continue;

                        string nombreStr = row.Cell(1).GetString().Trim();

                        if (string.IsNullOrEmpty(nombreStr)) break;

                        // Extraemos el string del género
                        string generoStr = row.Cell(5).GetString().Trim();

                        // Formateamos la fecha a dd/MM/yyyy en caso de que ClosedXML la traiga en otro formato
                        string fechaNacimientoStr = "";
                        if (row.Cell(6).TryGetValue(out DateTime fecha))
                        {
                            fechaNacimientoStr = fecha.ToString("dd/MM/yyyy");
                        }
                        else
                        {
                            fechaNacimientoStr = row.Cell(6).GetString().Trim();
                        }

                        var fila = new JugadoresDTO
                        {
                            Nombres = nombreStr,
                            Apellidos = row.Cell(2).GetString().Trim(),
                            NroComet = row.Cell(3).GetString().Trim(),
                            CI = row.Cell(4).GetString().Trim(),

                            // Asignamos el char si no está vacío, sino por defecto mandamos espacio
                            Genero = string.IsNullOrEmpty(generoStr) ? ' ' : generoStr[0],

                            FechaNacimiento = fechaNacimientoStr, // Ahora sí lee la celda 6
                            FotografiaUrl = ""
                        };

                        listaJugadoresPreViz.Add(fila);
                    }
                }

                return new Respuesta<List<JugadoresDTO>> { Estado = true, Data = listaJugadoresPreViz };
            }
            catch (Exception ex)
            {
                return new Respuesta<List<JugadoresDTO>> { Estado = false, Mensaje = "Error al leer Excel: " + ex.Message };
            }
        }

        [WebMethod]
        public static Respuesta<int> GuardarJugadoresMasivaOriginal(List<JugadoresDTO> listaJugadores)
        {
            if (listaJugadores == null || listaJugadores.Count == 0)
            {
                return new Respuesta<int>
                {
                    Estado = false,
                    Valor = "warning",
                    Mensaje = "No se tiene jugadores para el registro."
                };
            }

            try
            {
                // 1. CREAMOS EL DATATABLE
                DataTable dtDetalles = new DataTable();
                dtDetalles.Columns.Add("IdClubActual", typeof(int));
                dtDetalles.Columns.Add("Nombres", typeof(string));
                dtDetalles.Columns.Add("Apellidos", typeof(string));
                dtDetalles.Columns.Add("NroComet", typeof(string));
                dtDetalles.Columns.Add("CI", typeof(string));

                // CORRECCIÓN: El tipo debe ser char para que coincida con tu DTO y BD
                dtDetalles.Columns.Add("Genero", typeof(char));

                dtDetalles.Columns.Add("FechaNacimiento", typeof(DateTime));
                dtDetalles.Columns.Add("FotografiaUrl", typeof(string));

                // 2. ITERAMOS, VALIDAMOS Y LLENAMOS LA TABLA
                foreach (var item in listaJugadores)
                {
                    // Validar y convertir Fecha
                    if (!DateTime.TryParseExact(item.FechaNacimiento, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime fechaNacido))
                    {
                        return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = $"El formato de fecha de nacimiento no es válido para {item.Nombres}." };
                    }

                    // Validar que el género no esté vacío (Opcional pero recomendado)
                    if (item.Genero == '\0' || item.Genero == ' ')
                    {
                        return new Respuesta<int> { Estado = false, Valor = "warning", Mensaje = $"El jugador {item.Nombres} no tiene un género válido especificado." };
                    }

                    // Si todo está perfecto, agregamos la fila al DataTable
                    dtDetalles.Rows.Add(
                        item.IdClubActual,
                        item.Nombres,
                        item.Apellidos,
                        item.NroComet,
                        item.CI,
                        item.Genero, // Aquí ya pasamos el char de forma nativa
                        fechaNacido,
                        item.FotografiaUrl
                    );
                }

                // 3. (SIMULACIÓN) ENVIAMOS EL DATATABLE A LA CAPA DE NEGOCIO
                return NJugador.GetInstance().GuardarJugadoresMasiva(dtDetalles);

                // SIMULACIÓN HARCODEADA (Quitar cuando crees el método real)
                //return new Respuesta<int>
                //{
                //    Estado = true,
                //    Data = listaJugadores.Count, // Simula que devolvemos la cantidad de registros insertados
                //    Mensaje = $"Se procesaron correctamente {listaJugadores.Count} jugadores. (Modo Simulación)"
                //};
            }
            catch (Exception ex)
            {
                return new Respuesta<int> { Estado = false, Valor = "error", Mensaje = "Error en el servidor: " + ex.Message };
            }
        }

    }
}