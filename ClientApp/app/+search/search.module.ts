import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';

import { routing } from './search.routes';
import { SearchComponent } from './search.component';

@NgModule({
  imports: [
    SharedModule,
    routing
  ],
  declarations: [SearchComponent]
})
export class SearchModule { }