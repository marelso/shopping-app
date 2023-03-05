import { Category } from './../../models/Category';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-delete-category',
  templateUrl: './delete-category.component.html',
  styleUrls: ['./delete-category.component.scss']
})
export class DeleteCategoryComponent {
  verifyName: string = '';
  checked: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category
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
