
import {
    Component,
    OnInit,
    AfterViewInit,
    Inject,
    NgZone,
    Input, HostListener,
    ElementRef, ViewChild
} from '@angular/core';
import { ReportDetailModel } from '@app/core/models/report-model';
import { DOCUMENT } from '@angular/platform-browser';
import { UtilityService } from '@app/core';
import { Observable } from 'rxjs/Observable';
import { WOWBOOK_VENDOR } from '../wowbook_vendor';
import { LayoutBreakpointService, LayoutBreakpoint } from "@app/core/services/layout-breakpoint.service";
import { Router } from "@angular/router";


const pdfjs = require('pdfjs-dist');
pdfjs.PDFJS.workerSrc = (<any>window).pdfjsWorkerUrl;
declare interface JQueryWowbook extends JQuery {
    wowBook(options?: any): JQuery;
}


@Component({
    selector: 'arp-pdf-viewer',
    templateUrl: './pdf-viewer.component.html'
})

export class PdfViewerComponent implements OnInit, AfterViewInit {
    private _jQuery: JQueryStatic;
    private scriptLoaded: number = 0;
    private dependencyNum: number;
    private paddingValue: number = 10;
    private headerHeight: number = 64;
    private controlHeight: number = 48;
    pageIndex: number = 0;
    pagesLength: number = 0;
    device: any;
    doubleModeCurrent: boolean = true;
    targetWowbook: any;
    defaultDuration: any;
    isMobile: boolean = false;
    isPortraitPage: boolean = false;
    height: number = 0.0;
    width: number = 0.0;
    colorControlsItem: string = "#FFFFFF";
    companyName: string = "";
    companyLink: string = "";
    title: string;
    infoPopUpDisplayed: boolean = false;
    _isFullscreen: boolean = false;
    _isEnterKey: boolean = false;

    @ViewChild('InpPageIndex') InpPageIndex: ElementRef;
    /**
     * excute resize window
     * @param event 
     */
    @HostListener("window:resize", ['$event']) onResize(event: any) {
        this.controlHeight = $($(".report-controls")[0]).height();
        this.headerHeight = $($(".app-toolbar")[0]).height();
        this.device = this.layoutBreakpointService.currentBreakpoint;
        if (this.device != LayoutBreakpoint.Desktop) {
            // this.targetWowbook.toggleFullscreen();
            this.settingOnMobile();
        }
        else {
            this.settingOnDesktop();
        }
        this.load(this.targetWowbook, this.defaultDuration);
    }

    @HostListener("window:orientationchange", ["$event"]) onorientationchange(event: any) {

        this.orientationMobile();
    }

    @Input() pdfFilePath: string;
    @Input() reportData: ReportDetailModel;

    constructor(
        private readonly utilityService: UtilityService,
        @Inject(WOWBOOK_VENDOR) private wowbookVendors: string[],
        @Inject(DOCUMENT) private _document: Document,
        private _zone: NgZone,
        private layoutBreakpointService: LayoutBreakpointService,
        private router: Router
    ) {
        this.dependencyNum = this.wowbookVendors.length;
    }

    ngOnInit() {
        this.device = this.layoutBreakpointService.currentBreakpoint;
        this.controlHeight = $($(".report-controls")[0]).height();
        this.headerHeight = $($(".app-toolbar")[0]).height();
        if (this.device != LayoutBreakpoint.Desktop) {
            this.settingOnMobile();
        }
        else {
            this.settingOnDesktop();
        }
        this.companyName = this.reportData.companyName;
        this.title = this.reportData.title;

    }

