# ============================================
# Makefile para vehiculos-aca (Expo)
# ============================================

.PHONY: help install start start-clear start-tunnel start-lan \
        dev-android dev-ios dev-build-android dev-build-ios \
        build-android build-ios build-preview-android build-preview-ios \
        submit-android submit-ios submit-all \
        update-production update-preview \
        clean doctor prebuild

# ============================================
# Variables
# ============================================
EXPO = npx expo
EAS = npx eas-cli

# ============================================
# Ayuda
# ============================================
help:
	@echo ""
	@echo "==============================================="
	@echo "       Comandos disponibles - Expo App        "
	@echo "==============================================="
	@echo ""
	@echo "--- Instalación y Setup ---"
	@echo "  make install          Instalar dependencias"
	@echo "  make doctor           Verificar configuración de Expo"
	@echo "  make eas-login        Login en EAS (Expo Application Services)"
	@echo "  make eas-init         Inicializar proyecto en EAS"
	@echo ""
	@echo "--- Desarrollo con Expo Go ---"
	@echo "  make start            Iniciar servidor de desarrollo"
	@echo "  make start-clear      Iniciar con cache limpio"
	@echo "  make start-tunnel     Iniciar con tunnel (para redes restringidas)"
	@echo "  make start-lan        Iniciar en modo LAN"
	@echo ""
	@echo "--- Development Build (para probar features nativas) ---"
	@echo "  make dev-android      Ejecutar development build en Android"
	@echo "  make dev-ios          Ejecutar development build en iOS"
	@echo "  make dev-build-android Crear development build para Android"
	@echo "  make dev-build-ios    Crear development build para iOS"
	@echo ""
	@echo "--- Builds de Producción ---"
	@echo "  make build-android    Build de producción para Android (AAB)"
	@echo "  make build-ios        Build de producción para iOS (IPA)"
	@echo "  make build-preview-android  Build preview para Android (APK)"
	@echo "  make build-preview-ios      Build preview para iOS"
	@echo ""
	@echo "--- Publicación en Stores ---"
	@echo "  make submit-android   Publicar en Google Play Store"
	@echo "  make submit-ios       Publicar en App Store"
	@echo "  make submit-all       Publicar en ambas stores"
	@echo ""
	@echo "--- Updates OTA (Over-the-Air) ---"
	@echo "  make update-production  Publicar update OTA a producción"
	@echo "  make update-preview     Publicar update OTA a preview"
	@echo ""
	@echo "--- Limpieza y Utilidades ---"
	@echo "  make clean            Limpiar cache y node_modules"
	@echo "  make prebuild         Generar proyectos nativos (android/ios)"
	@echo ""

# ============================================
# Instalación y Setup
# ============================================
install:
	npm install

doctor:
	$(EXPO) doctor

eas-login:
	$(EAS) login

eas-init:
	$(EAS) init

# ============================================
# Desarrollo con Expo Go
# ============================================
start:
	$(EXPO) start

start-clear:
	$(EXPO) start --clear

start-tunnel:
	$(EXPO) start --tunnel

start-lan:
	$(EXPO) start --lan

# ============================================
# Development Build (para probar en producción)
# ============================================
dev-android:
	$(EXPO) start --dev-client --android

dev-ios:
	$(EXPO) start --dev-client --ios

dev-build-android:
	$(EAS) build --profile development --platform android

dev-build-ios:
	$(EAS) build --profile development --platform ios

dev-build-all:
	$(EAS) build --profile development --platform all

# ============================================
# Builds de Producción
# ============================================
build-android:
	$(EAS) build --profile production --platform android

build-ios:
	$(EAS) build --profile production --platform ios

build-all:
	$(EAS) build --profile production --platform all

build-preview-android:
	$(EAS) build --profile preview --platform android

build-preview-ios:
	$(EAS) build --profile preview --platform ios

build-preview-all:
	$(EAS) build --profile preview --platform all

# Build local (sin usar servidores de EAS)
build-local-android:
	$(EAS) build --profile production --platform android --local

build-local-ios:
	$(EAS) build --profile production --platform ios --local

# ============================================
# Publicación en Stores
# ============================================
submit-android:
	$(EAS) submit --platform android

submit-ios:
	$(EAS) submit --platform ios

submit-all:
	$(EAS) submit --platform all

# Build y submit en un solo paso
build-submit-android:
	$(EAS) build --profile production --platform android --auto-submit

build-submit-ios:
	$(EAS) build --profile production --platform ios --auto-submit

# ============================================
# Updates OTA (Over-the-Air)
# ============================================
update-production:
	$(EAS) update --branch production --message "Production update"

update-preview:
	$(EAS) update --branch preview --message "Preview update"

update-message:
	@read -p "Mensaje del update: " msg; \
	$(EAS) update --branch production --message "$$msg"

# ============================================
# Limpieza y Utilidades
# ============================================
clean:
	rm -rf node_modules
	rm -rf .expo
	rm -rf android
	rm -rf ios
	npm cache clean --force

clean-cache:
	rm -rf .expo
	$(EXPO) start --clear

prebuild:
	$(EXPO) prebuild

prebuild-clean:
	$(EXPO) prebuild --clean

# Regenerar proyectos nativos
prebuild-android:
	$(EXPO) prebuild --platform android

prebuild-ios:
	$(EXPO) prebuild --platform ios

# ============================================
# Configuración EAS (primera vez)
# ============================================
eas-configure:
	$(EAS) build:configure

eas-credentials-android:
	$(EAS) credentials --platform android

eas-credentials-ios:
	$(EAS) credentials --platform ios
