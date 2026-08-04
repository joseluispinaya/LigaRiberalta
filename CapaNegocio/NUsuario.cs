using CapaDatos;
using CapaEntidad.Entidades;
using CapaEntidad.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaNegocio
{
    public class NUsuario
    {
        #region "PATRON SINGLETON"
        private static NUsuario instancia = null;
        private NUsuario() { }
        public static NUsuario GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NUsuario();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditUsuarios(EUsuario objeto)
        {
            return DUsuario.GetInstance().GuardarOrEditUsuarios(objeto);
        }

        public Respuesta<List<EUsuario>> ObtenerUsuarios()
        {
            return DUsuario.GetInstance().ObtenerUsuarios();
        }

        public Respuesta<List<ERol>> ListaRoles()
        {
            return DUsuario.GetInstance().ListaRoles();
        }
    }
}
