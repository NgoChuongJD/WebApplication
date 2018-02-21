import { Injectable } from '@angular/core';
import { DataService } from '@app/core';
import { Observable } from 'rxjs/Rx';
import { HomeCompany } from './home-company';

@Injectable()
export class HomeCompanyService {
    constructor(private dataService: DataService) {
    }
    // other methods...
    public number = 5;
    public getCompanies(): Observable<HomeCompany[]> {
        return this.dataService.get<HomeCompany[]>('api/companies/featured');
    }
}