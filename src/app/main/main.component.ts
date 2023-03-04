import { CouponsComponent } from './../coupons/coupons.component';
import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  constructor(private _couponSheet: MatBottomSheet) {}

  openCouponSheet(): void {
    this._couponSheet.open(CouponsComponent);
  }
}
