import { formatDate } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { BreadcrumpService } from "src/app/core/services/breadcrump.service";
import { webServisIslemCalistir } from "src/app/ISLEM";
import { SharedAnimations } from "src/app/shared/animations/shared-animations";

@Component({
    selector: 'app-satisKayitlari',
    templateUrl: './satisKayitlari.html',
    animations: [SharedAnimations]
})

export class satisKayitlariComponent implements OnInit {
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

    @ViewChild('modalBayi') modalBayi: ElementRef

    modalHeader = { title: '' }

    filterData = {
        ARAMA       : '',
        SS          : 1,
        KS          : 15,
        e_durum     : '',
        e_bayi_id   : '',
        e_bayi_adi  : '',
        TARIH_BAS   : '',
        TARIH_SON   : '',
        ESKI_ID     : ''
    }

    bayiFilterData = {
        ARAMA   : '',
        SS      : 1,
        KS      : 15,
        e_durum : '',
        ESKI_ID : ''
    }

    mainLoader = false
    bayiLoader = false

    satisListesi
    bayiKayitlari

    ngOnInit() {
        this.titleService.setTitle("laCartera | Satış Kayıtları")
        this.bs.change(["Kayıtlar", "Satış Kayıtları"])

        this.bayiKayitlariListele()
        this.satisListele()
    }
    
    
    modalAc(content, size) {
        this.modalConfig.size = size
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
    }

    async satisListele() {
        this.mainLoader = true
        this.satisListesi = await this.islem.WebServisSorguSonucu("GET", "satisIslemleri/satisListesi", this.filterData)
        if (Object.keys(this.satisListesi).length == 0) { this.satisListesi = null}
        this.mainLoader = false

    }

    async bayiKayitlariListele(): Promise<void> {
        this.bayiLoader = true
        this.bayiKayitlari = await this.islem.WebServisSorguSonucu("GET", "bayiIslemleri/bayiListesi", this.bayiFilterData)
        if (Object.keys(this.bayiKayitlari).length == 0) { this.bayiKayitlari = null }
        this.bayiLoader = false
    }

    bayiFiltreleButton() {
        this.modalHeader.title = 'Bayi Listesi'
        this.modalAc(this.modalBayi, 'lg')
    }

    bayiSec(secilenBayi) {
        this.filterData.e_bayi_id = secilenBayi.e_id
        this.filterData.e_bayi_adi = secilenBayi.e_bayi_adi
        this.satisListele()
        this.modalService.dismissAll()
    }
}