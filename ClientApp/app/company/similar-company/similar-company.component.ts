import { Component, Input, AfterViewInit } from "@angular/core";
import {
    LayoutBreakpointService,
    LayoutBreakpoint
} from "@app/core/services/layout-breakpoint.service";
import { SimilarCompanyService } from "@app/company/similar-company/similar-company.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HomeCompany } from "@app/home/home-companies/home-company";
import { UrlPrepareService } from "@app/core/services/url-prepare.service";

@Component({
    selector: "similar-company",
    templateUrl: "./similar-company.component.html"
})
export class SimilarCompanyComponent implements AfterViewInit {
    otherReportTitle = 'Others  also viewed';
    messageAlert = 'There are not any companies!';
    dataLoadCompletedState = false;
    public device: any;
    public number = 5;
    @Input() companyCode: string;
    @Input() sectorId: string;
    companies: HomeCompany[];
    constructor(
        private layoutBreakpointService: LayoutBreakpointService,
        private companyService: SimilarCompanyService,
        private route: ActivatedRoute,
        private router: Router,
        private urlPrepareService: UrlPrepareService
    ) {
        this.device = this.layoutBreakpointService.currentBreakpoint;
        this.route.params.subscribe(param => {
            this.dataLoadCompletedState = false;
            if (!param['companyCode']) {
                return;
            }
            this.companyCode = param['companyCode'];
            this.getCompanies(this.companyCode);
        });
    }

    ngAfterViewInit() {
        this.layoutBreakpointService.breakpointSource.subscribe(breakpoint => {
            this.device = breakpoint;
            this.getCompanies(this.companyCode);
        });
    }

    private getCompanies(companyCode: string) {
        if (this.device === LayoutBreakpoint.Desktop) {
            this.number = 5;
        } else if (
            this.device === LayoutBreakpoint.TabletLandscape ||
            this.device === LayoutBreakpoint.HandsetLandscape
        ) {
            this.number = 4;
        } else {
            this.number = 3;
        }

        this.companyService
            .getCompanies(companyCode, this.number)
            .subscribe(results => {
                results.forEach(item => {
                    item.companyNameEncoded =
                        this.urlPrepareService.replaceSpecialCharacter(item.companyName);
                });

                this.companies = results;

                if (this.companies.length > 0 && this.companies[0].sectorId) {
                    this.sectorId = this.companies[0].sectorId;
                }

                this.dataLoadCompletedState = true;
            });
    }

    goToExplore(sectorId: number) {
        this.router.navigate(['/explore'], {
            queryParams: {
                exploreType: 'company',
                sectorId: sectorId
            }
        });
    }
}