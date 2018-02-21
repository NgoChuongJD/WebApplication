import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DataService } from "@app/core/services/data.service";
import { HomeReportsItems } from "@app/home/home-reports/home-reports-items/home-reports-items";

@Injectable()
export class PrevReportService {
    constructor(private readonly dataService: DataService) {
    }

    getReport(companyCode: string, top: number): Observable<HomeReportsItems[]> {
        return this.dataService.get<HomeReportsItems[]>(`api/reports/${companyCode}/${top}`);
    }
}