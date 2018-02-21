import { Component } from '@angular/core';

@Component({
    selector: 'arp-footer',
    templateUrl: './footer.component.html'
})
 
export class FooterComponent { 
  about_arp: string ="About ARP";
  contact_us: string = "Contact Us";
  disclaimer: string = "Disclaimer";
  cookie_policy : string = "Cookie Policy";
  privacy_policy : string = " Privacy Policy";
}
