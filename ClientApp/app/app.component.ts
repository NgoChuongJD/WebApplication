import {
    Component,
    OnInit,
    AfterViewChecked,
    ViewChild,
    Inject,
    HostListener,
    ElementRef
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';

import { DOCUMENT } from '@angular/platform-browser';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { authConfig } from './auth.config';
import { routerTransition } from './router.animations';
import { ExternalLoginStatus } from './app.models';
import { 
    LayoutBreakpointService, 
    LayoutBreakpoint, 
    ProgressBarService, 
    WINDOW
} from './core';

@Component({
    selector: 'arp-app',
    animations: [routerTransition],
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewChecked {
    // Some android devices (phone and tablet) get the problem with css media-query on portrait mode
    // when user focuses on an input and then soft-keyboard pops up. When the soft-keyboard is popped up, however,
    // the css media-query orientation changes to mobile landscape.
    private definedLayoutBreakPoints: Array<Array<string | LayoutBreakpoint>> = [
        [Breakpoints.HandsetPortrait, LayoutBreakpoint.HandsetPortrait],
        [Breakpoints.HandsetLandscape, LayoutBreakpoint.HandsetLandscape],
        [Breakpoints.TabletPortrait, LayoutBreakpoint.TabletPortrait],
        [Breakpoints.TabletLandscape, LayoutBreakpoint.TabletLandscape],
        [Breakpoints.Web, LayoutBreakpoint.Desktop]
    ];

    /** On some android mobile devices, the portrait mode is breaked down 
     * to the landscape mode when the soft-keyboard shown if user focuses
     * on a input element. This variable will save the last width of window-
     * -object right before the soft-keyboard appeared to determine whether
     * the layout is breaked caused by soft-keyboard.
     */
    private prevWindowWidth: number;

    private isSideNavDoc = false;

    private sideBySideWidth = 992;

    private _lastScrollY: number = 0;
    private _delta: number = 20;
    private hideProgressBarTimeout: any = null;
   // private _lastScrollTop: number;


    get isOpened() { return this.isSideBySide && this.isSideNavDoc; }
    get mode() { return this.isSideBySide ? 'side' : 'over'; }

    isFetching: boolean = false;
    /**
     * Gets whether the side-nav is showing up.
     */
    isSideBySide: boolean = false;
    isSmallDevice: boolean = false;
    isTabletDevice: boolean = false;
    isShowSuggest: boolean = true;
    isShowJumpUp: boolean = false;

    appCssClass: string[] = [];

    isIOS: boolean = false;
    
    /**
     * The css class for specified devices (arp-mobile, arp-tablet)
     */
    globalDeviceClass: string;

    hideMobileSearchBox: boolean = false;

    @ViewChild(MatSidenav) sidenav: MatSidenav;
   
    @ViewChild('matToolbarMobile') headerToolbar: MatToolbar;
    @ViewChild('mainContent') mainContent: ElementRef;

    constructor(
        private breakpointObserver: BreakpointObserver,
        private layoutBreakpointService: LayoutBreakpointService,
        public translate: TranslateService,
        private router: Router,
        @Inject(DOCUMENT) private document: Document,
        @Inject(WINDOW) private _window: Window,
        private route: ActivatedRoute,
        private oauthService: OAuthService,
        private progressBar: ProgressBarService) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use('en');

        this.configureOidc();
        this.configLayoutBreakpoint();
        this.isIOS = /iPhone|iPad|iPod/i.test(this._window.navigator.userAgent);
        Observable
            .fromEvent(this._window, 'scroll')
            .debounceTime(50)
            .subscribe(() => { this.handleScrollEvent(); });
    }

    ngOnInit() {
        const me = this;
        this.prevWindowWidth = this._window.innerWidth;

        this.progressBar.progressObservable.subscribe(hideOrShow => {
            if (me.hideProgressBarTimeout) {
                clearTimeout(me.hideProgressBarTimeout);
            }
            if (!hideOrShow && me.isFetching) {
                me.hideProgressBarTimeout = setTimeout(() => {
                    me.isFetching = false;
                }, 500);
            }
            else if (!me.isFetching) {
                me.isFetching = true;
            }
        });

        this.route.queryParams.subscribe((params: Params) => {
            const param = params['externalLoginStatus'];
            if (param) {
                const status = <ExternalLoginStatus>+param;
                switch (status) {
                    case ExternalLoginStatus.CreateAccount:
                        this.router.navigate(['createaccount']);
                        break;
                    default:
                        break;
                }
            }
        });

        this.onResize(window);

        this.hideMobileSearchBox = false;
        this._lastScrollY = this.getScrollTop();
    }

    ngAfterViewChecked() {
        
    }
    getState(outlet: any) {
        return outlet.activatedRouteData.state;
    }
    
    @HostListener('window:resize', ['$event.target'])
    onResize(win: Window) {
        const width = this._window.innerWidth;
        this.prevWindowWidth = width;
        this.isSideBySide = width > this.sideBySideWidth;
        this.layoutBreakpointService.raiseResizeEvent({
            isSideBySide: this.isSideBySide,
            width: width,
            window$: this._window
        });
    }

    @HostListener('window:scroll', ['$event.target'])
    showJumpToTopArrow() {
        this.isShowJumpUp = window.scrollY > window.innerHeight / 2;
    }

    jumpToTop() {
        window.scrollTo(0, 0);
    }

    //@HostListener('window:scroll', ['$event.target'])
    handleScrollEvent() {
        if(this.isSmallDevice) {
            this.doShowHideSearchBox();
        }
    }
    
    /**
     * Decides whether show/hide the search-box component on the mobile devices
     */
    private doShowHideSearchBox(): void {
        let newScrollY = this.getScrollTop();
        
        if(newScrollY == 0 && this.hideMobileSearchBox) {
            this.hideMobileSearchBox = false;
            this._lastScrollY = 0;
            return;
        }

        // Makes sure the scroll is more than _delta
        if(Math.abs(this._lastScrollY - newScrollY) <= this._delta) {
            return;
        }

        if(newScrollY > this._lastScrollY) {
            // Scrolls down
            this.hideMobileSearchBox = true;
        } else {
            // Scrolls up
            this.hideMobileSearchBox = false;
        }

        this._lastScrollY = newScrollY;
    }

    /**
     * Gets the current document's scroll-top
     */
    private getScrollTop(): number {
        return this._window.pageYOffset || (<any>(this.document.documentElement || this.document.body.parentNode || this.document.body)).scrollTop;
    }
    /**
     * Configures the breakpoints for changing layout (landscape/portrait, mobile/tablet/desktop)
     */
    private configLayoutBreakpoint() {
        this.definedLayoutBreakPoints.forEach(val => {
            let breakpoint = (val[1] as LayoutBreakpoint);
            let mediaQuery = (val[0] as string);

            this.breakpointObserver.observe(mediaQuery).subscribe(state => {
                if (state.matches && this.isWidthChanged()) {
                    this.isSmallDevice = this.checkSmallDeviceLayout(breakpoint);
                    this.isTabletDevice = this.checkTabletDeviceLayout(breakpoint);
            
                    if (breakpoint === LayoutBreakpoint.Desktop && this.sidenav && this.sidenav.opened) {
                        this.sidenav.close();
                    }

                    this.layoutBreakpointService.changeBreakpoint(breakpoint);
                    this.setAppCssClass(breakpoint);
                }
            });

            // Detect device layout at the first load
            if (this.breakpointObserver.isMatched(mediaQuery) && this.isWidthChanged()) {
                this.isSmallDevice = this.checkSmallDeviceLayout(breakpoint);
                this.isTabletDevice = this.checkTabletDeviceLayout(breakpoint);
                this.layoutBreakpointService.changeBreakpoint(breakpoint);
                this.setAppCssClass(breakpoint);
            }
        })
    }

    private isWidthChanged() {
        return this.isIOS || this.prevWindowWidth !== this._window.innerWidth;
    }

    private setAppCssClass(layout: LayoutBreakpoint) {
        const landscape = 'landscape';
        const portrait = 'portrait';
        const tablet = 'tablet';
        const mobile = 'mobile';
        const desktop = 'desktop';

        switch (layout) {
            case LayoutBreakpoint.TabletLandscape:
                this.appCssClass = [tablet, landscape];
                break;
            case LayoutBreakpoint.TabletPortrait:
                this.appCssClass = [tablet, portrait];
                break;
            case LayoutBreakpoint.HandsetLandscape:
                this.appCssClass = [mobile, landscape];
                break;
            case LayoutBreakpoint.HandsetPortrait:
                this.appCssClass = [mobile, portrait];
                break;
            default:
                this.appCssClass = [desktop];
        }

        this.document.body.classList.remove(desktop, tablet, mobile, portrait, landscape);
        this.document.body.classList.add(...this.appCssClass);
    }

    private checkSmallDeviceLayout(breakPoint: LayoutBreakpoint): boolean {
        return breakPoint == LayoutBreakpoint.HandsetLandscape || breakPoint == LayoutBreakpoint.HandsetPortrait;
    }

    private checkTabletDeviceLayout(breakPoint: LayoutBreakpoint): boolean {
        return breakPoint == LayoutBreakpoint.TabletLandscape || breakPoint == LayoutBreakpoint.TabletPortrait;
    }
    private configureOidc() {
        const url = `${this.document.location.protocol}`;//${this.document.location.host}`;
        this.oauthService.configure(authConfig(url));
        this.oauthService.setStorage(localStorage);
        this.oauthService.tokenValidationHandler = new JwksValidationHandler();
        //this.oauthService.loadDiscoveryDocumentAndTryLogin();
    }

    public showSuggestBoxHandler(isShow: boolean) {
        this.isShowSuggest = isShow;
    }

    onSideNavOpenedStart(): void {
        this.document.body.classList.add('mat-sidenav-open');
    }

    onSideNavClosedStart(): void {
        this.document.body.classList.remove('mat-sidenav-open');
    }
}
