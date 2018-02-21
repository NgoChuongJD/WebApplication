import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Filter } from "@app/shared/models/filter.model";
import { CompanyInfoFilterModel } from "@app/core/models/company-info-filter-model";
import { CountryModel, SectorModel, IndustryModel, ExchangeModel } from "@app/core/models/index";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataService } from "@app/core/services/data.service";

@Injectable()
export class FilterExploreService {
    private currentFilter = new Filter();
    private filterSource = new BehaviorSubject<Filter>(this.currentFilter);
    filterData = this.filterSource.asObservable();

    constructor(private readonly dataService: DataService) {
        this.currentFilter.sectorId = [];
        this.currentFilter.years = [];
    }

    // Get data of Country from API
    getCountries(): Observable<CountryModel[]> {
        return this.dataService.get<CountryModel[]>('api/countries');
    }

    // Get data of Sector from API
    getSectors(): Observable<SectorModel[]> {
        return this.dataService.get<SectorModel[]>('api/sectors');
    }

    getExchanges(): Observable<ExchangeModel[]> {
        try {
            return this.dataService.get<ExchangeModel[]>('api/countries/exchange');    
        } catch (e) {

        }
        return null;
    }

    getIndustries(): Observable<IndustryModel[]> {
        try {
            return this.dataService.get<IndustryModel[]>('api/sectors/industries');
        } catch (e) {

        }
        return null;
    }

    /**
     * Get industry by multiple sector
     * @param sectorId
     */
    getIndustriesBySector(sectorId: number[], industries: IndustryModel[]): IndustryModel[] {
        // no sector selected, return all industries
        if (sectorId == undefined || sectorId.length <= 0)
        {
            return industries;
        }
        
        const industriesDisplay:IndustryModel[] = [];

        sectorId.forEach((sector) =>
        {
            industriesDisplay.push(...industries.filter((item) => item.sectorID == sector));
        });

        industriesDisplay.sort((prev, next) => {
            return prev.industryName > next.industryName ? 1 : -1;
        });
        return industriesDisplay;
    }

    // Build year filter box data
    getYears(minYear: number): number[] {
        const yearsFilter: number[] = [];
        const currentYear = (new Date()).getFullYear();
        
        if (minYear > currentYear - 10) {
            minYear = currentYear - 10;
        }

        // 8 years ago till now
        for (let i = minYear; i < currentYear; i++) {
            yearsFilter.push(i);
        }

        yearsFilter.reverse();

        return yearsFilter;
    }

    /**
     * get data to fill form control
     * @param comanyName
     */
    getCompanyData(companyName: string): Observable<CompanyInfoFilterModel> {
        return this.dataService.get<CompanyInfoFilterModel>(`api/companies/infosbyname/${companyName}`);
    }

    getFilter(): Filter {
        this.filterSource.subscribe((data) => {
            this.currentFilter = data;
        });
        return this.currentFilter;
    }

    changeFilter(filter: Filter) {
        this.filterSource.next(filter);
    }
}