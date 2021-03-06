import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { girisComponent } from './oturum/giris/giris'
import { AuthGuard } from './core/guards/auth.guard'

import { LayoutComponent } from './layouts/layout/layout.component'

const adminRoutes: Routes = [
  {
    path: 'anasayfa', 
    loadChildren: () => import('./pages/anasayfa/anasayfa').then(m => m.anasayfaModule)
  }, {
    path: 'kayitlar',
    loadChildren: () => import('./pages/kayitlar/kayitlar').then(m => m.kayitlarModule)
  }, {
    path: 'islemler',
    loadChildren: () => import('./pages/islemler/islemler').then(m => m.islemlerModule)
  }
]

const routes: Routes = [{
  path: '',
  redirectTo: 'anasayfa',
  pathMatch: 'full'
}, {
  path: '',
  component: girisComponent,
  children: [{
    path: 'giris',
    loadChildren: () => import('./oturum/oturum').then(m => m.oturumModule)
  }]
}, {
  path: '',
  children: [{
    path: 'hata',
    loadChildren: () => import('./extrapages/extrapages.module').then(m => m.ExtrapagesModule)
  }]
}, {
  path: '',
  component: LayoutComponent,
  canActivate: [AuthGuard],
  children: adminRoutes
}, {
  path: '**',
  redirectTo: 'hata/404'
}]

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }