import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxEchartsModule } from "ngx-echarts";
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AccordionModule } from "ngx-bootstrap/accordion";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { NgxMaskModule } from "ngx-mask";
import { islemlerRoutingModule } from "./islemler-routing";
import { ImageCropperModule } from "ngx-image-cropper";

import { stokKartIslemleriComponent } from "./stokKartIslemleri/stokKartIslemleri";
import { bayiIslemleriComponent } from "./bayiIslemleri/bayiIslemleri";

import { FormDirective } from "./islemler-directive";

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      islemlerRoutingModule,
      CKEditorModule,
      NgbModule,
      NgxEchartsModule,
      ImageCropperModule,
      NgxMaskModule.forRoot(),
      PaginationModule.forRoot(),
      AccordionModule.forRoot()
    ],
    declarations: [
      stokKartIslemleriComponent,
      bayiIslemleriComponent,
      FormDirective
    ]
  })
  
  export class islemlerModule {}