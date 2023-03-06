import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Offer } from './../../models/Offer';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { OfferService } from './../../services/offer.service';
import { CatalogService } from './../../services/catalog.service';
import { CategoryService } from './../../services/category.service';
import { CouponService } from './../../services/coupon.service';
import { Catalog } from './../../models/Catalog';
import { map, Observable, of, startWith } from 'rxjs';
import { Category } from './../../models/Category';
import { Coupon } from './../../models/Coupon';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.scss']
})
export class CreateOfferComponent {
  public catalogStep = this._formBuilder.group({
    catalogCtrl: ['', Validators.required],
  });
  public categoryStep = this._formBuilder.group({
    categoryCtrl: ['', Validators.required],
  });
  public offerStep = this._formBuilder.group({
    offerCtrl: ['', Validators.required],
  });

  catalogs: Catalog[] = [];
  filteredCatalogs: Observable<Catalog[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredCategories: Observable<string[]>;
  selectedCategories: string[] = [];
  allCategories: string[] = [];
  @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;

  offer: Offer = <Offer>{};
  offerCategories: Category[] = [];

  couponCtrl = new FormControl<string | Coupon>('');
  couponOptions: Coupon[] = [];
  filteredCoupons: Observable<Coupon[]>;
  selectedCoupon: Coupon;

  constructor(private _formBuilder: FormBuilder
    , private offerService: OfferService
    , private catalogService: CatalogService
    , private categoryService: CategoryService
    , private couponService: CouponService) {
  }

  ngOnInit(): void {
    this.catalogService.findAll().subscribe(
      response => {
        this.catalogs = response
        this.filteredCatalogs = of(this.catalogs);
    });

    this.couponService.findAll().subscribe(
      response => {
        this.couponOptions = response
        this.filteredCoupons = of(this.couponOptions);
    });
  }

  filterCatalogs() {
    if (this.catalogStep.controls.catalogCtrl && this.catalogStep.controls.catalogCtrl.value) {
      this.filteredCatalogs = of(this.catalogs.filter(
        catalog => catalog.name.toLowerCase()
        .includes(this.catalogStep.controls.catalogCtrl.value != null ? this.catalogStep.controls.catalogCtrl.value.toLowerCase() : '')));
    } else {
      this.filteredCatalogs = of(this.catalogs);
    }
  }

  get(): void {
    this.categoryService.findAllByCatalogId(parseInt(sessionStorage.getItem('selectedCatalog'))).subscribe(
      (response) => {
        this.allCategories = response.map(category => category.name);
      }
    );

    this.filteredCategories = this.categoryStep.controls.categoryCtrl.valueChanges.pipe(
      startWith(null),
      map((category: string | null) => (category ? this.filterCategories(category) : this.allCategories.slice())),
    );
  }

  post(): void {
    this.getCategories(this.selectedCategories).subscribe((categories: Category[]) => {
      console.log(categories);

      this.offer.coupon = this.selectedCoupon;
      this.offer.categories = categories;
      this.offerService.create(this.offer);
    });
  }

  displayFn(catalog: Catalog): string {
    if (catalog && catalog.name) {
      sessionStorage.setItem('selectedCatalog', catalog.id.toString());
      return catalog.name;
    }
    return '';
  }

  remove(category: string): void {
    const index = this.selectedCategories.indexOf(category);

    if (index >= 0) {
      this.selectedCategories.splice(index, 1);
    }
    if(this.selectedCategories.length == 0) {
      this.categoryStep.controls.categoryCtrl.setValue('ok');
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {

    this.selectedCategories.push(event.option.viewValue);
    this.categoryInput.nativeElement.value = '';

    this.categoryStep.controls.categoryCtrl.setValue('ok');
  }

  private filterCategories(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allCategories.filter(category => category.toLowerCase().includes(filterValue));
  }

  private getCategories(categoriesName: string[]): Observable<Category[]> {
    return this.categoryService.findAll().pipe(
      map((response: Category[]) => {
        return response.filter((category: Category) => {
          return categoriesName.includes(category.name);
        });
      })
    );
  }

  displayCoupon(coupon: Coupon): string {
    return coupon && coupon.code ? coupon.code : '';
  }

  private filterCoupon(code: string): Coupon[] {
    const filterValue = code.toLowerCase();

    return this.couponOptions.filter(option => option.code.toLowerCase().includes(filterValue));
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedCoupon = event.option.value;
  }
}
