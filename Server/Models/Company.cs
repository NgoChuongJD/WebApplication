using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Euroland.NetCore.AnnualReport.WebApp.Models
{
    public class Company
    {
        public string CompanyCode;

        private string _companyName;
        public string CompanyName {
            get { return _companyName.Trim(); }
            set { _companyName = value; }
        }
        public int TotalReports;        
        public int SectorId;

        private string _sectorName;
        public string SectorName
        {
            get { return _sectorName.Trim(); }
            set { _sectorName = value; }
        }
        private string _industryName;
        public string IndustryName
        {
            get { return string.IsNullOrEmpty(_industryName)? string.Empty : _industryName.Trim(); }
            set { _industryName = value; }
        }
        public string CountryName;
        public string LogoLocation { get { return "images/companies/" + this.CompanyCode + ".png"; } }
        public string BannerLocation { get { return "images/banners/" + this.CompanyCode + ".jpg"; } }
        public string CompanyIRURL { get; set; }




    }
    public class Instrument
    {
        public string Symbol;
        public string MarketName;
        public string CurrencyCode;
        public double LastPrice;
        public double Change52W;
        public double PercentChange52W;
        public string SegmentName;
    }
    public class CompanyFilter
    {
        public string CountryCode;
        public int MarketId;

        public int IndustryId;
        public int SectorId;
    }
    public class CompanyPageDetail
    {
        public Company Company;
        public Report LatestReport;
        public ICollection<Instrument> Instruments;
    }
}
