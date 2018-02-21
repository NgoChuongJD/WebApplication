using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Internal;
using Microsoft.Extensions.DependencyInjection;

using Euroland.NetCore.ToolsFramework.Localization;
using Microsoft.Extensions.Options;

namespace Euroland.NetCore.AnnualReport.WebApp.Server.CustomLocalizations
{
    /// <summary>
    /// Determines the culture information for a request via value of a cookies
    /// </summary>
    public class CookieRequestCultureFinder : IRequestCultureFinder
    {
        public const string DEFAULT_LANG = "en-GB";

        private static readonly string _culturePrefix = "lang=";

        /// <summary>
        /// Represent the default cookie name used to track the user's preferred culture information, which is ".AspNetCore.Culture".
        /// </summary>
        public static readonly string DefaultCookieName = ".Euroland.NetCore.AnnualReport.Culture";

        /// <summary>
        /// The name of the cookie that contains the user's preferred culture information.
        /// Defaults to <see cref="DefaultCookieName"/>.
        /// </summary>
        public string CookieName { get; set; } = DefaultCookieName;

        /// <inheritdoc />
        public Task<RequestCultureResult> GetRequestCulture(HttpContext httpContext)
        {

            if (httpContext == null)
            {
                throw new ArgumentNullException(nameof(httpContext));
            }

            string lang = null;

            var cookie = httpContext.Request.Cookies?[CookieName];

            if (!string.IsNullOrEmpty(cookie) && cookie.StartsWith(_culturePrefix))
            {
                lang = cookie.Substring(_culturePrefix.Length);
            }

            if (string.IsNullOrWhiteSpace(lang))
            {
                // No values specified for either so no match
                lang = DEFAULT_LANG;
            }

            var localizationOptions = httpContext.RequestServices.GetService<IOptions<JsonLocalizationOptions>>().Value;
            var culture = localizationOptions.LanguageToCultureProvider.AllSupportedCultures
                .Where(cul => cul.Name.Equals(lang, StringComparison.OrdinalIgnoreCase))
                .FirstOrDefault() ?? localizationOptions.DefaultCulture;

            var providerResultCulture = new RequestCultureResult(culture, culture);

            return Task.FromResult(providerResultCulture);
        }

        public static string CreateCookieValue(string culture)
        {
            return $"{_culturePrefix}{culture}";
        }
    }
}
