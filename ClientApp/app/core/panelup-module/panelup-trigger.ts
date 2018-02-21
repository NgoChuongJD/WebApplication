import { TemplatePortal } from '@angular/cdk/portal';
import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import {LEFT_ARROW, RIGHT_ARROW, ESCAPE} from '@angular/cdk/keycodes';
import { Subscription } from 'rxjs/Subscription';
import { DOCUMENT } from '@angular/platform-browser';

import { 
    AfterContentInit,
    Directive,
    ElementRef,
    Inject,
    InjectionToken,
    Input,
    OnDestroy,
    ViewContainerRef,
    EventEmitter,
    Output
} from '@angular/core';

import { 
    ConnectedPositionStrategy,
    HorizontalConnectionPos,
    Overlay,
    OverlayRef,
    OverlayConfig,
    RepositionScrollStrategy,
    ScrollStrategy,
    VerticalConnectionPos
} from '@angular/cdk/overlay';

import { PanelupPositionX, PanelupPositionY} from './panelup-position';
import { Panelup } from "./panelup-directive";

/** Injection token that determines the scroll handling while the menu is open. */
export const PANELUP_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>('panelup-scroll-strategy');

export function PANELUP_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: Overlay): () => RepositionScrollStrategy {
    return () => overlay.scrollStrategies.reposition();
}

export const PANELUP_SCROLL_STRATEGY_PROVIDER = {
    provide: PANELUP_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: PANELUP_SCROLL_STRATEGY_PROVIDER_FACTORY,
}

@Directive({
    selector: '[panelupTriggerFor]',
    host: {
        'aria-haspoup': 'true',
        '(mousedown)': '_onMouseDown($event)',
        '(keydown)': '_onKeyDown($event)',
        '(click)': '_onClick($event)',
        //'(document:mouseup)': '_onClickOutside($event)',
        //'(document:touchend)': '_onClickOutside($event)'
    },
    exportAs: 'panelupTrigger'
})
export class PanelupTrigger implements AfterContentInit, OnDestroy {
    private _portal: TemplatePortal<any>;
    private _overlayRef: OverlayRef | null = null;
    private _opened: boolean = false;
    private _isOpenedByMouse: boolean = false;

    private _positionSubscription = Subscription.EMPTY;

    private _closePanelupOnOutsideClick: (event: Event) => void;

    /**
     * References the Panelup isntance that trigger is associated with.
     */
    @Input('panelupTriggerFor') panelup: Panelup;

    /** Event emitted when the associated menu is opened. */
    @Output() onOpened = new EventEmitter<void>();

    /** Event emitted when the associated menu is closed. */
    @Output() onClosed = new EventEmitter<void>();

    constructor (
        private _overlay: Overlay,
        private _elementRef: ElementRef,
        private _viewContainerRef: ViewContainerRef,
        @Inject(PANELUP_SCROLL_STRATEGY) private _scrollStrategy: any,
        @Inject(DOCUMENT) private _document: Document) {
        const _this = this;
        this._closePanelupOnOutsideClick = (event: MouseEvent) => {
            _this._onClickOutside(event);
        };
    }

    toggle(): void {
        if(this._opened){
            this.close();
        }
        else {
            this.open();
        }
    }

    open(): void {
        if(this._opened) {
           return; 
        }

        this._setPanelupOpen(true);
        this._createOverlay().attach(this._portal);
        this.panelup._startAnimation();
        //this.focus();
        this._document.addEventListener('click', this._closePanelupOnOutsideClick, true);

        if(this._isOpenedByMouse) {
            let rootNode = this._overlayRef!.overlayElement.firstElementChild as HTMLElement;
            if(rootNode){
                this.panelup.resetActiveItem();
                rootNode.focus();
            }
        } else {
            this.panelup.focusFirstItem();
        }
    }

    close(): void {
        this.panelup.onClosed.emit();
        this._document.removeEventListener('click', this._closePanelupOnOutsideClick, true);
    }

    ngAfterContentInit() {
        if(!this.panelup) {
            throw 'Not found any panelup instance';
        }

        this.panelup.onClosed.subscribe((next: any) => {
            this._destroy();
            if(next === 'click') {  
                this.panelup.onClosed.emit();
            }
        });
    }

