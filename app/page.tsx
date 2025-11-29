'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { getArticles } from '@/lib/articles';
import { Article } from '@/lib/types';
import Link from 'next/link';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      const data = await getArticles();
      setArticles(data.filter(a => a.disponible));
      setLoading(false);
    };
    loadArticles();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-6">
            <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent mb-4">
              RABYMN LOCATION
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto rounded-full"></div>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 font-light">
            Location de matériel de mariage élégant
          </p>
          <Link
            href="/reservation"
            className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Réserver maintenant
          </Link>
        </div>

        {/* Catalogue Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-700 mb-3">
              Notre catalogue
            </h2>
            <p className="text-gray-500 text-lg">Découvrez notre sélection de matériel de mariage</p>
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
              <p className="text-gray-600 mt-4">Chargement...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-primary-100">
              <div className="text-6xl mb-4">💐</div>
              <p className="text-gray-600 text-lg">Aucun article disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <div
                  key={article.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-primary-50 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {article.image && (
                    <div className="relative h-64 w-full overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.nom}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary-700 mb-3">
                      {article.nom}
                    </h3>
                    <p className="text-gray-600 mb-5 line-clamp-3 text-sm leading-relaxed">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-primary-100">
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                        {article.prix}€
                      </span>
                      <span className="text-sm text-gray-500">/jour</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

