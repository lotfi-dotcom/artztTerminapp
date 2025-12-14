# Stage 1: Build-Umgebung
# Hier wird die React-Anwendung gebaut.
FROM node:18-alpine AS builder

WORKDIR /app

# Kopiere package.json und package-lock.json und installiere Abhängigkeiten
COPY package*.json ./
RUN npm install

# Kopiere den restlichen Quellcode
COPY . .

# Baue die Produktionsversion der App
RUN npm run build

# Stage 2: Produktions-Umgebung
# Hier wird ein schlanker Nginx-Server verwendet, um die gebaute App auszuliefern.
FROM nginx:stable-alpine

# Kopiere die gebauten Dateien aus der Build-Umgebung
COPY --from=builder /app/build /usr/share/nginx/html

# Kopiere die Nginx-Konfiguration, um SPA-Routing zu ermöglichen
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Exponiere Port 80
EXPOSE 80

# Starte Nginx im Vordergrund
CMD ["nginx", "-g", "daemon off;"]