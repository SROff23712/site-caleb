# Guide de démarrage rapide - RABYMN LOCATION

Guide condensé pour démarrer rapidement. Pour plus de détails, consultez [GUIDE_COMPLET.md](GUIDE_COMPLET.md).

## 🚀 Démarrage en 5 minutes

### 1. Installation
```bash
npm install
```

### 2. Configuration Firebase

1. Créez un projet sur [Firebase Console](https://console.firebase.google.com/)
2. Activez **Authentication** → **Google**
3. Créez **Firestore Database** (mode production)
4. Copiez les règles de sécurité depuis `firestore.rules`

### 3. Configuration EmailJS

1. Créez un compte sur [EmailJS](https://www.emailjs.com/)
2. Créez un service email (Gmail)
3. Créez 2 templates :
   - Template Réservation
   - Template Devis
4. Récupérez : Public Key, Service ID, Template IDs

### 4. Variables d'environnement

Créez `.env.local` :

```env
# Firebase (remplacez par vos valeurs)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...

# EmailJS (remplacez par vos valeurs)
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
NEXT_PUBLIC_EMAILJS_TEMPLATE_RESERVATION_ID=...
NEXT_PUBLIC_EMAILJS_TEMPLATE_DEVIS_ID=...
```

### 5. Test local
```bash
npm run dev
```
Ouvrez http://localhost:3000

### 6. Build statique
```bash
npm run build
```
Le site est dans le dossier `out/`

### 7. Déploiement

**Firebase Hosting :**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Dossier public: out
npm run build
firebase deploy --only hosting
```

**Netlify :**
- Glissez-déposez le dossier `out/` sur [Netlify Drop](https://app.netlify.com/drop)

**Vercel :**
- Importez le projet, configurez les variables d'environnement, déployez

## 📋 Checklist rapide

- [ ] Firebase configuré (Auth + Firestore)
- [ ] EmailJS configuré (2 templates)
- [ ] `.env.local` créé avec toutes les variables
- [ ] Site fonctionne en local
- [ ] Site buildé (`npm run build`)
- [ ] Site déployé

## 🔑 Compte admin

Email : `sroff.developement@gmail.com`
→ Droits admin automatiques à la première connexion

## 📚 Documentation complète

Voir [GUIDE_COMPLET.md](GUIDE_COMPLET.md) pour tous les détails.

