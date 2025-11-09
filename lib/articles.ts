import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import { Article } from './types';

export const getArticles = async (): Promise<Article[]> => {
  try {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Article));
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    return [];
  }
};

export const getArticle = async (id: string): Promise<Article | null> => {
  try {
    const docRef = doc(db, 'articles', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Article;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    return null;
  }
};

export const createArticle = async (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, 'articles'), {
      ...article,
      disponible: true,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error);
    throw error;
  }
};

export const updateArticle = async (id: string, article: Partial<Article>): Promise<void> => {
  try {
    const docRef = doc(db, 'articles', id);
    await updateDoc(docRef, {
      ...article,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error);
    throw error;
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'articles', id));
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error);
    throw error;
  }
};

export const uploadImage = async (file: File, folder = 'Nouveau dossier'): Promise<string> => {
  try {
    if (!storage) throw new Error('Firebase storage non initialisé');
    const filename = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${folder}/${filename}`);
    await uploadBytes(storageRef, file as any);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Erreur lors de l\'upload de l\'image:', error);
    throw error;
  }
};

