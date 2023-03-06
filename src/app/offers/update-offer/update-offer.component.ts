import { Offer } from './../../models/Offer';
import { Catalog } from './../../models/Catalog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { UpdateOffer } from './../../models/UpdateOffer';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CategoryService } from './../../services/category.service';
import { CouponService } from './../../services/coupon.service';
import { Observable, map, of, startWith } from 'rxjs';
import { Category } from './../../models/Category';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Coupon } from './../../models/Coupon';
import { Component, Inject, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-update-offer',
  templateUrl: './update-offer.component.html',
  styleUrls: ['./update-offer.component.scss']
})
export class UpdateOfferComponent {
  updatedOffer: Offer = <Offer>{ };
  currentOffer: Offer = <Offer>{};
  catalogId: number;

  catalogs: Catalog[] = [];
  public categoryStep = this._formBuilder.group({
    categoryCtrl: ['', Validators.required],
  });
  filteredCatalogs: Observable<Catalog[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredCategories: Observable<string[]>;
  selectedCategories: string[] = [];
  allCategories: string[] = [];
  @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;


  couponCtrl = new FormControl<string | Coupon>('');
  couponOptions: Coupon[] = [];
  filteredCoupons: Observable<Coupon[]>;
  selectedCoupon: Coupon;

  constructor(@Inject(MAT_DIALOG_DATA) public data: UpdateOffer
    , public dialogRef: MatDialogRef<UpdateOfferComponent>
    , private _formBuilder: FormBuilder
    , private categoryService: CategoryService
    , private couponService: CouponService) {

    this.catalogId = data.catalogId;
    this.currentOffer = data.currentOffer;
  }

  ngOnInit() {
    this.categoryService.findAllByCatalogId(this.catalogId).subscribe(
      (response) => {
        this.allCategories = response.map(category => category.name);
      }
    );

    this.filteredCategories = this.categoryStep.controls.categoryCtrl.valueChanges.pipe(
      startWith(null),
      map((category: string | null) => (category ? this.filterCategories(category) : this.allCategories.slice())),
    ); 

    this.couponService.findAll().subscribe(
      response => {
        this.couponOptions = response
        this.filteredCoupons = of(this.couponOptions);
    });
  }

  update(): void {
    this.updatedOffer.id = this.currentOffer.id;
    this.updatedOffer.coupon = this.selectedCoupon;

    this.getCategories(this.selectedCategories).subscribe((categories: Category[]) => {
      console.log(categories)
      this.updatedOffer.categories = categories;
      this.dialogRef.close(this.updatedOffer);
    });
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

  onNoClick(): void {
    this.dialogRef.close();
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

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedCoupon = event.option.value;
  }

  displayCoupon(coupon: Coupon): string {
    return coupon && coupon.code ? coupon.code : '';
  }
}
