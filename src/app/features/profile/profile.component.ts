import { SharedModule } from '../../shared/shared.module';
import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  constructor(
    public auth: AuthService,
    public lang: LanguageService,
    private router: Router
  ) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
