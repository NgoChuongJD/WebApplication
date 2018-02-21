import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared.module";
import { HomeComponent } from './home.component';
import { routing } from './home.routes';
import { HomeBannerComponent } from './home-banner/home-banner.component'
import { HomeReportsComponent } from './home-reports/home-reports.component';
import { HomeCompaniesComponent } from './home-companies/home-companies.component';
import { HomeSectorsComponent } from './home-sectors/home-sectors.component';
import { HomeReportsSectorsComponent } from './home-reports/home-reports-sectors/home-reports-sectors.component';
import { HomeReportsItemsComponent } from './home-reports/home-reports-items/home-reports-items.component';
import { HomeCompanyService } from './home-companies/home-companies.service';
import { HomeReportsItemsService } from './home-reports/home-reports-items/home-reports-items.service';
import { UrlPrepareService } from "@app/core/services/url-prepare.service";
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';

export class MyHammerConfig extends HammerGestureConfig  {
    overrides = <any> {
        'swipe': {
            'swipe': { dirention: Hammer.DIRECTION_HORIZONTAL },
            velocity: 0.4, threshold: 20
        } // override default settings
    }
}

@NgModule({
    imports: [
        routing,
        SharedModule
    ],
    declarations: [
        HomeComponent,
        HomeBannerComponent,
        HomeReportsComponent,
        HomeCompaniesComponent,
        HomeSectorsComponent,
        HomeReportsSectorsComponent,
        HomeReportsItemsComponent
    ],
    providers: [
        HomeCompanyService,
        UrlPrepareService,
        HomeReportsItemsService,
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: MyHammerConfig
        }
    ]
})
export class HomeModule {
}
