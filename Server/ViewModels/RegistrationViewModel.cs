﻿using System.ComponentModel.DataAnnotations;

namespace Euroland.NetCore.AnnualReport.WebApp.ViewModels
{
    public class RegistrationViewModel
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
