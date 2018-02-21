import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { routing } from './search.routes';
@NgModule({
    declarations: [SearchComponent],
    imports:[routing],
    exports: []
})
export class SearchModule {
}