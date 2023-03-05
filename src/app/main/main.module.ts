import { CouponsModule } from './../coupons/coupons.module';
import { CouponsComponent } from './../coupons/coupons.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    CouponsModule,
    MatCardModule,
    MatIconModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class MainModule { }
