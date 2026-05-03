import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  template: `
    <section class="newsletter">
      <div class="container">
        <div class="newsletter-card">
          <div class="newsletter-content">
            <span class="badge">{{ 'NEWSLETTER' | translate }}</span>
            <h2>{{ 'JOIN_OUR_COMMUNITY' | translate }}</h2>
            <p>{{ 'NEWSLETTER_DESC' | translate }}</p>
            
            <form class="subscribe-form" (submit)="onSubmit($event)">
              <div class="input-group">
                <i class="uil uil-envelope-alt"></i>
                <input type="email" [placeholder]="'EMAIL_PLACEHOLDER' | translate" required>
                <button type="submit" class="btn-subscribe">
                  {{ 'SUBSCRIBE' | translate }}
                  <i class="uil uil-message"></i>
                </button>
              </div>
            </form>
          </div>
          <div class="newsletter-visual">
            <div class="floating-icons">
              <i class="uil uil-gift icon-1"></i>
              <i class="uil uil-percentage icon-2"></i>
              <i class="uil uil-truck icon-3"></i>
            </div>
            <div class="glow"></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .newsletter {
      padding: 6rem 0;
      background: #ffffff;
    }

    .newsletter-card {
      background: linear-gradient(135deg, var(--secondary) 0%, var(--secondary-dark) 100%);
      border-radius: 48px;
      padding: 4rem;
      display: flex;
      align-items: center;
      gap: 4rem;
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-xl);

      @media (max-width: 992px) {
        flex-direction: column;
        text-align: center;
        padding: 3rem 2rem;
        gap: 2rem;
      }
    }

    .newsletter-content {
      flex: 1.2;
      position: relative;
      z-index: 2;

      .badge {
        display: inline-block;
        padding: 0.5rem 1.25rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 100px;
        color: var(--primary);
        font-weight: 700;
        font-size: 0.85rem;
        margin-bottom: 1.5rem;
        text-transform: uppercase;
      }

      h2 {
        font-size: 3rem;
        font-weight: 900;
        color: #ffffff;
        margin-bottom: 1rem;
        letter-spacing: -0.02em;

        @media (max-width: 640px) { font-size: 2rem; }
      }

      p {
        font-size: 1.15rem;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 2.5rem;
        line-height: 1.6;
      }
    }

    .subscribe-form {
      .input-group {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        padding: 0.5rem;
        max-width: 500px;
        transition: all 0.3s ease;

        @media (max-width: 992px) { margin: 0 auto; }

        &:focus-within {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(43, 188, 191, 0.15);
        }

        i {
          font-size: 1.5rem;
          color: #ffffff;
          margin: 0 1rem;
          opacity: 0.6;
        }

        input {
          flex: 1;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 1rem;
          outline: none;
          padding: 0.75rem 0;

          &::placeholder { color: rgba(255, 255, 255, 0.4); }
        }

        .btn-subscribe {
          background: var(--primary);
          color: #ffffff;
          border: none;
          padding: 0.85rem 1.75rem;
          border-radius: 18px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;

          &:hover {
            background: var(--primary-dark);
            transform: scale(1.02);
          }

          @media (max-width: 480px) {
            padding: 0.75rem 1rem;
            span { display: none; }
          }
        }
      }
    }

    .newsletter-visual {
      flex: 1;
      position: relative;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;

      @media (max-width: 992px) { height: 200px; width: 100%; }

      .glow {
        position: absolute;
        width: 250px;
        height: 250px;
        background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
        opacity: 0.2;
        filter: blur(40px);
        animation: pulse 4s infinite alternate;
      }

      .floating-icons {
        position: relative;
        width: 100%;
        height: 100%;
        
        i {
          position: absolute;
          font-size: 3.5rem;
          color: rgba(255, 255, 255, 0.1);
          animation: float 6s infinite ease-in-out;
        }

        .icon-1 { top: 10%; left: 20%; animation-delay: 0s; }
        .icon-2 { bottom: 20%; right: 30%; animation-delay: 2s; }
        .icon-3 { top: 40%; right: 10%; animation-delay: 4s; }
      }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0); }
      50% { transform: translateY(-20px) rotate(10deg); }
    }

    @keyframes pulse {
      from { transform: scale(1); opacity: 0.2; }
      to { transform: scale(1.2); opacity: 0.3; }
    }
  `]
})
export class NewsletterComponent {
  onSubmit(e: Event) {
    e.preventDefault();
    // Logic here
  }
}
