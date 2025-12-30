# ============================================
# Makefile - Vehiculos Mobile
# Soporte: WSL2, Mac, Linux
# ============================================

.PHONY: help install \
        dev-qr dev-tunnel dev-emu dev-ios dev-web \
        adb-connect adb-check \
        build-dev-android build-dev-ios \
        build-preview-android build-preview-ios \
        build-prod-android build-prod-ios \
        submit-android submit-ios \
        update-prod update-preview \
        clean doctor secrets

# ============================================
# Variables
# ============================================
EXPO = npx expo
EAS = npx eas-cli

# ============================================
# 🆘 AYUDA
# ============================================
help:
	@echo ""
	@echo "📱 DESARROLLO (RUN)"
	@echo "   make dev-qr             : Android en Celular Físico (WiFi Local - Rápido)"
	@echo "   make dev-tunnel         : Android en Celular (Vía Tunnel - Si WiFi falla)"
	@echo "   make dev-emu            : Android en Emulador (Intenta conectar ADB primero)"
	@echo "   make dev-ios            : iOS en iPhone Físico"
	@echo "   make dev-web            : Versión Web"
	@echo ""
	@echo "🔧 UTILIDADES (WSL/Android)"
	@echo "   make adb-connect        : Conectar WSL al Host Windows (Fix 'No device')"
	@echo "   make adb-check          : Ver dispositivos conectados"
	@echo ""
	@echo "🏗️ BUILDS (COMPILAR)"
	@echo "   --- Development (Debug) ---"
	@echo "   make build-dev-android  : APK Desarrollo (Para instalar en tu cel/emu)"
	@echo "   make build-dev-ios      : Build Desarrollo iOS"
	@echo ""
	@echo "   --- Preview (Testing/QA) ---"
	@echo "   make build-preview-android : APK para Testers (Variables de Test)"
	@echo ""
	@echo "   --- Production (Store) ---"
	@echo "   make build-prod-android    : AAB para Google Play (Variables de Prod)"
	@echo "   make build-prod-ios        : IPA para App Store"
	@echo ""
	@echo "🚀 PUBLICAR"
	@echo "   make submit-android     : Subir AAB a Google Play Console"
	@echo "   make submit-ios         : Subir IPA a App Store"
	@echo "   make update-prod        : Enviar OTA Update a Producción"
	@echo ""

# ============================================
# 1. Configuración
# ============================================
install:
	npm install

doctor:
	$(EXPO) doctor

secrets:
	$(EAS) secret:list

# ============================================
# 2. Utilidades ADB (WSL Fixes)
# ============================================
# Intenta conectar ADB a la IP del host (Windows) dinámicamente
adb-connect:
	@echo "🔌 Buscando enlace con host..."
	adb disconnect
	adb connect $$(grep nameserver /etc/resolv.conf | awk '{print $$2}'):5555 || echo "⚠️  No se pudo conectar automático. Prueba manual si usas emulador."
	adb devices

adb-check:
	adb devices

# ============================================
# 3. Correr la App (Development Client)
# ============================================

# --- Android ---
dev-qr:
	$(EXPO) start --dev-client

dev-tunnel:
	$(EXPO) start --dev-client --tunnel

# Ejecuta el fix de ADB antes de lanzar Expo
dev-emu: adb-connect
	$(EXPO) start --dev-client --android

# --- iOS & Web ---
dev-ios:
	$(EXPO) start --dev-client --ios

dev-web:
	$(EXPO) start --web

# --- Expo Go (Legacy) ---
start:
	$(EXPO) start

# ============================================
# 4. Generación de Builds (EAS)
# ============================================

# A. DEVELOPMENT (Debug / Features Nativas)
build-dev-android:
	$(EAS) build --profile development --platform android

build-dev-ios:
	$(EAS) build --profile development --platform ios

# B. PREVIEW (APK Instalable / Test Env)
build-preview-android:
	$(EAS) build --profile preview --platform android

build-preview-ios:
	$(EAS) build --profile preview --platform ios

# C. PRODUCTION (AAB Store / Prod Env)
build-prod-android:
	$(EAS) build --profile production --platform android

build-prod-ios:
	$(EAS) build --profile production --platform ios

# ============================================
# 5. Publicación (Submit)
# ============================================
submit-android:
	$(EAS) submit --platform android

submit-ios:
	$(EAS) submit --platform ios

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