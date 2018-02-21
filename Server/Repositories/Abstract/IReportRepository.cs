using Euroland.NetCore.AnnualReport.WebApp.Models;
using System.Collections.Generic;

namespace Euroland.NetCore.AnnualReport.WebApp.Repositories
{
    /// <summary>
    /// 
    /// </summary>
    public interface IReportRepository
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="top"></param>
        /// <returns></returns>
        List<Report> GetRecommendationReportForVisitor(int top);

        /// <summary>
        /// Get similar report, recommend report, report detail
        /// </summary>
        /// <param name="reportId"></param>
        /// <param name="topSimilarCompany"></param>
        /// <param name="topRecommended"></param>
        /// <returns></returns>
        ReportPageDetail GetSimilarReportAndRecommendReportAndDetailReport(int reportId, int topSimilarCompany, int topRecommended);

        /// <summary>
        /// Get all reports from a company
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="top"></param>
        /// <returns></returns>
        List<Report> GetReportByCompanyCode(string companyCode, int top);
    }
}
