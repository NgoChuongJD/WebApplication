import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataService } from '@app/core/services/data.service';
import { ReportModel } from '@app/core/models/report-model';

@Injectable()
export class ReportService {
    constructor(private readonly dataService: DataService) {
    }

    /**
     * Get Data of Report component
     * @param id
     */
    getReportData(reportId: number, topSimilar: number = 10, topRecommended: number = 10): Observable<ReportModel> {
        const params = {
            'reportId': reportId,
            'topSimilarCompany': topSimilar,
            'topRecommended': topRecommended
        };
        return this.dataService.get<any>(`api/reports/reportpagedetail/${params.reportId}/${params.topSimilarCompany}/${params.topRecommended}`);
    }
}