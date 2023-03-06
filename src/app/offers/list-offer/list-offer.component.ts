import { OfferService } from './../../services/offer.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { FormControl } from '@angular/forms';
import { UpdateOfferComponent } from './../update-offer/update-offer.component';
import { UpdateOffer } from './../../models/UpdateOffer';
import { Offer } from './../../models/Offer';
import { DeleteOfferComponent } from './../delete-offer/delete-offer.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-list-offer',
  templateUrl: './list-offer.component.html',
  styleUrls: ['./list-offer.component.scss']
})
export class ListOfferComponent {
  public filteredOffers: Offer[] = [];
  public searchControl = new FormControl('');

  public options: string[] = [];
  private optionsSubject = new Subject<string[]>();

  private unsubscribe$ = new Subject<void>();
  private offers: Offer[] = [];

  constructor(public dialog: MatDialog
    , private offersService: OfferService) {
  }

  ngOnInit() {
    this.offersService.findAll().subscribe(
      response => {
        this.offers = response
        this.optionsSubject.next(response.map(({ title }) => title));
        this.filteredOffers = this.offers;
      });
    this.optionsSubject.subscribe(options => {
      this.options = options;
    });

    this.offersService.offerCreated$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.offersService.findAll().subscribe(response => {
          this.offers = response;
          this.filteredOffers = this.offers;
          this.options = this.offers.map(({ title }) => title);
        });
      });

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  filterOffers() {
    if (this.searchControl && this.searchControl.value) {
      this.filteredOffers = this.offers.filter(
        catalog => catalog.title.toLowerCase()
        .includes(this.searchControl.value != null ? this.searchControl.value.toLowerCase() : ''));
    } else {
      this.filteredOffers = this.offers;
    }

    this.options = this.filteredOffers.map(({ title }) => title);
  }

  openUpdate(canBeUpdated: Offer) {
    let catalogId = canBeUpdated.categories[0].catalogId;
    let update: UpdateOffer = <UpdateOffer>{};
    update.catalogId = catalogId;
    update.currentOffer = canBeUpdated;

    const dialogRef = this.dialog.open(UpdateOfferComponent, {
      data: update
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result) {
        this.offersService.update(result)
          .subscribe(offers => {
            this.offers = offers;
            this.filteredOffers = this.offers;
            this.options = this.offers.map(({ title }) => title);
          });
      }
    });
  }

  openDelete(canBeDeleted: Offer): void {
    const dialogRef = this.dialog.open(DeleteOfferComponent, {
      data: canBeDeleted,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result) {
        this.offersService.delete(canBeDeleted.id)
          .subscribe(catalogs => {
            this.offers = catalogs;
            this.filteredOffers = catalogs;
            this.options = this.offers.map(({ title }) => title);
          });
        console.log(this.options);
      }
    });
  }
}
