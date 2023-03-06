import { HttpClient } from '@angular/common/http';
import { Offer } from './../models/Offer';
import { switchMap, take, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private readonly url = 'http://localhost:8080/offers';

  private offerCreatedSubject = new Subject<void>();

  constructor(private http: HttpClient) { }

  findAll() {
    return this.http.get<Offer[]>(this.url);
  }

  delete(offerId: number) {
    return this.http.delete(`${this.url}/${offerId}`)
      .pipe(
        take(1),
        switchMap(() => this.findAll())
      );
  }

  create(offer: Offer) {
    return this.http.post(this.url, offer)
      .pipe(
        take(1),
        switchMap(() => {
          this.offerCreatedSubject.next();
          return this.findAll();
        })
      ).subscribe();
  }

  update(offer: Offer) {
    return this.http.put(`${this.url}/${offer.id}`, offer)
      .pipe(
        take(1),
        switchMap(() => this.findAll())
      );
  }

  get offerCreated$() {
    return this.offerCreatedSubject.asObservable();
  }
}
