import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'arp-search',
    templateUrl: './search.component.html'
})
/** search component*/
export class SearchComponent {
    /** search ctor */
    query: string;

    constructor(private readonly route: ActivatedRoute) {
        this.route.params.subscribe(params => {
            if (params['query']) {
                this.query = params['query'];
            }
        });
    }
}