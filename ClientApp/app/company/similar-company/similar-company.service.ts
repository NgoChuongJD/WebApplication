import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DataService } from "@app/core/services/data.service";
import { HomeCompany } from '@app/home/home-companies/home-company';

@Injectable()
export class SimilarCompanyService {
    constructor(private readonly dataService: DataService) {
    }

    public getCompanies(companyCode: string, top: number): Observable<HomeCompany[]> {
        return this.dataService.get<HomeCompany[]>(`api/companies/similar/${companyCode}/${top}`);
    }
}