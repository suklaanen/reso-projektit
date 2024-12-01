import { create } from "zustand";
import {
  addItemToFirestore,
  deleteItemFromFirestore,
  fetchQueueCount,
  paginateItems,
} from "../services/firestoreItems";
import {
  addTakerToItem,
  deleteTakerFromItem,
  getUserPositionInQueue,
} from "../services/firestoreQueues";
import { collection, doc, getDoc } from "firebase/firestore";
import { firestore } from "../services/firebaseConfig";

const useItemStore = create((set, get) => {
  const setLoading = (loading) => set({ loading });
  const setError = (error) => set({ error });
  const updatePaginatedState = (items, lastDoc, pageSize) => {
    set((state) => ({
      items: [...state.items, ...items],
      lastDoc,
      hasMore: items.length === pageSize,
    }));
  };
  return {
    items: [],
    loading: false,
    error: null,
    lastDoc: null,
    hasMore: true,

    fetchItems: async (pageSize) => {
      setLoading(true);
      setError(null);
      try {
        const { items, lastDoc } = await paginateItems(get().lastDoc, pageSize);
        const newItems = items.filter(
          (item) => !get().items.some((i) => i.id === item.id)
        );
        updatePaginatedState(newItems, lastDoc, pageSize);
      } catch (error) {
        setError(error);
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    },
    addUserToQueue: async (userId, itemId) => {
      try {
        await addTakerToItem(userId, itemId);
        const queueCount = await fetchQueueCount(itemId);
        const queuePosition = await getUserPositionInQueue(userId, itemId);
        return { queueCount, queuePosition };
      } catch (error) {
        console.error("Error adding user to queue:", error);
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

    addItem: async (userId, itemname, itemdescription, postalcode, city) => {
      try {
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

        const items = get().items.filter((i) => i.id !== item.id);
        set(() => ({
          items: [...items, item],
        }));
        return item;
      } catch (error) {
        console.error("Virhe lisättäessä tuotetta:", error);
        throw error;
      }
    },

    removeItem: async (userId, itemId) => {
      const items = get().items.filter((i) => i.id !== itemId);
      set(() => ({
        items,
      }));
      await deleteItemFromFirestore(userId, itemId);
    },
  };
});

export default useItemStore;
