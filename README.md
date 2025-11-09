# RABYMN LOCATION

Site de réservation de matériel de mariage avec système d'authentification Google via Firebase.

**✨ Site 100% statique** - Aucun serveur nécessaire, peut être hébergé sur n'importe quel hébergeur de fichiers statiques.

## Fonctionnalités

- 🔐 Authentification Google via Firebase
- 👥 Gestion des utilisateurs (admin et clients)
- 📦 Gestion des articles (nom, image, description, prix/jour)
- 📅 Système de réservation avec sélection de dates
- 📧 Envoi d'emails automatiques via EmailJS (côté client)
- 💼 Panel admin pour gérer les demandes (accepter/refuser)
- 📄 Génération automatique de devis avec envoi par email
- 🎨 Interface moderne avec thème rose
- 🚀 Site statique - Déployable partout sans serveur

## Configuration

### 1. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=votre_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id

# EmailJS Configuration (pour l'envoi d'emails côté client)
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=votre_public_key
NEXT_PUBLIC_EMAILJS_SERVICE_ID=votre_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_RESERVATION_ID=votre_template_reservation_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_DEVIS_ID=votre_template_devis_id
```

### 2. Configuration Firebase

1. Créez un projet Firebase sur [Firebase Console](https://console.firebase.google.com/)
2. Activez l'authentification Google
3. Créez une base de données Firestore
4. Configurez les règles de sécurité Firestore :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null;
    }
    
    match /articles/{articleId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    match /reservations/{reservationId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    match /devis/{devisId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

### 3. Configuration EmailJS

Voir le guide détaillé dans [SETUP.md](SETUP.md) pour configurer EmailJS.

## Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Génération du site statique

```bash
npm run build
```

Le site statique sera généré dans le dossier `out/`. Voir [DEPLOY.md](DEPLOY.md) pour les options de déploiement.

## Comptes Admin

Les comptes admin sont automatiquement créés lors de la première connexion avec l'email suivant :
- `sroff.developement@gmail.com`

## Structure du projet

```
├── app/
│   ├── admin/            # Panel administrateur
│   ├── login/            # Page de connexion
│   ├── reservation/      # Page de réservation
│   └── page.tsx          # Page d'accueil
├── components/           # Composants React
├── lib/                  # Utilitaires et fonctions
│   ├── firebase.ts       # Configuration Firebase
│   ├── auth.ts           # Fonctions d'authentification
│   ├── articles.ts       # Gestion des articles
│   ├── reservations.ts   # Gestion des réservations
│   ├── emailjs.ts        # Envoi d'emails via EmailJS
│   └── types.ts          # Types TypeScript
└── public/               # Fichiers statiques
```

## Technologies utilisées

- Next.js 14 (export statique)
- React 18
- TypeScript
- Firebase (Auth, Firestore, Analytics)
- EmailJS (envoi d'emails côté client)
- Tailwind CSS
- date-fns
- react-datepicker

## Guides

- **[GUIDE_COMPLET.md](GUIDE_COMPLET.md)** ⭐ - **Guide étape par étape complet** (commencez ici !)
- **[QUICK_START.md](QUICK_START.md)** - Guide de démarrage rapide
- **[SETUP.md](SETUP.md)** - Guide de configuration détaillée
- **[VERCEL_DEPLOY.md](VERCEL_DEPLOY.md)** ⚡ - **Déploiement sur Vercel (recommandé)**
- **[DEPLOY.md](DEPLOY.md)** - Guide de déploiement du site statique

