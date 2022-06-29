import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxEchartsModule } from "ngx-echarts";
import { NgxMaskModule } from "ngx-mask";
import { kayitlarRoutingModule } from "./kayitlar-routing";
import { kullaniciKayitlariComponent } from "./kullaniciKayitlari/kullaniciKayitlari";

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      kayitlarRoutingModule,
      NgbModule,
      NgxEchartsModule,
      NgxMaskModule.forRoot(),
      PaginationModule.forRoot(),
      AccordionModule.forRoot()
    ],
    declarations: [
      kullaniciKayitlariComponent
    ]
  })
  
  export class kayitlarModule {}