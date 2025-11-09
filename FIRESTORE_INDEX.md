# Configuration de l'index Firestore

Si les demandes de réservation n'apparaissent pas dans le panel admin, c'est probablement parce que l'index Firestore n'est pas créé.

## Solution automatique (recommandée)

1. Allez dans [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet
3. Allez dans **Firestore Database** → **Indexes**
4. Si vous voyez un message d'erreur avec un lien "Create index", cliquez dessus
5. Firebase créera automatiquement l'index nécessaire

## Solution manuelle

1. Allez dans [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet
3. Allez dans **Firestore Database** → **Indexes**
4. Cliquez sur **"Create Index"** ou **"Créer un index"**
5. Configurez l'index :
   - **Collection ID** : `reservations`
   - **Fields to index** :
     - `statut` : Ascending
     - `createdAt` : Descending
6. Cliquez sur **"Create"** ou **"Créer"**
7. Attendez que l'index soit créé (quelques minutes)

## Utiliser le fichier firestore.indexes.json

Si vous utilisez Firebase CLI :

```bash
firebase deploy --only firestore:indexes
```

Cela créera automatiquement tous les index nécessaires définis dans `firestore.indexes.json`.

## Vérification

Après avoir créé l'index :
1. Rechargez la page admin
2. Les demandes en attente devraient apparaître
3. Si ce n'est pas le cas, vérifiez la console du navigateur (F12) pour voir les erreurs

## Note

Le code gère automatiquement le cas où l'index n'existe pas en triant manuellement les résultats. Cependant, pour de meilleures performances, il est recommandé de créer l'index Firestore.

