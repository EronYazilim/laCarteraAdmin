import { Component, OnInit, ViewChild, ElementRef  } from "@angular/core";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { BreadcrumpService } from '../../../core/services/breadcrump.service'
import { Title } from '@angular/platform-browser'
import { FormGroup, FormControl } from '@angular/forms'
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
import { webServisIslemCalistir } from "src/app/ISLEM";
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ckUploadAdapter } from './ck-upload-adapter';
import { LocalStoreService } from "src/app/core/services/local-store.service"
import Swal from 'sweetalert2/dist/sweetalert2'
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as XLSX from 'xlsx';


@Component({
    selector: 'app-stokKartIslemleri',
    templateUrl: './stokKartIslemleri.html',
    animations: [SharedAnimations]
})

export class stokKartIslemleriComponent implements OnInit {
  constructor(
      public islem : webServisIslemCalistir,
      private toastr: ToastrService,
      private modalService: NgbModal,
      private bs: BreadcrumpService,
      private titleService: Title,
      private modalConfig: NgbModalConfig,
      private store: LocalStoreService,
      private hC: HttpClient
    ) { 
      modalConfig.backdrop = 'static'
      modalConfig.keyboard = false
      modalConfig.size = 'sm'
  }

  @ViewChild('modalStokKart') modalStokKart: ElementRef

  modalHeader = { title: '' }

  stokKartFormu = new FormGroup({
    islem                   : new FormControl(''),
    method                  : new FormControl(''),
    e_cinsiyet              : new FormControl(''),
    e_stok_kart_kodu        : new FormControl(''),
    e_stok_kart_adi         : new FormControl(''),
    e_stok_kart_aciklamasi  : new FormControl(''),
    e_fiyat_1               : new FormControl(''),
    e_fiyat_2               : new FormControl(''),
    e_fiyat_3               : new FormControl(''),
    e_resim_dosya_uzantisi  : new FormControl(''),
    e_durum                 : new FormControl(''),
    ESKI_ID                 : new FormControl('')
  })
  
  filterData = {
  ARAMA   : '',
  SS      : 1,
  KS      : 15,
  e_durum : ''
  }
  
  requestData
  responseData
  mainLoader = false

  stokKartTanimlari
  
  duzenlenenResim
  secilenResim

  islemiKaydetBtn = false
  silinenKayitBtn = [false]

  MAIN_URL
  MAIN_PORT_URL

  ngOnInit() {
    this.MAIN_URL = "https://test.eronsoftware.com:5770";
    this.titleService.setTitle("laCartera | Stok Kart İşlemleri")
    this.bs.change(["İşlemler", "Stok Kart İşlemleri"])

    this.stokKartKayitlariListele()
  }

  modalAc(content, size) {
    this.modalConfig.size = size
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
  }

  async stokKartKayitlariListele(): Promise<void> {
    this.mainLoader = true
    this.stokKartTanimlari = await this.islem.WebServisSorguSonucu("GET", "stokKartIslemleri/stokKartListesi", this.filterData)
    if (Object.keys(this.stokKartTanimlari).length == 0) { this.stokKartTanimlari = null }
    this.mainLoader = false
  }
  
  ekleButton() {
    this.stokKartFormu.patchValue({
      islem                     : 'stokKartIslemleri/stokKartEkle',
      method                    : 'POST',
      e_cinsiyet                : '',
      e_stok_kart_kodu          : '',
      e_stok_kart_adi           : '',
      e_stok_kart_aciklamasi    : '',
      e_fiyat_1                 : '',
      e_fiyat_2                 : '',
      e_fiyat_3                 : '',
      e_resim_dosya_uzantisi    : '',
      e_durum                   : ''
    })
    this.secilenResim = ''
    this.duzenlenenResim = ''
    this.modalHeader.title = 'Yeni Stok Kart Ekleme Formu'
    this.modalAc(this.modalStokKart, 'xl')
  }
  
  duzenleButton(secilenKayit) {
    this.stokKartFormu.patchValue({
      islem                   : 'stokKartIslemleri/stokKartDuzenle',
      method                  : 'PUT',
      e_cinsiyet              : secilenKayit.e_cinsiyet,
      e_stok_kart_kodu        : secilenKayit.e_stok_kart_kodu,
      e_stok_kart_adi         : secilenKayit.e_stok_kart_adi,
      e_stok_kart_aciklamasi  : secilenKayit.e_stok_kart_aciklamasi,
      e_fiyat_1               : secilenKayit.e_fiyat_1,
      e_fiyat_2               : secilenKayit.e_fiyat_2,
      e_fiyat_3               : secilenKayit.e_fiyat_3,
      e_resim_dosya_uzantisi  : secilenKayit.e_resim_dosya_uzantisi,
      e_durum                 : secilenKayit.e_durum,
      ESKI_ID                 : secilenKayit.e_id
    })
    this.secilenResim = ''
    this.duzenlenenResim = this.MAIN_URL + '/admin/uploads/stokKartIslemleri/' + secilenKayit.e_resim_uniq_id + '.' + secilenKayit.e_resim_dosya_uzantisi
    this.modalHeader.title = 'Stok Kart Düzenleme Formu'
    this.modalAc(this.modalStokKart, 'xl')
  }

