'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/components/AuthProvider';
import { getArticles } from '@/lib/articles';
import { createReservation } from '@/lib/reservations';
import { Article, ReservationItem } from '@/lib/types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function ReservationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<Map<string, number>>(new Map());
  const [dateDebut, setDateDebut] = useState<Date | null>(null);
  const [dateFin, setDateFin] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [ville, setVille] = useState('');
  const [codePostal, setCodePostal] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    const loadArticles = async () => {
      const data = await getArticles();
      setArticles(data.filter(a => a.disponible));
    };
    loadArticles();
  }, [user, router]);

  const handleArticleToggle = (articleId: string) => {
    const newSelected = new Map(selectedArticles);
    if (newSelected.has(articleId)) {
      newSelected.delete(articleId);
    } else {
      newSelected.set(articleId, 1);
    }
    setSelectedArticles(newSelected);
  };

  const handleQuantityChange = (articleId: string, quantity: number) => {
    if (quantity <= 0) {
      const newSelected = new Map(selectedArticles);
      newSelected.delete(articleId);
      setSelectedArticles(newSelected);
    } else {
      const newSelected = new Map(selectedArticles);
      newSelected.set(articleId, quantity);
      setSelectedArticles(newSelected);
    }
  };

  const calculateTotal = () => {
    if (!dateDebut || !dateFin) return 0;
    const jours = Math.ceil((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    let total = 0;
    selectedArticles.forEach((quantity, articleId) => {
      const article = articles.find(a => a.id === articleId);
      if (article) {
        total += article.prix * jours * quantity;
      }
    });
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier que tous les champs obligatoires sont remplis
    if (!user || !dateDebut || !dateFin || selectedArticles.size === 0) {
      alert('Veuillez remplir tous les champs requis (dates et articles)');
      return;
    }

    // Vérifier que tous les champs obligatoires sont remplis (sauf entreprise)
    if (!telephone || !adresse || !ville || !codePostal) {
      alert('Veuillez remplir tous les champs obligatoires : téléphone, adresse, ville et code postal');
      return;
    }

    setLoading(true);
    try {
      const reservationItems: ReservationItem[] = Array.from(selectedArticles.entries()).map(([articleId, quantity]) => {
        const article = articles.find(a => a.id === articleId)!;
        return {
          articleId,
          articleNom: article.nom,
          prix: article.prix,
          quantite: quantity,
        };
      });

      const reservationId = await createReservation(
        user.uid,
        user.email || '',
        user.displayName || 'Utilisateur',
        reservationItems,
        dateDebut.toISOString(),
        dateFin.toISOString(),
        telephone,
        adresse,
        ville,
        codePostal
      );

      // Récupérer la réservation créée pour l'envoyer par email
      const { getReservation } = await import('@/lib/reservations');
      const { sendReservationEmail } = await import('@/lib/emailjs');
      const reservation = await getReservation(reservationId);
      
      if (reservation) {
        // Envoyer l'email via EmailJS (côté client)
        await sendReservationEmail(reservation);
      }

      alert('Réservation créée avec succès! Vous recevrez une confirmation par email.');
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      alert('Erreur lors de la création de la réservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-4">
            Nouvelle réservation
          </h1>
          <p className="text-gray-600 text-lg">Remplissez le formulaire pour faire votre demande</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-primary-100">
            <h2 className="text-2xl font-bold text-primary-700 mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-400 rounded-full"></span>
              Informations personnelles
            </h2>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Téléphone *</label>
              <input
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                placeholder="06 12 34 56 78"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Adresse *</label>
              <input
                type="text"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                placeholder="123 Rue de la République"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Ville *</label>
                <input
                  type="text"
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                  placeholder="Paris"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Code postal *</label>
                <input
                  type="text"
                  value={codePostal}
                  onChange={(e) => setCodePostal(e.target.value)}
                  className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                  placeholder="75001"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-primary-100">
            <h2 className="text-2xl font-bold text-primary-700 mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-400 rounded-full"></span>
              Dates de location
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Date de début *</label>
                <DatePicker
                  selected={dateDebut}
                  onChange={(date: Date | null) => setDateDebut(date)}
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Date de fin *</label>
                <DatePicker
                  selected={dateFin}
                  onChange={(date: Date | null) => setDateFin(date)}
                  minDate={dateDebut || new Date()}
                  dateFormat="dd/MM/yyyy"
                  className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-primary-100">
            <h2 className="text-2xl font-bold text-primary-700 mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-400 rounded-full"></span>
              Articles à louer
            </h2>
            <p className="text-gray-500 mb-6 text-sm">Sélectionnez les articles que vous souhaitez réserver</p>
            
            <div className="space-y-4">
              {articles.map((article) => {
                const isSelected = selectedArticles.has(article.id);
                const quantity = selectedArticles.get(article.id) || 1;
                
                return (
                  <div
                    key={article.id}
                    className={`border-2 rounded-xl p-5 transition-all duration-300 ${
                      isSelected 
                        ? 'border-primary-400 bg-gradient-to-br from-primary-50 to-white shadow-md' 
                        : 'border-primary-100 bg-white hover:border-primary-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-primary-700 mb-1">{article.nom}</h3>
                        <p className="text-gray-600 text-sm mb-2">{article.description}</p>
                        <p className="text-primary-600 font-semibold">
                          {article.prix}€<span className="text-sm text-gray-500">/jour</span>
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {isSelected && (
                          <div className="flex items-center gap-2 bg-white rounded-lg px-2 py-1 border border-primary-200">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(article.id, quantity - 1)}
                              className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors font-bold"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold text-primary-700">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(article.id, quantity + 1)}
                              className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors font-bold"
                            >
                              +
                            </button>
                          </div>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => handleArticleToggle(article.id)}
                          className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                            isSelected
                              ? 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg'
                              : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-md hover:shadow-lg'
                          }`}
                        >
                          {isSelected ? 'Retirer' : 'Ajouter'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-50 to-white rounded-2xl shadow-lg p-8 border border-primary-100">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-700">Total:</span>
              <span className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                {calculateTotal().toFixed(2)}€
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={
              loading || 
              !user ||
              selectedArticles.size === 0 || 
              !dateDebut || 
              !dateFin || 
              !telephone || 
              !adresse || 
              !ville || 
              !codePostal
            }
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                Envoi en cours...
              </span>
            ) : (
              'Envoyer la demande de réservation'
            )}
          </button>
        </form>
      </main>
    </div>
  );
}

