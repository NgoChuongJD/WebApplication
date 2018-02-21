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
    /// Determines the culture information for a request via values in the route data
    /// </summary>
    public class RouteRequestCultureFinder : IRequestCultureFinder
    {
        public const string DEFAULT_LANG = "en-GB";
        /// <summary>
        /// The key that contains the culture name.
        /// Defaults to "culture".
        /// </summary>
        public string RouteLangKey { get; set; } = "lang";

        /// <inheritdoc />
        public Task<RequestCultureResult> GetRequestCulture(HttpContext httpContext)
        {
            if (httpContext == null)
            {
                throw new ArgumentNullException(nameof(httpContext));
            }

            string lang = null;

            if (!string.IsNullOrEmpty(RouteLangKey))
            {
                lang = httpContext.GetRouteValue(RouteLangKey)?.ToString();
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
    }
}