    ngOnDestroy() {
        if(this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
        this._document.removeEventListener('click', this._closePanelupOnOutsideClick, true);
    }

    /**
     * Handles the mouse/touch outside the panelup and trigger to hide the panelup.
     * @param event The ClickEvent or TouchEvent
     */
    _onClickOutside(event: Event): void {
        if(event instanceof MouseEvent) {
            // Cancel if right click
            if((<MouseEvent>event).button == 2)
            {
                return;
            }
        }
        
        const targetElement:any = event.target;
        const nativeEl = this._elementRef.nativeElement;
        if(targetElement !== nativeEl
            && !nativeEl.contains(targetElement)
            && this.panelup.nativeElement !== targetElement){
            //&& this._overlayRef 
            //&& !this._overlayRef.overlayElement.contains(targetElement)) {
            if(this._opened) {
                this.close();
            }
        }
    }

    /**
     * Handles the click on the trigger to toggle the panelup.
     * @param event The click event
     */
    _onClick(event: MouseEvent): void {
        //event.preventDefault();
        //event.stopPropagation();
        this.toggle();
    }

    /** 
     * Handles mouse presses on the trigger. 
     */
    _onMouseDown(event: MouseEvent): void {
        if(!isFakeMousedownFromScreenReader(event))
        {
            this._isOpenedByMouse = true;
            event.preventDefault();
        }
    }

    /** 
     * Handles key presses on the trigger. 
     */
    _onKeyDown(event: KeyboardEvent): void {
        const keyCode = event.keyCode;
        if(keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW){
            this.open();
        } else if(keyCode == ESCAPE) {
            this.close();
        }
    }

    private _resetPanelup(): void {
        this._setPanelupOpen(false);
        if(this._isOpenedByMouse) {
            this.focus();
        }
    }

    /**
     * Focuses back to the trigger
     */
    private focus(): void {
        this._elementRef.nativeElement.focus();
        this._isOpenedByMouse = false;
    }

    private _setPanelupOpen(opened: boolean) {
        this._opened = opened;

        this._opened ? this.onOpened.emit() : this.onClosed.emit();
    }

    private _destroy(): void {
        if(this._overlayRef && this._opened) {
            this._resetPanelup();

            this._overlayRef.detach();

            this.panelup._resetAnimation();
        }
    }

    private _createOverlay(): OverlayRef {
        if(!this._overlayRef) {
            this._portal = new TemplatePortal(this.panelup.templateRef, this._viewContainerRef);
            const config = this._getOverlayConfig();
            this._subscribeToPositions(config.positionStrategy as ConnectedPositionStrategy);
            this._overlayRef = this._overlay.create(config);
        }

        return this._overlayRef;
    }

    private _subscribeToPositions(position: ConnectedPositionStrategy): void {
        this._positionSubscription = position.onPositionChange.subscribe(change => {
            const posX: PanelupPositionX = change.connectionPair.overlayX === 'start' ? 'after' : 'before';
            const posY: PanelupPositionY = change.connectionPair.overlayY === 'top' ? 'below' : 'above';

            this.panelup.setPositionClasses(posX, posY);
        });
    }

    private _getOverlayConfig(): OverlayConfig {
        return new OverlayConfig({
            hasBackdrop: false,
            positionStrategy: this._getPosition(),
            scrollStrategy: this._scrollStrategy()
        });
    }

    /**
     * Builds the position strategy for the overlay, so the menu is properly connected
     * to the trigger.
     * @returns ConnectedPositionStrategy
     */
    private _getPosition(): ConnectedPositionStrategy {
        let [originX, originFallbackX]: HorizontalConnectionPos[] =
        this.panelup.positionX === 'before' ? ['end', 'start'] : ['start', 'end'];

        let [overlayY, overlayFallbackY]: VerticalConnectionPos[] =
            this.panelup.positionY === 'above' ? ['bottom', 'top'] : ['top', 'bottom'];

        let [originY, originFallbackY] = [overlayY, overlayFallbackY];
        let [overlayX, overlayFallbackX] = [originX, originFallbackX];
        let offsetY = 0;

        if(!this.panelup.overlapTrigger) 
        {
            originY = overlayY === 'top' ? 'bottom' : 'top';
            originFallbackY = overlayFallbackY === 'top' ? 'bottom' : 'top';
        }

        return this._overlay.position()
            .connectedTo(this._elementRef, {originX, originY}, {overlayX, overlayY})
            .withOffsetY(offsetY)
            .withFallbackPosition(
                {originX: originFallbackX, originY},
                {overlayX: overlayFallbackX, overlayY})
            .withFallbackPosition(
                {originX, originY: originFallbackY},
                {overlayX, overlayY: overlayFallbackY},
                undefined, -offsetY)
            .withFallbackPosition(
                {originX: originFallbackX, originY: originFallbackY},
                {overlayX: overlayFallbackX, overlayY: overlayFallbackY},
                undefined, -offsetY);
    }
}