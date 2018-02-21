import {
    Component,
    OnInit,
    AfterViewInit,
    Inject,
    NgZone,
    Input, 
    HostListener,
    ViewChild,
    ElementRef
} from '@angular/core';

import { DOCUMENT } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Router, NavigationEnd } from "@angular/router";


import { WOWBOOK_VENDOR } from '../wowbook_vendor';

import { ReportDetailModel } from '@app/core/models/report-model';
import { LayoutBreakpointService, LayoutBreakpoint, UtilityService, WINDOW } from "@app/core";
import { 
    WowbookDefaultOptions, 
    WowbookApiCommands, 
    WOWBOOK_DEFAULT_OPTIONS, 
    WOWBOOK_DEFAULT_COMMANDS 
} from './wowbook-default-options';

// 
// Load pdf.js worker base on the `window.pdfjsWorkerUrl`, this is 
// global variable rendered on the Index.cshtml
const pdfjs = require('pdfjs-dist');
pdfjs.PDFJS.workerSrc = (<any>window).pdfjsWorkerUrl;

// Inteligent type for jquery wowbook
declare interface JQueryWowbook extends JQuery {
    wowBook(options?: any): JQuery;
}

@Component({
    selector: 'arp-pdf-reader',
    templateUrl: './pdf-reader.component.html',
    styles: [
        `
        .pdf-controls {
            color: $white;
            text-align: center;
            .controls-row {
                display: inline-block;
            }
        }
        
        .report-view.fullscreen {
            .pdf-controls {
                position: absolute;
                bottom: 0;
                width: 100%;
            }
        }
        `
    ],
    providers: [
        {
            provide: WOWBOOK_DEFAULT_OPTIONS,
            useValue: {
                zoomMax: 2,
                centeredWhenClosed: true,
                hardcovers: true,
                pageNumbers: false,
                // toolbar: "lastLeft, left, right, lastRight, toc, find, zoomin, zoomout, fullscreen, download, share",
                toolbar: "find, left, right",
                thumbnailsPosition: 'left',
                containerPadding: "0px",
                pdfFind: true,
                pdfTextSelectable: true,
                flipSound: false,
                controls: {},
                turnPageDuration: 1000,
                turnPageDurationMin: 100,
                responsive: true,
                container: null
            }
        },
        {
            provide: WOWBOOK_DEFAULT_COMMANDS,
            useValue: {
                next: 'advance',
                prev: 'back',
                zoomIn: 'zoomIn',
                zoomOut: 'zoomOut',
                zoomReset: 'zoomReset',
                gotoPage: 'gotoPage',
                gotoLeft: 'gotoLeft',
                gotoRight: 'gotoRight',
                gotoLastLeft: 'gotoLastLeft',
                gotoLastRight: 'gotoLastRight',
                toggleSlideShow: 'toggleSlideShow',
                toggleFlipSound: 'toggleFlipSound',
                toggleThumbnails: 'toggleThumbnails',
                toggleFullscreen: 'toggleFullscreen',
                toggleToc: 'toggleToc'
            }
        }
    ]
})

/** The pdf reader component that wraps the wowbook plugin with controls. */
export class PdfReaderComponent implements OnInit, AfterViewInit {
    // The wowbook api object. 
    // Reference: http://www.neuearbeit.de/wow_book_plugin/documentation/#using-the wowbook api
    private _wowbookApi: any;
    // The number of dependencies script needed for wowbook loading successfully
    private dependencyNum: number;
    private _jQuery: JQueryStatic;
    private scriptLoaded: number = 0;
    // Is the page is in fullscreen mode.
    isFullscreen: boolean = false;
    // Is the search panel visible or not.
    isSearchPanelVisible: boolean = false;

    // The current visible pages. Two values equivalent to 2 pages in multiple-page mode.
    currentPage: Array<number> = [];

    isSinglePageMode: boolean = true;

    totalPage: number;

    isNotFound: boolean = false;


    @ViewChild('wowbookContainer') _wowbookContainer: ElementRef;
    @ViewChild('pdfControl') _controlElRef: ElementRef;
    @ViewChild('fullscreenElem') _fullScreenElement: ElementRef;

    currentLayoutBreakpoint: LayoutBreakpoint;

    @Input('pdfUrl') 
    set pdfFileUri(pdfUri: string) {
        if(!pdfUri || pdfUri.length <= 0) {
            throw new Error('The pdf url not allow empty.')
        }

        this._defaultOptions.pdf = pdfUri;
    }
    @Input() reportData: ReportDetailModel;

    @Input('height')
    set setHeight(height: number) {
        if(height && height > 0) {
            this._defaultOptions.height = height;
        }
    }

    @Input('width')
    set setWidth(width: number) {
        if(width && width > 0) {
            this._defaultOptions.width = width;
        }
    }

