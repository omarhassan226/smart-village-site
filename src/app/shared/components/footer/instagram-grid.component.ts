import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-instagram-grid',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="instagram-widget">
      <h4 class="widget-title">{{ 'FOLLOW_US_INSTAGRAM' | translate }}</h4>
      <div class="instagram-grid">
        <div class="insta-item" *ngFor="let item of images">
          <a href="https://www.instagram.com/1sudus" target="_blank" rel="noopener">
            <img [src]="'assets/images/' + item.src" alt="Instagram Post">
            <div class="insta-overlay">
              <div class="insta-stats">
                <i class="uil uil-heart"></i>
                <span>{{ item.likes }}</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .instagram-widget {
      .widget-title {
        color: #fff;
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        padding-bottom: 8px;
        border-bottom: 2px solid var(--primary);
        display: inline-block;
      }
    }

    .instagram-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .insta-item {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      aspect-ratio: 1;

      a {
        display: block;
        height: 100%;
        width: 100%;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }

      .insta-overlay {
        position: absolute;
        inset: 0;
        background: rgba(15, 23, 42, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(2px);
      }

      .insta-stats {
        background: rgba(255, 255, 255, 0.95);
        padding: 6px 14px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--secondary);
        font-size: 0.85rem;
        font-weight: 800;
        transform: translateY(15px);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);

        i {
          color: #ff4d4d;
          font-size: 1.1rem;
        }
      }

      &:hover {
        img { transform: scale(1.15) rotate(2deg); }
        .insta-overlay { opacity: 1; }
        .insta-stats { transform: translateY(0); }
      }
    }

    @media (max-width: 576px) {
      .instagram-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  `]
})
export class InstagramGridComponent {
  images = [
    { src: 'insta1.jpg', likes: '1.2k' },
    { src: 'insta2.jpg', likes: '850' },
    { src: 'insta3.jpg', likes: '2.1k' },
    { src: 'insta4.jpg', likes: '1.5k' },
    { src: 'insta5.jpg', likes: '920' },
    { src: 'insta1.jpg', likes: '3.4k' }
  ];
}
