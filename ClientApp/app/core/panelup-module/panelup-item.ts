import {FocusableOption} from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
  HostListener
} from '@angular/core';
import {
  CanDisable,
  CanDisableRipple,
  mixinDisabled,
  mixinDisableRipple
} from '@angular/material/core';
import {Subject} from 'rxjs/Subject';

export class PanelupItemBase {}
export const _PanelupItemMixinBase = mixinDisableRipple(mixinDisabled(PanelupItemBase));

/**
 * This component is intended to be used inside a panelup tag
 */
@Component({
    selector: '[panelup-item]',
    inputs: ['disabled', 'disableRipple'],
    exportAs: 'panelupItem',
    template: `
        <ng-content></ng-content>
        <div class="mat-menu-ripple" matRipple
            [matRippleDisabled]="disableRipple || disabled"
            [matRippleTrigger]="_getHostElement()">
        </div>
    `,
    host: {
        'class': 'panelup-item',
        'role': 'menuitem',
        '[attr.tabindex]': '_getTabIndex()',
        '[attr.aria-disabled]': 'disabled.toString()',
        '[attr.disabled]': 'disabled || null'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false
})

export class PanelupItem extends _PanelupItemMixinBase implements FocusableOption, CanDisable, CanDisableRipple, OnDestroy {
    _hovered: Subject<PanelupItem> = new Subject();
    
    /** Whether the item is highlighted. */
    _highlighted: boolean = false;

    constructor(private _elementRef: ElementRef) {
        super();
    }

    /** Focuses the item. */
    focus(): void {
        this._getHostElement().focus();
    }

    ngOnDestroy(): void {
        this._hovered.complete();
    }

    /** Used to set the `tabindex`. */
    _getTabIndex(): string {
        return this.disabled ? '-1' : '0';
    }

    /** Returns the host DOM element. */
    _getHostElement(): HTMLElement {
        return this._elementRef.nativeElement;
    }

    @HostListener('click', ['$event'])
    /** Prevents the default element actions if it is disabled. */
    _checkDisabled(event: Event): void {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    @HostListener('mouseenter', ['$event'])
    /** Emits to the hover stream. */
    _emitHoverEvent() {
        if (!this.disabled) {
            this._hovered.next(this);
        }
    }

    getLabel(): string {
        const element: HTMLElement = this._elementRef.nativeElement;
        let output = '';
    
        if (element.childNodes) {
          const length = element.childNodes.length;
    
          // Go through all the top-level text nodes and extract their text.
          // We skip anything that's not a text node to prevent the text from
          // being thrown off by something like an icon.
          for (let i = 0; i < length; i++) {
            if (element.childNodes[i].nodeType === Node.TEXT_NODE) {
              output += element.childNodes[i].textContent;
            }
          }
        }
    
        return output.trim();
      }
}