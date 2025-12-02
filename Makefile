# ============================================
# Makefile FINAL - Vehiculos Mobile
# Entorno: WSL2 + Android SDK + iOS + Web
# ============================================

.PHONY: help install \
        start start-tunnel start-clear dev-web \
        dev-android-qr dev-android-tunnel dev-android-emu \
        dev-ios \
        adb-connect adb-check \
        dev-build-android dev-build-ios \
        build-android build-ios \
        submit-android submit-ios submit-all \
        update-prod update-preview \
        clean doctor prebuild

# ============================================
# Variables
# ============================================
EXPO = npx expo
EAS = npx eas-cli

# ============================================
# Ayuda (Menú Principal)
# ============================================
help:
	@echo ""
	@echo "📱 DESARROLLO (RUN)"
	@echo "   make dev-android-qr     : Android en Celular Físico (WiFi Local)"
	@echo "   make dev-android-tunnel : Android en Celular (Si falla WiFi/WSL)"
	@echo "   make dev-android-emu    : Android en Emulador (Incluye fix de conexión)"
	@echo "   make dev-ios            : iOS en iPhone Físico (QR)"
	@echo "   make dev-web            : Levantar versión Web"
	@echo "   make start              : Expo Go Standard (sin código nativo)"
	@echo ""
	@echo "🔧 UTILIDADES WSL"
	@echo "   make adb-connect        : Conectar WSL al Emulador de Windows"
	@echo "   make adb-check          : Ver dispositivos conectados"
	@echo ""
	@echo "🏗️ BUILDS (Compilar)"
	@echo "   make dev-build-android  : Crear APK de desarrollo (Debug)"
	@echo "   make dev-build-ios      : Crear App de desarrollo iOS"
	@echo "   make build-android      : Crear AAB Producción (Play Store)"
	@echo "   make build-ios          : Crear IPA Producción (App Store)"
	@echo ""
	@echo "🚀 DEPLOY & UPDATES"
	@echo "   make submit-android     : Subir a Google Play"
	@echo "   make submit-ios         : Subir a App Store"
	@echo "   make update-prod        : Enviar OTA Update a Producción"
	@echo ""

# ============================================
# 1. Configuración & WSL Tools
# ============================================
install:
	npm install

doctor:
	$(EXPO) doctor

# Fix para conectar WSL al Emulador de Windows automáticamente
adb-connect:
	@echo "🔌 Conectando al Emulador en Windows..."
	adb disconnect
	adb connect $$(grep nameserver /etc/resolv.conf | awk '{print $$2}'):5555
	adb devices

adb-check:
	adb devices

# ============================================
# 2. Development Client (Tu App Nativa)
# ============================================

# --- Android ---
# Opción A: Celular en la misma red (Rápido)
dev-android-qr:
	$(EXPO) start --dev-client

# Opción B: Celular via Tunnel (Si la red local falla en WSL)
dev-android-tunnel:
	$(EXPO) start --dev-client --tunnel

# Opción C: Emulador (Ejecuta el fix de conexión antes de arrancar)
dev-android-emu: adb-connect
	$(EXPO) start --dev-client --android

# --- iOS ---
dev-ios:
	$(EXPO) start --dev-client --ios

# --- Web ---
dev-web:
	$(EXPO) start --web

# ============================================
# 3. Expo Go (Legacy / JS Only)
# ============================================
start:
	$(EXPO) start

start-clear:
	$(EXPO) start --clear

start-tunnel:
	$(EXPO) start --tunnel

# ============================================
# 4. Generación de Builds (EAS)
# ============================================

# --- Development Builds (Para probar) ---
dev-build-android:
	$(EAS) build --profile development --platform android

dev-build-ios:
	$(EAS) build --profile development --platform ios

# --- Production Builds (Para tienda) ---
build-android:
	$(EAS) build --profile production --platform android

build-ios:
	$(EAS) build --profile production --platform ios

# --- Builds Locales (Si tienes entorno Java/Xcode nativo) ---
build-local-android:
	$(EAS) build --profile production --platform android --local

# ============================================
# 5. Publicación (Submit)
# ============================================
submit-android:
	$(EAS) submit --platform android

submit-ios:
	$(EAS) submit --platform ios

submit-all:
	$(EAS) submit --platform all

# ============================================
# 6. OTA Updates
# ============================================
update-prod:
	$(EAS) update --branch production --message "Production update"

update-preview:
	$(EAS) update --branch preview --message "Preview update"

# ============================================
# 7. Limpieza
# ============================================
clean:
	rm -rf node_modules .expo android ios
	npm cache clean --force

prebuild:
	$(EXPO) prebuild