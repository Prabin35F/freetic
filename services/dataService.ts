
import { Book, Shelf } from '../types';
import { database, storage } from './firebase';
import { INITIAL_BOOKS } from '../constants';
import { ref, get, set, push, remove, update } from '@firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from '@firebase/storage';

const BOOKS_PATH = 'books';
const SHELVES_PATH = 'shelves';

// --- Books ---

export const getBooks = async (): Promise<Book[]> => {
  try {
    const booksRef = ref(database, BOOKS_PATH);
    const snapshot = await get(booksRef);
    if (snapshot.exists()) {
      const booksData = snapshot.val();
      // Firebase returns an object; convert it to an array
      return Object.keys(booksData).map(key => ({ ...booksData[key], id: key }));
    } else {
      // If no books in DB, populate with initial set and return them.
      console.log("No books found in database, seeding with initial data...");
      const initialData = INITIAL_BOOKS.reduce((acc, book) => {
        const { id, ...rest } = book;
        if (id) {
            acc[id] = rest;
        }
        return acc;
      }, {} as any);
      await set(ref(database, BOOKS_PATH), initialData);
      return INITIAL_BOOKS;
    }
  } catch (error) {
    console.error("Error fetching books from Firebase:", error);
    // Fallback to initial books in case of a DB connection error
    return INITIAL_BOOKS;
  }
};

export const addBookDB = async (bookData: Omit<Book, 'id'>): Promise<Book> => {
  const booksListRef = ref(database, BOOKS_PATH);
  const newBookRef = push(booksListRef);
  const newBook: Omit<Book, 'id'> = {
    ...bookData,
    createdAt: new Date().toISOString()
  };
  await set(newBookRef, newBook);
  return { ...newBook, id: newBookRef.key! };
};

export const updateBookDB = async (book: Book): Promise<void> => {
  const { id, ...bookData } = book;
  const bookRef = ref(database, `${BOOKS_PATH}/${id}`);
  await set(bookRef, bookData);
};

export const deleteBookDB = async (bookId: string): Promise<void> => {
  const bookRef = ref(database, `${BOOKS_PATH}/${bookId}`);
  await remove(bookRef);
};


// --- Shelves ---

export const getShelves = async (): Promise<Shelf[]> => {
  try {
    const shelvesRef = ref(database, SHELVES_PATH);
    const snapshot = await get(shelvesRef);
    if (snapshot.exists()) {
      const shelvesData = snapshot.val();
      return Object.keys(shelvesData).map(key => ({ ...shelvesData[key], id: key }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching shelves from Firebase:", error);
    return [];
  }
};

export const addShelfDB = async (shelfData: Omit<Shelf, 'id'>): Promise<Shelf> => {
  const shelvesListRef = ref(database, SHELVES_PATH);
  const newShelfRef = push(shelvesListRef);
  await set(newShelfRef, shelfData);
  return { ...shelfData, id: newShelfRef.key! };
};

// Use this for partial updates like renaming
export const updateShelfDB = async (shelfId: string, updates: Partial<Shelf>): Promise<void> => {
    const shelfRef = ref(database, `${SHELVES_PATH}/${shelfId}`);
    await update(shelfRef, updates);
};

// Use this to specifically update only the bookIds array
export const updateShelfBooksDB = async (shelfId: string, bookIds: string[]): Promise<void> => {
    const shelfBookIdsRef = ref(database, `${SHELVES_PATH}/${shelfId}/bookIds`);
    await set(shelfBookIdsRef, bookIds);
}

export const deleteShelfDB = async (shelfId: string): Promise<void> => {
  const shelfRef = ref(database, `${SHELVES_PATH}/${shelfId}`);
  await remove(shelfRef);
};

// --- File Upload ---

export const uploadAudioFile = async (file: File, bookId: string): Promise<string> => {
    if (!file) throw new Error("No file provided for upload.");
    const filePath = `podcasts/${bookId}/${file.name}`;
    const fileRef = storageRef(storage, filePath);
    
    try {
        const uploadTask = await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(uploadTask.ref);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading audio file to Firebase Storage:", error);
        throw error;
    }
};


// ==================================================================================
// FOR REAL-TIME UPDATES: In a production app, you would use `onValue` from Firebase 
// in your AppContext to listen for changes in 'books' and 'shelves'. This would 
// automatically update your React state whenever the database changes, providing a
// truly live experience without needing to manually refresh data.
// ==================================================================================