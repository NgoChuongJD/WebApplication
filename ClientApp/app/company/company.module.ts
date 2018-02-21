import { NgModule } from '@angular/core';
import { UrlPrepareService } from "@app/core/services/url-prepare.service";
import { SharedModule } from "../shared/shared.module";
import { CompanyComponent } from './company.component';
import { PrevReportComponent } from "./prev-report/prev-report.component";
import { routing } from './company.routes';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CompanyService } from "@app/company/company.service";
import { PrevReportService } from "@app/company/prev-report/prev-report.service";
import { SimilarCompanyService } from "@app/company/similar-company/similar-company.service";
import { MarketTabComponent } from "@app/company/market-tab/market-tab.component";
import { SimilarCompanyComponent } from "@app/company/similar-company/similar-company.component";
import { LatestReportComponent } from "@app/company/latest-report/latest-report.component"
@NgModule({
    imports: [
        routing,
        SharedModule,
        MatButtonModule,
        MatIconModule
    ],
    declarations: [
        CompanyComponent,
        PrevReportComponent,
        SimilarCompanyComponent,
        MarketTabComponent,
        LatestReportComponent
    ],
    exports: [
        MatButtonModule,
        MatIconModule
    ],
    providers: [
        CompanyService,
        PrevReportService,
        SimilarCompanyService,
        UrlPrepareService
    ]
})
export class CompanyModule { }