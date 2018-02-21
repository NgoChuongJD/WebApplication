using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Euroland.NetCore.AnnualReport.WebApp.Models
{
    public class Country
    {
        public string CountryCode;
        public string CountryName;
        public string FlagLocation
        {
            get { return "images/country/" + this.CountryCode + ".png"; }        
        }
    }

    public class Exchange
    {        
        private string _marketName;
        public string MarketName
        {
            get { return _marketName.Trim(); }
            set { _marketName = value; }
        }
        public int MarketID;
    }
}
