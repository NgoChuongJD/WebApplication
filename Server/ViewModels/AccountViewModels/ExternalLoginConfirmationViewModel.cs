using System.ComponentModel.DataAnnotations;

namespace Euroland.NetCore.AnnualReport.WebApp.ViewModels.AccountViewModels
{
    public class ExternalLoginConfirmationViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
