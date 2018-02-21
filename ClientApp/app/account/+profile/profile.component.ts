import { Component } from '@angular/core';

import { ProfileService } from './profile.service';

@Component({
    selector: 'arp-profile',
    templateUrl: './profile.component.html'
})
export class ProfileComponent {
    constructor(public profileService: ProfileService) { }
}
