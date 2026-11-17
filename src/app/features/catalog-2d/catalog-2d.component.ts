import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { Product2dGalleryComponent } from '../../shared/components/product-2d-gallery/product-2d-gallery.component';
import { TelemetryService } from '../../core/services/telemetry.service';
import { ExperimentService } from '../../core/services/experiment.service';

@Component({
  selector: 'app-catalog-2d',
  standalone: true,
  imports: [CommonModule, RouterModule, Product2dGalleryComponent],
  templateUrl: './catalog-2d.component.html'
})
export class Catalog2dComponent implements OnInit, OnDestroy {
  public readonly products = signal<Product[]>([]);
  public readonly selectedProduct = signal<Product | null>(null);
  public readonly addedToCartFeedback = signal<boolean>(false);
  public readonly buyNowFeedback = signal<boolean>(false);

  constructor(
    private productService: ProductService,
    private telemetryService: TelemetryService,
    private experimentService: ExperimentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.experimentService.setCurrentStep('catalog-2d');
    this.experimentService.markCatalogTested('2D');

    const prods = this.productService.getProducts();
    this.products.set(prods);
    if (prods.length > 0) {
      this.selectProduct(prods[0]);
    }
  }

  ngOnDestroy(): void {
    this.telemetryService.endTracking();
  }

  selectProduct(prod: Product): void {
    this.telemetryService.endTracking();
    this.selectedProduct.set(prod);
    this.telemetryService.startTracking(prod.id, '2D');
  }

  onAddToCart(): void {
    this.telemetryService.recordAddToCart();
    this.addedToCartFeedback.set(true);
    setTimeout(() => this.addedToCartFeedback.set(false), 2500);
  }

  onBuyNow(): void {
    this.telemetryService.recordBuyNow();
    this.buyNowFeedback.set(true);
    setTimeout(() => this.buyNowFeedback.set(false), 2500);
  }

  proceedToCatalog3D(): void {
    this.telemetryService.endTracking();
    this.experimentService.setCurrentStep('catalog-3d');
    this.router.navigate(['/catalogo-3d']);
  }
}
