import {
    Component,
    OnInit,
    Input,
    KeyValueDiffer,
    KeyValueDiffers
    } from '@angular/core';
import { FilterExploreService } from "@app/explore/filter-explore/filter-explore.service";
import { Filter } from "@app/shared/models/filter.model";

@Component({
    selector: '.result-explore',
    templateUrl: './result-explore.component.html'
})
export class ResultExploreComponent implements OnInit {
    @Input() filterModel = new Filter();
    private filterModelOld: KeyValueDiffer<string, any>;
    private filterSectorOld: KeyValueDiffer<string, any>;
    private filterYear: KeyValueDiffer<string, any>;

    constructor(private readonly filter: FilterExploreService,
        private readonly differs: KeyValueDiffers) {
        
    }

    ngOnInit() {
        this.filter.filterData.subscribe(data => {
            this.filterModel = data;
        });

        this.filterModelOld = this.differs.find(this.filterModel).create();
        this.filterSectorOld = this.differs.find(this.filterModel.sectorId).create();
        this.filterYear = this.differs.find(this.filterModel.years).create();
    }

    ngDoCheck(): void {
        if (this.filterModelOld == undefined) {
            return;
        }

        const changes = this.filterModelOld.diff(this.filterModel) ||
            this.filterSectorOld.diff(this.filterModel.sectorId) ||
            this.filterYear.diff(this.filterModel.years);

        // properties changed
        if (changes) {
            console.log('changes');
        }
    }
}