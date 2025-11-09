# Déploiement sur Vercel - Guide complet

Oui, votre site fonctionnera parfaitement sur Vercel ! Voici comment le déployer.

## ✅ Prérequis

1. Un compte GitHub
2. Un compte Vercel (gratuit)
3. Votre projet configuré avec Firebase et EmailJS

## 🚀 Étapes de déploiement

### Étape 1 : Pousser le code sur GitHub

1. Créez un nouveau dépôt sur GitHub (ou utilisez un existant)
2. Dans votre terminal, à la racine du projet :

```bash
# Initialiser Git si ce n'est pas déjà fait
git init

# Ajouter tous les fichiers
git add .

# Faire un commit
git commit -m "Initial commit - RABYMN LOCATION"

# Ajouter le remote GitHub
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git

# Pousser le code
git branch -M main
git push -u origin main
```

### Étape 2 : Connecter le projet à Vercel

1. Allez sur [Vercel](https://vercel.com/)
2. Connectez-vous avec votre compte GitHub
3. Cliquez sur **"Add New Project"** ou **"Nouveau projet"**
4. Sélectionnez votre dépôt GitHub
5. Vercel détectera automatiquement Next.js

### Étape 3 : Configurer les variables d'environnement

**⚠️ IMPORTANT :** Vous devez ajouter toutes vos variables d'environnement dans Vercel.

Dans la page de configuration du projet Vercel, allez dans **"Environment Variables"** et ajoutez :

#### Variables Firebase :
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAHsfpBjNcyXjk3mV8RWD7D3OoiG0xMljU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=location-ef34b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=location-ef34b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=location-ef34b.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=810899810023
NEXT_PUBLIC_FIREBASE_APP_ID=1:810899810023:web:866340219df45598b32442
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-YWHBR2TNHE
```

#### Variables EmailJS :
```
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=votre_public_key
NEXT_PUBLIC_EMAILJS_SERVICE_ID=votre_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_RESERVATION_ID=votre_template_reservation_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_DEVIS_ID=votre_template_devis_id
```

**Important :** Ajoutez ces variables pour **Production**, **Preview** et **Development**.

### Étape 4 : Configurer les paramètres de build

Vercel devrait détecter automatiquement Next.js, mais vérifiez :

- **Framework Preset** : Next.js
- **Build Command** : `npm run build` (automatique)
- **Output Directory** : `.next` (automatique pour Next.js)
- **Install Command** : `npm install` (automatique)

**Note :** Même si votre site est statique (`output: 'export'`), Vercel gère automatiquement Next.js.

### Étape 5 : Déployer

1. Cliquez sur **"Deploy"**
2. Attendez que le build se termine (2-5 minutes)
3. Votre site sera accessible sur une URL comme : `https://votre-projet.vercel.app`

## 🔧 Configuration Firebase pour la production

### Ajouter votre domaine Vercel dans Firebase

1. Allez dans [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet
3. Allez dans **Authentication** → **Settings** → **Authorized domains**
4. Ajoutez votre domaine Vercel (ex: `votre-projet.vercel.app`)
5. Si vous avez un domaine personnalisé, ajoutez-le aussi

## 📝 Configuration du domaine personnalisé (optionnel)

1. Dans Vercel, allez dans **Settings** → **Domains**
2. Ajoutez votre domaine (ex: `rabymn-location.com`)
3. Suivez les instructions pour configurer les DNS
4. Ajoutez aussi ce domaine dans Firebase Authorized domains

## ✅ Vérifications après déploiement

1. **Testez la connexion Google** : Connectez-vous avec votre compte
2. **Testez une réservation** : Créez une demande de réservation
3. **Testez le panel admin** : Connectez-vous avec `sroff.developement@gmail.com`
4. **Vérifiez les emails** : Assurez-vous que les emails sont bien envoyés

## 🔄 Mises à jour automatiques

Une fois connecté à GitHub, chaque `git push` déclenchera automatiquement un nouveau déploiement sur Vercel.

## ⚠️ Points importants

1. **Variables d'environnement** : N'oubliez pas de les ajouter dans Vercel
2. **Firebase Authorized domains** : Ajoutez votre domaine Vercel
3. **Index Firestore** : Créez l'index si nécessaire (voir FIRESTORE_INDEX.md)
4. **EmailJS** : Vérifiez que vos templates sont bien configurés

## 🐛 Résolution de problèmes

### Le site ne se charge pas
- Vérifiez que toutes les variables d'environnement sont bien configurées
- Vérifiez les logs de build dans Vercel

### Erreur Firebase "unauthorized-domain"
- Ajoutez votre domaine Vercel dans Firebase Authorized domains

### Les emails ne sont pas envoyés
- Vérifiez que les variables EmailJS sont correctes
- Vérifiez les logs dans la console du navigateur (F12)

### Les réservations n'apparaissent pas
- Créez l'index Firestore (voir FIRESTORE_INDEX.md)
- Vérifiez les règles de sécurité Firestore

## 📊 Monitoring

Vercel fournit :
- Analytics de trafic
- Logs en temps réel
- Métriques de performance
- Alertes en cas d'erreur

Tout est gratuit pour commencer !

---

**Votre site sera 100% fonctionnel sur Vercel ! 🚀**

