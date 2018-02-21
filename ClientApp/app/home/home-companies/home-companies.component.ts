import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { HomeCompany } from './home-company';
import { HomeCompanyService } from './home-companies.service'
import { LayoutBreakpointService, LayoutBreakpoint } from '../../core/services/layout-breakpoint.service';
import { UrlPrepareService } from "@app/core/services/url-prepare.service";

@Component({
    selector: 'home-companies',
    templateUrl: './home-companies.component.html'
})
export class HomeCompaniesComponent implements OnInit, AfterViewInit {
    public companies_all: HomeCompany[];
    public groups: any[];
    public groups3x: any[];
    public groups4x: any[];
    public groups5x: any[];
    public companies_title: string = "Featured Companies";
    public companies_description: string = "Get to know your next investment";
    public device: string = "";
    public device_value = 0;
    public number = 5;
    public page = 0;
    public count_pages = 0;
    public isDesktop = true;
    public groupBySector: any[];
    public arrowImgSrc: string;
    public loaded = false;

    // constant for swipe action: left or right
    private SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight', UP: 'swipeup', DOWN: 'swipedown' };

    constructor(
        private readonly companyService: HomeCompanyService,
        private readonly layoutBreakpointService: LayoutBreakpointService,
        private readonly _router: Router,
        private readonly urlPrepareService: UrlPrepareService,
        loStrategy: LocationStrategy) {
        this.arrowImgSrc = `${loStrategy.getBaseHref()}img/arrow.png`;
        this.device_value = this.layoutBreakpointService.currentBreakpoint;
    }

    ngOnInit(): void {
        this.loaded = false;
        this.companyService.getCompanies().subscribe(results => {
            results.forEach(item => {
                item.companyNameEncoded = this.urlPrepareService.replaceSpecialCharacter(item.companyName);
            });
            this.companies_all = results;
            

            this.groupBySector = this.sortItems(results);

            this.number = 3;
            this.groups3x = this.randomItems();

            this.groupBySector = this.sortItems(results);

            this.number = 4;
            this.groups4x = this.randomItems();

            this.groupBySector = this.sortItems(results);
            this.number = 5;
            this.groups5x = this.randomItems();

            this.setCompanies();
            this.setNumberItemsOnPage();

            this.loaded = true;
        });
    }

    ngAfterViewInit() {
        this.resetPositionControls();
    }
    @HostListener("window:resize", ["$event"])
    onResize() {
        this.device_value = this.layoutBreakpointService.currentBreakpoint;
        this.resetPositionControls();
    };

    @HostListener("window:load", ["$event"])
    onload() {
        this.resetPositionControls();
    }

    private resetPositionControls() {
        var group = document.getElementsByClassName("home-company-groups")[0];
        var el = document.getElementsByClassName("home-company-next")[0];
        var el2 = document.getElementsByClassName("home-company-prev")[0];
        if (el != undefined && el2 != undefined && group != undefined) {
            if ((el.getBoundingClientRect().left + el.clientWidth) > window.innerWidth) {
                el.className = el.className + ' transZero';
                el2.className = el2.className + ' transZero';
                group.className += ' position-initial';
            }
            else {
                el.className = el.className.replace(" transZero", "");
                el2.className = el2.className.replace(" transZero", "");
                group.className = group.className.replace(" position-initial", "");
            }
        }
    }

    /**
     * This will be sort by sectorId
     */
    private sortCompanies(p1: HomeCompany, p2: HomeCompany) {
        return parseInt(p1.sectorId) - parseInt(p2.sectorId);
    }

    /**
     * This will be sort by number of companies in the one sector
     */
    private sortSector(p1: GroupBySector, p2: GroupBySector) {
        return (p2.count) - (p1.count);
    }