    ngOnChanges(changes: any) {
        if (changes.pdfFilePath != undefined && changes.pdfFilePath.currentValue != changes.pdfFilePath.previousValue
            && changes.pdfFilePath.previousValue != undefined) {
        }
    }
    ngAfterViewInit(): void {
        const $this = this;

        // (<HTMLElement>document.getElementsByClassName("report-view")[0]).style.height = window.innerHeight + "px";

        this._zone.runOutsideAngular(() => {
            Observable.from($this.wowbookVendors).flatMap((val: string, index: number) => {
                return $this.loadScript(val);
            }).subscribe(() => {
                if (++$this.scriptLoaded == $this.dependencyNum) {
                    $this._jQuery = (<any>window)['jQuery'];
                    $this.excuteWowbook();
                    if ($this.device == LayoutBreakpoint.HandsetLandscape)
                        $this.hideHeader(true);
                    window.scrollTo(0, 0);
                }
            });
        });

        this.settingForControl();
        this.infoPopUpDisplayed = true;
        this.showInfo();

    }
    private orientationMobile() {
        this.device = this.layoutBreakpointService.currentBreakpoint;

        if (this.device == LayoutBreakpoint.HandsetLandscape) {
            this._isFullscreen = true;
            if (this.targetWowbook.opts.noSupportFullscreen) {
                this.hideHeader(true);
                this.changeLayoutFullscreenButton(true);
            }
        }
        else {
            this.hideHeader(false);
            this.changeLayoutFullscreenButton(false);
        }
    }

    private settingOnDesktop() {
        this.colorControlsItem = "#FFFFFF";
        this.isMobile = false;
        this.paddingValue = 10;
        this.width = (window.innerWidth - this.paddingValue * 2);
        this.height = window.innerHeight - this.paddingValue * 3 - this.headerHeight - this.controlHeight;
    }
    private settingOnMobile() {
        this.colorControlsItem = "#DADADA";
        this.doubleModeCurrent = false;
        this.isMobile = true;
        this.paddingValue = 5;
        this.width = (window.innerWidth - this.paddingValue * 2);
        this.height = window.innerHeight - this.paddingValue * 2 - this.headerHeight - this.controlHeight;
    }
    private loadScript(scriptSrc: string): Observable<any> {
        return this.utilityService.loadScript(scriptSrc);
    }
    /**
     * func called after wowbook plugin loaded
     * @param target is wowbook object
     * @param defaultDuration is time value to turn page or next page
     */
    private load(target: any, defaultDuration: any) {
        target.opts.singlePage = !this.doubleModeCurrent;
        target.opts.height = this.height;
        target.opts.width = this.width;
        if (target.opts.singlePage) {
            target.opts.turnPageDuration = 1;
            target.opts.turnPageDurationMin = 1;
            $($(".wowbook-zoomcontent")[0]).css("width", (target.pageWidth * 1) + "px");
            $(".wowbook").css("margin", "0px");
            $(".wowbook-zoomcontent").css("overflow", "hidden");
            $(".wowbook-handle").hide();
        }
        else {
            target.opts.turnPageDuration = defaultDuration.turnPageDuration;
            target.opts.turnPageDurationMin = defaultDuration.turnPageDurationMin;
            $(".wowbook-pdf")[0].style.left = "0";
            if (target.currentPage % 2 == 1 && target.currentPage < target.pages.length - 1) {
                target.currentPage--;
            }
            $($(".wowbook-zoomcontent")[0]).css("width", (target.pageWidth * 2) + "px");
            $(".wowbook").css("margin", "auto");
            $(".wowbook-zoomcontent").css("overflow", "unset");
            $(".wowbook-handle").show();
        }
        target.turnPageDuration = target.opts.turnPageDuration;
        target.turnPageDurationMin = target.opts.turnPageDurationMin;
        target.stopAnimation(true);
        target.responsiveUpdater();
        target.opts.onShowPage(target);
        this.defaultDuration = defaultDuration;
        this.targetWowbook = target;

        if (target.currentPage == target.pages.length - 1) {
            target.showPage(target.currentPage + 1);
        };
    }

