import { HttpClient } from '@angular/common/http';
import { switchMap, take, Subject } from 'rxjs';
import { Category } from './../models/Category';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly url = 'http://localhost:8080/categories';

  private catalogCreatedSubject = new Subject<void>();

  constructor(private http: HttpClient) { }

  findAll() {
    return this.http.get<Category[]>(this.url);
  }

  delete(catalogId: number) {
    return this.http.delete(`${this.url}/${catalogId}`)
      .pipe(
        take(1),
        switchMap(() => this.findAll())
      );
  }

  create(catalog: Category) {
    return this.http.post(this.url, catalog)
      .pipe(
        take(1),
        switchMap(() => {
          this.catalogCreatedSubject.next();
          return this.findAll();
        })
      ).subscribe();
  }

  update(catalog: Category) {
    return this.http.put(`${this.url}/${catalog.id}`, catalog)
      .pipe(
        take(1),
        switchMap(() => this.findAll())
      );
  }

  get catalogCreated$() {
    return this.catalogCreatedSubject.asObservable();
  }

  findAllByCatalogId(catalogId: number) {
    return this.http.get<Category[]>(this.url + `?catalogId=${catalogId}`);
  }
}
