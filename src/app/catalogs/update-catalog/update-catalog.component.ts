import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Catalog } from './../../models/Catalog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-update-catalog',
  templateUrl: './update-catalog.component.html',
  styleUrls: ['./update-catalog.component.scss']
})
export class UpdateCatalogComponent {
  updatedCatalog: Catalog = <Catalog>{ };

  constructor(
    public dialogRef: MatDialogRef<UpdateCatalogComponent>,
    @Inject(MAT_DIALOG_DATA) public currentCatalog: Catalog
  ) {}

  update() {
    this.currentCatalog.name = this.updatedCatalog.name;
    this.currentCatalog.description = this.updatedCatalog.description;
    this.dialogRef.close(this.currentCatalog);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
