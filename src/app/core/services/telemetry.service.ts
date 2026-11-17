import { Injectable, signal } from '@angular/core';
import { ProductInteractionLog, TelemetrySummary } from '../models/telemetry.model';

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  private readonly STORAGE_KEY = 'catalogue_thesis_telemetry_logs';

  private activeProductStart: number = 0;
  private currentCondition: '2D' | '3D' = '2D';
  private currentProductId: string = '';

  private currentLog: Partial<ProductInteractionLog> = {};

  public readonly logs = signal<ProductInteractionLog[]>(this.loadLogsFromStorage());

  startTracking(productId: string, condition: '2D' | '3D') {
    this.endTracking(); // Finish previous if active
    this.currentProductId = productId;
    this.currentCondition = condition;
    this.activeProductStart = Date.now();
    this.currentLog = {
      productId,
      condition,
      timeSpentSeconds: 0,
      rotationsCount: 0,
      zoomCount: 0,
      colorChangesCount: 0,
      galleryViewsCount: 0,
      addedToCart: false,
      clickedBuyNow: false,
      timestamp: new Date().toISOString()
    };
  }

  recordRotation() {
    if (this.currentLog) {
      this.currentLog.rotationsCount = (this.currentLog.rotationsCount || 0) + 1;
    }
  }

  recordZoom() {
    if (this.currentLog) {
      this.currentLog.zoomCount = (this.currentLog.zoomCount || 0) + 1;
    }
  }

  recordColorChange() {
    if (this.currentLog) {
      this.currentLog.colorChangesCount = (this.currentLog.colorChangesCount || 0) + 1;
    }
  }

  recordGalleryView() {
    if (this.currentLog) {
      this.currentLog.galleryViewsCount = (this.currentLog.galleryViewsCount || 0) + 1;
    }
  }

  recordAddToCart() {
    if (this.currentLog) {
      this.currentLog.addedToCart = true;
      this.saveCurrentLogSnapshot();
    }
  }

  recordBuyNow() {
    if (this.currentLog) {
      this.currentLog.clickedBuyNow = true;
      this.saveCurrentLogSnapshot();
    }
  }

  endTracking(): ProductInteractionLog | null {
    if (!this.currentProductId || !this.activeProductStart) {
      return null;
    }
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - this.activeProductStart) / 1000));
    const fullLog: ProductInteractionLog = {
      productId: this.currentProductId,
      condition: this.currentCondition,
      timeSpentSeconds: (this.currentLog.timeSpentSeconds || 0) + elapsedSeconds,
      rotationsCount: this.currentLog.rotationsCount || 0,
      zoomCount: this.currentLog.zoomCount || 0,
      colorChangesCount: this.currentLog.colorChangesCount || 0,
      galleryViewsCount: this.currentLog.galleryViewsCount || 0,
      addedToCart: !!this.currentLog.addedToCart,
      clickedBuyNow: !!this.currentLog.clickedBuyNow,
      timestamp: this.currentLog.timestamp || new Date().toISOString()
    };

    const updated = [fullLog, ...this.logs()];
    this.logs.set(updated);
    this.saveLogsToStorage(updated);

    this.currentProductId = '';
    this.activeProductStart = 0;
    this.currentLog = {};
    return fullLog;
  }

  private saveCurrentLogSnapshot() {
    if (!this.currentProductId || !this.activeProductStart) return;
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - this.activeProductStart) / 1000));
    const currentList = this.logs();
    const snapshot: ProductInteractionLog = {
      productId: this.currentProductId,
      condition: this.currentCondition,
      timeSpentSeconds: elapsedSeconds,
      rotationsCount: this.currentLog.rotationsCount || 0,
      zoomCount: this.currentLog.zoomCount || 0,
      colorChangesCount: this.currentLog.colorChangesCount || 0,
      galleryViewsCount: this.currentLog.galleryViewsCount || 0,
      addedToCart: !!this.currentLog.addedToCart,
      clickedBuyNow: !!this.currentLog.clickedBuyNow,
      timestamp: new Date().toISOString()
    };
    const updated = [snapshot, ...currentList];
    this.logs.set(updated);
    this.saveLogsToStorage(updated);
  }

  getSummary(participantId: string): TelemetrySummary {
    const all = this.logs();
    const time2D = all.filter(l => l.condition === '2D').reduce((acc, c) => acc + c.timeSpentSeconds, 0);
    const time3D = all.filter(l => l.condition === '3D').reduce((acc, c) => acc + c.timeSpentSeconds, 0);

    const int2D = all.filter(l => l.condition === '2D').reduce((acc, c) => acc + c.zoomCount + c.galleryViewsCount, 0);
    const int3D = all.filter(l => l.condition === '3D').reduce((acc, c) => acc + c.rotationsCount + c.zoomCount + c.colorChangesCount, 0);

    const buyClicks2D = all.filter(l => l.condition === '2D' && (l.clickedBuyNow || l.addedToCart)).length;
    const buyClicks3D = all.filter(l => l.condition === '3D' && (l.clickedBuyNow || l.addedToCart)).length;

    const prod2D = Array.from(new Set(all.filter(l => l.condition === '2D').map(l => l.productId)));
    const prod3D = Array.from(new Set(all.filter(l => l.condition === '3D').map(l => l.productId)));

    return {
      participantId,
      totalTime2DSeconds: time2D,
      totalTime3DSeconds: time3D,
      totalInteractions2D: int2D,
      totalInteractions3D: int3D,
      buyIntentClicks2D: buyClicks2D,
      buyIntentClicks3D: buyClicks3D,
      productsViewed2D: prod2D,
      productsViewed3D: prod3D
    };
  }

  clearLogs() {
    this.logs.set([]);
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  }

  private loadLogsFromStorage(): ProductInteractionLog[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading stored telemetry logs', e);
    }
    return [];
  }

  private saveLogsToStorage(logs: ProductInteractionLog[]) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error('Error saving telemetry logs', e);
    }
  }
}
