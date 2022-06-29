import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { bayiIslemleriComponent } from "./bayiIslemleri/bayiIslemleri";
import { bayiKullaniciIslemleriComponent } from "./bayiKullaniciIslemleri/bayiKullaniciIslemleri";
import { stokKartIslemleriComponent } from "./stokKartIslemleri/stokKartIslemleri";

const routes: Routes = [
  {
  path: 'stokKartIslemleri',
  component: stokKartIslemleriComponent
  }, {
    path: 'bayiIslemleri',
    component: bayiIslemleriComponent
  }, {
    path: 'bayiKullaniciIslemleri',
    component: bayiKullaniciIslemleriComponent
  }
];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  
  export class islemlerRoutingModule { }