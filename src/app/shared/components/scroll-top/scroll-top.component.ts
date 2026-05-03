import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-top',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scroll-top" [class.active]="isVisible" (click)="scrollToTop()">
      <svg class="progress-circle" width="100%" height="100%" viewBox="-1 -1 102 102">
        <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" 
              [style.strokeDashoffset]="strokeOffset"></path>
      </svg>
      <i class="uil uil-arrow-up"></i>
    </div>
  `,
  styles: [`
    .scroll-top {
      position: fixed;
      right: 30px;
      bottom: 30px;
      height: 50px;
      width: 50px;
      cursor: pointer;
      display: block;
      border-radius: 50px;
      box-shadow: inset 0 0 0 2px rgba(43, 188, 191, 0.1);
      z-index: 10000;
      opacity: 0;
      visibility: hidden;
      transform: translateY(15px);
      transition: all 0.3s ease;
      background: #fff;

      &.active {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 22px;
        color: var(--primary, #2bbcbf);
        transition: all 0.3s ease;
      }

      .progress-circle {
        path {
          fill: none;
          stroke: var(--primary, #2bbcbf);
          stroke-width: 4;
          stroke-linecap: round;
          stroke-dasharray: 307.919, 307.919;
          transition: all 0.3s linear;
        }
      }

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 10px 20px rgba(43, 188, 191, 0.2);
        
        i { color: var(--primary-dark); }
      }
    }

    [dir='rtl'] .scroll-top {
      right: auto;
      left: 30px;
    }
  `]
})
export class ScrollTopComponent implements OnInit {
  isVisible = false;
  strokeOffset = 307.919;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Visibility
    this.isVisible = scrollPos > 200;

    // Progress
    const progress = 307.919 - (scrollPos * 307.919 / height);
    this.strokeOffset = progress;
  }

  ngOnInit(): void {}

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
