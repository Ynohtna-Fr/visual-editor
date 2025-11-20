# Icônes pour Visual Editor

Ce dossier contient les icônes SVG utilisées par Visual Editor.

## Icônes requises

Pour un fonctionnement complet, créez les icônes SVG suivantes:

- `add.svg` - Ajouter un composant
- `close.svg` - Fermer l'éditeur
- `delete.svg` - Supprimer un composant
- `duplicate.svg` - Dupliquer un composant
- `drag.svg` - Poignée de drag & drop
- `chevron-down.svg` - Menu déroulant
- `chevron-up.svg` - Fermer le menu
- `search.svg` - Recherche de composants
- `template.svg` - Templates
- `desktop.svg` - Preview desktop
- `mobile.svg` - Preview mobile

## Format SVG

Les icônes doivent être au format SVG avec:
- Taille: 24x24 pixels (viewBox="0 0 24 24")
- Couleur: currentColor (pour s'adapter au thème)
- Trait: 2px de largeur

## Exemple d'icône

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <line x1="12" y1="5" x2="12" y2="19"></line>
  <line x1="5" y1="12" x2="19" y2="12"></line>
</svg>
```

## Sources d'icônes gratuites

- [Lucide](https://lucide.dev/) - Icônes modernes open source
- [Heroicons](https://heroicons.com/) - Icônes de Tailwind CSS
- [Feather Icons](https://feathericons.com/) - Icônes minimalistes
- [Ionicons](https://ionic.io/ionicons) - Icônes polyvalentes

## Installation rapide

```bash
# Télécharger depuis Lucide (exemple)
curl -o add.svg https://unpkg.com/lucide-static@latest/icons/plus.svg
curl -o close.svg https://unpkg.com/lucide-static@latest/icons/x.svg
curl -o delete.svg https://unpkg.com/lucide-static@latest/icons/trash-2.svg
# etc.
```

Ou copiez simplement les SVG dans ce dossier en les renommant correctement.
