import { Category } from './../../models/Category';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild } from '@angular/core';

import { Catalog } from './../../models/Catalog';
import { CatalogService } from './../../services/catalog.service';
import { CategoryService } from './../../services/category.service';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent {
  public panelOpenState = false;
  public category: Category = <Category>{};
  public selectedCatalogs: string[] = [];
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public filteredCatalogs: Observable<string[]>;
  public catalogCtrl = new FormControl('');

  private availableCatalogs: Catalog[] = <Catalog[]>{};
  private allCatalogsName: string[] = [];

  @ViewChild('catalogInput') catalogInput: ElementRef<HTMLInputElement>;

  constructor(private catalogService: CatalogService
    , private categoryService: CategoryService) {
    this.catalogService.findAll().subscribe(
      response => {
        this.availableCatalogs = response;
      });

    this.filteredCatalogs = this.catalogCtrl.valueChanges.pipe(
      startWith(null),
      map((catalog: string | null) => (catalog ? this._filter(catalog) : this.allCatalogsName.slice())),      );
  }

  ngOnInit() {
    this.catalogService.findAll().subscribe(
      response => {
        this.availableCatalogs = response;
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    this.allCatalogsName = this.availableCatalogs.map( c => c.name);
    console.log(this.allCatalogsName);

    return this.allCatalogsName.filter(catalog => catalog.toLowerCase().includes(filterValue));
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedCatalogs.push(event.option.viewValue);
    this.catalogInput.nativeElement.value = '';
    this.catalogCtrl.setValue(null);
  }

  remove(catalog: string): void {
    const index = this.selectedCatalogs.indexOf(catalog);

    if (index >= 0) {
      this.selectedCatalogs.splice(index, 1);
    }
  }

  save():void {
    this.selectedCatalogs.forEach(
      (value) => {
        console.log(value)
        this.category.catalogId = this.availableCatalogs.find(c => c.name === value).id;
        this.categoryService.create(this.category);
      }
    )
  }
}
