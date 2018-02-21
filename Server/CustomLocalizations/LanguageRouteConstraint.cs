using Microsoft.AspNetCore.Routing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

using Euroland.NetCore.ToolsFramework.Localization;

namespace Euroland.NetCore.AnnualReport.WebApp.CustomLocalizations
{
    public class LanguageRouteConstraint : IRouteConstraint
    {
        public const string ROUTE_LANG_NAME = "lang";
        public bool Match(HttpContext httpContext, IRouter route, string routeKey, RouteValueDictionary values, RouteDirection routeDirection)
        {
            if(!values.Keys.Any((key) => ROUTE_LANG_NAME.Equals(routeKey, StringComparison.OrdinalIgnoreCase)))
            {
                return false;
            }

            var lang = values[ROUTE_LANG_NAME].ToString();

            var options = httpContext.RequestServices.GetService<IOptions<JsonLocalizationOptions>>();
            var supportedLanguages = options.Value.LanguageToCultureProvider.SupportedLanguages;

            return supportedLanguages.Any(supportLang => supportLang.Equals(lang, StringComparison.OrdinalIgnoreCase));
        }
    }
}
