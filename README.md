# Catalog — Plataforma Experimental para Tesis de Grado

## Título de la Tesis
> **«Entorno y modelos 3D para la interacción con productos de los catálogos online y su influencia en la intención de compra»**

---

## 📖 Descripción del Proyecto
Esta aplicación web experimental ha sido desarrollada para sustentar y defender la tesis de grado sobre la influencia de la visualización tridimensional en la toma de decisiones y la intención de compra del consumidor en el comercio electrónico.

La plataforma permite realizar un experimento comparativo controlado (**Within-Subjects / Entre Sujetos**) contrastando dos condiciones:
1. **Catálogo 2D (Grupo de Control / Tradicional):** Fotografías en alta resolución en múltiples ángulos, lentes de aumento y especificaciones técnicas convencionales.
2. **Catálogo 3D (Grupo Experimental / Interactivo):** Renderizado tridimensional en tiempo real con WebGL y Three.js, rotación orbital 360°, inspección milimétrica de zoom, variantes de color y texturas en tiempo real, iluminación de estudio personalizable y modo de inspección poligonal (*Wireframe*).

---

## 🔬 Fundamentación Teórica y Metodológica

El diseño del experimento y el instrumento psicométrico de medición se fundamentan en:
* **Modelo de Aceptación Tecnológica (TAM - Davis, 1989):**
  * *Utilidad Percibida (Perceived Usefulness - PU)*
  * *Facilidad de Uso Percibida (Perceived Ease of Use - PEOU)*
* **Teoría de la Telepresencia e Interactividad (Steuer, 1992; Klein, 2003):** Sensación háptica simulada e inmersión visual.
* **Reducción del Riesgo Percibido e Incertidumbre del Producto (Dimoka et al., 2012).**
* **Teoría de la Acción Razonada y Comportamiento Planificado (Fishbein & Ajzen):** *Intención de Compra (Purchase Intention - PI)* como variable dependiente central.

---

## 🚀 Funcionalidades Principales

### 1. Flujo Experimental Guiado
* **Paso 1: Consentimiento y Registro Demográfico:** Identificación por correo electrónico, rango de edad, género, frecuencia de compra online y nivel de experiencia previa con 3D.
* **Paso 2: Evaluación del Catálogo 2D:** Exploración fotográfica e interacción con botones de micro-conversión conductual (*Añadir al Carrito* y *Comprar Ahora*).
* **Paso 3: Evaluación del Catálogo 3D:** Manipulación interactiva con registro automático de telemetría (tiempo de permanencia, grados de rotación, eventos de zoom y cambios de variantes de color).
* **Paso 4: Encuesta Psicométrica de Tesis (13 ítems en Escala Likert 1 a 5):** Medición de constructos TAM y decisión de compra preferencial.
* **Paso 5: Resumen Individual de Participación:** Devolución gráfica de los puntajes alcanzados por el participante.

### 2. Comparador Dual Lado a Lado (Side-by-Side)
Diseñado específicamente para la **sustentación ante el jurado**, permitiendo mostrar simultáneamente en una sola pantalla la versión 2D a la izquierda y el modelo 3D a la derecha sobre el mismo producto, analizando las limitaciones y ventajas de cada enfoque.

### 3. Panel de Control del Investigador (Dashboard de Sustentación)
* **Indicadores Clave de Rendimiento (KPIs):**
  * Media de Intención de Compra 3D vs 2D ($\Delta$ de incremento porcentual).
  * Tasa de micro-conversión conductual (clics en comprar).
  * Tiempo promedio de permanencia por producto (*Dwell Time* en segundos).
  * Porcentaje de preferencia en decisión de compra.
* **Visualizador de Medias por Constructo TAM:** Gráficos comparativos de Utilidad, Facilidad de Uso, Telepresencia, Confianza e Intención de Compra.
* **Prueba de Hipótesis Científica:** Formulación y contraste formal ($H_0$ vs $H_1$) con nivel de significancia $\alpha = 0.05$.
* **Generador de Muestra de Simulación (N=35):** Permite poblar instantáneamente el panel con una muestra realista durante ensayos o ante el jurado sin requerir conexión a internet.
* **Exportación a SPSS / R / Excel:** Descarga con un solo clic de un archivo CSV con diccionario de variables psicométricas codificadas (`PU1`, `PEOU1`, `TEL1`, `UNC1`, `PI_2D`, `PI_3D`, etc.).

---

## 🛠️ Arquitectura de Software y Principios Aplicados

* **Principios SOLID:**
  * *Single Responsibility Principle (SRP):* Separación estricta entre servicios de productos (`ProductService`), telemetría (`TelemetryService`), psicometría (`SurveyService`), estado del experimento (`ExperimentService`) y exportación (`ExportService`).
  * *Open/Closed Principle (OCP):* Modelo extensible para incorporar nuevos productos 3D o dimensiones psicométricas sin modificar la lógica central.
  * *Dependency Inversion Principle (DIP):* Inyección de dependencias modular y desacoplada nativa de Angular.
* **Patrón de Estado Reactivo:** Uso de Angular Signals para reactividad declarativa y alto rendimiento en tiempo real.
* **Resiliencia Offline:** Modelos 3D (`.glb`) e imágenes almacenados localmente en `public/` con mallas poligonales procedurales de contingencia en caso de contingencia técnica.

---

## 💻 Instrucciones de Ejecución

### Requisitos previos
* Node.js 26 (o superior)
* npm 9+

### Instalación de dependencias
```bash
npm install
```

### Ejecutar servidor de desarrollo
```bash
npm start
# o
ng serve
```
Abre tu navegador en `http://localhost:4200/`.

### Compilación para producción
```bash
npm run build
```

### Ejecución de pruebas unitarias
```bash
npm test -- --watch=false
```

---

## ☁️ Despliegue en Railway (Paso a Paso)

El proyecto ya cuenta con configuración lista para **Railway** (`Dockerfile`, `nginx.conf.template`, `railway.json` y `.dockerignore`):

1. **Sube tus cambios a GitHub:**
   ```bash
   git add .
   git commit -m "feat: plataforma experimental tesis 3d y configuracion railway"
   git push origin main
   ```

2. **Conecta tu repositorio en Railway:**
   * Entra a [railway.app](https://railway.app/) e inicia sesión.
   * Haz clic en **«New Project»** ➔ **«Deploy from GitHub repo»**.
   * Selecciona este repositorio (`catalogue-thesis`).
   * Railway detectará automáticamente el archivo `railway.json` y `Dockerfile`.

3. **¡Listo!:**
   * Railway compilará la aplicación Angular con Node 26 y levantará un servidor Nginx ultraligero que responde automáticamente en el puerto dinámico `$PORT`.
   * Ve a **Settings** ➔ **Networking** ➔ **«Generate Domain»** para obtener la URL pública con HTTPS gratis para tu sustentación (ejemplo: `https://catalogue-thesis-production.up.railway.app`).

