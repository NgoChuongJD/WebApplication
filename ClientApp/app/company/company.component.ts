import {
  Component,
  OnDestroy,
  HostListener,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '@app/company/company.service';
import {
  CompanyProfile,
  Instrument
} from '@app/core/models/company-profile-model';
import { HomeReportsItems } from '@app/home/home-reports/home-reports-items/home-reports-items';
import { UrlPrepareService } from '@app/core/services/url-prepare.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'arp-company',
  templateUrl: './company.component.html'
})
export class CompanyComponent implements OnDestroy {
  SUBCRIBE_TOOLTIP = 'Subscribe to receive email notifications from [companyName] when they release a new Annual Report to this website.';
  visit_IR_page = 'Visit their IR page';
  private scrollingEventListener: any;
  isShowPrevReport: boolean;
  isLoadDataCompleted = false;

  subcribed: boolean;
  companyCode: string;

  @ViewChild('report') report: ElementRef;

  companyProfile: CompanyProfile;
  marketData: Instrument[];
  latestReport: HomeReportsItems;

  constructor(
    private readonly route: ActivatedRoute,
    private companyService: CompanyService,
    private urlPrepareService: UrlPrepareService
  ) {
    // get anchor target
    this.route.params.subscribe(param => {
      this.isLoadDataCompleted = false;

      if (!param['companyCode']) {
        return;
      }

      this.companyCode = param['companyCode'];
      this.companyService
        .getCompanyProfile(this.companyCode)
        .subscribe(result => {
          this.companyProfile = result.company;
          this.companyProfile.companyNameEncoded = this.urlPrepareService.replaceSpecialCharacter(this.companyProfile.companyName);
          this.marketData = result.instruments;
          this.latestReport = result.latestReport;

          this.SUBCRIBE_TOOLTIP = this.SUBCRIBE_TOOLTIP.replace(
            '[companyName]',
            this.companyProfile.companyName
          );
          document.title = this.companyProfile.companyName;

          this.isLoadDataCompleted = true;
          window.scrollTo(0, 0);
        });
    });
  }

  ngOnDestroy(): void {
    this.scrollingEventListener = null;
  }

  @HostListener('window:scroll')
  showPrevReport(event: any) {
    if (!this.report) {
      return;
    }
    const reportPos = this.report.nativeElement.getBoundingClientRect();

    if (reportPos.top <= window.innerHeight && !this.isShowPrevReport) {
      this.isShowPrevReport = true;
    }
  }
}
