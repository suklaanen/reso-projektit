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
import { collection, doc, getDoc } from "firebase/firestore";
import { firestore } from "../services/firebaseConfig";

const useItemStore = create((set, get) => {
  const setLoading = (loading) => set({ loading });
  const setError = (error) => set({ error });
  const updatePaginatedState = (key, newItems, lastDoc, pageSize) => {
    set((state) => ({
      [key]: {
        ...state[key],
        items: [...state[key].items, ...newItems],
        lastDoc,
        hasMore: newItems.length === pageSize,
      },
    }));
  };
  return ({
    loading: false,
    error: null,

    itemsState: {
      items: [],
      lastDoc: null,
      hasMore: true,
    },

    userItemsState: {
      items: [],
      lastDoc: null,
      hasMore: true,
    },

    fetchItems: async (pageSize) => {
      setLoading(true);
      setError(null);
      try {
        const {items, lastDoc} = await paginateItems(get().itemsState.lastDoc, pageSize);
        updatePaginatedState("itemsState", items, lastDoc, pageSize);
      } catch (error) {
        setError(error);
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    },

    fetchUserItems: async (userId, pageSize) => {
      setLoading(true);
      setError(null);
      try {
        const { items, lastDoc } = await getCurrentUserItems(
            userId,
            get().userItemsState.lastDoc,
            pageSize
        );
        updatePaginatedState("userItemsState", items, lastDoc, pageSize);
      } catch (error) {
        setError(error);
        console.error("Error fetching user items:", error);
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

    checkItemOwnership: async (userId, itemId) => {
      return await checkIfMyItem(userId, itemId);
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
        set((state) => ({
          itemsState: { ...state.itemsState, items: [...state.itemsState.items, item] },
          userItemsState: { ...state.userItemsState, items: [...state.userItemsState.items, item] },
        }));
      } catch (error) {
        console.error("Virhe lisättäessä tuotetta:", error);
        throw error;
      }
    },

    deleteUserItem: async (userId, itemId) => {
      try {
        return await deleteItemFromFirestore(userId, itemId);
      } catch (error) {
        console.error("Virhe poistettaessa itemiä Firestoresta:", error);
        throw error;
      }
    },
  });
});

export default useItemStore;
