import { Component, Input } from '@angular/core';

@Component({
    selector: 'arp-page-heading',
    template: `<h4>{{text}}</h4>`
})
export class PageHeadingComponent {
    @Input() public text: string;
}
