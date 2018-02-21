import { Component, Input } from '@angular/core';
import { HomeReportsItems } from "@app/home/home-reports/home-reports-items/home-reports-items";
import { Router } from '@angular/router';
@Component({
    selector: 'arp-similar-company-report',
    templateUrl: './similar-company-report.component.html'
})
export class SimilarCompanyReportComponent {
    @Input() reportSource: HomeReportsItems[];
    @Input() sectionTitle: string = "Reports from Similar Companies";
    @Input() sectorId: number;   
    @Input() reportYear: number;
    messageAlert: string = "There are not any reports";
    btnSeeMore: string = "See more";
    constructor(private router: Router) {

    }

    viewMoreReports(reportYear: number, sectorId: number) {
        this.router.navigate(['/explore'], {
            queryParams: {
                'exploreType': 'report',
                'year': reportYear, 'sectorId': sectorId
            }
        })

    }

}