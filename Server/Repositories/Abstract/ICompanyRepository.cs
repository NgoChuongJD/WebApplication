using Euroland.NetCore.AnnualReport.WebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Euroland.NetCore.AnnualReport.WebApp.Repositories
{
    public interface ICompanyRepository
    {
        /// <summary>
        /// Get all featured companies, there will be have 20 featured companies
        /// </summary>
        /// <returns></returns>
        List<Company> GetListFeatured();

        /// <summary>
        /// Get market, country code, sector, industry by companyname
        /// </summary>
        /// <returns></returns>
        CompanyFilter GetInfosByName(string companyName);

        /// <summary>
        /// Get similar company
        /// </summary>
        /// <param name="companyName"></param>
        /// <param name="top"></param>
        /// <returns></returns>
        List<Company> GetSimilarCompany(string companyCode, int top);

        /// <summary>
        /// Get company detail for company page
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        CompanyPageDetail GetCompanyDetail(string companyCode);
    }
}
