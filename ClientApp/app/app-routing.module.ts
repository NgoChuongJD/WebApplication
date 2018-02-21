//import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

//import { HomeModule } from './home/home.module';
//import { ExploreModule } from './explore/explore.module';
//import { ReportModule } from './report/report.module';
//import { CompanyModule } from './company/company.module';
//import { SearchModule } from './search/search.module';

//import {SectorModule} from './+sector/sector.module'
export const appRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    // Lazy async modules
    {
        path: 'login',
        loadChildren: './account/+login/login.module#LoginModule'
    },
    {
        path: 'register',
        loadChildren: './account/+register/register.module#RegisterModule'
    },
    {
        path: 'createaccount',
        loadChildren: './account/+create/create.module#CreateAccountModule'
    },
    {
        path: 'profile',
        loadChildren: './account/+profile/profile.module#ProfileModule'
    },
    {
        path: "company/:companyCode/:companyName",
        loadChildren: './company/company.module#CompanyModule'
    },
    {
        path: "company/:companyCode",
        loadChildren: './company/company.module#CompanyModule'
    },
    {
        path: 'explore', // optional prams: exploreType, countryCode, exchangeId, sectorId, industryId, year
        loadChildren: './explore/explore.module#ExploreModule'
    },
    {
        path: 'search/:query',
        loadChildren: './search/search.module#SearchModule'
    },
    {
        path: 'report/:companyName/:id/:title',
        loadChildren: './report/report.module#ReportModule'
    }
];
