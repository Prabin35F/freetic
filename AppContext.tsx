import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { Book, AdConfiguration, Shelf, HistoryRecord } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { useToast } from './components/Toast';
import {
  getBooks,
  getShelves,
  addBookDB,
  updateBookDB,
  deleteBookDB,
  addShelfDB,
  updateShelfDB,
  deleteShelfDB,
  updateShelfBooksDB,
  uploadAudioFile,
} from './services/dataService';
import { getHistoryRecordsDB, addHistoryRecordDB, deleteHistoryRecordDB, clearHistoryDB } from './services/localDB';


interface AppContextType {
  // Books
  books: Book[];
  addBook: (book: Omit<Book, 'id' | 'createdAt'>, podcastFile?: File | null) => void;
  updateBook: (updatedBook: Book, podcastFile?: File | null) => void;
  deleteBook: (bookId: string) => void;
  
  // Admin
  isAdminAuthenticated: boolean;
  loginAdmin: () => void;
  logoutAdmin: () => void;
  
  // Ad Config
  adConfig: AdConfiguration;
  setAdConfig: (config: AdConfiguration) => void;

  // Global Search
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  // View Management
  activeView: string;
  setActiveView: (view: string) => void;

  // Shelves
  shelves: Shelf[];
  addShelf: (name: string) => void;
  renameShelf: (shelfId: string, newName: string) => void;
  deleteShelf: (shelfId: string) => void;
  addBookToShelf: (shelfId: string, bookId: string) => void;
  removeBookFromShelf: (shelfId: string, bookId: string) => void;
  createShelfAndAddBook: (shelfName: string, bookId: string) => void;