    /**
     * change css and attribute DOM HTML
     * @param target is wowbook object
     * @param defaultDuration is time value to turn page or next page
     */
    private changeLayout(target: any, defaultDuration: any) {
        this.changeLayoutModeButton(this.doubleModeCurrent);
        if (this.doubleModeCurrent) {
            this.settingOnDesktop();
        }
        else {
            if (this.isMobile) {
                $(".report-controls-mode").hide();
                this.settingOnMobile();
            }
            else {
                this.settingOnDesktop();
            }
        }
        this.load(target, defaultDuration);
    }
    private hideHeader(_isTrue: boolean) {
        if (_isTrue) {
            $(".app-toolbar").addClass("nosupport-fullscreen-hidden");
            $(".report-view").addClass("nosupport-fullscreen-fixed");
            $(".sidenav-content").css("padding-top", "0");
            this.headerHeight = 0;
        }
        else {
            $(".app-toolbar").removeClass("nosupport-fullscreen-hidden");
            $(".report-view").removeClass("nosupport-fullscreen-fixed");
            $(".sidenav-content").css("padding", "96px 0rem 1rem");
            this.headerHeight = $($(".app-toolbar")[0]).height();
        }
    }
    private changeLayoutModeButton(_isTrue: boolean) {
        if (_isTrue) {
            $(".report-controls-mode-top").show();
            $(".report-controls-mode-bottom").hide();
            $(".wowbook-gutter-shadow").show();
        }
        else {
            $(".report-controls-mode-top").hide();
            $(".report-controls-mode-bottom").show();
            $(".wowbook-gutter-shadow").hide();
        }
    }
    private changeLayoutFullscreenButton(_isTrue: boolean) {
        if (_isTrue) {
            $(".report-controls-fullscreen-top").hide();
            $(".report-controls-fullscreen-bottom").show();
        }
        else {
            $(".report-controls-fullscreen-top").show();
            $(".report-controls-fullscreen-bottom").hide();
        }
    }
    private fullscreen() {
        let _isTrue = this._isFullscreen;
        if (this.targetWowbook.opts.noSupportFullscreen || this.device == LayoutBreakpoint.HandsetLandscape) {
            this.hideHeader(_isTrue);
            this.changeLayout(this.targetWowbook, this.defaultDuration);
        }
        this.changeLayoutFullscreenButton(_isTrue);
    }

