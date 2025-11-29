import emailjs from '@emailjs/browser';
import { Reservation, Devis } from './types';

// Initialiser EmailJS (à faire une seule fois)
if (typeof window !== 'undefined') {
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
  if (publicKey) {
    emailjs.init(publicKey);
  }
}

export const sendReservationEmail = async (reservation: Reservation) => {
  try {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_RESERVATION_ID || '';
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

    if (!serviceId || !templateId || !publicKey) {
      console.warn('EmailJS non configuré. Les emails ne seront pas envoyés.');
      return;
    }

    const jours = Math.ceil(
      (new Date(reservation.dateFin).getTime() - new Date(reservation.dateDebut).getTime()) / 
      (1000 * 60 * 60 * 24)
    ) + 1;

    const articlesList = reservation.articles
      .map(item => `${item.articleNom} (x${item.quantite || 1}) - ${item.prix}€/jour`)
      .join('\n');

    const templateParams = {
      to_email: 'sroff.developement@gmail.com',
      user_name: reservation.userName,
      user_email: reservation.userEmail,
      telephone: reservation.telephone || 'Non renseigné',
      adresse: reservation.adresse || 'Non renseigné',
      ville: reservation.ville || 'Non renseigné',
      code_postal: reservation.codePostal || 'Non renseigné',
      date_debut: new Date(reservation.dateDebut).toLocaleDateString('fr-FR'),
      date_fin: new Date(reservation.dateFin).toLocaleDateString('fr-FR'),
      duree: `${jours} jour(s)`,
      articles: articlesList,
      prix_total: reservation.prixTotal.toFixed(2),
      reservation_id: reservation.id,
    };

    await emailjs.send(serviceId, templateId, templateParams);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    // Ne pas bloquer l'application si l'email échoue
  }
};

export const sendAcceptanceEmail = async (reservation: Reservation) => {
  try {
    // Utiliser le template de devis pour l'acceptation (même template, message adapté)
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_DEVIS_ID || '';
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

    if (!serviceId || !templateId || !publicKey) {
      console.warn('EmailJS non configuré. Les emails ne seront pas envoyés.');
      return;
    }

    const jours = Math.ceil(
      (new Date(reservation.dateFin).getTime() - new Date(reservation.dateDebut).getTime()) / 
      (1000 * 60 * 60 * 24)
    ) + 1;

    const articlesList = reservation.articles
      .map(item => {
        const prixItem = item.prix * jours * (item.quantite || 1);
        return `${item.articleNom} | Quantité: ${item.quantite || 1} | Prix/jour: ${item.prix}€ | Durée: ${jours} jours | Total: ${prixItem.toFixed(2)}€`;
      })
      .join('\n');

    const templateParams = {
      to_email: reservation.userEmail,
      // Pas de CC pour l'admin lors de l'acceptation
      entreprise: reservation.userName,
      nom: reservation.userName,
      email: reservation.userEmail,
      telephone: reservation.telephone || 'Non renseigné',
      adresse: reservation.adresse || 'Non renseigné',
      ville: reservation.ville || 'Non renseigné',
      code_postal: reservation.codePostal || 'Non renseigné',
      date_debut: new Date(reservation.dateDebut).toLocaleDateString('fr-FR'),
      date_fin: new Date(reservation.dateFin).toLocaleDateString('fr-FR'),
      duree: `${jours} jour(s)`,
      articles: articlesList,
      prix_total: reservation.prixTotal.toFixed(2),
      devis_id: reservation.id,
    };

    await emailjs.send(serviceId, templateId, templateParams);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email d\'acceptation:', error);
    // Ne pas bloquer l'application si l'email échoue
  }
};

export const sendDevisEmail = async (devis: Devis) => {
  try {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_DEVIS_ID || '';
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

    if (!serviceId || !templateId || !publicKey) {
      console.warn('EmailJS non configuré. Les emails ne seront pas envoyés.');
      return;
    }

    const jours = Math.ceil(
      (new Date(devis.dateFin).getTime() - new Date(devis.dateDebut).getTime()) / 
      (1000 * 60 * 60 * 24)
    ) + 1;

    const articlesList = devis.articles
      .map(item => {
        const prixItem = item.prix * jours * (item.quantite || 1);
        return `${item.articleNom} | Quantité: ${item.quantite || 1} | Prix/jour: ${item.prix}€ | Durée: ${jours} jours | Total: ${prixItem.toFixed(2)}€`;
      })
      .join('\n');

    const templateParams = {
      to_email: devis.email,
      cc_email: 'sroff.developement@gmail.com',
      entreprise: devis.entreprise,
      nom: devis.nom,
      email: devis.email,
      telephone: devis.telephone || 'Non renseigné',
      adresse: devis.adresse || 'Non renseigné',
      ville: devis.ville || 'Non renseigné',
      code_postal: devis.codePostal || 'Non renseigné',
      date_debut: new Date(devis.dateDebut).toLocaleDateString('fr-FR'),
      date_fin: new Date(devis.dateFin).toLocaleDateString('fr-FR'),
      duree: `${jours} jour(s)`,
      articles: articlesList,
      prix_total: devis.prixTotal.toFixed(2),
      devis_id: devis.id,
    };

    await emailjs.send(serviceId, templateId, templateParams);
  } catch (error) {
    console.error('Erreur lors de l\'envoi du devis:', error);
    // Ne pas bloquer l'application si l'email échoue
  }
};

