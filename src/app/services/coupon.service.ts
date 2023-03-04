import { Coupon } from './../models/Coupon';
import { Injectable } from '@angular/core';
import { Subject, switchMap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private readonly url = 'http://localhost:8080/coupons';

  private couponCreatedSubject = new Subject<void>();

  constructor(private http: HttpClient) { }

  findAll() {
    return this.http.get<Coupon[]>(this.url);
  }

  delete(couponId: number) {
    return this.http.delete(`${this.url}/${couponId}`)
      .pipe(
        take(1),
        switchMap(() => this.findAll())
      );
  }

  create(coupon: Coupon) {
    return this.http.post(this.url, coupon)
      .pipe(
        take(1),
        switchMap(() => {
          this.couponCreatedSubject.next();
          return this.findAll();
        })
      ).subscribe();
  }

  update(coupon: Coupon) {
    return this.http.put(`${this.url}/${coupon.id}`, coupon)
      .pipe(
        take(1),
        switchMap(() => this.findAll())
      );
  }

  get couponCreated$() {
    return this.couponCreatedSubject.asObservable();
  }
}
