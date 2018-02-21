import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'arp-option-saving-modal',
    templateUrl: './saving-modal.component.html'
})
/** saving-modal component*/
export class SavingModalComponent {
    pdfUrl: string;
    title: string;

    constructor(public dialogRef: MatDialogRef<SavingModalComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any) {
        this.title = this.data.title;
        this.pdfUrl = this.data.pdfUrl;
    }

    closeModal() {
        this.dialogRef.close();
    }
}