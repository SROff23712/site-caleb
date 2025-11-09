export interface Article {
  id: string;
  nom: string;
  image: string;
  description: string;
  prix: number; // Prix par jour
  disponible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationItem {
  articleId: string;
  articleNom: string;
  prix: number;
  quantite?: number;
}

export interface Reservation {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  entreprise?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  articles: ReservationItem[];
  dateDebut: string;
  dateFin: string;
  prixTotal: number;
  statut: 'en_attente' | 'acceptee' | 'refusee';
  createdAt: string;
  updatedAt: string;
}

export interface Devis {
  id: string;
  reservationId: string;
  entreprise: string;
  nom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  articles: ReservationItem[];
  dateDebut: string;
  dateFin: string;
  prixTotal: number;
  createdAt: string;
}

