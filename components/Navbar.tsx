'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, userIsAdmin } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-primary-100 shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent hover:from-primary-700 hover:to-primary-600 transition-all">
            RABYMN LOCATION
          </Link>
          
          <div className="flex items-center gap-8">
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
                <span className="text-sm text-gray-600 hidden md:block">
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
        </div>
      </div>
    </nav>
  );
}