    constructor(
        private readonly utilityService: UtilityService,
        private _zone: NgZone,
        private layoutBreakpointService: LayoutBreakpointService,
        private router: Router,
        @Inject(WOWBOOK_VENDOR) private wowbookVendors: string[],
        @Inject(DOCUMENT) private _document: Document,
        @Inject(WINDOW) private _widow: Window,
        @Inject(WOWBOOK_DEFAULT_OPTIONS) private _defaultOptions: WowbookDefaultOptions,
        @Inject(WOWBOOK_DEFAULT_COMMANDS) private _wowbooCommands: WowbookApiCommands
    ) {

        this.dependencyNum = this.wowbookVendors.length;
    }

    ngOnInit() {
        this.currentLayoutBreakpoint = this.layoutBreakpointService.currentBreakpoint;
        //this._defaultOptions.container = this._wowbookContainer.nativeElement;

        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }

            // Scrolls to top if not yet.
            let scrollToTop = this._widow.setInterval(() => {
                var pos = this._widow.pageYOffset;
                if (pos > 0) {
                    this._widow.scrollTo(0, pos - 20); 
                } else {
                    this._widow.clearInterval(scrollToTop);
                }
            }, 16);
        });
    }

    ngAfterViewInit() {
        this._zone.runOutsideAngular(() => {
            Observable.from(this.wowbookVendors).flatMap((val: string, index: number) => {
                return this.loadScript(val);
            }).subscribe(() => {
                if (++this.scriptLoaded == this.dependencyNum) {
                    this._jQuery = this._widow['jQuery'];
                    this.startWowbookUp();
                }
            });
        });
    }

    /**
     * Bookmarks the current reading page.
     */
    bookmark() {

    }

    /** Zooms in opening document. */
    zoomIn() {
        this.executeWowbookApi(this._wowbooCommands.zoomIn, {});
    }

    /** Zooms out opening document. */
    zoomOut() {
        this.executeWowbookApi(this._wowbooCommands.zoomOut, {});
    }

    /** Shows/hides the searching text panel. */
    toggleSearchPanel() {

    }

    /** Searches the text in pdf document. */
    doSearch(searchText: string) {

    }

    /** Enters or leaves the fullscreen mode. */
    toogleFullScreen() {
        this.executeWowbookApi(this._wowbooCommands.toggleFullscreen);
        /*if(!this.getFullScreenElement()) {
            this.isFullscreen = this.makeElementFullscreen(this.getParent());
        } else {
            this.isFullscreen = this.exitFullscreen();
        }*/
    }

    /** Goes to the next page. */
    next() {
        this.executeWowbookApi(this._wowbooCommands.next);
    }

    /** Goes to the previous page. */
    prev() {
        this.executeWowbookApi(this._wowbooCommands.prev);
    }

    /** Loades wowbook dependencies.  */
    private loadScript(scriptSrc: string): Observable<any> {
        return this.utilityService.loadScript(scriptSrc);
    }

    // private getParent(): HTMLElement {
    //     return (<HTMLElement>this._wowbookContainer.nativeElement).parentElement;
    // }

    private startWowbookUp() {
        // Set container element so that wowbook can be responsively
        let parent = this._fullScreenElement.nativeElement;
        this._defaultOptions.container = parent;
        let dimension = this.calculatePdfViewport();
        this._defaultOptions.height = dimension[1];
        this._defaultOptions.width = dimension[0];
        this._defaultOptions.fullscreenElement = parent;

        (<JQueryWowbook>this._jQuery(this._wowbookContainer.nativeElement)).wowBook(this._defaultOptions);
        this._wowbookApi = (<any>this._jQuery).wowBook(this._wowbookContainer.nativeElement);
    }

    /** A wrapper to execute wowbook's API methods */
    private executeWowbookApi(...args: any[]) {
        if(!this.isWowbookReady()) {
            return;
        }

        let parameters = Array.prototype.slice.call(arguments, 1);
        let method = Array.prototype.slice.call(arguments, 0, 1);
        if(!method || String(method).length <= 0 || !(method in this._wowbookApi)) {
            return;
        }

        this._wowbookApi[method].apply(this._wowbookApi, parameters);
    }

    /** Checks whether wowbook is initialized and ready */
    private isWowbookReady(): boolean {
        return !!this._wowbookApi;
    }

    /** Calculates dynamically the dimension of pdf-reader */
    private calculatePdfViewport(): Array<number> {
        //this._widow
        let header = this._document.getElementsByTagName('mat-toolbar');
        let headerHeight = 0;
        if(header && header.length) {
            headerHeight = this.getElementHeight(header[0]);
        }

        let controlHeight = 0;
        if(this._controlElRef) {
            controlHeight = this.getElementHeight(this._controlElRef.nativeElement);
        }

        let windowHeight = this._widow.innerHeight;
        let windowWidth = this._widow.innerWidth;

        return [windowWidth, windowHeight - headerHeight - controlHeight];
    }

    /** Gets native height of an element */
    private getElementHeight(el: any) {
        return el.clientHeight || el.offsetHeight;
    }
}