import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';



@Component({
    selector: 'arp-top-menu',
    templateUrl: './top-menu.component.html',
    host: {
        'class': 'arp-top-menu',
        'role': 'navigation'
    }
})

export class TopMenuComponent implements OnInit {
    isSectorMenuHidden = true;
    isCountryMenuHidden = true;
    isClosedMenu = true;
    /** Shows top-menu if the page is different than "explore" page */
    isShown: boolean = true;
    @Output() showSuggestBox = new EventEmitter();
    constructor(private router: Router) { }

    ngOnInit() {
        const __this = this;
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (event.url.toLowerCase().startsWith('/explore')) {
                    if (__this.isShown) {
                        __this.isShown = false;
                    }

                } else {
                    if (!__this.isShown) {
                        __this.isShown = true;                       
                    }
                }
                this.showSuggestBox.emit(__this.isShown); // emit the isShown suggest box.
            }
        });       
    }

    onOpenedMenu(name: string) {
        if (name.toLowerCase() == 'country') {
            this.isCountryMenuHidden = false;
        }
        else {
            this.isSectorMenuHidden = false;
        }
    }
    onClosedMenu(name: string) {
        if (name.toLowerCase() == 'country') {
            this.isCountryMenuHidden = true;
        }
        else {
            this.isSectorMenuHidden = true;
        }
    }
}

