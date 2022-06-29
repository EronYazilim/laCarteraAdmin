import { MenuItem } from './menu.model'

export const MENU: MenuItem[] = [
	{
		label: 'Anasayfa',
		icon: 'ri-home-4-line',
		link: '/anasayfa'
	}, {
		label: 'Kayıtlar',
		icon: 'ri-user-3-line',
		subItems: [{
			label: 'Kullanıcı Kayıtları',
			link: './kayitlar/kullaniciKayitlari'
		}]
	}, {
		label: 'İşlemler',
		icon: 'fas fa-cubes lg-icon',
		subItems: [{
			label: 'Stok Kart İşlemleri',
			link: './islemler/stokKartIslemleri'
		}, {
			label: 'Bayi İşlemleri',
			link: './islemler/bayiIslemleri'
		}]
	}
]
	



