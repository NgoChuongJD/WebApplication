import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DataService } from "@app/core/services/data.service";
import { CompanyProfileModel } from "@app/core/models/company-profile-model";

@Injectable()
export class CompanyService {
    constructor(private readonly dataService: DataService) {

    }

    getCompanyProfile(companyCode: string): Observable<CompanyProfileModel> {
        return this.dataService.get<CompanyProfileModel>(`api/companies/${companyCode}`);
    };
}