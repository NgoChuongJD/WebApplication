import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HeaderDataService } from '../../services/header-data.service';
import { SectorModel } from '../../models';
import { Router } from "@angular/router";
import { LayoutBreakpointService, LayoutBreakpoint } from '../../../core/services/layout-breakpoint.service';

@Component({
    selector: 'arp-sector-list',
    templateUrl: './sector-list.component.html'
})

export class SectorListComponent implements OnInit {
    @Output() onItemClicked = new EventEmitter<void | 'click' | 'keydown'>();

    sectors: SectorModel[];
    firstColumnSectors: SectorModel[] = [];
    secondColumnSectors: SectorModel[] = [];
    thirdColumnSectors: SectorModel[] = [];
    grid: Array<Array<SectorModel>> = [];
    COLUMN_NUMBER: number = 3;
    private sectorsObservable: Observable<SectorModel[]>;
    isDesktopDevice: boolean = true;
    constructor(private headerDataService: HeaderDataService, private router: Router, private layoutBreakpointService: LayoutBreakpointService) {

    }

    ngOnInit() {
        this.isDesktopDevice = this.checkDesktopDeviceLayout(this.layoutBreakpointService.currentBreakpoint);
        this.sectorsObservable = this.headerDataService.getSectors();
        this.sectorsObservable.subscribe(sectors => {
            this.sectors = sectors;
        })
        let tmpArray = Object.assign([], this.sectors);
        this.splitSectorsInto3Column(tmpArray);
    }
    private checkDesktopDeviceLayout(breakPoint: LayoutBreakpoint): boolean {
        return breakPoint == LayoutBreakpoint.Desktop;
    }
    public splitSectorsInto3Column(arr: SectorModel[]) {

        let numberOfRow = Math.ceil(arr.length / this.COLUMN_NUMBER);
        const len = arr.length;
        for (let i = 0; i < len; i++) {
            if (i < numberOfRow) {
                this.firstColumnSectors.push(arr[i]);
            }
            else
                if (i >= numberOfRow && i < 2 * numberOfRow) {
                    this.secondColumnSectors.push(arr[i]);
                }
                else {
                    this.thirdColumnSectors.push(arr[i]);
                }
        }
    }

    public navigateToExplore(sectorId: string): void {
        if (this.onItemClicked) {
            this.onItemClicked.emit();
        }

        this.router.navigate(['explore'], { queryParams: { sectorId: sectorId } });
    }
}