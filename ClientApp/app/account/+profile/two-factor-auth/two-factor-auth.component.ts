import { Component, OnInit } from '@angular/core';

import { DataService } from '@app/core';


@Component({
  selector: 'arp-two-factor-auth',
  templateUrl: './two-factor-auth.component.html'
})
export class TwoFactorAuthComponent implements OnInit {

  public enableAuthenticator: boolean;
  public model: ITwoFactorModel;
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.get2fModel();
  }

  private get2fModel() {
    this.dataService.post<ITwoFactorModel>('api/manage/twofactorauthentication')
      .subscribe(res => this.model = res);
  }
}
