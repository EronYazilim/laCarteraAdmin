import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { filter } from "rxjs/operators";
import { BreadcrumpService } from "src/app/core/services/breadcrump.service";
import { webServisIslemCalistir } from "src/app/ISLEM";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";

@Component({
    selector: 'app-siparisKayitlari',
    templateUrl: './siparisKayitlari.html',
    animations: [SharedAnimations]
})

export class siparisKayitlariComponent implements OnInit {
    constructor(
        public islem : webServisIslemCalistir,
        private toastr: ToastrService,
        private modalService: NgbModal,
        private bs: BreadcrumpService,
        private titleService: Title,
        private modalConfig: NgbModalConfig
    ) { 
        modalConfig.backdrop = 'static'
        modalConfig.keyboard = false
        modalConfig.size = 'sm'
    }

    @ViewChild('modalSiparisDetaylari') modalSiparisDetaylari: ElementRef

    siparisFormu = new FormGroup({
        islem   :   new FormControl(''),
        method  :   new FormControl(''),
        e_durum :   new FormControl(''),
        ESKI_ID :   new FormControl(''),
    })

    modalHeader = { title: '' }

    filterData = {
        ARAMA   : '',
        SS      : 1,
        KS      : 15,
        e_durum : '',
        ESKI_ID : ''
    }

    requestData
    responseData
    mainLoader = false
    ozetLoader = false
    islemiKaydetBtn

    siparisListesi
    siparisOzetSayilar
    secilenKayit
    siparisDurumu

    ngOnInit() {
        this.titleService.setTitle("laCartera | Sipariş Kayıtları")
        this.bs.change(["Kayıtlar", "Sipariş Kayıtları"])

        this.siparisListele()
        this.siparisOzetSayilarListele()
    }

    modalAc(content, size) {
        this.modalConfig.size = size
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
    }
    
    async siparisListele() {
        this.mainLoader = true
        this.siparisListesi = await this.islem.WebServisSorguSonucu("GET", "siparisIslemleri/siparisListesi", this.filterData)
        if (Object.keys(this.siparisListesi).length == 0) { this.siparisListesi = null}
        this.mainLoader = false

    }
    
    async siparisOzetSayilarListele() {
        this.ozetLoader = true
        this.siparisOzetSayilar = await this.islem.WebServisSorguSonucu("GET", "siparisIslemleri/siparisListesiOzetSayilar", { })
        if (Object.keys(this.siparisOzetSayilar).length == 0) { this.siparisOzetSayilar = null}
        this.ozetLoader = false

    }

    siparisGuncelle(secilenKayit) {
        this.secilenKayit = secilenKayit

        this.siparisFormu.patchValue({
        islem   :   'siparisIslemleri/siparisDurumGuncelle',
        method  :   'PUT',
        e_durum :   secilenKayit.e_durum,
        ESKI_ID :   secilenKayit.e_id,
        })
        this.modalHeader.title = 'Sipariş Detayları'
        this.modalAc(this.modalSiparisDetaylari, 'lg')
    }

    async islemiKaydet(): Promise<void> {
    if (this.siparisFormu.valid) {
        this.islemiKaydetBtn = true
        this.requestData = Object.assign({}, this.siparisFormu.value)
        this.responseData = await this.islem.WebServisSorguSonucu(this.requestData.method, this.requestData.islem, this.requestData)

        if (this.responseData[0].S == "T") {
            this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
            this.siparisListele()
            this.modalService.dismissAll()
        } else {
            this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
        }
        }
        this.islemiKaydetBtn = false
    }

    filtreliListele(secilenDurum) {
        this.filterData.e_durum = secilenDurum
        this.siparisListele()
    }
}