import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { kullaniciKayitlariComponent } from "./kullaniciKayitlari/kullaniciKayitlari";
import { satisKayitlariComponent } from "./satisKayitlari/satisKayitlari";
import { siparisKayitlariComponent } from "./siparisKayitlari/siparisKayitlari";

const routes: Routes = [{
  path: 'kullaniciKayitlari',
  component: kullaniciKayitlariComponent
  }, {
    path: 'siparisKayitlari',
    component: siparisKayitlariComponent
  }, {
    path: 'satisKayitlari',
    component: satisKayitlariComponent
  }];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  
  export class kayitlarRoutingModule { }