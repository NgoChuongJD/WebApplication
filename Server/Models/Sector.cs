using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Euroland.NetCore.AnnualReport.WebApp.Server.Models
{
    public class Sector
    {
        public int SectorID { get; set; }
        private string _sectorName;
        public string SectorName {
            get { return _sectorName.Trim(); }
            set { _sectorName = value; }
        }
        public int Order { get; set; }
    }
    public class Industry
    {
        public int IndustryID { get; set; }
        public int SectorID { get; set; }
        private string _industryName;
        public string IndustryName
        {
            get { return _industryName.Trim(); }
            set { _industryName = value; }
        }
    }
}
