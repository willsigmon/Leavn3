import React from 'react';

    const DB_NAME = 'LeavnDB';
    const DB_VERSION = 1;
    const STORE_USER_DATA = 'userData';

    let dbPromise = null;

    const openDB = () => {
      if (dbPromise) return dbPromise;

      dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
          console.error("IndexedDB error:", event.target.error);
          reject("IndexedDB error: " + event.target.error);
        };

        request.onsuccess = (event) => {
          resolve(event.target.result);
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_USER_DATA)) {
            db.createObjectStore(STORE_USER_DATA, { keyPath: 'verseId' });
          }
        };
      });
      return dbPromise;
    };

    export const getUserData = async (verseId) => {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_USER_DATA, 'readonly');
        const store = transaction.objectStore(STORE_USER_DATA);
        const request = store.get(verseId);

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = (event) => {
          console.error("Error fetching data from IndexedDB:", event.target.error);
          reject("Error fetching data: " + event.target.error);
        };
      });
    };

    export const setUserData = async (data) => {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_USER_DATA, 'readwrite');
        const store = transaction.objectStore(STORE_USER_DATA);
        const request = store.put(data);

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = (event) => {
          console.error("Error saving data to IndexedDB:", event.target.error);
          reject("Error saving data: " + event.target.error);
        };
      });
    };

    export const deleteUserData = async (verseId) => {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_USER_DATA, 'readwrite');
        const store = transaction.objectStore(STORE_USER_DATA);
        const request = store.delete(verseId);

        request.onsuccess = () => {
          resolve(true);
        };

        request.onerror = (event) => {
          console.error("Error deleting data from IndexedDB:", event.target.error);
          reject("Error deleting data: " + event.target.error);
        };
      });
    };

    export const getAllUserData = async () => {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_USER_DATA, 'readonly');
        const store = transaction.objectStore(STORE_USER_DATA);
        const request = store.getAll();

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = (event) => {
          console.error("Error fetching all data from IndexedDB:", event.target.error);
          reject("Error fetching all data: " + event.target.error);
        };
      });
    };