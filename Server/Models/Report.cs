using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Configuration;
namespace Euroland.NetCore.AnnualReport.WebApp.Models
{
    public class Report: ISimilarReportViewModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        private string _companyCode;
        public string CompanyCode
        {
            get
            {
                if (!string.IsNullOrEmpty(_companyCode))
                    return _companyCode.Trim();
                else return _companyCode;
            }
            set
            {
                _companyCode = value;
            }
        }
        public string CompanyName { get; set; }
        public int SectorId { get; set; }
        public int IndustryId { get; set; }
        public string SectorName { get; set; }

        [JsonIgnore]
        public string ThumbnailFileLocation { get; set; }
        public string ThumbnailFileLocationFull { get { return "images/report/" + this.CompanyCode + "/" + this.ThumbnailFileLocation; } }

        [JsonIgnore]
        public string BigThumbnailFileLocation { get; set; }
        public string BigThumbnailFileLocationFull { get { return "images/bigreport/" + this.CompanyCode + "/" + this.BigThumbnailFileLocation; } }
        [JsonIgnore]
        public string FileLocation { get; set; }
        public string FileLocationFull { get { return Startup.Configuration.GetSection("ApplicationSettings")["PdfLocation"] + this.CompanyCode + "/" + this.FileLocation; } }

        public string CountryCode { get; set; }
        public string LogoLocation { get { return "images/companies/" + this.CompanyCode + ".png"; } }

        public string LanguageCode { get; set; }
    }

    public class ReportPageDetail
    {
        public Report ReportDetail { get; set; }
        public List<Report> SimilarReports { get; set; }
        public List<Report> RecommendedReports { get; set; }
        public int TotalCompanyReport { get; set; }
    }
    public class TotalReport
    {
        public int TotalSameCompanyReport { get; set; }
    }
}
