﻿using System.ComponentModel.DataAnnotations;

namespace Euroland.NetCore.AnnualReport.WebApp.ViewModels.ManageViewModels
{
    public class TwoFactorAuthenticationViewModel
    {
        public bool HasAuthenticator { get; set; }

        public int RecoveryCodesLeft { get; set; }

        public bool Is2faEnabled { get; set; }
    }
}
