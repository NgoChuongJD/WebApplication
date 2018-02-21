import { Component } from '@angular/core';
import { Router } from "@angular/router";
@Component({
    selector: 'home-banner',
    templateUrl: './home-banner.component.html'
})
export class HomeBannerComponent { 
    bannerUrl :string ="images/bground/banner background.png";
    bannerTitle: string = `Read thousands of annual reports worldwide.
                           All in one location.`;
    constructor(private router: Router ) {
    }
    public navigateToExplore(): void {
        this.router.navigate(['explore'], { queryParams : {exploreType : 'report'} });  // exploreType = report / company
    }

}
