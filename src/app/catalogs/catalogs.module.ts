import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CatalogsRoutingModule } from './catalogs-routing.module';
import { CatalogsComponent } from './catalogs.component';
import { ListCatalogComponent } from './list-catalog/list-catalog.component';
import { CreateCatalogComponent } from './create-catalog/create-catalog.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DeleteCatalogComponent } from './delete-catalog/delete-catalog.component';
import { UpdateCatalogComponent } from './update-catalog/update-catalog.component';

@NgModule({
  declarations: [
    CatalogsComponent,
    CreateCatalogComponent,
    ListCatalogComponent,
    DeleteCatalogComponent,
    UpdateCatalogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CatalogsRoutingModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatCheckboxModule
  ]
})
export class CatalogsModule { }
