import {
    Component,
    OnInit,
    HostListener,
    Input,
    DoCheck,
    KeyValueDiffer,
    KeyValueDiffers
} from '@angular/core';
import { FilterExploreService } from './filter-explore.service';
import { HeaderDataService } from "@app/core/services/header-data.service";
import { Filter } from "@app/shared/models/filter.model";
import { SectorModel, CountryModel, ExchangeModel, IndustryModel } from "@app/core/models/index";
import { LayoutBreakpointService, LayoutBreakpoint } from "@app/core/services/layout-breakpoint.service";

@Component({
    selector: '.filter-explore',
    templateUrl: './filter-explore.component.html'
})
export class FilterExploreComponent implements OnInit, DoCheck {
    filterOpen = true; // Mobile
    openSectorBoxMode = false;
    openListingBoxMode = false;
    openIndustryBoxMode = false;

    // Text
    lab_reports = 'Report';
    lab_company = 'Company';
    lab_nature = 'by Nature';
    placeholder = 'Select Sector';
    isDesktop = false;
    query: string = '';

    // source API
    locations: CountryModel[] = [];
    exchanges: ExchangeModel[] = [];
    sectors: SectorModel[] = [];
    industries: IndustryModel[] = [];

    // form datas
    yearsFilter: number[] = [];
    exchangesDisplay: ExchangeModel[] = [];
    industriesDisplay: IndustryModel[] = [];
    sortOrder: boolean;
    isEndYear: boolean;
    private endReportYear: number;

    // Model
    @Input() filterModel = new Filter();
    private filterModelOld: KeyValueDiffer<string, any>;

    constructor(private readonly filterService: FilterExploreService,
        private readonly headerDataService: HeaderDataService,
        private readonly layoutBreakpointService: LayoutBreakpointService,
        private readonly differs: KeyValueDiffers
    ) {
        this.isDesktop = this.deviceDectect(layoutBreakpointService.currentBreakpoint);
    }

    ngOnInit(): void {
        // store current value to detect properties change later
        this.filterModelOld = this.differs.find(this.filterModel).create();
        this.filterService.changeFilter(this.filterModel);

        const parent = this;

        if (parent.filterModel.query != undefined) {
            parent.query = parent.filterModel.query;
        }

        // get data to fill search filter side bar
        this.endReportYear = 2005;
        this.isEndYear = false;

        if (this.filterModel.years[0] <= this.endReportYear) {
            this.filterModel.years[0] = this.endReportYear;
            this.isEndYear = true;
        }

        this.yearsFilter = this.filterService.getYears(this.filterModel.years[0]);

        this.headerDataService.getCountries().subscribe((result) => {
            this.locations = result;
        });

        this.filterService.getExchanges().subscribe(data => {
            this.exchanges = data;
            this.exchangesDisplay = data;
        });

        this.headerDataService.getSectors().subscribe((result) => {
            this.sectors = result;
        });

        this.filterService.getIndustries().subscribe(data => {
            this.industries = data;

            if (this.filterModel.sectorId.length > 0) {
                this.industriesDisplay =
                    this.filterService.getIndustriesBySector(this.filterModel.sectorId, this.industries);
            } else {
                this.industriesDisplay = data;
            }
        });

        this.layoutBreakpointService.breakpointSource.subscribe(breakpoint => {
            this.isDesktop = this.deviceDectect(breakpoint);
        });
    }

    private deviceDectect(breakpoint: any): boolean {
        switch (breakpoint) {
            case LayoutBreakpoint.Desktop: {
                // desktop
                return true;
            }
            case LayoutBreakpoint.TabletLandscape:
                {
                    return true;
                }
            case LayoutBreakpoint.HandsetPortrait:
            case LayoutBreakpoint.TabletPortrait:
                {
                    return false;
                }
            default: {
                return true;
            }
        }
    }

    ngDoCheck(): void {
        if (this.filterModelOld == undefined) {
            return;
        }

        const changes = this.filterModelOld.diff(this.filterModel);

        // properties changed
        if (changes) {
            this.getDisplaySector();
            this.industriesDisplay = this.filterService.getIndustriesBySector(this.filterModel.sectorId, this.industries);
            this.updateTextPlaceHolder();
        }
    }
    
    setPostionOverlay() {
        for (let i = 0; i < document.getElementsByClassName('cdk-overlay-pane').length; i++) {
            document.getElementsByClassName('cdk-overlay-pane')[i].classList.add('filter-select');
        }
    }

    /**
     * Make multi select box
     * @param sectorList
     */
    getDisplaySector() {
        if (this.filterModel.sectorId == undefined || this.filterModel.sectorId.length <= 0) {
            return;
        }
        

        this.filterModel.sectorId.forEach((id) => {
            this.sectors.forEach(value => {
                 value.checked = value.sectorID == id;
            });
        });
    }

    changeYear(event: any, val: number) {
        if (event.target.checked) {
            this.filterModel.years.push(val);
        } else {
            const i = this.filterModel.years.indexOf(val);
            this.filterModel.years.splice(i, 1);
        }
    }

    addYearFilters() {
        const last = this.yearsFilter[this.yearsFilter.length - 1];
        const temp: number[] = [];
        for (let i = 1; i <= 5 && last - i >= this.endReportYear; i++) {
            temp.push(last - i);

            if (last - i == this.endReportYear) {
                this.isEndYear = true;
            }
        }

        this.yearsFilter.push(...temp);
    }

    toggleMobileMenu(val?: boolean) {
        this.filterOpen = val || !this.filterOpen;

        if (document.getElementById('mobile-filter')) {
            document.getElementById('mobile-filter').classList.toggle('hidden');
        }

        document.body.classList.toggle('menu-open');
    }

