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
    public class NClub
    {
        #region "PATRON SINGLETON"
        private static NClub instancia = null;
        private NClub() { }
        public static NClub GetInstance()
        {
            if (instancia == null)
            {
                instancia = new NClub();
            }
            return instancia;
        }
        #endregion

        public Respuesta<int> GuardarOrEditClub(EClub objeto, DateTime FechaFundacion)
        {
            return DClub.GetInstance().GuardarOrEditClub(objeto, FechaFundacion);
        }

        public Respuesta<List<EClub>> ListaClubes()
        {
            return DClub.GetInstance().ListaClubes();
        }
    }
}
