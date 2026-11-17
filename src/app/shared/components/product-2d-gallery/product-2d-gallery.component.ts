import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { TelemetryService } from '../../../core/services/telemetry.service';

@Component({
  selector: 'app-product-2d-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-2d-gallery.component.html',
  styleUrls: ['./product-2d-gallery.component.css']
})
export class Product2dGalleryComponent implements OnInit {
  @Input({ required: true }) product!: Product;
  @Input() heightClass: string = 'h-96 md:h-[500px]';

  public readonly activeImage = signal<string>('');
  public readonly activeIndex = signal<number>(0);
  public readonly isZooming = signal<boolean>(false);
  public readonly zoomPosition = signal<{ x: number; y: number }>({ x: 50, y: 50 });
  public readonly isFullscreen = signal<boolean>(false);

  constructor(private telemetryService: TelemetryService) {}

  ngOnInit(): void {
    if (this.product.images2D.gallery.length > 0) {
      this.activeImage.set(this.product.images2D.gallery[0]);
    }
  }

  selectImage(img: string, index: number): void {
    this.activeImage.set(img);
    this.activeIndex.set(index);
    this.telemetryService.recordGalleryView();
  }

  onMouseMove(e: MouseEvent): void {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    this.zoomPosition.set({ x, y });
    if (!this.isZooming()) {
      this.isZooming.set(true);
      this.telemetryService.recordZoom();
    }
  }

  onMouseLeave(): void {
    this.isZooming.set(false);
  }

  toggleFullscreen(): void {
    this.isFullscreen.update(v => !v);
  }
}
