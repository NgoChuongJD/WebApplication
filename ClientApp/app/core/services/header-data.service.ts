import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

//import { DataService } from './data.service';
import { CountryModel, SectorModel } from '../models';


/**
 * A service to get countries & sectors data for the header menus
 */
@Injectable()
export class HeaderDataService {
    /**
     * Gets all the supported countries by euroland
     * @returns {Observable<CountryModel[]>}
     */
    getCountries(): Observable<CountryModel[]> {
        return new Observable(observer => {
            observer.next(this.getStaticCountryData());
        });
    }

    /**
     * Gets all the sectors 
     * @returns {Observable<SectorModel[]>}
     */
    getSectors(): Observable<SectorModel[]>{
        return new Observable(observer => {
            observer.next(this.getStaticSectorData());
        });
    }

    /**
     * Gets the countries data from the window object.
     * This data is generated arcordingly the loaded page.
     */
    private getStaticCountryData(): Array<CountryModel> {
        const appData = (<any>window)['appData'];
        if(!appData) {
            return [];
        }

        const countries = appData.countries || [];

        return countries;
    }

    /**
     * Gets the sectors data from the window object.
     * This data is generated arcordingly the loaded page.
     */
    private getStaticSectorData(): Array<SectorModel> {
        const appData = (<any>window)['appData'];
        if(!appData) {
            return [];
        }

        const sectors = appData.sectors || [];

        return sectors;
    }
}