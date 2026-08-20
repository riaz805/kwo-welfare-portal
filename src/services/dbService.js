import { db } from '../config/firebase';
import { 
  collection, doc, getDocs, getDoc, setDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy 
} from 'firebase/firestore';

// Universal LocalStorage fallback when offline or Firebase credentials are not set
const getLocalData = (key) => JSON.parse(localStorage.getItem(`kwo_${key}`) || '[]');
const setLocalData = (key, data) => localStorage.setItem(`kwo_${key}`, JSON.stringify(data));

export const dbService = {
  async getAll(colName) {
    try {
      const querySnapshot = await getDocs(collection(db, colName));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.warn(`Firebase query failed for ${colName}, using LocalStorage mode.`, e);
      return getLocalData(colName);
    }
  },

  async add(colName, itemData) {
    const payload = { ...itemData, createdAt: new Date().toISOString() };
    try {
      const docRef = await addDoc(collection(db, colName), payload);
      return { id: docRef.id, ...payload };
    } catch (e) {
      const items = getLocalData(colName);
      const newItem = { id: 'local_' + Date.now(), ...payload };
      items.push(newItem);
      setLocalData(colName, items);
      return newItem;
    }
  },

  async update(colName, id, itemData) {
    const payload = { ...itemData, updatedAt: new Date().toISOString() };
    try {
      const docRef = doc(db, colName, id);
      await updateDoc(docRef, payload);
      return { id, ...payload };
    } catch (e) {
      const items = getLocalData(colName);
      const index = items.findIndex(i => i.id === id);
      if (index !== -1) {
        items[index] = { ...items[index], ...payload };
        setLocalData(colName, items);
      }
      return { id, ...payload };
    }
  },

  async setWithId(colName, id, itemData) {
    const payload = { ...itemData, updatedAt: new Date().toISOString() };
    try {
      await setDoc(doc(db, colName, id), payload);
      return { id, ...payload };
    } catch (e) {
      const items = getLocalData(colName);
      const index = items.findIndex(i => i.id === id);
      if (index !== -1) items[index] = { id, ...payload };
      else items.push({ id, ...payload });
      setLocalData(colName, items);
      return { id, ...payload };
    }
  },

  async logAudit(action, details, user = 'Super Admin') {
    const log = {
      action,
      details,
      user,
      timestamp: new Date().toISOString()
    };
    await this.add('auditLogs', log);
  }
};
