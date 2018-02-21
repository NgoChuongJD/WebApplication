import { Routes, RouterModule } from '@angular/router';

import { ExploreComponent } from './explore.component';

const routes: Routes = [
    { path: '', component: ExploreComponent }
];

export const routing = RouterModule.forChild(routes);
