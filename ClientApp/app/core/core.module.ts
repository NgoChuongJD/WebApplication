import { NgModule, Optional, SkipSelf, ModuleWithProviders, ErrorHandler } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OAuthModule } from 'angular-oauth2-oidc';

import { WINDOW_PROVIDERS } from './window-ref'
// App level components
//import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SectorListComponent } from './components/sector-list/sector-list.component';
import { CountryListComponent } from './components/country-list/country-list.component';
// App level services
import { AccountService } from './services/account.service';
import { LayoutBreakpointService } from './services/layout-breakpoint.service';
import { DataService } from './services/data.service';
import { UtilityService } from './services/utility.service';
import { LogService, LogPublishersService } from './services/log';
import { ApiTranslationLoader } from './services/api-translation-loader.service';
import { AuthInterceptor, TimingInterceptor } from './services/interceptors';
import { GlobalErrorHandler } from './services/global-error.service';
import { SimpleNotificationsModule } from './simple-notifications';
import { GlobalRef, BrowserGlobalRef } from './global-ref';
import { HeaderDataService } from './services/header-data.service';
import { SearchDataService } from './services/search-data.service';
import { ProgressBarService } from './services/progress-bar.service';

import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { PanelupModule } from './panelup-module/panelup.module';
import { MatButtonModule } from '@angular/material';
export function createTranslateLoader(globalRef: GlobalRef) {
    return new ApiTranslationLoader(globalRef);
}

@NgModule({
    declarations: [
        FooterComponent,
        SectorListComponent,
        CountryListComponent,
        TopMenuComponent,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        NgbModule.forRoot(),
        RouterModule,
        //AppMaterialModule,
        //ResponsiveModule,
        OAuthModule.forRoot(),
        // https://github.com/flauc/angular2-notifications/blob/master/docs/toastNotifications.md
        SimpleNotificationsModule.forRoot(),
        //TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: ApiTranslationLoader } })
        // When use lazying load a module, should use the "forChild" static method to import TranslateModule
        // Ref: https://github.com/ngx-translate/core#lazy-loaded-modules
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [GlobalRef]
            }
        }),
        MatButtonModule,
        ReactiveFormsModule,
        PanelupModule
    ],
    exports: [
        RouterModule,
        // Components        
        FooterComponent,
        SectorListComponent,
        TopMenuComponent,
        CountryListComponent,
        //AppMaterialModule,
        ReactiveFormsModule,
        MatButtonModule,
        PanelupModule
    ],
    providers: []
})
export class CoreModule {
    // forRoot allows to override providers
    // https://angular.io/docs/ts/latest/guide/ngmodule.html#!#core-for-root
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
                LayoutBreakpointService,
                AccountService,
                DataService,
                LogService,
                LogPublishersService,
                UtilityService,
                HeaderDataService,
                SearchDataService,
                ProgressBarService,
                { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
                { provide: HTTP_INTERCEPTORS, useClass: TimingInterceptor, multi: true },
                { provide: ErrorHandler, useClass: GlobalErrorHandler },
                { provide: GlobalRef, useClass: BrowserGlobalRef },
                ...WINDOW_PROVIDERS
            ]
        };
    }
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}
