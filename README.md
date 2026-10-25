# 🌌 Le Musée de l'espace

**Une application React construite sur la photothèque de la NASA.**

Ce projet a été réalisé dans le cadre d'une évaluation. Il s'agit d'une exposition numérique interactive permettant de parcourir, d'écouter et de collectionner les archives médias (images, vidéos, sons) de l'agence spatiale américaine.

---

## 👥 Le Binôme

- **Amir BOUMAZOUZI** — *Logique métier, API, Contexts, Tests & Déploiement*
- **Robin LEBOEDEC** — *Interface utilisateur, Design 3D, Routage & Animations*

---

## 🏆 Palier Visé et État du Projet

**Palier 6 (La visite) + Bonus mise en ligne** validé.

- [x] **Palier 1 : La galerie** — Recherche, pagination, cartes avec vignettes, états de chargement et gestion des erreurs.
- [x] **Palier 2 : Les fiches** — Page de détail avec image haute résolution (via `/asset`), description, mots-clés cliquables. Page 404 gérée.
- [x] **Palier 3 : Images, vidéos et sons** — Filtres (type, période), synchronisation de l'URL (`useSearchParams`), lecteurs médias natifs, favoris persistants.
- [x] **Palier 4 : Les salles du musée** — 5 salles thématiques (Apollo, Hubble, ISS, Mars, Artemis), frise chronologique, et tests automatisés (Vitest).
- [x] **Palier 5 : Le commissaire d'exposition** — Création, édition, réorganisation et commentaires sur les médias. Partage d'exposition par URL (encodage Base64).
- [x] **Palier 6 : La visite** — Mode plein écran, navigation clavier, arrêt automatique des médias au changement de page. Mini-jeu "En quelle année ?".
- [x] **Bonus Vercel** — Déploiement continu avec configuration des *rewrites* pour le routage SPA.

🌐 **Lien du site en ligne :** [https://musee-espace.vercel.app](https://musee-espace.vercel.app) **

---

## 🛠️ Stack Technique et Bibliothèques

Le projet est divisé en deux grandes parties : l'Interface (Front) et la Logique de données (Back/Métier).

### 1. Le Front-end (Interface & Design)
- **React 18 & Vite** : Utilisation de Vite pour un build ultra-rapide et un HMR (Hot Module Replacement) instantané.
- **React Router v6** : Gestion de la navigation en SPA (Single Page Application) sans rechargement de page. Utilisation de `useSearchParams` pour faire de l'URL la source de vérité de l'état de la galerie.
- **Framer Motion** : Utilisé pour les micro-interactions (survol des cartes), les animations d'apparition et les transitions fluides entre les pages.
- **Three.js, React Three Fiber & Drei** : Intégration d'un fond 3D immersif (champ d'étoiles, planète, anneau) qui réagit au défilement de la page (parallaxe).
- **HTML5 Natif** : Utilisation des balises `<video>` et `<audio>` pour la lecture des médias, sans aucune bibliothèque tierce (gestion via `useRef` et `useEffect` pour le nettoyage des écouteurs).

### 2. Le Back-end / Logique Métier (Client-side)
- **JavaScript ES2022 (Fetch API)** : Appels asynchrones natifs vers l'API de la NASA. Aucun serveur dédié n'est utilisé.
- **React Context API** : Utilisé pour créer un état global (Favoris et Expositions) accessible par n'importe quel composant sans "prop drilling".
- **LocalStorage** : Utilisé comme base de données locale pour persister les favoris et les expositions entre deux visites.
- **Vitest & Testing Library** : Framework de test unitaire (9 tests écrits) pour valider la robustesse des fonctions de transformation de l'API.

---

## 🏗️ Architecture du Code

L'application suit une architecture stricte de séparation des responsabilités :

```text
src/
├── api/             # Centralisation des appels réseau (nasaApi.js) et transformation des données.
├── components/      # Composants d'interface réutilisables (MediaCard, Loader, NavBar, Background 3D).
├── context/         # Gestion de l'état global (FavoritesContext, ExhibitionsContext) + LocalStorage.
├── data/            # Configuration statique (définition des 5 salles thématiques).
├── hooks/           # Hooks personnalisés (useMediaSearch pour gérer l'état de chargement de l'API).
├── pages/           # Assemblage des composants pour chaque route (Galerie, Fiche, Salles, Visite...).
├── styles/          # Feuilles de style globales (variables CSS, thème sombre, Glassmorphism).
├── test/            # Fichiers de configuration des tests.
└── utils/           # Fonctions utilitaires pures (formatage des dates, extraction d'année


Chose rajoutée après la présentatio : 

_ Ajout d'un bouton pour ajouter un media a son expostion 

_ Correction du "bug" du lecteur vidéo 

_ Règlage de la date pour le jeu 

Lien du projet : musee-espace-fcpr.vercel.app
