import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productsData: Product[] = [
    {
      id: 'prod-sneaker-01',
      name: 'AeroVelocity Pro Sneaker',
      category: 'Calzado Deportivo & Lifestyle',
      subtitle: 'Zapatilla ergonómica de alto rendimiento con amortiguación reactiva',
      price: 139.99,
      originalPrice: 179.99,
      rating: 4.8,
      reviewCount: 342,
      description: 'Zapatilla diseñada para máxima respuesta motriz y confort urbano. Cuenta con suela de polímero de densidad variable y tejido transpirable multicapa que optimiza la pisada y disipa el impacto en articulaciones.',
      features: [
        'Inspección 360° para evaluar costuras y contorno de suela',
        'Suela amortiguada con retorno de energía de 78%',
        'Tejido transpirable FlyWeave con refuerzo hidrófugo',
        'Plantilla ortopédica removible con soporte de arco longitudinal',
        'Peso ultraligero: 245 gramos por calzado'
      ],
      specifications: {
        'Material Exterior': 'Malla técnica sintética de alta densidad',
        'Material de Suela': 'EVA expandido con inserciones de caucho termoplástico',
        'Tipo de Cierre': 'Cordones reforzados de tensión simétrica',
        'Uso Recomendado': 'Running ligero, entrenamiento cruzado, uso casual urbano',
        'Garantía': '6 meses por defectos de manufactura'
      },
      images2D: {
        primary: 'images/shoe-1.jpg',
        gallery: [
          'images/shoe-1.jpg',
          'images/shoe-2.jpg',
          'images/shoe-3.jpg'
        ],
        thumbnails: [
          'images/shoe-1.jpg',
          'images/shoe-2.jpg',
          'images/shoe-3.jpg'
        ]
      },
      model3D: {
        modelUrl: 'models/shoe.glb',
        scale: 1.6,
        initialRotation: [0.15, -0.6, 0],
        initialPosition: [0, -0.15, 0],
        cameraPosition: [0, 0.4, 1.8],
        availableColors: [
          { name: 'Rojo Carmín / Obsidian', hex: '#d92323' },
          { name: 'Negro Phantom Stealth', hex: '#1c1c1e' },
          { name: 'Azul Eléctrico Cobalto', hex: '#1e5df0' },
          { name: 'Blanco Lunar Puro', hex: '#f0f0f5' }
        ]
      }
    },
    {
      id: 'prod-chair-02',
      name: 'Nordic Lounge Chair Velvet',
      category: 'Mobiliario & Diseño de Interiores',
      subtitle: 'Silla poltrona ergonómica de terciopelo con base de roble escandinavo',
      price: 289.00,
      originalPrice: 349.00,
      rating: 4.9,
      reviewCount: 189,
      description: 'Poltrona de acento con curvatura anatómica envolvente. El tapizado con tecnología de microfibra de terciopelo ofrece una textura suave al tacto y alta resistencia al desgaste, complementada con estructura interna de madera maciza.',
      features: [
        'Geometría tridimensional diseñada para corregir la postura lumbar',
        'Acabado textil aterciopelado con resistencia a manchas (NanoGuard)',
        'Estructura de madera maciza certificada FSC',
        'Soporta hasta 150 kg con estabilidad antivuelco calibrada',
        'Acolchado de espuma viscoelástica de alta resiliencia (HR 35kg/m³)'
      ],
      specifications: {
        'Dimensiones': '78 cm (alto) x 72 cm (ancho) x 68 cm (profundidad)',
        'Altura de Asiento': '44 cm desde el suelo',
        'Tapiz': 'Terciopelo poliéster de 420 g/m² con tratamiento ignífugo',
        'Estructura': 'Madera de roble natural barnizado satinado',
        'Peso': '11.8 kg'
      },
      images2D: {
        primary: 'images/chair-1.jpg',
        gallery: [
          'images/chair-1.jpg',
          'images/chair-2.jpg',
          'images/chair-3.jpg'
        ],
        thumbnails: [
          'images/chair-1.jpg',
          'images/chair-2.jpg',
          'images/chair-3.jpg'
        ]
      },
      model3D: {
        modelUrl: 'models/chair.glb',
        scale: 1.1,
        initialRotation: [0, 0.45, 0],
        initialPosition: [0, -0.55, 0],
        cameraPosition: [0, 0.4, 2.2],
        availableColors: [
          { name: 'Verde Esmeralda Velvet', hex: '#1e483e' },
          { name: 'Ocre Mostaza Nórdico', hex: '#c5942b' },
          { name: 'Gris Carbón Grafito', hex: '#33373d' },
          { name: 'Terracota Cálido', hex: '#a64d36' }
        ]
      }
    },
    {
      id: 'prod-bottle-03',
      name: 'Titanium Pure HydroFlask 750ml',
      category: 'Gadgets Deportivos & Accesorios',
      subtitle: 'Botella térmica de titanio grado aeroespacial con aislamiento al vacío TempShield',
      price: 49.50,
      originalPrice: 65.00,
      rating: 4.7,
      reviewCount: 412,
      description: 'Botella isotérmica fabricada en acero y titanio de doble pared aislada al vacío. Mantiene bebidas frías por hasta 24 horas y calientes por 12 horas sin condensación externa ni transferencia de sabores u olores.',
      features: [
        'Inspección de rosca hermética y tapa a prueba de fugas 360°',
        'Aislamiento de doble pared al vacío con barrera reflectiva de cobre',
        '100% libre de BPA, ftalatos y metales pesados contaminantes',
        'Recubrimiento exterior texturizado electrostático antideslizante',
        'Capacidad volumétrica calibrada de 750 ml (25.3 oz)'
      ],
      specifications: {
        'Capacidad': '750 ml (0.75 litros)',
        'Material': 'Acero inoxidable 18/8 de grado alimenticio quirúrgico',
        'Retención Térmica': '24h frío / 12h calor certificado',
        'Diámetro de Boca': '5.5 cm (compatible con cubos de hielo estándar)',
        'Dimensiones': '26 cm alto x 7.6 cm diámetro'
      },
      images2D: {
        primary: 'images/bottle-1.jpg',
        gallery: [
          'images/bottle-1.jpg',
          'images/bottle-2.jpg',
          'images/bottle-3.jpg'
        ],
        thumbnails: [
          'images/bottle-1.jpg',
          'images/bottle-2.jpg',
          'images/bottle-3.jpg'
        ]
      },
      model3D: {
        modelUrl: 'models/bottle.glb',
        scale: 4.5,
        initialRotation: [0, 0, 0],
        initialPosition: [0, -0.6, 0],
        cameraPosition: [0, 0.2, 1.8],
        availableColors: [
          { name: 'Azul Océano Mate', hex: '#1d4ed8' },
          { name: 'Negro Ónix Pulido', hex: '#18181b' },
          { name: 'Titanio Cepillado Natural', hex: '#94a3b8' },
          { name: 'Verde Militar Oliva', hex: '#3f4f3c' }
        ]
      }
    }
  ];

  public readonly products = signal<Product[]>(this.productsData);

  getProducts(): Product[] {
    return this.productsData;
  }

  getProductById(id: string): Product | undefined {
    return this.productsData.find(p => p.id === id);
  }
}
