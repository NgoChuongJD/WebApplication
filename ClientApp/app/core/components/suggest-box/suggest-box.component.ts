import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SuggestBoxService } from './suggest-box.service';
import { SuggestionModel } from "@app/core/models/index";
import { Router } from "@angular/router";

@Component({
    selector: 'arp-suggest-box',
    templateUrl: './suggest-box.component.html',
    //styleUrls: ['./suggest-box.component.scss']
})

/** suggest-box component*/
export class SuggestBoxComponent {
    @Input() query: string = '';

     /** suggest-box ctor */
    showSuggestBox: boolean = false;
    selectedItem: number = -1;
    suggestionControl: FormControl;
    placeholder: string = 'Search';
    backupSearchText: string = '';
    isTyping: boolean;
    suggestResult: SuggestionModel[] = [];

    constructor(private suggestBoxService: SuggestBoxService, private router: Router) {
        this.suggestionControl = new FormControl();
    }

    filter(val: string) {
        this.selectedItem = -1; // reset selected postion when user press up / down key

        if (val == null || val == undefined || val.trim().length < 1) {
			this.showSuggestBox = false;
            return;
        }

        this.showSuggestBox = true;

        // get API
        this.suggestBoxService.getSuggestion(this.query)
            .subscribe((result) => {
                this.suggestResult = result;
                if (this.suggestResult.length == 0) {
                    this.showSuggestBox = false;
                }
            });
        //console.log(this.suggestResult);
    }

    enterSuggestBox() {
        this.selectedItem = -1;
        this.placeholder = 'Company name or share name';
    }

    leaveSuggestBox() {
        this.placeholder = 'Search';
        // Close suggest box after 100ms
        const parent = this;
        setTimeout(function() {
            parent.showSuggestBox = false;
            
        }, 250);
    }

    typingMode() {
        this.isTyping = true;
        const parent = this;
        setTimeout(function() {
                parent.filter(parent.query);
            }, 150);
        
    }

    getPrevItem() {
        this.isTyping = false;

        if (this.showSuggestBox == false) return;

        // select prev result
        if (this.selectedItem > 0) {
            this.query = this.suggestResult[--this.selectedItem].name;
        } else {
            // reset text to orginal
            this.query = this.backupSearchText;
            this.selectedItem = -1;
        }

        this.highlightItem(this.selectedItem);
    }

    getNextItem() {
        this.isTyping = false;

        if (this.showSuggestBox == false) {
            // reshow suggestion box if user press key down arrow in searchbox
            if (this.query != undefined && this.query.trim() != '') {
                this.typingMode();    
            }

            return;
        }
        
        // backup the text
        if (this.selectedItem == -1) {
            this.backupSearchText = this.query;
        }

        // select next result
        if (this.suggestResult != undefined &&
            this.suggestResult.length > 0) {

            // reset highlight position to none
            if (this.selectedItem >= this.suggestResult.length - 1) {
                this.selectedItem = -1;
            }

            this.query = this.suggestResult[++this.selectedItem].name;
            this.highlightItem(this.selectedItem);
        }
    }

    highlightItem(index: number) {
        for (let i = 0; i < this.suggestResult.length; i++) {
            this.suggestResult[i].highlighted = i == index;
        }
    }

    goSearch(word?: string) {
        this.query = word || this.query;

        // enter on highlight item in box
        if (this.selectedItem > -1) {
            const highlighted = this.suggestResult[this.selectedItem];
            this.leaveSuggestBox();
            this.goExplore(highlighted.name);
            return;
        } else {
            if (this.query != undefined &&
                this.query.trim().length > 0) {
                this.leaveSuggestBox();
                this.router.navigate(['search', this.query]);
            }
        }
        // Close suggest box after 100ms
    }

    goExplore(word?: string) {
        if (word) {
            this.query = word.trim();
            const params: { [k: string]: any } = {};
            params.query = this.query;

            this.router.navigate(['explore'], { queryParams : params }); 
        }
    }

}