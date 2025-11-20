#!/bin/bash

# Script de configuration pour développement local
# Usage: ./scripts/setup-local.sh

set -e

echo "🔧 Configuration de @boxraiser/visual-editor-svelte pour développement local"
echo ""

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Vérifier qu'on est dans le bon dossier
if [ ! -f "package.json" ]; then
  echo "❌ Erreur: package.json non trouvé. Lancez ce script depuis la racine du projet."
  exit 1
fi

# 2. Installer les dépendances
echo "${BLUE}📦 Installation des dépendances...${NC}"
npm install

# 3. Builder le package
echo "${BLUE}🔨 Build du package...${NC}"
npm run build

# 4. Vérifier que le build a réussi
if [ ! -d "dist" ]; then
  echo "❌ Erreur: Le dossier dist n'a pas été créé. Le build a échoué."
  exit 1
fi

echo "${GREEN}✅ Build réussi!${NC}"
echo ""

# 5. Créer le lien npm
echo "${BLUE}🔗 Création du lien npm global...${NC}"
npm link

echo ""
echo "${GREEN}✨ Configuration terminée!${NC}"
echo ""
echo "Pour utiliser ce package dans votre projet:"
echo ""
echo "  ${BLUE}cd /chemin/vers/votre-projet${NC}"
echo "  ${BLUE}npm link @boxraiser/visual-editor-svelte${NC}"
echo "  ${BLUE}npm install svelte@^5.0.0 svelte-dnd-action @tiptap/core @tiptap/pm${NC}"
echo ""
echo "Pour développer avec watch mode (rebuild automatique):"
echo ""
echo "  ${BLUE}npm run build -- --watch${NC}"
echo ""
echo "Pour plus d'informations, consultez LOCAL_DEVELOPMENT.md"
