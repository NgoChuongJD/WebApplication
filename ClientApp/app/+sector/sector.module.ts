import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { SectorComponent } from './sector.component';
import { routing } from './sector.routes';

@NgModule({
    imports: [routing, SharedModule],
    declarations: [SectorComponent]
})
export class SectorModule { }
