// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860
using System.Linq;
using System.Threading.Tasks;
using Euroland.NetCore.AnnualReport.WebApp.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using Microsoft.Extensions.Localization;
using Euroland.NetCore.AnnualReport.WebApp.ViewModels;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Euroland.NetCore.ToolsFramework.Localization;
using Euroland.NetCore.AnnualReport.WebApp.Server.CustomLocalizations;
using Microsoft.AspNetCore.Mvc.TagHelpers.Internal;
using Euroland.NetCore.AnnualReport.WebApp.Services;
using Euroland.NetCore.ToolsFramework.Mvc.Serialization;

namespace Euroland.NetCore.AnnualReport.WebApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IStringLocalizer<HomeController> _stringLocalizer;
        private readonly IHostingEnvironment _env;
        private readonly IMemoryCache _cache;
        private readonly CountryServices _countryServices;
        private readonly SectorServices _sectorServices;
        public HomeController(
            UserManager<ApplicationUser> userManager,
            IHostingEnvironment env,
            IStringLocalizer<HomeController> stringLocalizer,
            IMemoryCache memoryCache,
            IOptions<JsonLocalizationOptions> options,
            CountryServices countryServices,
            SectorServices sectorServices
            )
        {
            _userManager = userManager;
            _stringLocalizer = stringLocalizer;
            _env = env;
            _cache = memoryCache;
            _countryServices = countryServices;
            _sectorServices = sectorServices;
            var value = options.Value;
        }

        public async Task<IActionResult> Index(string userAgent)
        {
            if (string.IsNullOrEmpty(userAgent) && Request.Headers.ContainsKey("User-Agent"))
            {
                userAgent = Request.Headers["User-Agent"];
            }

            if (ConfirmEmailRequest())
            {
                await ConfirmEmail();
            }

            var content = GetContentByCulture();
            var isIE = this.isIE(userAgent);

            ViewBag.content = content;
            ViewBag.isIE = isIE;

            // Add polyfill scripts for IE browsers to support angular
            // More detail at: https://angular.io/guide/browser-support#polyfills-for-non-cli-users
            if(isIE)
            {
                ViewBag.polyfillScripts = new System.Collections.Generic.List<string>() {
                    "~/js/core-js/shim.min.js",
                    "~/js/web-animations.min.js"
                };
            }
            else
            {
                ViewBag.polyfillScripts = new System.Collections.Generic.List<string>(0);
            }

            var urlBase = this.Url.Content("~/");

            ViewBag.wowbookVendorScripts = TinyJson.SerializeObject(new string[] {
                $"{urlBase}{this.AddFileVersionToPath("dist/jquery.js")}",
                $"{urlBase}{this.AddFileVersionToPath("dist/wowbook.js")}"
            });

            ViewBag.pdfJsWorkerScript = TinyJson.SerializeObject($"{urlBase}{this.AddFileVersionToPath("dist/pdf.worker.min.js")}");

            // Get all countries is active
            ViewBag.countries = TinyJson.SerializeObject(this._countryServices.GetAll());
            // Get all sectors is active
            ViewBag.sectors = TinyJson.SerializeObject(this._sectorServices.GetAll());
            return View();
        }

        [HttpPost]
        public IActionResult SetLanguage(string culture)
        {
            culture = "en-GB";
            if (!string.IsNullOrEmpty(culture))
            {
                Response.Cookies.Append(
                    CookieRequestCultureFinder.DefaultCookieName,
                    CookieRequestCultureFinder.CreateCookieValue(culture),
                    new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
                );
            }

            return LocalRedirect("~/");
        }

        private bool ConfirmEmailRequest()
        {
            return Request.Query.ContainsKey("emailConfirmCode") && Request.Query.ContainsKey("userId");
        }

        private async Task ConfirmEmail()
        {
            var userId = Request.Query["userId"].ToString();
            var code = Request.Query["emailConfirmCode"].ToString();
            code = code.Replace(" ", "+");

            var user = await _userManager.FindByIdAsync(userId);
            if (user != null && !user.EmailConfirmed)
            {
                var valid = await _userManager.ConfirmEmailAsync(user, code);
                if (valid.Succeeded)
                {
                    ViewBag.emailConfirmed = true;
                }
            }
        }

        private string GetContentByCulture()
        {
            var requestCulture = HttpContext.Features.Get<IRequestCultureFeature>();
            // Culture contains the information of the requested culture
            var culture = requestCulture.Culture;

            var CACHE_KEY = $"Content-{culture.Name}";


            string cacheEntry;

            // Look for cache key.
            if (!_cache.TryGetValue(CACHE_KEY, out cacheEntry))
            {
                // Key not in cache, so get & set data.
                var culturalContent = _stringLocalizer.WithCulture(culture)
                                        .GetAllStrings()
                                        .Select(c => new ContentVm
                                        {
                                            Key = c.Name,
                                            Value = c.Value
                                        })
                                        .ToDictionary(x => x.Key, x => x.Value);
                cacheEntry = Helpers.JsonSerialize(culturalContent);

                // Set cache options.
                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    // Keep in cache for this time, reset time if accessed.
                    .SetSlidingExpiration(TimeSpan.FromMinutes(30));

                // Save data in cache.
                _cache.Set(CACHE_KEY, cacheEntry, cacheEntryOptions);
            }

            return cacheEntry;
        }


        /// <summary>
        /// Adds version query string to the file
        /// </summary>
        /// <param name="path">The relative path. Should not start with "~/"</param>
        /// <returns></returns>
        private string AddFileVersionToPath(string path)
        {
            var context = this.HttpContext;
            var pathBase = context.Request.PathBase;
            var versionProvider = new FileVersionProvider(_env.WebRootFileProvider, _cache, pathBase);
            //var globingUrlBuilder = new GlobbingUrlBuilder(_environment.WebRootFileProvider, _memCache, pathBase);
            //var globingUrl = globingUrlBuilder.BuildUrlList(null, path, null);
            return versionProvider.AddFileVersionToPath(path);
        }

        private bool isIE(string userAgent)
        {
            return !string.IsNullOrEmpty(userAgent) && (userAgent.Contains("MSIE") || userAgent.Contains("Trident"));
        }
    }
}