    /**
     * Run wowbook plugin
     * with a param is bookOptions
     */
    private excuteWowbook() {
        let _height = this.height;
        let _width = this.width;
        let _t = this;
        let _isFindMode = false;
        let bookOptions = {
            zoomMax: 2,
            height: _height,
            width: _width,
            centeredWhenClosed: true,
            hardcovers: true,
            pageNumbers: false,
            // toolbar: "lastLeft, left, right, lastRight, toc, find, zoomin, zoomout, fullscreen, download, share",
            toolbar: "find, left, right",
            thumbnailsPosition: 'left',
            containerPadding: "0px",
            pdf: this.pdfFilePath,
            pdfFind: true,
            pdfTextSelectable: true,
            flipSound: false,
            updateBrowserURL: false,
            container: this._document.getElementsByClassName("report-pdf")[0],
            controls: {
                zoomIn: '#report-controls-zoomin',
                zoomOut: '#report-controls-zoomout',
                fullscreen: '#report-controls-fullscreen, #report-controls-fullscreen-mobile',
                find: '#report-controls-search, #report-controls-search-mobile',
                left: '#report-controls-back, #report-controls-back-mobile',
                right: '#report-controls-next, #report-controls-next-mobile'
            },
            turnPageDuration: 1000,
            turnPageDurationMin: 100,
            book: {
                gotoPage: function (index: Number, updateUrl: boolean) { }
            },
            /**
             * after the pdf file rendered
             * @param target callback is wowbook object
             */
            onLoadPdf(target: any) {

                document.getElementById("pagesLength").textContent = target.pages.length;
                _t.InpPageIndex.nativeElement.value = target.currentPage + 1;
                (<HTMLInputElement>_t.InpPageIndex.nativeElement).max = target.pages.length;
                let defaultDuration = {
                    turnPageDuration: target.opts.turnPageDuration,
                    turnPageDurationMin: target.opts.turnPageDurationMin
                };

                /**
                 * Add event to the button is switch mode 
                 * click to switch mode then change layout 
                 */
                $("#report-controls-mode").on("click", function () {
                    _t.changeMode(_isFindMode);
                });
                /**
                 * Close find bar on the desktop
                 */
                $("#wowbook-findbar-close").on("click", function () { _t.closeFindbar() });

                /**
                 * Add event to the button is hide find bar on the find bar
                 * CLose find bar on the mobile or tablet
                 */
                $(".wowbook-find-icon-back").on("click", function () { _t.closeFindbarMobile() });

                bookOptions.book = target;
                /**
                 * Load default mode when report is portrait report or landscape report
                 */
                _t.isPortraitPage = (target.pageWidth < target.pageHeight) ? true : false;
                if (!_t.isMobile) {
                    if (_t.isPortraitPage) {
                        _t.doubleModeCurrent = true;
                    }
                    else {
                        _t.doubleModeCurrent = false;
                    }
                }
                _t.changeLayout(target, defaultDuration);
                if (_t.targetWowbook.startPage == _t.targetWowbook.pages.length - 1) {
                    _t.targetWowbook.showPage(_t.targetWowbook.currentPage + 1);
                };

                if (_t.doubleModeCurrent) {
                    _t.targetWowbook.showPage(_t.targetWowbook.startPage);
                }

                _t.targetWowbook.opts.onRenderPageIndex(target);
            },
            /**
             * render number of page after next or back page
             * @param target is wowbook object
             */
            onRenderPageIndex(target: any) {
                _t.InpPageIndex.nativeElement.value = target.currentPage + 1;
                if (_t.doubleModeCurrent == false) {
                    $(".wowbook-gutter-shadow").hide();
                    setTimeout(() => {
                        $(".wowbook-gutter-shadow").hide();
                    }, 1000);
                }
                _t.changeStateNextBack();
            },
            onShowPage() { },
            /**
             * when user click to find
             */
            onFind() {
                _isFindMode = !_isFindMode;
                if (_t.device == LayoutBreakpoint.HandsetLandscape || _t.device == LayoutBreakpoint.HandsetPortrait) {
                    _t.hideHeader(_isFindMode);
                }

                else if (_t.device == LayoutBreakpoint.Desktop) {
                    if (!_t.isPortraitPage)
                        _t.doubleModeCurrent = false;
                    _t.changeModeAndFind(_isFindMode);
                }
                _t.changeLayout(_t.targetWowbook, _t.defaultDuration);
            },
            /**
             * When user click to cancel on find bar
             * Clear all find results and text in find textbox 
             * @param event 
             */
            onFindCancel(event: any) {
                $(".wowbook-find-results").empty();
                $(".wowbook-find-count").empty();
            },
            /**
             * after user find then add click event to a result and go to a page 
             * @param event 
             */
            onFindEnd(event: any) {
                $(".wowbook-find-line").removeClass("wowbook-find-line-background");
                $(event.target).addClass("wowbook-find-line-background");
                bookOptions.book.gotoPage(parseInt(event.target.className.split("wpage_")[1]), true);

                if (_t.isMobile) {
                    _t.targetWowbook.toggleFindBar();
                    if (_t.device == LayoutBreakpoint.HandsetLandscape || _t.device == LayoutBreakpoint.HandsetPortrait) {
                        _t.targetWowbook.opts.onFind();
                    }
                }
            },
            /**
             * after user click on the fullscreen button 
             * @param event 
             */
            onFullscreen(event: any) {
                _t._isFullscreen = !_t._isFullscreen;
                _t.fullscreen();
            },
            onNext() {

            },
            onBack() {

            }
        };
        if (_t.device == LayoutBreakpoint.HandsetLandscape || _t.device == LayoutBreakpoint.HandsetPortrait) {
            bookOptions.zoomMax = 5;
        }
        let book = this._jQuery('#book');
        (<JQueryWowbook>book).wowBook(bookOptions);
        this.settingForControl();
    }
    /**
     * Layout for the buttons
     */
    private settingForControl() {
        $(".report-controls-fullscreen").show();
        $(".report-controls-fullscreen-top").show();
        $(".report-controls-fullscreen-bottom").hide();
        $(".report-controls-mode-top").show();
        $(".report-controls-mode-bottom").hide();
    }

