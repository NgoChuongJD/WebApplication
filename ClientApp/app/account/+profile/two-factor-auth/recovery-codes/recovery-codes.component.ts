import { Component, OnInit, Input } from '@angular/core';
import { DataService, NotificationsService } from '@app/core';

@Component({
  selector: 'arp-recovery-codes',
  templateUrl: './recovery-codes.component.html'
})
export class RecoveryCodesComponent implements OnInit {
  @Input() model: ITwoFactorModel;

  constructor(private dataService: DataService, private ns: NotificationsService) { }

  ngOnInit() { }

  disableTwoFactorWarning() {
    this.dataService.post('api/manage/disable2fa')
      .subscribe(() => {
        this.ns.success('Two factor authentication disabled');
      });
  }

  generateRecoveryCodes() {
    this.dataService.post<string[]>('api/manage/generaterecoverycodes')
      .subscribe(codes => {
        this.ns.success('Recovery codes are', codes.join('|'));
      });
  }

}
