import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { BannerService } from '../../core/services/banner.service';
import { SocialLinks } from '../../core/models/banner.model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  socialLinks: SocialLinks = {};

  constructor(
    public lang: LanguageService,
    private bannerService: BannerService
  ) {}

  ngOnInit(): void {
    this.bannerService.getSocialLinks().subscribe({
      next: (res) => {
        this.socialLinks = res;
      }
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
