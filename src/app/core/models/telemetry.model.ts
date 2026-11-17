export interface ProductInteractionLog {
  productId: string;
  condition: '2D' | '3D';
  timeSpentSeconds: number;
  rotationsCount: number;
  zoomCount: number;
  colorChangesCount: number;
  galleryViewsCount: number;
  addedToCart: boolean;
  clickedBuyNow: boolean;
  timestamp: string;
}

export interface TelemetrySummary {
  participantId: string;
  totalTime2DSeconds: number;
  totalTime3DSeconds: number;
  totalInteractions2D: number;
  totalInteractions3D: number;
  buyIntentClicks2D: number;
  buyIntentClicks3D: number;
  productsViewed2D: string[];
  productsViewed3D: string[];
}
