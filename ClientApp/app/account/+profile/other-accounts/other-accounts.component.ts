import { Component, OnInit } from '@angular/core';
import { DataService } from '@app/core';

@Component({
  selector: 'arp-other-accounts',
  templateUrl: './other-accounts.component.html'
})
export class OtherAccountsComponent implements OnInit {

  public logins: ISocialLogins[];
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getLogins();
  }

  private getLogins() {
    this.dataService.get<ISocialLogins[]>('api/manage/getlogins')
      .subscribe(logins => this.logins = logins);
  }
}
