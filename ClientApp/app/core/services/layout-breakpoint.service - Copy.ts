import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { Subject } from "rxjs/Subject";
//import { BehaviorSubject } from "rxjs/BehaviorSubject";
//import { Breakpoints } from '@angular/cdk/layout';

const HANDSET_PORTRAIT  = '(orientation: portrait) and (max-width: 567px)';
const HANDSET_LANDSCAPE = '(orientation: landscape) and (min-width: 568px) and (max-width: 959px)';

const TABLET_LANDSCAPE  = '(orientation: landscape) and (min-width: 960px) and (max-width: 1279px)';
const TABLET_PORTRAIT   = '(orientation: portrait) and (min-width: 600px) and (max-width: 839px)';

const WEB_PORTRAIT      = '(orientation: portrait) and (min-width: 840px)';
const WEB_LANDSCAPE     = '(orientation: landscape) and (min-width: 1280px)';

export const ScreenTypes = {
  'HANDSET'           : `${HANDSET_PORTRAIT}, ${HANDSET_LANDSCAPE}`,
  'TABLET'            : `${TABLET_PORTRAIT} , ${TABLET_LANDSCAPE}`,
  'WEB'               : `${WEB_PORTRAIT}, ${WEB_LANDSCAPE} `,

  'HANDSET_PORTRAIT'  : `${HANDSET_PORTRAIT}`,
  'TABLET_PORTRAIT'   : `${TABLET_PORTRAIT} `,
  'WEB_PORTRAIT'      : `${WEB_PORTRAIT}`,

  'HANDSET_LANDSCAPE' : `${HANDSET_LANDSCAPE}]`,
  'TABLET_LANDSCAPE'  : `${TABLET_LANDSCAPE}`,
  'WEB_LANDSCAPE'     : `${WEB_LANDSCAPE}`
};

export enum LayoutBreakpoint {
    HandsetPortrait,
    HandsetLandscape,
    TabletPortrait,
    TabletLandscape,
    Desktop
}

export interface ResizeInfo {
    /**
     * The reference to window object
     */
    window$: Window
    /**
     * Gets the current innerWith of the window
     */
    width: number;

    /**
     * Whether the side-nav is showing up.
     */
    isSideBySide: boolean
}

/**
 * The breakpoints service to notify to the subscriber when the layout has changed.
 * The breakpoints based on https://material.io/guidelines/layout/responsive-ui.html#responsive-ui-breakpoints
 */
@Injectable()
export class LayoutBreakpointService {
    private _currentBreakpoint: LayoutBreakpoint = LayoutBreakpoint.Desktop;
    private source: Subject<LayoutBreakpoint> = new Subject<LayoutBreakpoint>();
    private windowResizeSource: Subject<ResizeInfo> = new Subject<ResizeInfo>()

    public breakpointSource: Observable<LayoutBreakpoint> = this.source.asObservable();

    public windowResizeObservable: Observable<ResizeInfo> = this.windowResizeSource.asObservable();

    changeBreakpoint(breakPoint: LayoutBreakpoint) {
        if(breakPoint !== this._currentBreakpoint) {
            this._currentBreakpoint = breakPoint;
            this.source.next(breakPoint);
        }
    }

    get currentBreakpoint(): LayoutBreakpoint {
        return this._currentBreakpoint;
    }

    raiseResizeEvent(info: ResizeInfo) {
        this.windowResizeSource.next(info);
    }
}