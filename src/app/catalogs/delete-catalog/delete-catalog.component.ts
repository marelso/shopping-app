import { Catalog } from './../../models/Catalog';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-catalog',
  templateUrl: './delete-catalog.component.html',
  styleUrls: ['./delete-catalog.component.scss']
})
export class DeleteCatalogComponent {
  verifyName: string = '';
  checked: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteCatalogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Catalog
  ) {}

  verifyDelete() {
    if(this.verifyName === this.data.name && this.checked) {
      this.dialogRef.close(true);
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