    // Location
    locationReset() {
        this.filterModel.countryCode = null;
    }
    // end of location

    // Exchange
    openExchangeBox() {
        this.openListingBoxMode = true;
    }

    changeExchange(checked: boolean, marketID: number) {
        if (checked) {
            this.filterModel.exchangeId.push(marketID);
        } else {
            const i = this.filterModel.exchangeId.indexOf(marketID);
            if (i > -1) {
                this.filterModel.exchangeId.splice(i, 1);
            }
        }

        this.exchangesDisplay.forEach(item => {
            if (item.marketID == marketID) {
                item.checked = checked;
            }
        });

        this.updateTextPlaceHolder();
    }

    exchangeReset() {
        this.filterModel.exchangeId = null;
    }

    // end of Exchange

    // Sector
    openSectorBox() {
        this.openSectorBoxMode = true;
    }

    /**
     * Close box sector on body tag click
     * @param event
     */
    @HostListener('body:click', ['$event.target'])
    @HostListener('body:touchend', ['$event.target'])
    closeSectorBox(target: any) {
        if (!target)
            return;

        const targetClass = ['sector-select-multi', 'mat-checkbox-label', 'mat-checkbox-layout', 'mat-checkbox-inner-container'];

        let onSelect = false;
        for (let i = 0; i < targetClass.length; i++) {
            if (target.classList.contains(targetClass[i])) {
                onSelect = true;
                break;
            }
        }

        if (!onSelect) {
            if (this.openSectorBoxMode) {
                this.getIndustry();
            }

            this.openSectorBoxMode = false;
            this.openListingBoxMode = false;
            this.openIndustryBoxMode = false;

            this.updateTextPlaceHolder();
        } else {
            if (target.id == 'sectorId') {
                this.openListingBoxMode = false;
                this.openIndustryBoxMode = false;
            } else if (target.id == 'exchangeId') {
                this.openSectorBoxMode = false;
                this.openIndustryBoxMode = false;
            } else if (target.id == 'industryId') {
                this.openSectorBoxMode = false;
                this.openListingBoxMode = false;
            }
        }
    }

    private getIndustry() {
        this.industriesDisplay =
            this.filterService.getIndustriesBySector(this.filterModel.sectorId, this.industries);

        if (this.industriesDisplay.length <= 0) {
            this.filterModel.industryId = [];
        }

        // In case: industry is selected before change sector, check exist in new list, if false, reset value.
        if (this.filterModel.industryId != null && this.filterModel.industryId.length > 0) {
            for (let index = 0; index < this.filterModel.industryId.length; index++) {
                const industry = this.filterModel.industryId[index];

                let existed = false;

                for (let j = 0; j < this.industriesDisplay.length; j++) {
                    if (this.industriesDisplay[j].industryID == industry) {
                        this.industriesDisplay[j].checked = true;
                        existed = true;
                    } else {
                        this.industriesDisplay[j].checked = false;
                    }
                }

                if (!existed) {
                    this.filterModel.industryId.splice(index, 1);
                    index--;
                }
            }
        }
        else {
            this.industriesDisplay.forEach(item => {
                item.checked = false;
            });
        }
    }

    updateTextPlaceHolder() {
        this.placeholder = this.filterModel.sectorId.length <= 0 ? 'Select Sector' : '';
        const textExchange = this.filterModel.exchangeId.length <= 0 ? 'Select Exchange' : '';
        const textIndustry = this.filterModel.industryId.length <= 0 ? 'Select Industry' : '';

        if (document.getElementById('exchangeId')) {
            document.getElementById('exchangeId').setAttribute('placeholder', textExchange);
        }

        if (document.getElementById('industryId')) {
            document.getElementById('industryId').setAttribute('placeholder', textIndustry);
        }

        if (document.getElementById('sectorId')) {
            document.getElementById('sectorId').setAttribute('placeholder', this.placeholder);
        }

        if (document.getElementById('sectorId-mobile')) {
            document.getElementById('sectorId-mobile').setAttribute('placeholder', this.placeholder);
        }
    }

    /**
     * Add / remove sector from list
     * @param event
     * @param sectorId
     * @param sectorName
     */
    changeSector(checked: boolean, sectorId: number) {
        if (checked) {
            // Max 3 items
            if (this.filterModel.sectorId.length >= 3) {
                return;
            }

            this.filterModel.sectorId.push(sectorId);

            if (this.filterModel.sectorId.length >= 3) {
                this.openSectorBoxMode = false;
                this.getIndustry();
            }
        } else {
            const i = this.filterModel.sectorId.indexOf(sectorId);
            this.filterModel.sectorId.splice(i, 1);
        }

        this.sectors.forEach(item => {
            if (item.sectorID == sectorId) {
                item.checked = checked;
            }
        });
        
        this.updateTextPlaceHolder();
    }

    removeSector(sectorId: number) {
        this.changeSector(false, sectorId);
        this.getIndustry();
        this.updateTextPlaceHolder();
    }

    // Industry
    openIndustryBox() {
        this.openIndustryBoxMode = true;
    }

    changeIndustry(checked: boolean, industryID: number) {
        if (checked) {
            this.filterModel.industryId.push(industryID);
        } else {
            const i = this.filterModel.industryId.indexOf(industryID);
            if (i > -1) {
                this.filterModel.industryId.splice(i, 1);
            }
        }

        this.industriesDisplay.forEach(item => {
            if (item.industryID == industryID) {
                item.checked = checked;
            }
        });

        this.updateTextPlaceHolder();
    }

    sortOrderChange() {
        this.sortOrder = !this.sortOrder;
    }
}