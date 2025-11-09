# Template EmailJS - Confirmation d'acceptation

Ce guide vous explique comment créer le template EmailJS pour l'email de confirmation d'acceptation de réservation.

## Création du template

1. Allez dans **EmailJS** → **Email Templates**
2. Cliquez sur **"Create New Template"**
3. Donnez un nom : **"Template Acceptation"**

## Configuration du template

### Champs de base

- **To Email** : `{{to_email}}`
- **CC Email** : `{{cc_email}}`
- **Subject** : `Votre réservation a été acceptée - RABYMN LOCATION`

### Contenu HTML

Copiez ce template HTML dans le champ **Content** :

```html
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #ec4899; font-size: 32px; margin: 0;">RABYMN LOCATION</h1>
  </div>
  
  <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; margin-bottom: 30px; border-radius: 5px;">
    <h2 style="color: #22c55e; margin-top: 0;">✅ Votre réservation a été acceptée !</h2>
    <p style="font-size: 16px; color: #166534; margin: 0;">
      Bonne nouvelle ! Votre demande de réservation a été validée par notre équipe.
    </p>
  </div>

  <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
    <h3 style="color: #1f2937; border-bottom: 2px solid #ec4899; padding-bottom: 10px; margin-top: 0;">
      Détails de votre réservation
    </h3>
    
    <div style="margin: 20px 0;">
      <p style="margin: 8px 0;"><strong style="color: #4b5563;">Nom :</strong> {{user_name}}</p>
      <p style="margin: 8px 0;"><strong style="color: #4b5563;">Email :</strong> {{to_email}}</p>
      {{#entreprise}}<p style="margin: 8px 0;"><strong style="color: #4b5563;">Entreprise :</strong> {{entreprise}}</p>{{/entreprise}}
      <p style="margin: 8px 0;"><strong style="color: #4b5563;">Téléphone :</strong> {{telephone}}</p>
      <p style="margin: 8px 0;"><strong style="color: #4b5563;">Adresse :</strong> {{adresse}}</p>
      <p style="margin: 8px 0;"><strong style="color: #4b5563;">Ville :</strong> {{ville}} {{code_postal}}</p>
    </div>

    <div style="margin: 20px 0; padding: 15px; background-color: #f9fafb; border-radius: 5px;">
      <p style="margin: 8px 0;"><strong style="color: #4b5563;">Date de début :</strong> {{date_debut}}</p>
      <p style="margin: 8px 0;"><strong style="color: #4b5563;">Date de fin :</strong> {{date_fin}}</p>
      <p style="margin: 8px 0;"><strong style="color: #4b5563;">Durée :</strong> {{duree}}</p>
    </div>

    <div style="margin: 20px 0;">
      <h4 style="color: #1f2937; margin-bottom: 10px;">Articles réservés :</h4>
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; font-family: monospace; white-space: pre-wrap;">{{articles}}</div>
    </div>

    <div style="margin: 20px 0; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 5px;">
      <p style="margin: 0; font-size: 18px; font-weight: bold; color: #92400e;">
        Prix total : {{prix_total}}€
      </p>
    </div>
  </div>

  <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 30px; border-radius: 5px;">
    <h3 style="color: #1e40af; margin-top: 0;">📞 Prochaines étapes</h3>
    <p style="color: #1e3a8a; margin: 10px 0;">
      Votre réservation est confirmée ! Pour finaliser votre commande et procéder au paiement, 
      veuillez nous contacter à l'adresse suivante :
    </p>
    <p style="color: #1e3a8a; margin: 10px 0; font-weight: bold;">
      📧 Email : sroff.developement@gmail.com
    </p>
    <p style="color: #1e3a8a; margin: 10px 0;">
      Nous vous contacterons dans les plus brefs délais pour discuter des modalités de paiement 
      et organiser la livraison/récupération du matériel.
    </p>
  </div>

  <div style="text-align: center; padding: 20px; background-color: #f9fafb; border-radius: 5px;">
    <p style="color: #6b7280; margin: 5px 0;">Merci de votre confiance !</p>
    <p style="color: #6b7280; margin: 5px 0; font-weight: bold;">L'équipe RABYMN LOCATION</p>
    <p style="color: #9ca3af; margin: 10px 0 0 0; font-size: 12px;">
      ID de réservation : {{reservation_id}}
    </p>
  </div>
</div>
```

## Variables utilisées

Le template utilise les variables suivantes (automatiquement remplies) :

- `{{to_email}}` - Email du client
- `{{cc_email}}` - Email en copie (sroff.developement@gmail.com)
- `{{user_name}}` - Nom du client
- `{{entreprise}}` - Nom de l'entreprise (optionnel)
- `{{telephone}}` - Téléphone
- `{{adresse}}` - Adresse
- `{{ville}}` - Ville
- `{{code_postal}}` - Code postal
- `{{date_debut}}` - Date de début
- `{{date_fin}}` - Date de fin
- `{{duree}}` - Durée en jours
- `{{articles}}` - Liste des articles
- `{{prix_total}}` - Prix total
- `{{reservation_id}}` - ID de la réservation

## Ajouter le Template ID dans .env.local

Une fois le template créé, récupérez son **Template ID** et ajoutez-le dans votre fichier `.env.local` :

```env
NEXT_PUBLIC_EMAILJS_TEMPLATE_ACCEPTANCE_ID=votre_template_acceptance_id_ici
```

## Test

Pour tester le template :
1. Acceptez une réservation depuis le panel admin
2. Vérifiez que l'email est bien envoyé au client
3. Vérifiez que vous recevez une copie sur sroff.developement@gmail.com

