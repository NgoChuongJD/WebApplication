import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HeaderDataService } from '../../services/header-data.service';
import { CountryModel } from '../../models';
import { Router } from "@angular/router";
import { LayoutBreakpointService, LayoutBreakpoint } from '../../../core/services/layout-breakpoint.service';
@Component({
    selector: 'arp-country-list',
    templateUrl: './country-list.component.html'
})

export class CountryListComponent implements OnInit {
    @Output() onItemClicked = new EventEmitter<void | 'click' | 'keydown'>();   
    coutries: Observable<CountryModel[]>;
    isMobileDevice: boolean = true;
    constructor(private headerDataService: HeaderDataService, private router: Router,private layoutBreakpointService: LayoutBreakpointService) {
        this.isMobileDevice = this.checkMobileDeviceLayout(this.layoutBreakpointService.currentBreakpoint);
    }

    ngOnInit() {
        this.coutries = this.headerDataService.getCountries();       

    }

    private checkMobileDeviceLayout(breakPoint: LayoutBreakpoint): boolean {
        return breakPoint == LayoutBreakpoint.HandsetLandscape || breakPoint == LayoutBreakpoint.HandsetPortrait;
        
    }
    public navigateToExplore(countryCode: string): void 
    {
        if(this.onItemClicked)
        {
            this.onItemClicked.emit();
        }

        this.router.navigate(['explore'], { queryParams: { countryCode: countryCode} });
    }
}