    private sortItems(homeCompanies: HomeCompany[]) {
        let results = this.shuffle(homeCompanies);
        results = results.sort(this.sortCompanies);
        let randomSectors: string[] = [];
        let sectorStart = results[0].sectorId;
        let groupBySector: GroupBySector[] = [];
        randomSectors.push(sectorStart);
        for (let i = 0; i < results.length; i++) {
            if (sectorStart != results[i].sectorId) {
                sectorStart = results[i].sectorId;
                randomSectors.push(sectorStart);
            }
        }
        randomSectors = this.shuffle(randomSectors);
        for (let i = 0; i < randomSectors.length; i++) {
            const group: GroupBySector = {
                sector: randomSectors[i],
                count: 0,
                items: [],
                added: []
            };
            for (let j = 0; j < results.length; j++) {
                if (results[j].sectorId == group.sector) {
                    group.count++;
                    group.items.push(results[j]);
                    group.added.push(false);
                }
            }
            groupBySector.push(group);
        }
        groupBySector = groupBySector.sort(this.sortSector);

        return groupBySector;
    }
    /**
     * @param homeCompanies The companies will be show on the homepage
     */
    private randomItems() {
        let groupCompanies: HomeCompany[] = [];
        let groupCompaniesDisplayed: any[] = [];
        let count = 0;
        let length = 0;
        let groupException: any[] = [];
        let groupFinal: any[] = [];
        for (let i = 0; i < this.groupBySector.length; i++) {
            //console.log("> sector: ", this.groupBySector[i].sector);
            for (let j = 0; j < this.groupBySector[i].count; j++) {
                if (this.groupBySector[i].added[j] == false) {
                    groupCompanies.push(this.groupBySector[i].items[j]);
                    count++;
                    length++;
                    this.groupBySector[i].added[j] = true;
                    //console.log("> - company: ", j, this.groupBySector[i].items[j].companyName);
                    if (count == this.number || length == this.companies_all.length) {
                        let newGroup = groupCompanies;
                        if (count < this.number) {
                            groupException = newGroup;
                            // for (let x = count; x < this.number; x++) {
                            //     groupException.push(this.groupBySector[i].items[j]);
                            // }
                        }
                        else {
                            groupCompaniesDisplayed.push(newGroup);
                        }
                        groupCompanies = [];
                        count = 0;
                        i = -1;
                        //console.log("===============", length);
                    }
                    break;
                }
            }

            if (length == this.companies_all.length) {
                break;
            }
        }
        groupFinal = this.shuffle(groupCompaniesDisplayed);
        if (groupException.length != 0) {
            groupFinal.push(groupException);
        }
        return groupFinal;
    }
    /**
     * @param arr this is needed random
     */
    private shuffle(arr: any[]) {
        var l = arr.length, temp: any, index: number;
        while (l > 0) {
            index = Math.floor(Math.random() * l);
            l--;
            temp = arr[l];
            arr[l] = arr[index];
            arr[index] = temp;
        }
        return arr;
    }
    /**
     * Event swipe on Home page for Featured Companies
     * @param action
     */
    swipe(action = this.SWIPE_ACTION.RIGHT) {
        if (action == this.SWIPE_ACTION.LEFT && this.page < this.count_pages) {
            this.clickNext();
        } else if (action == this.SWIPE_ACTION.RIGHT && this.page > 0) {
            this.clickPrev();
        } 
    }

    clickNext() {
        this.page++;
        if (this.page > this.count_pages - 1) {
            this.page = 0;
        }
        this.setCompanies();
    }

    clickPrev() {
        this.page--;
        if (this.page < 0) {
            this.page = this.count_pages - 1;
        }
        this.setCompanies();
    }

    public setNumberItemsOnPage() {
        let number = this.number;
        if (this.device_value == LayoutBreakpoint.Desktop) {
            number = 5;
        }
        else if (this.device_value == LayoutBreakpoint.TabletLandscape || this.device_value == LayoutBreakpoint.HandsetLandscape) {
            number = 4;
        }
        else {
            number = 3;
        }
        if (number != this.number) {
            this.number = number;
        }
        if (this.companies_all != undefined) {
            this.count_pages = (this.companies_all.length / this.number);
            this.count_pages = parseInt(this.count_pages.toFixed(0));
        }
    }
    public setCompanies() {
        if (this.device_value == LayoutBreakpoint.Desktop) {
            this.groups = this.groups5x;
        }
        else if (this.device_value == LayoutBreakpoint.TabletLandscape || this.device_value == LayoutBreakpoint.HandsetLandscape) {
            this.groups = this.groups4x;
        }
        else {
            this.groups = this.groups3x;
        }
    }

    public isDevice() {
        this.setNumberItemsOnPage();
        this.setCompanies();
        if (this.page >= this.count_pages) {
            this.page = 0;
        }
        return this.device.split("-")[0];
    }
    public showGroup(index: number) {
        if (this.page == index) {
            return "display";
        }
        else {
            return "hidden";
        }
    }
    public hideControl(controlName: string) {
        if ((controlName == "prev" && this.page == 0)
            || (controlName == 'next' && this.page == this.count_pages - 1)) {
            return "hidden";
        }
        else {
            return "showed";
        }
    }

    navigateToExplorePage() {
        this._router.navigate(['/explore']);
    }
}

export interface GroupBySector {
    sector: string;
    items: HomeCompany[];
    added: boolean[];
    count: number;
}

