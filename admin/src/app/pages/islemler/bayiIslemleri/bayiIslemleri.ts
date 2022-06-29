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
    selector: 'app-bayiIslemleri',
    templateUrl: './bayiIslemleri.html',
    animations: [SharedAnimations]
})

export class bayiIslemleriComponent implements OnInit {
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

    @ViewChild('modalBayi') modalBayi: ElementRef
    @ViewChild('modalBayiKullanici') modalBayiKullanici: ElementRef
    @ViewChild('modalBayiSec') modalBayiSec: ElementRef
    @ViewChild('modalBayiKullaniciTablo') modalBayiKullaniciTablo: ElementRef

    modalHeader = { title: '' }

    bayiKayitlariFormu = new FormGroup({
    islem               : new FormControl(''),
    method              : new FormControl(''),
    e_bayi_kodu         : new FormControl(''),
    e_bayi_adi          : new FormControl(''),
    e_yetkilisi         : new FormControl(''),
    e_il                : new FormControl(''),
    e_ilce              : new FormControl(''),
    e_fiyat_politikasi  : new FormControl('', [Validators.maxLength(1)]),
    e_iskonto_orani     : new FormControl('', [Validators.max(100), Validators.min(0)]),
    e_durum             : new FormControl(''),
    ESKI_ID             : new FormControl('')
    })

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
  
    filterData = {
        ARAMA   : '',
        SS      : 1,
        KS      : 15,
        e_durum : '',
        ESKI_ID : ''
    }

    bayiKullaniciKayitlariFilterData = {
        ARAMA   : '',
        SS      : 1,
        KS      : 15,
        e_durum : '',
        ESKI_ID : ''
    }

    requestData
    responseData
    mainLoader = false
    kullaniciLoader = false

    bayiKayitlari
    bayiKullaniciKayitlari

    secilenBayi
    islemiKaydetBtn = false
    islemiKaydetBtnBayi = false
    silinenKayitBtn = [false]
    silinenKayitBtnBayi = [false]

    ngOnInit() {
        this.titleService.setTitle("laCartera | Bayi İşlemleri")
        this.bs.change(["İşlemler", "Bayi İşlemleri"])

        this.bayiKayitlariListele()
        this.bayiKullaniciKayitlariListele()
    }

    modalAc(content, size) {
        this.modalConfig.size = size
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
    }

    async bayiKayitlariListele(): Promise<void> {
        this.mainLoader = true
        this.bayiKayitlari = await this.islem.WebServisSorguSonucu("GET", "bayiIslemleri/bayiListesi", this.filterData)
        if (Object.keys(this.bayiKayitlari).length == 0) { this.bayiKayitlari = null }
        this.mainLoader = false
    }

    async bayiKullaniciKayitlariListele(): Promise<void> {
        this.kullaniciLoader = true
        this.bayiKullaniciKayitlari = await this.islem.WebServisSorguSonucu("GET", "bayiKullaniciIslemleri/kullaniciListesi", this.bayiKullaniciKayitlariFilterData)
        if (Object.keys(this.bayiKullaniciKayitlari).length == 0) { this.bayiKullaniciKayitlari = null }
        this.kullaniciLoader = false
    }

    ekleButton() {
    this.bayiKayitlariFormu.patchValue({
        islem                   : 'bayiIslemleri/bayiEkle',
        method                  : 'POST',
        e_bayi_kodu             : '',
        e_bayi_adi              : '',
        e_yetkilisi             : '',
        e_il                    : '',
        e_ilce                  : '',
        e_fiyat_politikasi      : '',
        e_iskonto_orani         : '',
        e_durum                 : ''
    })
    this.modalHeader.title = 'Yeni Bayi Ekleme Formu'
    this.modalAc(this.modalBayi, 'md')
    }

    bayiKullanicilariTablosu(secilenBayi) {
        this.secilenBayi = secilenBayi
        this.bayiKullaniciKayitlariFilterData.ESKI_ID = secilenBayi.e_id
        this.bayiKullaniciKayitlariListele()
        this.bayiKullaniciKayitlariFormu.patchValue({
            e_bayi_id : secilenBayi.e_id,
            e_bayi_adi : secilenBayi.e_bayi_adi
        })
        this.modalAc(this.modalBayiKullaniciTablo, 'xl')
    }

    bayiKullanicisiEkleButton() {
        this.bayiKullaniciKayitlariFormu.patchValue({
            islem       : 'bayiKullaniciIslemleri/kullaniciEkle',
            method      : 'POST',
            e_bayi_id   : this.secilenBayi.e_id,
            e_bayi_adi  : '',
            e_kull_adi  : '',
            e_sifre     : '',
            e_durum     : '',
        })
        this.modalHeader.title = 'Yeni Bayi Kullanıcısı Ekleme Formu'
        this.modalAc(this.modalBayiKullanici, 'md')
    }

