# Stage 1: Build Angular application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Clean installation of dependencies
RUN npm ci

# Copy full source code
COPY . .

# Compile Angular application in production mode
RUN npm run build

# Stage 2: Production web server with Nginx
FROM nginx:alpine

# Default PORT environment variable (Railway injects $PORT dynamically)
ENV PORT=80

# Clean default configuration
RUN rm -rf /etc/nginx/conf.d/*

# Copy configuration template (Nginx entrypoint automatically substitutes $PORT)
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy compiled frontend from builder stage
COPY --from=builder /app/dist/catalogue-thesis/browser /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
