import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { Product3dCanvasComponent } from '../../shared/components/product-3d-canvas/product-3d-canvas.component';
import { TelemetryService } from '../../core/services/telemetry.service';
import { ExperimentService } from '../../core/services/experiment.service';

@Component({
  selector: 'app-catalog-3d',
  standalone: true,
  imports: [CommonModule, RouterModule, Product3dCanvasComponent],
  templateUrl: './catalog-3d.component.html'
})
export class Catalog3dComponent implements OnInit, OnDestroy {
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
    this.experimentService.setCurrentStep('catalog-3d');
    this.experimentService.markCatalogTested('3D');

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
    this.telemetryService.startTracking(prod.id, '3D');
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

  proceedToSurvey(): void {
    this.telemetryService.endTracking();
    this.experimentService.setCurrentStep('survey');
    this.router.navigate(['/encuesta']);
  }
}
