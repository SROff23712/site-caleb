# Guide de configuration - RABYMN LOCATION

## Étapes de configuration

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Créez un nouveau projet ou utilisez un projet existant
3. Activez les services suivants :
   - **Authentication** : Activez le fournisseur Google
   - **Firestore Database** : Créez une base de données en mode production
   - **Storage** (optionnel) : Pour stocker les images

4. Dans les paramètres du projet, récupérez les informations de configuration
5. Copiez le fichier `.env.example` vers `.env.local` et remplissez les valeurs :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=votre_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id
```

6. Dans Firestore, allez dans "Règles" et copiez le contenu du fichier `firestore.rules`

### 3. Configuration de l'email avec EmailJS

Le site utilise EmailJS pour l'envoi d'emails (fonctionne côté client, pas besoin de serveur) :

1. Créez un compte sur [EmailJS](https://www.emailjs.com/)
2. Créez un service email (Gmail, Outlook, etc.)
3. Créez deux templates d'email :
   - **Template pour les réservations** : Pour notifier les admins des nouvelles demandes
   - **Template pour les devis** : Pour envoyer les devis aux clients
4. Récupérez vos identifiants :
   - Public Key (dans Account → General)
   - Service ID (dans Email Services)
   - Template IDs (dans Email Templates)
5. Ajoutez dans `.env.local` :

```env
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=votre_public_key
NEXT_PUBLIC_EMAILJS_SERVICE_ID=votre_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_RESERVATION_ID=votre_template_reservation_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_DEVIS_ID=votre_template_devis_id
```

**Note :** Le template de devis est utilisé à la fois pour les devis et pour les confirmations d'acceptation de réservation.

**Variables pour les templates EmailJS :**

Template Réservation :
- `to_email` : Email du destinataire (sroff.developement@gmail.com)
- `user_name`, `user_email`, `telephone`, `adresse`, `ville`, `code_postal`
- `date_debut`, `date_fin`, `duree`, `articles`, `prix_total`, `reservation_id`

Template Devis (utilisé aussi pour les acceptations) :
- `to_email` : Email du client
- `cc_email` : Email en copie (sroff.developement@gmail.com) - optionnel
- `entreprise` : Nom de l'utilisateur (utilisé pour le champ entreprise dans le template)
- `nom`, `email`, `telephone`, `adresse`, `ville`, `code_postal`
- `date_debut`, `date_fin`, `duree`, `articles`, `prix_total`, `devis_id`

**Note :** Le template de devis est réutilisé pour les confirmations d'acceptation. Vous n'avez besoin que de 2 templates (réservation + devis).

### 4. Comptes administrateurs

Les comptes admin sont automatiquement créés lors de la première connexion avec l'email suivant :
- `sroff.developement@gmail.com`

Pour ajouter d'autres admins, modifiez le tableau `ADMIN_EMAILS` dans `lib/auth.ts`.

### 5. Lancement du projet en développement

```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

### 6. Génération du site statique

Pour générer le site statique (sans serveur) :

```bash
npm run build
```

Le site statique sera généré dans le dossier `out/`. Vous pouvez déployer ce dossier sur n'importe quel hébergeur statique :
- Firebase Hosting
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- etc.

**Important :** Le site est entièrement statique et ne nécessite pas de serveur Node.js. Toutes les fonctionnalités fonctionnent côté client via Firebase et EmailJS.

## Structure des données Firestore

### Collection `users`
- `email`: string
- `displayName`: string
- `photoURL`: string
- `isAdmin`: boolean
- `createdAt`: string

### Collection `articles`
- `nom`: string
- `image`: string (URL)
- `description`: string
- `prix`: number (prix par jour)
- `disponible`: boolean
- `createdAt`: string
- `updatedAt`: string

### Collection `reservations`
- `userId`: string
- `userEmail`: string
- `userName`: string
- `entreprise`: string (optionnel)
- `telephone`: string (optionnel)
- `adresse`: string (optionnel)
- `ville`: string (optionnel)
- `codePostal`: string (optionnel)
- `articles`: array de ReservationItem
- `dateDebut`: string
- `dateFin`: string
- `prixTotal`: number
- `statut`: 'en_attente' | 'acceptee' | 'refusee'
- `createdAt`: string
- `updatedAt`: string

### Collection `devis`
- `reservationId`: string
- `entreprise`: string
- `nom`: string
- `email`: string
- `telephone`: string (optionnel)
- `adresse`: string (optionnel)
- `ville`: string (optionnel)
- `codePostal`: string (optionnel)
- `articles`: array de ReservationItem
- `dateDebut`: string
- `dateFin`: string
- `prixTotal`: number
- `createdAt`: string

## Déploiement

### Vercel (recommandé)

1. Poussez votre code sur GitHub
2. Connectez votre projet à Vercel
3. Ajoutez les variables d'environnement dans les paramètres Vercel
4. Déployez !

### Autres plateformes

Le projet peut être déployé sur n'importe quelle plateforme supportant Next.js :
- Netlify
- AWS Amplify
- Railway
- etc.

## Notes importantes

- Les images des articles doivent être hébergées ailleurs (Firebase Storage, Cloudinary, etc.) ou utiliser des URLs externes
- Pour la production, configurez les domaines autorisés dans Firebase Authentication
- Les emails sont envoyés via Gmail SMTP, pour la production, considérez utiliser un service dédié (SendGrid, Mailgun, etc.)

