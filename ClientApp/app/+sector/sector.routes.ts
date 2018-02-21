import { Routes, RouterModule } from '@angular/router';

import { SectorComponent } from './sector.component';

const routes: Routes = [
    { path: '', component: SectorComponent }
];

export const routing = RouterModule.forChild(routes);
