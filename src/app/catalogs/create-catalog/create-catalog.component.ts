import { Catalog } from './../../models/Catalog';
import { CatalogService } from './../../services/catalog.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-create-catalog',
  templateUrl: './create-catalog.component.html',
  styleUrls: ['./create-catalog.component.scss']
})
export class CreateCatalogComponent {
  public panelOpenState = false;
  public catalog: Catalog = <Catalog>{};

  constructor( private catalogService: CatalogService) {}

  doPost() {
    this.catalogService.create(this.catalog);
  }
}
