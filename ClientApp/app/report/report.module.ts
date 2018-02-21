
import { NgModule } from '@angular/core';

import { SharedModule } from "../shared/shared.module";
import { ReportComponent } from './report.component';
import { routing } from './report.routes';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { OwnerCompanyReportComponent } from './owner-company-report/owner-company-report.component';
import { SimilarCompanyReportComponent } from './similar-company-report/similar-company-report.component';
import { ReportOptionsComponent } from "./pdf-viewer/options/options.component";
import { ReportService } from "@app/report/report.service";
import { PrevReportService } from "@app/company/prev-report/prev-report.service";
import { SavingModalComponent } from "@app/report/pdf-viewer/options/saving-modal/saving-modal.component";
import { SharingModalComponent } from "@app/report/pdf-viewer/options/sharing-modal/sharing-modal.component";
import { WOWBOOK_VENDOR } from './wowbook_vendor';
import { UrlPrepareService } from "@app/core/services/url-prepare.service";

import { PdfReaderComponent } from './pdf-viewer/pdf-reader.component';
//import { WOWBOOK_DEFAULT_OPTIONS, WOWBOOK_DEFAULT_COMMANDS } from './pdf-viewer/wowbook-default-options';

@NgModule({
    imports: [
        routing, 
        SharedModule
    ],
    declarations: [
        ReportComponent,
        PdfViewerComponent,
        OwnerCompanyReportComponent,
        SimilarCompanyReportComponent,
        ReportOptionsComponent,
        SavingModalComponent,
        SharingModalComponent,
        PdfReaderComponent
    ],
    entryComponents: [
        SavingModalComponent,
        SharingModalComponent
    ],
    providers: [
        ReportService,
        PrevReportService,
        UrlPrepareService,
        {
            provide: WOWBOOK_VENDOR,
            useValue: (<any>window)['wowbook_libs']
        }
    ]
})
export class ReportModule { }
