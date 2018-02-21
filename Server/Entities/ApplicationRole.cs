using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Euroland.NetCore.AnnualReport.WebApp.Entities
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationRole : IdentityRole<string>
    {
        [StringLength(250)]
        public string Description { get; set; }
        
    }
}
