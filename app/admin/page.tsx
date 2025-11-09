'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/components/AuthProvider';
import { getPendingReservations, updateReservationStatus, getReservation, getAcceptedReservations } from '@/lib/reservations';
import type { Reservation, Devis } from '@/lib/types';
import { differenceInDays } from 'date-fns';

export default function AdminPage() {
  const { user, userIsAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [acceptedReservations, setAcceptedReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'reservations' | 'accepted' | 'articles'>('reservations');

  useEffect(() => {
    if (!authLoading) {
      if (!user || !userIsAdmin) {
        router.push('/');
        return;
      }
      loadReservations();
      loadAcceptedReservations();
    }
  }, [user, userIsAdmin, authLoading, router]);

  useEffect(() => {
    // Rafraîchir automatiquement toutes les 5 secondes selon l'onglet actif
    if (!user || !userIsAdmin) return;
    
    const interval = setInterval(() => {
      if (selectedTab === 'reservations') {
        loadReservations();
      } else if (selectedTab === 'accepted') {
        loadAcceptedReservations();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [selectedTab, user, userIsAdmin]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await getPendingReservations();
      console.log('Réservations en attente chargées:', data);
      setReservations(data);
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAcceptedReservations = async () => {
    try {
      setLoading(true);
      const data = await getAcceptedReservations();
      console.log('Réservations acceptées chargées:', data);
      setAcceptedReservations(data);
    } catch (error) {
      console.error('Erreur lors du chargement des réservations acceptées:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (reservationId: string) => {
    try {
      await updateReservationStatus(reservationId, 'acceptee');
      
      // Envoyer l'email de confirmation d'acceptation
      const reservation = await getReservation(reservationId);
      if (reservation) {
        // Créer le devis dans Firestore
        const { addDoc, collection } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');

        const devis: Omit<Devis, 'id'> = {
          reservationId: reservation.id,
          entreprise: reservation.userName,
          nom: reservation.userName,
          email: reservation.userEmail,
          telephone: reservation.telephone,
          adresse: reservation.adresse,
          ville: reservation.ville,
          codePostal: reservation.codePostal,
          articles: reservation.articles,
          dateDebut: reservation.dateDebut,
          dateFin: reservation.dateFin,
          prixTotal: reservation.prixTotal,
          createdAt: new Date().toISOString(),
        };

        await addDoc(collection(db, 'devis'), devis);
        
        // Envoyer l'email de confirmation d'acceptation
        const { sendAcceptanceEmail } = await import('@/lib/emailjs');
        await sendAcceptanceEmail(reservation);
      }
      
      alert('Réservation acceptée ! Un email de confirmation a été envoyé au client.');
      loadReservations();
      loadAcceptedReservations();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'acceptation de la réservation');
    }
  };

  const handleReject = async (reservationId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir refuser cette réservation?')) {
      return;
    }
    
    try {
      await updateReservationStatus(reservationId, 'refusee');
      alert('Réservation refusée');
      loadReservations();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du refus de la réservation');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-4">
            Panel Administrateur
          </h1>
          <p className="text-gray-600 text-lg">Gérez les réservations et les articles</p>
        </div>

        <div className="flex gap-4 mb-10 justify-center items-center flex-wrap bg-white rounded-2xl shadow-md p-4 border border-primary-100">
          <button
            onClick={() => {
              setSelectedTab('reservations');
              loadReservations();
            }}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              selectedTab === 'reservations'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                : 'bg-white text-primary-600 border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50'
            }`}
          >
            Demandes en attente
          </button>
          <button
            onClick={() => {
              setSelectedTab('accepted');
              loadAcceptedReservations();
            }}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              selectedTab === 'accepted'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                : 'bg-white text-primary-600 border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50'
            }`}
          >
            Demandes acceptées
          </button>
          <button
            onClick={() => setSelectedTab('articles')}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              selectedTab === 'articles'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                : 'bg-white text-primary-600 border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50'
            }`}
          >
            Gestion des articles
          </button>
          {(selectedTab === 'reservations' || selectedTab === 'accepted') && (
            <button
              onClick={selectedTab === 'reservations' ? loadReservations : loadAcceptedReservations}
              className="px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-full font-semibold transition-all duration-300 border border-primary-200"
              title="Rafraîchir"
            >
              🔄 Actualiser
            </button>
          )}
        </div>

        {selectedTab === 'reservations' && (
          <div>
            <h2 className="text-2xl font-bold text-primary-700 mb-6">
              Demandes en attente ({reservations.length})
            </h2>
            
            {reservations.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-gray-600">Aucune demande en attente.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reservations.map((reservation) => {
                  const jours = differenceInDays(new Date(reservation.dateFin), new Date(reservation.dateDebut)) + 1;
                  
                  return (
                    <div key={reservation.id} className="bg-white rounded-lg shadow-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="text-xl font-bold text-primary-700 mb-4">
                            Informations client
                          </h3>
                          <p><strong>Nom:</strong> {reservation.userName}</p>
                          <p><strong>Email:</strong> {reservation.userEmail}</p>
                          {reservation.telephone && (
                            <p><strong>Téléphone:</strong> {reservation.telephone}</p>
                          )}
                          {reservation.adresse && (
                            <p><strong>Adresse:</strong> {reservation.adresse}</p>
                          )}
                          {reservation.ville && (
                            <p><strong>Ville:</strong> {reservation.ville} {reservation.codePostal || ''}</p>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-bold text-primary-700 mb-4">
                            Détails de la réservation
                          </h3>
                          <p><strong>Date de début:</strong> {new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}</p>
                          <p><strong>Date de fin:</strong> {new Date(reservation.dateFin).toLocaleDateString('fr-FR')}</p>
                          <p><strong>Durée:</strong> {jours} jour(s)</p>
                          <p><strong>Prix total:</strong> {reservation.prixTotal.toFixed(2)}€</p>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-primary-700 mb-4">
                          Articles demandés
                        </h3>
                        <ul className="space-y-2">
                          {reservation.articles.map((item, index) => (
                            <li key={index} className="flex justify-between">
                              <span>
                                {item.articleNom} (x{item.quantite || 1}) - {item.prix}€/jour
                              </span>
                              <span className="font-semibold">
                                {(item.prix * jours * (item.quantite || 1)).toFixed(2)}€
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleAccept(reservation.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                          Accepter et envoyer le devis
                        </button>
                        <button
                          onClick={() => handleReject(reservation.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                          Refuser
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {selectedTab === 'accepted' && (
          <div>
            <h2 className="text-3xl font-bold text-primary-700 mb-8 flex items-center gap-3">
              <span className="w-1 h-10 bg-gradient-to-b from-green-500 to-green-400 rounded-full"></span>
              Demandes acceptées
              <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-lg font-semibold">
                {acceptedReservations.length}
              </span>
            </h2>
            
            {acceptedReservations.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-primary-100">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-gray-600 text-lg">Aucune demande acceptée pour le moment.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {acceptedReservations.map((reservation) => {
                  const jours = differenceInDays(new Date(reservation.dateFin), new Date(reservation.dateDebut)) + 1;
                  
                  return (
                    <div key={reservation.id} className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-6">
                        <span className="bg-gradient-to-r from-green-100 to-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold border border-green-200">
                          ✓ Acceptée
                        </span>
                        <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                          Acceptée le {new Date(reservation.updatedAt || reservation.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-green-50/50 rounded-xl p-6">
                          <h3 className="text-xl font-bold text-primary-700 mb-4 flex items-center gap-2">
                            <span className="text-2xl">👤</span>
                            Informations client
                          </h3>
                          <div className="space-y-2 text-gray-700">
                            <p><strong className="text-primary-600">Nom:</strong> {reservation.userName}</p>
                            <p><strong className="text-primary-600">Email:</strong> {reservation.userEmail}</p>
                            {reservation.telephone && (
                              <p><strong className="text-primary-600">Téléphone:</strong> {reservation.telephone}</p>
                            )}
                            {reservation.adresse && (
                              <p><strong className="text-primary-600">Adresse:</strong> {reservation.adresse}</p>
                            )}
                            {reservation.ville && (
                              <p><strong className="text-primary-600">Ville:</strong> {reservation.ville} {reservation.codePostal || ''}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-green-50/50 rounded-xl p-6">
                          <h3 className="text-xl font-bold text-primary-700 mb-4 flex items-center gap-2">
                            <span className="text-2xl">📅</span>
                            Détails de la réservation
                          </h3>
                          <div className="space-y-2 text-gray-700">
                            <p><strong className="text-primary-600">Date de début:</strong> {new Date(reservation.dateDebut).toLocaleDateString('fr-FR')}</p>
                            <p><strong className="text-primary-600">Date de fin:</strong> {new Date(reservation.dateFin).toLocaleDateString('fr-FR')}</p>
                            <p><strong className="text-primary-600">Durée:</strong> {jours} jour(s)</p>
                            <p className="pt-2 border-t border-green-200">
                              <strong className="text-primary-600">Prix total:</strong> 
                              <span className="text-2xl font-bold text-primary-600 ml-2">{reservation.prixTotal.toFixed(2)}€</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-6 border border-primary-100">
                        <h3 className="text-xl font-bold text-primary-700 mb-4 flex items-center gap-2">
                          <span className="text-2xl">📦</span>
                          Articles réservés
                        </h3>
                        <ul className="space-y-3">
                          {reservation.articles.map((item, index) => (
                            <li key={index} className="flex justify-between items-center py-2 border-b border-primary-50 last:border-0">
                              <span className="text-gray-700">
                                {item.articleNom} <span className="text-primary-600 font-semibold">(x{item.quantite || 1})</span> - {item.prix}€/jour
                              </span>
                              <span className="font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">
                                {(item.prix * jours * (item.quantite || 1)).toFixed(2)}€
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {selectedTab === 'articles' && (
          <div>
            <ArticlesManagement />
          </div>
        )}
      </main>
    </div>
  );
}

function ArticlesManagement() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    image: '',
  });

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    const { getArticles } = await import('@/lib/articles');
    const data = await getArticles();
    setArticles(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { createArticle, updateArticle } = await import('@/lib/articles');
      
      if (editingArticle) {
        await updateArticle(editingArticle.id, {
          nom: formData.nom,
          description: formData.description,
          prix: parseFloat(formData.prix),
          image: formData.image,
        });
      } else {
        await createArticle({
          nom: formData.nom,
          description: formData.description,
          prix: parseFloat(formData.prix),
          image: formData.image,
        });
      }
      
      setShowForm(false);
      setEditingArticle(null);
      setFormData({ nom: '', description: '', prix: '', image: '' });
      loadArticles();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (article: any) => {
    setEditingArticle(article);
    setFormData({
      nom: article.nom,
      description: article.description,
      prix: article.prix.toString(),
      image: article.image || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article?')) {
      return;
    }
    
    try {
      const { deleteArticle } = await import('@/lib/articles');
      await deleteArticle(id);
      loadArticles();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary-700">
          Gestion des articles
        </h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingArticle(null);
            setFormData({ nom: '', description: '', prix: '', image: '' });
          }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Ajouter un article
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-primary-100">
          <h3 className="text-2xl font-bold text-primary-700 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-400 rounded-full"></span>
            {editingArticle ? 'Modifier l\'article' : 'Nouvel article'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Nom *</label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                rows={4}
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Prix par jour (€) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.prix}
                onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">URL de l'image</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                placeholder="https://..."
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {editingArticle ? 'Modifier' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingArticle(null);
                  setFormData({ nom: '', description: '', prix: '', image: '' });
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-semibold transition-all duration-300 border border-gray-200"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-primary-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            {article.image && (
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={article.image}
                  alt={article.nom}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold text-primary-700 mb-2">
                {article.nom}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                {article.description}
              </p>
              <div className="flex items-center justify-between mb-4 pt-4 border-t border-primary-100">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                  {article.prix}€
                </span>
                <span className="text-sm text-gray-500">/jour</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(article)}
                  className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

