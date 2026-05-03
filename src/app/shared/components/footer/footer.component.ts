import { Component } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InstagramGridComponent } from './instagram-grid.component';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, InstagramGridComponent],
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  year = new Date().getFullYear();
  constructor(public lang: LanguageService) { }
}
