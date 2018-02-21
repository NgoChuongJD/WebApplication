import { 
    Component, 
    EventEmitter, 
    TemplateRef,
    AfterContentInit,
    OnDestroy,
    Output,
    ViewChild,
    ContentChildren,
    ChangeDetectionStrategy,
    Input,
    InjectionToken,
    ViewEncapsulation,
    Inject,
    ElementRef,
    QueryList
} from "@angular/core";

import { Subscription } from 'rxjs/Subscription';

import { AnimationEvent } from '@angular/animations';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusKeyManager } from '@angular/cdk/a11y';
//import {Direction} from '@angular/cdk/bidi';
import {ESCAPE, LEFT_ARROW, RIGHT_ARROW} from '@angular/cdk/keycodes';
//import {startWith} from 'rxjs/operators/startWith';
//import {switchMap} from 'rxjs/operators/switchMap';
//import {take} from 'rxjs/operators/take';

import { fadeInItems, transformPanel  } from './panelup-animations';
import { PanelupPositionX, PanelupPositionY } from "./panelup-position";

import { PanelupItem } from './panelup-item';

/**
 * Default options
 */
export interface PanelupDefaultOptions {
    positionX: PanelupPositionX,

    positionY: PanelupPositionY,
    /** Whether the menu should overlap the menu trigger. */
    overlapTrigger: boolean;
}

/**
 * Injection token to be used to override the default options
 */
export const PANELUP_DEFAULT_OPTIONS = new InjectionToken<PanelupDefaultOptions>('panelup-default-options');    

