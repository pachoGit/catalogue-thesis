export interface Product {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  images2D: {
    primary: string;
    gallery: string[];
    thumbnails: string[];
  };
  model3D: {
    modelUrl: string;
    scale: number;
    initialRotation: [number, number, number];
    initialPosition: [number, number, number];
    cameraPosition: [number, number, number];
    availableColors: {
      name: string;
      hex: string;
      meshTargetName?: string;
    }[];
  };
}
