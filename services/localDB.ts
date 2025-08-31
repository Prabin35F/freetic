import { HistoryRecord } from '../types';

const DB_NAME = 'FreeticDB';
const DB_VERSION = 1;
const STORE_NAME = 'history';
const MAX_HISTORY_ITEMS = 10;

let db: IDBDatabase;

// Function to initialize the database
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Error opening DB');
      reject('Error opening DB');
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('openedAt', 'openedAt', { unique: false });
      }
    };
  });
};

// Add a history record
export const addHistoryRecordDB = async (record: Omit<HistoryRecord, 'id'>): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  
  // Add new record
  store.add(record);

  // Enforce limit of MAX_HISTORY_ITEMS
  const countRequest = store.count();
  countRequest.onsuccess = () => {
      if(countRequest.result > MAX_HISTORY_ITEMS) {
          const cursorRequest = store.openCursor(null, 'next'); // open cursor to oldest record
          cursorRequest.onsuccess = (e) => {
              const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
              if (cursor) {
                  cursor.delete();
              }
          }
      }
  }

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

// Get all history records
export const getHistoryRecordsDB = async (): Promise<HistoryRecord[]> => {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.getAll();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      // Sort by timestamp descending to get most recent first
      resolve(request.result.sort((a, b) => b.openedAt - a.openedAt));
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Delete a single record by its ID
export const deleteHistoryRecordDB = async (id: number): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  store.delete(id);

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

// Clear all history records
export const clearHistoryDB = async (): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  store.clear();

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};
