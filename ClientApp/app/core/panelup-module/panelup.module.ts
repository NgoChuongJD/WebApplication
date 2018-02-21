import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCommonModule } from '@angular/material/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { LayoutModule } from '@angular/cdk/layout';
import { MatRippleModule } from '@angular/material/core';

import { Panelup, PANELUP_DEFAULT_OPTIONS } from './panelup-directive';
import { PanelupTrigger, PANELUP_SCROLL_STRATEGY_PROVIDER } from './panelup-trigger';
import { PanelupItem } from './panelup-item';


@NgModule({
    imports: [ 
        OverlayModule,
        CommonModule,
        MatCommonModule,
        MatRippleModule,
        LayoutModule
    ],
    exports: [ 
        Panelup, 
        PanelupItem,
        PanelupTrigger,
        LayoutModule
    ],
    declarations: [ Panelup, PanelupItem, PanelupTrigger ],
    providers: [  
        PANELUP_SCROLL_STRATEGY_PROVIDER,
        {
            provide: PANELUP_DEFAULT_OPTIONS,
            useValue: {
                positionX: 'after',
                positionY: 'below',
                overlapTrigger: false
            }
        }
    ]
})

export class PanelupModule { }

