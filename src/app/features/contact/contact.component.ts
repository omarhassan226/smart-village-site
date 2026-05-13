import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { BannerService } from '../../core/services/banner.service';
import { SocialLinks } from '../../core/models/banner.model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  socialLinks: SocialLinks = {};

  constructor(
    private fb: FormBuilder,
    public lang: LanguageService,
    private bannerService: BannerService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.bannerService.getSocialLinks().subscribe({
      next: (res) => {
        this.socialLinks = res;
      }
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Form Submitted', this.contactForm.value);
      // Logic to send message
      this.contactForm.reset();
      alert('Message sent successfully!');
    }
  }
}