  // History
  history: HistoryRecord[];
  addHistoryRecord: (book: Book, mode: 'read' | 'audio') => void;
  deleteHistoryRecord: (id: number) => void;
  clearHistory: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

const defaultAdConfig: AdConfiguration = { 
  script: `<script type="text/javascript">
	atOptions = {
		'key' : '5fba81b02ad413b1d78938ba49e98894',
		'format' : 'iframe',
		'height' : 90,
		'width' : 728,
		'params' : {}
	};
<\/script>
<script type="text/javascript" src="//www.highperformanceformat.com/5fba81b02ad413b1d78938ba49e98894/invoke.js"><\/script>`, 
  isEnabled: true,
  placement: 'before_footer', 
  dimensions: '728x90', 
  adStartDate: undefined,
  adEndDate: undefined,
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useLocalStorage<boolean>('freetic-adminAuth', false);
  const [adConfigState, setAdConfigStateInternal] = useLocalStorage<AdConfiguration>('freetic-adConfig', defaultAdConfig);
  const [searchTerm, setSearchTermState] = useState('');
  const [activeView, setActiveView] = useState('home');

  const { addToast } = useToast();

  // Load data from service on initial app load
  useEffect(() => {
    const loadInitialData = async () => {
      // For a full real-time app, you'd use Firebase's onValue listener here.
      // This fetches the data once on load.
      try {
        const [initialBooks, initialShelves, initialHistory] = await Promise.all([
            getBooks(),
            getShelves(),
            getHistoryRecordsDB()
        ]);
        setBooks(initialBooks);
        setShelves(initialShelves);
        setHistory(initialHistory);
      } catch (error) {
        console.error("Failed to load initial data from the database:", error);
        addToast("Error: Could not connect to the database.", "error");
      }
    };
    loadInitialData();
  }, [addToast]);

  const setAdConfig = useCallback((newConfig: AdConfiguration) => {
    setAdConfigStateInternal(prev => ({...prev, ...newConfig}));
  }, [setAdConfigStateInternal]);

  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term);
  }, []);

  const addBook = useCallback(async (book: Omit<Book, 'id' | 'createdAt'>, podcastFile?: File | null) => {
    try {
      const newBookWithoutUrl = await addBookDB(book);
      let finalBook = newBookWithoutUrl;

      if (podcastFile && newBookWithoutUrl.id) {
        const downloadURL = await uploadAudioFile(podcastFile, newBookWithoutUrl.id);
        finalBook = { ...newBookWithoutUrl, podcastUrl: downloadURL };
        await updateBookDB(finalBook);
      }
      
      setBooks(prevBooks => [...prevBooks, finalBook]);
      addToast(`Book "${finalBook.title}" added successfully!`, 'success');
    } catch(e) {
      addToast("Failed to add book.", "error");
      console.error(e);
    }
  }, [addToast]);
  
  const updateBook = useCallback(async (updatedBook: Book, podcastFile?: File | null) => {
    try {
      let bookToSave = { ...updatedBook };
      if (podcastFile && updatedBook.id) {
          const downloadURL = await uploadAudioFile(podcastFile, updatedBook.id);
          bookToSave.podcastUrl = downloadURL;
      }
      
      await updateBookDB(bookToSave);
      setBooks(prevBooks => prevBooks.map(b => b.id === bookToSave.id ? bookToSave : b));
      addToast(`Book "${bookToSave.title}" updated successfully!`, 'success');
    } catch(e) {
      addToast("Failed to update book.", "error");
      console.error(e);
    }
  }, [addToast]);

  const deleteBook = useCallback(async (bookId: string) => {
    try {
      await deleteBookDB(bookId);
      setBooks(prevBooks => prevBooks.filter(b => b.id !== bookId));
      // Also remove book from any shelves it's on
      const updatedShelves = shelves.map(shelf => ({
          ...shelf,
          bookIds: shelf.bookIds.filter(id => id !== bookId),
      }));
      setShelves(updatedShelves);
      // Persist the change in shelves
      await Promise.all(updatedShelves.map(shelf => updateShelfBooksDB(shelf.id, shelf.bookIds)));
      addToast("Book deleted successfully.", "success");
    } catch(e) {
      addToast("Failed to delete book.", "error");
      console.error(e);
    }
  }, [shelves, addToast]);

  const loginAdmin = useCallback(() => {
    setIsAdminAuthenticated(true);
  }, [setIsAdminAuthenticated]);

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
    addToast("Logged out successfully.", "info");
  }, [setIsAdminAuthenticated, addToast]);
  
  const addShelf = useCallback(async (name: string) => {
    if (shelves.some(shelf => shelf.name.toLowerCase() === name.toLowerCase())) {
        addToast(`Shelf "${name}" already exists.`, 'error');
        return;
    }
    try {
        const newShelf = await addShelfDB({ name, bookIds: [] });
        setShelves(prev => [...prev, newShelf]);
        addToast(`Shelf "${name}" created!`, 'success');
    } catch(e) {
        addToast("Failed to create shelf.", "error");
        console.error(e);
    }
  }, [shelves, addToast]);

  const renameShelf = useCallback(async (shelfId: string, newName: string) => {
    try {
        await updateShelfDB(shelfId, { name: newName });
        setShelves(prev => prev.map(shelf => shelf.id === shelfId ? { ...shelf, name: newName } : shelf));
        addToast('Shelf renamed!', 'success');
    } catch(e) {
        addToast("Failed to rename shelf.", "error");
        console.error(e);
    }
  }, [addToast]);

  const deleteShelf = useCallback(async (shelfId: string) => {
    try {
        await deleteShelfDB(shelfId);
        setShelves(prev => prev.filter(shelf => shelf.id !== shelfId));
        addToast('Shelf deleted.', 'info');
    } catch(e) {
        addToast("Failed to delete shelf.", "error");
        console.error(e);
    }
  }, [addToast]);

  const addBookToShelf = useCallback(async (shelfId: string, bookId: string) => {
    const shelf = shelves.find(s => s.id === shelfId);
    if (!shelf) return;
    if (shelf.bookIds.includes(bookId)) {
        addToast('Book is already on this shelf.', 'info');
        return;
    }
    
    try {
        const newBookIds = [...shelf.bookIds, bookId];
        await updateShelfBooksDB(shelfId, newBookIds);
        setShelves(prev => prev.map(s => s.id === shelfId ? { ...s, bookIds: newBookIds } : s));
        addToast('Book added to shelf!', 'success');
    } catch(e) {
        addToast("Failed to add book to shelf.", "error");
        console.error(e);
    }
  }, [shelves, addToast]);
  
  const removeBookFromShelf = useCallback(async (shelfId: string, bookId: string) => {
    const shelf = shelves.find(s => s.id === shelfId);
    if (!shelf) return;
    
    try {
        const newBookIds = shelf.bookIds.filter(id => id !== bookId);
        await updateShelfBooksDB(shelfId, newBookIds);
        setShelves(prev => prev.map(s => s.id === shelfId ? { ...s, bookIds: newBookIds } : s));
        addToast('Book removed from shelf.', 'info');
    } catch(e) {
        addToast("Failed to remove book from shelf.", "error");
        console.error(e);
    }
  }, [shelves, addToast]);

  const createShelfAndAddBook = useCallback(async (shelfName: string, bookId: string) => {
    if (shelves.some(shelf => shelf.name.toLowerCase() === shelfName.toLowerCase())) {
        addToast(`Shelf "${shelfName}" already exists.`, 'error');
        return;
    }
    
    try {
        const newShelf = await addShelfDB({ name: shelfName, bookIds: [bookId] });
        setShelves(prev => [...prev, newShelf]);
        addToast(`Created shelf "${shelfName}" and added book!`, 'success');
    } catch(e) {
        addToast("Failed to create shelf.", "error");
        console.error(e);
    }
  }, [shelves, addToast]);

  const addHistoryRecord = useCallback(async (book: Book, mode: 'read' | 'audio') => {
    const newRecord: Omit<HistoryRecord, 'id'> = {
      bookId: book.id,
      bookTitle: book.title,
      openedAt: Date.now(),
      mode,
    };
    try {
      await addHistoryRecordDB(newRecord);
      const updatedHistory = await getHistoryRecordsDB();
      setHistory(updatedHistory);
    } catch (error) {
      console.error("Failed to add history record", error);
      addToast("Could not save to history.", "error");
    }
  }, [addToast]);

  const deleteHistoryRecord = useCallback(async (id: number) => {
    try {
      await deleteHistoryRecordDB(id);
      const updatedHistory = await getHistoryRecordsDB();
      setHistory(updatedHistory);
      addToast("History item removed.", "info");
    } catch (error) {
      console.error("Failed to delete history record", error);
      addToast("Could not remove from history.", "error");
    }
  }, [addToast]);

  const clearHistory = useCallback(async () => {
    try {
      await clearHistoryDB();
      setHistory([]);
      addToast("Reading history cleared.", "success");
    } catch (error) {
      console.error("Failed to clear history", error);
      addToast("Could not clear history.", "error");
    }
  }, [addToast]);

  const currentAdConfig = useMemo(() => ({
    ...defaultAdConfig,
    ...adConfigState
  }), [adConfigState]);

  return (
    <AppContext.Provider value={{
      books, addBook, updateBook, deleteBook,
      isAdminAuthenticated, loginAdmin, logoutAdmin,
      adConfig: currentAdConfig, setAdConfig,
      searchTerm, setSearchTerm,
      activeView, setActiveView,
      shelves, addShelf, renameShelf, deleteShelf, removeBookFromShelf, addBookToShelf, createShelfAndAddBook,
      history, addHistoryRecord, deleteHistoryRecord, clearHistory
    }}>
      {children}
    </AppContext.Provider>
  );
};