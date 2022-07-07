import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
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

    modalHeader = { title: '' }

    filterData = {
        ARAMA   : '',
        SS      : 1,
        KS      : 15,
        e_durum : '',
        ESKI_ID : ''
    }

    mainLoader = false

    siparisListesi
    secilenKayit

    ngOnInit() {
        this.titleService.setTitle("laCartera | Sipariş Kayıtları")
        this.bs.change(["Kayıtlar", "Sipariş Kayıtları"])

        this.siparisListele()
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

    siparisDetayAc(secilenKayit) {
        this.secilenKayit = secilenKayit
        this.modalHeader.title = 'Sipariş Detayları'
        this.modalAc(this.modalSiparisDetaylari, 'lg')
    }
}