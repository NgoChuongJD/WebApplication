import { Injectable } from '@angular/core';
import { DataService } from "@app/core/services/data.service";
import { Observable } from 'rxjs/Rx';
import { SuggestionModel } from "@app/core/models/index";

@Injectable()
export class SuggestBoxService {
    constructor(private readonly dataService: DataService) {
    }

    // Get data of Country from API
    getSuggestion(query: string, returnCount: number = 10): Observable<SuggestionModel[]> {
        return this.dataService.get<SuggestionModel[]>(`api/search/suggestion/${query}/${returnCount}`);
    }
}