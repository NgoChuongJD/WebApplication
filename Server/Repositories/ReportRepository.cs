using System;
using System.Collections.Generic;
using System.Linq;
using Euroland.NetCore.AnnualReport.WebApp.Models;
using Euroland.NetCore.ToolsFramework.Data;

namespace Euroland.NetCore.AnnualReport.WebApp.Repositories
{
    /// <summary>
    /// 
    /// </summary>
    public class ReportRepository : RepositoryBase, IReportRepository
    {
        public ReportRepository(IApplicationDbContext dbContext)
            : base(dbContext) { }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="top"></param>
        /// <returns></returns>
        public List<Report> GetRecommendationReportForVisitor(int top)
        {
            return this.DbContext.Exec<Report>("spReportSelectRecommendationForVisitor",new { top }).ToList();            
        }

        /// <summary>
        /// Get similar report, recommend report, report detail
        /// </summary>
        /// <param name="reportId"></param>
        /// <param name="topSimilarCompany"></param>
        /// <param name="topRecommended"></param>
        /// <returns></returns>
        public ReportPageDetail GetSimilarReportAndRecommendReportAndDetailReport(int reportId, int topSimilarCompany, int topRecommended)
        {
            IMultipleResultSet multipleResult = DbContext.QueryMultipleResult("spReportSelectDetailAndSimilarCompanyAndRecommendReport", new { reportId, topSimilarCompany, topRecommended });
            Report _report = multipleResult.GetSingle<Report>();

            List<Report> lstSimilarReport = multipleResult.Get<Report>().ToList();

            List<Report> lstRecommendedReport = multipleResult.Get<Report>().ToList();
            TotalReport totalReport = multipleResult.GetSingle<TotalReport>();
            ReportPageDetail reportPageDetail = new ReportPageDetail();
            reportPageDetail.ReportDetail = _report;
            reportPageDetail.SimilarReports = lstSimilarReport;
            reportPageDetail.RecommendedReports = lstRecommendedReport;
            reportPageDetail.TotalCompanyReport = totalReport.TotalSameCompanyReport;
            return reportPageDetail;
 
        }

        /// <summary>
        /// Get all reports from a company
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="top"></param>
        /// <returns></returns>
        public List<Report> GetReportByCompanyCode(string companyCode, int top)
        {
            return this.DbContext.Exec<Report>("spReportSelectByCompanyCode", new { companyCode, top }).ToList();
        }
    }
}
