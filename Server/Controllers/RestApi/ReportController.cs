using Euroland.NetCore.AnnualReport.WebApp.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.AspNetCore.Authorization;
using Euroland.NetCore.AnnualReport.WebApp.Controllers.RestApi;

namespace Euroland.NetCore.AnnualReport.WebApp.Controllers
{
    /// <summary>
    /// Annual report for all company
    /// </summary>
    [Route("api/Reports")]
    public class ReportController: BaseController
    {
        private readonly IReportRepository _reportRepository;
        public ReportController(IReportRepository reportRepository)
        {
            _reportRepository = reportRepository ?? throw new ArgumentNullException(nameof(reportRepository));
        }

        /// <summary>
        /// Get recommendation report
        /// </summary>
        /// <param name="top">number of reports return, min = 1, default = 15</param>
        /// <returns>
        /// Ok : list of recommendation reports
        /// Bad : http code not found
        /// </returns>
        [HttpGet]
        [Route("recommendation/{top:int:min(1)}")]        
        [AllowAnonymous]
        public IActionResult Recommendation(int top = 15)
        {
            if (!this.HttpContext.User.Identity.IsAuthenticated)
            {
                return Ok(_reportRepository.GetRecommendationReportForVisitor(top));
            }
            //if (!this.HttpContext.User.Identity.IsAuthenticated)
            //{
            //    return this.TinyJson<Models.ISimilarReportViewModel>(_reportRepository.GetRecommendationReportForVisitor(top));
            //}

            return NotFound();
        }

        /// <summary>
        /// Get similar report, recommend report, report detail
        /// </summary>
        /// <param name="reportId"></param>
        /// <param name="topSimilarCompany"></param>
        /// <param name="topRecommended"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("reportpagedetail/{reportId:int:min(1)}/{topSimilarCompany:int:min(1)}/{topRecommended:int:min(1)}")]
        [AllowAnonymous]
        public IActionResult GetReportPageDetail(int reportId,  int topSimilarCompany, int topRecommended)
        {
            if (!this.HttpContext.User.Identity.IsAuthenticated)
            {
                return Ok(_reportRepository.GetSimilarReportAndRecommendReportAndDetailReport(reportId, topSimilarCompany, topRecommended));
            }

            return NotFound();
        }

        /// <summary>
        /// Get all reports from a company
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("{companyCode}/{top?}")]
        [AllowAnonymous]
        public IActionResult GetReportByCompanyCode(string companyCode, int top = 9999)
        {
            if (!this.HttpContext.User.Identity.IsAuthenticated)
            {
                return Ok(_reportRepository.GetReportByCompanyCode(companyCode, top));
            }

            return NotFound();
        }
    }
}
