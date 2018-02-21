using System.ComponentModel.DataAnnotations;

namespace Euroland.NetCore.AnnualReport.WebApp.ViewModels.AccountViewModels
{
    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
