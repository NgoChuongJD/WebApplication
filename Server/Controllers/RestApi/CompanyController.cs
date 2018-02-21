using Euroland.NetCore.AnnualReport.WebApp.Controllers.RestApi;
using Euroland.NetCore.AnnualReport.WebApp.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Euroland.NetCore.AnnualReport.WebApp.Controllers
{
    [Route("api/companies")]
    public class CompanyController : BaseController
    {
        private readonly ICompanyRepository _companyRepository;
        public CompanyController(ICompanyRepository companyRepository)
        {
            this._companyRepository = companyRepository ?? throw new ArgumentException(nameof(companyRepository));
        }

        /// <summary>
        /// Get all featured companies, there will be have 20 featured companies
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        [Route("featured")]
        public IActionResult GetListFeatured()
        {
            if (!this.User.Identity.IsAuthenticated)
            {
                return Ok(this._companyRepository.GetListFeatured());
            }
            return NotFound();
        }

        [HttpGet]
        [AllowAnonymous]    
        [Route("infosbyname/{companyName}")]
        public IActionResult GetInfoByName(string companyName)
        {
            if (!this.User.Identity.IsAuthenticated)
            {
                string _companyName = WebUtility.UrlDecode(companyName);
                return Ok(this._companyRepository.GetInfosByName(_companyName));
            }
            return NotFound();
        }

        /// <summary>
        /// Get similar company
        /// </summary>
        /// <param name="companyCode"></param>
        /// <param name="top"></param>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        [Route("similar/{companyCode}/{top}")]
        public IActionResult GetSimilarCompany(string companyCode, int top)
        {
            if (!this.User.Identity.IsAuthenticated)
            {   
                return Ok(this._companyRepository.GetSimilarCompany(companyCode, top));
            }
            return NotFound();
        }

        /// <summary>
        /// Get company detail for company page
        /// </summary>
        /// <param name="companyCode"></param>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        [Route("{companyCode}")]
        public IActionResult GetCompanyDetail(string companyCode)
        {
            if (!this.User.Identity.IsAuthenticated)
            {
                return Ok(this._companyRepository.GetCompanyDetail(companyCode));
            }
            return NotFound();
        }
    }
}
