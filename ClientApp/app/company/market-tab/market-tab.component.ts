import { Component, Input, OnInit } from '@angular/core';
import { CompanyProfile, Instrument } from "@app/core/models/company-profile-model";

@Component({
    selector: 'arp-company-market-tab',
    templateUrl: './market-tab.component.html'
})

export class MarketTabComponent implements OnInit {
    @Input() companyProfile: CompanyProfile;
    @Input() marketData: Instrument[] = [];
    
    SECTOR_LABEL: string = 'Sector';
    INDUSTRY_LABEL: string = 'Industry';
    COUNTRY_LABEL: string = 'Country';
    EXCHANGE_LABEL: string = 'Exchange';
    SEGMENT_LABEL: string = 'Segment';
    CAP_DESCRIPTION_TEXT: string = 'Disclaimer: Percentage based on 52 weeks performance.';
    selectedMarket: Instrument;

    constructor() {

    }

    ngOnInit(): void {
        this.setDefaultMarket();
    }

    changeSelectedMarket(symbol: any, reorder = false) {
        this.marketData.forEach(item => {
            if (item.symbol == symbol) {
                item.selected = true;
                this.selectedMarket = item;
            } else {
                item.selected = false;
            }
        });

        if (reorder) {
            this.marketData.sort(this.compare);    
        }
    }

    private setDefaultMarket() {
        if (this.marketData && this.marketData.length > 0) {
            this.marketData[0].selected = true;
            this.selectedMarket = this.marketData[0];
        }
        
    }

    private compare(a: Instrument, b: Instrument): number {
        return a.selected == b.selected ? 0 : a.selected ? -1 : 1;
    }
}