import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
@Component({
    selector: 'home-reports',
    templateUrl: './home-reports.component.html'
})
export class HomeReportsComponent implements OnInit {
    public reports_title: string = "Featured Reports";
    public reports_description: string = "In God we trust. All others must bring data. - Edwards Deming";   
    
    constructor(private router: Router ) {

    }
    public ngOnInit(): void {
    }

    public navigateToReports(): void {
        this.router.navigate(['explore'], { queryParams : {exploreType : 'report'} });  // exploreType = report / company
    }

}
