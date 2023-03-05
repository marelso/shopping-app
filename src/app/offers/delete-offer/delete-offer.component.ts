import { Offer } from './../../models/Offer';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-delete-offer',
  templateUrl: './delete-offer.component.html',
  styleUrls: ['./delete-offer.component.scss']
})
export class DeleteOfferComponent {
  verifyName: string = '';
  checked: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteOfferComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Offer
  ) {}

  verifyDelete() {
    if(this.verifyName === this.data.title && this.checked) {
      this.dialogRef.close(true);
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
