import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InstagramGridComponent } from './instagram-grid.component';
import { BannerService } from '../../../core/services/banner.service';
import { SocialLinks } from '../../../core/models';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, InstagramGridComponent],
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  year = new Date().getFullYear();
  socialLinks: SocialLinks = {};

  constructor(
    public lang: LanguageService,
    private bannerService: BannerService
  ) { }

  ngOnInit(): void {
    this.bannerService.getSocialLinks().subscribe({
      next: (links) => (this.socialLinks = links),
      error: () => { }
    });
  }

  getWhatsAppLink(phone?: string): string {
    if (!phone) return '#';
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('968') || cleanPhone.length > 8) {
      return `https://wa.me/${cleanPhone}`;
    }
    return `https://wa.me/968${cleanPhone}`;
  }
}
