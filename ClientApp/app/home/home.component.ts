import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'arp-home-component',
  templateUrl: './home.component.html'
})

export class HomeComponent {
      
    constructor(private router: Router) {
        
    }

    public navigateToReport(id: any): void {
        this.router.navigate(['country']);
    }

}
