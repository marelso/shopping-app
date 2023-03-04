import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', pathMatch:'full', redirectTo: 'home'
  },
  {
    path: 'home',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule)
  },
  {
    path: 'catalogs',
    loadChildren: () => import('./catalogs/catalogs.module').then(m => m.CatalogsModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule)
  }
  ,
  {
    path: 'offers',
    loadChildren: () => import('./offers/offers.module').then(m => m.OffersModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
