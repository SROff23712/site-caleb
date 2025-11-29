'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, userIsAdmin } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  // categories removed for simpler UI

  return (
    <nav className="bg-white border-b border-primary-100 shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent hover:from-primary-700 hover:to-primary-600 transition-all">
            RABYMN LOCATION
          </Link>

          {/* Desktop / tablet menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Accueil
            </Link>
            <Link href="/reservation" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Réservation
            </Link>

          

            {userIsAdmin && (
              <Link href="/admin" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                Admin
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen((s) => !s)}
              aria-expanded={mobileOpen}
              aria-label="Ouvrir le menu"
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileOpen && (
          <div className="md:hidden mt-3">
            <div className="flex flex-col gap-2 pb-4 border-b">
              <Link href="/" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                Accueil
              </Link>
              <Link href="/reservation" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                Réservation
              </Link>

              {/* categories removed for mobile */}

              {userIsAdmin && (
                <Link href="/admin" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                  Admin
                </Link>
              )}

              {user ? (
                <div className="px-3 py-2">
                  <div className="text-sm text-gray-600 mb-2">{user.displayName || user.email}</div>
                  <button
                    onClick={() => { setMobileOpen(false); handleSignOut(); }}
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2">
                  <button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                    Connexion
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

