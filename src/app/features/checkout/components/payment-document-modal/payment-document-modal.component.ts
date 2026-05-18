import { SharedModule } from '../../../../shared/shared.module';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../core/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [CommonModule, SharedModule],
  selector: 'app-payment-document-modal',
  templateUrl: './payment-document-modal.component.html',
  styleUrls: ['./payment-document-modal.component.scss'],
})
export class PaymentDocumentModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<{ base64: string; name: string; size: string; rawFile?: File }>();

  isDragOver = false;
  fileBase64: string | null = null;
  fileName = '';
  fileSize = '';
  isImage = true;
  rawFile: File | null = null;

  constructor(
    private notify: NotificationService,
    private translate: TranslateService
  ) { }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File): void {
    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      this.notify.error(this.translate.instant('FILE_TOO_LARGE') || 'File size exceeds 5MB limit');
      return;
    }

    this.fileName = file.name;
    this.fileSize = this.formatBytes(file.size);
    this.isImage = file.type.startsWith('image/');
    this.rawFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.fileBase64 = reader.result as string;
    };
    reader.onerror = () => {
      this.notify.error(this.translate.instant('FILE_READ_ERROR') || 'Error reading file');
    };
    reader.readAsDataURL(file);
  }

  formatBytes(bytes: number, decimals = 2): string {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }

  clearFile(): void {
    this.fileBase64 = null;
    this.fileName = '';
    this.fileSize = '';
    this.isImage = true;
    this.rawFile = null;
  }

  onCancel(): void {
    this.clearFile();
    this.close.emit();
  }

  onSubmit(): void {
    if (this.fileBase64) {
      this.confirmed.emit({
        base64: this.fileBase64,
        name: this.fileName,
        size: this.fileSize,
        rawFile: this.rawFile || undefined
      });
      this.clearFile();
    }
  }
}
