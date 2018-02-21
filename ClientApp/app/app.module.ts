import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { CoreModule } from '@app/core';

import { HomeModule } from './home/home.module';

import { SharedModule } from "./shared/shared.module";

import { appRoutes } from './app-routing.module';


import { AppComponent } from './app.component';

import { HttpModule } from '@angular/http';

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        //AppRoutingModule,
        HttpModule,
        CoreModule.forRoot(),
        SharedModule.forRoot(),
        RouterModule.forRoot(appRoutes, {
            preloadingStrategy: PreloadAllModules,
            // enableTracing: true
        }),
        HomeModule
        //TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: ApiTranslationLoader } })
        // When use lazying load a module, should use the "forChild" static method to import TranslateModule
        // Ref: https://github.com/ngx-translate/core#lazy-loaded-modules
        /*TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [GlobalRef]
            }
        })*/
    ]
})
export class AppModule { }
