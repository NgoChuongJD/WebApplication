import { Component, OnInit, HostListener } from '@angular/core';
import { HomeReportsItems } from './home-reports-items';
import { HomeReportsItemsService } from './home-reports-items.service';
import { UrlPrepareService } from "@app/core/services/url-prepare.service";

@Component({
    selector: 'arp-home-reports-items',
    templateUrl: './home-reports-items.component.html'
})
export class HomeReportsItemsComponent implements OnInit {
    reports: HomeReportsItems[] = [];
    scriptPath: string = "";

    constructor(private readonly reportsService: HomeReportsItemsService,
        private readonly urlPrepareService: UrlPrepareService) {
       
    }

    ngOnInit(): void {
        this.reportsService.getReports().subscribe(result => {
            result.forEach(item => {
                item.companyNameEncoded = this.urlPrepareService.replaceSpecialCharacter(item.companyName);
                item.titleEncoded= this.urlPrepareService.replaceSpecialCharacter(item.title);
            }); 

            this.reports = result;
            const timer = setInterval(() => {
                const countImages = this.loadAllImages();
                if (countImages != 0) {
                    clearInterval(timer);
                }
            }, 250);
        });
    }

    private loadAllImages() {
        if (!this.reports || this.reports.length <= 0) {
            return 0;
        }

        var _t = this;
        let divImage = document.getElementsByClassName("report_image");
        let images = document.getElementsByClassName("img-portrait");
        let index_loaded = 0;

        for (let i = 0, l = images.length; i < l; i++) {
            let img = new Image();
            img.style.opacity = "0";
            document.body.appendChild(img);
            img.onerror = function (){                
                index_loaded++;
                console.log("error image is not loaded ");
                document.body.removeChild(img);
            }
            img.onload = function () {
                index_loaded++;
                if (index_loaded == l - 1) {
                    _t.setPositionCardReports();
                }
                document.body.removeChild(img);
            }
            img.src = (<HTMLImageElement>images[i]).src;
        }

        return divImage.length;
    }

    private setPositionCardReports() {
        // let home_report_content = document.getElementsByClassName("home-report-content")[0];
        let eles = document.getElementsByClassName("home-report-content-card");
        let sizes: any = [];
        let size_large = {
            h: 0, w: 0, t: 0, l: 0
        };
        let size_start = {
            h: 0, w: 0, t: 0, l: 0
        };
        let row = 1;
        let width = 0;
        let maxrow = 3;
        let landscape = false;
        if (window.innerWidth <= window.innerHeight) {
            width = window.innerWidth;
        } else {
            width = window.innerHeight;
            landscape = true;
        }
        for (let i = 0; i < eles.length; i++) {
            eles[i].className = "noTransition home-report-content-card home-report-content-portrait float-left";
            (<HTMLElement>eles[i].children[0].children[0]).style.paddingTop = 0 + "px";
            let size_node = {
                h: eles[i].children[0].children[0].children[0].children[0].clientHeight,
                w: eles[i].children[0].children[0].children[0].children[0].clientWidth,
                t: eles[i].getBoundingClientRect().top,
                l: eles[i].getBoundingClientRect().left,
            };
            if (size_node.w > size_node.h) {
                eles[i].className = "noTransition home-report-content-card home-report-content-landscape float-left";
                eles[i].children[0].children[0].children[0].children[0].className = "noTransition img-landscape";
                size_node = {
                    h: eles[i].children[0].children[0].children[0].children[0].clientHeight,
                    w: eles[i].children[0].children[0].children[0].children[0].clientWidth,
                    t: eles[i].getBoundingClientRect().top,
                    l: eles[i].getBoundingClientRect().left,
                };
            } else { }
            if (i === 0) {
                size_large = size_node;
                size_start = size_node;
            } else {
                if (size_large.h < size_node.h) {
                    size_large = size_node;
                }
                if (size_node.l === size_start.l) {
                    row++;
                }
            }
            if (width >= 312 && width < 599) {
                if (landscape) {
                    maxrow = 3;
                } else {
                    maxrow = 4;
                }
            } else if (width >= 600 && width < 1025) { } else if (width >= 1025) { }
            if (row > maxrow) {
                eles[i].className = eles[i].className + " noTransition hide";
                this.reports.pop();
            }
            sizes.push(size_node);
        }
        for (let i = 0; i < sizes.length; i++) {
            let img_par = eles[i].children[0].children[0].children[0];
            (<HTMLImageElement>img_par).style.paddingTop = (size_large.h - sizes[i].h) + "px";
        }
    };
    
    @HostListener("window:resize", ["$event"])
    onResize() {
        this.loadAllImages();
    };
}
