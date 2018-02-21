using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using static Microsoft.AspNetCore.ResponseCompression.ResponseCompressionDefaults;

using Euroland.NetCore.ToolsFramework.Mvc.Serialization;

namespace Euroland.NetCore.AnnualReport.WebApp
{
    public static class Helpers
    {
        public static string JsonSerialize(object obj)
        {
            return TinyJson.SerializeObject(obj);
        }
        
        public static IEnumerable<string> DefaultMimeTypes => MimeTypes.Concat(new[]
                                {
                                    "image/svg+xml",
                                    "application/font-woff2"
                                });
    }
}