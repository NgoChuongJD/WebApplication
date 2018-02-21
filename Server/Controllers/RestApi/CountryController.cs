using Euroland.NetCore.AnnualReport.WebApp.Controllers.RestApi;
using Euroland.NetCore.AnnualReport.WebApp.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Euroland.NetCore.AnnualReport.WebApp.Controllers
{
    [Route("api/Countries")]
    public class CountryController : BaseController
    {
        private readonly ICountryRepository _countryRepository;
        public CountryController(ICountryRepository countryRepository)
        {
            this._countryRepository = countryRepository ?? throw new ArgumentException(nameof(countryRepository));
        }

        /// <summary>
        /// Get all contries
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetAll()
        {
            if (!this.User.Identity.IsAuthenticated)
            {
                return Ok(this._countryRepository.GetList());
            }
            return NotFound();
        }

        /// <summary>
        /// Get all exchange
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        [Route("exchange")]
        public IActionResult GetAllExchanges()
        {
            if (!this.User.Identity.IsAuthenticated)
            {
                return Ok(this._countryRepository.GetListExchange());
            }
            return NotFound();
        }
    }
}
