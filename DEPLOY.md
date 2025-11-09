# Guide de déploiement - Site statique

Ce site est entièrement statique et peut être déployé sur n'importe quel hébergeur de fichiers statiques.

## Génération du site statique

```bash
npm install
npm run build
```

Le site sera généré dans le dossier `out/`. Ce dossier contient tous les fichiers HTML, CSS et JavaScript nécessaires.

## Options de déploiement

### 1. Firebase Hosting (Recommandé)

1. Installez Firebase CLI :
```bash
npm install -g firebase-tools
```

2. Connectez-vous :
```bash
firebase login
```

3. Initialisez Firebase Hosting :
```bash
firebase init hosting
```
- Sélectionnez votre projet Firebase
- Dossier public : `out`
- Configurez comme SPA : `No` (Next.js gère déjà le routing)
- Overwrite index.html : `No`

4. Déployez :
```bash
npm run build
firebase deploy --only hosting
```

### 2. Netlify

1. Connectez votre dépôt GitHub/GitLab
2. Paramètres de build :
   - Build command : `npm run build`
   - Publish directory : `out`
3. Variables d'environnement : Ajoutez toutes les variables `NEXT_PUBLIC_*` dans les paramètres
4. Déployez automatiquement à chaque push

### 3. Vercel

1. Connectez votre dépôt
2. Vercel détectera automatiquement Next.js
3. Configurez les variables d'environnement
4. Déployez

**Note :** Pour Vercel, vous pouvez aussi utiliser le mode statique en configurant `output: 'export'` dans `next.config.js` (déjà fait).

### 4. GitHub Pages

1. Installez `gh-pages` :
```bash
npm install --save-dev gh-pages
```

2. Ajoutez dans `package.json` :
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d out"
}
```

3. Déployez :
```bash
npm run deploy
```

### 5. Serveur web classique (Apache/Nginx)

1. Générez le site :
```bash
npm run build
```

2. Copiez le contenu du dossier `out/` vers votre serveur web
3. Configurez votre serveur pour servir les fichiers statiques

## Variables d'environnement

Assurez-vous que toutes les variables d'environnement `NEXT_PUBLIC_*` sont configurées dans votre plateforme de déploiement :

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_RESERVATION_ID`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_DEVIS_ID`

## Configuration Firebase pour la production

1. Dans Firebase Console, allez dans Authentication → Settings → Authorized domains
2. Ajoutez votre domaine de production
3. Dans Firestore, vérifiez que les règles de sécurité sont correctes (voir `firestore.rules`)

## Notes importantes

- Le site est **100% statique** : aucun serveur Node.js n'est nécessaire
- Toutes les fonctionnalités fonctionnent côté client via Firebase et EmailJS
- Les données sont stockées dans Firestore (Firebase)
- Les emails sont envoyés via EmailJS (service externe)
- Le site peut être hébergé gratuitement sur Firebase Hosting, Netlify, ou Vercel

