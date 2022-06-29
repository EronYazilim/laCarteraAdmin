import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { AccordionModule } from "ngx-bootstrap/accordion";
import { PaginationModule } from "ngx-bootstrap/pagination";

import { anasayfaRoutingModule } from './anasayfa-routing'
import { NgxEchartsModule } from 'ngx-echarts'
import { NgxMaskModule} from 'ngx-mask'

import { anasayfaComponent } from './anasayfa/anasayfa'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    anasayfaRoutingModule,
    NgxEchartsModule,
    NgxMaskModule.forRoot(),
    PaginationModule.forRoot(),
    AccordionModule.forRoot()
  ],
  declarations: [
    anasayfaComponent
  ]
})

export class anasayfaModule {}