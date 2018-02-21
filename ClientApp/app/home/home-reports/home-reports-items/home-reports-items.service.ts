import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DataService } from '@app/core';
import { HomeReportsItems } from './home-reports-items';

@Injectable()
export class HomeReportsItemsService {
    constructor(private dataService: DataService) {
    }
    // other methods...
    public number = 15;
    getReports(): Observable<HomeReportsItems[]> {
        return this.dataService.get<HomeReportsItems[]>('api/reports/recommendation/' + this.number);
    }
}