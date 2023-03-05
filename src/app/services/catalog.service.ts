import { HttpClient } from '@angular/common/http';
import { Catalog } from './../models/Catalog';
import { switchMap, take, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private readonly url = 'http://localhost:8080/catalogs';

  private catalogCreatedSubject = new Subject<void>();

  constructor(private http: HttpClient) { }

  findAll() {
    return this.http.get<Catalog[]>(this.url);
  }

  delete(catalogId: number) {
    return this.http.delete(`${this.url}/${catalogId}`)
      .pipe(
        take(1),
        switchMap(() => this.findAll())
      );
  }

  create(catalog: Catalog) {
    return this.http.post(this.url, catalog)
      .pipe(
        take(1),
        switchMap(() => {
          this.catalogCreatedSubject.next();
          return this.findAll();
        })
      ).subscribe();
  }

  update(catalog: Catalog) {
    return this.http.put(`${this.url}/${catalog.id}`, catalog)
      .pipe(
        take(1),
        switchMap(() => this.findAll())
      );
  }

  get catalogCreated$() {
    return this.catalogCreatedSubject.asObservable();
  }
}
