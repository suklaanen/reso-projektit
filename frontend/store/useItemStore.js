import { create } from "zustand";
import {
  addItemToFirestore,
  checkIfMyItem,
  deleteItemFromFirestore,
  fetchQueueCount,
  getCurrentUserItems,
  paginateItems,
} from "../services/firestoreItems";
import {
  addTakerToItem,
  deleteTakerFromItem,
  getUserPositionInQueue,
} from "../services/firestoreQueues";
import { collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../services/firebaseConfig";

const useItemStore = create((set, get) => ({
  items: [],
  lastDoc: null,
  loading: false,
  error: null,
  hasMore: true,

  userItems: [],
  userLastDoc: null,

  fetchItems: async (pageSize) => {
    set({ loading: true, error: null });
    try {
      const { items, lastDoc } = await paginateItems(get().lastDoc, pageSize);
      set((state) => ({
        items: [...state.items, ...items],
        lastDoc: lastDoc,
        hasMore: items.length === pageSize,
      }));
    } catch (error) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  fetchUserItems: async (userId, pageSize) => {
    set({ loading: true, error: null });
    try {
      const { items, lastDoc } = await getCurrentUserItems(
        userId,
        get().userLastDoc,
        pageSize
      );
      set((state) => ({
        userItems: [...state.userItems, ...items],
        userLastDoc: lastDoc,
        hasMore: items.length === pageSize,
      }));
    } catch (error) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  addUserToQueue: async (userId, itemId) => {
    try {
      await addTakerToItem(userId, itemId);
      const queueCount = await fetchQueueCount(itemId);
      const queuePosition = await getUserPositionInQueue(userId, itemId);
      return { queueCount, queuePosition };
    } catch (error) {
      throw error;
    }
  },

  removeUserFromQueue: async (userId, itemId) => {
    try {
      await deleteTakerFromItem(userId, itemId);
      return await fetchQueueCount(itemId);
    } catch (error) {
      throw error;
    }
  },

  checkItemOwnership: async (userId, itemId) => {
    return await checkIfMyItem(userId, itemId);
  },

  addItem: async (userId, itemname, itemdescription, postalcode, city) => {
    const id = await addItemToFirestore(
      userId,
      itemname,
      itemdescription,
      postalcode,
      city
    );
    const itemCollectionRef = collection(firestore, "items");
    const itemSnap = await getDoc(doc(itemCollectionRef, id));
    const item = {
      ...itemSnap.data(),
      id: itemSnap.id,
    };
    set((state) => ({
      items: [...state.items, item],
      userItems: [...state.userItems, item],
    }));
  },

  deleteUserItem: async (userId, itemId) => {
    return await deleteItemFromFirestore(userId, itemId);
  },
}));

export default useItemStore;
