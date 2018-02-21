import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'arp-home-reports-sectors',
    templateUrl: './home-reports-sectors.component.html'
})
export class HomeReportsSectorsComponent implements OnInit{ 

    items = [
        {sector_name: "Information Technology"},
        {sector_name: "Aerospace & Defense"},
        {sector_name: "Banks & Financials services"},
        {sector_name: "Diversified Services"},
        {sector_name: "Chemicals"},
        {sector_name: "Insurance"}
    ];

    features = [
        {sector_name: "Information Technology"},
        {sector_name: "Aerospace & Defense"},
        {sector_name: "Banks & Financials services"},
        {sector_name: "Diversified Services"},
        {sector_name: "Chemicals"},
        {sector_name: "Insurance"}
    ]
    constructor(){

    }
    public ngOnInit(): void {
    }
}
