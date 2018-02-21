using Euroland.NetCore.AnnualReport.WebApp.Models;
using Euroland.NetCore.ToolsFramework.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace Euroland.NetCore.AnnualReport.WebApp.Repositories
{
    public class CompanyRepository : RepositoryBase, ICompanyRepository
    {
        public CompanyRepository(IApplicationDbContext dbContext)
            : base(dbContext) { }
        /// <summary>
        /// Get all featured companies, there will be have 20 featured companies
        /// </summary>
        /// <returns></returns>
        public List<Company> GetListFeatured()
        {
            return this.DbContext.Exec<Company>("spCompanySelectFeatured").ToList();
        }

        /// <summary>
        /// Get market, country code, sector, industry by companyname
        /// </summary>
        /// <param name="companyName"></param>
        /// <returns></returns>
        public CompanyFilter GetInfosByName(string companyName)
        {
            return this.DbContext.Exec<CompanyFilter>("spCompanySelectInfosByName",new { companyName }).FirstOrDefault();
        }

        /// <summary>
        /// Get similar company
        /// </summary>
        /// <param name="companyName"></param>
        /// <param name="top"></param>
        /// <returns></returns>
        public List<Company> GetSimilarCompany(string companyCode ,int top)
        {
            return this.DbContext.Exec<Company>("spCompanySelectSimilar", new { companyCode, top }).ToList();
        }

        /// <summary>
        /// Get company detail for company page
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        public CompanyPageDetail GetCompanyDetail(string companyCode)
        {

            IMultipleResultSet multipleResult = DbContext.QueryMultipleResult("spCompanySelectDetail", new { companyCode });
            Company _company = multipleResult.GetSingle<Company>();

            Report latestReport = multipleResult.GetSingle<Report>();

            List<Instrument> lstInstruments = multipleResult.Get<Instrument>().ToList();

            CompanyPageDetail companyPageDetail = new CompanyPageDetail();
            companyPageDetail.Company = _company;
            companyPageDetail.LatestReport = latestReport;
            companyPageDetail.Instruments = lstInstruments;
            
            
            return companyPageDetail;
            
        }
    }
}
