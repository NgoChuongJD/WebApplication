import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'arp-option-sharing-modal',
    templateUrl: './sharing-modal.component.html'
})
/** sharing-modal component*/
export class SharingModalComponent {
    isLoggedIn: boolean;

    constructor(public dialogRef: MatDialogRef<SharingModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.isLoggedIn = this.data.isLoggedIn;

    }
}