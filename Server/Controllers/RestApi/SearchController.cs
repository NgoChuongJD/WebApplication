using Euroland.NetCore.AnnualReport.WebApp.Controllers.RestApi;
using Euroland.NetCore.AnnualReport.WebApp.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Euroland.NetCore.AnnualReport.WebApp.Controllers
{
    [Route("api/search")]
    public class SearchController:BaseController
    {
        private readonly ISearchRepository _searchRepository;

        public SearchController(ISearchRepository searchRepository)
        {
            this._searchRepository = searchRepository ?? throw new ArgumentException(nameof(searchRepository));
        }
        /// <summary>
        /// Get all featured companies, there will be have 20 featured companies
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        [Route("suggestion/{query}/{top}")]
        public IActionResult GetListFeatured(string query,int top = 10)
        {
            if (!this.User.Identity.IsAuthenticated)
            {
                string intString  = Regex.Match(query, @"\d{4}\s*?$").Value;
                string resultString = Regex.Replace(query, @"[\d-]", string.Empty).Trim();
                int year = 0;
                bool isYear = Int32.TryParse(intString,out year);
               
                return Ok(this._searchRepository.GetListSuggestionCompanyReport(isYear ? resultString : query, isYear ?year : (int?)null, top));
               
            }
            return NotFound();
        }
    }
}
