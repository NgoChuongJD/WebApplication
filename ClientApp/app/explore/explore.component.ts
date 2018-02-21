import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilterExploreService } from "@app/explore/filter-explore/filter-explore.service";
import { Filter } from "@app/shared/models/filter.model";

@Component({
    selector: 'arp-explore-filter',
    templateUrl: './explore.component.html'
})
export class ExploreComponent implements OnInit {
    completeCompanyLoad: boolean = false;
    filterModel = new Filter();

    constructor(private readonly filter: FilterExploreService,
        private readonly route: ActivatedRoute) {
    }

    ngOnInit(): void { 
        this.route.queryParams.subscribe(params => {
            this.filterModel.years = [];
            this.filterModel.sectorId = [];
            this.filterModel.exchangeId = [];
            this.filterModel.industryId = [];

            if (params['query']) {
                this.filterModel.query = params['query'];

                const queryPasred = this.getNameYear(this.filterModel.query);

                this.filter.getCompanyData(encodeURIComponent(queryPasred.companyName)).subscribe(data => {
                    this.filterModel.companyName = queryPasred.companyName;

                    if (queryPasred.reportYear) {
                        this.filterModel.exploreType = 'report';
                        this.filterModel.years.push(queryPasred.reportYear);
                    } else {
                        this.filterModel.exploreType = 'company';
                        this.filterModel.years.push((new Date()).getFullYear() - 1);
                    }
                    
                    this.filterModel.countryCode = data.countryCode;
                    this.filterModel.exchangeId.push(data.marketId);
                    this.filterModel.sectorId.push(data.sectorId);
                    this.filterModel.industryId.push(data.industryId);

                    // Load data done
                    this.completeCompanyLoad = true;
                });
            }
            else {
                if (params['countryCode']) {
                    this.filterModel.countryCode = params['countryCode'];
                }

                // accept more than 1 sector id, such as sectorId=16,1,3,5,6,9
                if (params['sectorId']) {
                    (params['sectorId'] as string).split(',').forEach(id => {
                        this.filterModel.sectorId.push(+id);
                    });
                }

                if (params['marketId']) {
                    (params['marketId'] as string).split(',').forEach(id => {
                        this.filterModel.exchangeId.push(+id);
                    });
                }

                if (params['industryId']) {
                    (params['industryId'] as string).split(',').forEach(id => {
                        this.filterModel.industryId.push(+id);
                    });
                }

                this.filterModel.exploreType = params['exploreType'] &&
                    (params['exploreType'] as string).toLowerCase() == 'report'
                    ? 'report'
                    : 'company';

                const currentYear = new Date().getFullYear() - 1;

                if (params['year'] == undefined || +params['year'] > currentYear) {
                    this.filterModel.years.push(currentYear);
                } else {
                    this.filterModel.years.push(+params['year']);  
                }
                
                this.completeCompanyLoad = true;
            }
        });
    }

    private getNameYear(word: string): any {
        const reg = /\d{4}\s*?$/ig;

        const name = word.trim().replace(reg, '').replace(new RegExp('Annual Report', 'ig'), '');
        const test = word.match(reg);
        const year = test ? test[0] : null;

        return { companyName: name, reportYear: +year }
    }
}