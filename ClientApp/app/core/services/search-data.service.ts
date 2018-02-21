import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

//import { DataService } from './data.service';

/**
 * Service to get the suggestion or searching data of company and report
 */
@Injectable()
export class SearchDataService {
    constructor() {

    }

    /**
     * Gets the suggestion list of companies and reports
     * @param query The criterial to search
     */
    getSuggestion(query: string): Observable<any> {
        if(!query || query.length == 0){
        
        }

        return new Observable(observer => {
            observer.next([
                { text: 'Sample search 1'},
                { text: 'Sample search 2'},
                { text: 'Sample search 3'}
            ]);
        });
    }

    /**
     * Gets the result matching with @query
     * @param query The criterial to search
     */
    search(query: string): Observable<any> {
        return null;
    }
}