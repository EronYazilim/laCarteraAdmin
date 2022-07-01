import { Component, OnInit } from '@angular/core'
import { webServisIslemCalistir } from '../../../ISLEM'
import { BreadcrumpService } from '../../../core/services/breadcrump.service'
import { Title } from '@angular/platform-browser'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-anasayfa',
  templateUrl: './anasayfa.html'
})

export class anasayfaComponent implements OnInit {
  constructor(
    public islem : webServisIslemCalistir,
    private toastr: ToastrService,
    private bs: BreadcrumpService,
    private titleService: Title
  ) { }

  siparisListesiFilterData = {
    ARAMA   : '',
    SS      : 1,
    KS      : 15,
    e_durum : '',
    ESKI_ID : ''
  }

  satisListesi
  siparisListesi

  siparisLoader = false
  satisLoader = false

  ngOnInit() {
    this.titleService.setTitle("laCartera | Anasayfa")
    this.bs.change([])

    this.siparisListele()
    this.satisListele()
  }

  async siparisListele() {
    this.siparisLoader  = true
    this.siparisListesi = await this.islem.WebServisSorguSonucu("GET", "siparisIslemleri/siparisListesi", this.siparisListesiFilterData)
    if (Object.keys(this.siparisListesi).length == 0) { this.siparisListesi = null}
    this.siparisLoader = false
  }

  async satisListele() {
    this.satisLoader  = true
    this.satisListesi = await this.islem.WebServisSorguSonucu("GET", "siparisIslemleri/siparisListesi", this.siparisListesiFilterData)
    if (Object.keys(this.satisListesi).length == 0) { this.satisListesi = null}
    this.satisLoader = false
  }

}