import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
//import { PageNavigationService } from "../core/services/page-navigaion.service";
import { UtilityService } from '../core/services/utility.service';
///import { MatButtonModule } from '@angular/material';
//import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'arp-marekt',
  templateUrl: './market.component.html',
})


export class MarketComponent implements OnInit {

   id: string;
   currUrl: string;
   filterType = "report";
   constructor(private activeRoute: ActivatedRoute, private router: Router, private utilityService: UtilityService) {
       this.activeRoute.params.subscribe(params => this.id = params["id"]);         

 }
   ngOnInit() {
       this.utilityService.setPageInfo("market");      
       this.currUrl = this.router.url;
       console.log(this.router.url);
       this.newMessage();
  }


   private newMessage(): void {
       this.utilityService.changeMessage("Hello from Sibling")
   }

}
