import { CouponService } from './../../services/coupon.service';
import { Coupon } from './../../models/Coupon';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { takeUntil, Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-list-coupon',
  templateUrl: './list-coupon.component.html',
  styleUrls: ['./list-coupon.component.scss']
})
export class ListCouponComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  @ViewChild('input') myInput: ElementRef;
  updatedCoupon: Coupon = <Coupon>{};

  editStates: boolean[] = [];
  coupons: Coupon[] = [];
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions: number[] = [5];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private couponService: CouponService) {}

  ngOnInit() {
    this.getCoupons();
    this.editStates = this.coupons.map(() => false);
  }

  getCoupons() {
    this.couponService.findAll().subscribe(
      response => {
        this.coupons = response;
        this.paginator.length = this.coupons.length;
      });

    this.couponService.couponCreated$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.couponService.findAll().subscribe(response => {
          this.coupons = response;
          this.paginator.length = this.coupons.length;
        });
      });
  }

  onPageChanged(event) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  getCouponsForCurrentPage() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.coupons.slice(startIndex, endIndex);
  }

  update(coupon: Coupon): void {
    this.updatedCoupon.id = coupon.id
    this.updatedCoupon.code = this.myInput.nativeElement.value;
    this.couponService.update(this.updatedCoupon)
          .subscribe(response => {
            this.coupons = response;
            this.paginator.length = this.coupons.length;
          });
  }

  delete(coupon: Coupon): void {
    this.couponService.delete(coupon.id)
    .subscribe(response => {
      this.coupons = response;
      this.paginator.length = this.coupons.length;
    });
  }
}