    /**
     * On desktop when find bar is displayed then change width of the wowbook component 
     */
    private changeModeAndFind (_isFindMode: boolean) {
        if (_isFindMode && this.doubleModeCurrent == false) {
            $($(".wowbook-book-container")[0]).width("calc(100% - " + $($(".wowbook-toolbar-container")[0]).width() + "px)");
        }
        else {
            $($(".wowbook-book-container")[0]).width("100%");
        }
    }
    private closeFindbar() {
        this.targetWowbook.toggleFindBar();
        if (typeof (this.targetWowbook.opts.onFind) == "function")
            this.targetWowbook.opts.onFind();
    }
    private closeFindbarMobile() {
        if (this.isMobile) {
            if (this.device == LayoutBreakpoint.HandsetLandscape || this.device == LayoutBreakpoint.HandsetPortrait) {
                this.closeFindbar();
            }
        }
    }
    private changeMode (_isFindMode: boolean) {
        this.doubleModeCurrent = !this.doubleModeCurrent;
        if (this.doubleModeCurrent && this.targetWowbook.currentPage % 2 == 1) {
            this.targetWowbook.gotoPage(this.targetWowbook.currentPage + 1);
        }

        this.changeModeAndFind(_isFindMode);
        this.changeLayout(this.targetWowbook, this.defaultDuration);
    }
    /**
     * navigate to the company
     */
    navigateToCompany() {
        this.router.navigate(['company', this.reportData.companyCode, this.reportData.companyName.toLowerCase().split(' ').join('-')]);
    }
    /**
     * Show info is company name as tooltip layout in the mobile or tablet mode
     */
    showInfo() {
        this.infoPopUpDisplayed = !this.infoPopUpDisplayed;
        if (this.infoPopUpDisplayed) {
            $(".report-controls-tooltip").show();
        }
        else {
            $(".report-controls-tooltip").hide();
        }
    }

    changeStateNextBack() {
        if (this.targetWowbook == undefined) {
            return;
        }
        if (this.targetWowbook.currentPage < 1) {
            $(".report-controls-back").attr("fill-opacity", 0.3);
            $(".report-controls-next").attr("fill-opacity", 1);
        }
        else if (this.targetWowbook.currentPage >= this.targetWowbook.pages.length - 1) {
            $(".report-controls-next").attr("fill-opacity", 0.3);
            $(".report-controls-back").attr("fill-opacity", 1);
        }
        else {
            $(".report-controls-next").attr("fill-opacity", 1);
            $(".report-controls-back").attr("fill-opacity", 1);
        }
    }
    pressKeyEnter(event: any) {
        this._isEnterKey = (event.which == 13) ? true
            : false;

        if (this._isEnterKey) {
            this.targetWowbook.gotoPage(parseInt(this.InpPageIndex.nativeElement.value) - 1);
            this.changeStateNextBack();
        }
    }
    checkIndexsLimited(event: any) {
        if (event.target.value < 1) {
            event.target.value = 1;
        }
        else if (event.target.value > this.targetWowbook.pages.length) {
            event.target.value = this.targetWowbook.pages.length
        }
    }
}
