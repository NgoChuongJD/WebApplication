import { Component, Input, OnInit  } from '@angular/core';
import { HomeReportsItems } from "@app/home/home-reports/home-reports-items/home-reports-items";
import { LayoutBreakpointService, LayoutBreakpoint } from "@app/core/services/layout-breakpoint.service";
//import { PrevReportService } from "@app/company/prev-report/prev-report.service";
import { UrlPrepareService } from "@app/core/services/url-prepare.service";

@Component({
    selector: 'arp-owner-company-report',
    templateUrl: './owner-company-report.component.html'
})

export class OwnerCompanyReportComponent implements OnInit {
    // @Input() currentReportId: string;
    @Input() companyCode: string = '';
    @Input() companyName: string = '';
    @Input() pageSize: number = 0;
    companyNameEncoded: string;
    dataLoadCompletedState = false;
    @Input() reportSource: HomeReportsItems[];
    reportSourcePaging: HomeReportsItems[];

    private total: number = 0;
    hasMore: boolean;

    title: string = `Other reports from`;

    constructor(private readonly layoutBreakpointService: LayoutBreakpointService,
        private readonly urlPrepareService: UrlPrepareService) {
    }

    ngOnInit(): void {
        this.dataLoadCompletedState = false;
        this.reportSourcePaging = [];
        this.companyNameEncoded = this.urlPrepareService.replaceSpecialCharacter(this.companyName);

        this.total = this.reportSource.length;
        this.reportSourcePaging = this.reloadDataView(this.pageSize);
        this.dataLoadCompletedState = true;
        if (LayoutBreakpoint.Desktop == this.layoutBreakpointService.currentBreakpoint) {
            const timer = setInterval(() => {
                if (this.checkOverflowCards() > 0) {
                    clearInterval(timer);
                }
            }, 250);
        }
    }

    private reloadDataView(next: number, start: number = 0): any {
        let end = start > 0 ? start + next : start + this.pageSize;
        this.hasMore = end < this.total;
        
        return this.reportSource.slice(start, end);
    }

    getMoreReport() {
        let extra = this.pageSize - (this.reportSourcePaging.length % this.pageSize);
        const topData = this.reloadDataView(extra, this.reportSourcePaging.length);
        this.reportSourcePaging.push(...topData);

        if (LayoutBreakpoint.Desktop == this.layoutBreakpointService.currentBreakpoint) {
            const timer = setInterval(() => {
                    if (this.checkOverflowCards() > 0) {
                        clearInterval(timer);
                    }
                },
                250);
        }
    }

    private checkOverflowCards(): number {
        const desktopMaxRow = 5;
        if (this.reportSourcePaging.length < desktopMaxRow * 2) {
            return 1;
        }

        const cards = document.querySelectorAll("#report .report-card:not(.processed)");
        if (!cards || cards.length <= 0) {
            return 0;
        }

        for (let i = 0, l = cards.length; i < l; i += desktopMaxRow) {
            let rowWidthSum = 0;

            for (let j = i; j < i + desktopMaxRow && j < cards.length; j++) {
                rowWidthSum += cards[j].clientWidth;    
                cards[j].classList.add('processed');
            }

            if (rowWidthSum > 1366) {
                this.reportSourcePaging.pop();
            }
        }
        
        return 1;
    }
}