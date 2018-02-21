import { Injectable, Injector } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { AccountService } from './account.service';
import { ProgressBarService } from './progress-bar.service';

@Injectable()
export class DataService {

    // Define the internal Subject we'll use to push the command count
    pendingCommandsSubject = new Subject<number>();
    pendingCommandCount = 0;

    // Provide the *public* Observable that clients can subscribe to
    pendingCommands$: Observable<number>;
    private _uriBase: string;

    /**
     * Gets the uri base (baseHref) of the application
     */
    get uriBase(): string {
        return this._uriBase;
    }

    constructor(locationStategy: LocationStrategy, public http: HttpClient, private inj: Injector, private progress: ProgressBarService) {
        this.pendingCommands$ = this.pendingCommandsSubject.asObservable();
        this._uriBase = locationStategy.getBaseHref();
    }

    getImage(url: string): Observable<any> {
        return this.concatProgressBar(Observable.create((observer: any) => {
            const req = new XMLHttpRequest();
            req.open('get', this.combineUrl(url));
            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200) {
                    observer.next(req.response);
                    observer.complete();
                }
            };

            req.setRequestHeader('Authorization', `Bearer ${this.inj.get(AccountService).accessToken}`);
            req.send();
        }));
    }

    get<T>(url: string, params?: any): Observable<T> {
        return this.concatProgressBar(
            this.http.get<T>( this.combineUrl(url), { params: this.buildUrlSearchParams(params) }
        ));
    }

    getFull<T>(url: string): Observable<HttpResponse<T>> {
        return this.concatProgressBar(this.http.get<T>(this.combineUrl(url), { observe: 'response' }));
    }

    post<T>(url: string, data?: any, params?: any): Observable<T> {
        return this.concatProgressBar(this.http.post<T>(this.combineUrl(url), data));
    }

    put<T>(url: string, data?: any, params?: any): Observable<T> {
        return this.concatProgressBar(this.http.put<T>(this.combineUrl(url), data));
    }

    delete<T>(url: string): Observable<T> {
        return this.concatProgressBar(this.http.delete<T>(this.combineUrl(url)));
    }

    private combineUrl(url: string): string {
        return `${this.uriBase}${url}`;
    }
    private buildUrlSearchParams(params: any): HttpParams {
        const searchParams = new HttpParams();
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                searchParams.append(key, params[key]);
            }
        }
        return searchParams;
    }

    /**
     * Shows/hides the progress bar for each request and hides it after completed
     * @param observable The observable object
     */
    private concatProgressBar(observable: Observable<any>) {
        const me = this;
        return observable.do(() => {
            me.progress.show();
        }).finally(() => {
            me.progress.hide();
        });
    }
}
