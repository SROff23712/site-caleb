# Guide Complet - RABYMN LOCATION

Ce guide vous accompagne étape par étape pour faire fonctionner complètement votre site de réservation.

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Installation du projet](#installation-du-projet)
3. [Configuration Firebase](#configuration-firebase)
4. [Configuration EmailJS](#configuration-emailjs)
5. [Configuration des variables d'environnement](#configuration-des-variables-denvironnement)
6. [Test en local](#test-en-local)
7. [Génération du site statique](#génération-du-site-statique)
8. [Déploiement](#déploiement)

---

## 1. Prérequis

Avant de commencer, assurez-vous d'avoir :

- ✅ Node.js installé (version 18 ou supérieure) : [Télécharger Node.js](https://nodejs.org/)
- ✅ Un compte Google (pour Firebase)
- ✅ Un compte EmailJS (gratuit) : [Créer un compte EmailJS](https://www.emailjs.com/)
- ✅ Un éditeur de code (VS Code recommandé)

Vérifiez que Node.js est installé :
```bash
node --version
npm --version
```

---

## 2. Installation du projet

### Étape 2.1 : Installer les dépendances

Ouvrez un terminal dans le dossier du projet et exécutez :

```bash
npm install
```

Cette commande installe toutes les dépendances nécessaires (Next.js, React, Firebase, EmailJS, etc.).

**Temps estimé :** 2-5 minutes

---

## 3. Configuration Firebase

### Étape 3.1 : Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur **"Ajouter un projet"** ou **"Add project"**
3. Donnez un nom à votre projet (ex: "rabymn-location")
4. Cliquez sur **"Continuer"** ou **"Continue"**
5. Désactivez Google Analytics (optionnel) ou laissez-le activé
6. Cliquez sur **"Créer le projet"** ou **"Create project"**
7. Attendez que le projet soit créé, puis cliquez sur **"Continuer"**

### Étape 3.2 : Récupérer les identifiants Firebase

1. Dans votre projet Firebase, cliquez sur l'icône **⚙️ (Paramètres)** en haut à gauche
2. Sélectionnez **"Paramètres du projet"** ou **"Project settings"**
3. Descendez jusqu'à la section **"Vos applications"** ou **"Your apps"**
4. Cliquez sur l'icône **`</>` (Web)** pour ajouter une application web
5. Donnez un nom à votre app (ex: "RABYMN LOCATION")
6. **Ne cochez PAS** "Also set up Firebase Hosting" pour l'instant
7. Cliquez sur **"Enregistrer l'application"** ou **"Register app"**
8. **Copiez les valeurs** de la configuration qui s'affiche :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC2XBqBH4pzQT45pE54TzgAxeT_3mSk1AQ",
  authDomain: "location-3351c.firebaseapp.com",
  projectId: "location-3351c",
  storageBucket: "location-3351c.firebasestorage.app",
  messagingSenderId: "159869728909",
  appId: "1:159869728909:web:1049e74278c1be35de0ac4",
  measurementId: "G-HB12FKCFHM"
};
```

**Note :** Vous avez déjà ces valeurs, mais vérifiez qu'elles correspondent bien à votre projet.

### Étape 3.3 : Activer l'authentification Google

1. Dans Firebase Console, allez dans **"Authentification"** ou **"Authentication"** (menu de gauche)
2. Cliquez sur **"Commencer"** ou **"Get started"** si c'est la première fois
3. Allez dans l'onglet **"Méthodes de connexion"** ou **"Sign-in method"**
4. Cliquez sur **"Google"**
5. Activez le fournisseur Google en cliquant sur le bouton **"Activer"** ou **"Enable"**
6. Sélectionnez un **email de support du projet** (vous pouvez utiliser votre email)
7. Cliquez sur **"Enregistrer"** ou **"Save"**

### Étape 3.4 : Créer la base de données Firestore

1. Dans Firebase Console, allez dans **"Firestore Database"** (menu de gauche)
2. Cliquez sur **"Créer une base de données"** ou **"Create database"**
3. Sélectionnez **"Démarrer en mode production"** ou **"Start in production mode"**
4. Choisissez une **localisation** (ex: "europe-west" pour l'Europe)
5. Cliquez sur **"Activer"** ou **"Enable"**
6. Attendez que la base de données soit créée (quelques secondes)

### Étape 3.5 : Configurer les règles de sécurité Firestore

1. Dans Firestore Database, allez dans l'onglet **"Règles"** ou **"Rules"**
2. Remplacez le contenu par les règles suivantes :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour les utilisateurs
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Règles pour les articles
    match /articles/{articleId} {
      allow read: if true; // Tout le monde peut lire les articles
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Règles pour les réservations
    match /reservations/{reservationId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Règles pour les devis
    match /devis/{devisId} {
      allow read: if request.auth != null && 
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true ||
         resource.data.email == request.auth.token.email);
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

3. Cliquez sur **"Publier"** ou **"Publish"**

**Temps estimé :** 10-15 minutes

---

## 4. Configuration EmailJS

### Étape 4.1 : Créer un compte EmailJS

1. Allez sur [EmailJS](https://www.emailjs.com/)
2. Cliquez sur **"Sign Up"** ou **"S'inscrire"**
3. Créez un compte (gratuit jusqu'à 200 emails/mois)
4. Confirmez votre email si nécessaire

### Étape 4.2 : Créer un service email

1. Une fois connecté, allez dans **"Email Services"** (menu de gauche)
2. Cliquez sur **"Add New Service"**
3. Choisissez **"Gmail"** (ou un autre service de votre choix)
4. Cliquez sur **"Connect Account"**
5. Autorisez EmailJS à accéder à votre compte Gmail
6. Donnez un nom à votre service (ex: "gmail-rabymn")
7. **Notez le Service ID** qui s'affiche (ex: "service_xxxxx")

### Étape 4.3 : Récupérer votre Public Key

1. Allez dans **"Account"** → **"General"** (menu de gauche)
2. Trouvez la section **"API Keys"**
3. **Copiez votre Public Key** (ex: "xxxxxxxxxxxxx")

### Étape 4.4 : Créer le template pour les réservations

1. Allez dans **"Email Templates"** (menu de gauche)
2. Cliquez sur **"Create New Template"**
3. Donnez un nom : **"Template Réservation"**
4. Dans le champ **"To Email"**, mettez : `{{to_email}}`
5. Dans le champ **"Subject"**, mettez : `Nouvelle demande de réservation - {{user_name}}`
6. Dans le champ **"Content"**, copiez ce template HTML :

```html
<h2>Nouvelle demande de réservation</h2>

        <p><strong>Nom:</strong> {{user_name}}</p>
        <p><strong>Email:</strong> {{user_email}}</p>
        <p><strong>Téléphone:</strong> {{telephone}}</p>
<p><strong>Adresse:</strong> {{adresse}}</p>
<p><strong>Ville:</strong> {{ville}} {{code_postal}}</p>

<p><strong>Date de début:</strong> {{date_debut}}</p>
<p><strong>Date de fin:</strong> {{date_fin}}</p>
<p><strong>Durée:</strong> {{duree}}</p>

<h3>Articles demandés:</h3>
<pre>{{articles}}</pre>

<p><strong>Prix total:</strong> {{prix_total}}€</p>
<p><strong>ID de la réservation:</strong> {{reservation_id}}</p>
```

7. Cliquez sur **"Save"**
8. **Notez le Template ID** qui s'affiche (ex: "template_xxxxx")

### Étape 4.5 : Créer le template pour les devis (et acceptations)

1. Toujours dans **"Email Templates"**, cliquez sur **"Create New Template"**
2. Donnez un nom : **"Template Devis"**
3. Dans le champ **"To Email"**, mettez : `{{to_email}}`
4. Dans le champ **"CC Email"**, mettez : `{{cc_email}}`
5. Dans le champ **"Subject"**, mettez : `Devis RABYMN LOCATION - {{entreprise}}`
6. Dans le champ **"Content"**, copiez ce template HTML :

```html
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
  <h1 style="color: #ec4899;">RABYMN LOCATION</h1>
  <h2>Devis de location</h2>
  
  <div style="margin: 20px 0;">
    <h3>Informations client</h3>
    <p><strong>Nom:</strong> {{nom}}</p>
    <p><strong>Email:</strong> {{email}}</p>
    <p><strong>Téléphone:</strong> {{telephone}}</p>
    <p><strong>Adresse:</strong> {{adresse}}</p>
    <p><strong>Ville:</strong> {{ville}} {{code_postal}}</p>
  </div>

  <div style="margin: 20px 0;">
    <h3>Détails de la location</h3>
    <p><strong>Date de début:</strong> {{date_debut}}</p>
    <p><strong>Date de fin:</strong> {{date_fin}}</p>
    <p><strong>Durée:</strong> {{duree}}</p>
  </div>

  <div style="margin: 20px 0;">
    <h3>Articles</h3>
    <pre style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">{{articles}}</pre>
  </div>

  <div style="margin: 20px 0;">
    <p style="font-size: 18px; font-weight: bold;">Total: {{prix_total}}€</p>
  </div>

  <p style="margin-top: 30px; color: #666;">
    Ce devis est valable 30 jours. Pour confirmer votre réservation, veuillez nous contacter.
  </p>

  <p style="margin-top: 20px;">
    Cordialement,<br>
    L'équipe RABYMN LOCATION
  </p>
</div>
```

7. Cliquez sur **"Save"**
8. **Notez le Template ID** qui s'affiche (ex: "template_yyyyy")

**Temps estimé :** 15-20 minutes

---

## 5. Configuration des variables d'environnement

### Étape 5.1 : Créer le fichier .env.local

1. À la racine du projet, créez un fichier nommé `.env.local`
2. Ouvrez ce fichier avec un éditeur de texte
3. Copiez-collez le contenu suivant et **remplacez les valeurs** par les vôtres :

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC2XBqBH4pzQT45pE54TzgAxeT_3mSk1AQ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=location-3351c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=location-3351c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=location-3351c.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=159869728909
NEXT_PUBLIC_FIREBASE_APP_ID=1:159869728909:web:1049e74278c1be35de0ac4
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-HB12FKCFHM

# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=votre_public_key_ici
NEXT_PUBLIC_EMAILJS_SERVICE_ID=votre_service_id_ici
NEXT_PUBLIC_EMAILJS_TEMPLATE_RESERVATION_ID=votre_template_reservation_id_ici
NEXT_PUBLIC_EMAILJS_TEMPLATE_DEVIS_ID=votre_template_devis_id_ici
```

**Note :** Le template de devis est utilisé à la fois pour les devis et pour les confirmations d'acceptation de réservation. Vous n'avez besoin que de 2 templates au total.

4. **Remplacez** :
   - `votre_public_key_ici` par votre Public Key EmailJS
   - `votre_service_id_ici` par votre Service ID EmailJS
   - `votre_template_reservation_id_ici` par l'ID du template réservation
   - `votre_template_devis_id_ici` par l'ID du template devis

**Exemple de fichier .env.local complet :**

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC2XBqBH4pzQT45pE54TzgAxeT_3mSk1AQ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=location-3351c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=location-3351c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=location-3351c.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=159869728909
NEXT_PUBLIC_FIREBASE_APP_ID=1:159869728909:web:1049e74278c1be35de0ac4
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-HB12FKCFHM

# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=abc123xyz789
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_gmail123
NEXT_PUBLIC_EMAILJS_TEMPLATE_RESERVATION_ID=template_reservation456
NEXT_PUBLIC_EMAILJS_TEMPLATE_DEVIS_ID=template_devis789
```

**⚠️ Important :** Ne partagez JAMAIS ce fichier `.env.local` publiquement. Il contient des clés secrètes.

**Temps estimé :** 5 minutes

---

## 6. Test en local

### Étape 6.1 : Lancer le serveur de développement

Dans le terminal, à la racine du projet, exécutez :

```bash
npm run dev
```

Vous devriez voir un message comme :
```
✓ Ready in 2.5s
○ Local:        http://localhost:3000
```

### Étape 6.2 : Ouvrir le site

1. Ouvrez votre navigateur
2. Allez sur `http://localhost:3000`
3. Vous devriez voir la page d'accueil de RABYMN LOCATION

### Étape 6.3 : Tester la connexion Google

1. Cliquez sur **"Connexion"** dans le menu
2. Cliquez sur **"Se connecter avec Google"**
3. Sélectionnez votre compte Google
4. Autorisez l'application
5. Vous devriez être redirigé vers la page d'accueil et voir votre nom dans le menu

**Note :** Si vous vous connectez avec `sroff.developement@gmail.com`, vous aurez automatiquement les droits administrateur.

### Étape 6.4 : Tester en tant qu'admin (optionnel)

1. Connectez-vous avec `sroff.developement@gmail.com`
2. Vous devriez voir un lien **"Admin"** dans le menu
3. Cliquez dessus pour accéder au panel admin
4. Vous pouvez ajouter des articles depuis le panel admin

### Étape 6.5 : Tester une réservation

1. Allez sur la page **"Réservation"**
2. Remplissez le formulaire :
   - Sélectionnez des dates (début et fin)
   - Ajoutez des articles (si vous en avez créé)
   - Remplissez vos informations
3. Cliquez sur **"Envoyer la demande de réservation"**
4. Vérifiez que vous recevez un email de notification (si EmailJS est configuré)

**Temps estimé :** 10-15 minutes

---

## 7. Génération du site statique

### Étape 7.1 : Arrêter le serveur de développement

Si le serveur de développement est encore en cours d'exécution, appuyez sur `Ctrl + C` dans le terminal.

### Étape 7.2 : Générer le site statique

Exécutez la commande :

```bash
npm run build
```

Cette commande va :
- Compiler votre application Next.js
- Générer tous les fichiers HTML, CSS et JavaScript
- Créer un dossier `out/` contenant le site statique

**Temps estimé :** 2-5 minutes

### Étape 7.3 : Vérifier le dossier out/

1. Ouvrez le dossier `out/` à la racine du projet
2. Vous devriez voir des fichiers HTML, CSS et JavaScript
3. C'est ce dossier que vous allez déployer

**Temps estimé :** 1 minute

---

## 8. Déploiement

Vous avez plusieurs options pour déployer votre site statique. Choisissez celle qui vous convient le mieux.

### Option A : Firebase Hosting (Recommandé)

#### Étape A.1 : Installer Firebase CLI

```bash
npm install -g firebase-tools
```

#### Étape A.2 : Se connecter à Firebase

```bash
firebase login
```

Cela ouvrira votre navigateur pour vous connecter avec votre compte Google.

#### Étape A.3 : Initialiser Firebase Hosting

```bash
firebase init hosting
```

Répondez aux questions :
- **Select a default Firebase project** : Choisissez votre projet
- **What do you want to use as your public directory?** : Tapez `out`
- **Configure as a single-page app?** : Tapez `N` (Non)
- **Set up automatic builds and deploys with GitHub?** : Tapez `N` (Non)
- **File out/index.html already exists. Overwrite?** : Tapez `N` (Non)

#### Étape A.4 : Déployer

```bash
npm run build
firebase deploy --only hosting
```

Votre site sera accessible sur une URL comme : `https://votre-projet.web.app`

### Option B : Netlify

#### Étape B.1 : Créer un compte Netlify

1. Allez sur [Netlify](https://www.netlify.com/)
2. Créez un compte (gratuit)

#### Étape B.2 : Déployer via glisser-déposer

1. Générez le site : `npm run build`
2. Allez sur [Netlify Drop](https://app.netlify.com/drop)
3. Glissez-déposez le dossier `out/` sur la page
4. Votre site sera déployé automatiquement

#### Étape B.3 : Configurer les variables d'environnement (si déploiement via Git)

1. Dans Netlify, allez dans **Site settings** → **Environment variables**
2. Ajoutez toutes les variables `NEXT_PUBLIC_*` de votre `.env.local`
3. Configurez le build :
   - Build command : `npm run build`
   - Publish directory : `out`

### Option C : Vercel

#### Étape C.1 : Créer un compte Vercel

1. Allez sur [Vercel](https://vercel.com/)
2. Créez un compte (gratuit)

#### Étape C.2 : Importer le projet

1. Cliquez sur **"Add New Project"**
2. Importez votre projet depuis GitHub/GitLab (ou utilisez Vercel CLI)
3. Vercel détectera automatiquement Next.js
4. Ajoutez les variables d'environnement dans les paramètres
5. Déployez !

### Option D : GitHub Pages

#### Étape D.1 : Installer gh-pages

```bash
npm install --save-dev gh-pages
```

#### Étape D.2 : Ajouter le script dans package.json

Ajoutez dans la section `scripts` de `package.json` :

```json
"deploy": "npm run build && gh-pages -d out"
```

#### Étape D.3 : Déployer

```bash
npm run deploy
```

**Temps estimé :** 10-20 minutes selon l'option choisie

---

## ✅ Checklist finale

Avant de considérer que tout est prêt, vérifiez :

- [ ] Firebase est configuré avec Authentication Google activé
- [ ] Firestore est créé avec les bonnes règles de sécurité
- [ ] EmailJS est configuré avec les 2 templates créés
- [ ] Le fichier `.env.local` contient toutes les variables nécessaires
- [ ] Le site fonctionne en local (`npm run dev`)
- [ ] La connexion Google fonctionne
- [ ] Le panel admin est accessible (avec sroff.developement@gmail.com)
- [ ] Les réservations peuvent être créées
- [ ] Les emails sont envoyés (testez avec une vraie réservation)
- [ ] Le site statique est généré (`npm run build`)
- [ ] Le site est déployé et accessible en ligne

---

## 🆘 Résolution de problèmes

### Problème : "Firebase: Error (auth/unauthorized-domain)"

**Solution :** Dans Firebase Console → Authentication → Settings → Authorized domains, ajoutez votre domaine.

### Problème : "EmailJS: Service not found"

**Solution :** Vérifiez que vos variables d'environnement EmailJS sont correctes dans `.env.local`.

### Problème : "Firestore: Permission denied"

**Solution :** Vérifiez que les règles de sécurité Firestore sont correctement publiées (voir étape 3.5).

### Problème : Le site ne se charge pas après le build

**Solution :** Vérifiez que toutes les variables `NEXT_PUBLIC_*` sont bien définies dans votre plateforme de déploiement.

### Problème : Les images ne s'affichent pas

**Solution :** Assurez-vous que les URLs des images sont accessibles publiquement (pas de CORS).

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs dans la console du navigateur (F12)
2. Vérifiez les logs Firebase dans la console Firebase
3. Vérifiez les logs EmailJS dans votre compte EmailJS
4. Consultez la documentation :
   - [Firebase Documentation](https://firebase.google.com/docs)
   - [EmailJS Documentation](https://www.emailjs.com/docs/)
   - [Next.js Documentation](https://nextjs.org/docs)

---

**Félicitations ! 🎉 Votre site RABYMN LOCATION est maintenant opérationnel !**