    duzenleButton(secilenKayit) {
    this.bayiKayitlariFormu.patchValue({
        islem               : 'bayiIslemleri/bayiDuzenle',
        method              : 'PUT',
        e_bayi_kodu         : secilenKayit.e_bayi_kodu,
        e_bayi_adi          : secilenKayit.e_bayi_adi,
        e_yetkilisi         : secilenKayit.e_yetkilisi,
        e_il                : secilenKayit.e_il,
        e_ilce              : secilenKayit.e_ilce,
        e_fiyat_politikasi  : secilenKayit.e_fiyat_politikasi,
        e_iskonto_orani     : secilenKayit.e_iskonto_orani,
        e_durum             : secilenKayit.e_durum,
        ESKI_ID             : secilenKayit.e_id
    })
    this.modalHeader.title = 'Bayi Düzenleme Formu'
    this.modalAc(this.modalBayi, 'md')
    }

    bayiKullanicisiDuzenleButton(secilenKullanici) {
        this.bayiKullaniciKayitlariFormu.patchValue({
            islem       : 'bayiKullaniciIslemleri/kullaniciEkle',
            method      : 'POST',
            e_bayi_id   : secilenKullanici.e_bayi_id,
            e_bayi_adi  : secilenKullanici.e_bayi_adi,
            e_kull_adi  : secilenKullanici.e_kull_adi,
            e_sifre     : secilenKullanici.e_sifre,
            e_durum     : secilenKullanici.e_durum,
            ESKI_ID     : secilenKullanici.e_id,
        })
        this.modalHeader.title = 'Bayi Kullanıcısı Düzenleme Formu'
        this.modalAc(this.modalBayiKullanici, 'md')
    }

    async islemiKaydet(): Promise<void> {
        if (this.bayiKayitlariFormu.valid) {
            this.islemiKaydetBtn = true

            this.requestData = Object.assign({}, this.bayiKayitlariFormu.value)
            this.responseData = await this.islem.WebServisSorguSonucu(this.requestData.method, this.requestData.islem, this.requestData)

            if (this.responseData[0].S == "T") {
            this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.bayiKayitlariListele()
            this.modalService.dismissAll()
            } else {
            this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
            }

            this.islemiKaydetBtn = false
        }
    }

    async islemiKaydetBayi(): Promise<void> {
        if (this.bayiKullaniciKayitlariFormu.valid) {
            this.islemiKaydetBtnBayi = true

            this.requestData = Object.assign({}, this.bayiKullaniciKayitlariFormu.value)
            this.responseData = await this.islem.WebServisSorguSonucu(this.requestData.method, this.requestData.islem, this.requestData)

            if (this.responseData[0].S == "T") {
            this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.bayiKayitlariListele()
            this.modalService.dismissAll()
            } else {
            this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
            }

            this.islemiKaydetBtnBayi = false
        }
    }

    silButton(secilenKayit, islem) {
    Swal.fire({
        title: 'Bayi Kaydı Silinecek!',
        text: "Bayi kaydını sistemden kalıcı olarak silmek istediğinize emin misiniz ?",
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

    silButtonKullanici(secilenKullanici, islem) {
    Swal.fire({
        title: 'Bayi Kullanıcısı Silinecek!',
        text: "Bayi kullanıcısı kaydını sistemden kalıcı olarak silmek istediğinize emin misiniz ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Evet, Sil',
        confirmButtonColor: '#c49c5c',
        cancelButtonText: 'İptal',
        cancelButtonColor: '#222'
    }).then((result) => {
        if (result.isConfirmed) {
        this.kayitSilKullanici(secilenKullanici, islem)
        }
    })
    }

    async kayitSil(secilenKayit, islem): Promise<void> {
    this.silinenKayitBtn[secilenKayit.e_id] = true
    this.responseData = await this.islem.WebServisSorguSonucu("DELETE", islem, { ESKI_ID: secilenKayit.e_id })

    if ((this.responseData[0].S) == "T") {
        this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
        const i = this.bayiKayitlari.indexOf(secilenKayit)
        if (i > -1) {
        this.bayiKayitlari.splice(i, 1)
        this.silinenKayitBtn[secilenKayit.e_id] = false
            this.bayiKayitlariListele()
        if (this.bayiKayitlari.length == 0) { this.bayiKayitlari = null }
        }
    } else {
        this.toastr.error(this.responseData[0].MESAJ, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
        this.silinenKayitBtn[secilenKayit.e_id] = false
    }
    }

    async kayitSilKullanici(secilenKullanici, islem): Promise<void> {
        this.silinenKayitBtnBayi[secilenKullanici.e_id] = true
        this.responseData = await this.islem.WebServisSorguSonucu("DELETE", islem, { ESKI_ID: secilenKullanici.e_id })

    if ((this.responseData[0].S) == "T") {
        this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
        const i = this.bayiKayitlari.indexOf(secilenKullanici)
        if (i > -1) {
        this.bayiKullaniciKayitlari.splice(i, 1)
        this.silinenKayitBtnBayi[secilenKullanici.e_id] = false
        if (this.bayiKullaniciKayitlari.length == 0) { this.bayiKullaniciKayitlari = null }
        }
    } else {
        this.toastr.error(this.responseData[0].MESAJ, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
        this.silinenKayitBtnBayi[secilenKullanici.e_id] = false
    }
    this.bayiKullaniciKayitlariListele()

    }
}