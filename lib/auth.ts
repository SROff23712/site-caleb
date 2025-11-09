import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  User 
} from 'firebase/auth';
import { auth } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const ADMIN_EMAILS = ['sroff.developement@gmail.com'];

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Vérifier si l'utilisateur existe dans Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Créer le profil utilisateur
      const isAdmin = ADMIN_EMAILS.includes(user.email || '');
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isAdmin: isAdmin,
        createdAt: new Date().toISOString(),
      });
    }
    
    return user;
  } catch (error: any) {
    console.error('Erreur de connexion:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Erreur de déconnexion:', error);
    throw error;
  }
};

export const isAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false;
  
  if (ADMIN_EMAILS.includes(user.email || '')) {
    return true;
  }
  
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      return userDoc.data().isAdmin || false;
    }
  } catch (error) {
    console.error('Erreur lors de la vérification admin:', error);
  }
  
  return false;
};

