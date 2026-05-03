import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';

interface FAQ {
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
  open?: boolean;
}

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent {
  faqs: FAQ[] = [
    {
      question_ar: 'كيف يمكنني تتبع طلبي؟',
      question_en: 'How can I track my order?',
      answer_ar: 'يمكنك تتبع طلبك من خلال الانتقال إلى صفحة "طلباتي" في حسابك الشخصي والضغط على رقم الطلب.',
      answer_en: 'You can track your order by going to the "My Orders" page in your personal account and clicking on the order number.'
    },
    {
      question_ar: 'ما هي سياسة الاسترجاع؟',
      question_en: 'What is the return policy?',
      answer_ar: 'يمكنك إرجاع المنتجات خلال 14 يوماً من تاريخ الاستلام بشرط أن تكون في حالتها الأصلية.',
      answer_en: 'You can return products within 14 days of receipt, provided they are in their original condition.'
    },
    {
      question_ar: 'هل تتوفر خدمة الدفع عند الاستلام؟',
      question_en: 'Is cash on delivery available?',
      answer_ar: 'نعم، نوفر خدمة الدفع عند الاستلام لجميع محافظات سلطنة عمان.',
      answer_en: 'Yes, we provide cash on delivery service for all governorates of the Sultanate of Oman.'
    }
  ];

  constructor(public lang: LanguageService) {}

  toggleFaq(faq: FAQ) {
    faq.open = !faq.open;
  }
}
