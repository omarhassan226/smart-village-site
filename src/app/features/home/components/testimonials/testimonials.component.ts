import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../../core/services/language.service';

interface Testimonial {
  name_ar: string;
  name_en: string;
  role_ar: string;
  role_en: string;
  comment_ar: string;
  comment_en: string;
  rating: number;
  image: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent {
  testimonials: Testimonial[] = [
    {
      name_ar: 'أحمد الفارسي',
      name_en: 'Ahmed Al Farsi',
      role_ar: 'عميل دائم',
      role_en: 'Regular Customer',
      comment_ar: 'تجربة تسوق رائعة، المنتجات أصلية والجودة تفوق التوقعات. خدمة التوصيل كانت سريعة جداً في مسقط.',
      comment_en: 'Great shopping experience, authentic products and quality exceeds expectations. Delivery was very fast in Muscat.',
      rating: 5,
      image: 'assets/images/user1.jpg'
    },
    {
      name_ar: 'سارة البلوشي',
      name_en: 'Sara Al Balushi',
      role_ar: 'مصممة جرافيك',
      role_en: 'Graphic Designer',
      comment_ar: 'أفضل متجر لملحقات الحواسب في عمان. اشتريت شاشة وطابعة وكان التعامل احترافي للغاية.',
      comment_en: 'Best computer accessories store in Oman. I bought a monitor and printer, and the service was very professional.',
      rating: 5,
      image: 'assets/images/user2.jpg'
    },
    {
      name_ar: 'محمد الهنائي',
      name_en: 'Mohammed Al Hinai',
      role_ar: 'رائد أعمال',
      role_en: 'Entrepreneur',
      comment_ar: 'الأسعار منافسة جداً والخدمة ممتازة. الموقع سهل الاستخدام وسرعة الرد على الاستفسارات مذهلة.',
      comment_en: 'Very competitive prices and excellent service. The website is easy to use and the response to inquiries is amazing.',
      rating: 4,
      image: 'assets/images/user3.jpg'
    }
  ];

  constructor(public lang: LanguageService) {}
}
