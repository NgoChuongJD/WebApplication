import { NgModule } from '@angular/core';

import { routing } from './explore.routes';
import { SharedModule } from "../shared/shared.module";
import { ExploreComponent } from './explore.component';
import { FilterExploreComponent } from './filter-explore/filter-explore.component';
import { ResultExploreComponent } from './result-explore/result-explore.component';
import { FilterExploreService } from './filter-explore/filter-explore.service';

@NgModule({
    imports: [
        routing,
        SharedModule
    ],
    declarations: [
        FilterExploreComponent, 
        ResultExploreComponent, 
        ExploreComponent
    ],
    exports: [
        ExploreComponent, 
        ResultExploreComponent,
        FilterExploreComponent
    ],
    providers: [FilterExploreService]
})
export class ExploreModule {
}