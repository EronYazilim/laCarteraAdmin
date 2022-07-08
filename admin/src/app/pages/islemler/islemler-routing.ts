import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { bayiIslemleriComponent } from "./bayiIslemleri/bayiIslemleri";
import { stokKartIslemleriComponent } from "./stokKartIslemleri/stokKartIslemleri";

const routes: Routes = [
  {
  path: 'stokKartIslemleri',
  component: stokKartIslemleriComponent
  }, {
    path: 'bayiIslemleri',
    component: bayiIslemleriComponent
  }
];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  
  export class islemlerRoutingModule { }