  async islemiKaydet(): Promise<void> {
    if (this.stokKartFormu.valid) {
      this.islemiKaydetBtn = true

      this.requestData = Object.assign({}, this.stokKartFormu.value)
      this.responseData = await this.islem.WebServisSorguSonucu(this.requestData.method, this.requestData.islem, this.requestData)

      if (this.responseData[0].S == "T") {
        if (this.duzenlenenResim) {
          fetch(this.duzenlenenResim)
          .then(res => res.blob())
          .then(blob => {
            var formdata = new FormData()
            var file = new File([blob], this.responseData[0].UID + "." + this.requestData.e_resim_dosya_uzantisi)
            formdata.append("dosyalar", file)
            this.cropperResimYukle(formdata)
          })
        } else {
          this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
          // this.stokKartKayitlariListele()
          this.modalService.dismissAll()
          this.stokKartKayitlariListele()
        }
      } else {
        this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
      }
      this.islemiKaydetBtn = false
    }
  }
  
  silButton(secilenKayit, islem) {
    Swal.fire({
      title: 'Stok Kart Kaydı Silinecek!',
      text: "Stok Kart kaydını sistemden kalıcı olarak silmek istediğinize emin misiniz ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      confirmButtonColor: '#c49c5c',
      cancelButtonText: 'İptal',
      cancelButtonColor: '#222'
    }).then((result) => {
      if (result.isConfirmed) {
        this.kayitSil(secilenKayit, islem)
      }
    })
  }

  async kayitSil(secilenKayit, islem): Promise<void> {
    this.silinenKayitBtn[secilenKayit.e_id] = true
    this.responseData = await this.islem.WebServisSorguSonucu("DELETE", islem, { ESKI_ID: secilenKayit.e_id })

    if ((this.responseData[0].S) == "T") {
      this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
      const i = this.stokKartTanimlari.indexOf(secilenKayit)
      if (i > -1) {
        this.stokKartTanimlari.splice(i, 1)
        if (this.stokKartTanimlari.length == 0) { this.stokKartTanimlari = null }
      }
    } else {
        this.toastr.error(this.responseData[0].MESAJ, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
        this.silinenKayitBtn[secilenKayit.e_id] = false
    }
  }

  //CKEDİTOR

  public Editor = DecoupledEditor;
  public editorReady( editor ) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    )

    editor.plugins.get('FileRepository').createUploadAdapter = ( loader ) => {
      return new ckUploadAdapter(loader);
    }

    if( editor.model.schema.isRegistered('image')){
      editor.model.schema.extend('image')
    }
  }
  
  editor_config = {
    language: 'tr',
    toolbar: {
      items: [ 'heading',
        '|', 'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
        '|', 'bold', 'italic', 'underline', 'strikethrough',
        '|', 'alignment', 'bulletedList', 'numberedList',
        '|', 'outdent', 'indent', 'blockQuote',
        '|', 'link', 'imageUpload', 'mediaEmbed', 'insertTable',
        '|', 'undo', 'redo'
      ]
    }
  }

  //  DOSYA YUKLEME


  fileChangeEvent(event: any): void {
    this.stokKartFormu.patchValue({
      e_resim_dosya_uzantisi: event.target.files[0].name.split(".").pop()
    })
    this.secilenResim = event
  }

  imageCropped(event: ImageCroppedEvent) {
    this.duzenlenenResim = event.base64
  }

  loadImageFailed() {
    this.toastr.error('Lütfen geçerli bir resim dosyası seçin.', 'Dosya Geçersiz !', { timeOut: 3000, closeButton: true, progressBar: true })
    this.duzenlenenResim = ''
  }

  async cropperResimYukle(formData): Promise<void> {
    var httpOptions = {
      headers: new HttpHeaders({
        "islem" : "STOK_KART_YUKLE",
        "utoken": JSON.parse(window.localStorage.getItem("laCartera_admin_kullanici_token"))
      })
    }

    await this.hC.post(this.MAIN_URL + '/admin/stokKartUpload/', formData, httpOptions).subscribe(
      data => {
        this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
        this.modalService.dismissAll()
        this.stokKartKayitlariListele()
      }, error => {
        this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
        this.toastr.error(error, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
        this.modalService.dismissAll()
      }
    )
  }

}