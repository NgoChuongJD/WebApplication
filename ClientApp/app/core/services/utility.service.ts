import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class UtilityService {
    public _router: Router;
    constructor(router: Router) {
        this._router = router;
    }

    private messageSource = new BehaviorSubject<string>("default message");
    public currentMessage = this.messageSource.asObservable();
    public changeMessage(message: string) {
        this.messageSource.next(message)
    }
    

    public convertDateTime(date: Date) {
        const _formattedDate = new Date(date.toString());
        return _formattedDate.toDateString();
    }

    public navigate(path: string) {
        this._router.navigate([path]);
    }

    public navigateToSignIn() {
        this.navigate('/login');
    }

    public getParams() {
        const searchParams = window.location.search.split('?')[1];
        if (searchParams) {
            const paramsObj: any = {};

            searchParams.split('&').forEach(i => {
                paramsObj[i.split('=')[0]] = i.split('=')[1];
            });
            return paramsObj;
        }
        return undefined;
    }
    public readableColumnName(columnName: string): string {
        // Convert underscores to spaces
        if (typeof (columnName) === 'undefined' || columnName === undefined || columnName === null) { return columnName; }

        if (typeof (columnName) !== 'string') {
            columnName = String(columnName);
        }

        return columnName.replace(/_+/g, ' ')
            // Replace a completely all-capsed word with a first-letter-capitalized version
            .replace(/^[A-Z]+$/, (match) => {
                return ((match.charAt(0)).toUpperCase() + match.slice(1)).toLowerCase();
            })
            // Capitalize the first letter of words
            .replace(/([\w\u00C0-\u017F]+)/g, (match) => {
                return (match.charAt(0)).toUpperCase() + match.slice(1);
            })
            // Put a space in between words that have partial capilizations (i.e. 'firstName' becomes 'First Name')
            // .replace(/([A-Z]|[A-Z]\w+)([A-Z])/g, "$1 $2");
            // .replace(/(\w+?|\w)([A-Z])/g, "$1 $2");
            .replace(/(\w+?(?=[A-Z]))/g, '$1 ');
    }

    public loadStyle(link: string): Observable<any> {
        if (this.isLoadedStyle(link)) {
            return Observable.of('');
        } else {
            const head = document.getElementsByTagName('head')[0];
            // Load jquery Ui
            const styleNode = document.createElement('link');
            styleNode.rel = 'stylesheet';
            styleNode.type = 'text/css';
            styleNode.href = link;
            styleNode.media = 'all';
            head.appendChild(styleNode);
            return Observable.fromEvent(styleNode, 'load');
        }
    }
    public loadScript(scriptSrc: string): Observable<any> {
        
        if (this.isLoadedScript(scriptSrc)) {
            return Observable.of('');
        } else {
            // Load jquery Ui
            const scriptNode = document.createElement('script');
            scriptNode.src = scriptSrc;
            scriptNode.async = false;
            scriptNode.type = 'text/javascript';
            scriptNode.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(scriptNode);
            return Observable.fromEvent(scriptNode, 'load');
            /*let subscriber = Subscriber.create();
            
            let scriptNode = document.createElement('script') as any;
                scriptNode.type = 'text/javascript';
                scriptNode.src = scriptSrc;
                
                scriptNode.onerror = (error: any) => observer.error(error);
                document.getElementsByTagName('head')[0].appendChild(scriptNode);
            return new Observable(observer => {
                let scriptNode = document.createElement('script') as any;
                scriptNode.type = 'text/javascript';
                scriptNode.src = scriptSrc;
                if (scriptNode.readyState) {  //IE
                    scriptNode.onreadystatechange = () => {
                        if (scriptNode.readyState === "loaded" || scriptNode.readyState === "complete") {
                            scriptNode.onreadystatechange = null;
                            
                            //resolve({script: name, loaded: true, status: 'Loaded'});
                            observer.next();
                            observer.complete();
                        }
                    };
                } else {  //Others
                    scriptNode.onload = (e:any) => {
                        console.log(e);
                        observer.next();
                        observer.complete();
                    };
                }
                scriptNode.onerror = (error: any) => observer.error(error);
                document.getElementsByTagName('head')[0].appendChild(scriptNode);
            }).;*/
        }
    }
    toQueryParams(obj: any): string {
        return Object.keys(obj)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
            .join('&');
    }

    public fromQueryParams(queryString: string): Object {
        const query: any = {};
        const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split('=');
            query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        return query;
    }

    public formatErrors(errors: any) {
        return errors ? errors.map((err: any) => err.message).join('/n') : '';
    }
    // Detect if library loaded
    private isLoadedScript(lib: string) {
        return document.querySelectorAll('[src="' + lib + '"]').length > 0;
    }

    private isLoadedStyle(lib: string) {
        return document.querySelectorAll('[href="' + lib + '"]').length > 0;
    }

    
    private pageName:string;

    public setPageInfo(name:string) {
        this.pageName = name;
    }

    public getPageInfo() {
        let temp = this.pageName;
        this.clearData();
        return temp;
    }

    private clearData() {
        this.pageName = undefined;
    }

    serviceData: string;

}
