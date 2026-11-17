import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { Product2dGalleryComponent } from '../../shared/components/product-2d-gallery/product-2d-gallery.component';
import { Product3dCanvasComponent } from '../../shared/components/product-3d-canvas/product-3d-canvas.component';

@Component({
  selector: 'app-comparison',
  standalone: true,
  imports: [CommonModule, RouterModule, Product2dGalleryComponent, Product3dCanvasComponent],
  templateUrl: './comparison.component.html'
})
export class ComparisonComponent implements OnInit {
  public readonly products = signal<Product[]>([]);
  public readonly selectedProduct = signal<Product | null>(null);

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    const prods = this.productService.getProducts();
    this.products.set(prods);
    if (prods.length > 0) {
      this.selectedProduct.set(prods[0]);
    }
  }

  selectProduct(prod: Product): void {
    this.selectedProduct.set(prod);
  }
}
