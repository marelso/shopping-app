import { DeleteCategoryComponent } from './../delete-category/delete-category.component';
import { UpdateCategoryComponent } from './../update-category/update-category.component';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from './../../services/category.service';
import { takeUntil, Subject } from 'rxjs';
import { Category } from './../../models/Category';
import { Component } from '@angular/core';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss']
})
export class ListCategoryComponent {
  public filteredCategories: Category[] = [];
  public myControl = new FormControl('');

  public options: string[] = [];
  private optionsSubject = new Subject<string[]>();

  private unsubscribe$ = new Subject<void>();
  private categories: Category[] = [];

  constructor(public dialog: MatDialog
    , private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.categoryService.findAll().subscribe(
      response => {
        this.categories = response
        this.optionsSubject.next(response.map(({ name }) => name));
        this.filteredCategories = this.categories;
      });
    this.optionsSubject.subscribe(options => {
      this.options = options;
    });

    this.categoryService.catalogCreated$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.categoryService.findAll().subscribe(response => {
          this.categories = response;
          this.filteredCategories = this.categories;
          this.options = this.categories.map(({ name }) => name);
        });
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  filterCatalogs() {
    if (this.myControl && this.myControl.value) {
      this.filteredCategories = this.categories.filter(
        catalog => catalog.name.toLowerCase()
        .includes(this.myControl.value != null ? this.myControl.value.toLowerCase() : ''));
    } else {
      this.filteredCategories = this.categories;
    }

    this.options = this.filteredCategories.map(({ name }) => name);
  }

  openUpdate(canBeUpdated: Category) {
    let catalogId = canBeUpdated.catalogId;
    const dialogRef = this.dialog.open(UpdateCategoryComponent, {
      data: canBeUpdated,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result) {
        canBeUpdated.catalogId = catalogId;
        this.categoryService.update(canBeUpdated)
          .subscribe(catalogs => {
            this.categories = catalogs;
            this.filteredCategories = catalogs;
            this.options = this.categories.map(({ name }) => name);
          });
      }
    });
  }

  openDelete(canBeDeleted: Category): void {
    const dialogRef = this.dialog.open(DeleteCategoryComponent, {
      data: canBeDeleted,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result) {
        this.categoryService.delete(canBeDeleted.id)
          .subscribe(catalogs => {
            this.categories = catalogs;
            this.filteredCategories = catalogs;
            this.options = this.categories.map(({ name }) => name);
          });
        console.log(this.options);
      }
    });
  }
}
