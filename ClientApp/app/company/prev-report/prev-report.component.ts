import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HomeReportsItems } from "@app/home/home-reports/home-reports-items/home-reports-items";
import { LayoutBreakpointService, LayoutBreakpoint } from "@app/core/services/layout-breakpoint.service";
import { PrevReportService } from "@app/company/prev-report/prev-report.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'arp-company-prev-report',
    templateUrl: './prev-report.component.html'
})

export class PrevReportComponent implements AfterViewInit {
    PREVIOUS_REPORT_HEADER: string = 'Previous reports';

    @Input() companyName: string;
    @ViewChild('reportList') reportList: ElementRef;

    dataLoadCompletedState: boolean;
    private reportSource: HomeReportsItems[] = [];
    reportSourcePaging: HomeReportsItems[] = [];

    private pageSize: number = 0;
    total: number = 0;
    hasMore: boolean;

    constructor(private readonly dataService: PrevReportService,
        private readonly route: ActivatedRoute,
        private readonly layoutBreakpointService: LayoutBreakpointService) {
        this.route.params.subscribe(param => {
            this.dataLoadCompletedState = false;
            if (!param['companyCode']) {
                return;
            }
            
            this.pageSize = this.getPageSize(layoutBreakpointService.currentBreakpoint);

            this.dataService.getReport(param['companyCode'], 999).subscribe(reports => {
                if (reports.length > 0) {
                    this.reportSource = reports;
                    this.total = this.reportSource.length;

                    this.reportSourcePaging = this.reloadDataView(this.pageSize);
                }

                this.dataLoadCompletedState = true;
                if (LayoutBreakpoint.Desktop == this.layoutBreakpointService.currentBreakpoint) {
                    const timer = setInterval(() => {
                        if (this.checkOverflowCards() > 0) {
                            clearInterval(timer);
                        }
                    }, 250);
                }
            });
        });
    }

    ngAfterViewInit(): void {
        this.layoutBreakpointService.breakpointSource.subscribe(breakpoint => {
            // refresh view
            this.pageSize = this.getPageSize(breakpoint);
        });
    }

    /**
     * Append items of next page
     */
    getMoreReport() {
        let extra = this.pageSize - (this.reportSourcePaging.length % this.pageSize);

        //if (extra == this.pageSize / 2) {
        //    extra = this.pageSize;
        //}

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

    private reloadDataView(next: number, start: number = 0): any {
        let end = start > 0 ? start + next : start + this.pageSize;

        //console.log(`Get from ${start} to ${end}`);
        this.hasMore = end < this.total;
        return this.reportSource.slice(start, end);
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

    private getPageSize(breakpoint: any): number {
        let topRecommended: number = 0;
        const rowTablet = 3;
        const rowMobile = 2;

        switch (breakpoint) {
            case LayoutBreakpoint.Desktop: {
                // desktop
                topRecommended = 10; // 5 col x 2 row
                break;
            }
            case LayoutBreakpoint.HandsetPortrait:
                {
                    // mobile portrait
                    topRecommended = 2 * rowMobile; // 2 col x 2 row
                    break;
                }
            case LayoutBreakpoint.TabletLandscape:
                {
                    //tablet Landscape
                    topRecommended = 4 * rowTablet; // 4 col x 3 row
                    break;
                }
            case LayoutBreakpoint.TabletPortrait:
                {
                    //tablet Portrait
                    topRecommended = 3 * rowTablet; // 4 col x 3 row
                    break;
                }
            default: {
                // mobile Landscape
                topRecommended = 3 * rowMobile; // 3 col x 2 row
                break;
            }
        }

        return topRecommended;
    }
}