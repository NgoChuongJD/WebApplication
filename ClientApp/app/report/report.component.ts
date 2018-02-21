import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeReportsItems } from "@app/home/home-reports/home-reports-items/home-reports-items";
import { ReportService } from "@app/report/report.service";
import { ReportDetailModel } from '@app/core/models/report-model';
import { LayoutBreakpointService, LayoutBreakpoint } from "@app/core/services/layout-breakpoint.service";

@Component({
    selector: 'arp-report',
    templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit, OnDestroy, AfterViewInit {
    errorLoadData: boolean;
    dataLoadCompletedState: boolean;
    id: number;
    topRecommended: number = 0;

    // Company Reports
    reportData: ReportDetailModel;
    companyReport: HomeReportsItems[];
    
    private reportYear: number;
    similarReport: HomeReportsItems[];
    landscapeSimilarCache: HomeReportsItems[];
    portraitSimilarCache: HomeReportsItems[];

    constructor(private readonly route: ActivatedRoute, private router: Router,
        private readonly reportService: ReportService,
        private readonly layoutBreakpointService: LayoutBreakpointService) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (params['id'] == undefined) {
                return;
            }

            this.id = +params['id'];
            
            this.landscapeSimilarCache = [];
            this.portraitSimilarCache = [];
            
            // load data reprt for  first time
            this.reloadDataView(this.id, this.layoutBreakpointService.currentBreakpoint);
        });
    }

    ngAfterViewInit(): void {
        this.layoutBreakpointService.breakpointSource.subscribe(breakpoint => {
            this.reloadDataView(this.id, breakpoint, true);
        }); 
    }

    ngOnDestroy(): void {
        this.dataLoadCompletedState = false;
        this.reportData = null;
    }

    private reloadDataView(id: number, breakpoint: any, isResize: boolean = false) {
        let topSimilar: number = 0;

        // on reload page
        if (!isResize) {
            this.dataLoadCompletedState = false;
        }

        switch (breakpoint) {
            case LayoutBreakpoint.Desktop: {
                // desktop
                this.topRecommended = 10;
                topSimilar = 5;
                break;
            }
            case LayoutBreakpoint.HandsetPortrait:
                {
                    // mobile portrait
                    this.topRecommended = 6; // 2 col x 3 row
                    topSimilar = 4;
                    break;
                }
            case LayoutBreakpoint.TabletLandscape:
                {
                    //tablet Landscape
                    this.topRecommended = 8;
                    topSimilar = 8;

                    break;
                }
            default: {
                // Tablet Portrait
                // mobile Landscape
                this.topRecommended = 9; // 3 x 3 row
                topSimilar = 6; // 3 x 2 row
                break;
            }
        }
        let isLandSca = this.isLandScape(breakpoint);

        //get data report  from  cache variable     
        if (this.landscapeSimilarCache.length > 0 && isLandSca == 1) {
            this.similarReport = this.landscapeSimilarCache;
            return;
        }
        else if (this.portraitSimilarCache.length > 0 && isLandSca == 2) {
            this.similarReport = this.portraitSimilarCache;
            return;
        }
        //get data report and save into cache from api for first time     
        this.getReportDataFromApi(id, topSimilar, 999, breakpoint);
    }

    private getReportDataFromApi(id: number, topSimilar: any, topRecommended: any, breakpoint: any) {
        this.reportService.getReportData(id, topSimilar, topRecommended).subscribe(data => {
            this.reportData = data.reportDetail;
            this.companyReport = data.recommendedReports;
            this.similarReport = data.similarReports;

            // Cache data
            if (this.isLandScape(breakpoint) == 1) {
                this.landscapeSimilarCache = this.similarReport;

            }
            else if (this.isLandScape(breakpoint) == 2) {
                this.portraitSimilarCache = this.similarReport;
            }

            this.reportYear = this.getReportYear(this.reportData.title);
            // set flag
            this.dataLoadCompletedState = true;
            document.title = this.reportData.companyName + ' ' + this.reportData.title;

        });
    }

    private getReportYear(word: string): any {
        const reg = /\d{4}\s*?$/ig;
        const test = word.match(reg);
        const year = test ? test[0] : null;
        return year;
    }

    private isLandScape(breakpoint: LayoutBreakpoint): number {
        if (breakpoint == LayoutBreakpoint.TabletLandscape || breakpoint == LayoutBreakpoint.HandsetLandscape) {
            return 1;
        }
        else if (breakpoint == LayoutBreakpoint.HandsetPortrait || breakpoint == LayoutBreakpoint.TabletPortrait) {
            return 2;
        }

        return 0;
    }

    goCompanyProfile() {
        const path = this.reportData.companyName ? this.reportData.companyName.toLowerCase().split(' ').join('-') : '';
        this.router.navigate(['/company', this.reportData.companyCode, encodeURIComponent(path)]);
    }
}