import { UpdateCatalogComponent } from './../update-catalog/update-catalog.component';
import { DeleteCatalogComponent } from './../delete-catalog/delete-catalog.component';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CatalogService } from './../../services/catalog.service';
import { Catalog } from './../../models/Catalog';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-catalog',
  templateUrl: './list-catalog.component.html',
  styleUrls: ['./list-catalog.component.scss']
})
export class ListCatalogComponent {
  public searching: Boolean = false;
  public filteredCatalogs: Catalog[] = [];
  public myControl = new FormControl('');

  public options: string[] = [];
  private optionsSubject = new Subject<string[]>();

  private unsubscribe$ = new Subject<void>();
  private catalogs: Catalog[] = [];

  constructor(public dialog: MatDialog
    , private catalogService: CatalogService) {
  }

  ngOnInit() {
    this.catalogService.findAll().subscribe(
      response => {
        this.catalogs = response
        this.optionsSubject.next(response.map(({ name }) => name));
        this.filteredCatalogs = this.catalogs;
      });
    this.optionsSubject.subscribe(options => {
      this.options = options;
    });

    this.catalogService.catalogCreated$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.catalogService.findAll().subscribe(response => {
          this.catalogs = response;
          this.filteredCatalogs = this.catalogs;
          this.options = this.catalogs.map(({ name }) => name);
        });
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  filterCatalogs() {
    this.searching = true;
    if (this.myControl && this.myControl.value) {
      this.filteredCatalogs = this.catalogs.filter(
        catalog => catalog.name.toLowerCase()
        .includes(this.myControl.value != null ? this.myControl.value.toLowerCase() : ''));
    } else {
      this.filteredCatalogs = this.catalogs;
    }

    this.options = this.filteredCatalogs.map(({ name }) => name);
  }

  openUpdate(canBeUpdated: Catalog) {
    const dialogRef = this.dialog.open(UpdateCatalogComponent, {
      data: canBeUpdated,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.catalogService.update(canBeUpdated)
          .subscribe(catalogs => {
            this.catalogs = catalogs;
            this.filteredCatalogs = catalogs;
            this.options = this.catalogs.map(({ name }) => name);
          });
      }
    });
    this.searching = false;
  }

  openDelete(canBeDeleted: Catalog): void {
    const dialogRef = this.dialog.open(DeleteCatalogComponent, {
      data: canBeDeleted,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.catalogService.delete(canBeDeleted.id)
          .subscribe(catalogs => {
            this.catalogs = catalogs;
            this.filteredCatalogs = catalogs;
            this.options = this.catalogs.map(({ name }) => name);
          });
      }
    });
    this.searching = false;
  }
}
