import { Component, Input, OnInit } from '@angular/core';
import { HomeReportsItems } from "@app/home/home-reports/home-reports-items/home-reports-items";
import { UrlPrepareService } from "@app/core/services/url-prepare.service";

@Component({
    selector: 'arp-report-list',
    templateUrl: './report-list.component.html'
})

export class ReportListComponent implements OnInit {
    @Input() reportSource: HomeReportsItems[];
    @Input() companyName: string = '';
    messageAlert: string = "There are not any reports";
    constructor(private urlPrepareService: UrlPrepareService) { }

    ngOnInit(): void {
        this.reportSource.forEach(item => {
            if (this.companyName) {
                item.companyName = this.companyName;
            }

            item.companyNameEncoded = this.urlPrepareService.replaceSpecialCharacter(item.companyName);
            item.titleEncoded= this.urlPrepareService.replaceSpecialCharacter(item.title);
        }); 
    }
}