@Component({
    moduleId: module.id.toString(),
    selector: 'panelup',
    template: `
        <ng-template>
            <div
                class="panelup-panel"
                [ngClass]="_classList"
                (keydown)="_handleKeydown($event)"
                [@transformPanel]="_panelAnimationState"
                (@transformPanel.done)="_onAnimationDone($event)"
                tabindex="-1"
                role="menu">
            <div class="panelup-content" [@fadeInItems]="'showing'">
                <ng-content></ng-content>
            </div>
            </div>
        </ng-template>`,
    styles: [`
        .panelup-panel {
            min-width: 112px;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
            max-height: calc(100vh - 48px);
            border-radius: 2px;
            outline: 0;
            background-color: #FFF;
            box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
        }
        .panelup-content {
            padding-top: 8px;
            padding-bottom: 8px;
        }
        .panelup-panel.ng-animating{
            pointer-events:none
        }
        .panelup-after.panelup-below {
            transform-origin: left top;
        }
        .panelup-after.panelup-above {
            transform-origin: left bottom;
        }
        .panelup-before.panelup-below {
            transform-origin: right top;
        }
        .panelup-before.panelup-above {
            transform-origin: right bottom;
        }
        [dir=rtl] .panelup-panel.panelup-after.panelup-below{
            transform-origin:right top
        }
        [dir=rtl] .panelup-panel.panelup-after.panelup-above{
            transform-origin:right bottom
        }
        [dir=rtl] .panelup-panel.panelup-before.panelup-below{
            transform-origin:left top
        }
        [dir=rtl] .panelup-panel.panelup-before.panelup-above{
            transform-origin:left bottom
        }
        .panelup-item{
            color:#607B88;
            -webkit-user-select:none;
            -moz-user-select:none;
            -ms-user-select:none;
            user-select:none;
            cursor:pointer;
            outline:0;
            border:none;
            -webkit-tap-highlight-color:transparent;
            overflow:hidden;
            display:block;
            text-align:left;
            text-decoration:none;
            position:relative
        }
        .panelup-item[disabled]{
            cursor:default
        }
        [dir=rtl] .panelup-item{
            text-align:right
        }
        .mat-menu-ripple{
            top:0;
            left:0;
            right:0;
            bottom:0;
            position:absolute;
            pointer-events:none
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false,
    animations: [
        transformPanel,
        fadeInItems
    ],
    exportAs: 'panelup'
})

export class Panelup implements AfterContentInit, OnDestroy {
    /** Subscription to tab events on the panelup */
    private _taboutSubscription: Subscription = Subscription.EMPTY;
    private _keyManager: FocusKeyManager<PanelupItem>;
    private _positionX: PanelupPositionX = this._defaultOptions.positionX; 
    private _positionY: PanelupPositionY = this._defaultOptions.positionY; 
    _classList: {[key: string]: boolean} = {};
    
    @Input()
    get positionX() { return this._positionX; }
    set positionX(value: PanelupPositionX) {
      if (value !== 'before' && value !== 'after') {
        throw 'Invlid positionX value';
      }
      this._positionX = value;
      this.setPositionClasses();
    }

    /** Position of the menu in the Y axis. */
    @Input()
    get positionY() { return this._positionY; }
    set positionY(value: PanelupPositionY) {
        if (value !== 'above' && value !== 'below') {
            throw 'Invlid positionY value';
        }
        this._positionY = value;
        this.setPositionClasses();
    }

    @Input('class')
    set panelClass(classes: string) {
      if (classes && classes.length) {
        this._classList = classes.split(' ').reduce((obj: any, className: string) => {
          obj[className] = true;
          return obj;
        }, {});
  
        this._elementRef.nativeElement.className = '';
        this.setPositionClasses();
      }
    }

    @Input()
    set overlapTrigger(value: boolean) {
      this._overlapTrigger = coerceBooleanProperty(value);
    }
    get overlapTrigger(): boolean {
      return this._overlapTrigger;
    }
    private _overlapTrigger: boolean = this._defaultOptions.overlapTrigger;

    /** Current state of the panel animation. */
    _panelAnimationState: 'void' | 'enter-start' | 'enter' = 'void';
    
    /** Event emitted when the panel is closed */
    @Output() onClosed = new EventEmitter<void | 'click' | 'keydown'>();

    @ViewChild(TemplateRef) templateRef: TemplateRef<any>;

    /** List of the item inside a panelup element */
    @ContentChildren(PanelupItem) panelupItems: QueryList<PanelupItem>;
    nativeElement: HTMLElement = null;

    constructor(
        private _elementRef: ElementRef,
        @Inject(PANELUP_DEFAULT_OPTIONS) private _defaultOptions: PanelupDefaultOptions){
    }

    ngAfterContentInit() {
        this.nativeElement = this._elementRef.nativeElement;
        
        this._keyManager = new FocusKeyManager<PanelupItem>(this.panelupItems).withWrap().withTypeAhead();
        this._taboutSubscription = this._keyManager.tabOut.subscribe(() => this.onClosed.emit('keydown'));
    }

    ngOnDestroy() {
        this._taboutSubscription.unsubscribe();
        this.onClosed.complete();
    }

    setPositionClasses(posX: PanelupPositionX = this.positionX, posY: PanelupPositionY = this.positionY) {
        this._classList['panelup-before'] = posX === 'before';
        this._classList['panelup-after'] = posX === 'after';
        this._classList['panelup-above'] = posY === 'above';
        this._classList['panelup-below'] = posY === 'below';
    }

    /** 
     * Focuses the first panelup-item. This method is used by the panelup-trigger
     * to focus the first item when panelup is opened by the ENTER key 
     */
    focusFirstItem(): void {
        this._keyManager.setFirstItemActive();
    }

    /**
     * 
     */
    resetActiveItem(): void {
        this._keyManager.setActiveItem(-1);
    }

    /** Starts the enter animation. */
    _startAnimation() {
        this._panelAnimationState = 'enter-start';
    }

  /** Resets the panel animation to its initial state. */
    _resetAnimation() {
        this._panelAnimationState = 'void';
    }

    /** Callback that is invoked when the panel animation completes. */
    _onAnimationDone(event: AnimationEvent) {
        // After the initial expansion is done, trigger the second phase of the enter animation.
        if (event.toState === 'enter-start') {
            this._panelAnimationState = 'enter';
        }   
    }

    /** Handle a keyboard event from the menu, delegating to the appropriate action. */
    _handleKeydown(event: KeyboardEvent) {
        switch (event.keyCode) {
            case ESCAPE:
                this.onClosed.emit('keydown');
                event.stopPropagation();
            break;
            case LEFT_ARROW:
            case RIGHT_ARROW:
            break;
            default:
                this._keyManager.onKeydown(event);
        }
    }
}