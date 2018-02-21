import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';

import { routing } from './market.routes';
import { MarketComponent } from './market.component';

@NgModule({
  imports: [
    SharedModule,
    routing
  ],
  declarations: [MarketComponent]
})
export class MarketModule { }
