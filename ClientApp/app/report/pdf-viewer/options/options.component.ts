import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SavingModalComponent } from "@app/report/pdf-viewer/options/saving-modal/saving-modal.component";
import { SharingModalComponent } from "@app/report/pdf-viewer/options/sharing-modal/sharing-modal.component";
import { UrlPrepareService } from "@app/core/services/url-prepare.service";

@Component({
    selector: 'arp-report-options',
    templateUrl: './options.component.html'
})

export class ReportOptionsComponent implements OnInit {
    @Input() pdfFilePath: string;
    @Input() isMobile: boolean;
    @Input() logo: string;
    @Input() companyCode: string;
    @Input() companyName: string = '';
    @Input() title: string = '';
    @Input() languageCode = '';

    overview = 'Contents overview';
    saving = 'Saving options';
    share = 'Share this document';
    isFullScreen: boolean;
    companyNameEncoded: string;

    constructor(public savingModal: MatDialog, private readonly urlPrepareService: UrlPrepareService) {
    }

    ngOnInit(): void {
        this.companyNameEncoded = this.urlPrepareService.replaceSpecialCharacter(this.companyName);
    }

    openSavingModal(): void {
        const dialogRef = this.savingModal.open(SavingModalComponent, {
            //width: '40%',
            data: { title: this.title, pdfUrl: this.pdfFilePath }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            //console.log(result);
        });
    }

    openSharingModal() {
        const dialogRef = this.savingModal.open(SharingModalComponent, {
            //width: '80%',
            data: { isLoggedIn: false }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            //console.log(result);
        });
    }
}