import { Coupon } from './../../models/Coupon';
import { CouponService } from './../../services/coupon.service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.scss']
})
export class CreateCouponComponent {
  public couponControl = new FormControl('', [Validators.required]);
  public coupon: Coupon = <Coupon>{};

  couponForm: FormGroup;

  constructor( private fb: FormBuilder,
     private couponService: CouponService) {}

  ngOnInit() {
    this.couponForm = this.fb.group({
      code: ['', Validators.required]
    });
  }

  create(): void {
    this.couponService.create(this.coupon);
  }
}
