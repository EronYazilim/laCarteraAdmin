import { Component, OnInit, ViewChild, ElementRef  } from "@angular/core";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";
import { BreadcrumpService } from '../../../core/services/breadcrump.service'
import { Title } from '@angular/platform-browser'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
import { webServisIslemCalistir } from "src/app/ISLEM";
import Swal from 'sweetalert2/dist/sweetalert2'

@Component({
    selector: 'app-bayiKullaniciIslemleri',
    templateUrl: './bayiKullaniciIslemleri.html',
    animations: [SharedAnimations]
})

export class bayiKullaniciIslemleriComponent implements OnInit {
    constructor(
        public islem : webServisIslemCalistir,
        private toastr: ToastrService,
        private modalService: NgbModal,
        private bs: BreadcrumpService,
        private titleService: Title,
        private modalConfig: NgbModalConfig,
    ) { 
        modalConfig.backdrop = 'static'
        modalConfig.keyboard = false
        modalConfig.size = 'sm'
    }

    @ViewChild('modalBayiKullanici') modalBayiKullanici: ElementRef
    @ViewChild('modalBayiSec') modalBayiSec: ElementRef

    modalHeader = { title: '' }

    bayiKullaniciKayitlariFormu = new FormGroup({
        islem       : new FormControl(''),
        method      : new FormControl(''),
        e_bayi_id   : new FormControl(''),
        e_bayi_adi  : new FormControl(''),
        e_kull_adi  : new FormControl(''),
        e_sifre     : new FormControl(''),
        e_durum     : new FormControl(''),
        ESKI_ID     : new FormControl('')
    })
  
    bayiKayitlariFilterData = {
        ARAMA   : '',
        SS      : 1,
        KS      : 15,
        e_durum : ''
    }
  
    filterData = {
        ARAMA   : '',
        SS      : 1,
        KS      : 15,
        e_durum : ''
    }

    requestData
    responseData
    mainLoader = false
    bayiLoader = false

    bayiKayitlari
    bayiKullaniciKayitlari

    islemiKaydetBtn = false
    silinenKayitBtn = [false]
    secilenKayitBtn = [false]

    ngOnInit() {
        this.titleService.setTitle("laCartera | Bayi Kullanıcı İşlemleri")
        this.bs.change(["İşlemler", "Bayi Kullanıcı İşlemleri"])

        this.bayiKullaniciKayitlariListele()
        this.bayiKayitlariListele()
    }

    modalAc(content, size) {
        this.modalConfig.size = size
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
    }

    async bayiKayitlariListele(): Promise<void> {
        this.bayiLoader = true
        this.bayiKayitlari = await this.islem.WebServisSorguSonucu("GET", "bayiIslemleri/bayiListesi", this.bayiKayitlariFilterData)
        if (Object.keys(this.bayiKayitlari).length == 0) { this.bayiKayitlari = null }
        this.bayiLoader = false
    }

    async bayiKullaniciKayitlariListele(): Promise<void> {
        this.mainLoader = true
        this.bayiKullaniciKayitlari = await this.islem.WebServisSorguSonucu("GET", "bayiKullaniciIslemleri/kullaniciListesi", this.filterData)
        if (Object.keys(this.bayiKullaniciKayitlari).length == 0) { this.bayiKullaniciKayitlari = null }
        this.mainLoader = false
    }
    
    ekleButton() {
        this.bayiKullaniciKayitlariFormu.patchValue({
            islem       : 'bayiKullaniciIslemleri/kullaniciEkle',
            method      : 'POST',
            e_bayi_id   : '',
            e_bayi_adi  : '',
            e_kull_adi  : '',
            e_sifre     : '',
            e_durum     : '',
        })
        this.modalHeader.title = 'Yeni Bayi Ekleme Formu'
        this.modalAc(this.modalBayiKullanici, 'md')
    }

    bayiEkleButton() {
        this.modalAc(this.modalBayiSec, 'xl')
    }

    duzenleButton(secilenKayit) {
    this.bayiKullaniciKayitlariFormu.patchValue({
        islem       : 'bayiKullaniciIslemleri/kullaniciDuzenle',
        method      : 'PUT',
        e_bayi_id   : secilenKayit.e_bayi_id,
        e_bayi_adi  : secilenKayit.e_bayi_adi,
        e_kull_adi  : secilenKayit.e_kull_adi,
        e_sifre     : secilenKayit.e_sifre,
        e_durum     : secilenKayit.e_durum,
        ESKI_ID     : secilenKayit.e_id
    })
    this.modalHeader.title = 'Bayi Düzenleme Formu'
    this.modalAc(this.modalBayiKullanici, 'md')
    }

    async islemiKaydet(): Promise<void> {
        if (this.bayiKullaniciKayitlariFormu.valid) {
            this.islemiKaydetBtn = true

            this.requestData = Object.assign({}, this.bayiKullaniciKayitlariFormu.value)
            this.responseData = await this.islem.WebServisSorguSonucu(this.requestData.method, this.requestData.islem, this.requestData)

            if (this.responseData[0].S == "T") {
            this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.bayiKullaniciKayitlariListele()
            this.modalService.dismissAll()
            } else {
            this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
            }

            this.islemiKaydetBtn = false
        }
    }

    silButton(secilenKayit, islem) {
    Swal.fire({
        title: 'Bayi Kullanıcı Kaydı Silinecek!',
        text: "Bayi Kulllanıcı kaydını sistemden kalıcı olarak silmek istediğinize emin misiniz ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Evet, Sil',
        confirmButtonColor: '#7D3923',
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
        const i = this.bayiKullaniciKayitlari.indexOf(secilenKayit)
        if (i > -1) {
        this.bayiKayitlari.splice(i, 1)
        if (this.bayiKullaniciKayitlari.length == 0) { this.bayiKullaniciKayitlari = null }
        this.silinenKayitBtn[secilenKayit.e_id] = false
        }
    } else {
        this.toastr.error(this.responseData[0].MESAJ, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
        this.silinenKayitBtn[secilenKayit.e_id] = false
    }
        this.bayiKullaniciKayitlariListele()
    }

    bayiSecButton(secilenBayi) {

        this.secilenKayitBtn[secilenBayi.e_id] = true
        this.bayiKullaniciKayitlariFormu.patchValue({
            e_bayi_id      : secilenBayi.e_id,
            e_bayi_adi     : secilenBayi.e_bayi_adi
        })
        // document.getElementById("musteriSecBtnModalKapat").click()
        this.secilenKayitBtn[secilenBayi.e_id] = false
    }
}