import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyProfile } from '@app/core/models/company-profile-model';
import { HomeReportsItems } from '@app/home/home-reports/home-reports-items/home-reports-items';
@Component({
  selector: 'arp-company-latest-report',
  templateUrl: './latest-report.component.html'
})
export class LatestReportComponent implements OnInit {
  @Input() company: CompanyProfile;
  @Input() latestReport: HomeReportsItems;
  companyProfile: CompanyProfile;
  cornerImage = 'img/report-corner-fold.png';
  constructor(private router: Router) {}
  ngOnInit(): void {}

  goToViewingReport(companyName: string, id: string, title: string) {
    this.router.navigate([
      '/report',
      companyName
        .toLowerCase()
        .split(' ')
        .join('-'),
      id,
      title
        .toLowerCase()
        .split(' ')
        .join('-')
        .replace('(', '')
        .replace(')', '')
    ]);
  }
}
