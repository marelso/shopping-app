import { Category } from './../../models/Category';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss']
})
export class UpdateCategoryComponent {
  updatedCategory: Category = <Category>{ };

  constructor(public dialogRef: MatDialogRef<UpdateCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public currentCategory: Category) {
  }

  update() {
    this.currentCategory.name = this.updatedCategory.name;
    this.currentCategory.description = this.updatedCategory.description;
    this.currentCategory.priority = this.updatedCategory.priority;
    this.currentCategory.catalogId = this.updatedCategory.catalogId;
    this.dialogRef.close(this.currentCategory);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
