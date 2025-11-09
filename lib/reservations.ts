import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc,
  query,
  orderBy,
  where 
} from 'firebase/firestore';
import { db } from './firebase';
import { Reservation, ReservationItem, Article } from './types';
import { getArticles } from './articles';
import { differenceInDays } from 'date-fns';

export const createReservation = async (
  userId: string,
  userEmail: string,
  userName: string,
  articles: ReservationItem[],
  dateDebut: string,
  dateFin: string,
  telephone?: string,
  adresse?: string,
  ville?: string,
  codePostal?: string
): Promise<string> => {
  try {
    // Calculer le prix total
    const jours = differenceInDays(new Date(dateFin), new Date(dateDebut)) + 1;
    const prixTotal = articles.reduce((total, item) => {
      return total + (item.prix * jours * (item.quantite || 1));
    }, 0);

    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, 'reservations'), {
      userId,
      userEmail,
      userName,
      telephone,
      adresse,
      ville,
      codePostal,
      articles,
      dateDebut,
      dateFin,
      prixTotal,
      statut: 'en_attente',
      createdAt: now,
      updatedAt: now,
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    throw error;
  }
};

export const getReservations = async (userId?: string): Promise<Reservation[]> => {
  try {
    let q;
    if (userId) {
      q = query(
        collection(db, 'reservations'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Reservation));
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    return [];
  }
};

export const getAcceptedReservations = async (): Promise<Reservation[]> => {
  try {
    // Essayer d'abord avec la requête avec orderBy
    try {
      const q = query(
        collection(db, 'reservations'),
        where('statut', '==', 'acceptee'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const reservations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Reservation));
      
      if (reservations.length > 0 || querySnapshot.empty) {
        return reservations;
      }
    } catch (orderByError: any) {
      // Si l'index n'existe pas, récupérer sans orderBy et trier manuellement
      console.warn('Index Firestore manquant pour acceptées, tri manuel appliqué:', orderByError);
      
      const q = query(
        collection(db, 'reservations'),
        where('statut', '==', 'acceptee')
      );
      const querySnapshot = await getDocs(q);
      const reservations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Reservation));
      
      // Trier manuellement par date de création (plus récent en premier)
      return reservations.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
    }
    
    return [];
  } catch (error: any) {
    console.error('Erreur lors de la récupération des réservations acceptées:', error);
    return [];
  }
};

export const getReservation = async (id: string): Promise<Reservation | null> => {
  try {
    const docRef = doc(db, 'reservations', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Reservation;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation:', error);
    return null;
  }
};

export const updateReservationStatus = async (
  id: string, 
  statut: 'en_attente' | 'acceptee' | 'refusee'
): Promise<void> => {
  try {
    const docRef = doc(db, 'reservations', id);
    await updateDoc(docRef, {
      statut,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réservation:', error);
    throw error;
  }
};

export const getPendingReservations = async (): Promise<Reservation[]> => {
  try {
    // Essayer d'abord avec la requête avec orderBy
    try {
      const q = query(
        collection(db, 'reservations'),
        where('statut', '==', 'en_attente'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const reservations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Reservation));
      
      if (reservations.length > 0 || querySnapshot.empty) {
        return reservations;
      }
    } catch (orderByError: any) {
      // Si l'index n'existe pas, récupérer sans orderBy et trier manuellement
      console.warn('Index Firestore manquant, tri manuel appliqué:', orderByError);
      
      const q = query(
        collection(db, 'reservations'),
        where('statut', '==', 'en_attente')
      );
      const querySnapshot = await getDocs(q);
      const reservations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Reservation));
      
      // Trier manuellement par date de création (plus récent en premier)
      return reservations.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
    }
    
    return [];
  } catch (error: any) {
    console.error('Erreur lors de la récupération des réservations en attente:', error);
    
    // Si l'erreur indique un index manquant, donner des instructions
    if (error.code === 'failed-precondition') {
      console.error('⚠️ Index Firestore manquant. Allez dans Firebase Console → Firestore → Indexes et créez l\'index pour: collection=reservations, statut (Ascending), createdAt (Descending)');
    }
    
    return [];
  }
};

