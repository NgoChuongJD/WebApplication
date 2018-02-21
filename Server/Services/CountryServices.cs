using Euroland.NetCore.AnnualReport.WebApp.Models;
using Euroland.NetCore.AnnualReport.WebApp.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Euroland.NetCore.AnnualReport.WebApp.Services
{
    public class CountryServices
    {
        private readonly ICountryRepository _countryRepository;
        public CountryServices(ICountryRepository countryRepository)
        {
            this._countryRepository = countryRepository ?? throw new ArgumentException(nameof(countryRepository));
        }
        /// <summary>
        /// Get all countries is active
        /// </summary>
        /// <returns></returns>
        public List<Country> GetAll()
        {
            return this._countryRepository.GetList();
        }
    }
}
