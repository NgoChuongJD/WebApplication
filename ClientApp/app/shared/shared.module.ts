import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from "@ngx-translate/core";

// Components
import { DynamicFormComponent, DynamicFormControlComponent, ErrorSummaryComponent } from './forms';
import { SocialLoginComponent } from './components';
import { ReportListComponent } from './components'
// Directives
import { PageHeadingComponent } from './directives';
// Pipes
import { UppercasePipe } from './pipes';
// Services
import { FormControlService } from './forms';
import { SuggestBoxComponent } from '@app/core/components/suggest-box/suggest-box.component';
import { SuggestBoxService } from '@app/core/components/suggest-box/suggest-box.service';
import { BoldTextSearchPipe } from "@app/shared/index";
import {RouterModule} from '@angular/router';

import { AppMaterialModule } from '../material.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        NgbModule,
        TranslateModule,
        AppMaterialModule
        // No need to export as these modules don't expose any components/directive etc'
    ],
    declarations: [
        SocialLoginComponent,
        ReportListComponent,
        DynamicFormComponent,
        DynamicFormControlComponent,
        ErrorSummaryComponent,
        PageHeadingComponent,
        UppercasePipe,
        SuggestBoxComponent,
        BoldTextSearchPipe        
    ],
    exports: [
        // Modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        // Providers, Components, directive, pipes
        SocialLoginComponent,
        ReportListComponent,
        DynamicFormComponent,
        DynamicFormControlComponent,
        ErrorSummaryComponent,
        PageHeadingComponent,
        UppercasePipe,
        TranslateModule,
        SuggestBoxComponent,
        BoldTextSearchPipe,
        AppMaterialModule
    ],
    providers: [
        FormControlService,SuggestBoxService
    ]
})
export class SharedModule {
    /**
     * forRoot
     * Referent: https://angular.io/guide/ngmodule#configure-core-services-with-coremoduleforroot
     */
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: []
        };
    }
}